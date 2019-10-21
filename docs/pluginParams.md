
|Parameter|Type|Default Value|Description|
|---|---|---|
|stimuli|array|customize which is used with the stepFunc|An array of objects, each object represents a stimulus to be presented in this trial. The properties of each object are depend on the type of the object. See the properties of the stimulus object.|
|canvas_width|numeric|window.innerHeight|The width of the canvas in which stimuli are drawn. If it is not specified, the width of the canvas is identical to that of the window.|
|canvas_height|numeric|window.innerHeight|The height of the canvas in which stimuli are drawn. If it is not specified, the height of the canvas is identical to that of the window.|
|choices|array of keycodes|jsPsych.ALL_KEYS|This array contains the keys that the subject is allowed to press in order to respond to the stimulus. Keys can be specified as their [numeric key code](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) or as characters (e.g., 'a', 'q'). The default value of jsPsych.ALL_KEYS means that all keys will be accepted as valid responses. Specifying jsPsych.NO_KEYS will mean that no responses are allowed.|
|prompt|string|null|This string can contain HTML markup. Any content here will be displayed below the stimulus. The intention is that it can be used to provide a reminder about the action the subject is supposed to take (e.g., which key(s) to press).|
|background_color|string|'grey'|The background color of the canvas.|

Note: Because the prameter of *choices*, is same as that of the plugin included in the jsPsych, the explanation of these parameter was copied and paseted from the original site.