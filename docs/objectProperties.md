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

|Property name|Brief explanation|
|---|---|
|type|The type of the object (e.g., rect, image, or sound)|
|startX|Location in the canvas; Horizontal starting position of the object in motion|
|startY|Location in the canvas; Vertical starting position of the object in motion|
|endX|Horizontal ending position of the object in motion|
|endY|Vertical ending position of the object in motion|
|horiz_pix_frame|Horizontal pixels by which the object moves per frame|
|horiz_pix_sec|Horizontal pixels by which the object moves per second|
|vert_pix_frame|Vertical pixels by which the object moves per frame|
|vert_pix_sec|Vertical pixels by which the object moves per second|
|show_start_time|Time to start presenting the object from when the trial begins|
|show_end_time|Time to end presenting the object from when the trial begins|
|motion_start_time|Time to start moving the object from when the trial begins|
|motion_end_time|Time to end moving the object from when the trial begins|
|scale|Image scaling|

