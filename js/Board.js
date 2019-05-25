//Create the Position and Board class

class Position{
/*
Position class definition
- constructor
  - parameters: row (number), column (number)
- row (number): index of the board row 
- column (number): index of the board column
Example use:
const position = new Position(0, 0); // row 0, column 0
*/
    constructor(row, column){
        this.row = row;
        this.column = column;
    }
}


class Board{/** Example use:
    const board = new Board(20, 20); // Creates a Board object with 20 rows, 20 columns, Wall entities (at the edges) and Grass entities. */
    
    constructor(rows, columns){/*- constructor
        - parameters: rows (number), columns (number)
        - Creates the array of rows and fills them with Wall and Grass entities.
      - rows (array): 2D Array of rows. Each row is an array of Entity objects.
      - root (HTMLElement) - HTML element in which the board elements are appended
        */
        
        this.rows = [];
        for(let i=0; i< rows; i++){
            this.rows[i] = [];
            for(let j=0; j< columns; j++){      
                if( i===0 || i===rows-1 || j===0 || j===columns-1 ) {
                    let newWall = new Wall();
                    newWall.position = {row:i, columns:j};
                    this.rows[i][j] = [newWall];//'#'
                }else{
                    let newGrass = new Grass();
                    newGrass.position = {row:i, columns:j};
                    this.rows[i][j] = [newGrass];//'.'
                }
            }
        }

    }

    
    render(root) {/*- render (function)
        - parameters: root (HTMLElement)
        - Sets the root property
        - Used to create the HTML elements for the board and append the elements to the root element.*/

        this.root = root;
        this.update();
    }
    
    update() { /**- update (function)
         - parameters: none
        - replaces the HTML element for each entity that has changed (e.g. Monster -> Grass) */

        this.rows.forEach((row,i) => {row.forEach((col,j) => {
            let entity = (col[col.length-1]);
            //console.log(entity);
            entity.element.style.top = `${ENTITY_SIZE * j}px`;
            entity.element.style.left = `${ENTITY_SIZE * i}px`;
            this.root.appendChild(entity.element);
            });
        });

    }

    setEntity(entity, position) {/**- setEntity (function)
         - parameters: entity (Entity), position (Position)
        - Sets the Entity object at the specified position and updates the Board (using the update method)*/
        entity.position = position;
        (this.rows[position.row][position.column]).push(entity);
    }

    getEntity(position) {/** - getEntity (function)
         - parameters: position (Position)
        - returns the Entity at the specified position */
        if((this.rows[position.row][position.column]).length>=3){//in [0] Grass or Wall, [1] Entity, [2] Player
            let entity = (this.rows[position.row][position.column])[(this.rows[position.row][position.column]).length-2];
            return entity;
        }else{//else return the Grass or Wall
            let entity = (this.rows[position.row][position.column])[0];
            return entity;
        }
    }

    deleteEntity(position){
        let entity = this.getEntity(position);
        entity.position = null;
        this.root.removeChild(entity.element);
    }

    getCenteredPosition() {
        let x = Math.floor(this.getHeight()/2);

        let y = Math.floor(this.getWidth()/2);

        //alert(`x=${x} out of ${this.rows.length} , y=${y} out of ${this.rows[0].length}`);
        return new Position(x,y);
    }

    getHeight(){//x
        return this.rows.length;
    }
    getWidth(){//y
        return this.rows[0].length;
    }
    isPositionEmpty(position) {
       let entity = this.getEntity(position);
       if (entity instanceof Wall || entity instanceof Grass)  return true;
       return false;
   }
   getRandomPosition(){
    let x = getRandom(1, this.getHeight()-2);
    let y = getRandom(1, this.getWidth()-2);
    return new Position(x, y);
  }
  isAWall(position) {
    /*let entity = this.getEntity(position);
    if (entity instanceof Wall)  return true;
    return false;*/

    if(position.row <=0 || position.row >= this.getHeight()-1 || position.column<=0 || position.column >= this.getWidth()-1 ){
        return true;
    }
    return false;
  }

}
/*
Board class definition
- constructor
  - parameters: rows (number), columns (number)
  - Creates the array of rows and fills them with Wall and Grass entities.
- rows (array): 2D Array of rows. Each row is an array of Entity objects.
- root (HTMLElement) - HTML element in which the board elements are appended
- render (function)
  - parameters: root (HTMLElement)
  - Sets the root property
  - Used to create the HTML elements for the board and append the elements to the root element.
- update (function)
 - parameters: none
 - replaces the HTML element for each entity that has changed (e.g. Monster -> Grass)
- setEntity (function)
  - parameters: entity (Entity), position (Position)
  - Sets the Entity object at the specified position and updates the Board (using the update method)
- getEntity (function)
  - parameters: position (Position)
  - returns the Entity at the specified position
Example use:
const board = new Board(20, 20); // Creates a Board object with 20 rows, 20 columns, Wall entities (at the edges) and Grass entities.
*/