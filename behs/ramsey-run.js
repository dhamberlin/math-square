import P5Behavior from 'p5beh';
import * as Sensor from 'sensors';

const pb = new P5Behavior();

const blue = 'blue';
const red = 'red';

const  vertexCoordinates = [
  [[40, 128], [216, 128], [84, 52], [84, 204], [172, 52], [172, 204]],
  [[360, 448], [536, 448], [404, 372], [404, 524], [492, 372], [492, 524]],
  [[128, 360], [212, 421], [44, 421], [76, 519], [180, 519]],
  [[448, 40], [532, 101], [364, 101], [396, 199], [500, 199]],
];

const dist = (x1,y1,x2,y2) => {
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

class Board {
  constructor(coords) {
    console.log('NEW BOARD COORDS: ', coords)
    this.vertices = coords.map(c => new Vertex(c));
    // Initialize empty adjacency matrix
    this.adjacency = Array(coords.length).fill(0).map(row => Array(coords.length).fill(0)));
    this.currentColor = 'blue';
    this.active = null; // Holds current active vertex
  }

  draw(activeSensors) {
    if (this.gameOver) return;
    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        if (this.adjacency[i][j]) {
          pb.p5.stroke(this.adjacency[i][j]);
          pb.p5.line(this.vertices[i].x, this.vertices[i].y, this.vertices[j].x, this.vertices[j].y);
        }
      }
    }

    this.vertices.forEach(vertex => {
      // check for collisions
      const canActivate = vertex.degree < (this.vertices.length - 1);
      const notSelf = vertex !== this.active;
      const currentlySteppedOn = vertex.checkCollisions(activeSensors)
      if(canActivate && notSelf && currentlySteppedOn){
        this.activate(vertex);
      };

      // draw
      const strokeColor = vertex === this.active ? this.currentColor : 'white';
      const fillColor = currentlySteppedOn ? 'white' : vertex.color;
      pb.p5.stroke(strokeColor);
      pb.p5.fill(fillColor);
      pb.p5.ellipse(vertex.x, vertex.y, 24);
      this.checkForTriangle();
    });
  }

  connect(v1, v2) {
    const a = this.vertices.indexOf(v1);
    const b = this.vertices.indexOf(v2);
    this.adjacency[a][b] = this.currentColor;
    this.adjacency[b][a] = this.currentColor;
  }

  checkForTriangle() {
    const l = this.vertices.length;
    for (let i = 0; i < l - 2; i++) {
      for (let j = i + 1; j < l - 1; j++) {
        for (let k = j + 1; k < l; k++) {
          if (this.adjacency[i][j] && this.adjacency[j][k] && this.adjacency[i][k]) {
            setTimeout((() => {this.reset()}).bind(this), 1000)
          }
        }
      }
    }
  }

  activate(vertex) {
    console.log('active')
    if (!this.cooldown) {
      this.cooldown = true;
      if (this.active) {
        const a = this.vertices.indexOf(this.active);
        const b = this.vertices.indexOf(vertex);
        const moveAllowed = !this.adjacency[a][b];
        if (moveAllowed) {
          vertex.degree++;
          this.active.degree++;
          this.connect(this.active, vertex);
          this.active = null;
          this.currentColor = this.currentColor === 'blue' ? 'red' : 'blue';
        }
      } else {
        this.active = vertex;
      }
      console.table(this.adjacency)
    }
    setTimeout(() => { this.cooldown = false }, 2000);
  }

  reset() {
    console.log('this: ', this)
    resetBoard(this);
  }
}


class Vertex {
  constructor([x, y]) {
    this.x = x;
    this.y = y;
    this.color = '#000';
    this.degree = 0;
  }

  checkCollisions(collisionsArray) {
    let collision = false;
    collisionsArray.forEach(collisionObject => {
      if(dist(collisionObject.x, collisionObject.y, this.x, this.y) < 24) {
        collision = true;
      }
    });
    return collision;
  }
}


const boards = vertexCoordinates.map(v => new Board(v));

const drawBoards = (activeSensors) => {
  boards.forEach(b => b.draw(activeSensors))
}

const resetBoard = (board) => {
  const index = boards.indexOf(board);
  console.log('coordinates: ', vertexCoordinates[index])
  // boards[index] = new Board(vertexCoordinates[index]);
}

pb.preload = function (p) {

}

pb.setup = function (p) {

};

pb.draw = function (floor, p) {

  this.background('grey');
  this.noFill();
  this.stroke('#000000');

  // draw grid

  // for(var i = 1; i < 72; i++) {
  //   this.stroke('#DDD');
  //   this.line(i * 8, 0, i * 8, 72 * 8);
  //   this.line(0, i * 8, 72 * 8, i * 8);
  // }
  // for(var i = 1; i < 12; i++) {
  //   this.stroke('#AAA');
  //   this.line(i * 8 * 6, 0, i * 8 * 6, 72 * 8);
  //   this.line(0, i * 8 * 6, 72 * 8, i * 8 * 6);
  // }

  const activeSensors = [];
  for(var i = new Sensor.Index(); i; i = i.incr()){
    if (floor.sensors.get(i)){
      this.ellipse(i.x * 8, i.y * 8, 20);
      activeSensors.push({ x: i.x * 8, y: i.y * 8 });
    }
  }

  drawBoards(activeSensors);

};

export const behavior = {
  title: "ALFA LOBO DINAMITA",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 0,
};

export default behavior
