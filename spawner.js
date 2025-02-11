export default class Spawner {
  constructor({ app, create }) {
    const spawnInterval = 1000;
    this.app = app;
    this.maxSpawn = 20;
    this.create = create;
    this.spawns = [];
    setInterval(() => this.spawn(), spawnInterval);
  }

  spawn() {
    if (!this.app.gameStarted) return;
    if (this.spawns.length >= this.maxSpawn) return;
    let s = this.create();
    this.spawns.push(s);
  }
}
