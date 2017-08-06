import P5Behavior from 'p5beh';

const pb = new P5Behavior();

const  vertexCoordinates = [
  [[40, 128], [216, 128], [84, 52], [84, 204], [172, 52], [172, 204]],
  [[360, 448], [536, 448], [404, 372], [404, 524], [492, 372], [492, 524]],
  [[128, 360], [212, 421], [44, 421], [76, 519], [180, 519]],
  // [[40, 128], [216, 128], [84, 52], [84, 204], [172, 52], [172, 204]],
];



class Board {
  constructor(coords) {
    this.vertices = coords.map(c => new Vertex(c));
    this.adjacency = Array(coords.length).fill(Array(coords.length).fill(0));
  }
  draw() {
    console.log(this.adjacency)
    for (let i = 0; i < this.vertices.length - 1; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        if (this.adjacency[i][j]) {
          pb.p5.line(this.vertices[i].x, this.vertices[i].y, this.vertices[j].x, this.vertices[i].y)
        }
      }
    }
    pb.p5.fill('purple');
    pb.p5.stroke('white');
    this.vertices.forEach(({x, y}) => pb.p5.ellipse(x, y, 24));
  }
  connect(v1, v2) {
    const a = this.vertices.indexOf(v1);
    const b = this.vertices.indexOf(v2);
    this.adjacency[a][b] = 1;
    this.adjacency[b][a] = 1;
  }
}

class Vertex {
  constructor([x, y]) {
    this.x = x;
    this.y = y;
  }
}

function triangleTest() {

}

const boards = vertexCoordinates.map(v => new Board(v));

const drawBoards = () => {
  boards.forEach(b => b.draw())
}

// for WEBGL: pb.renderer = 'webgl';

pb.preload = function (p) {
  /* this == pb.p5 == p */
  // ...
}

pb.setup = function (p) {
  /* this == pb.p5 == p */
  /* P5Behavior already calls createCanvas for us */
  // setup here...
  console.log(boards)
};

pb.draw = function (floor, p) {
  /* this == pb.p5 == p */
  // draw here...
  this.clear();
  // this.background('#FF00FF')
  drawBoards();
  this.fill(1, 1, 1, 1);
  boards[0].vertices.forEach(v1 => {
    boards[0].vertices.forEach(v2 => {
      boards[0].connect(v1, v2);
    })
  })
};

export const behavior = {
  title: "Ramsey Run",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 0
};
export default behavior
