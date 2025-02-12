import * as PIXI from "pixi.js";
import Player from "./player";
import Zombie from "./zombie";
import Spawner from "./spawner";
import { subTextStyle, textStyle, zombies } from "./globals";
import Weather from "./weather";
import GameState from "./game-state";

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
// Music
const music = new Audio("assets/HordeZee.mp3");
music.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});
// ZombieHorde
const zombieHorde = new Audio("assets/horde.mp3");
zombieHorde.volume = 0.7;
zombieHorde.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});

initGame();
async function initGame() {
  app.gameState = GameState.PREINTRO;
  try {
    await loadAssets();
    app.weather = new Weather({ app });
    let player = new Player({ app });
    let zSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player }),
    });

    let gamePreIntroScene = createScene("HordeZee", "Click to Continue");
    let gameStartScene = createScene("HordeZee", "Click to Start");
    let gameOverScene = createScene("HordeZee", "Game Over");

    app.ticker.add((delta) => {
      if (player.dead) app.gameState = GameState.GAMEOVER;

      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO;
      gameStartScene.visible = app.gameState === GameState.START;
      gameOverScene.visible = app.gameState === GameState.GAMEOVER;

      switch (app.gameState) {
        case GameState.PREINTRO:
          player.scale = 4;
          break;
        case GameState.INTRO:
          player.scale -= 0.1;
          if (player.scale <= 1) app.gameState = GameState.START;
          break;
        case GameState.RUNNING:
          player.update(delta);
          zSpawner.spawns.forEach((z) => z.update(delta));
          bulletHitTest({
            bullets: player.shooting.bullets,
            zombies: zSpawner.spawns,
            bulletRadius: player.shooting.bulletRadius,
            zombieRadius: 16,
          });
          break;
        default:
          break;
      }
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

function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5, 0);

  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2;
  subText.y = 50;
  subText.anchor.set(0.5, 0);

  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  sceneContainer.addChild(subText);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    zombies.forEach((z) => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add("assets/hero_male.json");
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("rain", "assets/rain.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO;
      music.play();
      app.weather.enableSound();
      break;
    case GameState.START:
      app.gameState = GameState.RUNNING;
      zombieHorde.play();
      break;
    default:
      break;
  }
}

document.addEventListener("click", clickHandler);
