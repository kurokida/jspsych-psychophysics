var jsPsychMirrorCamera = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-mirror-camera",
    version: "2.0.0",
    description: "jsPsych plugin for showing a live feed of the user's camera",
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
      test: "jest --passWithNoTests",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-mirror-camera"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/mirror-camera",
    peerDependencies: {
      jspsych: ">=7.2.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "mirror-camera",
    version: _package.version,
    parameters: {
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      },
      height: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      mirror_camera: {
        type: jspsych.ParameterType.BOOL,
        default: true
      }
    },
    data: {
      rt: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class MirrorCameraPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    stream;
    start_time;
    trial(display_element, trial) {
      this.stream = this.jsPsych.pluginAPI.getCameraStream();
      display_element.innerHTML = `
      <video autoplay playsinline id="jspsych-mirror-camera-video" width="${trial.width ? trial.width : "auto"}" height="${trial.height ? trial.height : "auto"}" ${trial.mirror_camera ? 'style="transform: rotateY(180deg);"' : ""}></video>
      ${trial.prompt ? `<div id="jspsych-mirror-camera-prompt">${trial.prompt}</div>` : ""}
      <p><button class="jspsych-btn" id="btn-continue">${trial.button_label}</button></p>
    `;
      display_element.querySelector("#jspsych-mirror-camera-video").srcObject = this.stream;
      display_element.querySelector("#btn-continue").addEventListener("click", () => {
        this.finish(display_element);
      });
      this.start_time = performance.now();
    }
    finish(display_element) {
      this.jsPsych.finishTrial({
        rt: performance.now() - this.start_time
      });
    }
  }

  return MirrorCameraPlugin;

})(jsPsychModule);
