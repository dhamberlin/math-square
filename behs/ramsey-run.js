import P5Behavior from 'p5beh';
import * as Sensor from 'sensors';

const pb = new P5Behavior();

var position = { x: 10, y: 10 }
var speed = { x: 10, y: 5 }

pb.preload = function (p) {

}

pb.setup = function (p) {
  
};

let flag = true;

pb.draw = function (floor, p) {  
  // for (let u of floor.users) {
  //   pb.drawUser(u);
  // }
  this.background('#00FF00');
  this.noFill();
  this.stroke('#000000');
  // console.log('Hello');
  const activeSensors = [];
  for(var i = new Sensor.Index(); i; i = i.incr()){
    if (floor.sensors.get(i)){
      this.ellipse(i.x * 8, i.y * 8, 20);
      activeSensors.push({ x: i.x, y: i.y });
    }
  }

  console.log(JSON.stringify(activeSensors));

  // pb.drawSensors(floor.sensors);  
};

export const behavior = {
  title: "ALFA LOBO DINAMITA",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  numGhosts: 0,
};

export default behavior
