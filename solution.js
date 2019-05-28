const monsterNames = [
  'Bigfoot',
  'Centaur',
  'Cerberus',
  'Chimera',
  'Ghost',
  'Goblin',
  'Golem',
  'Manticore',
  'Medusa',
  'Minotaur',
  'Ogre',
  'Vampire',
  'Wendigo',
  'Werewolf',
];

const GAME_STEPS = ['SETUP_PLAYER', 'SETUP_BOARD', 'GAME_START'];
let gameStep = 0;
let board = [];
let player = {};

function usePotion(target, val) {
  target.hp = Math.min(target.hp + val, target.getMaxHp());
  print(`Used potion! +${val}hp (Total HP: ${target.hp})`, 'green');
}

function useBomb(target, val) {
  print('Used bomb!', 'orange');
  hit(target, val);
}

function useKey(target) {
  target.isLocked = false;
  print('Unlocking dungeon...', 'brown');
  openDungeon(target);
}

const RARITY_LIST = ['Common', 'Unusual', 'Rare', 'Epic'];
const items = [
  { name: RARITY_LIST[0] + ' potion', type: 'item', value: 5, rarity: 0, use: (target) => usePotion(target, 25) },
  { name: RARITY_LIST[1] + ' potion', type: 'item', value: 10, rarity: 1, use: (target) => usePotion(target, 70) },
  { name: RARITY_LIST[2] + ' potion', type: 'item', value: 20, rarity: 2, use: (target) => usePotion(target, 200) },
  { name: RARITY_LIST[3] + ' potion', type: 'item', value: 50, rarity: 3, use: (target) => usePotion(target, target.getMaxHp()) },
  { name: RARITY_LIST[0] + ' bomb', type: 'item', value: 7, rarity: 0, use: (target) => useBomb(target, 50) },
  { name: RARITY_LIST[1] + ' bomb', type: 'item', value: 12, rarity: 1, use: (target) => useBomb(target, 120) },
  { name: RARITY_LIST[2] + ' bomb', type: 'item', value: 25, rarity: 2, use: (target) => useBomb(target, 300) },
  { name: RARITY_LIST[3] + ' bomb', type: 'item', value: 100, rarity: 3, use: (target) => useBomb(target, target.hp * 0.9) },
  { name: RARITY_LIST[3] + ' key', type: 'item', value: 150, rarity: 3, use: (target) => useKey(target) },
];

function startCooldown(skill) {
  const cooldownId = setInterval(() => {
    skill.cooldown -= 100;
    if (skill.cooldown === 0) clearInterval(cooldownId);
  }, 100);
}
const skills = [
  {
    name: 'steal',
    requiredLevel: 3,
    cooldown: 0,
    use: function(target) {
      if (!target.items || target.items.length === 0) {
        print('Nothing to steal');
      } else if (!target.items.some((item) => item.rarity <= 1)) {
        print('Cannot steal items');
      } else {
        const stolenItems = target.items.filter((item) => item.rarity <= 1);
        target.items = target.items.filter((item) => item.rarity > 1);
        player.items = player.items.concat(stolenItems);
        print('Successfully stole items:');
        print(stolenItems);
        this.cooldown = 25000;
        startCooldown(this);
      }
    },
  },
  {
    name: 'confuse',
    requiredLevel: 1,
    cooldown: 0,
    use: function(target) {
      print(`Confusing ${target.name}...`);
      target.name = target.name
        .split('')
        .reverse()
        .join('');
      print(`${target.name}, target is confused and hurts itself in the process`, 'red');
      hit(target, player.level * 25);
      this.cooldown = 10000;
      startCooldown(this);
    },
  },
];

function print(arg, color) {
  if (typeof arg === 'object') console.log(arg);
  else console.log('%c' + arg, `color: ${color};`);
}

function printSectionTitle(title, count = 20) {
  if (count <= 0) return title;
  let str = '';
  for (let i = 0; i < count * 2; i++) {
    str += '-';
    if (i === count - 1) {
      str += title;
    }
  }
  print(str, 'blue');
}

function clone(entity) {
  return Object.keys(entity).reduce((acc, key) => {
    acc[key] = entity[key];
    return acc;
  }, {});
}

function assertEqual(obj1, obj2) {
  return Object.keys(obj1).every((key) => obj2[key] !== undefined);
}

function cloneArray(objs) {
  return objs.map((obj) => clone(obj));
}

function remove(arr, elm) {
  arr.splice(arr.indexOf(elm), 1);
}

function useItem(itemName, target) {
  const item = player.items.find((item) => item.name === itemName);
  if (!item) {
    print('No such item to use');
  } else {
    if (target) item.use(target);
    else if (item.name.includes('potion')) item.use(player);
    else item.use(getCurrentEntity());
    remove(player.items, item);
  }
}

function useSkill(skillName, target = getCurrentEntity()) {
  const skill = player.skills.find((skill) => skill.name === skillName);
  if (!skill) {
    print('No such skill to use');
  } else if (player.level < skill.requiredLevel) {
    print('Your level is too low. Required level: ' + skill.requiredLevel);
  } else if (skill.cooldown > 0) {
    print(`Skill in cooldown. ${skill.cooldown}ms remaining.`);
  } else if (!target.hp) {
    print('Invalid target');
  } else {
    skill.use(target);
  }
}

function placePlayer() {
  const newPos = {
    row: Math.floor(board.length / 2),
    column: Math.floor(board[0].length / 2),
  };
  player.position = newPos; // Player does not have a position yet, initialize it
  updatePlayerPosition(newPos);
}

function updateBoard(entity) {
  board[entity.position.row][entity.position.column] = { entity };
}

function updatePlayerPosition(newPos) {
  board[player.position.row][player.position.column] = { entity: getCell(player.position).entity }; // Clear the player at current position
  board[newPos.row][newPos.column] = { entity: getCell(newPos).entity, player }; // Add player to the board at new position
  player.position = newPos; // Update player position to the new position
}

function getCell(position) {
  return board[position.row][position.column];
}

function getCurrentEntity() {
  return getCell(player.position).entity;
}

function clearCurrentEntity() {
  getCell(player.position).entity = {
    type: 'grass',
    position: { row: player.position.row, column: player.position.column },
  };
}

function initBoard(rows, columns) {
  print('Creating board and placing player...');
  createBoard(rows, columns);
  placePlayer();
}

function getSymbol(type) {
  if (type === 'wall') return '#';
  if (type === 'grass') return '.';
  return type.charAt(0).toUpperCase();
}

function printBoard() {
  for (let i = 0; i < board.length; i++) {
    let row = '';
    for (let j = 0; j < board[i].length; j++) {
      row += board[i][j].player ? 'P' : getSymbol(board[i][j].entity.type);
    }
    print(row);
  }
}

function createBoard(rows, columns) {
  board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
        row.push({ entity: { type: 'wall', position: { row: i, column: j } } });
      } else row.push({ entity: { type: 'grass', position: { row: i, column: j } } });
    }
    board.push(row);
  }
}

function createPlayer(name, level = 1, items = []) {
  print(`Create player with name ${name} and level ${level}`);
  player = {
    name,
    level,
    items: cloneArray(items),
    skills,
    attack: level * 10,
    speed: 3000 / level,
    hp: 100,
    gold: 0,
    exp: 0,
    type: 'player',
    getMaxHp: function() {
      return this.level * 100;
    },
    getExpToLevel: function() {
      return this.level * 20;
    },
    levelUp: function() {
      this.level++;
      this.hp = this.getMaxHp();
      this.speed = 3000 / this.level;
      this.attack = this.level * 10;
      print(`Congratulations! You leveled up to level ${this.level}.`);
    },
  };
}

function getRandom(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function createMonster(level, items, position) {
  print('Creating monster...');
  return {
    name: monsterNames[getRandom(0, monsterNames.length)],
    level,
    hp: level * 100,
    items: cloneArray(items),
    speed: 6000 / level,
    attack: level * 10,
    position,
    type: 'monster',
    getMaxHp: function() {
      return this.level * 100;
    },
    getExp: function() {
      return this.level * 10;
    },
  };
}

function hit(target, val) {
  target.hp = Math.max(target.hp - val, 0); // Can't have less than 0 hp
  print(`${target.name} hit! -${val}hp`, target.type === 'player' ? 'red' : 'purple');
  print(`HP left: ${target.hp}`, target.type === 'player' ? 'red' : 'purple');
  if (target.hp <= 0) {
    endBattle();
    print(target.name + ' defeated.');
    if (target.type === 'player') gameOver();
    else {
      const exp = player.exp + target.getExp();
      if (exp >= player.getExpToLevel()) {
        player.exp = player.getExpToLevel() - exp; // e.g. level 1, 100exp to level up, current exp is 120 -> level 2, 20 exp left
        player.levelUp();
      } else {
        player.exp = exp;
        print(`Congratulations! You have received ${target.getExp()} exp points.`);
      }
      if (target.items.length > 0) {
        player.items = player.items.concat(target.items);
        print('You received the following items:');
        print(target.items);
        if (target.items.some((item) => item.name.includes('key'))) {
          print('You got the key! You can go to the dungeon and free the princess :)');
        }
      }
    }
    clearCurrentEntity();
  }
}

let playerAttack, enemyAttack;
function startBattle(enemy) {
  print(`Encountered a ${enemy.name}!`);
  playerAttack = setInterval(() => hit(enemy, player.attack), player.speed);
  enemyAttack = setInterval(() => hit(player, enemy.attack), enemy.speed);
}

function endBattle() {
  clearInterval(playerAttack);
  clearInterval(enemyAttack);
  playerAttack = enemyAttack = undefined;
}

function createTradesman(items, position) {
  print('Creating tradesman...');
  return {
    name: 'Mysterious trader',
    hp: Infinity,
    items: cloneArray(items),
    position,
    type: 'tradesman',
    getMaxHp: () => Infinity,
  };
}

function buy(itemIdx) {
  if (getCurrentEntity().type !== 'tradesman') {
    print("Can't buy without a tradesman!");
    return;
  }
  const item = getCurrentEntity().items[itemIdx];
  if (!item) {
    print('No such item');
  } else if (player.gold >= item.value) {
    player.gold -= item.value;
    player.items.push(item);
    remove(getCurrentEntity().items, item);
    print(`Purchased ${item.name}`);
    print(`Gold: ${player.gold}`);
  } else {
    print(`Not enough gold :( Required: ${item.value}, gold: ${player.gold}`);
  }
}

function sell(itemIdx) {
  if (getCurrentEntity().type !== 'tradesman') {
    print("Can't sell without a tradesman!");
    return;
  }
  const item = player.items[itemIdx];
  if (!item) {
    print('No such item');
  } else {
    player.gold += item.value;
    getCurrentEntity().items.push(item);
    remove(player.items, item);
    print(`Sold ${item.name}`);
    print(`Gold: ${player.gold}`);
  }
}

function startTrade(tradesman) {
  print(`Encountered ${tradesman.name}! You can buy(itemIdx) and sell(itemIdx) items $$$`);
  print('Items for sale:');
  print(tradesman.items);
}

function createItem(item, position) {
  print('Creating item...');
  const itemEntity = clone(item);
  itemEntity.position = position;
  return itemEntity;
}

function pickupItem(item) {
  player.items.push(item);
  print(`Found item! ${item.name}`);
  clearCurrentEntity();
}

function createDungeon(position, isLocked = true, hasPrincess = true, items = [], gold = 0) {
  print('Creating dungeon...');
  return {
    isLocked,
    hasPrincess,
    items: cloneArray(items),
    gold,
    position,
    type: 'dungeon',
  };
}

function openDungeon(dungeon) {
  print('The dungeon is unlocked!');
  if (dungeon.hasPrincess) {
    print('You have freed the princess! Congratulations!');
    print(`The adventurer ${player.name} and the princess lived happily ever after...`);
    gameOver();
  } else {
    print('Unfortunately, there was no princess.');
    print(`As consolation, you found ${dungeon.items.length} items and ${dungeon.gold} gold.`);
    print(dungeon.items);
    player.items = player.items.concat(dungeon.items);
    player.gold += dungeon.gold;
    dungeon.items = [];
    dungeon.gold = 0;
    print(`You now have ${player.gold} gold.`);
  }
}

function encounterDungeon(dungeon) {
  print('Found the dungeon!');
  if (dungeon.isLocked) {
    print("You need the key to open it. If you have the key, try useItem('key') to unlock the door.");
    print("Rumours are some monsters have keys to dungeons. The tradesman might also have spare keys to sell but they don't come cheap");
  } else {
    openDungeon(dungeon);
  }
}

function moveToPos(newPos) {
  const entity = getCell(newPos).entity;
  if (entity.type === 'wall') {
    print('Bumped into a wall');
  } else {
    updatePlayerPosition(newPos);
    if (entity.type === 'monster') startBattle(entity);
    if (entity.type === 'item') pickupItem(entity);
    if (entity.type === 'tradesman') startTrade(entity);
    if (entity.type === 'dungeon') encounterDungeon(entity);
  }
}

function move(direction) {
  if (playerAttack) endBattle();
  switch (direction) {
    case 'U': {
      moveToPos({ row: player.position.row - 1, column: player.position.column });
      break;
    }
    case 'D': {
      moveToPos({ row: player.position.row + 1, column: player.position.column });
      break;
    }
    case 'L':
      moveToPos({ row: player.position.row, column: player.position.column - 1 });
      break;
    case 'R':
      moveToPos({ row: player.position.row, column: player.position.column + 1 });
      break;
  }
  printBoard();
}

function setupPlayer() {
  printSectionTitle('SETUP PLAYER');
  print("Please create a player using the createPlayer function. Usage: createPlayer('Bob')");
  print(
    "You can optionally pass in a level and items, e.g. createPlayer('Bob', 3, [items[0], items[2]]). items[0] refers to the first item in the items variable"
  );
  print("Once you're done, go to the next step with next()");
  createPlayer('Van', 1, [items[4]]);
  next();
}

function setupBoard() {
  printSectionTitle('SETUP BOARD');
  print('Please create a board using initBoard(rows, columns)');
  print(
    'Setup monsters, items and more using createMonster(attr), createItem(item, pos), createTradesman(items, pos), createDungeon(pos), updateBoard(entity)'
  );
  print("Once you're done, go to the next step with next()");
  initBoard(7, 15);
  updateBoard(createMonster(1, [items[0], items[8]], { row: 4, column: 9 }));
  updateBoard(createMonster(1, [items[1], items[4]], { row: 1, column: 11 }));
  updateBoard(createMonster(3, [items[1], items[4]], { row: 1, column: 2 }));
  updateBoard(createItem(items[0], { row: 5, column: 2 }));
  updateBoard(createTradesman(items, { row: 1, column: 8 }));
  updateBoard(createDungeon({ row: 3, column: 3 }));
  updateBoard(createDungeon({ row: 2, column: 4 }, false, false, [items[0], items[1]], 40));
  next();
}

function startGame() {
  printSectionTitle('START GAME');
  print('Hello ' + player.name);
  print("You are ready to start your adventure. Use move('U' | 'D' | 'L' | 'R') to get going.");
  printBoard();
}

function gameOver() {
  printSectionTitle('GAME OVER');
}

function next() {
  gameStep++;
  run();
}

function run() {
  switch (GAME_STEPS[gameStep]) {
    case 'SETUP_PLAYER':
      setupPlayer();
      break;
    case 'SETUP_BOARD':
      setupBoard();
      break;
    case 'GAME_START':
      startGame();
      break;
  }
}

print('Welcome to the game!', 'gold');
print('Follow the instructions to setup your game and start playing');

run();
