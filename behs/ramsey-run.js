import P5Behavior from 'p5beh';

const pb = new P5Behavior();

// for WEBGL: pb.renderer = 'webgl';

pb.preload = function (p) {
  /* this == pb.p5 == p */
  // ...
}

pb.setup = function (p) {
  /* this == pb.p5 == p */
  /* P5Behavior already calls createCanvas for us */
  // setup here...
};

pb.draw = function (floor, p) {
  /* this == pb.p5 == p */
  // this.fill('#FF00FF');
  console.log('yoooooo')
  this.rect(0,0,100,100);
  this.background('#FF00FF')
  // draw here...
  // this.clear();
  for (let u of floor.users) {
    pb.drawUser(u);
  }
  this.fill(1, 1, 1, 1);
  this.noStroke();
  pb.drawSensors(floor.sensors);
};

export const behavior = {
  title: "Ramsey Run",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 6
};
export default behavior
