var jsPsychWebgazerInitCamera = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-webgazer-init-camera",
    version: "2.0.0",
    description: "",
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
      test: "jest  --passWithNoTests",
      "test:watch": "npm test -- --watch",
      tsc: "tsc",
      build: "rollup --config",
      "build:watch": "npm run build -- --watch"
    },
    repository: {
      type: "git",
      url: "git+https://github.com/jspsych/jsPsych.git",
      directory: "packages/plugin-webgazer-init-camera"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/webgazer-init-camera",
    peerDependencies: {
      jspsych: ">=7.0.0",
      "@jspsych/extension-webgazer": ">=1.0.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/extension-webgazer": "^1.0.2",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "webgazer-init-camera",
    version: _package.version,
    parameters: {
      instructions: {
        type: jspsych.ParameterType.HTML_STRING,
        default: `
            <p>Position your head so that the webcam has a good view of your eyes.</p>
            <p>Center your face in the box and look directly towards the camera.</p>
            <p>It is important that you try and keep your head reasonably still throughout the experiment, so please take a moment to adjust your setup to be comfortable.</p>
            <p>When your face is centered in the box and the box is green, you can click to continue.</p>`
      },
      button_text: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      }
    },
    data: {
      load_time: {
        type: jspsych.ParameterType.INT
      }
    }
  };
  class WebgazerInitCameraPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial, on_load) {
      const extension = this.jsPsych.extensions.webgazer;
      let trial_complete;
      var start_time = performance.now();
      var load_time;
      const end_trial = () => {
        extension.pause();
        extension.hideVideo();
        var trial_data = {
          load_time
        };
        document.querySelector("#webgazer-center-style").remove();
        this.jsPsych.finishTrial(trial_data);
        trial_complete();
      };
      const showTrial = () => {
        on_load();
        load_time = Math.round(performance.now() - start_time);
        var style = `
          <style id="webgazer-center-style">
            #webgazerVideoContainer { top: 20px !important; left: calc(50% - 160px) !important;}
          </style>
        `;
        document.querySelector("head").insertAdjacentHTML("beforeend", style);
        var html = `
          <div id='webgazer-init-container' style='position: relative; width:100vw; height:100vh'>
          </div>`;
        display_element.innerHTML = html;
        extension.showVideo();
        extension.resume();
        var wg_container = display_element.querySelector("#webgazer-init-container");
        wg_container.innerHTML = `
          <div style='position: absolute; top: max(260px, 40%); left: calc(50% - 400px); width:800px;'>
          ${trial.instructions}
          <button id='jspsych-wg-cont' class='jspsych-btn' disabled>${trial.button_text}</button>
          </div>`;
        if (is_face_detect_green()) {
          document.querySelector("#jspsych-wg-cont").disabled = false;
        } else {
          var observer = new MutationObserver(face_detect_event_observer);
          observer.observe(document, {
            attributes: true,
            attributeFilter: ["style"],
            subtree: true
          });
        }
        document.querySelector("#jspsych-wg-cont").addEventListener("click", () => {
          if (observer) {
            observer.disconnect();
          }
          end_trial();
        });
      };
      if (!extension.isInitialized()) {
        extension.start().then(() => {
          showTrial();
        }).catch((error) => {
          console.log(error);
          display_element.innerHTML = `<p>The experiment cannot continue because the eye tracker failed to start.</p>
              <p>This may be because of a technical problem or because you did not grant permission for the page to use your camera.</p>`;
        });
      } else {
        showTrial();
      }
      function is_face_detect_green() {
        if (document.querySelector("#webgazerFaceFeedbackBox")) {
          return document.querySelector("#webgazerFaceFeedbackBox").style.borderColor == "green";
        } else {
          return false;
        }
      }
      function face_detect_event_observer(mutationsList, observer) {
        if (mutationsList[0].target == document.querySelector("#webgazerFaceFeedbackBox")) {
          if (mutationsList[0].type == "attributes" && mutationsList[0].target.style.borderColor == "green") {
            document.querySelector("#jspsych-wg-cont").disabled = false;
          }
          if (mutationsList[0].type == "attributes" && mutationsList[0].target.style.borderColor == "red") {
            document.querySelector("#jspsych-wg-cont").disabled = true;
          }
        }
      }
      return new Promise((resolve) => {
        trial_complete = resolve;
      });
    }
  }

  return WebgazerInitCameraPlugin;

})(jsPsychModule);
