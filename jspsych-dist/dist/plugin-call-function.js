var jsPsychCallFunction = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-call-function",
    version: "2.0.0",
    description: "jsPsych plugin for calling an arbitrary function during a jspsych experiment",
    type: "module",
    main: "dist/index.cjs",
    exports: {
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    },
    typings: "dist/index.d.ts",
    unpkg: "dist/index.browser.min.js",
    files: [
      "src",
      "dist"
    ],
    source: "src/index.ts",
    scripts: {
      test: "jest",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-call-function"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/call-function",
    peerDependencies: {
      jspsych: ">=7.1.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "call-function",
    version: _package.version,
    parameters: {
      func: {
        type: jspsych.ParameterType.FUNCTION,
        default: void 0
      },
      async: {
        type: jspsych.ParameterType.BOOL,
        default: false
      }
    },
    data: {
      value: {
        type: jspsych.ParameterType.COMPLEX,
        default: void 0
      }
    }
  };
  class CallFunctionPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      let return_val;
      const end_trial = () => {
        const trial_data = {
          value: return_val
        };
        this.jsPsych.finishTrial(trial_data);
      };
      if (trial.async) {
        const done = (data) => {
          return_val = data;
          end_trial();
        };
        trial.func(done);
      } else {
        return_val = trial.func();
        end_trial();
      }
    }
  }

  return CallFunctionPlugin;

})(jsPsychModule);
