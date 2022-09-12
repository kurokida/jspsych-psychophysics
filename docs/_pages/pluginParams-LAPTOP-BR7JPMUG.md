---
permalink: /pluginParams/
title: "Plugin parameters"
---

Only the 'stimuli' parameter is required; Other parameters can be left unspecified if the default value is acceptable. Note that the prameter of *choices*, *prompt*, *trial_duration*, and *response_ends_trial* is the same as that of the plugins included in the jsPsych.

# Main parameters

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|stimuli|array|undefined|An array of objects, each object represents a stimulus to be presented in the trial. The properties (parameters) of each object are depend on the type of the object. See [Stimulus parameters](objectProperties.md).|
|response_type|string|'key'|How participants will respond. You can specify 'key', 'mouse', or 'button'.|
|response_start_time|numeric|0|The defalut value (0) means that the participant can respond to the stimuli from the start of the trial, and the reaction time is the time from the start of the trial until the participant's response. If the response_start_time is set to 1000, the participant can respond to the stimuli 1000 ms after from the start of the trial, and the reaction time is the time from 1000 ms after the start of the trial until the participant's response.|
|response_ends_trial|boolean|true|If true, then the trial will end whenever the participant makes a response (assuming they make their response before the cutoff specified by the trial_duration parameter). If false, then the trial will continue until the value for trial_duration is reached. You can use this parameter to force the participant to view a stimulus for a fixed amount of time, even if they respond before the time is complete.|
|prompt|string|null|This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take (e.g., which key(s) to press).|
|trial_duration|numeric|null|How long to wait for the participant to make a response before ending the trial in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely.|
|~~stepFunc~~|function|null|**This can't be used since v2.0. Please use the raf_func instead.**|
|raf_func|function|null|This function takes three arguments which are, in order, `trial`, `elapsed time in terms of milliseconds`. and `elapsed time in terms of frames`. This function is called by the *requestAnimationFrame* method, and excuted synchronized with the refresh of the display. Wnen you use the *raf_func* called by the requestAnimationFrame method, you have to specify the stimuli as an empty array. If you would like to draw stimuli using the canvas-drawing methods manually, the *raf_func* would be benefit. See, the [raf_func.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/raf_func.html) and [draw two images repeatedly.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/draw_two_images_repeatedly.html).|

# Parameters related to canvas

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|background_color|string|'grey'|The background color of the canvas.The color can be specified using the HTML color names (e.g., `'black'`), hexadecimal (HEX) colors (e.g., `'#ff0000'`), and RGB values (e.g., `'rgb(0, 255, 0)'`) that are often used in a general HTML file. |
|canvas_width|numeric|window.innerWidth|The width of the canvas in which stimuli are drawn. If it is not specified, the width of the canvas is identical to that of the window.|
|canvas_height|numeric|window.innerHeight|The height of the canvas in which stimuli are drawn. If it is not specified, the height of the canvas is identical to that of the window, but see the canvas_offsetY property.|
|canvas_offsetX|numeric|0|This value is subtracted from the width of the canvas in full-screen mode. However, since the default value is 0, it basically has no effect on the window size.|
|canvas_offsetY|numeric|8|This value is subtracted from the height of the canvas in full-screen mode to prevent the vertical scroll bar from being displayed.|
|clear_canvas|boolean|true|If true, the canvas is cleared every frame. There are not many cases where this should be false, but if you want to draw the trajectory of the mouse, for example, you need to set it false. Note that in that case, the show_end_time property can not be used.  See the [mouse drawing.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_drawing.html)|

# Parameters related to a key response

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|choices|array of keycodes|"ALL_KEYS"|This array contains the keys that the participant is allowed to press in order to respond to the stimulus. Keys can be specified as their [numeric key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) or as characters (e.g., 'a', 'q'). The default value of "ALL_KEYS" means that all keys will be accepted as valid responses. Specifying "NO_KEYS" will mean that no responses are allowed.|

# Parameters related to a button response

The following parameters are enabled when the `response_type` is 'button'.

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|button_choices|array of strings|['Next']|Labels for the buttons. Each different string in the array will generate a different button.|
|button_html|HTML string|`<button class="jspsych-btn">%choice%</button>`| A template of HTML for generating the button elements. You can override this to create customized buttons of various kinds. The string %choice% will be changed to the corresponding element of the choices array. You may also specify an array of strings, if you need different HTML to render for each button. If you do specify an array, the choices array and this array must have the same length. The HTML from position 0 in the button_html array will be used to create the button for element 0 in the choices array, and so on.|
|vert_button_margin|string|'0px'|Vertical margin of the button(s).|
|horiz_button_margin|string|'8px'|Horizontal margin of the button(s).|

# Parameters related to event handlers

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|mouse_down_func|function|null|This is the event handler of the mousedown on the canvas. See the [mouse_drawing.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_drawing.html) and [mouse_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mouse_event.html).|
|mouse_up_func|function|null|This is the event handler of the mouseup on the canvas.|
|mouse_move_func|function|null|This is the event handler of the mousemove on the canvas.|
|key_down_func|function|null|This is the event handler of the keydown on the document. See the [keyboard_event.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/keyboard_event.html).|
|key_up_func|function|null|This is the event handler of the keyup on the canvas.|

# Data Generated

In addition to the [default data collected by all plugins](https://www.jspsych.org/plugins/overview/#data-collected-by-plugins), this plugin collects the following data for each trial.

|Name|Type|Value|
|---|---|---|
|rt|numeric|The response time in milliseconds for the participant to make a response. The start time of the measurement depends on the 'response_start_time'.|
|response_type|string|'key', 'mouse', or 'button'|
|key_press|string|Indicates which key the participant pressed. '-1' means thant the participant respond using a mouse.|
|response|string|Indicates which key the participant pressed. This is the same as the key_press.|
|avg_frame_time|numeric|Averaged interframe interval.|
|click_x/click_y|numeric|Horizontal/Vertical clicked position. The origin of the coordinate is the top left of the canvas, and the unit is the pixel.|
|center_x/center_y|numeric|Horizontal/Vertical position of the center of the window. The origin of the coordinate is the top left of the canvas, and the unit is the pixel.|
|button_pressed|numeric|Indicates which button the subject pressed. The first button in the choices array is 0, the second is 1, and so on.|

# Read only parameters

|Parameter|Description|
|---|---|
|canvas|You can access the element of the canvas via the `jsPsych.getCurrentTrial().canvas`.|
|context|You can access the context of the canvas via the `jsPsych.getCurrentTrial().context`.|
|centerX|You can access the horizontal center of the canvas via the `jsPsych.getCurrentTrial().centerX`.|
|centerY|You can access the vertical center of the canvas via the `jsPsych.getCurrentTrial().centerY`.|

# Stimuli
|Parameter|Description|
|---|---|
|stimuli|You can access the stimuli via the `jsPsych.getCurrentTrial().stimuli`. This is useful if you want to change the stimulus in the on_start function.|
|stim_array|You can access the stimuli via the `jsPsych.getCurrentTrial().stim_array`. This is useful if you want to change the stimulus in the event handlers or the raf_func.|