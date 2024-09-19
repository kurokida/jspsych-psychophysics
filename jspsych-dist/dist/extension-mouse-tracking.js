var jsPsychExtensionMouseTracking = (function (jspsych) {
  'use strict';

  var _package = {
    name: "@jspsych/extension-mouse-tracking",
    version: "1.1.0",
    description: "jsPsych extension for mouse tracking",
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
      directory: "packages/extension-mouse-tracking"
    },
    author: "Josh de Leeuw",
    license: "MIT",
    bugs: {
      url: "https://github.com/jspsych/jsPsych/issues"
    },
    homepage: "https://www.jspsych.org/latest/extensions/mouse-tracking",
    peerDependencies: {
      jspsych: ">=7.0.0"
    },
    devDependencies: {
      "@jspsych/config": "^3.0.0",
      "@jspsych/test-utils": "^1.2.0"
    }
  };

  class MouseTrackingExtension {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    static info = {
      name: "mouse-tracking",
      version: _package.version,
      data: {
        mouse_tracking_data: {
          type: jspsych.ParameterType.COMPLEX,
          array: true,
          nested: {
            x: {
              type: jspsych.ParameterType.INT
            },
            y: {
              type: jspsych.ParameterType.INT
            },
            t: {
              type: jspsych.ParameterType.INT
            },
            event: {
              type: jspsych.ParameterType.STRING
            }
          }
        },
        mouse_tracking_targets: {
          type: jspsych.ParameterType.COMPLEX,
          nested: {
            x: {
              type: jspsych.ParameterType.INT
            },
            y: {
              type: jspsych.ParameterType.INT
            },
            width: {
              type: jspsych.ParameterType.INT
            },
            height: {
              type: jspsych.ParameterType.INT
            },
            top: {
              type: jspsych.ParameterType.INT
            },
            bottom: {
              type: jspsych.ParameterType.INT
            },
            left: {
              type: jspsych.ParameterType.INT
            },
            right: {
              type: jspsych.ParameterType.INT
            }
          }
        }
      }
    };
    domObserver;
    currentTrialData;
    currentTrialTargets;
    currentTrialSelectors;
    currentTrialStartTime;
    minimumSampleTime;
    lastSampleTime;
    eventsToTrack;
    initialize = async ({ minimum_sample_time = 0 }) => {
      this.domObserver = new MutationObserver(this.mutationObserverCallback);
      this.minimumSampleTime = minimum_sample_time;
    };
    on_start = (params) => {
      params = params || {};
      this.currentTrialData = [];
      this.currentTrialTargets = /* @__PURE__ */ new Map();
      this.currentTrialSelectors = params.targets || [];
      this.lastSampleTime = null;
      this.eventsToTrack = params.events || ["mousemove"];
      this.domObserver.observe(this.jsPsych.getDisplayElement(), { childList: true });
    };
    on_load = () => {
      this.currentTrialStartTime = performance.now();
      if (this.eventsToTrack.includes("mousemove")) {
        window.addEventListener("mousemove", this.mouseMoveEventHandler);
      }
      if (this.eventsToTrack.includes("mousedown")) {
        window.addEventListener("mousedown", this.mouseDownEventHandler);
      }
      if (this.eventsToTrack.includes("mouseup")) {
        window.addEventListener("mouseup", this.mouseUpEventHandler);
      }
    };
    on_finish = () => {
      this.domObserver.disconnect();
      if (this.eventsToTrack.includes("mousemove")) {
        window.removeEventListener("mousemove", this.mouseMoveEventHandler);
      }
      if (this.eventsToTrack.includes("mousedown")) {
        window.removeEventListener("mousedown", this.mouseDownEventHandler);
      }
      if (this.eventsToTrack.includes("mouseup")) {
        window.removeEventListener("mouseup", this.mouseUpEventHandler);
      }
      return {
        mouse_tracking_data: this.currentTrialData,
        mouse_tracking_targets: Object.fromEntries(this.currentTrialTargets.entries())
      };
    };
    mouseMoveEventHandler = ({ clientX: x, clientY: y }) => {
      const event_time = performance.now();
      const t = Math.round(event_time - this.currentTrialStartTime);
      if (this.lastSampleTime === null || event_time - this.lastSampleTime >= this.minimumSampleTime) {
        this.lastSampleTime = event_time;
        this.currentTrialData.push({ x, y, t, event: "mousemove" });
      }
    };
    mouseUpEventHandler = ({ clientX: x, clientY: y }) => {
      const event_time = performance.now();
      const t = Math.round(event_time - this.currentTrialStartTime);
      this.currentTrialData.push({ x, y, t, event: "mouseup" });
    };
    mouseDownEventHandler = ({ clientX: x, clientY: y }) => {
      const event_time = performance.now();
      const t = Math.round(event_time - this.currentTrialStartTime);
      this.currentTrialData.push({ x, y, t, event: "mousedown" });
    };
    mutationObserverCallback = (mutationsList, observer) => {
      for (const selector of this.currentTrialSelectors) {
        if (!this.currentTrialTargets.has(selector)) {
          const target = this.jsPsych.getDisplayElement().querySelector(selector);
          if (target) {
            this.currentTrialTargets.set(selector, target.getBoundingClientRect());
          }
        }
      }
    };
  }

  return MouseTrackingExtension;

})(jsPsychModule);
