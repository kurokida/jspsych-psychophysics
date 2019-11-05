Only the 'stimuli' parameter is required; Other parameters can be left unspecified if the default value is acceptable.

# Parameters

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|stimuli|array|undefined|An array of objects, each object represents a stimulus to be presented in this trial. The properties of each object are depend on the type of the object. See [the properties of the stimulus object](objectProperties.md). The stimuli is not needed when you use the stepFunc which is called by the requestAnimationFrame method.|
|canvas_width|numeric|window.innerWidth|The width of the canvas in which stimuli are drawn. If it is not specified, the width of the canvas is identical to that of the window.|
|canvas_height|numeric|window.innerHeight|The height of the canvas in which stimuli are drawn. If it is not specified, the height of the canvas is identical to that of the window.|
|background_color|string|'grey'|The background color of the canvas.The color can be specified using the HTML color names, hexadecimal (HEX) colors, and RGB values that are often used in a general HTML file. |
|response_type|string|'key'|To have a participant respond to the stimulus using a mouse instead of a keyboard, specify `'mouse'`.|
|response_start_time|numeric|0|The defalut value (0) means that the participant can respond to the stimuli from the start of the trial, and the reaction time is the time from the start of the trial until the participant's response. If the response_start_time is set to 1000, the participant can respond to the stimuli 1000 ms after from the start of the trial, and the reaction time is the time from 1000 ms after the start of the trial until the participant's response.|
|stepFunc|function|null|**Advanced.** This function is called by the *requestAnimationFrame* method, and excuted synchronized with the refresh of the display. When you specify the *stepFunc*, the *stimuli* should not be specified. If you would like to draw stimuli using the canvas-drawing methods manually, the *stepFunc* would be benefit. See, `demos/stepFunc.html`.|
|choices|array of keycodes|jsPsych.ALL_KEYS|This array contains the keys that the participant is allowed to press in order to respond to the stimulus. Keys can be specified as their [numeric key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) or as characters (e.g., 'a', 'q'). The default value of jsPsych.ALL_KEYS means that all keys will be accepted as valid responses. Specifying jsPsych.NO_KEYS will mean that no responses are allowed.|
|prompt|string|null|This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the participant is supposed to take (e.g., which key(s) to press).|
|trial_duration|numeric|null|How long to wait for the participant to make a response before ending the trial in milliseconds. If the participant fails to make a response before this timer is reached, the participant's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely.|
|response_ends_trial|boolean|true|If true, then the trial will end whenever the participant makes a response (assuming they make their response before the cutoff specified by the trial_duration parameter). If false, then the trial will continue until the value for trial_duration is reached. You can use this parameter to force the participant to view a stimulus for a fixed amount of time, even if they respond before the time is complete.|

Note: Because the prameter of *choices*, *prompt*, *trial_duration*, and *response_ends_trial* is the same as that of the plugins included in the jsPsych, the explanation of these parameters was copied and paseted from the original site.

# Data Generated

In addition to the [default data collected by all plugins](https://www.jspsych.org/plugins/overview/#data-collected-by-plugins), this plugin collects the following data for each trial.

|Name|Type|Value|
|---|---|---|
|rt|numeric|The response time in milliseconds for the participant to make a response. The start time of the measurement depends on the 'response_start_time'.|
|response_type|string|'key' or 'mouse'|
|key_press|numeric|Indicates which key the participant pressed. The value is the [numeric key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) corresponding to the participant's response. '-1' means thant the participant respond using a mouse.|
|avg_frame_time|numeric|Averaged interframe interval.|
|click_x|numeric|Horizontal clicked position. The origin of the coordinate is the top left of the canvas, and the unit is the pixel.|
|click_y|numeric|Vertical clicked position. The origin of the coordinate is the top left of the canvas, and the unit is the pixel.|
