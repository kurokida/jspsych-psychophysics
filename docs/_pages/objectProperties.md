---
permalink: /objectProperties/
title: "Stimulus parameters"
---

All stimuli used in a program with the jspsych-psychophysics plugin must be specified as JavaScript objects as follows:
```javascript
var rect_object = {
    obj_type: 'rect', // means a rectangle
    startX: 200, // location in the canvas
    startY: 150,
    width: 300, // of the rectangle
    height: 200,
    line_color: '#ffffff',
    fill_color: '#ffffff',
    show_start_time: 500 // from the trial start (ms)
}
```

This code means that a white rectangle is presented at coordinates (200, 150) in a canvas which is a HTML element providing a lots of drawing tools. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. If you want to change the origin to the center of the window, set the `origin_center` property to true. The width and height of the rectangle are 300 and 200 pixels respectively. The line and filled colors can be specified individually using the HTML color names, hexadecimal (HEX) colors, and RGB values that are often used in a general HTML file. Most importantly, the white rectangle is presented 500 ms after beginning this trial.

# Preloading media files

The image and sound files must be preloaded manually. [The method has changed since jspsych 6.3.0](https://www.jspsych.org/overview/media-preloading/).

```javascript
const images = ['img/file1.png', 'img/file2.png'];
const audio = ['audio/file1.mp3', 'audio/file2.mp3'];

const preload = {
    type: 'preload',
    images: images,
    audio: audio
}

jsPsych.init({
    timeline: [preload, trial],
});
```

# Common parameters among stimuli

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|obj_type|string|undefined|The type of the object (e.g., rect, image, or sound). Refer to the individual explanation below in detail.|
|startX/startY|numeric|'center'|Horizontal/Vertical position of the object's center. The origin of the coordinate is the top left of the canvas, but the origin can be changed to the center of the window using the `origin_center` property. The unit is the pixel. If the startX/startY is specified as `'center'`, the object is presented at the horizontal/vertical center of the canvas. The startX/startY is also used as the starting position in motion.|
|endX/endY|numeric|null|Horizontal/Vertical end position of the moving object.|
|origin_center|boolean|false|If you want to change the coordinate origin to the center of the window, set this property to true.|
|horiz_pix_frame|numeric|undefined|Horizontal pixels by which the object moves per frame of the display.|
|horiz_pix_sec|numeric|undefined|Horizontal pixels by which the object moves per second.|
|vert_pix_frame|numeric|undefined|Vertical pixels by which the object moves per frame of the display.|
|vert_pix_sec|numeric|undefined|Vertical pixels by which the object moves per second.|
|show_start_time|numeric|0|Time in millisconds to start presenting the object from when the trial begins.|
|show_end_time|numeric|null|Time in millisconds to end presenting the object from when the trial begins.|
|motion_start_time|numeric|show_start_time|Time in millisconds to start moving the object from when the trial begins.|
|motion_end_time|numeric|null|Time in millisconds to end moving the object from when the trial begins.|
|show_start_frame|numeric|0|Time in frames to start presenting the object from when the trial begins.|
|show_end_frame|numeric|null|Time in frames to end presenting the object from when the trial begins. If the `show_start_frame` is 0 and the `show_end_frame` is 10, the duration is 10 frames.|
|motion_start_frame|numeric|show_start_frame|Time in frames to start moving the object from when the trial begins.|
|motion_end_frame|numeric|null|Time in frames to end moving the object from when the trial begins.|
|is_frame|boolean|false|If you specify the show/motion time in frames, the `is_frame` property must be true.|
|line_width|numeric|1| The width of the line.|
|lineJoin|string|'miter'|[The type of the corner when two lines meet](https://www.w3schools.com/tags/canvas_linejoin.asp)|
|miterLimit|numeric|10|[The maximum miter length](https://www.w3schools.com/tags/canvas_miterlimit.asp)|
|change_attr|function|null|You can change [some the attributes of the object](/change_attr/) dynamically. The first argument is the stimulus, the second is the elapsed times in milliseconds, and the third is the elapsed times in frames. See [the demos/change_attributes.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/change_attributes.html). The difference between drawFunc and change_attr is that the drawFunc must specify the code for drawing and setting coordinates of the stimulus.| 

NOTE: The *horiz(vert)_pix_frame(sec)* can be automatically calculated using the *startX(Y)*, *endX(Y)*, *motion_start_time*, and*motion_end_time*.

# obj_type: 'image'

See also [Masking and filtering images using the jspsych-psychophysics plugin](/mask_filter/)"

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|file|string|undefined|The file name of the image.|
|scale|numeric|1 (original size)|Image scaling. Note that scaling will not work simultaneously with masking and filtering.|
|image_width|numeric|undefined| The width of the image. You can't specify this property with the scale or image_height property. Note that scaling will not work simultaneously with masking and filtering.|
|image_height|numeric|undefined| The height of the image. You can't specify this property with the scale or image_width property. Note that scaling will not work simultaneously with masking and filtering.|
|filter|string|undefined|Read [this page](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) carefully.| 
|mask|string|undefined|'gauss', 'circle', 'rect', or 'manual' See [the demos/mask_filter.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mask_filter.html).|
|width (gauss)|numeric|undefined| The size (width x width) of the area where the gaussian mask is applied.|
|sc|numeric|20| The standard deviation of the gaussian distribution. |
|width (circle/rect)|numeric|undefined| The width of the masking circle/rect.|
|height (circle/rect)|numeric|undefined| The height of the masking circle/rect.|
|center_x/y|numeric|undefined| The x/y-coordinate of the center of the masking circle/rect.|
|mask_func(canvas)|function|null|You can mask the image manually. Don't forget to specify the mask property as 'manual'. This function must retrun an ImageData object containing the array of pixel values. An argument of the function is the canvas on which the image is drawn. See [the demos/mask_filter.html](https://www.hes.kyushu-u.ac.jp/~kurokid/jspsychophysics/demos/mask_filter.html).| 

# obj_type: 'sound'

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|file|string|undefined|The file name of the sound.|
|trial_ends_after_audio|boolean|false|If true, then the trial will end as soon as the audio file finishes playing.|

# obj_type: 'line'

For this line object, the startX/Y property means the center position of the line.
There are two ways to define a line. See, `demos/lines.html`.

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|x1, y1|numeric|undefined| The start position of static line drawing. This property can't be used for the moving line. And it can't be used both with the line_length and angle property.|
|x2, y2|numeric|undefined| The end position of static line drawing. This property can't be used for the moving line. And it can't be used both with the line_length and angle property.|
|line_length|numeric|undefined| The length of the line.|
|line_color|string|#000000 (black)|The color of the line.|
|angle|numeric|undefined| The angle of the line. Zero means a horizontal line.|

# obj_type: 'rect'

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|width|numeric|undefined| The width of the rectangle.|
|height|numeric|undefined| The height of the rectangle.|
|line_color|string|undefined|The color of the contour.|
|fill_color|string|undefined|The filled color of the rectangle.|

# obj_type: 'circle'

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|radius|numeric|undefined|The radius of the circle.|
|line_color|string|undefined|The color of the contour.|
|fill_color|string|undefined|The filled color of the circle.|

# obj_type: 'text'

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|content|string|undefined|The content of the text. It can include `\n` to start a new line.|
|font|string|undefined| You can change the size and font. [This is the same as the font property of `<canvas>` element.](https://www.w3schools.com/tags/canvas_font.asp)|
|text_color|string|#000000 (black)|The color of the text.|
|text_space|numeric|20|The space between lines. Note that this will not work in Pixi mode.|

# obj_type: 'cross' 

This object would be used as the fixation point.

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|line_length|numeric|undefined| The length of the line.|
|line_color|string|#000000 (black)|The color of the line.|

# obj_type: 'gabor' 

See also [Presenting gabor patches in online/web experiments](/gabor/).

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|width|numeric|undefined| The size (width x width) of the area where the gabor patch is drawn. |
|tilt|numeric|0| The tilt of the gabor patch. The unit is the degree relative to the horizontal axis.|
|sf|numeric|0.05| The spatial frequency of the gabor patch. The unit is the cycles per pixel.|
|phase|numeric|0| The phase of the sine wave. The unit is the degree.|
|sc|numeric|20| The standard deviation of the gaussian distribution. |
|contrast|numeric|20| The contrast of the gabor patch. |
|drift|numeric|0| The velocity of the drifting gabor patch. The angular velocity per frame. The unit is the degree.|
|method|text|numeric| The method of drawing the gabor patch. 'numeric' or 'math' [The numeric.js](https://github.com/sloisel/numeric) is considerably faster than [the math.js](https://mathjs.org/).|
|disableNorm|boolean|false| Disable normalization of the gaussian function. That is, coefficient: 1/(sqrt(2*pi) * sc) will not be multiplied. If this property is specified as true, the contrast value should be relatively small.|
|contrastPreMultiplicator|numeric|1| This value is multiplied as a scaling factor to the requested contrast value. For the meaning of this variable, see [CreateProceduralGabor](http://psychtoolbox.org/docs/CreateProceduralGabor).|
|modulate_color|array|[1.0, 1.0, 1.0, 1.0]|This is available in [pixi mode](pixijs.md). For the meaning of this variable, see modulateColor in  [CreateProceduralGabor](http://psychtoolbox.org/docs/CreateProceduralGabor). Note that the transparency is different from that of Psychtoolbox. Do not specify any number other than 1.|
|offset_color|array|[0.5, 0.5, 0.5, 0.0]|This is available in [pixi mode](pixijs.md). For the meaning of this variable, see backgroundColorOffset in [CreateProceduralGabor](http://psychtoolbox.org/docs/CreateProceduralGabor). Note that the transparency is different from that of Psychtoolbox. Do not specify any number other than 0.|
|min_validModulationRange|numeric|-2|This is available in [pixi mode](pixijs.md). For the meaning of this variable, see validModulationRange in [CreateProceduralGabor](http://psychtoolbox.org/docs/CreateProceduralGabor).|
|max_validModulationRange|numeric|2|This is available in [pixi mode](pixijs.md). For the meaning of this variable, see validModulationRange in [CreateProceduralGabor](http://psychtoolbox.org/docs/CreateProceduralGabor).|

## Uniforms

The following values are only available in [pixi mode](pixijs.md). If the first data in the stimuli array is a gabor stimulus, it is possible to use uniforms as follows: `jsPsych.getCurrentTrial().stim_array[0].pixi_obj.filters[0].uniforms;` If the second data is a gabor stimulus, change to `stim_array[1]`, and `filters[0]` need not be changed.

|Property of the Uniforms|Description|
|Contrast|This is the same as contrast above.|
|Phase|This is the same as phase above.|
|angle_in_degrees| This is equal to 90 + tilt|
|spatial_freq|This is the same as sf above.|
|SpaceConstant|This is the same as sc above.|
|disableNorm|Specify 1 for true or 0 for false.|
|disableGauss|Specify 1 for true or 0 for false.|
|modulateColor_R|Red in modulate color.|
|modulateColor_G|Green in modulate color.|
|modulateColor_B|Blue in modulate color.|
|modulateColor_Alpha|Do not specify any number other than 1.|
|offset_R|Red in offset color.|
|offset_G|Green in offset color.|
|offset_B|Blue in offset color.|
|offset_Alpha||Do not specify any number other than 0.|
|contrastPreMultiplicator|This is the same as contrastPreMultiplicator above.|
|min_validModulationRange|This is the same as min_validModulationRange above.|
|max_validModulationRange|This is the same as max_validModulationRange above.|

# obj_type: 'manual' 

|Parameter|Type|Default Value|Description|
|---|---|---|---|
|drawFunc|function|null|You can draw whatever the `<canvas>` supports. The drawFunc can be specified in other than manual objects.| 

If you want to draw something that the jspsych-psychophysics does not provide the method, you can draw it using the drawFunc function. 

The first argument is `stimulus` by which you can access the properties of the object. For example, `stimulus.currentX/Y` can be used to refer the current position of the object, updated synchronized with the refresh of the display. You can also define and access new properties using this argument.  
The second and third arguments (`canvas`, `ctx`) are jspsych-psychophysics's canvas and its context.  
The fourth and fifth arguments (`elapsedTime`, `sumOfStep`) represent respectively the elapsed time in milliseconds and the frames count since the beginning of the trial. Both values correspond to the start of the current frame and thus both of them will have a value of 0 for the first frame. 

The following code is the sample of the `drawFunc`. This sample draws a rectangle including a gradation from white to black. See, `demos/manual-drawFunc.html`.

```javascript
drawFunc: function(stimulus, canvas, context, elapsedTime, sumOfStep){
    context.beginPath();

    const gradLength = 200;
    const grad  = context.createLinearGradient(0, 0, 0, gradLength);

    grad.addColorStop(0,'rgb(0, 0, 0)'); // black
    grad.addColorStop(1,'rgb(255, 255, 255)'); // white

    context.fillStyle = grad;
    context.rect(stimulus.currentX, stimulus.currentY, gradLength, gradLength);
    context.fill();
    context.closePath();
}
```

You can also use the `drawFunc` with other than 'manual', for example, with 'image'. See, `demos/draw_part_of_image.html`.
