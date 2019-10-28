All the stimuli used in the program with jspsych-psychophysics plugin must be specified as a JavaScript object as follows:
```javascript
var rect_object = {
    type: 'rect', // means a rectangle
    startX: 200, // location in the canvas
    startY: 150,
    width: 300, // of the rectangle
    height: 200,
    line_color: '#ffffff',
    fill_color: '#ffffff',
    show_start_time: 500 // from the trial start (ms)
}
```
# Common properties

|Property name|Type|Default Value|Description|
|---|---|---|---|
|type|string|undefined|The type of the object (e.g., rect, image, or sound)|
|startX|numeric|'center'|Horizontal position of the object's center. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. If the startX is specified as 'center', the object is presented at the horizontal center of the canvas. The startX is also used as the starting position in motion|
|startY|numeric|'center'|Vertical position of the object's center. The origin of the coordinate is the top left of the canvas, and the unit is the pixel. If the startY is specified as 'center', the object is presented at the vertical center of the canvas. The startY is also used as the starting position in motion|
|endX|numeric|null|Horizontal end position of the moving object|
|endY|numeric|null|Vertical end position of the moving object|
|horiz_pix_frame|numeric|undefined|Horizontal pixels by which the object moves per frame|
|horiz_pix_sec|numeric|undefined|Horizontal pixels by which the object moves per second|
|vert_pix_frame|numeric|undefined|Vertical pixels by which the object moves per frame|
|vert_pix_sec|numeric|undefined|Vertical pixels by which the object moves per second|
|show_start_time|Time to start presenting the object from when the trial begins|
|show_end_time|Time to end presenting the object from when the trial begins|
|motion_start_time|Time to start moving the object from when the trial begins|
|motion_end_time|Time to end moving the object from when the trial begins|
|scale|Image scaling|

Note: The *horiz(vert)_pix_frame(sec)* can be automatically calculated using the *startX(Y)*, *endX(Y)*, *motion_start_time*, and*motion_end_time*.