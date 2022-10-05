import { makeRollupConfig } from "@jspsych/config/rollup";
const config = makeRollupConfig("jsPsychPsychophysics");

// Don't include pixi.js in the bundles
for (const build of config) {
  build.external.push("pixi.js");

  for (const output of build.output) {
    output.globals["pixi.js"] = "PIXI";
    if (output.format === "iife") {
      // Prevent a ReferenceError when PIXI has not been included:
      output.banner = 'if (typeof PIXI === "undefined") { var PIXI; }';
    }
  }
}

export default config;
