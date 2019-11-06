All the stimuli used in the program with the jspsych-psychophysics plugin must be specified as a JavaScript object as follows:
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

This code means that a white rectangle is presented at coordinates (200, 150) in a canvas which is a HTML element providing a lots of drawing tools. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. The width and height of the rectangle are 300 and 200 pixels respectively. The line and filled colors can be specified individually using the HTML color names, hexadecimal (HEX) colors, and RGB values that are often used in a general HTML file. Most importantly, the white rectangle is presented 500 ms after beginning this trial.

# Common properties among objects

|Property name|Type|Default Value|Description|
|---|---|---|---|
|obj_type|string|undefined|The type of the object (e.g., rect, image, or sound). Refer to the individual explanation below in detail.|
|startX|numeric|'center'|Horizontal position of the object's center. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. If the startX is specified as `'center'`, the object is presented at the horizontal center of the canvas. The startX is also used as the starting position in motion.|
|startY|numeric|'center'|Vertical position of the object's center. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. If the startY is specified as `'center'`, the object is presented at the vertical center of the canvas. The startY is also used as the starting position in motion.|
|endX|numeric|null|Horizontal end position of the moving object.|
|endY|numeric|null|Vertical end position of the moving object.|
|horiz_pix_frame|numeric|undefined|Horizontal pixels by which the object moves per frame of the display.|
|horiz_pix_sec|numeric|undefined|Horizontal pixels by which the object moves per second.|
|vert_pix_frame|numeric|undefined|Vertical pixels by which the object moves per frame of the display.|
|vert_pix_sec|numeric|undefined|Vertical pixels by which the object moves per second.|
|show_start_time|numeric|0|Time to start presenting the object from when the trial begins.|
|show_end_time|numeric|null|Time to end presenting the object from when the trial begins.|
|motion_start_time|numeric|show_start_time|Time to start moving the object from when the trial begins.|
|motion_end_time|numeric|null|Time to end moving the object from when the trial begins.|
|line_width|numeric|1| The width of the line.|
|lineJoin|string|'miter'|[The type of the corner when two lines meet](https://www.w3schools.com/tags/canvas_linejoin.asp)|
|miterLimit|numeric|10|[The maximum miter length](https://www.w3schools.com/tags/canvas_miterlimit.asp)|

Note: The *horiz(vert)_pix_frame(sec)* can be automatically calculated using the *startX(Y)*, *endX(Y)*, *motion_start_time*, and*motion_end_time*.

# obj_type: 'image'

|Property name|Type|Default Value|Description|
|---|---|---|---|
|file|string|undefined|The file name of the image.|
|scale|numeric|1 (original size)|Image scaling.|

# obj_type: 'sound'

|Property name|Type|Default Value|Description|
|---|---|---|---|
|file|string|undefined|The file name of the sound.|

# obj_type: 'line'

For this line object, the startX/Y property means the center position of the line.
There are two ways to define a line. See, `demos/lines.html`.

|Property name|Type|Default Value|Description|
|---|---|---|---|
|x1, y1|numeric|undefined| The start position of line drawing.|
|x2, y2|numeric|undefined| The end position of line drawing.|
|line_length|numeric|undefined| The length of the line.|
|line_color|string|#000000 (black)|The color of the line.|
|angle|numeric|undefined| The angle of the line. Zero means a horizontal line.|

# obj_type: 'rect'

|Property name|Type|Default Value|Description|
|---|---|---|---|
|width|numeric|undefined| The width of the rectangle.|
|height|numeric|undefined| The height of the rectangle.|
|line_color|string|undefined|The color of the contour.|
|fill_color|string|undefined|The filled color of the rectangle.|

# obj_type: 'circle'

|Property name|Type|Default Value|Description|
|---|---|---|---|
|radius|numeric|undefined|The radius of the circle.|
|line_color|string|undefined|The color of the contour.|
|fill_color|string|undefined|The filled color of the circle.|

# obj_type: 'text'

|Property name|Type|Default Value|Description|
|---|---|---|---|
|content|string|undefined|The content of the text. It can include `\n` to start a new line.|
|font|string|undefined| You can change the size and font. [This is the same as the font property of `<canvas>` element.](https://www.w3schools.com/tags/canvas_font.asp)|
|text_color|string|#000000 (black)|The color of the text.|
|text_space|numeric|20|The space between lines.|

# obj_type: 'cross' 

This object would be used as the fixation point.

|Property name|Type|Default Value|Description|
|---|---|---|---|
|line_length|numeric|undefined| The length of the line.|
|line_color|string|#000000 (black)|The color of the line.|

# obj_type: 'manual' 

|Property name|Type|Default Value|Description|
|---|---|---|---|
|drawFunc|function|undefined|You can draw whatever the `<canvas>` supports.| 

If you want to draw something that the jspsych-psychophysics does not provide the method, you can draw it using the drawFunc function. 

The first argument is `stimulus` by which you can access the properties of the object. For example, `stimulus.currentX/Y` can be used to refer the current position of the object, updated synchronized with the refresh of the display. You can also define and access new properties using this argument. 

The second argument is `canvas`, and the third argument is `context` of the canvas.

The following code is the sample of the `drawFunc`. This sample draws a rectangle including a gradation from white to black. See, `demos/manual-drawFunc.html`.

```javascript
drawFunc: function(stimulus, canvas, context){
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