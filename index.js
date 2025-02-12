import * as PIXI from "pixi.js";
import Player from "./player";
import Zombie from "./zombie";
import Spawner from "./spawner";
import { zombies } from "./globals";
//import Matter from "matter-js";

const canvasSize = 300;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2,
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

initGame();
async function initGame() {
  try {
    await loadAssets();

    let player = new Player({ app });
    let zSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player }),
    });

    let gameStartScene = createScene("Click to Start");
    let gameOverScene = createScene("Game Over");
    app.gameStarted = false;

    app.ticker.add((delta) => {
      gameOverScene.visible = player.dead;
      gameStartScene.visible = !app.gameStarted;
      if (!app.gameStarted) return;
      player.update(delta);
      zSpawner.spawns.forEach((z) => z.update(delta));
      bulletHitTest({
        bullets: player.shooting.bullets,
        zombies: zSpawner.spawns,
        bulletRadius: player.shooting.bulletRadius,
        zombieRadius: 16,
      });
    });
  } catch (error) {
    console.log(error.message);
  }
}
function bulletHitTest({ bullets, zombies, bulletRadius, zombieRadius }) {
  bullets.forEach((b) => {
    zombies.forEach((z, index) => {
      let dx = z.position.x - b.position.x;
      let dy = z.position.y - b.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1);
        z.kill();
      }
    });
  });
}

function createScene(sceneText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText);
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

function startGame() {
  app.gameStarted = true;
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    //zombies.forEach((z) => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add("assets/hero_male.json");
    //PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

document.addEventListener("click", startGame);
