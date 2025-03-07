import * as PIXI from "pixi.js";
import Shooting from "./shooting";

export default class Player {
  constructor({ app }) {
    this.app = app;
    const playerWidth = 32;

    let sheet =
      PIXI.Loader.shared.resources["assets/hero_male.json"].spritesheet;

    this.idle = new PIXI.AnimatedSprite(sheet.animations["idle"]);
    this.shoot = new PIXI.AnimatedSprite(sheet.animations["shoot"]);
    this.player = new PIXI.AnimatedSprite(sheet.animations["idle"]);
    this.player.animationSpeed = 0.1;
    this.player.play();
    //this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.player.anchor.set(0.5, 0.3);
    this.player.position.set(app.screen.width / 2, app.screen.height / 2);
    //this.player.width = this.player.height = playerWidth;
    //this.player.tint = 0xea985d;
    app.stage.addChild(this.player);

    this.lastMouseButton = 0;
    this.shooting = new Shooting({ app, player: this });

    this.maxHealth = 100;
    this.health = this.maxHealth;
    const margin = 16;
    const barHeight = 8;
    this.healthBar = new PIXI.Graphics();
    this.healthBar.beginFill(0xff0000, 1);
    this.healthBar.initialWidth = app.screen.width - 2 * margin;
    this.healthBar.drawRect(
      margin,
      app.screen.height - barHeight - margin / 2,
      this.healthBar.initialWidth,
      barHeight
    );
    this.healthBar.endFill();
    this.healthBar.zIndex = 1;
    this.app.stage.sortableChildren = true;
    app.stage.addChild(this.healthBar);
  }

  set scale(s) {
    this.player.scale.set(s);
  }

  get scale() {
    return this.player.scale.x;
  }

  damage() {
    this.health -= 1;
    this.healthBar.width =
      (this.healthBar.initialWidth * this.health) / this.maxHealth;
    if (this.health <= 0) {
      this.dead = true;
    }
  }

  get position() {
    return this.player.position;
  }

  get width() {
    return this.player.width;
  }

  update(delta) {
    if (this.dead) return;
    const mouse = this.app.renderer.plugins.interaction.mouse;
    const cursorPosition = mouse.global;
    let angle =
      Math.atan2(
        cursorPosition.y - this.player.y,
        cursorPosition.x - this.player.x
      ) +
      Math.PI / 2;
    this.rotation = angle;
    this.player.scale.x = cursorPosition.x < this.player.position.x ? -1 : 1;

    if (mouse.buttons !== this.lastMouseButton) {
      this.player.textures =
        mouse.buttons === 0 ? this.idle.textures : this.shoot.textures;
      this.player.play();
      this.shooting.shoot = mouse.buttons !== 0;
      this.lastMouseButton = mouse.buttons;
    }
    this.shooting.update(delta);
  }
}
