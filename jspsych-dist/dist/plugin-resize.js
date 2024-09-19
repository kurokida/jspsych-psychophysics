var jsPsychResize = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/plugin-resize",
    version: "2.0.0",
    description: "jsPsych plugin for controlling the real world size of the display",
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
      directory: "packages/plugin-resize"
    },
    author: "Steve Chao",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/plugins/resize",
    peerDependencies: {
      jspsych: ">=7.0.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  const info = {
    name: "resize",
    version: _package.version,
    parameters: {
      item_height: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      item_width: {
        type: jspsych.ParameterType.INT,
        default: 1
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        default: null
      },
      pixels_per_unit: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      starting_size: {
        type: jspsych.ParameterType.INT,
        default: 100
      },
      button_label: {
        type: jspsych.ParameterType.STRING,
        default: "Continue"
      }
    },
    data: {
      final_width_px: {
        type: jspsych.ParameterType.INT
      },
      scale_factor: {
        type: jspsych.ParameterType.FLOAT
      }
    }
  };
  class ResizePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = info;
    trial(display_element, trial) {
      var aspect_ratio = trial.item_width / trial.item_height;
      if (trial.item_width >= trial.item_height) {
        var start_div_width = trial.starting_size;
        var start_div_height = Math.round(trial.starting_size / aspect_ratio);
      } else {
        var start_div_height = trial.starting_size;
        var start_div_width = Math.round(trial.starting_size * aspect_ratio);
      }
      var html = '<div id="jspsych-resize-div" style="border: 2px solid steelblue; height: ' + start_div_height + "px; width:" + start_div_width + 'px; margin: 7px auto; background-color: lightsteelblue; position: relative;">';
      html += '<div id="jspsych-resize-handle" style="cursor: nwse-resize; background-color: steelblue; width: 10px; height: 10px; border: 2px solid lightsteelblue; position: absolute; bottom: 0; right: 0;"></div>';
      html += "</div>";
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      html += '<a class="jspsych-btn" id="jspsych-resize-btn">' + trial.button_label + "</a>";
      display_element.innerHTML = html;
      const end_trial = () => {
        document.removeEventListener("mousemove", resizeevent);
        document.removeEventListener("mouseup", mouseupevent);
        var trial_data = {
          final_height_px,
          final_width_px,
          scale_factor
        };
        this.jsPsych.finishTrial(trial_data);
      };
      document.getElementById("jspsych-resize-btn").addEventListener("click", () => {
        scale();
        end_trial();
      });
      var dragging = false;
      var origin_x, origin_y;
      var cx, cy;
      var mousedownevent = (e) => {
        e.preventDefault();
        dragging = true;
        origin_x = e.pageX;
        origin_y = e.pageY;
        cx = parseInt(scale_div.style.width);
        cy = parseInt(scale_div.style.height);
      };
      display_element.querySelector("#jspsych-resize-handle").addEventListener("mousedown", mousedownevent);
      var mouseupevent = (e) => {
        dragging = false;
      };
      document.addEventListener("mouseup", mouseupevent);
      var scale_div = display_element.querySelector("#jspsych-resize-div");
      var resizeevent = (e) => {
        if (dragging) {
          var dx = e.pageX - origin_x;
          var dy = e.pageY - origin_y;
          if (Math.abs(dx) >= Math.abs(dy)) {
            scale_div.style.width = Math.round(Math.max(20, cx + dx * 2)) + "px";
            scale_div.style.height = Math.round(Math.max(20, cx + dx * 2) / aspect_ratio) + "px";
          } else {
            scale_div.style.height = Math.round(Math.max(20, cy + dy * 2)) + "px";
            scale_div.style.width = Math.round(aspect_ratio * Math.max(20, cy + dy * 2)) + "px";
          }
        }
      };
      document.addEventListener("mousemove", resizeevent);
      var scale_factor;
      var final_height_px, final_width_px;
      function scale() {
        final_width_px = scale_div.offsetWidth;
        var pixels_unit_screen = final_width_px / trial.item_width;
        scale_factor = pixels_unit_screen / trial.pixels_per_unit;
        document.getElementById("jspsych-content").style.transform = "scale(" + scale_factor + ")";
      }
    }
  }

  return ResizePlugin;

})(jsPsychModule);
