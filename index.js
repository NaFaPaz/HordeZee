import * as PIXI from "pixi.js";
import Victor from "victor";
//import Matter from "matter-js";

let canvasSize = 256;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

let squareWidth = 32;
const square = new PIXI.Sprite(PIXI.Texture.WHITE);
square.anchor.set(0.5);
square.position.set(app.screen.width / 2, app.screen.height / 2);
square.width = square.height = squareWidth;
square.tint = 0xea985d;

let enemyRadius;
/////////////
app.stage.addChild(square);

app.ticker.add((delta) => {
  const cursorPosition = app.renderer.plugins.interaction.mouse.global;
  let angle =
    Math.atan2(cursorPosition.y - square.y, cursorPosition.x - square.x) +
    Math.PI / 2;
  square.rotation = angle;
});

function randomSpawnPoint() {
  let edge = Math.floor(Math.random() * 4);
  let spawnPoint = new Victor(0, 0);
  switch (edge) {
    case 0:
      spawnPoint.x = canvasSize * Math.random();
      break;
    default:
      break;
  }
}
