/**
 * jspsych-psychophysics
 * Copyright (c) 2013 Daiichiro Kuroki
 * Released under the MIT license
 * 
 * jspsych-psychophysics is a plugin for conducting Web-based psychophysical experiments using jsPsych (de Leeuw, 2015). 
 *
 * http://jspsychophysics.hes.kyushu-u.ac.jp/
 *
 **/


jsPsych.plugins["psychophysics"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'psychophysics',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.COMPLEX, // This is similar to the quesions of the survey-likert. 
        array: true,
        pretty_name: 'Stimuli',
        description: 'The objects will be presented in the canvas.',
        nested: {
          startX: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'startX',
            default: 'center',
            description: 'The horizontal start position.'
          },
          startY: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'startY',
            default: 'center',
            description: 'The vertical start position.'
          },
          endX: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'endX',
            default: null,
            description: 'The horizontal end position.'
          },
          endY: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'endY',
            default: null,
            description: 'The vertical end position.'
          },
          show_start_time: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show start time',
            default: 0,
            description: 'Time to start presenting the stimuli'
          },
          show_end_time: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show end time',
            default: null,
            description: 'Time to end presenting the stimuli'
          },
          line_width: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Line width',
            default: 1,
            description: 'The line width'
          },
          lineJoin: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'lineJoin',
            default: 'miter',
            description: 'The type of the corner when two lines meet.'
          },
          miterLimit: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'miterLimit',
            default: 10,
            description: 'The maximum miter length.'
          },
          drawFunc: {
            type: jsPsych.plugins.parameterType.FUNCTION,
            pretty_name: 'Draw function',
            default: null,
            description: 'This function enables to move objects horizontally and vertically.'
          },
        }
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      canvas_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas width',
        default: window.innerWidth,
        description: 'The width of the canvas.'
      },
      canvas_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas height',
        default: window.innerHeight,
        description: 'The height of the canvas.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      background_color: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Background color',
        default: 'grey',
        description: 'The background color of the canvas.'
      },
      response_type: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'key or mouse',
        default: 'key',
        description: 'How to make a response.'
      },
      response_start_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Response start',
        default: 0,
        description: 'When the subject is allowed to respond to the stimulus.'
      },
      stepFunc: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Step function',
        default: null,
        description: 'This function enables to move objects as you wish.'        
      },
    }
  }

  let default_maxWidth;
  plugin.trial = function(display_element, trial) {

    const elm_jspsych_content = document.getElementById('jspsych-content');
    const style_jspsych_content = window.getComputedStyle(elm_jspsych_content); // stock
    default_maxWidth = style_jspsych_content.maxWidth;
    elm_jspsych_content.style.maxWidth = 'none'; // The default value is '95%'. To fit the window.

    let new_html = '<canvas id="myCanvas" class="jspsych-canvas" width=' + trial.canvas_width + ' height=' + trial.canvas_height + ' style="background-color:' + trial.background_color + ';"></canvas>';

    const motion_rt_method = 'performance'; // 'date' or 'performance'. 'performance' is better.
    let start_time;
    
    // allow to respond using keyboard or mouse
    jsPsych.pluginAPI.setTimeout(function() {
      if (trial.response_type === 'key'){
        if (trial.choices != jsPsych.NO_KEYS) {
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: motion_rt_method,
            persist: false,
            allow_held_key: false
          });
        }  
      } else {

        if (motion_rt_method == 'date') {
          start_time = (new Date()).getTime();
        } else {
          start_time = performance.now();
        }

        //window.addEventListener("mousedown", mouseDownFunc);
        canvas.addEventListener("mousedown", mouseDownFunc);
      }
    }, trial.response_start_time);

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    const canvas = document.getElementById('myCanvas');
    if ( ! canvas || ! canvas.getContext ) {
      alert('This browser does not support the canvas element.');
      return;
    }
    const ctx = canvas.getContext('2d');
    
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    
    if ((typeof trial.stimuli === 'undefined') && (trial.stepFunc === null))
      alert('You have to specify the stimuli/stepFunc parameter in the psychophysics plugin.')

    if (typeof trial.stimuli !== 'undefined') {
      for (let i = 0; i < trial.stimuli.length; i++){
        const stim = trial.stimuli[i];
        if (stim.obj_type === 'sound') {
          if (typeof stim.file === 'undefined') alert('You have to specify the file property.');
          // setup stimulus
          stim.context = jsPsych.pluginAPI.audioContext();
          if(stim.context !== null){
            stim.source = stim.context.createBufferSource();
            stim.source.buffer = jsPsych.pluginAPI.getAudioBuffer(stim.file);
            stim.source.connect(stim.context.destination);
            console.log('WebAudio')
          } else {
            stim.audio = jsPsych.pluginAPI.getAudioBuffer(stim.file);
            stim.audio.currentTime = 0;
            console.log('HTML5 audio')
          }

          
          jsPsych.pluginAPI.setTimeout(function() {
            // start audio
            if(stim.context !== null){
              //startTime = stim.context.currentTime;
              stim.source.start(stim.context.currentTime);
              //console.log('sound start 1')
            } else {
              stim.audio.play();
              //console.log('sound start 2')
            }  
          }, stim.show_start_time);

        } else { // other than sound

          if (stim.startX === 'center') stim.startX = centerX;
          if (stim.startY === 'center') stim.startY = centerY;
          if (stim.endX === 'center') stim.endX = centerX;
          if (stim.endY === 'center') stim.endY = centerY;

          if (typeof stim.motion_start_time === 'undefined') stim.motion_start_time = stim.show_start_time; // Motion will start at the same time as it is displayed.
          if (typeof stim.motion_end_time === 'undefined') stim.motion_end_time = null;
          
          stim.horiz_pix_sec = checkVelocity('horiz', stim);
          stim.vert_pix_sec = checkVelocity('vert', stim);

          // console.log(stim.horiz_pix_sec);
          // console.log(stim.vert_pix_sec);
          // console.log(stim.horiz_pix_frame);
          // console.log(stim.vert_pix_frame);

          // currentX/Y is changed per frame.
          stim.currentX = stim.startX;
          stim.currentY = stim.startY;

          if (stim.obj_type === 'image') {
            if (typeof stim.file === 'undefined') alert('You have to specify the file property.');
            stim.img = new Image();
            stim.img.src = stim.file;
          } else { // for drawing lines, rects, circles, and texts.

            if (stim.obj_type === 'line') {              
              if (typeof stim.angle === 'undefined') {
                if ((typeof stim.x1 === 'undefined') || (typeof stim.x2 === 'undefined') || (typeof stim.y1 === 'undefined') || (typeof stim.y2 === 'undefined'))
                  alert('You have to specify the angle of lines, or the start (x1, y1) and end (x2, y2) coordinates.');
                else {
                  // The start (x1, y1) and end (x2, y2) coordinates are defined.
                  // For motion, startX/Y must be calculated.
                  stim.startX = (stim.x1 + stim.x2)/2;
                  stim.startY = (stim.y1 + stim.y2)/2;
                  stim.currentX = stim.startX;
                  stim.currentY = stim.startY;
                  stim.angle = Math.atan((stim.y2 - stim.y1)/(stim.x2 - stim.x1)) * (180 / Math.PI);
                  stim.line_length = Math.sqrt((stim.x2 - stim.x1) ** 2 + (stim.y2 - stim.y1) ** 2);
                }
              } else {
                if ((typeof stim.x1 !== 'undefined') || (typeof stim.x2 !== 'undefined') || (typeof stim.y1 !== 'undefined') || (typeof stim.y2 !== 'undefined'))
                  alert('You can not specify the angle and positions of the line at the same time.')
                if (typeof stim.line_length === 'undefined') alert('You have to specify the line_length property.');
                
              }
              if (typeof stim.line_color === 'undefined') stim.line_color = '#000000';
            } else if (stim.obj_type === 'rect') {
              if (typeof stim.width === 'undefined') alert('You have to specify the width of rectangles.');
              if (typeof stim.height === 'undefined') alert('You have to specify the height of rectangles.');
              if (typeof stim.line_color === 'undefined' && typeof stim.fill_color === 'undefined') alert('You have to specify the either of line_color or fill_color.');
            } else if (stim.obj_type === 'circle') {
              // console.log('circle')
              if (typeof stim.radius === 'undefined') alert('You have to specify the radius of circles.');
              if (typeof stim.line_color === 'undefined' && typeof stim.fill_color === 'undefined') alert('You have to specify the either of line_color or fill_color.');
            } else if (stim.obj_type === 'text'){
              if (typeof stim.content === 'undefined') alert('You have to specify the content of texts.');
              if (typeof stim.text_color === 'undefined') stim.text_color = '#000000';
              if (typeof stim.text_space === 'undefined') stim.text_space = 20;
              //ctx.font = "22px 'Arial'";
            } else if (stim.obj_type === 'manual'){
              //
            } else if (stim.obj_type === 'cross'){
              if (typeof stim.line_length === 'undefined') alert('You have to specify the line_length of the fixation cross.');
              if (typeof stim.line_color === 'undefined') stim.line_color = '#000000';
            } else {
              alert('You have missed to specify the obj_type property in the ' + (i+1) + 'th object.')
            }

          }
        }
      }
    }
    
    function checkVelocity (direction, stim){
      let pix_sec , pix_frame, startPos, endPos;
      if (direction === 'horiz'){
        pix_sec = stim.horiz_pix_sec;
        pix_frame = stim.horiz_pix_frame;
        startPos = stim.startX;
        endPos = stim.endX;
      } else {
        pix_sec = stim.vert_pix_sec;
        pix_frame = stim.vert_pix_frame;
        startPos = stim.startY;
        endPos = stim.endY;
      }
      const motion_start_time = stim.motion_start_time;
      const motion_end_time = stim.motion_end_time;
      if ((typeof pix_sec !== 'undefined' || typeof pix_frame !== 'undefined') && endPos !== null && motion_end_time !== null) {
        alert('You can not specify the speed, location, and time at the same time.');
        pix_sec = 0; // stop the motion
      }
      
      if (typeof pix_sec === 'undefined') {
        if (typeof pix_frame === 'undefined') {
          if (endPos === null){
            pix_sec = 0;
          } else {
            if (motion_end_time === null) { // 止まる場所だけ決めて、運動速度も運動時間も決めていない
              alert('When you use the endX/Y property you have to specify the motion_end_time or the velocity.')
              pix_sec = 0; // stop the motion
            } else {
              pix_sec = (endPos - startPos)/(motion_end_time/1000 - motion_start_time/1000);
            }
          }
        }
      }

      return pix_sec; // This is 'undefined' when you specify the pix_frame.
    }

    //console.log(trial)

    function mouseDownFunc(e){
      
      let click_time;
      
      if (motion_rt_method == 'date') {
        click_time = (new Date()).getTime();
      } else {
        click_time = performance.now();
      }
      
      e.preventDefault();
      
      after_response({
          key: -1,
          rt: click_time - start_time,
          // clickX: e.clientX,
          // clickY: e.clientY,
          clickX: e.offsetX,
          clickY: e.offsetY,
      });
    }

    //console.log(canvas.style.left);

    

    let startStep = null;
    let sumOfStep;
    let elapsedTime;
    //let currentX, currentY;
    function step(timestamp){
      if (!startStep) {
        startStep = timestamp;
        // sumOfFrameTime = 0;
        sumOfStep = 0;
      } else {
        // sumOfFrameTime += elapsedTime;
        sumOfStep += 1;
      }
      elapsedTime = timestamp - startStep; // unit is ms. This can be used within the stepFunc().
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trial.stepFunc === null) {

        for (let i = 0; i < trial.stimuli.length; i++){
          const stim = trial.stimuli[i];
          if (elapsedTime >= stim.show_start_time && (stim.show_end_time === null || elapsedTime <= stim.show_end_time)) {

            if (elapsedTime >= stim.motion_start_time && (stim.motion_end_time === null | elapsedTime <= stim.motion_end_time)) {
              // Note that: You can not specify the speed, location, and time at the same time.

              let LtoR = true; // true = The object moves from left to right

              if (typeof stim.horiz_pix_frame === 'undefined'){ // In this case, horiz_pix_sec is defined.
                if (stim.horiz_pix_sec < 0) LtoR = false;
              } else {
                if (stim.horiz_pix_frame < 0) LtoR = false;
              }

              if (stim.endX === null || (LtoR && stim.currentX <= stim.endX) || (!LtoR && stim.currentX >= stim.endX)) {
                if (typeof stim.horiz_pix_frame === 'undefined'){ // In this case, horiz_pix_sec is defined.
                  stim.currentX = stim.startX + Math.round(stim.horiz_pix_sec * (elapsedTime-stim.motion_start_time)/1000);
                } else {
                  stim.currentX += stim.horiz_pix_frame;
                  
                }
              }

              let UtoD = true; // true = The object moves from up to down

              if (typeof stim.vert_pix_frame === 'undefined'){ // In this case, vert_pix_sec is defined.
                if (stim.vert_pix_sec < 0) UtoD = false;
              } else {
                if (stim.vert_pix_frame < 0) UtoD = false;
              }

              if (stim.endY === null || (UtoD && stim.currentY <= stim.endY) || (!UtoD && stim.currentY >= stim.endY)) {
                if (typeof stim.vert_pix_frame === 'undefined'){
                  stim.currentY = stim.startY + Math.round(stim.vert_pix_sec * (elapsedTime-stim.motion_start_time)/1000);
                } else {
                  stim.currentY += stim.vert_pix_frame;
                  
                }
              }
            }

            if (stim.obj_type === 'manual') {
              //if (trial.drawFunc === null) {
              if (stim.drawFunc === null) {
                alert('You have to specify the drawFunc() when you set the obj_type parameter to manual.');
              } else {                
                stim.drawFunc(stim, canvas, ctx);
              }
            } else if (stim.obj_type === 'image') {

              const scale = typeof stim.scale === 'undefined' ? 1:stim.scale;
              const tmpW = stim.img.width * scale;
              const tmpH = stim.img.height * scale;              
              ctx.drawImage(stim.img, 0, 0, stim.img.width, stim.img.height, stim.currentX - tmpW / 2, stim.currentY - tmpH / 2, tmpW, tmpH); 

            } else { // for line, rect, circle etc.
              ctx.beginPath();
              
              ctx.line_width = stim.line_width;
              ctx.lineJoin = stim.lineJoin;
              ctx.miterLimit = stim.miterLimit;
              
              if (stim.obj_type === 'line') {
                const theta = deg2rad(stim.angle);
                const x1 = stim.currentX - stim.line_length/2 * Math.cos(theta);
                const y1 = stim.currentY - stim.line_length/2 * Math.sin(theta);
                const x2 = stim.currentX + stim.line_length/2 * Math.cos(theta);
                const y2 = stim.currentY + stim.line_length/2 * Math.sin(theta);
                ctx.strokeStyle = stim.line_color;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.closePath();
                ctx.stroke();
              } else if (stim.obj_type === 'cross') {
                ctx.strokeStyle = stim.line_color;
                const x1 = stim.currentX;
                const y1 = stim.currentY - stim.line_length/2;
                const x2 = stim.currentX;
                const y2 = stim.currentY + stim.line_length/2;                
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                const x3 = stim.currentX - stim.line_length/2;
                const y3 = stim.currentY;
                const x4 = stim.currentX + stim.line_length/2;
                const y4 = stim.currentY;                
                ctx.moveTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
                ctx.stroke();
              } else if (stim.obj_type === 'rect') {
                // First, draw a filled rectangle, then an edge.
                if (typeof stim.fill_color !== 'undefined') {
                  ctx.fillStyle = stim.fill_color;
                  ctx.fillRect(stim.currentX-stim.width/2, stim.currentY-stim.height/2, stim.width, stim.height); 
                } 
                if (typeof stim.line_color !== 'undefined') {
                  ctx.strokeStyle = stim.line_color;
                  ctx.strokeRect(stim.currentX-stim.width/2, stim.currentY-stim.height/2, stim.width, stim.height);
                }
              } else if (stim.obj_type === 'circle') {
                if (typeof stim.fill_color !== 'undefined') {
                  ctx.fillStyle = stim.fill_color;
                  ctx.arc(stim.currentX, stim.currentY, stim.radius, 0, Math.PI*2, false);
                  ctx.fill();
                } 
                if (typeof stim.line_color !== 'undefined') {
                  ctx.strokeStyle = stim.line_color;
                  ctx.arc(stim.currentX, stim.currentY, stim.radius, 0, Math.PI*2, false);
                  ctx.stroke();
                }
              } else if (stim.obj_type === 'text') {
                if (typeof stim.font !== 'undefined') ctx.font = stim.font;

                ctx.fillStyle = stim.text_color;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle"

                let column = [''];
                let line = 0;
                for (let i = 0; i < stim.content.length; i++) {
                    let char = stim.content.charAt(i);

                    if (char == "\n") {    
                        line++;
                        column[line] = '';
                    }
                    column[line] += char;
                }

                for (let i = 0; i < column.length; i++) {
                    ctx.fillText(column[i], stim.currentX, stim.currentY - stim.text_space * (column.length-1) / 2 + stim.text_space * i);
                }
              }
            }
          }
        }
      } else {
        trial.stepFunc(trial, canvas, ctx, elapsedTime); // customize
      }
    
      frameRequestID = window.requestAnimationFrame(step);
    }
    
    let frameRequestID = window.requestAnimationFrame(step);

    
    deg2rad = function (degrees){
      return degrees / 180 * Math.PI;
    }

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {
      // console.log(default_maxWidth)
      document.getElementById('jspsych-content').style.maxWidth = default_maxWidth; // restore
      window.cancelAnimationFrame(frameRequestID); //Cancels the frame request
      //window.removeEventListener("mousedown", mouseDownFunc);
      canvas.removeEventListener("mousedown", mouseDownFunc);

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      for (let i = 0; i < trial.stimuli.length; i++){
        const stim = trial.stimuli[i];
        //console.log(stim);
        if (typeof stim.context !== 'undefined') {
          if(stim.context !== null){
            stim.source.stop();
            stim.source.onended = function() { }
          } else {
            stim.audio.pause();
            //audio.removeEventListener('ended', end_trial);
          }
        }
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial　音の再生時からの反応時間をとるわけではないから不要？
      // if(context !== null && response.rt !== null){
      //   response.rt = Math.round(response.rt * 1000);
      // }

      // gather the data to store for the trial
      if (typeof response.clickX !== 'undefined'){
        var trial_data = {
          "rt": response.rt,
          "response_type": trial.response_type,
          //"stimulus": trial.stimuli,
          "key_press": response.key,
          "avg_frame_time": elapsedTime/sumOfStep,
          "click_x": response.clickX,
          "click_y": response.clickY
          // "click_x": response.clickX - centerX,
          // "click_y": response.clickY- centerY
        };
      } else {
        var trial_data = {
          "rt": response.rt,
          "response_type": trial.response_type,
          //"stimulus": trial.stimuli,
          "key_press": response.key,
          "avg_frame_time": elapsedTime/sumOfStep,
        };

      }
      
      

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // getAvgSD = function(){

    // }

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    // if (trial.choices != jsPsych.NO_KEYS) {
    //   var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    //     callback_function: after_response,
    //     valid_responses: trial.choices,
    //     rt_method: 'date',
    //     persist: false,
    //     allow_held_key: false
    //   });
    // }

    // hide stimulus if stimulus_duration is set
    // if (trial.stimulus_duration !== null) {
    //   jsPsych.pluginAPI.setTimeout(function() {
    //     //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   }, trial.stimulus_duration);
    // }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
