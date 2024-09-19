var jsPsychWebgazerCalibrate = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-webgazer-calibrate",
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
      directory: "packages/plugin-webgazer-calibrate"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/webgazer-calibrate",
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
    name: "webgazer-calibrate",
    version: _package.version,
    parameters: {
      calibration_points: {
        type: jspsych.ParameterType.INT,
        default: [
          [10, 10],
          [10, 50],
          [10, 90],
          [50, 10],
          [50, 50],
          [50, 90],
          [90, 10],
          [90, 50],
          [90, 90]
        ],
        array: true
      },
      calibration_mode: {
        type: jspsych.ParameterType.SELECT,
        options: ["click", "view"],
        default: "click"
      },
      point_size: {
        type: jspsych.ParameterType.INT,
        default: 20
      },
      repetitions_per_point: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      randomize_calibration_order: {
        type: jspsych.ParameterType.BOOL,
        default: false
      },
      time_to_saccade: {
        type: jspsych.ParameterType.INT,
        default: 1e3
      },
      time_per_point: {
        type: jspsych.ParameterType.INT,
        default: 1e3
      }
    },
    data: {}
  };
  class WebgazerCalibratePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      const extension = this.jsPsych.extensions.webgazer;
      var html = `
          <div id='webgazer-calibrate-container' style='position: relative; width:100vw; height:100vh'>
          </div>`;
      display_element.innerHTML = html;
      var wg_container = display_element.querySelector("#webgazer-calibrate-container");
      var reps_completed = 0;
      var points_completed = -1;
      var cal_points = null;
      const next_calibration_round = () => {
        if (trial.randomize_calibration_order) {
          cal_points = this.jsPsych.randomization.shuffle(trial.calibration_points);
        } else {
          cal_points = trial.calibration_points;
        }
        points_completed = -1;
        next_calibration_point();
      };
      const calibrate = () => {
        extension.resume();
        if (trial.calibration_mode == "click") {
          extension.startMouseCalibration();
        }
        next_calibration_round();
      };
      const next_calibration_point = () => {
        points_completed++;
        if (points_completed == cal_points.length) {
          reps_completed++;
          if (reps_completed == trial.repetitions_per_point) {
            calibration_done();
          } else {
            next_calibration_round();
          }
        } else {
          var pt = cal_points[points_completed];
          calibration_display_gaze_only(pt);
        }
      };
      const calibration_display_gaze_only = (pt) => {
        var pt_html = `<div id="calibration-point" style="width:${trial.point_size}px; height:${trial.point_size}px; border-radius:${trial.point_size}px; border: 1px solid #000; background-color: #333; position: absolute; left:${pt[0]}%; top:${pt[1]}%;"></div>`;
        wg_container.innerHTML = pt_html;
        var pt_dom = wg_container.querySelector("#calibration-point");
        if (trial.calibration_mode == "click") {
          pt_dom.style.cursor = "pointer";
          pt_dom.addEventListener("click", () => {
            next_calibration_point();
          });
        }
        if (trial.calibration_mode == "view") {
          var br = pt_dom.getBoundingClientRect();
          var x = br.left + br.width / 2;
          var y = br.top + br.height / 2;
          var pt_start_cal = performance.now() + trial.time_to_saccade;
          var pt_finish = performance.now() + trial.time_to_saccade + trial.time_per_point;
          const watch_dot = () => {
            if (performance.now() > pt_start_cal) {
              extension.calibratePoint(x, y);
            }
            if (performance.now() < pt_finish) {
              requestAnimationFrame(watch_dot);
            } else {
              next_calibration_point();
            }
          };
          requestAnimationFrame(watch_dot);
        }
      };
      const calibration_done = () => {
        if (trial.calibration_mode == "click") {
          extension.stopMouseCalibration();
        }
        wg_container.innerHTML = "";
        end_trial();
      };
      const end_trial = () => {
        extension.pause();
        extension.hidePredictions();
        extension.hideVideo();
        var trial_data = {};
        this.jsPsych.finishTrial(trial_data);
      };
      calibrate();
    }
  }

  return WebgazerCalibratePlugin;

})(jsPsychModule);
