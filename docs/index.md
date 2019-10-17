jspsych-psychophysics is a plugin for conducting Web-based psychophysical experiments using [jsPsych](http://www.jspsych.org/) (de Leeuw, 2015).
This plugin can be used free of charge under the MIT license.

# What you can do with the jspsych-psychophysics plugin
- You can present a set of stimuli asynchronously. In other words, the plugin can set stimulus onset asynchrony (SOA).
- You can present visual stimuli at intended coordinates.
- You can present moving objects.

# The advantage of the jspsych-psychophysics plugin
- This plugin presents visual stimuli synchronized with the refresh of the display using the requestAnimationFrame method. As a result, the display duration would be more accurate.
- The SOA between visual stimuli with the plugin was more accurate than that without the plugin. See

# How to use the jspsych-psychophysics plugin
This is the brief explanation how to use the plugin. Please refer to the individual object pages described below. 

## At first, all the stimuli used in the program must be specified as a JavaScript object

```javascript:Example
var rect_object1 = {
    type: 'rect', // means a rectangle
    startX: 50, // location in the canvas
    startY: 60,
    width: 300, // of the rectangle
    height: 200,
    line_color: '#ffffff',
    fill_color: '#ffffff',
    show_start_time: 1500 // milliseconds
}
```

This code means that a white rectangle is presented at coordinates (50, 60) in a canvas which is a HTML element providing a lots of drawing tools. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. The width and height of the rectangle are 300 and 200 pixels respectively. The color can be specified using the HTML color names, hexadecimal (HEX) colors, and RGB values that are often used in a general HTML file. The **show_start_time** property is the most notable in this object, which enables to present the stimulus at the intended time. In this example, a white rectangle is presented 1500 ms after beginning this trial. The experimenter can present circles, lines, and texts as same as rectangles by specifying all of the stimuli to be presented in this trial.

## a trial object has to be specified as follows:

```
var trial = {
    type: 'psychophysics',
    stimuli: [rect_object1, rect_object2, rect_object3],
    canvas_width: 1000,
    canvas_height: 800,
    background_color: '#008000', // of the canvas
}
```

The **stimuli** property must include all the objects to be presented in the trial. In this example, three rectangles are presented with the SOAs in a canvas of which width and height are 1000 and 800 pixels respectively, and of which color is green (HEX: #008000). This trial object must be included as a **timeline** property of the jsPsych.init which is a core function of the jsPsych.

Note that if you use image and audio files in a trial, please preload them using the preload_imageg and preload_audio methods in the jsPsych.init.


# What kinds of stimuli you can present with the jspsych-psychophysics plugin
- rectangle
- circle
- line
- text
- sound

The 

Copyright (c) 2019 Daiichiro Kuroki  
Released under [the MIT license](https://opensource.org/licenses/MIT)
