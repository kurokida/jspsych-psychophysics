# Parameters

|Parameter|Type|Default Value|Description|
|---|---|---|
|stimuli|array|'customize'|An array of objects, each object represents a stimulus to be presented in this trial. The properties of each object are depend on the type of the object. See the properties of the stimulus object. The default value (customize) should be used when you costomise the stepFunc which is called by the requestAnimationFrame method.|
|canvas_width|numeric|window.innerWidth|The width of the canvas in which stimuli are drawn. If it is not specified, the width of the canvas is identical to that of the window.|
|canvas_height|numeric|window.innerHeight|The height of the canvas in which stimuli are drawn. If it is not specified, the height of the canvas is identical to that of the window.|
|background_color|string|'grey'|The background color of the canvas.|
|response_type|string|'key'|To have a participant respond to the stimulus using a mouse instead of a keyboard, specify `mouse`.|
|response_start_time|numeric|0|The defalut value (0) means that the participant can respond to the stimuli from the start of the trial, and the reaction time is measured from the start of the trial until the participant's response. If the response_start_time is set to 1000, the participant can respond to the stimuli 1000 ms after from the start of the trial, and the reaction time is measured from 1000 ms after the start of the trial until the participant's response.|
|stepFunc|function|null|Advanced. This function is called by the *requestAnimationFrame* method. If you specify the *stepFunc*, the *stimuli* should be 'customize'. If you would like to draw stimuli using the canvas-drawing methods manually, the *stepFunc* would be benefit.|
|choices|array of keycodes|jsPsych.ALL_KEYS|This array contains the keys that the subject is allowed to press in order to respond to the stimulus. Keys can be specified as their [numeric key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) or as characters (e.g., 'a', 'q'). The default value of jsPsych.ALL_KEYS means that all keys will be accepted as valid responses. Specifying jsPsych.NO_KEYS will mean that no responses are allowed.|
|prompt|string|null|This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the subject is supposed to take (e.g., which key(s) to press).|
|trial_duration|numeric|null|How long to wait for the subject to make a response before ending the trial in milliseconds. If the subject fails to make a response before this timer is reached, the subject's response will be recorded as null for the trial and the trial will end. If the value of this parameter is null, the trial will wait for a response indefinitely.|
|response_ends_trial|boolean|true|If true, then the trial will end whenever the subject makes a response (assuming they make their response before the cutoff specified by the trial_duration parameter). If false, then the trial will continue until the value for trial_duration is reached. You can use this parameter to force the subject to view a stimulus for a fixed amount of time, even if they respond before the time is complete.|

Note: Because the prameter of *choices*, *prompt*, *trial_duration*, and *response_ends_trial* is same as that of plugins included in the jsPsych, the explanation of these parameter was copied and paseted from the original site.

# Data Generated

