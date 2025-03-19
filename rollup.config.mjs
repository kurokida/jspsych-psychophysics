import { makeRollupConfig } from "@jspsych/config/rollup";
const config = makeRollupConfig("jsPsychPsychophysics");

// Don't include pixi.js in the bundles
for (const build of config) {
  if (!build.external) {
    build.external = []; // Initialization
  }
  build.external.push("pixi.js");
  if (Array.isArray(build.output)){
    for (const output of build.output) {
      if (!output.globals) {
        output.globals = [];
      }
      output.globals["pixi.js"] = "PIXI";
      if (output.format === "iife") {
        // Prevent a ReferenceError when PIXI has not been included:
        output.banner = 'if (typeof PIXI === "undefined") { var PIXI; }';
      }
    }  
  } else {
    if (!build.output.globals) {
      build.output.globals = [];
    }
    build.output.globals["pixi.js"] = "PIXI";
    if (build.output.format === "iife") {
      // Prevent a ReferenceError when PIXI has not been included:
      build.output.banner = 'if (typeof PIXI === "undefined") { var PIXI; }';
    }
  }
}
// console.log(config)
// console.dir(config, { depth: null });
export default config;
