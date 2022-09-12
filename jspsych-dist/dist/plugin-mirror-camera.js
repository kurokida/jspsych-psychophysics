var jsPsychMirrorCamera = (function (jspsych) {
  'use strict';

  const info = {
      name: "mirror-camera",
      parameters: {
          /** HTML to render below the video */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              default: null,
          },
          /** Label to show on continue button */
          button_label: {
              type: jspsych.ParameterType.STRING,
              default: "Continue",
          },
          /** Height of the video element */
          height: {
              type: jspsych.ParameterType.INT,
              default: null,
          },
          /** Width of the video element */
          width: {
              type: jspsych.ParameterType.INT,
              default: null,
          },
          /** Whether to flip the camera */
          mirror_camera: {
              type: jspsych.ParameterType.BOOL,
              default: true,
          },
      },
  };
  /**
   * **mirror-camera**
   *
   * jsPsych plugin for showing a live stream from a camera
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-mirror-camera/ mirror-camera plugin documentation on jspsych.org}
   */
  class MirrorCameraPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          this.stream = this.jsPsych.pluginAPI.getCameraStream();
          display_element.innerHTML = `
      <video autoplay playsinline id="jspsych-mirror-camera-video" width="${trial.width ? trial.width : "auto"}" height="${trial.height ? trial.height : "auto"}" ${trial.mirror_camera ? 'style="transform: rotateY(180deg);"' : ""}></video>
      ${trial.prompt ? `<div id="jspsych-mirror-camera-prompt">${trial.prompt}</div>` : ""}
      <p><button class="jspsych-btn" id="btn-continue">${trial.button_label}</button></p>
    `;
          display_element.querySelector("#jspsych-mirror-camera-video").srcObject =
              this.stream;
          display_element.querySelector("#btn-continue").addEventListener("click", () => {
              this.finish(display_element);
          });
          this.start_time = performance.now();
      }
      finish(display_element) {
          display_element.innerHTML = "";
          this.jsPsych.finishTrial({
              rt: performance.now() - this.start_time,
          });
      }
  }
  MirrorCameraPlugin.info = info;

  return MirrorCameraPlugin;

})(jsPsychModule);
