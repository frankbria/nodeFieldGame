const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

function clearScreen() {
  for (let i = 0; i < 30; i++) {
    console.log('');
  }
}

class Field {
  constructor(fieldArray) {
    this.field = fieldArray;
    this.y0 = 0;
    this.x0 = this.field[0].indexOf(pathCharacter);
  }

  static generateField(height, length) {
    const numHoles = 3;
    // initalize the field
    let newField = new Array(height);

    for (let i=0; i < height; i++) {
      newField[i] = new Array(length);
      for (let j=0; j < length; j++) {
        newField[i][j] = fieldCharacter;
      }
    }
    // pick a random hat location not on top row
    let hat_i = Math.floor(Math.random() * height);
    let hat_j = Math.floor(Math.random() * length);
    if (hat_i == 0) {
      hat_i = 1;
    }
    newField[hat_i][hat_j] = hat;

    // pick up to 3 holes that aren't the hat
    for (let i=0; i < 3; i++) {
      const hole_i = Math.floor(Math.random() * height);
      const hole_j = Math.floor(Math.random() * length);
      if (hole_i != hat_i && hole_j != hat_j) {
        newField[hole_i][hole_j] = hole;
      }
    }

    // add a path character on the top row
    const path_j = Math.floor(Math.random() * length);
    newField[0][path_j] = pathCharacter;
    return newField;
  }

  print() {
    const rowNum = this.field.length;
    for (let i=0; i < rowNum; i++) {
      console.log(this.field[i].join(''));
    }
  }

  makeMove(direction) {
    switch(direction) {
      case "d":
        this.y0 += 1;
        break;
      case "r":
        this.x0 += 1;
        break;
      case "l":
        this.x0 -= 1;
        break;
      case "u":
        this.y0 -= 1;
        break;
    }
    let gameCheck = this.checkMove();
    this.field[this.y0][this.x0] = pathCharacter;

    clearScreen();
    this.print();
    switch(gameCheck) {
      case -2:
        console.log('You moved outside the field. Game over.');
        break;
      case -1:
        console.log('You fell in a hole. Game over.');
        break;
      case 0:
        console.log('You win!');
        break;
    }
    return gameCheck;
  }

  checkMove() {
    if (this.x0 < 0 || this.y0 < 0) {
      return -2;
    }
    else if (this.field[this.y0][this.x0] == hole) {
      return -1;
    }
    else if (this.field[this.y0][this.x0] == hat) {
      return 0;
    }
    else {
      return 1;
    }
  }

}

//const myField = new Field([
//    ['*', '░', 'O'],
//  ['░', 'O', '░'],
//  ['░', '^', '░'],
//]);
const myField = new Field(Field.generateField(6,8));

let gameRun = 1;

clearScreen();
myField.print();
while (gameRun > 0) {
  const move = prompt('Move?');
  gameRun = myField.makeMove(move);
}

