/**
 * jspsych-psychophysics
 * Copyright (c) 2019 Daiichiro Kuroki
 * Released under the MIT license
 * 
 * jspsych-psychophysics is a plugin for conducting online/Web-based psychophysical experiments using jsPsych (de Leeuw, 2015). 
 *
 * Please see 
 * http://jspsychophysics.hes.kyushu-u.ac.jp/
 * about how to use this plugin.
 *
 **/

 /* global jsPsych, math, numeric, PIXI, jsPsychModule */

 /* exported jsPsychPsychophysics */

 var jsPsychPsychophysics = (function (jspsych) {
  "use strict";
  // console.log(jspsych)

  // console.log(`jsPsych Version ${jspsych.version()}`)
  console.log('Psychophysics Version 3.3.0')

  const info = {
    name: 'psychophysics',
    description: 'A plugin for conducting online/Web-based psychophysical experiments',
    parameters: {
      stimuli: {
        type: jspsych.ParameterType.COMPLEX, // This is similar to the quesions of the survey-likert. 
        array: true,
        pretty_name: 'Stimuli',
        description: 'The objects will be presented in the canvas.',
        nested: {
          startX: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'startX',
            default: 'center',
            description: 'The horizontal start position.'
          },
          startY: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'startY',
            default: 'center',
            description: 'The vertical start position.'
          },
          endX: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'endX',
            default: null,
            description: 'The horizontal end position.'
          },
          endY: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'endY',
            default: null,
            description: 'The vertical end position.'
          },
          show_start_time: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Show start time',
            default: 0,
            description: 'Time to start presenting the stimuli'
          },
          show_end_time: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Show end time',
            default: null,
            description: 'Time to end presenting the stimuli'
          },
          show_start_frame: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Show start frame',
            default: 0,
            description: 'Time to start presenting the stimuli in frames'
          },
          show_end_frame: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Show end frame',
            default: null,
            description: 'Time to end presenting the stimuli in frames'
          },
          line_width: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'Line width',
            default: 1,
            description: 'The line width'
          },
          lineJoin: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'lineJoin',
            default: 'miter',
            description: 'The type of the corner when two lines meet.'
          },
          miterLimit: {
            type: jspsych.ParameterType.INT,
            pretty_name: 'miterLimit',
            default: 10,
            description: 'The maximum miter length.'
          },
          drawFunc: { // e.g., call-function
            type: jspsych.ParameterType.FUNCTION,
            pretty_name: 'Draw function',
            default: null,
            description: 'This function enables to move objects horizontally and vertically.'
          },
          change_attr: {
            type: jspsych.ParameterType.FUNCTION,
            pretty_name: 'Change attributes',
            default: null,
            description: 'This function enables to change attributes of objects immediately before drawing.'
          },
          is_frame: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'time is in frames',
            default: false,
            description: 'If true, time is treated in frames.'
          },
          prepared: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'Stimulus prepared flag',
            default: false,
            description: 'If true, the stimulus is prepared for presentation'
          },
          origin_center: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'origin_center',
            default: false,
            description: 'The origin is the center of the window.'
          },
          is_presented: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'is_presented',
            default: false,
            description: 'This will be true when the stimulus is presented.'
          },
          trial_ends_after_audio: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'Trial ends after audio',
            default: false,
            description: 'If true, then the trial will end as soon as the audio file finishes playing.'
          },
          modulate_color: {
            type: jspsych.ParameterType.FLOAT,
            array: true,
            pretty_name: 'modulate_color',
            default: [1.0, 1.0, 1.0, 1.0],
            description: 'The base RGBA array of the gabor patch.'
          },
          offset_color: {
            type: jspsych.ParameterType.FLOAT,
            array: true,
            pretty_name: 'offset_color',
            default: [0.5, 0.5, 0.5, 0.0],
            description: 'The offset RGBA array of the gabor patch.'
          },
          min_validModulationRange: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'min_validModulationRange',
            default: -2,
            description: 'The minimum of the validation range of the gabor patch.'
          },
          max_validModulationRange: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'max_validModulationRange',
            default: 2,
            description: 'The maximum of the validation range of the gabor patch.'
          },
          tilt: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'tilt',
            default: 0,
            description: 'The angle of the gabor patch in degrees.'
          },
          sf: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'spatial frequency',
            default: 0.05,
            description: 'The spatial frequency of the gabor patch.'
          },
          phase: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'phase',
            default: 0,
            description: 'The phase (degrees) of the gabor patch.'
          },
          sc: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'standard deviation',
            default: 20,
            description: 'The standard deviation of the distribution.'
          },
          contrast: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'contrast',
            default: 20,
            description: 'The contrast of the gabor patch.'
          },
          contrastPreMultiplicator: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'contrastPreMultiplicator',
            default: 1,
            description: 'A scaling factor'
          },
          drift: {
            type: jspsych.ParameterType.FLOAT,
            pretty_name: 'drift',
            default: 0,
            description: 'The velocity of the drifting gabor patch.'
          },
          method: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'gabor_drawing_method',
            default: 'numeric',
            description: 'The method of drawing the gabor patch.'
          },
          disableNorm: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'disableNorm',
            default: false,
            description: 'Disable normalization of the gaussian function.'
          },
          disableGauss: {
            type: jspsych.ParameterType.BOOL,
            pretty_name: 'disableGauss',
            default: false,
            description: 'Disable to convolve with a Gaussian.'
          },
          mask_func: {
            type: jspsych.ParameterType.FUNCTION,
            pretty_name: 'Masking function',
            default: null,
            description: 'Masking the image manually.'
          },
          text_color: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'text color',
            default: '#000000',
            description: 'The color of the text.'
          },
          fontStyle: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'font style',
            default: 'normal',
            description: 'Font style'
          },
          fontWeight: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'font weight',
            default: 'normal',
            description: 'Font weight'
          },
          fontSize: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'font size',
            default: '20px',
            description: 'Font size'
          },
          fontFamily: {
            type: jspsych.ParameterType.STRING,
            pretty_name: 'font family',
            default: 'Verdana, Arial, Helvetica, sans-serif',
            description: 'Font family'
          }
        }
      },
      pixi: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Enable Pixi',
        default: false,
        description: 'If true, this plugin will use PixiJS'
      },
      choices: {
        type: jspsych.ParameterType.KEYS,
        array: true,
        pretty_name: 'Choices',
        default: "ALL_KEYS",        
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      canvas_width: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Canvas width',
        default: null,
        description: 'The width of the canvas.'
      },
      canvas_height: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Canvas height',
        default: null,
        description: 'The height of the canvas.'
      },
      canvas_offsetX: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Canvas offset X',
        default: 0,
        description: 'This value is subtracted from the width of the canvas.'
      },
      canvas_offsetY: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Canvas offset Y',
        default: 8,
        description: 'This value is subtracted from the height of the canvas.'
      },
      trial_duration: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      background_color: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Background color',
        default: 'grey',
        description: 'The background color of the canvas.'
      },
      response_type: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'key, mouse or button',
        default: 'key',
        description: 'How to make a response.'
      },
      response_start_time: {
        type: jspsych.ParameterType.INT,
        pretty_name: 'Response start',
        default: 0,
        description: 'When the subject is allowed to respond to the stimulus.'
      },
      raf_func: {
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Step function',
        default: null,
        description: 'This function enables to move objects as you wish.'        
      },
      mouse_down_func: {
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Mouse down function',
        default: null,
        description: 'This function is set to the event listener of the mousedown.'        
      },
      mouse_move_func: {
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Mouse move function',
        default: null,
        description: 'This function is set to the event listener of the mousemove.'        
      },
      mouse_up_func: {
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Mouse up function',
        default: null,
        description: 'This function is set to the event listener of the mouseup.'        
      },
      key_down_func:{
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Key down function',
        default: null,
        description: 'This function is set to the event listener of the keydown.'              
      },
      key_up_func:{
        type: jspsych.ParameterType.FUNCTION,
        pretty_name: 'Key up function',
        default: null,
        description: 'This function is set to the event listener of the keyup.'              
      },
      button_choices: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Button choices',
        // default: undefined,
        default: ['Next'],
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jspsych.ParameterType.HTML_STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      vert_button_margin: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      horiz_button_margin: {
        type: jspsych.ParameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      clear_canvas: {
        type: jspsych.ParameterType.BOOL,
        pretty_name: 'clear_canvas',
        default: true,
        description: 'Clear the canvas per frame.'
      }
    }
  };

  /**
   * ** Psychophysics **
   *
   * Multiple stimulus objects that are frequently used in psychophysical experiments can be used in a single trial.
   *
   * @author Daiichiro Kuroki
   * @see {@link https://jspsychophysics.hes.kyushu-u.ac.jp/ DOCUMENTATION LINK TEXT}
   */
  class PsychophysicsPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      // returns an array starting with 'start_num' of which length is 'count'.
      function getNumbering(start_num, count) {
        return [...Array(count)].map((_, i) => i + start_num) 
      }

      const canvas_for_color = document.createElement('canvas');
      canvas_for_color.id = 'canvas_for_color';
      canvas_for_color.style.display = 'none'
      const ctx_for_color = canvas_for_color.getContext('2d');

      // 'blue' -> 255
      function getColorNum(color_str){
        ctx_for_color.fillStyle = color_str
        const col = ctx_for_color.fillStyle
        const col2 = col[1] + col[2] + col[3] + col[4] + col[5] + col[6] + col[7] + col[8]
        return parseInt(col2, 16)
      }
      trial.getColorNum = getColorNum;
  
      // Class for visual and audio stimuli
      class psychophysics_stimulus {
        constructor(stim) {
          Object.assign(this, stim)
          const keys = Object.keys(this)
          for (var i = 0; i < keys.length; i++) {
              if (typeof this[keys[i]] === "function") {
                // オブジェクト内のfunctionはここで指定する必要がある。そうしないとここで即時に実行されて、その結果が関数名に代入される
                if (keys[i] === "drawFunc") continue
                if (keys[i] === "change_attr") continue
                if (keys[i] === "mask_func") continue
  
                this[keys[i]] = this[keys[i]].call()
              }
          }
        }
      }
  
      class visual_stimulus extends psychophysics_stimulus {
        constructor(stim) {
          super(stim);
          
          if (this.startX === 'center') {
            if (this.origin_center) {
              this.startX = 0;
            } else {
              this.startX = centerX;
            }
          }
          if (this.startY === 'center') {
            if (this.origin_center) {
              this.startY = 0;
            } else {
              this.startY = centerY;
            }
          }
          if (this.endX === 'center') {
            if (this.origin_center) {
              this.endX = 0;
            } else {
              this.endX = centerX;
            }
          }
          if (this.endY === 'center') {
            if (this.origin_center) {
              this.endY = 0;
            } else {
              this.endY = centerY;
            }
          }
  
          if (this.origin_center) {
            this.startX = this.startX + centerX;
            this.startY = this.startY + centerY;
            if (this.endX !== null) this.endX = this.endX + centerX;
            if (this.endY !== null) this.endY = this.endY + centerY;
          }
  
          if (typeof this.motion_start_time === 'undefined') this.motion_start_time = this.show_start_time; // Motion will start at the same time as it is displayed.
          if (typeof this.motion_end_time === 'undefined') this.motion_end_time = null;
          if (typeof this.motion_start_frame === 'undefined') this.motion_start_frame = this.show_start_frame; // Motion will start at the same frame as it is displayed.
          if (typeof this.motion_end_frame === 'undefined') this.motion_end_frame = null;
          
          if (trial.clear_canvas === false && this.show_end_time !== null) alert('You can not specify the show_end_time with the clear_canvas property.');
  
          // calculate the velocity (pix/sec) using the distance and the time.
          // If the pix_sec is specified, the calc_pix_per_sec returns the intact pix_sec.
          // If the pix_frame is specified, the calc_pix_per_sec returns an undefined.
          this.horiz_pix_sec = this.calc_pix_per_sec('horiz');
          this.vert_pix_sec = this.calc_pix_per_sec('vert');
  
          // currentX/Y is changed per frame.
          this.currentX = this.startX;
          this.currentY = this.startY;
  
        }
  
        calc_pix_per_sec (direction){
          let pix_sec , pix_frame, startPos, endPos;
          if (direction === 'horiz'){
            pix_sec = this.horiz_pix_sec;
            pix_frame = this.horiz_pix_frame;
            startPos = this.startX;
            endPos = this.endX;
          } else {
            pix_sec = this.vert_pix_sec;
            pix_frame = this.vert_pix_frame;
            startPos = this.startY;
            endPos = this.endY;
          }
          const motion_start_time = this.motion_start_time;
          const motion_end_time = this.motion_end_time;
          if ((typeof pix_sec !== 'undefined' || typeof pix_frame !== 'undefined') && endPos !== null && motion_end_time !== null) {
            alert('You can not specify the speed, location, and time at the same time.');
            pix_sec = 0; // stop the motion
          }
          
          if (typeof pix_sec !== 'undefined' || typeof pix_frame !== 'undefined') return pix_sec; // returns an 'undefined' when you specify the pix_frame.
    
          // The velocity is not specified
              
          if (endPos === null) return 0; // This is not motion.
    
          if (startPos === endPos) return 0; // This is not motion.
          
    
          // The distance is specified
    
          if (motion_end_time === null) { // Only the distance is known
            alert('Please specify the motion_end_time or the velocity when you use the endX/Y property.')
            return 0; // stop the motion
          }
    
          return (endPos - startPos)/(motion_end_time/1000 - motion_start_time/1000);
        }
  
        calc_current_position (direction, elapsed){
          let pix_frame, pix_sec, current_pos, start_pos, end_pos;
  
          if (direction === 'horiz'){
            pix_frame = this.horiz_pix_frame
            pix_sec = this.horiz_pix_sec
            current_pos = this.currentX
            start_pos = this.startX
            end_pos = this.endX
          } else {
            pix_frame = this.vert_pix_frame
            pix_sec = this.vert_pix_sec
            current_pos = this.currentY
            start_pos = this.startY
            end_pos = this.endY
          }
  
          const motion_start = this.is_frame ? this.motion_start_frame : this.motion_start_time;
          const motion_end = this.is_frame ? this.motion_end_frame : this.motion_end_time;
  
          if (elapsed < motion_start) return current_pos
          if (motion_end !== null && elapsed >= motion_end) return current_pos
  
          // Note that: You can not specify the speed, location, and time at the same time.
  
          let ascending = true; // true = The object moves from left to right, or from up to down.
  
          if (typeof pix_frame === 'undefined'){ // In this case, pix_sec is defined.
            if (pix_sec < 0) ascending = false;
          } else {
            if (pix_frame < 0) ascending = false;
          }
  
          if (end_pos === null || (ascending && current_pos <= end_pos) || (!ascending && current_pos >= end_pos)) {
            if (typeof pix_frame === 'undefined'){ // In this case, pix_sec is defined.
              return start_pos + Math.round(pix_sec * (elapsed - motion_start)/1000); // This should be calculated in seconds.
            } else {
              return current_pos + pix_frame; 
            }
          } else {
            return current_pos
          }
        }
  
        update_position(elapsed){
          this.currentX = this.calc_current_position ('horiz', elapsed)
          this.currentY = this.calc_current_position ('vert', elapsed)
        }
      }
  
      class image_stimulus extends visual_stimulus {
        constructor(stim){
          super(stim);
  
          if (typeof this.file === 'undefined') {
            alert('You have to specify the file property.');
            return;
          }

          this.img = new Image();
          this.img.src = this.file;
          this.img.onload = () => {
            const tmpRatio = trial.pixi ? 1 : window.devicePixelRatio

            if (typeof this.mask === 'undefined' && typeof this.filter === 'undefined') {
              if (trial.pixi){
                this.pixi_obj = PIXI.Sprite.from(this.file)
                init_pixi_obj(this.pixi_obj)
              }
              this.prepared = true
              return
            } 

            // For masking and filtering, draw the image on another invisible canvas and get its pixel data using the getImageData function.
            // Note that masking can only be applied to image files uploaded to a web server.
  
            if (document.getElementById('invisible_canvas') === null) {
              const canvas_element = document.createElement('canvas');
              canvas_element.id = 'invisible_canvas';
              display_element.appendChild(canvas_element)
              canvas_element.style.display = 'none'
            } 
  
            const invisible_canvas = document.getElementById('invisible_canvas');
            const canvas_info = set_canvas(invisible_canvas, tmpRatio, this.img.width, this.img.height)
            const invisible_ctx = canvas_info.ctx
            invisible_ctx.clearRect(0, 0, invisible_canvas.width, invisible_canvas.height);
  
            if (typeof this.filter === 'undefined') {
              invisible_ctx.filter = 'none'
            } else {
              invisible_ctx.filter = this.filter
            }
    
            invisible_ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
            if (typeof this.mask === 'undefined'){ // Filtering only
              const invisible_img = invisible_ctx.getImageData(0, 0, this.img.width * tmpRatio, this.img.height * tmpRatio);
              if (trial.pixi){
                const filtered_texture = new PIXI.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height)
                this.pixi_obj = new PIXI.Sprite(filtered_texture)
                init_pixi_obj(this.pixi_obj)
              } else {
                this.masking_img = invisible_img;
              }
              this.prepared = true
              return
            }
  
            if (this.mask === 'manual'){
              if (this.mask_func === null) {
                alert('You have to specify the mask_func when applying masking manually.');
                return;
              }

              const manual_img = this.mask_func(invisible_canvas);
              if (trial.pixi){
                const manual_texture = new PIXI.Texture.fromBuffer(manual_img.data, manual_img.width, manual_img.height)
                this.pixi_obj = new PIXI.Sprite(manual_texture)
                init_pixi_obj(this.pixi_obj)
              } else {
                this.masking_img = manual_img
              }
              this.prepared = true
              return
            }
      
            if (this.mask === 'gauss'){
              if (typeof this.width === 'undefined') {
                alert('You have to specify the width property for the gaussian mask. For example, 200.');
                return;
              }
              const gauss_width = this.width * tmpRatio
              
              // Getting only the areas to be filtered, not the whole image.
              const invisible_img = invisible_ctx.getImageData(
                this.img.width * tmpRatio / 2 - gauss_width/2, 
                this.img.height * tmpRatio / 2 - gauss_width/2, 
                gauss_width, gauss_width);
  
              let coord_array = getNumbering(Math.round(0 - gauss_width/2), gauss_width)
              let coord_matrix_x = []
              for (let i = 0; i< gauss_width; i++){
                coord_matrix_x.push(coord_array)
              }
      
              coord_array = getNumbering(Math.round(0 - gauss_width/2), gauss_width)
              let coord_matrix_y = []
              for (let i = 0; i< gauss_width; i++){
                coord_matrix_y.push(coord_array)
              }
      
              let exp_value;
              const adjusted_sc = this.sc * tmpRatio
              if (this.method === 'math') {
                const matrix_x = math.matrix(coord_matrix_x) // Convert to Matrix data
                const matrix_y = math.transpose(math.matrix(coord_matrix_y))
                const x_factor = math.multiply(-1, math.square(matrix_x))
                const y_factor = math.multiply(-1, math.square(matrix_y))
                const varScale = 2 * math.square(adjusted_sc)
                const tmp = math.add(math.divide(x_factor, varScale), math.divide(y_factor, varScale));
                exp_value = math.exp(tmp)
              } else { // numeric
                const matrix_x = coord_matrix_x
                const matrix_y = numeric.transpose(coord_matrix_y)
                const x_factor = numeric.mul(-1, numeric.pow(matrix_x, 2))
                const y_factor = numeric.mul(-1, numeric.pow(matrix_y, 2))
                const varScale = 2 * numeric.pow([adjusted_sc], 2)
                const tmp = numeric.add(numeric.div(x_factor, varScale), numeric.div(y_factor, varScale));
                exp_value = numeric.exp(tmp)
              }
            
              let cnt = 3;
              for (let i = 0; i < gauss_width; i++) {
                for (let j = 0; j < gauss_width; j++) {
                  invisible_img.data[cnt] = exp_value[i][j] * 255 // 透明度を変更
                  cnt = cnt + 4;
                }
              }

              if (trial.pixi){
                const gauss_texture = new PIXI.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height)
                this.pixi_obj = new PIXI.Sprite(gauss_texture)
                init_pixi_obj(this.pixi_obj)
              } else {
                this.masking_img = invisible_img;
              }
              this.prepared = true
              return
            }
  
            if (this.mask === 'circle' || this.mask === 'rect'){
              if (typeof this.width === 'undefined') {
                alert('You have to specify the width property for the circle/rect mask.');
                return;
              }
              if (typeof this.height === 'undefined') {
                alert('You have to specify the height property for the circle/rect mask.');
                return;
              }
              if (typeof this.center_x === 'undefined') {
                alert('You have to specify the center_x property for the circle/rect mask.');
                return;
              }
              if (typeof this.center_y === 'undefined') {
                alert('You have to specify the center_y property for the circle/rect mask.');
                return;
              }

              const oval_width = this.width * tmpRatio
              const oval_height = this.height * tmpRatio
              // Note that the center of a circle or rectangle does not necessarily coincide with the center of the image.
              const oval_cx = this.center_x * tmpRatio
              const oval_cy = this.center_y * tmpRatio

              // Getting only the areas to be filtered, not the whole image.
              const invisible_img = invisible_ctx.getImageData(oval_cx - oval_width/2, oval_cy - oval_height/2, oval_width, oval_height);
              const cx = invisible_img.width/2
              const cy = invisible_img.height/2
  
              // When this.mask === 'rect', the alpha (transparency) value does not chage at all.
              if (this.mask === 'circle'){
                let cnt = 3;
                for (let j = 0; j < oval_height; j++) {
                  for (let i = 0; i < oval_width; i++) {
                    const tmp = Math.pow(i-cx, 2)/Math.pow(cx, 2) + Math.pow(j-cy, 2)/Math.pow(cy, 2)
                    if (tmp > 1){
                      invisible_img.data[cnt] = 0 // invisible
                    }
                    cnt = cnt + 4;
                  }
                }
              }
              
              if (trial.pixi){
                const cropped_texture = new PIXI.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height)
                this.pixi_obj = new PIXI.Sprite(cropped_texture)
                init_pixi_obj(this.pixi_obj)
              } else {
                this.masking_img = invisible_img;
              }
              this.prepared = true
              return
            }
          }
        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {
            if (this.mask || this.filter){
              // Note that filtering is done to the invisible_ctx.
              ctx.putImageData(this.masking_img, 
                this.currentX * window.devicePixelRatio - this.masking_img.width/2, 
                this.currentY * window.devicePixelRatio - this.masking_img.height/2);
            } else {
              if (typeof this.scale !== 'undefined' && typeof this.image_width !== 'undefined') alert('You can not specify the scale and image_width at the same time.')
              if (typeof this.scale !== 'undefined' && typeof this.image_height !== 'undefined') alert('You can not specify the scale and image_height at the same time.')
              if (typeof this.image_height !== 'undefined' && typeof this.image_width !== 'undefined') alert('You can not specify the image_height and image_width at the same time.')

              let scale = 1

              if (typeof this.scale !== 'undefined') scale = this.scale
              if (typeof this.image_width !== 'undefined') scale = this.image_width/this.img.width
              if (typeof this.image_height !== 'undefined') scale = this.image_height/this.img.height

              const tmpW = this.img.width * scale;
              const tmpH = this.img.height * scale;              
              ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.currentX - tmpW / 2, this.currentY - tmpH / 2, tmpW, tmpH);   
            }
          }
        }
      }
  
      class gabor_stimulus extends visual_stimulus {
        constructor(stim){
          super(stim);

          if (!trial.pixi){
            this.update_count = 0;
            this.prepared = true;
            return
          }

          const fragmentSrc = `
            precision mediump float;

            uniform float Contrast;
            uniform float Phase;
            uniform float angle_in_degrees; // tilt
            uniform float spatial_freq;
            uniform float SpaceConstant;
            uniform float disableNorm;
            uniform float disableGauss;
            uniform float modulateColor_R;
            uniform float modulateColor_G;
            uniform float modulateColor_B;
            uniform float modulateColor_Alpha;
            uniform float offset_R;
            uniform float offset_G;
            uniform float offset_B;
            uniform float offset_Alpha;
            uniform float centerX;
            uniform float centerY;
            uniform float contrastPreMultiplicator;
            uniform float min_validModulationRange;
            uniform float max_validModulationRange;

            void main() {
                const float twopi     = 2.0 * 3.141592654;
                const float sqrtof2pi = 2.5066282746;
                /* Conversion factor from degrees to radians: */
                const float deg2rad = 3.141592654 / 180.0;
                
                float Angle = deg2rad * angle_in_degrees;
                float FreqTwoPi = spatial_freq * twopi;
                float Expmultiplier = -0.5 / (SpaceConstant * SpaceConstant);
                float mc = disableNorm + (1.0 - disableNorm) * (1.0 / (sqrtof2pi * SpaceConstant));

                vec3 modulateColor = vec3(modulateColor_R, modulateColor_G, modulateColor_B);

                vec3 baseColor = modulateColor * mc * Contrast * contrastPreMultiplicator;

                vec2 pos = gl_FragCoord.xy - vec2(centerX, centerY);

                /* Compute (x,y) distance weighting coefficients, based on rotation angle: */
                vec2 coeff = vec2(cos(Angle), sin(Angle)) * FreqTwoPi;

                /* Evaluate sine grating at requested position, angle and phase: */
                float sv = sin(dot(coeff, pos) + Phase);

                /* Compute exponential hull for the gabor: */
                float ev = disableGauss + (1.0 - disableGauss) * exp(dot(pos, pos) * Expmultiplier);

                /* Multiply/Modulate base color and alpha with calculated sine/gauss      */
                /* values, add some constant color/alpha Offset, assign as final fragment */
                /* output color: */

                vec4  Offset = vec4(offset_R, offset_G, offset_B, offset_Alpha);
                        
                // Be careful not to change the transparency. Note that the type of the baseColor valuable is vec3 not vec4.
                gl_FragColor = vec4(baseColor * clamp(ev * sv, min_validModulationRange, max_validModulationRange), modulateColor_Alpha) + Offset;

          }`
            
          // const gabor_width = this.width * window.devicePixelRatio; // No need to consider the devicePixelRatio property.
          const gabor_width = this.width;
          // create a null image element
          const img_element = document.createElement('img');
          img_element.width = gabor_width;
          img_element.height = gabor_width;
          const gabor_sprite = PIXI.Sprite.from(img_element);
          gabor_sprite.visible = false;

          // center the sprite's anchor point
          gabor_sprite.anchor.set(0.5);
          gabor_sprite.x = pixi_app.screen.width / 2;
          gabor_sprite.y = pixi_app.screen.height / 2;

          const uniforms = {
            Contrast: this.contrast,
            Phase: this.phase,
            angle_in_degrees: 90 + this.tilt, // Add 90 degrees for compatibility with previous versions.
            spatial_freq: this.sf,
            SpaceConstant: this.sc,
            disableNorm: this.disableNorm ? 1 : 0,
            disableGauss: this.disableGauss ? 1 : 0,
            modulateColor_R: this.modulate_color[0],
            modulateColor_G: this.modulate_color[1],
            modulateColor_B: this.modulate_color[2],
            modulateColor_Alpha: this.modulate_color[3],
            offset_R: this.offset_color[0],
            offset_G: this.offset_color[1],
            offset_B: this.offset_color[2],
            offset_Alpha: this.offset_color[3],
            centerX: pixi_app.screen.width / 2,
            centerY: pixi_app.screen.height / 2,
            contrastPreMultiplicator: this.contrastPreMultiplicator,
            min_validModulationRange: -2,
            max_validModulationRange: 2,
          }
          const myFilter = new PIXI.Filter(null, fragmentSrc, uniforms)
      
          pixi_app.stage.addChild(gabor_sprite);
      
          gabor_sprite.filters = [myFilter];
          this.pixi_obj = gabor_sprite;
          this.prepared = true
        }
  
        show(){
          if (trial.pixi){
            this.pixi_obj.filters[0].uniforms.Phase += this.drift
            this.pixi_obj.x = this.currentX;
            this.pixi_obj.y = this.currentY;
            this.pixi_obj.filters[0].uniforms.centerX = this.currentX;
            this.pixi_obj.filters[0].uniforms.centerY = pixi_app.screen.height - this.currentY;
            this.pixi_obj.visible = true
          } else {
            ctx.putImageData(this.img_data, 
              this.currentX * window.devicePixelRatio - this.img_data.width/2, 
              this.currentY * window.devicePixelRatio - this.img_data.height/2)
          }
        }

        update_position(elapsed){          
          this.currentX = this.calc_current_position ('horiz', elapsed)
          this.currentY = this.calc_current_position ('vert', elapsed)
  
          if (trial.pixi) return

          if (typeof this.img_data !== 'undefined' && this.drift === 0) return
  
          let gabor_data;
          // console.log(this.method)
  
          // The following calculation method is based on Psychtoolbox (MATLAB), 
          // although it doesn't use procedural texture mapping.
          // I also have referenced the gaborgen-js code: https://github.com/jtth/gaborgen-js 
  
          // You can choose either the numeric.js or the math.js as the method for drawing gabor patches.
          // The numeric.js is considerably faster than the math.js, but the latter is being developed more aggressively than the former.
          // Note that "Math" and "math" are not the same.
  
          const gabor_width = this.width * window.devicePixelRatio;
          let coord_array = getNumbering(Math.round(0 - gabor_width/2), gabor_width)
          let coord_matrix_x = []
          for (let i = 0; i< gabor_width; i++){
            coord_matrix_x.push(coord_array)
          }
  
          coord_array = getNumbering(Math.round(0 - gabor_width/2), gabor_width)
          let coord_matrix_y = []
          for (let i = 0; i< gabor_width; i++){
            coord_matrix_y.push(coord_array)
          }
  
          const tilt_rad = deg2rad(90 - this.tilt)
  
          // These values are scalars.
          const a = Math.cos(tilt_rad) * this.sf / window.devicePixelRatio * (2 * Math.PI) // radians
          const b = Math.sin(tilt_rad) * this.sf / window.devicePixelRatio * (2 * Math.PI)
          const adjusted_sc = this.sc * window.devicePixelRatio
          let multConst = 1 / (Math.sqrt(2*Math.PI) * adjusted_sc) 
          if (this.disableNorm) multConst = 1
  
          
          // const phase_rad = deg2rad(this.phase)
          const phase_rad = deg2rad(this.phase + this.drift * this.update_count)
          this.update_count += 1
  
          if (this.method === 'math') {
            const matrix_x = math.matrix(coord_matrix_x) // Convert to Matrix data
            const matrix_y = math.transpose(math.matrix(coord_matrix_y))
            const x_factor = math.multiply(-1, math.square(matrix_x))
            const y_factor = math.multiply(-1, math.square(matrix_y))
            const tmp1 = math.add(math.multiply(a, matrix_x), math.multiply(b, matrix_y), phase_rad) // radians
            const sinWave = math.sin(tmp1)
            const varScale = 2 * math.square(adjusted_sc)
            const tmp2 = math.add(math.divide(x_factor, varScale), math.divide(y_factor, varScale));
            const exp_value = this.disableGauss ? 1 : math.exp(tmp2)
            const tmp3 = math.dotMultiply(exp_value, sinWave)
            const tmp4 = math.multiply(multConst, tmp3)
            const tmp5 = math.multiply(this.contrast, math.multiply(tmp4, this.contrastPreMultiplicator))
            const m = math.multiply(256, math.add(0.5, tmp5))
            gabor_data = m._data
          } else { // numeric
            const matrix_x = coord_matrix_x
            const matrix_y = numeric.transpose(coord_matrix_y)
            const x_factor = numeric.mul(-1, numeric.pow(matrix_x, 2))
            const y_factor = numeric.mul(-1, numeric.pow(matrix_y, 2))
            const tmp1 = numeric.add(numeric.mul(a, matrix_x), numeric.mul(b, matrix_y), phase_rad) // radians
            const sinWave = numeric.sin(tmp1)
            const varScale = 2 * numeric.pow([adjusted_sc], 2)
            const tmp2 = numeric.add(numeric.div(x_factor, varScale), numeric.div(y_factor, varScale));
            const exp_value = this.disableGauss ? 1 : numeric.exp(tmp2)
            const tmp3 = numeric.mul(exp_value, sinWave)
            const tmp4 = numeric.mul(multConst, tmp3)
            const tmp5 = numeric.mul(this.contrast, numeric.mul(tmp4, this.contrastPreMultiplicator))
            const m = numeric.mul(256, numeric.add(0.5, tmp5))
            gabor_data = m
          }
          // console.log(gabor_data)
          const imageData = ctx.createImageData(gabor_width, gabor_width);
          let cnt = 0;
          // Iterate through every pixel
          for (let i = 0; i < gabor_width; i++) {
            for (let j = 0; j < gabor_width; j++) {
              // Modify pixel data
              imageData.data[cnt] = Math.round(gabor_data[i][j]);  // R value
              cnt++;
              imageData.data[cnt] = Math.round(gabor_data[i][j]);  // G
              cnt++;
              imageData.data[cnt] = Math.round(gabor_data[i][j]);  // B
              cnt++;
              imageData.data[cnt] = 255;  // alpha
              cnt++;
            }
          }
  
          this.img_data = imageData
        }
      }
  
      class line_stimulus extends visual_stimulus{
        constructor(stim){
          super(stim)
  
          if (typeof this.angle === 'undefined') {
            if ((typeof this.x1 === 'undefined') || (typeof this.x2 === 'undefined') || (typeof this.y1 === 'undefined') || (typeof this.y2 === 'undefined')){
              alert('You have to specify the angle of lines, or the start (x1, y1) and end (x2, y2) coordinates.');
              return;
            }
            // The start (x1, y1) and end (x2, y2) coordinates are defined.
            // For motion, startX/Y must be calculated.
            this.startX = (this.x1 + this.x2)/2;
            this.startY = (this.y1 + this.y2)/2;
            if (this.origin_center) {
              this.startX = this.startX + centerX;
              this.startY = this.startY + centerY;
            }  
            this.currentX = this.startX;
            this.currentY = this.startY;
            this.angle = Math.atan((this.y2 - this.y1)/(this.x2 - this.x1)) * (180 / Math.PI);
            this.line_length = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2);
          } else {
            if ((typeof this.x1 !== 'undefined') || (typeof this.x2 !== 'undefined') || (typeof this.y1 !== 'undefined') || (typeof this.y2 !== 'undefined'))
              alert('You can not specify the angle and positions of the line at the same time.')
            if (typeof this.line_length === 'undefined') alert('You have to specify the line_length property.');
            
          }
          if (typeof this.line_color === 'undefined') this.line_color = 'black';

          if (trial.pixi){
            this.pixi_obj = new PIXI.Graphics()

            this.pixi_obj.lineStyle({
              width: this.line_width,
              color: getColorNum(this.line_color),
              join: this.lineJoin,
              miterLimit: this.miterLimit
            })

            const theta = deg2rad(this.angle);
            const x1 = -this.line_length/2 * Math.cos(theta);
            const y1 = -this.line_length/2 * Math.sin(theta);
            const x2 = this.line_length/2 * Math.cos(theta);
            const y2 = this.line_length/2 * Math.sin(theta);
            this.pixi_obj.moveTo(x1, y1);
            this.pixi_obj.lineTo(x2, y2);
  
            this.pixi_obj.visible = false
            pixi_app.stage.addChild(this.pixi_obj);
          }

          this.prepared = true
    
        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {
            if (typeof this.filter === 'undefined') {
              ctx.filter = 'none'
            } else {
              ctx.filter = this.filter
            }
    
            // common
            ctx.beginPath();            
            ctx.lineWidth = this.line_width;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            //
            const theta = deg2rad(this.angle);
            const x1 = this.currentX - this.line_length/2 * Math.cos(theta);
            const y1 = this.currentY - this.line_length/2 * Math.sin(theta);
            const x2 = this.currentX + this.line_length/2 * Math.cos(theta);
            const y2 = this.currentY + this.line_length/2 * Math.sin(theta);
            ctx.strokeStyle = this.line_color;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
  
      class rect_stimulus extends visual_stimulus{
        constructor(stim){
          super(stim)
  
          if (typeof this.width === 'undefined') alert('You have to specify the width of the rectangle.');
          if (typeof this.height === 'undefined') alert('You have to specify the height of the rectangle.');
          if (typeof this.line_color === 'undefined' && typeof this.fill_color === 'undefined') alert('You have to specify the either of the line_color or fill_color property.');      
    
          if (trial.pixi){
            this.pixi_obj = new PIXI.Graphics()

            this.pixi_obj.lineStyle({
              width: this.line_width,
              color: getColorNum(this.line_color),
              join: this.lineJoin,
              miterLimit: this.miterLimit
            })

            if (typeof this.fill_color !== 'undefined') this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
            this.pixi_obj.drawRect(-this.width/2, -this.height/2, this.width, this.height);
            if (typeof this.fill_color !== 'undefined') this.pixi_obj.endFill();

            this.pixi_obj.visible = false
            pixi_app.stage.addChild(this.pixi_obj);
          }
          this.prepared = true
        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {
            if (typeof this.filter === 'undefined') {
              ctx.filter = 'none'
            } else {
              ctx.filter = this.filter
            }
    
            // common
            // ctx.beginPath();            
            ctx.lineWidth = this.line_width;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            //
            // First, draw a filled rectangle, then an edge.
            if (typeof this.fill_color !== 'undefined') {
              ctx.fillStyle = this.fill_color;
              ctx.fillRect(this.currentX-this.width/2, this.currentY-this.height/2, this.width, this.height); 
            } 
            if (typeof this.line_color !== 'undefined') {
              ctx.strokeStyle = this.line_color;
              ctx.strokeRect(this.currentX-this.width/2, this.currentY-this.height/2, this.width, this.height);
            }
          }
        }
      }
  
      class cross_stimulus extends visual_stimulus {
        constructor(stim) {
          super(stim);
          
          if (typeof this.line_length === 'undefined') alert('You have to specify the line_length of the fixation cross.');
          if (typeof this.line_color === 'undefined') this.line_color = '#000000';

          if (trial.pixi){
            this.pixi_obj = new PIXI.Graphics()

            this.pixi_obj.lineStyle({
              width: this.line_width,
              color: getColorNum(this.line_color),
              join: this.lineJoin,
              miterLimit: this.miterLimit
            })

            const x1 = -this.line_length/2;
            const y1 = 0;
            const x2 = this.line_length/2;
            const y2 = 0;
            this.pixi_obj.moveTo(x1, y1);
            this.pixi_obj.lineTo(x2, y2);
  
            const x3 = 0;
            const y3 = -this.line_length/2;
            const x4 = 0;
            const y4 = this.line_length/2;
            this.pixi_obj.moveTo(x3, y3);
            this.pixi_obj.lineTo(x4, y4);
            
            this.pixi_obj.visible = false
            pixi_app.stage.addChild(this.pixi_obj);
          }

          this.prepared = true

        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {
            if (typeof this.filter === 'undefined') {
              ctx.filter = 'none'
            } else {
              ctx.filter = this.filter
            }
    
            // common
            ctx.beginPath();            
            ctx.lineWidth = this.line_width;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            //
            ctx.strokeStyle = this.line_color;
            const x1 = this.currentX;
            const y1 = this.currentY - this.line_length/2;
            const x2 = this.currentX;
            const y2 = this.currentY + this.line_length/2;                
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            const x3 = this.currentX - this.line_length/2;
            const y3 = this.currentY;
            const x4 = this.currentX + this.line_length/2;
            const y4 = this.currentY;                
            ctx.moveTo(x3, y3);
            ctx.lineTo(x4, y4);
            // ctx.closePath();
            ctx.stroke();
          }
        }
      }
    
      class circle_stimulus extends visual_stimulus {
        constructor(stim){
          super(stim);
          
          if (typeof this.radius === 'undefined') alert('You have to specify the radius of circles.');
          if (typeof this.line_color === 'undefined' && typeof this.fill_color === 'undefined') alert('You have to specify the either of line_color or fill_color.');

          if (!trial.pixi) {
            this.prepared = true
            return
          }

          this.pixi_obj = new PIXI.Graphics()
          // this.pixi_obj.cacheAsBitmap = true;

          this.pixi_obj.lineStyle({
            width: this.line_width,
            color: getColorNum(this.line_color),
            join: this.lineJoin,
            miterLimit: this.miterLimit
          })

          if (typeof this.fill_color !== 'undefined') this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
          this.pixi_obj.drawCircle(0, 0, this.radius);
          if (typeof this.fill_color !== 'undefined') this.pixi_obj.endFill();

          this.pixi_obj.visible = false
          pixi_app.stage.addChild(this.pixi_obj);
          this.prepared = true
        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {

            if (typeof this.filter === 'undefined') {
              ctx.filter = 'none'
            } else {
              ctx.filter = this.filter
            }
    
            // common
            ctx.beginPath();            
            ctx.lineWidth = this.line_width;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            //
            if (typeof this.fill_color !== 'undefined') {
              ctx.fillStyle = this.fill_color;
              ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI*2, false);
              ctx.fill();
            } 
            if (typeof this.line_color !== 'undefined') {
              ctx.strokeStyle = this.line_color;
              ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI*2, false);
              ctx.stroke();
            }
          }
        }
      }
      
      class text_stimulus extends visual_stimulus {
        constructor(stim){
          super(stim)
  
          if (typeof this.content === 'undefined') alert('You have to specify the content of texts.');
          
          if (trial.pixi){
            if (typeof this.text_space !== 'undefined') alert(`You can't specify the text_space in Pixi mode.`);
            this.pixi_obj = new PIXI.Text(this.content)
            init_pixi_obj(this.pixi_obj)
            this.pixi_obj.style.align = 'center'
            this.pixi_obj.style.fontFamily = this.fontFamily
            this.pixi_obj.style.fontSize = this.fontSize
            this.pixi_obj.style.fontStyle = this.fontStyle
            this.pixi_obj.style.fontWeight = this.fontWeight
            this.pixi_obj.style.fill = this.text_color
            this.pixi_obj.style.lineJoin = this.lineJoin;
            this.pixi_obj.style.miterLimit = this.miterLimit;
          } else {
            if (typeof this.text_space === 'undefined') this.text_space = 20;
            let font_info = ''
            // Note the order specified.
            font_info = font_info + ' ' + this.fontStyle
            font_info = font_info + ' ' + this.fontWeight
            font_info = font_info + ' ' + this.fontSize
            font_info = font_info + ' ' + this.fontFamily
            if (typeof this.font === 'undefined') this.font = font_info
          }
          this.prepared = true;
    
        }
  
        show(){
          if (trial.pixi) {
            this.pixi_obj.x = this.currentX
            this.pixi_obj.y = this.currentY
            this.pixi_obj.visible = true
          } else {

            if (typeof this.filter === 'undefined') {
              ctx.filter = 'none'
            } else {
              ctx.filter = this.filter
            }
    
            // common
            // ctx.beginPath();            
            ctx.lineWidth = this.line_width;
            ctx.lineJoin = this.lineJoin;
            ctx.miterLimit = this.miterLimit;
            ctx.font = this.font;   
            ctx.fillStyle = this.text_color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle"
    
            let column = [''];
            let line = 0;
            for (let i = 0; i < this.content.length; i++) {
                let char = this.content.charAt(i);
    
                if (char == "\n") {    
                    line++;
                    column[line] = '';
                } else {
                  column[line] += char;
                }
            }
    
            for (let i = 0; i < column.length; i++) {
                ctx.fillText(column[i], this.currentX, this.currentY - this.text_space * (column.length-1) / 2 + this.text_space * i);
            }
          }
        }
      }
  
      class manual_stimulus extends visual_stimulus{
        constructor(stim){
          super(stim)
          this.prepared = true
        }
  
        show(){}
      }

      class pixi_stimulus extends visual_stimulus{
        constructor(stim){
          super(stim)
          if (!trial.pixi){
            alert('To use Pixi objects, the pixi property of the psychophysics plugin must be set to true.')
            return
          }

          this.pixi_obj.visible = false
          pixi_app.stage.addChild(this.pixi_obj);
          this.prepared = true
        }
  
        show(){
          this.pixi_obj.x = this.currentX
          this.pixi_obj.y = this.currentY
          this.pixi_obj.visible = true
        }
      }

      function init_pixi_obj(obj){
        obj.anchor.set(0.5)
        obj.visible = false
        pixi_app.stage.addChild(obj);
      }
  
      class audio_stimulus extends psychophysics_stimulus{
        constructor(stim){
          super(stim)
  
          if (typeof this.file === 'undefined') {
            alert('You have to specify the file property.')
            return;
          }
  
          // setup stimulus
          this.context = jsPsych.pluginAPI.audioContext();
  
          // load audio file
          jsPsych.pluginAPI.getAudioBuffer(this.file)
            .then(function (buffer) {
              if (this.context !== null) {
                this.audio = this.context.createBufferSource();
                this.audio.buffer = buffer;
                this.audio.connect(this.context.destination);
                this.prepared = true
                console.log('WebAudio')
              } else {
                this.audio = buffer;
                this.audio.currentTime = 0;
                this.prepared = true
                console.log('HTML5 audio')
              }
              // setupTrial();
            }.bind(this))
            .catch(function (err) {
              console.error(`Failed to load audio file "${this.file}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
              console.error(err)
            }.bind(this));
  
    
          // set up end event if trial needs it
          if (this.trial_ends_after_audio) {
            this.audio.addEventListener('ended', end_trial);
          }
        }
    
        play(){
          // start audio
          if(this.context !== null){
            //startTime = this.context.currentTime; 
            // オリジナルのjspsychではwebaudioが使えるときは時間のデータとしてcontext.currentTimeを使っている。
            // psychophysicsプラグインでは、performance.now()で統一している
            this.audio.start(this.context.currentTime);
          } else {
            this.audio.play();
          }
        }
  
        stop(){
          if(this.context !== null){
            this.audio.stop();
            // this.source.onended = function() { }
          } else {
            this.audio.pause();
            
          }
          this.audio.removeEventListener('ended', end_trial);
  
        }
      }
  
      if (typeof trial.stepFunc !== 'undefined') alert(`The stepFunc is no longer supported. Please use the raf_func instead.`)
  
      const elm_jspsych_content = document.getElementById('jspsych-content');
      const style_jspsych_content = window.getComputedStyle(elm_jspsych_content); // stock
      const default_maxWidth = style_jspsych_content.maxWidth;
      elm_jspsych_content.style.maxWidth = 'none'; // The default value is '95%'. To fit the window.
  
      if (trial.canvas_width === null) trial.canvas_width = window.innerWidth - trial.canvas_offsetX;
      if (trial.canvas_height === null) trial.canvas_height = window.innerHeight - trial.canvas_offsetY;

      let pixi_app
      let new_html = ''
      if (trial.pixi) {
        pixi_app = new PIXI.Application({
          width: trial.canvas_width,
          height: trial.canvas_height, 
          backgroundColor: getColorNum(trial.background_color), 
          // antialias: true,
          // resolution: window.devicePixelRatio || 1,
        });

        display_element.appendChild(pixi_app.view);
      } else {
        new_html = '<canvas id="myCanvas" class="jspsych-canvas" width=' + trial.canvas_width + ' height=' + trial.canvas_height + ' style="background-color:' + trial.background_color + ';"></canvas>';
      }
  
      const motion_rt_method = 'performance'; // 'date' or 'performance'. 'performance' is better.
      let start_time; // used for mouse and button responses.
      let keyboardListener;
  
      // allow to respond using keyboard mouse or button
      this.jsPsych.pluginAPI.setTimeout(() => {  
        if (trial.response_type === 'key'){
          if (trial.choices != "NO_KEYS") {
            keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: after_response,
              valid_responses: trial.choices,
              rt_method: motion_rt_method,
              persist: false,
              allow_held_key: false
            });
          }  
        } else if (trial.response_type === 'mouse')  {
  
          if (motion_rt_method == 'date') {
            start_time = (new Date()).getTime();
          } else {
            start_time = performance.now();
          }
  
          canvas.addEventListener("mousedown", mouseDownFunc);
        } else { // button
          start_time = performance.now();
          for (let i = 0; i < trial.button_choices.length; i++) {
            display_element.querySelector('#jspsych-image-button-response-button-' + i).addEventListener('click', function(e){
              const choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
              // after_response(choice);
              // console.log(performance.now())
              // console.log(start_time)
              after_response({
                key: -1,
                rt: performance.now() - start_time,
                button: choice,
            });
      
            });
          }
        }
      }, trial.response_start_time);
  
      //display buttons
      if (trial.response_type === 'button'){
        let buttons = [];
        if (Array.isArray(trial.button_html)) {
          if (trial.button_html.length == trial.button_choices.length) {
            buttons = trial.button_html;
          } else {
            console.error('Error: The length of the button_html array does not equal the length of the button_choices array');
          }
        } else {
          for (let i = 0; i < trial.button_choices.length; i++) {
            buttons.push(trial.button_html);
          }
        }
        new_html += '<div id="jspsych-image-button-response-btngroup">';
        for (let i = 0; i < trial.button_choices.length; i++) {
          let str = buttons[i].replace(/%choice%/g, trial.button_choices[i]);
          new_html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.vert_button_margin+' '+trial.horiz_button_margin+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
        }
        new_html += '</div>';
    
      }
  

      // add prompt
      if(trial.prompt !== null){
        new_html += trial.prompt;
      }
      display_element.insertAdjacentHTML('beforeend', new_html)
  
      const canvas = (trial.pixi === true) ? pixi_app.view : document.getElementById('myCanvas');
      if ( ! canvas || ! canvas.getContext ) {
        alert('This browser does not support the canvas element.');
        return;
      }

      let centerX
      let centerY
      let ctx

      function set_canvas(canvas, ratio, width, height){
        const canvas_scale = ratio; // This will be 2 in a retina display, and 1.5 in a microsoft surface laptop.
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width * canvas_scale;
        canvas.height = height * canvas_scale;
        const centerX = canvas.width/2/canvas_scale;
        const centerY = canvas.height/2/canvas_scale;  
        const ctx = canvas.getContext('2d');
        ctx.scale(canvas_scale, canvas_scale)  
        return {
          ctx,
          centerX,
          centerY
        }
      }

      if (trial.pixi){
        centerX = pixi_app.screen.width / 2
        centerY = pixi_app.screen.height / 2
      } else {
        const canvas_info = set_canvas(canvas, window.devicePixelRatio, trial.canvas_width, trial.canvas_height)
        centerX = canvas_info.centerX
        centerY = canvas_info.centerY
        ctx = canvas_info.ctx
        trial.context = ctx
      }
      trial.canvas = canvas;
      trial.centerX = centerX;
      trial.centerY = centerY;
      
      // add event listeners defined by experimenters.
      if (trial.mouse_down_func !== null){
        canvas.addEventListener("mousedown", trial.mouse_down_func);
      }
  
      if (trial.mouse_move_func !== null){
        canvas.addEventListener("mousemove", trial.mouse_move_func);
      }
  
      if (trial.mouse_up_func !== null){
        canvas.addEventListener("mouseup", trial.mouse_up_func);
      }
      
      if (trial.key_down_func !== null){
        document.addEventListener("keydown", trial.key_down_func); // It doesn't work if the canvas is specified instead of the document.
      }
  
      if (trial.key_up_func !== null){
        document.addEventListener("keyup", trial.key_up_func);
      }
  
      if (typeof trial.stimuli === 'undefined' && trial.raf_func === null){
        alert('You have to specify the stimuli/raf_func parameter in the psychophysics plugin.')
        return
      }
  
   
      /////////////////////////////////////////////////////////
      // make instances
      const oop_stim = []
      const set_instance = {
        sound: audio_stimulus,
        image: image_stimulus,
        line: line_stimulus,
        rect: rect_stimulus,
        circle: circle_stimulus,
        text: text_stimulus,
        cross: cross_stimulus,
        manual: manual_stimulus,
        gabor: gabor_stimulus,
        pixi: pixi_stimulus
      }
      if (typeof trial.stimuli !== 'undefined') { // The stimuli could be 'undefined' if the raf_func is specified.
        for (let i = 0; i < trial.stimuli.length; i++){
          const stim = trial.stimuli[i];
          if (typeof stim.obj_type === 'undefined'){
            alert('You have missed to specify the obj_type property in the ' + (i+1) + 'th object.');
            return
          }
          oop_stim.push(new set_instance[stim.obj_type](stim))
        }
      }
      trial.stim_array = oop_stim
      // for (let i = 0; i < trial.stim_array.length; i++){
      //   console.log(trial.stim_array[i].is_presented)
      // }
  
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
  
      let startStep = null;
      let sumOfStep;
      let elapsedTime;
      let prepare_check = true;

      function step(timestamp){
        // Wait until all the instance of stimuli are ready.
        if (prepare_check) {
          for (let i = 0; i < trial.stim_array.length; i++){
            if (!trial.stim_array[i].prepared) {
              frameRequestID = window.requestAnimationFrame(step);
              return
            }
          } 
        }
        prepare_check = false;

        if (!startStep) {
          startStep = timestamp;
          sumOfStep = 0;
        } else {
          sumOfStep += 1;
        }
        elapsedTime = timestamp - startStep; // unit is ms. This can be used within the raf_func().
  
        if (trial.clear_canvas && !trial.pixi)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        if (trial.raf_func !== null) {        
          trial.raf_func(trial, elapsedTime, sumOfStep); // customize
          frameRequestID = window.requestAnimationFrame(step);
          return
        }
  
        for (let i = 0; i < trial.stim_array.length; i++){
          const stim = trial.stim_array[i];
          const elapsed = stim.is_frame ? sumOfStep : elapsedTime;
          const show_start = stim.is_frame ? stim.show_start_frame : stim.show_start_time;
          const show_end = stim.is_frame ? stim.show_end_frame : stim.show_end_time;
  
          if (stim.obj_type === 'sound'){
            if (elapsed >= show_start && !stim.is_presented){
              stim.play(); // play the sound.
              stim.is_presented = true;
            }
            continue;
          }
  
          // visual stimuli
          if (trial.pixi) {
            // PixiJS can be used with the requestAnimationFrame function.
            // See https://pixijs.download/v5.1.2/docs/PIXI.Ticker.html
            if (elapsed < show_start) {
              stim.pixi_obj.visible = false
              continue
            }
            if (show_end !== null && elapsed >= show_end) {
              stim.pixi_obj.visible = false
              continue
            }
          } else {
            if (elapsed < show_start) continue;
            if (show_end !== null && elapsed >= show_end) continue;
            if (trial.clear_canvas === false && stim.is_presented) continue;
          }
            
          stim.update_position(elapsed);
  
          if (stim.drawFunc !== null) {
            stim.drawFunc(stim, canvas, ctx, elapsedTime, sumOfStep);
          } else {
            if (stim.change_attr != null) stim.change_attr(stim, elapsedTime, sumOfStep)
            stim.show()
          }
          stim.is_presented = true;
        }
        frameRequestID = window.requestAnimationFrame(step);
      }
      
      // Start the step function.
      let frameRequestID = window.requestAnimationFrame(step);
  
      
      function deg2rad(degrees){
        return degrees / 180 * Math.PI;
      }
  
      // store response
      let response = {
        rt: null,
        key: null
      };
  
      // function to end trial when it is time
      // let end_trial = function() { // This causes an initialization error at stim.audio.addEventListener('ended', end_trial); 
      // function end_trial(){
      const end_trial = () => {  
        // console.log(default_maxWidth)
        document.getElementById('jspsych-content').style.maxWidth = default_maxWidth; // restore
        window.cancelAnimationFrame(frameRequestID); //Cancels the frame request
        canvas.removeEventListener("mousedown", mouseDownFunc);
  
        // remove event listeners defined by experimenters.
        if (trial.mouse_down_func !== null){
          canvas.removeEventListener("mousedown", trial.mouse_down_func);
        }
    
        if (trial.mouse_move_func !== null){
          canvas.removeEventListener("mousemove", trial.mouse_move_func);
        }
    
        if (trial.mouse_up_func !== null){
          canvas.removeEventListener("mouseup", trial.mouse_up_func);
        }
    
        if (trial.key_down_func !== null){
          document.removeEventListener("keydown", trial.key_down_func);
        }
  
        if (trial.key_up_func !== null){
          document.removeEventListener("keyup", trial.key_up_func);
        }
  
        // stop the audio file if it is playing
        // remove end event listeners if they exist
        if (typeof trial.stim_array !== 'undefined') { // The stimuli could be 'undefined' if the raf_func is specified.
          for (let i = 0; i < trial.stim_array.length; i++){
            const stim = trial.stim_array[i];
            if (typeof stim.pixi_obj !== 'undefined') stim.pixi_obj.destroy()

            // stim.is_presented = false;
            // if (typeof stim.context !== 'undefined') { // If the stimulus is audio data
            if (stim.obj_type === 'sound') { // If the stimulus is audio data
              stim.stop();
            }
          }
        }

        if (trial.pixi) pixi_app.destroy(true, {children: true, texture: true, baseTexture: true})
  
        // kill any remaining setTimeout handlers
        this.jsPsych.pluginAPI.clearAllTimeouts();
  
        // kill keyboard listeners
        if (typeof keyboardListener !== 'undefined') {
          this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        }
  
        // gather the data to store for the trial //音の再生時からの反応時間をとるわけではないから不要？
        // if(context !== null && response.rt !== null){
        //   response.rt = Math.round(response.rt * 1000);
        // }
  
        // gather the data to store for the trial
        const trial_data = {}
        trial_data['rt'] = response.rt;
        trial_data['response_type'] = trial.response_type;
        trial_data['key_press'] = response.key;
        trial_data['response'] = response.key; // compatible with the jsPsych >= 6.3.0
        trial_data['avg_frame_time'] = elapsedTime/sumOfStep;
        trial_data['center_x'] = centerX;
        trial_data['center_y'] = centerY;
  
        if (trial.response_type === 'mouse'){
          trial_data['click_x'] = response.clickX;
          trial_data['click_y'] = response.clickY;
        } else if (trial.response_type === 'button'){
          trial_data['button_pressed'] = response.button;
          trial_data['response'] = response.button; // compatible with the jsPsych >= 6.3.0
        }
  
        // clear the display
        display_element.innerHTML = '';
  
        // move on to the next trial
        this.jsPsych.finishTrial(trial_data);
      }
      trial.end_trial = end_trial;
  
      // function to handle responses by the subject
      // let after_response = function(info) { // This causes an initialization error at stim.audio.addEventListener('ended', end_trial); 
      function after_response(info) {
      // const after_response = info => {  
  
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';
  
        // only record the first response
        if (response.key == null) {
          response = info;
        }
  
        if (trial.response_type === 'button'){
          // after a valid response, the stimulus will have the CSS class 'responded'
          // which can be used to provide visual feedback that a response was recorded
          // display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';
  
          // disable all the buttons after a response
          let btns = document.querySelectorAll('.jspsych-image-button-response-button button');
          for(let i=0; i<btns.length; i++){
            //btns[i].removeEventListener('click');
            btns[i].setAttribute('disabled', 'disabled');
          }
        }
  
        if (trial.response_ends_trial) {
          end_trial();
        }
      }
  
      // end trial if trial_duration is set
      if (trial.trial_duration !== null) {
        this.jsPsych.pluginAPI.setTimeout(function() {
          end_trial();
        }, trial.trial_duration);
      }
  
    }
    simulate(trial, simulation_mode, simulation_options, load_callback) {
      if (simulation_mode == "data-only") {
        load_callback();
        this.simulate_data_only(trial, simulation_options);
      }
      if (simulation_mode == "visual") {
        this.simulate_visual(trial, simulation_options, load_callback);
      }
    }
    create_simulation_data(trial, simulation_options) {
      let resp = -1;
      if (trial.response_type === 'key') {
        resp = this.jsPsych.pluginAPI.getValidKey(trial.choices)
      }
      if (trial.response_type === 'button') {
        resp = this.jsPsych.randomization.randomInt(0, trial.button_choices.length - 1)
      }
      const default_data = {
        stimulus: trial.stimulus,
        rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
        response: resp,
      };
      const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
      this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
      return data;
    }
    simulate_data_only(trial, simulation_options) {
      const data = this.create_simulation_data(trial, simulation_options);
      this.jsPsych.finishTrial(data);
    }
    simulate_visual(trial, simulation_options, load_callback) {
      const data = this.create_simulation_data(trial, simulation_options);
      const display_element = this.jsPsych.getDisplayElement();
      this.trial(display_element, trial);
      load_callback();
      if (data.rt !== null) {
        switch (trial.response_type) {
          case 'key':
            this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
            break;
          case 'button':
            this.jsPsych.pluginAPI.clickTarget(display_element.querySelector(`div[data-choice="${data.response}"] button`), data.rt);
            break;
          case 'mouse':
            const client_rect = document.getElementById('myCanvas').getBoundingClientRect();
            if (typeof data.click_x  === 'undefined') data.click_x = 0;
            if (typeof data.click_y  === 'undefined') data.click_y = 0;
            const mouse_event = new MouseEvent('mousedown', {
              bubbles: true,
              clientX: data.click_x + client_rect.left, // Note that click_x is offsetX.
              clientY: data.click_y + client_rect.top,
            })
            setTimeout(() => {
              document.getElementById('myCanvas').dispatchEvent(mouse_event);
            }, data.rt);
            break;
        }
      }
    }
  }
  PsychophysicsPlugin.info = info;

  return PsychophysicsPlugin;
})(jsPsychModule);
