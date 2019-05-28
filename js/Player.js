//Create the Player class

class Player extends Creature {/*
Player class definition. Player is a Creature
- constructor
  - parameters: name (string), position (Position), board (Board), level (number), items (Item[]), gold (number)
  - Sets the attackSpeed to 2000 / level
  - Sets the exp to 0
  - Sets the position and board

  - attackSpeed (number)
  - exp (number)
  - position (Position)
  - board (Board)
*/
/**Example use:
new Player('Van', new Position(5, 5), new Board(10, 10), 1, [new Potion(0)]); */

constructor(name, position, board, level, items, gold=0){
    let img = 'imgs/player/front.png';
    super(name, img, level, items, gold);
    
    this.attackSpeed = 2000 / level;
    this.exp = 0;
    this.position = position;
    this.board = board;
}

render(root) {/* - render (function)
    - parameters: root (HTMLElement)
    - Appends the element to the root (the board HTML element)
    - Updates the player position
    */ 
    root.appendChild(this.element);
    this.element.style.top = `${(ENTITY_SIZE * this.position.column)}px`;
    this.element.style.left = `${(ENTITY_SIZE * this.position.row)}px`; 
    this.element.style.zIndex = '100';
    this.element.style.position = 'fixed'; //only the player's position is absolute
    this.update();
}
update() {/*- update (function)
  - parameters: none
  - Updates the player's HTML element position based on its position property and ENTITY_SIZE*/
    this.element.style.top = `${(ENTITY_SIZE * this.position.column)}px`;
    this.element.style.left = `${(ENTITY_SIZE * this.position.row)}px`;     
}

moveToPosition(position) {/**- moveToPosition (Position)
  - moves to position specified unless it is a Wall entity.
  - updates player (update method)*/
  if (board.isAWall(position)) return;

  board.popPlayer(this.position);
  board.setEntity(this, position); 
  this.update();
}
move(direction) {/** - move (function)
  - parameters: direction (string)
  - Sets the player image based on direction and moves to new position*/
  let positionNew = new Position(this.position.row, this.position.column);
  switch (direction){
    case 'l':
        this.element.src = 'imgs/player/left.png';        
        positionNew.row=positionNew.row-1;
        this.moveToPosition(positionNew);        
        break;
    case 'r':
        this.element.src = 'imgs/player/right.png';
        positionNew.row=positionNew.row+1;
        this.moveToPosition(positionNew);
        break;
    case 'u':
        this.element.src = 'imgs/player/back.png';
        positionNew.column=positionNew.column-1;
        this.moveToPosition(positionNew);
        break;
    case 'd':
        this.element.src = 'imgs/player/front.png';
        positionNew.column=positionNew.column+1;
        this.moveToPosition(positionNew);
        break;
    default:
      break;
  }
}


pickup(entity) {/**- pickup (function)
  - parameters: entity (Item || Gold)
  - Adds item or gold and plays the corresponding sound ('loot' or 'gold' respectively)
  */
  if(entity instanceof Item)  {
    this.items = this.items.concat(entity);
    playSound('loot');
  }else if(entity instanceof Gold) {
    this.gold += gold.value;
    playSound('gold');
  }
}
 attack(entity) {/** - attack (function)
  - parameters: (entity)
  - calls the attack method from Creature (use super) and plays the 'pattack' sound if the attack was successful
  */
  if(super.attack(entity)) playSound('pattack');
 }
 buy(item, tradesman){/**
- buy (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient*/
  if(this.gold >= item.value) {
    tradesman.gold += item.value;
    this.gold -= item.value;
    this.items = this.items.concat(item);
    remove(tradesman.items, item);
    return true;
  }
  return false;
 }

 sell(item, tradesman){/**- sell (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient*/
  this.gold += item.value;
  tradesman.items = tradesman.items.concat(item);
  remove(this.items, item);
  return true;
}

useItem(item, target) {/** - useItem (function)
  - parameters: item (Item), target (Creature)
  - uses the item on the target and removes it from the player*/
  item.use(target);
  remove(this.items,item);
} 
loot(entity) {/*- loot (function)
  - parameters: entity (Monster || Dungeon)
  - Updates gold and items for both player and dungeon or monster.
  - plays the loot sound*/
  this.gold += entity.gold;
  entity.gold = 0;
  this.items = this.items.concat(entity.items);
  entity.items = [];
  playSound('loot');
}

getExpToLevel(){/**
- getExpToLevel (function)
  - parameters: none
  - returns exp needed to level: level * 10
  */
  return this.level*10;
}

getExp(entity) {/** - getExp (function)
  - parameters: entity (Monster)
  - adds exp based on entity level (level * 10)
  - level up if enough exp. It is possible to level up multiple times at once if enough exp is earned (e.g. beat enemy level 3)
*/
  this.exp += entity.level * 10;
  if(this.exp >= this.getExpToLevel()) {
    this.levelUp(entity);
  }
}

levelUp(entity){/**- levelUp (function)
  - parameters: entity (Monster)
  - Increments level, sets hp to max hp
  - updates strength (level * 10) and attack speed (3000 / level)
  - plays levelup sound*/
  this.level = Math.max(this.level+1,entity.level);
  this.hp = this.getMaxHp();
  this.strength = this.level *10;
  this.attackSpeed = 3000/this.level;
  playSound('levelup');
}

}