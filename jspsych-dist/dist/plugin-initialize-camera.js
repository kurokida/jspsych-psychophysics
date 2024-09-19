var jsPsychInitializeCamera = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-initialize-camera",
    version: "2.0.0",
    description: "jsPsych plugin for getting permission to initialize the user's camera",
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
      directory: "packages/plugin-initialize-camera"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/initialize-camera",
    peerDependencies: {
      jspsych: ">=7.2.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "initialize-camera",
    version: _package.version,
    parameters: {
      device_select_message: {
        type: jspsych.ParameterType.HTML_STRING,
        default: `<p>Please select the camera you would like to use.</p>`
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Use this camera"
      },
      include_audio: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      width: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      height: {
        type: jspsych.ParameterType.INT,
        default: null
      },
      mime_type: {
        type: jspsych.ParameterType.STRING,
        default: null
      }
    },
    data: {
      device_id: {
        type: jspsych.ParameterType.STRING
      }
    }
  };
  class InitializeCameraPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      this.run_trial(display_element, trial).then((id) => {
        this.jsPsych.finishTrial({
          device_id: id
        });
      });
    }
    async run_trial(display_element, trial) {
      await this.askForPermission(trial);
      this.showCameraSelection(display_element, trial);
      this.updateDeviceList(display_element);
      navigator.mediaDevices.ondevicechange = (e) => {
        this.updateDeviceList(display_element);
      };
      const camera_id = await this.waitForSelection(display_element);
      const constraints = { video: { deviceId: camera_id } };
      if (trial.width) {
        constraints.video.width = trial.width;
      }
      if (trial.height) {
        constraints.video.height = trial.height;
      }
      if (trial.include_audio) {
        constraints.audio = true;
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder_options = {};
      if (trial.mime_type) {
        recorder_options.mimeType = trial.mime_type;
      }
      this.jsPsych.pluginAPI.initializeCameraRecorder(stream, recorder_options);
      return camera_id;
    }
    async askForPermission(trial) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: trial.include_audio,
        video: true
      });
      return stream;
    }
    showCameraSelection(display_element, trial) {
      let html = `
      ${trial.device_select_message}
      <select name="camera" id="which-camera" style="font-size:14px; font-family: 'Open Sans', 'Arial', sans-serif; padding: 4px;">
      </select>
      <p><button class="jspsych-btn" id="btn-select-camera">${trial.button_label}</button></p>`;
      display_element.innerHTML = html;
    }
    waitForSelection(display_element) {
      return new Promise((resolve) => {
        display_element.querySelector("#btn-select-camera").addEventListener("click", () => {
          const camera = display_element.querySelector("#which-camera").value;
          resolve(camera);
        });
      });
    }
    updateDeviceList(display_element) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const cams = devices.filter(
          (d) => d.kind === "videoinput" && d.deviceId !== "default" && d.deviceId !== "communications"
        );
        const unique_cameras = cams.filter(
          (cam, index, arr) => arr.findIndex((v) => v.groupId == cam.groupId) == index
        );
        display_element.querySelector("#which-camera").innerHTML = "";
        unique_cameras.forEach((d) => {
          let el = document.createElement("option");
          el.value = d.deviceId;
          el.innerHTML = d.label;
          display_element.querySelector("#which-camera").appendChild(el);
        });
      });
    }
  }

  return InitializeCameraPlugin;

})(jsPsychModule);
