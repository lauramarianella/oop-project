//Create the Entity, Wall, Grass, Gold, Dungeon and Tradesman class

class Entity{/**Example use: not used by itself.  */
    constructor(src){/**- constructor
        - parameters: src (string)
        - Creates an img element and sets the src.
        - Sets the element property to the created img element.
      - element (HTMLElement): HTML element for the entity (img element) */
        this.element = document.createElement('img');
        this.element.src = src;
        this.element.style.position = 'fixed';        
    }

    setImg(src) {/**- setImg (function)
        - parameters: src (string)
        - Updates the src of the element property */
        this.src = src;
    }
}

class Wall extends Entity{/*
Wall class definition. A Wall is an Entity
- constructor
  - parameters: none
  - Creates a wall entity with the 'wall' img
Example use:
new Wall()
*/
    constructor(){
        let src = 'imgs/environment/wall.png';
        super(src);
    }
}


class Grass extends Entity{/*
    Grass class definition. Grass is an Entity
    - constructor
      - parameters: none
      - Creates a grass entity with a random grass image
    Example use:
    new Grass()
    */
   constructor(){
       super('');
       this.element.src =  this.getSrcRandomGrass(1,MAX_GRASS);
   }

   getSrcRandomGrass(min, max){
        let randomImage = Math.floor( (Math.random() * max-min +1) + min);
        return `imgs/environment/grass${randomImage}.png`;
   }
}

class Gold extends Entity{
    /*
    Gold class definition. Gold is an Entity
    - constructor
      - parameters: value (number)
      - Creates a gold entity with the 'gold' image and sets the gold value
    - value (number): gold value
    Example use:
    new Gold()
    */
    constructor(value){
        let src = "imgs/gold.gif";
        super(src);
        this.value = value;
    }

}

class Dungeon extends Entity{/*
    Dungeon class definition. Gold is an Entity
    - constructor
      - parameters: isOpen (boolean), hasPrincess (boolean), gold (number), items (Item[])
      - Creates a dungeon entity with the 'open' or 'closed' image depending on isOpen.
    - isOpen (boolean)
    - hasPrincess (boolean)
    - gold (number)
    - items (Item[])
    - open (function)
      - parameters: none
      - Sets isOpen to true and sets the entity image to 'open'
    Example use:
    new Dungeon(true, false, 30, [new Potion(2), new Bomb(2)]);
    */
    constructor(isOpen = false, hasPrincess = false, gold = 0, items = []){
        let src = (isOpen) ? 'imgs/dungeon/open.png': 'imgs/dungeon/closed.png';//ask the other options loot...
        super(src);

        this.isOpen = isOpen;
        this.hasPrincess =  hasPrincess;
        this.gold = gold;
        this.items = items;
    }

}

class Tradesman extends Entity{/*
    Tradesman class definition. A Tradesman is an Entity
    - constructor
      - parameters: items (Item[])
      - Creates a tradesman with items and the tradesman image
    - items (Item[])
    Example use:
    new Tradesman([new Potion(0), new Bomb(0), new Key()]);
    */
    
    constructor(items){        
        let src = 'imgs/tradesman.gif';
        super(src);
        this.items = items;
    }

}