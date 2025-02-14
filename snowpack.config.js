// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  alias: {
    "pixi.js": "pixi.js",
  },
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: "es2018",
  },
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    knownEntrypoints: ["pixi.js"],
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
