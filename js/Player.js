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

constructor(name, position, board, level, items, gold){
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
}
update() {/*- update (function)
  - parameters: none
  - Updates the player's HTML element position based on its position property and ENTITY_SIZE*/

}
/*- moveToPosition (Position)
  - moves to position specified unless it is a Wall entity.
  - updates player (update method)
- move (function)
  - parameters: direction (string)
  - Sets the player image based on direction and moves to new position
- pickup (function)
  - parameters: entity (Item || Gold)
  - Adds item or gold and plays the corresponding sound ('loot' or 'gold' respectively)
- attack (function)
  - parameters: (entity)
  - calls the attack method from Creature (use super) and plays the 'pattack' sound if the attack was successful
- buy (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- sell (function)
  - parameters: item (Item), tradesman (Tradesman)
  - updates gold and items for both player and tradesman.
  - Plays the trade sound
  - returns true if successful trade, false if gold is insufficient
- useItem (function)
  - parameters: item (Item), target (Creature)
  - uses the item on the target and removes it from the player
- loot (function)
  - parameters: entity (Monster || Dungeon)
  - Updates gold and items for both player and dungeon or monster.
  - plays the loot sound
- getExpToLevel (function)
  - parameters: none
  - returns exp needed to level: level * 10
- getExp (function)
  - parameters: entity (Monster)
  - adds exp based on entity level (level * 10)
  - level up if enough exp. It is possible to level up multiple times at once if enough exp is earned (e.g. beat enemy level 3)
- levelUp (function)
  - parameters: entity (Monster)
  - Increments level, sets hp to max hp
  - updates strength (level * 10) and attack speed (3000 / level)
  - plays levelup sound

*/

    
}