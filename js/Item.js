//Create the Item, Potion, Bomb and Key class

class Item extends Entity{/*
Item class definition. Item is an Entity
- constructor
  - parameters: value (number), rarity (number), type (string)
  - Creates an item with the correct image (depends on type).
  - Sets the name based on the rarity (with ITEM_RARITIES) and the type.
- name (string)
- value (number)
- rarity (number)
- sound (Audio object - type is used for the sound file path)
Example use: not used by itself. 
*/
    constructor(value , rarity , type){
        let src = `imgs/items/${type.toLowerCase()}.png`;
    
        super(src);
        this.value =value;
        this.rarity = rarity;
        this.type = type;                
    }
}

class Potion extends Item{/*
Potion class definition. Potion is an Item
- constructor
  - parameters: rarity (number)
  - Creates a potion with type 'potion' and a value based on rarity: (rarity + 1) * 10
- potency (number): (rarity + 1) * 10

Example use:
new Potion(0) // potion rarity 0
*/
    constructor(rarity){
        super((rarity + 1) * 10,rarity,'potion');
        this.sound = new Audio('sounds/potion.mp3');
    }

    
    use(target){/**- use (function)
        - parameters: target (Creature)
        - Restores hp of target by potency value. HP of target can't go past its max HP.
        - Plays the item sound */
        target.hp += this.value;
        target.hp = Math.min(target.maxHp,target.hp);
        this.sound.play();
    }
}


class Bomb extends Item{/*
    Bomb class definition. Bomb is an Item
- constructor
  - parameters: rarity (number)
  - Creates a bomb with type 'bomb' and a value based on rarity: (rarity + 1) * 20
- damage (number): (rarity + 1) * 30

Example use:
new Bomb(0) // bomb rarity 0
*/
    constructor(rarity){
        super((rarity + 1) * 20 , rarity , 'bomb');
        this.sound = new Audio('sounds/bomb.mp3');        
    }

    use(target) {/** - use (function)
        - parameters: target (Creature)
        - Damages hp of target by damage value. HP of target can't be lower than 0.
        - Plays the item sound*/
        target.hp -= this.value;
        target.hp = Math.max(0,target.hp);
        this.sound.play();
    }
}

class Key extends Item { /*
Key class definition. Key is an Item
- constructor
  - parameters: none
  - Creates a key with value 100, rarity 3 and type 'key'

Example use:
new Key(0) // bomb rarity 0
*/
    constructor(){
        super(100,3,'key');
        this.sound = new Audio('sounds/key.mp3');   
    }

    use(target){/**- use (function)
        - parameters: target (Dungeon)
        - opens the dungeon and plays the item sound if the dungeon does not have the princess */
        this.sound.play();
    }

}