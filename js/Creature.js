//Create the Creature and Monster class

class Creature extends Entity{
/*
The Creature class is an Entity. It has the following properties (not including inherited properties):
- constructor
  - parameters: name (string), img (string), level (number), items (Item[]), gold (number)
- name (string)
- img (string - path to image)
- level (number)
- items (array of Item objects)
- gold (number)

- hp (number): level * 100
- strength (number): level * 10
- attackSpeed (number): 3000 / level

Example use: not used by itself. 
*/

    constructor(name, img, level, items, gold){        
        super(img);
        this.name = name;
        this.img = img;
        this.level = level;
        this.items = items;
        this.gold = gold;

        this.hp = level * 100;
        this.strength = level * 10;
        this.attackSpeed = 3000 / level;
    }

    getMaxHp() {/**- getMaxHp (function)
        - parameters: none
        - returns max hp (level * 100) */
        return (this.level * 100);
    }

    hit(val) {/**- hit (function)
        - parameters: val (number)
        - decreases hp by val. Hp cannot go under 0 */
        this.hp -= val;
        this.hp = Math.max(0,this.hp);
    }
    attack(entity) {/**- attack (function)
        - parameters: entity (Creature)
        - hits the entity with strength value
        - sets an attack timeout that expires after attackSpeed. While the timeout is active, this method immediately returns false, 
        else returns true. */
        entity.hp -=  this.strength;
        entity.hp = Math.max(0,entity.hp);

        // console.log(`Attacker: ${this.name} , ${this.hp}`);
        // console.log(`Victim: ${entity.name}, ${entity.hp}`);

        this.attackTimeOut = setTimeout(()=>{
            this.attackTimeOut = null;
            return false;
        }, this.attackSpeed);

        return true;
    }
}

class Monster extends Creature {/*
The Monster class is a Creature. It has the following properties (bot including inherited properties):
- constructor
  - parameters: name (string), level (number), items (Item[]), gold (number)
- name (string): name must be valid (from MONSTER_NAMES)
- level (number)
- items (array of Item objects)
- gold (number)
Example use:
new Monster('Anti Fairy', 1, [], 0); // Creates a Monster named Anti Fairy, level 1, no items and 0 gold. Only the name is required.
*/
    constructor(name, level=1, items=[], gold=0){
        let nameFile = name.split(' ').join('');
        nameFile = `imgs/monsters/${nameFile}.gif`;

        super(name, nameFile, level, items, gold);
        //console.log(this);
    }

    attack(entity) {/**- attack (function)
        - parameters: entity (Creature)
        - calls the attack method from Creature (use super) and plays the 'mattack' sound if the attack was successful */
        if(super.attack(entity)) playSound('mattack');
    }
}
