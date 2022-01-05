var jsPsychExtensionWebgazer = (function () {
  'use strict';

  class WebGazerExtension {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
          // private state for the extension
          // extension authors can define public functions to interact
          // with the state. recommend not exposing state directly
          // so that state manipulations are checked.
          this.currentTrialData = [];
          this.currentTrialTargets = {};
          this.initialized = false;
          this.activeTrial = false;
          this.initialize = ({ round_predictions = true, auto_initialize = false, sampling_interval = 34, webgazer, }) => {
              // set initial state of the extension
              this.round_predictions = round_predictions;
              this.sampling_interval = sampling_interval;
              this.gazeUpdateCallbacks = [];
              this.domObserver = new MutationObserver(this.mutationObserverCallback);
              return new Promise((resolve, reject) => {
                  if (typeof webgazer === "undefined") {
                      if (window.webgazer) {
                          this.webgazer = window.webgazer;
                      }
                      else {
                          reject(new Error("Webgazer extension failed to initialize. webgazer.js not loaded. Load webgazer.js before calling initJsPsych()"));
                      }
                  }
                  else {
                      this.webgazer = webgazer;
                  }
                  // sets up event handler for webgazer data
                  // this.webgazer.setGazeListener(this.handleGazeDataUpdate);
                  // default to threadedRidge regression
                  // NEVER MIND... kalman filter is too useful.
                  //state.webgazer.workerScriptURL = 'js/webgazer/ridgeWorker.mjs';
                  //state.webgazer.setRegression('threadedRidge');
                  //state.webgazer.applyKalmanFilter(false); // kalman filter doesn't seem to work yet with threadedridge.
                  // hide video by default
                  this.hideVideo();
                  // hide predictions by default
                  this.hidePredictions();
                  if (auto_initialize) {
                      // starts webgazer, and once it initializes we stop mouseCalibration and
                      // pause webgazer data.
                      this.webgazer
                          .begin()
                          .then(() => {
                          this.initialized = true;
                          this.stopMouseCalibration();
                          this.pause();
                          resolve();
                      })
                          .catch((error) => {
                          console.error(error);
                          reject(error);
                      });
                  }
                  else {
                      resolve();
                  }
              });
          };
          this.on_start = (params) => {
              this.currentTrialData = [];
              this.currentTrialTargets = {};
              this.currentTrialSelectors = params.targets;
              this.domObserver.observe(this.jsPsych.getDisplayElement(), { childList: true });
          };
          this.on_load = () => {
              // set current trial start time
              this.currentTrialStart = performance.now();
              // resume data collection
              // state.webgazer.resume();
              this.startSampleInterval();
              // set internal flag
              this.activeTrial = true;
          };
          this.on_finish = () => {
              // pause the eye tracker
              this.stopSampleInterval();
              // stop watching the DOM
              this.domObserver.disconnect();
              // state.webgazer.pause();
              // set internal flag
              this.activeTrial = false;
              // send back the gazeData
              return {
                  webgazer_data: this.currentTrialData,
                  webgazer_targets: this.currentTrialTargets,
              };
          };
          this.start = () => {
              return new Promise((resolve, reject) => {
                  if (typeof this.webgazer == "undefined") {
                      const error = "Failed to start webgazer. Things to check: Is webgazer.js loaded? Is the webgazer extension included in initJsPsych?";
                      console.error(error);
                      reject(error);
                  }
                  this.webgazer
                      .begin()
                      .then(() => {
                      this.initialized = true;
                      this.stopMouseCalibration();
                      this.pause();
                      resolve();
                  })
                      .catch((error) => {
                      console.error(error);
                      reject(error);
                  });
              });
          };
          this.startSampleInterval = (interval = this.sampling_interval) => {
              this.gazeInterval = setInterval(() => {
                  this.webgazer.getCurrentPrediction().then(this.handleGazeDataUpdate);
              }, interval);
              // repeat the call here so that we get one immediate execution. above will not
              // start until state.sampling_interval is reached the first time.
              this.webgazer.getCurrentPrediction().then(this.handleGazeDataUpdate);
          };
          this.stopSampleInterval = () => {
              clearInterval(this.gazeInterval);
          };
          this.isInitialized = () => {
              return this.initialized;
          };
          this.faceDetected = () => {
              return this.webgazer.getTracker().predictionReady;
          };
          this.showPredictions = () => {
              this.webgazer.showPredictionPoints(true);
          };
          this.hidePredictions = () => {
              this.webgazer.showPredictionPoints(false);
          };
          this.showVideo = () => {
              this.webgazer.showVideo(true);
              this.webgazer.showFaceOverlay(true);
              this.webgazer.showFaceFeedbackBox(true);
          };
          this.hideVideo = () => {
              this.webgazer.showVideo(false);
              this.webgazer.showFaceOverlay(false);
              this.webgazer.showFaceFeedbackBox(false);
          };
          this.resume = () => {
              this.webgazer.resume();
          };
          this.pause = () => {
              this.webgazer.pause();
              // sometimes gaze dot will show and freeze after pause?
              if (document.querySelector("#webgazerGazeDot")) {
                  document.querySelector("#webgazerGazeDot").style.display = "none";
              }
          };
          this.resetCalibration = () => {
              this.webgazer.clearData();
          };
          this.stopMouseCalibration = () => {
              this.webgazer.removeMouseEventListeners();
          };
          this.startMouseCalibration = () => {
              this.webgazer.addMouseEventListeners();
          };
          this.calibratePoint = (x, y) => {
              this.webgazer.recordScreenPosition(x, y, "click");
          };
          this.setRegressionType = (regression_type) => {
              var valid_regression_models = ["ridge", "weightedRidge", "threadedRidge"];
              if (valid_regression_models.includes(regression_type)) {
                  this.webgazer.setRegression(regression_type);
              }
              else {
                  console.warn("Invalid regression_type parameter for webgazer.setRegressionType. Valid options are ridge, weightedRidge, and threadedRidge.");
              }
          };
          this.getCurrentPrediction = () => {
              return this.webgazer.getCurrentPrediction();
          };
          this.onGazeUpdate = (callback) => {
              this.gazeUpdateCallbacks.push(callback);
              return () => {
                  this.gazeUpdateCallbacks = this.gazeUpdateCallbacks.filter((item) => {
                      return item !== callback;
                  });
              };
          };
          this.handleGazeDataUpdate = (gazeData, elapsedTime) => {
              if (gazeData !== null) {
                  var d = {
                      x: this.round_predictions ? Math.round(gazeData.x) : gazeData.x,
                      y: this.round_predictions ? Math.round(gazeData.y) : gazeData.y,
                      t: gazeData.t,
                  };
                  if (this.activeTrial) {
                      //console.log(`handleUpdate: t = ${Math.round(gazeData.t)}, now = ${Math.round(performance.now())}`);
                      d.t = Math.round(gazeData.t - this.currentTrialStart);
                      this.currentTrialData.push(d); // add data to current trial's data
                  }
                  this.currentGaze = d;
                  for (var i = 0; i < this.gazeUpdateCallbacks.length; i++) {
                      this.gazeUpdateCallbacks[i](d);
                  }
              }
              else {
                  this.currentGaze = null;
              }
          };
          this.mutationObserverCallback = (mutationsList, observer) => {
              for (const selector of this.currentTrialSelectors) {
                  if (!this.currentTrialTargets[selector]) {
                      if (this.jsPsych.getDisplayElement().querySelector(selector)) {
                          var coords = this.jsPsych
                              .getDisplayElement()
                              .querySelector(selector)
                              .getBoundingClientRect();
                          this.currentTrialTargets[selector] = coords;
                      }
                  }
              }
          };
      }
  }
  WebGazerExtension.info = {
      name: "webgazer",
  };

  return WebGazerExtension;

})();
