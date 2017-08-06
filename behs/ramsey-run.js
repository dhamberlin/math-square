import P5Behavior from 'p5beh';
import * as Sensor from 'sensors';

const pb = new P5Behavior();

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
    this.vertices = coords.map(c => new Vertex(c));
    this.adjacency = Array(coords.length).fill(Array(coords.length).fill(0));
  }
  draw(activeSensors) {
    // console.log(this.adjacency)
    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        if (this.adjacency[i][j]) {
          pb.p5.stroke(this.adjacency[i][j])
          pb.p5.line(this.vertices[i].x, this.vertices[i].y, this.vertices[j].x, this.vertices[j].y)
        }
      }
    }
    pb.p5.fill('purple');
    pb.p5.stroke('white');
    this.vertices.forEach(vertex => {
      vertex.checkCollisions(activeSensors);
      pb.p5.fill(vertex.color);
      pb.p5.ellipse(vertex.x, vertex.y, 24);
    });
  }
  connect(v1, v2, color) {
    const a = this.vertices.indexOf(v1);
    const b = this.vertices.indexOf(v2);
    this.adjacency[a][b] = color;
    this.adjacency[b][a] = color;
  }
  checkTriangle(){}
}

class Vertex {
  constructor([x, y]) {
    this.x = x;
    this.y = y;
    this.color = '#000';
  }

  checkCollisions(collisionsArray) {
    collisionsArray.forEach(collisionObject => {
      if(dist(collisionObject.x, collisionObject.y, this.x, this.y) < 24) {
        this.color = '#FF00FF';
      }
    });
  }
}

function triangleTest() {

}

const boards = vertexCoordinates.map(v => new Board(v));

const drawBoards = (activeSensors) => {
  boards.forEach(b => b.draw(activeSensors))
}

pb.preload = function (p) {

}

pb.setup = function (p) {

};

pb.draw = function (floor, p) {
  
  this.background('#FFF');
  this.noFill();
  this.stroke('#000000');

  

  // draw grid

  for(var i = 1; i < 72; i++) {
    this.stroke('#DDD');
    this.line(i * 8, 0, i * 8, 72 * 8);
    this.line(0, i * 8, 72 * 8, i * 8);
  }
  for(var i = 1; i < 12; i++) {
    this.stroke('#AAA');
    this.line(i * 8 * 6, 0, i * 8 * 6, 72 * 8);
    this.line(0, i * 8 * 6, 72 * 8, i * 8 * 6);
  }

  const activeSensors = [];
  for(var i = new Sensor.Index(); i; i = i.incr()){
    if (floor.sensors.get(i)){
      this.ellipse(i.x * 8, i.y * 8, 20);
      activeSensors.push({ x: i.x * 8, y: i.y * 8 });
    }
  }
  console.log(JSON.stringify(activeSensors));

  drawBoards(activeSensors);
  this.fill(1, 1, 1, 1);
  boards[0].vertices.forEach(v1 => {
    boards[0].vertices.forEach(v2 => {
      boards[0].connect(v1, v2, 'blue');
    })
  })
};

export const behavior = {
  title: "ALFA LOBO DINAMITA",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 0,
};

export default behavior
