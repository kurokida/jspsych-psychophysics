if (typeof PIXI === "undefined") { var PIXI; }
var jsPsychPsychophysics = (function (jspsych, PIXI) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var PIXI__namespace = /*#__PURE__*/_interopNamespace(PIXI);

    const toString = Object.prototype.toString;
    /**
     * Checks if an object is an instance of an Array (array or typed array).
     *
     * @param {any} value - Object to check.
     * @returns {boolean} True if the object is an array.
     */
    function isAnyArray(value) {
        return toString.call(value).endsWith('Array]');
    }

    function max(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isAnyArray(input)) {
        throw new TypeError('input must be an array');
      }

      if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }

      var _options$fromIndex = options.fromIndex,
          fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
          _options$toIndex = options.toIndex,
          toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error('fromIndex must be a positive integer smaller than length');
      }

      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
      }

      var maxValue = input[fromIndex];

      for (var i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] > maxValue) maxValue = input[i];
      }

      return maxValue;
    }

    function min(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isAnyArray(input)) {
        throw new TypeError('input must be an array');
      }

      if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }

      var _options$fromIndex = options.fromIndex,
          fromIndex = _options$fromIndex === void 0 ? 0 : _options$fromIndex,
          _options$toIndex = options.toIndex,
          toIndex = _options$toIndex === void 0 ? input.length : _options$toIndex;

      if (fromIndex < 0 || fromIndex >= input.length || !Number.isInteger(fromIndex)) {
        throw new Error('fromIndex must be a positive integer smaller than length');
      }

      if (toIndex <= fromIndex || toIndex > input.length || !Number.isInteger(toIndex)) {
        throw new Error('toIndex must be an integer greater than fromIndex and at most equal to length');
      }

      var minValue = input[fromIndex];

      for (var i = fromIndex + 1; i < toIndex; i++) {
        if (input[i] < minValue) minValue = input[i];
      }

      return minValue;
    }

    function rescale(input) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isAnyArray(input)) {
        throw new TypeError('input must be an array');
      } else if (input.length === 0) {
        throw new TypeError('input must not be empty');
      }

      var output;

      if (options.output !== undefined) {
        if (!isAnyArray(options.output)) {
          throw new TypeError('output option must be an array if specified');
        }

        output = options.output;
      } else {
        output = new Array(input.length);
      }

      var currentMin = min(input);
      var currentMax = max(input);

      if (currentMin === currentMax) {
        throw new RangeError('minimum and maximum input values are equal. Cannot rescale a constant array');
      }

      var _options$min = options.min,
          minValue = _options$min === void 0 ? options.autoMinMax ? currentMin : 0 : _options$min,
          _options$max = options.max,
          maxValue = _options$max === void 0 ? options.autoMinMax ? currentMax : 1 : _options$max;

      if (minValue >= maxValue) {
        throw new RangeError('min option must be smaller than max option');
      }

      var factor = (maxValue - minValue) / (currentMax - currentMin);

      for (var i = 0; i < input.length; i++) {
        output[i] = (input[i] - currentMin) * factor + minValue;
      }

      return output;
    }

    const indent = ' '.repeat(2);
    const indentData = ' '.repeat(4);

    function inspectMatrix() {
      return inspectMatrixWithOptions(this);
    }

    function inspectMatrixWithOptions(matrix, options = {}) {
      const { maxRows = 15, maxColumns = 10, maxNumSize = 8 } = options;
      return `${matrix.constructor.name} {
${indent}[
${indentData}${inspectData(matrix, maxRows, maxColumns, maxNumSize)}
${indent}]
${indent}rows: ${matrix.rows}
${indent}columns: ${matrix.columns}
}`;
    }

    function inspectData(matrix, maxRows, maxColumns, maxNumSize) {
      const { rows, columns } = matrix;
      const maxI = Math.min(rows, maxRows);
      const maxJ = Math.min(columns, maxColumns);
      const result = [];
      for (let i = 0; i < maxI; i++) {
        let line = [];
        for (let j = 0; j < maxJ; j++) {
          line.push(formatNumber(matrix.get(i, j), maxNumSize));
        }
        result.push(`${line.join(' ')}`);
      }
      if (maxJ !== columns) {
        result[result.length - 1] += ` ... ${columns - maxColumns} more columns`;
      }
      if (maxI !== rows) {
        result.push(`... ${rows - maxRows} more rows`);
      }
      return result.join(`\n${indentData}`);
    }

    function formatNumber(num, maxNumSize) {
      const numStr = String(num);
      if (numStr.length <= maxNumSize) {
        return numStr.padEnd(maxNumSize, ' ');
      }
      const precise = num.toPrecision(maxNumSize - 2);
      if (precise.length <= maxNumSize) {
        return precise;
      }
      const exponential = num.toExponential(maxNumSize - 2);
      const eIndex = exponential.indexOf('e');
      const e = exponential.slice(eIndex);
      return exponential.slice(0, maxNumSize - e.length) + e;
    }

    function installMathOperations(AbstractMatrix, Matrix) {
      AbstractMatrix.prototype.add = function add(value) {
        if (typeof value === 'number') return this.addS(value);
        return this.addM(value);
      };

      AbstractMatrix.prototype.addS = function addS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.addM = function addM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.add = function add(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.add(value);
      };

      AbstractMatrix.prototype.sub = function sub(value) {
        if (typeof value === 'number') return this.subS(value);
        return this.subM(value);
      };

      AbstractMatrix.prototype.subS = function subS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.subM = function subM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.sub = function sub(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sub(value);
      };
      AbstractMatrix.prototype.subtract = AbstractMatrix.prototype.sub;
      AbstractMatrix.prototype.subtractS = AbstractMatrix.prototype.subS;
      AbstractMatrix.prototype.subtractM = AbstractMatrix.prototype.subM;
      AbstractMatrix.subtract = AbstractMatrix.sub;

      AbstractMatrix.prototype.mul = function mul(value) {
        if (typeof value === 'number') return this.mulS(value);
        return this.mulM(value);
      };

      AbstractMatrix.prototype.mulS = function mulS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.mulM = function mulM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.mul = function mul(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.mul(value);
      };
      AbstractMatrix.prototype.multiply = AbstractMatrix.prototype.mul;
      AbstractMatrix.prototype.multiplyS = AbstractMatrix.prototype.mulS;
      AbstractMatrix.prototype.multiplyM = AbstractMatrix.prototype.mulM;
      AbstractMatrix.multiply = AbstractMatrix.mul;

      AbstractMatrix.prototype.div = function div(value) {
        if (typeof value === 'number') return this.divS(value);
        return this.divM(value);
      };

      AbstractMatrix.prototype.divS = function divS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.divM = function divM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.div = function div(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.div(value);
      };
      AbstractMatrix.prototype.divide = AbstractMatrix.prototype.div;
      AbstractMatrix.prototype.divideS = AbstractMatrix.prototype.divS;
      AbstractMatrix.prototype.divideM = AbstractMatrix.prototype.divM;
      AbstractMatrix.divide = AbstractMatrix.div;

      AbstractMatrix.prototype.mod = function mod(value) {
        if (typeof value === 'number') return this.modS(value);
        return this.modM(value);
      };

      AbstractMatrix.prototype.modS = function modS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.modM = function modM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) % matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.mod = function mod(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.mod(value);
      };
      AbstractMatrix.prototype.modulus = AbstractMatrix.prototype.mod;
      AbstractMatrix.prototype.modulusS = AbstractMatrix.prototype.modS;
      AbstractMatrix.prototype.modulusM = AbstractMatrix.prototype.modM;
      AbstractMatrix.modulus = AbstractMatrix.mod;

      AbstractMatrix.prototype.and = function and(value) {
        if (typeof value === 'number') return this.andS(value);
        return this.andM(value);
      };

      AbstractMatrix.prototype.andS = function andS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.andM = function andM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) & matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.and = function and(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.and(value);
      };

      AbstractMatrix.prototype.or = function or(value) {
        if (typeof value === 'number') return this.orS(value);
        return this.orM(value);
      };

      AbstractMatrix.prototype.orS = function orS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.orM = function orM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) | matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.or = function or(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.or(value);
      };

      AbstractMatrix.prototype.xor = function xor(value) {
        if (typeof value === 'number') return this.xorS(value);
        return this.xorM(value);
      };

      AbstractMatrix.prototype.xorS = function xorS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.xorM = function xorM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) ^ matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.xor = function xor(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.xor(value);
      };

      AbstractMatrix.prototype.leftShift = function leftShift(value) {
        if (typeof value === 'number') return this.leftShiftS(value);
        return this.leftShiftM(value);
      };

      AbstractMatrix.prototype.leftShiftS = function leftShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.leftShiftM = function leftShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) << matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.leftShift = function leftShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.leftShift(value);
      };

      AbstractMatrix.prototype.signPropagatingRightShift = function signPropagatingRightShift(value) {
        if (typeof value === 'number') return this.signPropagatingRightShiftS(value);
        return this.signPropagatingRightShiftM(value);
      };

      AbstractMatrix.prototype.signPropagatingRightShiftS = function signPropagatingRightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.signPropagatingRightShiftM = function signPropagatingRightShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >> matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.signPropagatingRightShift = function signPropagatingRightShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.signPropagatingRightShift(value);
      };

      AbstractMatrix.prototype.rightShift = function rightShift(value) {
        if (typeof value === 'number') return this.rightShiftS(value);
        return this.rightShiftM(value);
      };

      AbstractMatrix.prototype.rightShiftS = function rightShiftS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> value);
          }
        }
        return this;
      };

      AbstractMatrix.prototype.rightShiftM = function rightShiftM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) >>> matrix.get(i, j));
          }
        }
        return this;
      };

      AbstractMatrix.rightShift = function rightShift(matrix, value) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.rightShift(value);
      };
      AbstractMatrix.prototype.zeroFillRightShift = AbstractMatrix.prototype.rightShift;
      AbstractMatrix.prototype.zeroFillRightShiftS = AbstractMatrix.prototype.rightShiftS;
      AbstractMatrix.prototype.zeroFillRightShiftM = AbstractMatrix.prototype.rightShiftM;
      AbstractMatrix.zeroFillRightShift = AbstractMatrix.rightShift;

      AbstractMatrix.prototype.not = function not() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, ~(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.not = function not(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.not();
      };

      AbstractMatrix.prototype.abs = function abs() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.abs(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.abs = function abs(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.abs();
      };

      AbstractMatrix.prototype.acos = function acos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acos(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.acos = function acos(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.acos();
      };

      AbstractMatrix.prototype.acosh = function acosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.acosh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.acosh = function acosh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.acosh();
      };

      AbstractMatrix.prototype.asin = function asin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asin(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.asin = function asin(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.asin();
      };

      AbstractMatrix.prototype.asinh = function asinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.asinh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.asinh = function asinh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.asinh();
      };

      AbstractMatrix.prototype.atan = function atan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atan(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.atan = function atan(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.atan();
      };

      AbstractMatrix.prototype.atanh = function atanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.atanh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.atanh = function atanh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.atanh();
      };

      AbstractMatrix.prototype.cbrt = function cbrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cbrt(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.cbrt = function cbrt(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cbrt();
      };

      AbstractMatrix.prototype.ceil = function ceil() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.ceil(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.ceil = function ceil(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.ceil();
      };

      AbstractMatrix.prototype.clz32 = function clz32() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.clz32(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.clz32 = function clz32(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.clz32();
      };

      AbstractMatrix.prototype.cos = function cos() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cos(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.cos = function cos(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cos();
      };

      AbstractMatrix.prototype.cosh = function cosh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.cosh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.cosh = function cosh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.cosh();
      };

      AbstractMatrix.prototype.exp = function exp() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.exp(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.exp = function exp(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.exp();
      };

      AbstractMatrix.prototype.expm1 = function expm1() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.expm1(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.expm1 = function expm1(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.expm1();
      };

      AbstractMatrix.prototype.floor = function floor() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.floor(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.floor = function floor(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.floor();
      };

      AbstractMatrix.prototype.fround = function fround() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.fround(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.fround = function fround(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.fround();
      };

      AbstractMatrix.prototype.log = function log() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.log = function log(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log();
      };

      AbstractMatrix.prototype.log1p = function log1p() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log1p(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.log1p = function log1p(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log1p();
      };

      AbstractMatrix.prototype.log10 = function log10() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log10(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.log10 = function log10(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log10();
      };

      AbstractMatrix.prototype.log2 = function log2() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.log2(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.log2 = function log2(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.log2();
      };

      AbstractMatrix.prototype.round = function round() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.round(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.round = function round(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.round();
      };

      AbstractMatrix.prototype.sign = function sign() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sign(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.sign = function sign(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sign();
      };

      AbstractMatrix.prototype.sin = function sin() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sin(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.sin = function sin(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sin();
      };

      AbstractMatrix.prototype.sinh = function sinh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sinh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.sinh = function sinh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sinh();
      };

      AbstractMatrix.prototype.sqrt = function sqrt() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.sqrt(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.sqrt = function sqrt(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.sqrt();
      };

      AbstractMatrix.prototype.tan = function tan() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tan(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.tan = function tan(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.tan();
      };

      AbstractMatrix.prototype.tanh = function tanh() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.tanh(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.tanh = function tanh(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.tanh();
      };

      AbstractMatrix.prototype.trunc = function trunc() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.trunc(this.get(i, j)));
          }
        }
        return this;
      };

      AbstractMatrix.trunc = function trunc(matrix) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.trunc();
      };

      AbstractMatrix.pow = function pow(matrix, arg0) {
        const newMatrix = new Matrix(matrix);
        return newMatrix.pow(arg0);
      };

      AbstractMatrix.prototype.pow = function pow(value) {
        if (typeof value === 'number') return this.powS(value);
        return this.powM(value);
      };

      AbstractMatrix.prototype.powS = function powS(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.pow(this.get(i, j), value));
          }
        }
        return this;
      };

      AbstractMatrix.prototype.powM = function powM(matrix) {
        matrix = Matrix.checkMatrix(matrix);
        if (this.rows !== matrix.rows ||
          this.columns !== matrix.columns) {
          throw new RangeError('Matrices dimensions must be equal');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, Math.pow(this.get(i, j), matrix.get(i, j)));
          }
        }
        return this;
      };
    }

    /**
     * @private
     * Check that a row index is not out of bounds
     * @param {Matrix} matrix
     * @param {number} index
     * @param {boolean} [outer]
     */
    function checkRowIndex(matrix, index, outer) {
      let max = outer ? matrix.rows : matrix.rows - 1;
      if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
      }
    }

    /**
     * @private
     * Check that a column index is not out of bounds
     * @param {Matrix} matrix
     * @param {number} index
     * @param {boolean} [outer]
     */
    function checkColumnIndex(matrix, index, outer) {
      let max = outer ? matrix.columns : matrix.columns - 1;
      if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
      }
    }

    /**
     * @private
     * Check that the provided vector is an array with the right length
     * @param {Matrix} matrix
     * @param {Array|Matrix} vector
     * @return {Array}
     * @throws {RangeError}
     */
    function checkRowVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.columns) {
        throw new RangeError(
          'vector size must be the same as the number of columns',
        );
      }
      return vector;
    }

    /**
     * @private
     * Check that the provided vector is an array with the right length
     * @param {Matrix} matrix
     * @param {Array|Matrix} vector
     * @return {Array}
     * @throws {RangeError}
     */
    function checkColumnVector(matrix, vector) {
      if (vector.to1DArray) {
        vector = vector.to1DArray();
      }
      if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
      }
      return vector;
    }

    function checkRowIndices(matrix, rowIndices) {
      if (!isAnyArray(rowIndices)) {
        throw new TypeError('row indices must be an array');
      }

      for (let i = 0; i < rowIndices.length; i++) {
        if (rowIndices[i] < 0 || rowIndices[i] >= matrix.rows) {
          throw new RangeError('row indices are out of range');
        }
      }
    }

    function checkColumnIndices(matrix, columnIndices) {
      if (!isAnyArray(columnIndices)) {
        throw new TypeError('column indices must be an array');
      }

      for (let i = 0; i < columnIndices.length; i++) {
        if (columnIndices[i] < 0 || columnIndices[i] >= matrix.columns) {
          throw new RangeError('column indices are out of range');
        }
      }
    }

    function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
      if (arguments.length !== 5) {
        throw new RangeError('expected 4 arguments');
      }
      checkNumber('startRow', startRow);
      checkNumber('endRow', endRow);
      checkNumber('startColumn', startColumn);
      checkNumber('endColumn', endColumn);
      if (
        startRow > endRow ||
        startColumn > endColumn ||
        startRow < 0 ||
        startRow >= matrix.rows ||
        endRow < 0 ||
        endRow >= matrix.rows ||
        startColumn < 0 ||
        startColumn >= matrix.columns ||
        endColumn < 0 ||
        endColumn >= matrix.columns
      ) {
        throw new RangeError('Submatrix indices are out of range');
      }
    }

    function newArray(length, value = 0) {
      let array = [];
      for (let i = 0; i < length; i++) {
        array.push(value);
      }
      return array;
    }

    function checkNumber(name, value) {
      if (typeof value !== 'number') {
        throw new TypeError(`${name} must be a number`);
      }
    }

    function checkNonEmpty(matrix) {
      if (matrix.isEmpty()) {
        throw new Error('Empty matrix has no elements to index');
      }
    }

    function sumByRow(matrix) {
      let sum = newArray(matrix.rows);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[i] += matrix.get(i, j);
        }
      }
      return sum;
    }

    function sumByColumn(matrix) {
      let sum = newArray(matrix.columns);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[j] += matrix.get(i, j);
        }
      }
      return sum;
    }

    function sumAll(matrix) {
      let v = 0;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v += matrix.get(i, j);
        }
      }
      return v;
    }

    function productByRow(matrix) {
      let sum = newArray(matrix.rows, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[i] *= matrix.get(i, j);
        }
      }
      return sum;
    }

    function productByColumn(matrix) {
      let sum = newArray(matrix.columns, 1);
      for (let i = 0; i < matrix.rows; ++i) {
        for (let j = 0; j < matrix.columns; ++j) {
          sum[j] *= matrix.get(i, j);
        }
      }
      return sum;
    }

    function productAll(matrix) {
      let v = 1;
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          v *= matrix.get(i, j);
        }
      }
      return v;
    }

    function varianceByRow(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];

      for (let i = 0; i < rows; i++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean[i];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - (sum1 * sum1) / cols) / (cols - 1));
        } else {
          variance.push((sum2 - (sum1 * sum1) / cols) / cols);
        }
      }
      return variance;
    }

    function varianceByColumn(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const variance = [];

      for (let j = 0; j < cols; j++) {
        let sum1 = 0;
        let sum2 = 0;
        let x = 0;
        for (let i = 0; i < rows; i++) {
          x = matrix.get(i, j) - mean[j];
          sum1 += x;
          sum2 += x * x;
        }
        if (unbiased) {
          variance.push((sum2 - (sum1 * sum1) / rows) / (rows - 1));
        } else {
          variance.push((sum2 - (sum1 * sum1) / rows) / rows);
        }
      }
      return variance;
    }

    function varianceAll(matrix, unbiased, mean) {
      const rows = matrix.rows;
      const cols = matrix.columns;
      const size = rows * cols;

      let sum1 = 0;
      let sum2 = 0;
      let x = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          x = matrix.get(i, j) - mean;
          sum1 += x;
          sum2 += x * x;
        }
      }
      if (unbiased) {
        return (sum2 - (sum1 * sum1) / size) / (size - 1);
      } else {
        return (sum2 - (sum1 * sum1) / size) / size;
      }
    }

    function centerByRow(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean[i]);
        }
      }
    }

    function centerByColumn(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean[j]);
        }
      }
    }

    function centerAll(matrix, mean) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) - mean);
        }
      }
    }

    function getScaleByRow(matrix) {
      const scale = [];
      for (let i = 0; i < matrix.rows; i++) {
        let sum = 0;
        for (let j = 0; j < matrix.columns; j++) {
          sum += Math.pow(matrix.get(i, j), 2) / (matrix.columns - 1);
        }
        scale.push(Math.sqrt(sum));
      }
      return scale;
    }

    function scaleByRow(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[i]);
        }
      }
    }

    function getScaleByColumn(matrix) {
      const scale = [];
      for (let j = 0; j < matrix.columns; j++) {
        let sum = 0;
        for (let i = 0; i < matrix.rows; i++) {
          sum += Math.pow(matrix.get(i, j), 2) / (matrix.rows - 1);
        }
        scale.push(Math.sqrt(sum));
      }
      return scale;
    }

    function scaleByColumn(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale[j]);
        }
      }
    }

    function getScaleAll(matrix) {
      const divider = matrix.size - 1;
      let sum = 0;
      for (let j = 0; j < matrix.columns; j++) {
        for (let i = 0; i < matrix.rows; i++) {
          sum += Math.pow(matrix.get(i, j), 2) / divider;
        }
      }
      return Math.sqrt(sum);
    }

    function scaleAll(matrix, scale) {
      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.columns; j++) {
          matrix.set(i, j, matrix.get(i, j) / scale);
        }
      }
    }

    class AbstractMatrix {
      static from1DArray(newRows, newColumns, newData) {
        let length = newRows * newColumns;
        if (length !== newData.length) {
          throw new RangeError('data length does not match given dimensions');
        }
        let newMatrix = new Matrix(newRows, newColumns);
        for (let row = 0; row < newRows; row++) {
          for (let column = 0; column < newColumns; column++) {
            newMatrix.set(row, column, newData[row * newColumns + column]);
          }
        }
        return newMatrix;
      }

      static rowVector(newData) {
        let vector = new Matrix(1, newData.length);
        for (let i = 0; i < newData.length; i++) {
          vector.set(0, i, newData[i]);
        }
        return vector;
      }

      static columnVector(newData) {
        let vector = new Matrix(newData.length, 1);
        for (let i = 0; i < newData.length; i++) {
          vector.set(i, 0, newData[i]);
        }
        return vector;
      }

      static zeros(rows, columns) {
        return new Matrix(rows, columns);
      }

      static ones(rows, columns) {
        return new Matrix(rows, columns).fill(1);
      }

      static rand(rows, columns, options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { random = Math.random } = options;
        let matrix = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.set(i, j, random());
          }
        }
        return matrix;
      }

      static randInt(rows, columns, options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { min = 0, max = 1000, random = Math.random } = options;
        if (!Number.isInteger(min)) throw new TypeError('min must be an integer');
        if (!Number.isInteger(max)) throw new TypeError('max must be an integer');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let interval = max - min;
        let matrix = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            let value = min + Math.round(random() * interval);
            matrix.set(i, j, value);
          }
        }
        return matrix;
      }

      static eye(rows, columns, value) {
        if (columns === undefined) columns = rows;
        if (value === undefined) value = 1;
        let min = Math.min(rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min; i++) {
          matrix.set(i, i, value);
        }
        return matrix;
      }

      static diag(data, rows, columns) {
        let l = data.length;
        if (rows === undefined) rows = l;
        if (columns === undefined) columns = rows;
        let min = Math.min(l, rows, columns);
        let matrix = this.zeros(rows, columns);
        for (let i = 0; i < min; i++) {
          matrix.set(i, i, data[i]);
        }
        return matrix;
      }

      static min(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }

      static max(matrix1, matrix2) {
        matrix1 = this.checkMatrix(matrix1);
        matrix2 = this.checkMatrix(matrix2);
        let rows = matrix1.rows;
        let columns = matrix1.columns;
        let result = new this(rows, columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
          }
        }
        return result;
      }

      static checkMatrix(value) {
        return AbstractMatrix.isMatrix(value) ? value : new Matrix(value);
      }

      static isMatrix(value) {
        return value != null && value.klass === 'Matrix';
      }

      get size() {
        return this.rows * this.columns;
      }

      apply(callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('callback must be a function');
        }
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            callback.call(this, i, j);
          }
        }
        return this;
      }

      to1DArray() {
        let array = [];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            array.push(this.get(i, j));
          }
        }
        return array;
      }

      to2DArray() {
        let copy = [];
        for (let i = 0; i < this.rows; i++) {
          copy.push([]);
          for (let j = 0; j < this.columns; j++) {
            copy[i].push(this.get(i, j));
          }
        }
        return copy;
      }

      toJSON() {
        return this.to2DArray();
      }

      isRowVector() {
        return this.rows === 1;
      }

      isColumnVector() {
        return this.columns === 1;
      }

      isVector() {
        return this.rows === 1 || this.columns === 1;
      }

      isSquare() {
        return this.rows === this.columns;
      }

      isEmpty() {
        return this.rows === 0 || this.columns === 0;
      }

      isSymmetric() {
        if (this.isSquare()) {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j <= i; j++) {
              if (this.get(i, j) !== this.get(j, i)) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }

      isEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isEchelonForm = true;
        let checked = false;
        while (i < this.rows && isEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isEchelonForm = false;
              checked = true;
            }
          }
          i++;
        }
        return isEchelonForm;
      }

      isReducedEchelonForm() {
        let i = 0;
        let j = 0;
        let previousColumn = -1;
        let isReducedEchelonForm = true;
        let checked = false;
        while (i < this.rows && isReducedEchelonForm) {
          j = 0;
          checked = false;
          while (j < this.columns && checked === false) {
            if (this.get(i, j) === 0) {
              j++;
            } else if (this.get(i, j) === 1 && j > previousColumn) {
              checked = true;
              previousColumn = j;
            } else {
              isReducedEchelonForm = false;
              checked = true;
            }
          }
          for (let k = j + 1; k < this.rows; k++) {
            if (this.get(i, k) !== 0) {
              isReducedEchelonForm = false;
            }
          }
          i++;
        }
        return isReducedEchelonForm;
      }

      echelonForm() {
        let result = this.clone();
        let h = 0;
        let k = 0;
        while (h < result.rows && k < result.columns) {
          let iMax = h;
          for (let i = h; i < result.rows; i++) {
            if (result.get(i, k) > result.get(iMax, k)) {
              iMax = i;
            }
          }
          if (result.get(iMax, k) === 0) {
            k++;
          } else {
            result.swapRows(h, iMax);
            let tmp = result.get(h, k);
            for (let j = k; j < result.columns; j++) {
              result.set(h, j, result.get(h, j) / tmp);
            }
            for (let i = h + 1; i < result.rows; i++) {
              let factor = result.get(i, k) / result.get(h, k);
              result.set(i, k, 0);
              for (let j = k + 1; j < result.columns; j++) {
                result.set(i, j, result.get(i, j) - result.get(h, j) * factor);
              }
            }
            h++;
            k++;
          }
        }
        return result;
      }

      reducedEchelonForm() {
        let result = this.echelonForm();
        let m = result.columns;
        let n = result.rows;
        let h = n - 1;
        while (h >= 0) {
          if (result.maxRow(h) === 0) {
            h--;
          } else {
            let p = 0;
            let pivot = false;
            while (p < n && pivot === false) {
              if (result.get(h, p) === 1) {
                pivot = true;
              } else {
                p++;
              }
            }
            for (let i = 0; i < h; i++) {
              let factor = result.get(i, p);
              for (let j = p; j < m; j++) {
                let tmp = result.get(i, j) - factor * result.get(h, j);
                result.set(i, j, tmp);
              }
            }
            h--;
          }
        }
        return result;
      }

      set() {
        throw new Error('set method is unimplemented');
      }

      get() {
        throw new Error('get method is unimplemented');
      }

      repeat(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { rows = 1, columns = 1 } = options;
        if (!Number.isInteger(rows) || rows <= 0) {
          throw new TypeError('rows must be a positive integer');
        }
        if (!Number.isInteger(columns) || columns <= 0) {
          throw new TypeError('columns must be a positive integer');
        }
        let matrix = new Matrix(this.rows * rows, this.columns * columns);
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
            matrix.setSubMatrix(this, this.rows * i, this.columns * j);
          }
        }
        return matrix;
      }

      fill(value) {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, value);
          }
        }
        return this;
      }

      neg() {
        return this.mulS(-1);
      }

      getRow(index) {
        checkRowIndex(this, index);
        let row = [];
        for (let i = 0; i < this.columns; i++) {
          row.push(this.get(index, i));
        }
        return row;
      }

      getRowVector(index) {
        return Matrix.rowVector(this.getRow(index));
      }

      setRow(index, array) {
        checkRowIndex(this, index);
        array = checkRowVector(this, array);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, array[i]);
        }
        return this;
      }

      swapRows(row1, row2) {
        checkRowIndex(this, row1);
        checkRowIndex(this, row2);
        for (let i = 0; i < this.columns; i++) {
          let temp = this.get(row1, i);
          this.set(row1, i, this.get(row2, i));
          this.set(row2, i, temp);
        }
        return this;
      }

      getColumn(index) {
        checkColumnIndex(this, index);
        let column = [];
        for (let i = 0; i < this.rows; i++) {
          column.push(this.get(i, index));
        }
        return column;
      }

      getColumnVector(index) {
        return Matrix.columnVector(this.getColumn(index));
      }

      setColumn(index, array) {
        checkColumnIndex(this, index);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, array[i]);
        }
        return this;
      }

      swapColumns(column1, column2) {
        checkColumnIndex(this, column1);
        checkColumnIndex(this, column2);
        for (let i = 0; i < this.rows; i++) {
          let temp = this.get(i, column1);
          this.set(i, column1, this.get(i, column2));
          this.set(i, column2, temp);
        }
        return this;
      }

      addRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[j]);
          }
        }
        return this;
      }

      subRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[j]);
          }
        }
        return this;
      }

      mulRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[j]);
          }
        }
        return this;
      }

      divRowVector(vector) {
        vector = checkRowVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[j]);
          }
        }
        return this;
      }

      addColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) + vector[i]);
          }
        }
        return this;
      }

      subColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) - vector[i]);
          }
        }
        return this;
      }

      mulColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) * vector[i]);
          }
        }
        return this;
      }

      divColumnVector(vector) {
        vector = checkColumnVector(this, vector);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) / vector[i]);
          }
        }
        return this;
      }

      mulRow(index, value) {
        checkRowIndex(this, index);
        for (let i = 0; i < this.columns; i++) {
          this.set(index, i, this.get(index, i) * value);
        }
        return this;
      }

      mulColumn(index, value) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          this.set(i, index, this.get(i, index) * value);
        }
        return this;
      }

      max(by) {
        if (this.isEmpty()) {
          return NaN;
        }
        switch (by) {
          case 'row': {
            const max = new Array(this.rows).fill(Number.NEGATIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max[row]) {
                  max[row] = this.get(row, column);
                }
              }
            }
            return max;
          }
          case 'column': {
            const max = new Array(this.columns).fill(Number.NEGATIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max[column]) {
                  max[column] = this.get(row, column);
                }
              }
            }
            return max;
          }
          case undefined: {
            let max = this.get(0, 0);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) > max) {
                  max = this.get(row, column);
                }
              }
            }
            return max;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      maxIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) > v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }

      min(by) {
        if (this.isEmpty()) {
          return NaN;
        }

        switch (by) {
          case 'row': {
            const min = new Array(this.rows).fill(Number.POSITIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min[row]) {
                  min[row] = this.get(row, column);
                }
              }
            }
            return min;
          }
          case 'column': {
            const min = new Array(this.columns).fill(Number.POSITIVE_INFINITY);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min[column]) {
                  min[column] = this.get(row, column);
                }
              }
            }
            return min;
          }
          case undefined: {
            let min = this.get(0, 0);
            for (let row = 0; row < this.rows; row++) {
              for (let column = 0; column < this.columns; column++) {
                if (this.get(row, column) < min) {
                  min = this.get(row, column);
                }
              }
            }
            return min;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      minIndex() {
        checkNonEmpty(this);
        let v = this.get(0, 0);
        let idx = [0, 0];
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (this.get(i, j) < v) {
              v = this.get(i, j);
              idx[0] = i;
              idx[1] = j;
            }
          }
        }
        return idx;
      }

      maxRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
          }
        }
        return v;
      }

      maxRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) > v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }

      minRow(row) {
        checkRowIndex(this, row);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(row, 0);
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
          }
        }
        return v;
      }

      minRowIndex(row) {
        checkRowIndex(this, row);
        checkNonEmpty(this);
        let v = this.get(row, 0);
        let idx = [row, 0];
        for (let i = 1; i < this.columns; i++) {
          if (this.get(row, i) < v) {
            v = this.get(row, i);
            idx[1] = i;
          }
        }
        return idx;
      }

      maxColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
          }
        }
        return v;
      }

      maxColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) > v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }

      minColumn(column) {
        checkColumnIndex(this, column);
        if (this.isEmpty()) {
          return NaN;
        }
        let v = this.get(0, column);
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
          }
        }
        return v;
      }

      minColumnIndex(column) {
        checkColumnIndex(this, column);
        checkNonEmpty(this);
        let v = this.get(0, column);
        let idx = [0, column];
        for (let i = 1; i < this.rows; i++) {
          if (this.get(i, column) < v) {
            v = this.get(i, column);
            idx[0] = i;
          }
        }
        return idx;
      }

      diag() {
        let min = Math.min(this.rows, this.columns);
        let diag = [];
        for (let i = 0; i < min; i++) {
          diag.push(this.get(i, i));
        }
        return diag;
      }

      norm(type = 'frobenius') {
        let result = 0;
        if (type === 'max') {
          return this.max();
        } else if (type === 'frobenius') {
          for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
              result = result + this.get(i, j) * this.get(i, j);
            }
          }
          return Math.sqrt(result);
        } else {
          throw new RangeError(`unknown norm type: ${type}`);
        }
      }

      cumulativeSum() {
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            sum += this.get(i, j);
            this.set(i, j, sum);
          }
        }
        return this;
      }

      dot(vector2) {
        if (AbstractMatrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
        let vector1 = this.to1DArray();
        if (vector1.length !== vector2.length) {
          throw new RangeError('vectors do not have the same size');
        }
        let dot = 0;
        for (let i = 0; i < vector1.length; i++) {
          dot += vector1[i] * vector2[i];
        }
        return dot;
      }

      mmul(other) {
        other = Matrix.checkMatrix(other);

        let m = this.rows;
        let n = this.columns;
        let p = other.columns;

        let result = new Matrix(m, p);

        let Bcolj = new Float64Array(n);
        for (let j = 0; j < p; j++) {
          for (let k = 0; k < n; k++) {
            Bcolj[k] = other.get(k, j);
          }

          for (let i = 0; i < m; i++) {
            let s = 0;
            for (let k = 0; k < n; k++) {
              s += this.get(i, k) * Bcolj[k];
            }

            result.set(i, j, s);
          }
        }
        return result;
      }

      strassen2x2(other) {
        other = Matrix.checkMatrix(other);
        let result = new Matrix(2, 2);
        const a11 = this.get(0, 0);
        const b11 = other.get(0, 0);
        const a12 = this.get(0, 1);
        const b12 = other.get(0, 1);
        const a21 = this.get(1, 0);
        const b21 = other.get(1, 0);
        const a22 = this.get(1, 1);
        const b22 = other.get(1, 1);

        // Compute intermediate values.
        const m1 = (a11 + a22) * (b11 + b22);
        const m2 = (a21 + a22) * b11;
        const m3 = a11 * (b12 - b22);
        const m4 = a22 * (b21 - b11);
        const m5 = (a11 + a12) * b22;
        const m6 = (a21 - a11) * (b11 + b12);
        const m7 = (a12 - a22) * (b21 + b22);

        // Combine intermediate values into the output.
        const c00 = m1 + m4 - m5 + m7;
        const c01 = m3 + m5;
        const c10 = m2 + m4;
        const c11 = m1 - m2 + m3 + m6;

        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        return result;
      }

      strassen3x3(other) {
        other = Matrix.checkMatrix(other);
        let result = new Matrix(3, 3);

        const a00 = this.get(0, 0);
        const a01 = this.get(0, 1);
        const a02 = this.get(0, 2);
        const a10 = this.get(1, 0);
        const a11 = this.get(1, 1);
        const a12 = this.get(1, 2);
        const a20 = this.get(2, 0);
        const a21 = this.get(2, 1);
        const a22 = this.get(2, 2);

        const b00 = other.get(0, 0);
        const b01 = other.get(0, 1);
        const b02 = other.get(0, 2);
        const b10 = other.get(1, 0);
        const b11 = other.get(1, 1);
        const b12 = other.get(1, 2);
        const b20 = other.get(2, 0);
        const b21 = other.get(2, 1);
        const b22 = other.get(2, 2);

        const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
        const m2 = (a00 - a10) * (-b01 + b11);
        const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
        const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
        const m5 = (a10 + a11) * (-b00 + b01);
        const m6 = a00 * b00;
        const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
        const m8 = (-a00 + a20) * (b02 - b12);
        const m9 = (a20 + a21) * (-b00 + b02);
        const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
        const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
        const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
        const m13 = (a02 - a22) * (b11 - b21);
        const m14 = a02 * b20;
        const m15 = (a21 + a22) * (-b20 + b21);
        const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
        const m17 = (a02 - a12) * (b12 - b22);
        const m18 = (a11 + a12) * (-b20 + b22);
        const m19 = a01 * b10;
        const m20 = a12 * b21;
        const m21 = a10 * b02;
        const m22 = a20 * b01;
        const m23 = a22 * b22;

        const c00 = m6 + m14 + m19;
        const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
        const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
        const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
        const c11 = m2 + m4 + m5 + m6 + m20;
        const c12 = m14 + m16 + m17 + m18 + m21;
        const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
        const c21 = m12 + m13 + m14 + m15 + m22;
        const c22 = m6 + m7 + m8 + m9 + m23;

        result.set(0, 0, c00);
        result.set(0, 1, c01);
        result.set(0, 2, c02);
        result.set(1, 0, c10);
        result.set(1, 1, c11);
        result.set(1, 2, c12);
        result.set(2, 0, c20);
        result.set(2, 1, c21);
        result.set(2, 2, c22);
        return result;
      }

      mmulStrassen(y) {
        y = Matrix.checkMatrix(y);
        let x = this.clone();
        let r1 = x.rows;
        let c1 = x.columns;
        let r2 = y.rows;
        let c2 = y.columns;
        if (c1 !== r2) {
          // eslint-disable-next-line no-console
          console.warn(
            `Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`,
          );
        }

        // Put a matrix into the top left of a matrix of zeros.
        // `rows` and `cols` are the dimensions of the output matrix.
        function embed(mat, rows, cols) {
          let r = mat.rows;
          let c = mat.columns;
          if (r === rows && c === cols) {
            return mat;
          } else {
            let resultat = AbstractMatrix.zeros(rows, cols);
            resultat = resultat.setSubMatrix(mat, 0, 0);
            return resultat;
          }
        }

        // Make sure both matrices are the same size.
        // This is exclusively for simplicity:
        // this algorithm can be implemented with matrices of different sizes.

        let r = Math.max(r1, r2);
        let c = Math.max(c1, c2);
        x = embed(x, r, c);
        y = embed(y, r, c);

        // Our recursive multiplication function.
        function blockMult(a, b, rows, cols) {
          // For small matrices, resort to naive multiplication.
          if (rows <= 512 || cols <= 512) {
            return a.mmul(b); // a is equivalent to this
          }

          // Apply dynamic padding.
          if (rows % 2 === 1 && cols % 2 === 1) {
            a = embed(a, rows + 1, cols + 1);
            b = embed(b, rows + 1, cols + 1);
          } else if (rows % 2 === 1) {
            a = embed(a, rows + 1, cols);
            b = embed(b, rows + 1, cols);
          } else if (cols % 2 === 1) {
            a = embed(a, rows, cols + 1);
            b = embed(b, rows, cols + 1);
          }

          let halfRows = parseInt(a.rows / 2, 10);
          let halfCols = parseInt(a.columns / 2, 10);
          // Subdivide input matrices.
          let a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
          let b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

          let a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
          let b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

          let a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
          let b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

          let a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
          let b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

          // Compute intermediate values.
          let m1 = blockMult(
            AbstractMatrix.add(a11, a22),
            AbstractMatrix.add(b11, b22),
            halfRows,
            halfCols,
          );
          let m2 = blockMult(AbstractMatrix.add(a21, a22), b11, halfRows, halfCols);
          let m3 = blockMult(a11, AbstractMatrix.sub(b12, b22), halfRows, halfCols);
          let m4 = blockMult(a22, AbstractMatrix.sub(b21, b11), halfRows, halfCols);
          let m5 = blockMult(AbstractMatrix.add(a11, a12), b22, halfRows, halfCols);
          let m6 = blockMult(
            AbstractMatrix.sub(a21, a11),
            AbstractMatrix.add(b11, b12),
            halfRows,
            halfCols,
          );
          let m7 = blockMult(
            AbstractMatrix.sub(a12, a22),
            AbstractMatrix.add(b21, b22),
            halfRows,
            halfCols,
          );

          // Combine intermediate values into the output.
          let c11 = AbstractMatrix.add(m1, m4);
          c11.sub(m5);
          c11.add(m7);
          let c12 = AbstractMatrix.add(m3, m5);
          let c21 = AbstractMatrix.add(m2, m4);
          let c22 = AbstractMatrix.sub(m1, m2);
          c22.add(m3);
          c22.add(m6);

          // Crop output to the desired size (undo dynamic padding).
          let resultat = AbstractMatrix.zeros(2 * c11.rows, 2 * c11.columns);
          resultat = resultat.setSubMatrix(c11, 0, 0);
          resultat = resultat.setSubMatrix(c12, c11.rows, 0);
          resultat = resultat.setSubMatrix(c21, 0, c11.columns);
          resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
          return resultat.subMatrix(0, rows - 1, 0, cols - 1);
        }

        return blockMult(x, y, r, c);
      }

      scaleRows(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { min = 0, max = 1 } = options;
        if (!Number.isFinite(min)) throw new TypeError('min must be a number');
        if (!Number.isFinite(max)) throw new TypeError('max must be a number');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let newMatrix = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.rows; i++) {
          const row = this.getRow(i);
          if (row.length > 0) {
            rescale(row, { min, max, output: row });
          }
          newMatrix.setRow(i, row);
        }
        return newMatrix;
      }

      scaleColumns(options = {}) {
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { min = 0, max = 1 } = options;
        if (!Number.isFinite(min)) throw new TypeError('min must be a number');
        if (!Number.isFinite(max)) throw new TypeError('max must be a number');
        if (min >= max) throw new RangeError('min must be smaller than max');
        let newMatrix = new Matrix(this.rows, this.columns);
        for (let i = 0; i < this.columns; i++) {
          const column = this.getColumn(i);
          if (column.length) {
            rescale(column, {
              min: min,
              max: max,
              output: column,
            });
          }
          newMatrix.setColumn(i, column);
        }
        return newMatrix;
      }

      flipRows() {
        const middle = Math.ceil(this.columns / 2);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < middle; j++) {
            let first = this.get(i, j);
            let last = this.get(i, this.columns - 1 - j);
            this.set(i, j, last);
            this.set(i, this.columns - 1 - j, first);
          }
        }
        return this;
      }

      flipColumns() {
        const middle = Math.ceil(this.rows / 2);
        for (let j = 0; j < this.columns; j++) {
          for (let i = 0; i < middle; i++) {
            let first = this.get(i, j);
            let last = this.get(this.rows - 1 - i, j);
            this.set(i, j, last);
            this.set(this.rows - 1 - i, j, first);
          }
        }
        return this;
      }

      kroneckerProduct(other) {
        other = Matrix.checkMatrix(other);

        let m = this.rows;
        let n = this.columns;
        let p = other.rows;
        let q = other.columns;

        let result = new Matrix(m * p, n * q);
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
              for (let l = 0; l < q; l++) {
                result.set(p * i + k, q * j + l, this.get(i, j) * other.get(k, l));
              }
            }
          }
        }
        return result;
      }

      kroneckerSum(other) {
        other = Matrix.checkMatrix(other);
        if (!this.isSquare() || !other.isSquare()) {
          throw new Error('Kronecker Sum needs two Square Matrices');
        }
        let m = this.rows;
        let n = other.rows;
        let AxI = this.kroneckerProduct(Matrix.eye(n, n));
        let IxB = Matrix.eye(m, m).kroneckerProduct(other);
        return AxI.add(IxB);
      }

      transpose() {
        let result = new Matrix(this.columns, this.rows);
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            result.set(j, i, this.get(i, j));
          }
        }
        return result;
      }

      sortRows(compareFunction = compareNumbers) {
        for (let i = 0; i < this.rows; i++) {
          this.setRow(i, this.getRow(i).sort(compareFunction));
        }
        return this;
      }

      sortColumns(compareFunction = compareNumbers) {
        for (let i = 0; i < this.columns; i++) {
          this.setColumn(i, this.getColumn(i).sort(compareFunction));
        }
        return this;
      }

      subMatrix(startRow, endRow, startColumn, endColumn) {
        checkRange(this, startRow, endRow, startColumn, endColumn);
        let newMatrix = new Matrix(
          endRow - startRow + 1,
          endColumn - startColumn + 1,
        );
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            newMatrix.set(i - startRow, j - startColumn, this.get(i, j));
          }
        }
        return newMatrix;
      }

      subMatrixRow(indices, startColumn, endColumn) {
        if (startColumn === undefined) startColumn = 0;
        if (endColumn === undefined) endColumn = this.columns - 1;
        if (
          startColumn > endColumn ||
          startColumn < 0 ||
          startColumn >= this.columns ||
          endColumn < 0 ||
          endColumn >= this.columns
        ) {
          throw new RangeError('Argument out of range');
        }

        let newMatrix = new Matrix(indices.length, endColumn - startColumn + 1);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startColumn; j <= endColumn; j++) {
            if (indices[i] < 0 || indices[i] >= this.rows) {
              throw new RangeError(`Row index out of range: ${indices[i]}`);
            }
            newMatrix.set(i, j - startColumn, this.get(indices[i], j));
          }
        }
        return newMatrix;
      }

      subMatrixColumn(indices, startRow, endRow) {
        if (startRow === undefined) startRow = 0;
        if (endRow === undefined) endRow = this.rows - 1;
        if (
          startRow > endRow ||
          startRow < 0 ||
          startRow >= this.rows ||
          endRow < 0 ||
          endRow >= this.rows
        ) {
          throw new RangeError('Argument out of range');
        }

        let newMatrix = new Matrix(endRow - startRow + 1, indices.length);
        for (let i = 0; i < indices.length; i++) {
          for (let j = startRow; j <= endRow; j++) {
            if (indices[i] < 0 || indices[i] >= this.columns) {
              throw new RangeError(`Column index out of range: ${indices[i]}`);
            }
            newMatrix.set(j - startRow, i, this.get(j, indices[i]));
          }
        }
        return newMatrix;
      }

      setSubMatrix(matrix, startRow, startColumn) {
        matrix = Matrix.checkMatrix(matrix);
        if (matrix.isEmpty()) {
          return this;
        }
        let endRow = startRow + matrix.rows - 1;
        let endColumn = startColumn + matrix.columns - 1;
        checkRange(this, startRow, endRow, startColumn, endColumn);
        for (let i = 0; i < matrix.rows; i++) {
          for (let j = 0; j < matrix.columns; j++) {
            this.set(startRow + i, startColumn + j, matrix.get(i, j));
          }
        }
        return this;
      }

      selection(rowIndices, columnIndices) {
        checkRowIndices(this, rowIndices);
        checkColumnIndices(this, columnIndices);
        let newMatrix = new Matrix(rowIndices.length, columnIndices.length);
        for (let i = 0; i < rowIndices.length; i++) {
          let rowIndex = rowIndices[i];
          for (let j = 0; j < columnIndices.length; j++) {
            let columnIndex = columnIndices[j];
            newMatrix.set(i, j, this.get(rowIndex, columnIndex));
          }
        }
        return newMatrix;
      }

      trace() {
        let min = Math.min(this.rows, this.columns);
        let trace = 0;
        for (let i = 0; i < min; i++) {
          trace += this.get(i, i);
        }
        return trace;
      }

      clone() {
        let newMatrix = new Matrix(this.rows, this.columns);
        for (let row = 0; row < this.rows; row++) {
          for (let column = 0; column < this.columns; column++) {
            newMatrix.set(row, column, this.get(row, column));
          }
        }
        return newMatrix;
      }

      sum(by) {
        switch (by) {
          case 'row':
            return sumByRow(this);
          case 'column':
            return sumByColumn(this);
          case undefined:
            return sumAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      product(by) {
        switch (by) {
          case 'row':
            return productByRow(this);
          case 'column':
            return productByColumn(this);
          case undefined:
            return productAll(this);
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      mean(by) {
        const sum = this.sum(by);
        switch (by) {
          case 'row': {
            for (let i = 0; i < this.rows; i++) {
              sum[i] /= this.columns;
            }
            return sum;
          }
          case 'column': {
            for (let i = 0; i < this.columns; i++) {
              sum[i] /= this.rows;
            }
            return sum;
          }
          case undefined:
            return sum / this.size;
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      variance(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { unbiased = true, mean = this.mean(by) } = options;
        if (typeof unbiased !== 'boolean') {
          throw new TypeError('unbiased must be a boolean');
        }
        switch (by) {
          case 'row': {
            if (!isAnyArray(mean)) {
              throw new TypeError('mean must be an array');
            }
            return varianceByRow(this, unbiased, mean);
          }
          case 'column': {
            if (!isAnyArray(mean)) {
              throw new TypeError('mean must be an array');
            }
            return varianceByColumn(this, unbiased, mean);
          }
          case undefined: {
            if (typeof mean !== 'number') {
              throw new TypeError('mean must be a number');
            }
            return varianceAll(this, unbiased, mean);
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      standardDeviation(by, options) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        const variance = this.variance(by, options);
        if (by === undefined) {
          return Math.sqrt(variance);
        } else {
          for (let i = 0; i < variance.length; i++) {
            variance[i] = Math.sqrt(variance[i]);
          }
          return variance;
        }
      }

      center(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        const { center = this.mean(by) } = options;
        switch (by) {
          case 'row': {
            if (!isAnyArray(center)) {
              throw new TypeError('center must be an array');
            }
            centerByRow(this, center);
            return this;
          }
          case 'column': {
            if (!isAnyArray(center)) {
              throw new TypeError('center must be an array');
            }
            centerByColumn(this, center);
            return this;
          }
          case undefined: {
            if (typeof center !== 'number') {
              throw new TypeError('center must be a number');
            }
            centerAll(this, center);
            return this;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      scale(by, options = {}) {
        if (typeof by === 'object') {
          options = by;
          by = undefined;
        }
        if (typeof options !== 'object') {
          throw new TypeError('options must be an object');
        }
        let scale = options.scale;
        switch (by) {
          case 'row': {
            if (scale === undefined) {
              scale = getScaleByRow(this);
            } else if (!isAnyArray(scale)) {
              throw new TypeError('scale must be an array');
            }
            scaleByRow(this, scale);
            return this;
          }
          case 'column': {
            if (scale === undefined) {
              scale = getScaleByColumn(this);
            } else if (!isAnyArray(scale)) {
              throw new TypeError('scale must be an array');
            }
            scaleByColumn(this, scale);
            return this;
          }
          case undefined: {
            if (scale === undefined) {
              scale = getScaleAll(this);
            } else if (typeof scale !== 'number') {
              throw new TypeError('scale must be a number');
            }
            scaleAll(this, scale);
            return this;
          }
          default:
            throw new Error(`invalid option: ${by}`);
        }
      }

      toString(options) {
        return inspectMatrixWithOptions(this, options);
      }
    }

    AbstractMatrix.prototype.klass = 'Matrix';
    if (typeof Symbol !== 'undefined') {
      AbstractMatrix.prototype[Symbol.for('nodejs.util.inspect.custom')] =
        inspectMatrix;
    }

    function compareNumbers(a, b) {
      return a - b;
    }

    function isArrayOfNumbers(array) {
      return array.every((element) => {
        return typeof element === 'number';
      });
    }

    // Synonyms
    AbstractMatrix.random = AbstractMatrix.rand;
    AbstractMatrix.randomInt = AbstractMatrix.randInt;
    AbstractMatrix.diagonal = AbstractMatrix.diag;
    AbstractMatrix.prototype.diagonal = AbstractMatrix.prototype.diag;
    AbstractMatrix.identity = AbstractMatrix.eye;
    AbstractMatrix.prototype.negate = AbstractMatrix.prototype.neg;
    AbstractMatrix.prototype.tensorProduct =
      AbstractMatrix.prototype.kroneckerProduct;

    class Matrix extends AbstractMatrix {
      constructor(nRows, nColumns) {
        super();
        if (Matrix.isMatrix(nRows)) {
          // eslint-disable-next-line no-constructor-return
          return nRows.clone();
        } else if (Number.isInteger(nRows) && nRows >= 0) {
          // Create an empty matrix
          this.data = [];
          if (Number.isInteger(nColumns) && nColumns >= 0) {
            for (let i = 0; i < nRows; i++) {
              this.data.push(new Float64Array(nColumns));
            }
          } else {
            throw new TypeError('nColumns must be a positive integer');
          }
        } else if (isAnyArray(nRows)) {
          // Copy the values from the 2D array
          const arrayData = nRows;
          nRows = arrayData.length;
          nColumns = nRows ? arrayData[0].length : 0;
          if (typeof nColumns !== 'number') {
            throw new TypeError(
              'Data must be a 2D array with at least one element',
            );
          }
          this.data = [];
          for (let i = 0; i < nRows; i++) {
            if (arrayData[i].length !== nColumns) {
              throw new RangeError('Inconsistent array dimensions');
            }
            if (!isArrayOfNumbers(arrayData[i])) {
              throw new TypeError('Input data contains non-numeric values');
            }
            this.data.push(Float64Array.from(arrayData[i]));
          }
        } else {
          throw new TypeError(
            'First argument must be a positive number or an array',
          );
        }
        this.rows = nRows;
        this.columns = nColumns;
      }

      set(rowIndex, columnIndex, value) {
        this.data[rowIndex][columnIndex] = value;
        return this;
      }

      get(rowIndex, columnIndex) {
        return this.data[rowIndex][columnIndex];
      }

      removeRow(index) {
        checkRowIndex(this, index);
        this.data.splice(index, 1);
        this.rows -= 1;
        return this;
      }

      addRow(index, array) {
        if (array === undefined) {
          array = index;
          index = this.rows;
        }
        checkRowIndex(this, index, true);
        array = Float64Array.from(checkRowVector(this, array));
        this.data.splice(index, 0, array);
        this.rows += 1;
        return this;
      }

      removeColumn(index) {
        checkColumnIndex(this, index);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns - 1);
          for (let j = 0; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          for (let j = index + 1; j < this.columns; j++) {
            newRow[j - 1] = this.data[i][j];
          }
          this.data[i] = newRow;
        }
        this.columns -= 1;
        return this;
      }

      addColumn(index, array) {
        if (typeof array === 'undefined') {
          array = index;
          index = this.columns;
        }
        checkColumnIndex(this, index, true);
        array = checkColumnVector(this, array);
        for (let i = 0; i < this.rows; i++) {
          const newRow = new Float64Array(this.columns + 1);
          let j = 0;
          for (; j < index; j++) {
            newRow[j] = this.data[i][j];
          }
          newRow[j++] = array[i];
          for (; j < this.columns + 1; j++) {
            newRow[j] = this.data[i][j - 1];
          }
          this.data[i] = newRow;
        }
        this.columns += 1;
        return this;
      }
    }

    installMathOperations(AbstractMatrix, Matrix);

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var numeric1_2_6 = {};

    (function (exports) {

    	var numeric = (exports);
    	if(typeof commonjsGlobal !== "undefined") { commonjsGlobal.numeric = numeric; }

    	numeric.version = "1.2.6";

    	// 1. Utility functions
    	numeric.bench = function bench (f,interval) {
    	    var t1,t2,n,i;
    	    if(typeof interval === "undefined") { interval = 15; }
    	    n = 0.5;
    	    t1 = new Date();
    	    while(1) {
    	        n*=2;
    	        for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
    	        while(i>0) { f(); i--; }
    	        t2 = new Date();
    	        if(t2-t1 > interval) break;
    	    }
    	    for(i=n;i>3;i-=4) { f(); f(); f(); f(); }
    	    while(i>0) { f(); i--; }
    	    t2 = new Date();
    	    return 1000*(3*n-1)/(t2-t1);
    	};

    	numeric._myIndexOf = (function _myIndexOf(w) {
    	    var n = this.length,k;
    	    for(k=0;k<n;++k) if(this[k]===w) return k;
    	    return -1;
    	});
    	numeric.myIndexOf = (Array.prototype.indexOf)?Array.prototype.indexOf:numeric._myIndexOf;

    	numeric.Function = Function;
    	numeric.precision = 4;
    	numeric.largeArray = 50;

    	numeric.prettyPrint = function prettyPrint(x) {
    	    function fmtnum(x) {
    	        if(x === 0) { return '0'; }
    	        if(isNaN(x)) { return 'NaN'; }
    	        if(x<0) { return '-'+fmtnum(-x); }
    	        if(isFinite(x)) {
    	            var scale = Math.floor(Math.log(x) / Math.log(10));
    	            var normalized = x / Math.pow(10,scale);
    	            var basic = normalized.toPrecision(numeric.precision);
    	            if(parseFloat(basic) === 10) { scale++; normalized = 1; basic = normalized.toPrecision(numeric.precision); }
    	            return parseFloat(basic).toString()+'e'+scale.toString();
    	        }
    	        return 'Infinity';
    	    }
    	    var ret = [];
    	    function foo(x) {
    	        var k;
    	        if(typeof x === "undefined") { ret.push(Array(numeric.precision+8).join(' ')); return false; }
    	        if(typeof x === "string") { ret.push('"'+x+'"'); return false; }
    	        if(typeof x === "boolean") { ret.push(x.toString()); return false; }
    	        if(typeof x === "number") {
    	            var a = fmtnum(x);
    	            var b = x.toPrecision(numeric.precision);
    	            var c = parseFloat(x.toString()).toString();
    	            var d = [a,b,c,parseFloat(b).toString(),parseFloat(c).toString()];
    	            for(k=1;k<d.length;k++) { if(d[k].length < a.length) a = d[k]; }
    	            ret.push(Array(numeric.precision+8-a.length).join(' ')+a);
    	            return false;
    	        }
    	        if(x === null) { ret.push("null"); return false; }
    	        if(typeof x === "function") { 
    	            ret.push(x.toString());
    	            var flag = false;
    	            for(k in x) { if(x.hasOwnProperty(k)) { 
    	                if(flag) ret.push(',\n');
    	                else ret.push('\n{');
    	                flag = true; 
    	                ret.push(k); 
    	                ret.push(': \n'); 
    	                foo(x[k]); 
    	            } }
    	            if(flag) ret.push('}\n');
    	            return true;
    	        }
    	        if(x instanceof Array) {
    	            if(x.length > numeric.largeArray) { ret.push('...Large Array...'); return true; }
    	            var flag = false;
    	            ret.push('[');
    	            for(k=0;k<x.length;k++) { if(k>0) { ret.push(','); if(flag) ret.push('\n '); } flag = foo(x[k]); }
    	            ret.push(']');
    	            return true;
    	        }
    	        ret.push('{');
    	        var flag = false;
    	        for(k in x) { if(x.hasOwnProperty(k)) { if(flag) ret.push(',\n'); flag = true; ret.push(k); ret.push(': \n'); foo(x[k]); } }
    	        ret.push('}');
    	        return true;
    	    }
    	    foo(x);
    	    return ret.join('');
    	};

    	numeric.parseDate = function parseDate(d) {
    	    function foo(d) {
    	        if(typeof d === 'string') { return Date.parse(d.replace(/-/g,'/')); }
    	        if(!(d instanceof Array)) { throw new Error("parseDate: parameter must be arrays of strings"); }
    	        var ret = [],k;
    	        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
    	        return ret;
    	    }
    	    return foo(d);
    	};

    	numeric.parseFloat = function parseFloat_(d) {
    	    function foo(d) {
    	        if(typeof d === 'string') { return parseFloat(d); }
    	        if(!(d instanceof Array)) { throw new Error("parseFloat: parameter must be arrays of strings"); }
    	        var ret = [],k;
    	        for(k=0;k<d.length;k++) { ret[k] = foo(d[k]); }
    	        return ret;
    	    }
    	    return foo(d);
    	};

    	numeric.parseCSV = function parseCSV(t) {
    	    var foo = t.split('\n');
    	    var j,k;
    	    var ret = [];
    	    var pat = /(([^'",]*)|('[^']*')|("[^"]*")),/g;
    	    var patnum = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/;
    	    var stripper = function(n) { return n.substr(0,n.length-1); };
    	    var count = 0;
    	    for(k=0;k<foo.length;k++) {
    	      var bar = (foo[k]+",").match(pat),baz;
    	      if(bar.length>0) {
    	          ret[count] = [];
    	          for(j=0;j<bar.length;j++) {
    	              baz = stripper(bar[j]);
    	              if(patnum.test(baz)) { ret[count][j] = parseFloat(baz); }
    	              else ret[count][j] = baz;
    	          }
    	          count++;
    	      }
    	    }
    	    return ret;
    	};

    	numeric.toCSV = function toCSV(A) {
    	    var s = numeric.dim(A);
    	    var i,j,m,row,ret;
    	    m = s[0];
    	    ret = [];
    	    for(i=0;i<m;i++) {
    	        row = [];
    	        for(j=0;j<m;j++) { row[j] = A[i][j].toString(); }
    	        ret[i] = row.join(', ');
    	    }
    	    return ret.join('\n')+'\n';
    	};

    	numeric.getURL = function getURL(url) {
    	    var client = new XMLHttpRequest();
    	    client.open("GET",url,false);
    	    client.send();
    	    return client;
    	};

    	numeric.imageURL = function imageURL(img) {
    	    function base64(A) {
    	        var n = A.length, i,x,y,z,p,q,r,s;
    	        var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    	        var ret = "";
    	        for(i=0;i<n;i+=3) {
    	            x = A[i];
    	            y = A[i+1];
    	            z = A[i+2];
    	            p = x >> 2;
    	            q = ((x & 3) << 4) + (y >> 4);
    	            r = ((y & 15) << 2) + (z >> 6);
    	            s = z & 63;
    	            if(i+1>=n) { r = s = 64; }
    	            else if(i+2>=n) { s = 64; }
    	            ret += key.charAt(p) + key.charAt(q) + key.charAt(r) + key.charAt(s);
    	            }
    	        return ret;
    	    }
    	    function crc32Array (a,from,to) {
    	        if(typeof from === "undefined") { from = 0; }
    	        if(typeof to === "undefined") { to = a.length; }
    	        var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
    	                     0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 
    	                     0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
    	                     0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 
    	                     0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 
    	                     0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 
    	                     0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
    	                     0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
    	                     0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
    	                     0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 
    	                     0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 
    	                     0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 
    	                     0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 
    	                     0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 
    	                     0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 
    	                     0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 
    	                     0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 
    	                     0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 
    	                     0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 
    	                     0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 
    	                     0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 
    	                     0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 
    	                     0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 
    	                     0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 
    	                     0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 
    	                     0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 
    	                     0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 
    	                     0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 
    	                     0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 
    	                     0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 
    	                     0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 
    	                     0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
    	     
    	        var crc = -1, y = 0; a.length;var i;

    	        for (i = from; i < to; i++) {
    	            y = (crc ^ a[i]) & 0xFF;
    	            crc = (crc >>> 8) ^ table[y];
    	        }
    	     
    	        return crc ^ (-1);
    	    }

    	    var h = img[0].length, w = img[0][0].length, s1, s2, k,length,a,b,i,j,adler32,crc32;
    	    var stream = [
    	                  137, 80, 78, 71, 13, 10, 26, 10,                           //  0: PNG signature
    	                  0,0,0,13,                                                  //  8: IHDR Chunk length
    	                  73, 72, 68, 82,                                            // 12: "IHDR" 
    	                  (w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w&255,   // 16: Width
    	                  (h >> 24) & 255, (h >> 16) & 255, (h >> 8) & 255, h&255,   // 20: Height
    	                  8,                                                         // 24: bit depth
    	                  2,                                                         // 25: RGB
    	                  0,                                                         // 26: deflate
    	                  0,                                                         // 27: no filter
    	                  0,                                                         // 28: no interlace
    	                  -1,-2,-3,-4,                                               // 29: CRC
    	                  -5,-6,-7,-8,                                               // 33: IDAT Chunk length
    	                  73, 68, 65, 84,                                            // 37: "IDAT"
    	                  // RFC 1950 header starts here
    	                  8,                                                         // 41: RFC1950 CMF
    	                  29                                                         // 42: RFC1950 FLG
    	                  ];
    	    crc32 = crc32Array(stream,12,29);
    	    stream[29] = (crc32>>24)&255;
    	    stream[30] = (crc32>>16)&255;
    	    stream[31] = (crc32>>8)&255;
    	    stream[32] = (crc32)&255;
    	    s1 = 1;
    	    s2 = 0;
    	    for(i=0;i<h;i++) {
    	        if(i<h-1) { stream.push(0); }
    	        else { stream.push(1); }
    	        a = (3*w+1+(i===0))&255; b = ((3*w+1+(i===0))>>8)&255;
    	        stream.push(a); stream.push(b);
    	        stream.push((~a)&255); stream.push((~b)&255);
    	        if(i===0) stream.push(0);
    	        for(j=0;j<w;j++) {
    	            for(k=0;k<3;k++) {
    	                a = img[k][i][j];
    	                if(a>255) a = 255;
    	                else if(a<0) a=0;
    	                else a = Math.round(a);
    	                s1 = (s1 + a )%65521;
    	                s2 = (s2 + s1)%65521;
    	                stream.push(a);
    	            }
    	        }
    	        stream.push(0);
    	    }
    	    adler32 = (s2<<16)+s1;
    	    stream.push((adler32>>24)&255);
    	    stream.push((adler32>>16)&255);
    	    stream.push((adler32>>8)&255);
    	    stream.push((adler32)&255);
    	    length = stream.length - 41;
    	    stream[33] = (length>>24)&255;
    	    stream[34] = (length>>16)&255;
    	    stream[35] = (length>>8)&255;
    	    stream[36] = (length)&255;
    	    crc32 = crc32Array(stream,37);
    	    stream.push((crc32>>24)&255);
    	    stream.push((crc32>>16)&255);
    	    stream.push((crc32>>8)&255);
    	    stream.push((crc32)&255);
    	    stream.push(0);
    	    stream.push(0);
    	    stream.push(0);
    	    stream.push(0);
    	//    a = stream.length;
    	    stream.push(73);  // I
    	    stream.push(69);  // E
    	    stream.push(78);  // N
    	    stream.push(68);  // D
    	    stream.push(174); // CRC1
    	    stream.push(66);  // CRC2
    	    stream.push(96);  // CRC3
    	    stream.push(130); // CRC4
    	    return 'data:image/png;base64,'+base64(stream);
    	};

    	// 2. Linear algebra with Arrays.
    	numeric._dim = function _dim(x) {
    	    var ret = [];
    	    while(typeof x === "object") { ret.push(x.length); x = x[0]; }
    	    return ret;
    	};

    	numeric.dim = function dim(x) {
    	    var y,z;
    	    if(typeof x === "object") {
    	        y = x[0];
    	        if(typeof y === "object") {
    	            z = y[0];
    	            if(typeof z === "object") {
    	                return numeric._dim(x);
    	            }
    	            return [x.length,y.length];
    	        }
    	        return [x.length];
    	    }
    	    return [];
    	};

    	numeric.mapreduce = function mapreduce(body,init) {
    	    return Function('x','accum','_s','_k',
    	            'if(typeof accum === "undefined") accum = '+init+';\n'+
    	            'if(typeof x === "number") { var xi = x; '+body+'; return accum; }\n'+
    	            'if(typeof _s === "undefined") _s = numeric.dim(x);\n'+
    	            'if(typeof _k === "undefined") _k = 0;\n'+
    	            'var _n = _s[_k];\n'+
    	            'var i,xi;\n'+
    	            'if(_k < _s.length-1) {\n'+
    	            '    for(i=_n-1;i>=0;i--) {\n'+
    	            '        accum = arguments.callee(x[i],accum,_s,_k+1);\n'+
    	            '    }'+
    	            '    return accum;\n'+
    	            '}\n'+
    	            'for(i=_n-1;i>=1;i-=2) { \n'+
    	            '    xi = x[i];\n'+
    	            '    '+body+';\n'+
    	            '    xi = x[i-1];\n'+
    	            '    '+body+';\n'+
    	            '}\n'+
    	            'if(i === 0) {\n'+
    	            '    xi = x[i];\n'+
    	            '    '+body+'\n'+
    	            '}\n'+
    	            'return accum;'
    	            );
    	};
    	numeric.mapreduce2 = function mapreduce2(body,setup) {
    	    return Function('x',
    	            'var n = x.length;\n'+
    	            'var i,xi;\n'+setup+';\n'+
    	            'for(i=n-1;i!==-1;--i) { \n'+
    	            '    xi = x[i];\n'+
    	            '    '+body+';\n'+
    	            '}\n'+
    	            'return accum;'
    	            );
    	};


    	numeric.same = function same(x,y) {
    	    var i,n;
    	    if(!(x instanceof Array) || !(y instanceof Array)) { return false; }
    	    n = x.length;
    	    if(n !== y.length) { return false; }
    	    for(i=0;i<n;i++) {
    	        if(x[i] === y[i]) { continue; }
    	        if(typeof x[i] === "object") { if(!same(x[i],y[i])) return false; }
    	        else { return false; }
    	    }
    	    return true;
    	};

    	numeric.rep = function rep(s,v,k) {
    	    if(typeof k === "undefined") { k=0; }
    	    var n = s[k], ret = Array(n), i;
    	    if(k === s.length-1) {
    	        for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
    	        if(i===-1) { ret[0] = v; }
    	        return ret;
    	    }
    	    for(i=n-1;i>=0;i--) { ret[i] = numeric.rep(s,v,k+1); }
    	    return ret;
    	};


    	numeric.dotMMsmall = function dotMMsmall(x,y) {
    	    var i,j,k,p,q,r,ret,foo,bar,woo,i0;
    	    p = x.length; q = y.length; r = y[0].length;
    	    ret = Array(p);
    	    for(i=p-1;i>=0;i--) {
    	        foo = Array(r);
    	        bar = x[i];
    	        for(k=r-1;k>=0;k--) {
    	            woo = bar[q-1]*y[q-1][k];
    	            for(j=q-2;j>=1;j-=2) {
    	                i0 = j-1;
    	                woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
    	            }
    	            if(j===0) { woo += bar[0]*y[0][k]; }
    	            foo[k] = woo;
    	        }
    	        ret[i] = foo;
    	    }
    	    return ret;
    	};
    	numeric._getCol = function _getCol(A,j,x) {
    	    var n = A.length, i;
    	    for(i=n-1;i>0;--i) {
    	        x[i] = A[i][j];
    	        --i;
    	        x[i] = A[i][j];
    	    }
    	    if(i===0) x[0] = A[0][j];
    	};
    	numeric.dotMMbig = function dotMMbig(x,y){
    	    var gc = numeric._getCol, p = y.length, v = Array(p);
    	    var m = x.length, n = y[0].length, A = new Array(m), xj;
    	    var VV = numeric.dotVV;
    	    var i,j;
    	    --p;
    	    --m;
    	    for(i=m;i!==-1;--i) A[i] = Array(n);
    	    --n;
    	    for(i=n;i!==-1;--i) {
    	        gc(y,i,v);
    	        for(j=m;j!==-1;--j) {
    	            xj = x[j];
    	            A[j][i] = VV(xj,v);
    	        }
    	    }
    	    return A;
    	};

    	numeric.dotMV = function dotMV(x,y) {
    	    var p = x.length; y.length;var i;
    	    var ret = Array(p), dotVV = numeric.dotVV;
    	    for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
    	    return ret;
    	};

    	numeric.dotVM = function dotVM(x,y) {
    	    var j,k,p,q,ret,woo,i0;
    	    p = x.length; q = y[0].length;
    	    ret = Array(q);
    	    for(k=q-1;k>=0;k--) {
    	        woo = x[p-1]*y[p-1][k];
    	        for(j=p-2;j>=1;j-=2) {
    	            i0 = j-1;
    	            woo += x[j]*y[j][k] + x[i0]*y[i0][k];
    	        }
    	        if(j===0) { woo += x[0]*y[0][k]; }
    	        ret[k] = woo;
    	    }
    	    return ret;
    	};

    	numeric.dotVV = function dotVV(x,y) {
    	    var i,n=x.length,i1,ret = x[n-1]*y[n-1];
    	    for(i=n-2;i>=1;i-=2) {
    	        i1 = i-1;
    	        ret += x[i]*y[i] + x[i1]*y[i1];
    	    }
    	    if(i===0) { ret += x[0]*y[0]; }
    	    return ret;
    	};

    	numeric.dot = function dot(x,y) {
    	    var d = numeric.dim;
    	    switch(d(x).length*1000+d(y).length) {
    	    case 2002:
    	        if(y.length < 10) return numeric.dotMMsmall(x,y);
    	        else return numeric.dotMMbig(x,y);
    	    case 2001: return numeric.dotMV(x,y);
    	    case 1002: return numeric.dotVM(x,y);
    	    case 1001: return numeric.dotVV(x,y);
    	    case 1000: return numeric.mulVS(x,y);
    	    case 1: return numeric.mulSV(x,y);
    	    case 0: return x*y;
    	    default: throw new Error('numeric.dot only works on vectors and matrices');
    	    }
    	};

    	numeric.diag = function diag(d) {
    	    var i,i1,j,n = d.length, A = Array(n), Ai;
    	    for(i=n-1;i>=0;i--) {
    	        Ai = Array(n);
    	        i1 = i+2;
    	        for(j=n-1;j>=i1;j-=2) {
    	            Ai[j] = 0;
    	            Ai[j-1] = 0;
    	        }
    	        if(j>i) { Ai[j] = 0; }
    	        Ai[i] = d[i];
    	        for(j=i-1;j>=1;j-=2) {
    	            Ai[j] = 0;
    	            Ai[j-1] = 0;
    	        }
    	        if(j===0) { Ai[0] = 0; }
    	        A[i] = Ai;
    	    }
    	    return A;
    	};
    	numeric.getDiag = function(A) {
    	    var n = Math.min(A.length,A[0].length),i,ret = Array(n);
    	    for(i=n-1;i>=1;--i) {
    	        ret[i] = A[i][i];
    	        --i;
    	        ret[i] = A[i][i];
    	    }
    	    if(i===0) {
    	        ret[0] = A[0][0];
    	    }
    	    return ret;
    	};

    	numeric.identity = function identity(n) { return numeric.diag(numeric.rep([n],1)); };
    	numeric.pointwise = function pointwise(params,body,setup) {
    	    if(typeof setup === "undefined") { setup = ""; }
    	    var fun = [];
    	    var k;
    	    var avec = /\[i\]$/,p,thevec = '';
    	    var haveret = false;
    	    for(k=0;k<params.length;k++) {
    	        if(avec.test(params[k])) {
    	            p = params[k].substring(0,params[k].length-3);
    	            thevec = p;
    	        } else { p = params[k]; }
    	        if(p==='ret') haveret = true;
    	        fun.push(p);
    	    }
    	    fun[params.length] = '_s';
    	    fun[params.length+1] = '_k';
    	    fun[params.length+2] = (
    	            'if(typeof _s === "undefined") _s = numeric.dim('+thevec+');\n'+
    	            'if(typeof _k === "undefined") _k = 0;\n'+
    	            'var _n = _s[_k];\n'+
    	            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
    	            'if(_k < _s.length-1) {\n'+
    	            '    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee('+params.join(',')+',_s,_k+1);\n'+
    	            '    return ret;\n'+
    	            '}\n'+
    	            setup+'\n'+
    	            'for(i=_n-1;i!==-1;--i) {\n'+
    	            '    '+body+'\n'+
    	            '}\n'+
    	            'return ret;'
    	            );
    	    return Function.apply(null,fun);
    	};
    	numeric.pointwise2 = function pointwise2(params,body,setup) {
    	    if(typeof setup === "undefined") { setup = ""; }
    	    var fun = [];
    	    var k;
    	    var avec = /\[i\]$/,p,thevec = '';
    	    var haveret = false;
    	    for(k=0;k<params.length;k++) {
    	        if(avec.test(params[k])) {
    	            p = params[k].substring(0,params[k].length-3);
    	            thevec = p;
    	        } else { p = params[k]; }
    	        if(p==='ret') haveret = true;
    	        fun.push(p);
    	    }
    	    fun[params.length] = (
    	            'var _n = '+thevec+'.length;\n'+
    	            'var i'+(haveret?'':', ret = Array(_n)')+';\n'+
    	            setup+'\n'+
    	            'for(i=_n-1;i!==-1;--i) {\n'+
    	            body+'\n'+
    	            '}\n'+
    	            'return ret;'
    	            );
    	    return Function.apply(null,fun);
    	};
    	numeric._biforeach = (function _biforeach(x,y,s,k,f) {
    	    if(k === s.length-1) { f(x,y); return; }
    	    var i,n=s[k];
    	    for(i=n-1;i>=0;i--) { _biforeach(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
    	});
    	numeric._biforeach2 = (function _biforeach2(x,y,s,k,f) {
    	    if(k === s.length-1) { return f(x,y); }
    	    var i,n=s[k],ret = Array(n);
    	    for(i=n-1;i>=0;--i) { ret[i] = _biforeach2(typeof x==="object"?x[i]:x,typeof y==="object"?y[i]:y,s,k+1,f); }
    	    return ret;
    	});
    	numeric._foreach = (function _foreach(x,s,k,f) {
    	    if(k === s.length-1) { f(x); return; }
    	    var i,n=s[k];
    	    for(i=n-1;i>=0;i--) { _foreach(x[i],s,k+1,f); }
    	});
    	numeric._foreach2 = (function _foreach2(x,s,k,f) {
    	    if(k === s.length-1) { return f(x); }
    	    var i,n=s[k], ret = Array(n);
    	    for(i=n-1;i>=0;i--) { ret[i] = _foreach2(x[i],s,k+1,f); }
    	    return ret;
    	});

    	/*numeric.anyV = numeric.mapreduce('if(xi) return true;','false');
    	numeric.allV = numeric.mapreduce('if(!xi) return false;','true');
    	numeric.any = function(x) { if(typeof x.length === "undefined") return x; return numeric.anyV(x); }
    	numeric.all = function(x) { if(typeof x.length === "undefined") return x; return numeric.allV(x); }*/

    	numeric.ops2 = {
    	        add: '+',
    	        sub: '-',
    	        mul: '*',
    	        div: '/',
    	        mod: '%',
    	        and: '&&',
    	        or:  '||',
    	        eq:  '===',
    	        neq: '!==',
    	        lt:  '<',
    	        gt:  '>',
    	        leq: '<=',
    	        geq: '>=',
    	        band: '&',
    	        bor: '|',
    	        bxor: '^',
    	        lshift: '<<',
    	        rshift: '>>',
    	        rrshift: '>>>'
    	};
    	numeric.opseq = {
    	        addeq: '+=',
    	        subeq: '-=',
    	        muleq: '*=',
    	        diveq: '/=',
    	        modeq: '%=',
    	        lshifteq: '<<=',
    	        rshifteq: '>>=',
    	        rrshifteq: '>>>=',
    	        bandeq: '&=',
    	        boreq: '|=',
    	        bxoreq: '^='
    	};
    	numeric.mathfuns = ['abs','acos','asin','atan','ceil','cos',
    	                    'exp','floor','log','round','sin','sqrt','tan',
    	                    'isNaN','isFinite'];
    	numeric.mathfuns2 = ['atan2','pow','max','min'];
    	numeric.ops1 = {
    	        neg: '-',
    	        not: '!',
    	        bnot: '~',
    	        clone: ''
    	};
    	numeric.mapreducers = {
    	        any: ['if(xi) return true;','var accum = false;'],
    	        all: ['if(!xi) return false;','var accum = true;'],
    	        sum: ['accum += xi;','var accum = 0;'],
    	        prod: ['accum *= xi;','var accum = 1;'],
    	        norm2Squared: ['accum += xi*xi;','var accum = 0;'],
    	        norminf: ['accum = max(accum,abs(xi));','var accum = 0, max = Math.max, abs = Math.abs;'],
    	        norm1: ['accum += abs(xi)','var accum = 0, abs = Math.abs;'],
    	        sup: ['accum = max(accum,xi);','var accum = -Infinity, max = Math.max;'],
    	        inf: ['accum = min(accum,xi);','var accum = Infinity, min = Math.min;']
    	};

    	(function () {
    	    var i,o;
    	    for(i=0;i<numeric.mathfuns2.length;++i) {
    	        o = numeric.mathfuns2[i];
    	        numeric.ops2[o] = o;
    	    }
    	    for(i in numeric.ops2) {
    	        if(numeric.ops2.hasOwnProperty(i)) {
    	            o = numeric.ops2[i];
    	            var code, codeeq, setup = '';
    	            if(numeric.myIndexOf.call(numeric.mathfuns2,i)!==-1) {
    	                setup = 'var '+o+' = Math.'+o+';\n';
    	                code = function(r,x,y) { return r+' = '+o+'('+x+','+y+')'; };
    	                codeeq = function(x,y) { return x+' = '+o+'('+x+','+y+')'; };
    	            } else {
    	                code = function(r,x,y) { return r+' = '+x+' '+o+' '+y; };
    	                if(numeric.opseq.hasOwnProperty(i+'eq')) {
    	                    codeeq = function(x,y) { return x+' '+o+'= '+y; };
    	                } else {
    	                    codeeq = function(x,y) { return x+' = '+x+' '+o+' '+y; };                    
    	                }
    	            }
    	            numeric[i+'VV'] = numeric.pointwise2(['x[i]','y[i]'],code('ret[i]','x[i]','y[i]'),setup);
    	            numeric[i+'SV'] = numeric.pointwise2(['x','y[i]'],code('ret[i]','x','y[i]'),setup);
    	            numeric[i+'VS'] = numeric.pointwise2(['x[i]','y'],code('ret[i]','x[i]','y'),setup);
    	            numeric[i] = Function(
    	                    'var n = arguments.length, i, x = arguments[0], y;\n'+
    	                    'var VV = numeric.'+i+'VV, VS = numeric.'+i+'VS, SV = numeric.'+i+'SV;\n'+
    	                    'var dim = numeric.dim;\n'+
    	                    'for(i=1;i!==n;++i) { \n'+
    	                    '  y = arguments[i];\n'+
    	                    '  if(typeof x === "object") {\n'+
    	                    '      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n'+
    	                    '      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n'+
    	                    '  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n'+
    	                    '  else '+codeeq('x','y')+'\n'+
    	                    '}\nreturn x;\n');
    	            numeric[o] = numeric[i];
    	            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]','x[i]'], codeeq('ret[i]','x[i]'),setup);
    	            numeric[i+'eqS'] = numeric.pointwise2(['ret[i]','x'], codeeq('ret[i]','x'),setup);
    	            numeric[i+'eq'] = Function(
    	                    'var n = arguments.length, i, x = arguments[0], y;\n'+
    	                    'var V = numeric.'+i+'eqV, S = numeric.'+i+'eqS\n'+
    	                    'var s = numeric.dim(x);\n'+
    	                    'for(i=1;i!==n;++i) { \n'+
    	                    '  y = arguments[i];\n'+
    	                    '  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n'+
    	                    '  else numeric._biforeach(x,y,s,0,S);\n'+
    	                    '}\nreturn x;\n');
    	        }
    	    }
    	    for(i=0;i<numeric.mathfuns2.length;++i) {
    	        o = numeric.mathfuns2[i];
    	        delete numeric.ops2[o];
    	    }
    	    for(i=0;i<numeric.mathfuns.length;++i) {
    	        o = numeric.mathfuns[i];
    	        numeric.ops1[o] = o;
    	    }
    	    for(i in numeric.ops1) {
    	        if(numeric.ops1.hasOwnProperty(i)) {
    	            setup = '';
    	            o = numeric.ops1[i];
    	            if(numeric.myIndexOf.call(numeric.mathfuns,i)!==-1) {
    	                if(Math.hasOwnProperty(o)) setup = 'var '+o+' = Math.'+o+';\n';
    	            }
    	            numeric[i+'eqV'] = numeric.pointwise2(['ret[i]'],'ret[i] = '+o+'(ret[i]);',setup);
    	            numeric[i+'eq'] = Function('x',
    	                    'if(typeof x !== "object") return '+o+'x\n'+
    	                    'var i;\n'+
    	                    'var V = numeric.'+i+'eqV;\n'+
    	                    'var s = numeric.dim(x);\n'+
    	                    'numeric._foreach(x,s,0,V);\n'+
    	                    'return x;\n');
    	            numeric[i+'V'] = numeric.pointwise2(['x[i]'],'ret[i] = '+o+'(x[i]);',setup);
    	            numeric[i] = Function('x',
    	                    'if(typeof x !== "object") return '+o+'(x)\n'+
    	                    'var i;\n'+
    	                    'var V = numeric.'+i+'V;\n'+
    	                    'var s = numeric.dim(x);\n'+
    	                    'return numeric._foreach2(x,s,0,V);\n');
    	        }
    	    }
    	    for(i=0;i<numeric.mathfuns.length;++i) {
    	        o = numeric.mathfuns[i];
    	        delete numeric.ops1[o];
    	    }
    	    for(i in numeric.mapreducers) {
    	        if(numeric.mapreducers.hasOwnProperty(i)) {
    	            o = numeric.mapreducers[i];
    	            numeric[i+'V'] = numeric.mapreduce2(o[0],o[1]);
    	            numeric[i] = Function('x','s','k',
    	                    o[1]+
    	                    'if(typeof x !== "object") {'+
    	                    '    xi = x;\n'+
    	                    o[0]+';\n'+
    	                    '    return accum;\n'+
    	                    '}'+
    	                    'if(typeof s === "undefined") s = numeric.dim(x);\n'+
    	                    'if(typeof k === "undefined") k = 0;\n'+
    	                    'if(k === s.length-1) return numeric.'+i+'V(x);\n'+
    	                    'var xi;\n'+
    	                    'var n = x.length, i;\n'+
    	                    'for(i=n-1;i!==-1;--i) {\n'+
    	                    '   xi = arguments.callee(x[i]);\n'+
    	                    o[0]+';\n'+
    	                    '}\n'+
    	                    'return accum;\n');
    	        }
    	    }
    	}());

    	numeric.truncVV = numeric.pointwise(['x[i]','y[i]'],'ret[i] = round(x[i]/y[i])*y[i];','var round = Math.round;');
    	numeric.truncVS = numeric.pointwise(['x[i]','y'],'ret[i] = round(x[i]/y)*y;','var round = Math.round;');
    	numeric.truncSV = numeric.pointwise(['x','y[i]'],'ret[i] = round(x/y[i])*y[i];','var round = Math.round;');
    	numeric.trunc = function trunc(x,y) {
    	    if(typeof x === "object") {
    	        if(typeof y === "object") return numeric.truncVV(x,y);
    	        return numeric.truncVS(x,y);
    	    }
    	    if (typeof y === "object") return numeric.truncSV(x,y);
    	    return Math.round(x/y)*y;
    	};

    	numeric.inv = function inv(x) {
    	    var s = numeric.dim(x), abs = Math.abs, m = s[0], n = s[1];
    	    var A = numeric.clone(x), Ai, Aj;
    	    var I = numeric.identity(m), Ii, Ij;
    	    var i,j,k,x;
    	    for(j=0;j<n;++j) {
    	        var i0 = -1;
    	        var v0 = -1;
    	        for(i=j;i!==m;++i) { k = abs(A[i][j]); if(k>v0) { i0 = i; v0 = k; } }
    	        Aj = A[i0]; A[i0] = A[j]; A[j] = Aj;
    	        Ij = I[i0]; I[i0] = I[j]; I[j] = Ij;
    	        x = Aj[j];
    	        for(k=j;k!==n;++k)    Aj[k] /= x; 
    	        for(k=n-1;k!==-1;--k) Ij[k] /= x;
    	        for(i=m-1;i!==-1;--i) {
    	            if(i!==j) {
    	                Ai = A[i];
    	                Ii = I[i];
    	                x = Ai[j];
    	                for(k=j+1;k!==n;++k)  Ai[k] -= Aj[k]*x;
    	                for(k=n-1;k>0;--k) { Ii[k] -= Ij[k]*x; --k; Ii[k] -= Ij[k]*x; }
    	                if(k===0) Ii[0] -= Ij[0]*x;
    	            }
    	        }
    	    }
    	    return I;
    	};

    	numeric.det = function det(x) {
    	    var s = numeric.dim(x);
    	    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices'); }
    	    var n = s[0], ret = 1,i,j,k,A = numeric.clone(x),Aj,Ai,alpha,temp,k1;
    	    for(j=0;j<n-1;j++) {
    	        k=j;
    	        for(i=j+1;i<n;i++) { if(Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i; } }
    	        if(k !== j) {
    	            temp = A[k]; A[k] = A[j]; A[j] = temp;
    	            ret *= -1;
    	        }
    	        Aj = A[j];
    	        for(i=j+1;i<n;i++) {
    	            Ai = A[i];
    	            alpha = Ai[j]/Aj[j];
    	            for(k=j+1;k<n-1;k+=2) {
    	                k1 = k+1;
    	                Ai[k] -= Aj[k]*alpha;
    	                Ai[k1] -= Aj[k1]*alpha;
    	            }
    	            if(k!==n) { Ai[k] -= Aj[k]*alpha; }
    	        }
    	        if(Aj[j] === 0) { return 0; }
    	        ret *= Aj[j];
    	    }
    	    return ret*A[j][j];
    	};

    	numeric.transpose = function transpose(x) {
    	    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    	    for(j=0;j<n;j++) ret[j] = Array(m);
    	    for(i=m-1;i>=1;i-=2) {
    	        A1 = x[i];
    	        A0 = x[i-1];
    	        for(j=n-1;j>=1;--j) {
    	            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
    	            --j;
    	            Bj = ret[j]; Bj[i] = A1[j]; Bj[i-1] = A0[j];
    	        }
    	        if(j===0) {
    	            Bj = ret[0]; Bj[i] = A1[0]; Bj[i-1] = A0[0];
    	        }
    	    }
    	    if(i===0) {
    	        A0 = x[0];
    	        for(j=n-1;j>=1;--j) {
    	            ret[j][0] = A0[j];
    	            --j;
    	            ret[j][0] = A0[j];
    	        }
    	        if(j===0) { ret[0][0] = A0[0]; }
    	    }
    	    return ret;
    	};
    	numeric.negtranspose = function negtranspose(x) {
    	    var i,j,m = x.length,n = x[0].length, ret=Array(n),A0,A1,Bj;
    	    for(j=0;j<n;j++) ret[j] = Array(m);
    	    for(i=m-1;i>=1;i-=2) {
    	        A1 = x[i];
    	        A0 = x[i-1];
    	        for(j=n-1;j>=1;--j) {
    	            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
    	            --j;
    	            Bj = ret[j]; Bj[i] = -A1[j]; Bj[i-1] = -A0[j];
    	        }
    	        if(j===0) {
    	            Bj = ret[0]; Bj[i] = -A1[0]; Bj[i-1] = -A0[0];
    	        }
    	    }
    	    if(i===0) {
    	        A0 = x[0];
    	        for(j=n-1;j>=1;--j) {
    	            ret[j][0] = -A0[j];
    	            --j;
    	            ret[j][0] = -A0[j];
    	        }
    	        if(j===0) { ret[0][0] = -A0[0]; }
    	    }
    	    return ret;
    	};

    	numeric._random = function _random(s,k) {
    	    var i,n=s[k],ret=Array(n), rnd;
    	    if(k === s.length-1) {
    	        rnd = Math.random;
    	        for(i=n-1;i>=1;i-=2) {
    	            ret[i] = rnd();
    	            ret[i-1] = rnd();
    	        }
    	        if(i===0) { ret[0] = rnd(); }
    	        return ret;
    	    }
    	    for(i=n-1;i>=0;i--) ret[i] = _random(s,k+1);
    	    return ret;
    	};
    	numeric.random = function random(s) { return numeric._random(s,0); };

    	numeric.norm2 = function norm2(x) { return Math.sqrt(numeric.norm2Squared(x)); };

    	numeric.linspace = function linspace(a,b,n) {
    	    if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
    	    if(n<2) { return n===1?[a]:[]; }
    	    var i,ret = Array(n);
    	    n--;
    	    for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
    	    return ret;
    	};

    	numeric.getBlock = function getBlock(x,from,to) {
    	    var s = numeric.dim(x);
    	    function foo(x,k) {
    	        var i,a = from[k], n = to[k]-a, ret = Array(n);
    	        if(k === s.length-1) {
    	            for(i=n;i>=0;i--) { ret[i] = x[i+a]; }
    	            return ret;
    	        }
    	        for(i=n;i>=0;i--) { ret[i] = foo(x[i+a],k+1); }
    	        return ret;
    	    }
    	    return foo(x,0);
    	};

    	numeric.setBlock = function setBlock(x,from,to,B) {
    	    var s = numeric.dim(x);
    	    function foo(x,y,k) {
    	        var i,a = from[k], n = to[k]-a;
    	        if(k === s.length-1) { for(i=n;i>=0;i--) { x[i+a] = y[i]; } }
    	        for(i=n;i>=0;i--) { foo(x[i+a],y[i],k+1); }
    	    }
    	    foo(x,B,0);
    	    return x;
    	};

    	numeric.getRange = function getRange(A,I,J) {
    	    var m = I.length, n = J.length;
    	    var i,j;
    	    var B = Array(m), Bi, AI;
    	    for(i=m-1;i!==-1;--i) {
    	        B[i] = Array(n);
    	        Bi = B[i];
    	        AI = A[I[i]];
    	        for(j=n-1;j!==-1;--j) Bi[j] = AI[J[j]];
    	    }
    	    return B;
    	};

    	numeric.blockMatrix = function blockMatrix(X) {
    	    var s = numeric.dim(X);
    	    if(s.length<4) return numeric.blockMatrix([X]);
    	    var m=s[0],n=s[1],M,N,i,j,Xij;
    	    M = 0; N = 0;
    	    for(i=0;i<m;++i) M+=X[i][0].length;
    	    for(j=0;j<n;++j) N+=X[0][j][0].length;
    	    var Z = Array(M);
    	    for(i=0;i<M;++i) Z[i] = Array(N);
    	    var I=0,J,ZI,k,l,Xijk;
    	    for(i=0;i<m;++i) {
    	        J=N;
    	        for(j=n-1;j!==-1;--j) {
    	            Xij = X[i][j];
    	            J -= Xij[0].length;
    	            for(k=Xij.length-1;k!==-1;--k) {
    	                Xijk = Xij[k];
    	                ZI = Z[I+k];
    	                for(l = Xijk.length-1;l!==-1;--l) ZI[J+l] = Xijk[l];
    	            }
    	        }
    	        I += X[i][0].length;
    	    }
    	    return Z;
    	};

    	numeric.tensor = function tensor(x,y) {
    	    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
    	    var s1 = numeric.dim(x), s2 = numeric.dim(y);
    	    if(s1.length !== 1 || s2.length !== 1) {
    	        throw new Error('numeric: tensor product is only defined for vectors');
    	    }
    	    var m = s1[0], n = s2[0], A = Array(m), Ai, i,j,xi;
    	    for(i=m-1;i>=0;i--) {
    	        Ai = Array(n);
    	        xi = x[i];
    	        for(j=n-1;j>=3;--j) {
    	            Ai[j] = xi * y[j];
    	            --j;
    	            Ai[j] = xi * y[j];
    	            --j;
    	            Ai[j] = xi * y[j];
    	            --j;
    	            Ai[j] = xi * y[j];
    	        }
    	        while(j>=0) { Ai[j] = xi * y[j]; --j; }
    	        A[i] = Ai;
    	    }
    	    return A;
    	};

    	// 3. The Tensor type T
    	numeric.T = function T(x,y) { this.x = x; this.y = y; };
    	numeric.t = function t(x,y) { return new numeric.T(x,y); };

    	numeric.Tbinop = function Tbinop(rr,rc,cr,cc,setup) {
    	    numeric.indexOf;
    	    if(typeof setup !== "string") {
    	        var k;
    	        setup = '';
    	        for(k in numeric) {
    	            if(numeric.hasOwnProperty(k) && (rr.indexOf(k)>=0 || rc.indexOf(k)>=0 || cr.indexOf(k)>=0 || cc.indexOf(k)>=0) && k.length>1) {
    	                setup += 'var '+k+' = numeric.'+k+';\n';
    	            }
    	        }
    	    }
    	    return Function(['y'],
    	            'var x = this;\n'+
    	            'if(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n'+
    	            setup+'\n'+
    	            'if(x.y) {'+
    	            '  if(y.y) {'+
    	            '    return new numeric.T('+cc+');\n'+
    	            '  }\n'+
    	            '  return new numeric.T('+cr+');\n'+
    	            '}\n'+
    	            'if(y.y) {\n'+
    	            '  return new numeric.T('+rc+');\n'+
    	            '}\n'+
    	            'return new numeric.T('+rr+');\n'
    	    );
    	};

    	numeric.T.prototype.add = numeric.Tbinop(
    	        'add(x.x,y.x)',
    	        'add(x.x,y.x),y.y',
    	        'add(x.x,y.x),x.y',
    	        'add(x.x,y.x),add(x.y,y.y)');
    	numeric.T.prototype.sub = numeric.Tbinop(
    	        'sub(x.x,y.x)',
    	        'sub(x.x,y.x),neg(y.y)',
    	        'sub(x.x,y.x),x.y',
    	        'sub(x.x,y.x),sub(x.y,y.y)');
    	numeric.T.prototype.mul = numeric.Tbinop(
    	        'mul(x.x,y.x)',
    	        'mul(x.x,y.x),mul(x.x,y.y)',
    	        'mul(x.x,y.x),mul(x.y,y.x)',
    	        'sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))');

    	numeric.T.prototype.reciprocal = function reciprocal() {
    	    var mul = numeric.mul, div = numeric.div;
    	    if(this.y) {
    	        var d = numeric.add(mul(this.x,this.x),mul(this.y,this.y));
    	        return new numeric.T(div(this.x,d),div(numeric.neg(this.y),d));
    	    }
    	    return new T(div(1,this.x));
    	};
    	numeric.T.prototype.div = function div(y) {
    	    if(!(y instanceof numeric.T)) y = new numeric.T(y);
    	    if(y.y) { return this.mul(y.reciprocal()); }
    	    var div = numeric.div;
    	    if(this.y) { return new numeric.T(div(this.x,y.x),div(this.y,y.x)); }
    	    return new numeric.T(div(this.x,y.x));
    	};
    	numeric.T.prototype.dot = numeric.Tbinop(
    	        'dot(x.x,y.x)',
    	        'dot(x.x,y.x),dot(x.x,y.y)',
    	        'dot(x.x,y.x),dot(x.y,y.x)',
    	        'sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))'
    	        );
    	numeric.T.prototype.transpose = function transpose() {
    	    var t = numeric.transpose, x = this.x, y = this.y;
    	    if(y) { return new numeric.T(t(x),t(y)); }
    	    return new numeric.T(t(x));
    	};
    	numeric.T.prototype.transjugate = function transjugate() {
    	    var t = numeric.transpose, x = this.x, y = this.y;
    	    if(y) { return new numeric.T(t(x),numeric.negtranspose(y)); }
    	    return new numeric.T(t(x));
    	};
    	numeric.Tunop = function Tunop(r,c,s) {
    	    if(typeof s !== "string") { s = ''; }
    	    return Function(
    	            'var x = this;\n'+
    	            s+'\n'+
    	            'if(x.y) {'+
    	            '  '+c+';\n'+
    	            '}\n'+
    	            r+';\n'
    	    );
    	};

    	numeric.T.prototype.exp = numeric.Tunop(
    	        'return new numeric.T(ex)',
    	        'return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))',
    	        'var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;');
    	numeric.T.prototype.conj = numeric.Tunop(
    	        'return new numeric.T(x.x);',
    	        'return new numeric.T(x.x,numeric.neg(x.y));');
    	numeric.T.prototype.neg = numeric.Tunop(
    	        'return new numeric.T(neg(x.x));',
    	        'return new numeric.T(neg(x.x),neg(x.y));',
    	        'var neg = numeric.neg;');
    	numeric.T.prototype.sin = numeric.Tunop(
    	        'return new numeric.T(numeric.sin(x.x))',
    	        'return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));');
    	numeric.T.prototype.cos = numeric.Tunop(
    	        'return new numeric.T(numeric.cos(x.x))',
    	        'return x.exp().add(x.neg().exp()).div(2);');
    	numeric.T.prototype.abs = numeric.Tunop(
    	        'return new numeric.T(numeric.abs(x.x));',
    	        'return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));',
    	        'var mul = numeric.mul;');
    	numeric.T.prototype.log = numeric.Tunop(
    	        'return new numeric.T(numeric.log(x.x));',
    	        'var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\n'+
    	        'return new numeric.T(numeric.log(r.x),theta.x);');
    	numeric.T.prototype.norm2 = numeric.Tunop(
    	        'return numeric.norm2(x.x);',
    	        'var f = numeric.norm2Squared;\n'+
    	        'return Math.sqrt(f(x.x)+f(x.y));');
    	numeric.T.prototype.inv = function inv() {
    	    var A = this;
    	    if(typeof A.y === "undefined") { return new numeric.T(numeric.inv(A.x)); }
    	    var n = A.x.length, i, j, k;
    	    var Rx = numeric.identity(n),Ry = numeric.rep([n,n],0);
    	    var Ax = numeric.clone(A.x), Ay = numeric.clone(A.y);
    	    var Aix, Aiy, Ajx, Ajy, Rix, Riy, Rjx, Rjy;
    	    var i,j,k,d,d1,ax,ay,bx,by,temp;
    	    for(i=0;i<n;i++) {
    	        ax = Ax[i][i]; ay = Ay[i][i];
    	        d = ax*ax+ay*ay;
    	        k = i;
    	        for(j=i+1;j<n;j++) {
    	            ax = Ax[j][i]; ay = Ay[j][i];
    	            d1 = ax*ax+ay*ay;
    	            if(d1 > d) { k=j; d = d1; }
    	        }
    	        if(k!==i) {
    	            temp = Ax[i]; Ax[i] = Ax[k]; Ax[k] = temp;
    	            temp = Ay[i]; Ay[i] = Ay[k]; Ay[k] = temp;
    	            temp = Rx[i]; Rx[i] = Rx[k]; Rx[k] = temp;
    	            temp = Ry[i]; Ry[i] = Ry[k]; Ry[k] = temp;
    	        }
    	        Aix = Ax[i]; Aiy = Ay[i];
    	        Rix = Rx[i]; Riy = Ry[i];
    	        ax = Aix[i]; ay = Aiy[i];
    	        for(j=i+1;j<n;j++) {
    	            bx = Aix[j]; by = Aiy[j];
    	            Aix[j] = (bx*ax+by*ay)/d;
    	            Aiy[j] = (by*ax-bx*ay)/d;
    	        }
    	        for(j=0;j<n;j++) {
    	            bx = Rix[j]; by = Riy[j];
    	            Rix[j] = (bx*ax+by*ay)/d;
    	            Riy[j] = (by*ax-bx*ay)/d;
    	        }
    	        for(j=i+1;j<n;j++) {
    	            Ajx = Ax[j]; Ajy = Ay[j];
    	            Rjx = Rx[j]; Rjy = Ry[j];
    	            ax = Ajx[i]; ay = Ajy[i];
    	            for(k=i+1;k<n;k++) {
    	                bx = Aix[k]; by = Aiy[k];
    	                Ajx[k] -= bx*ax-by*ay;
    	                Ajy[k] -= by*ax+bx*ay;
    	            }
    	            for(k=0;k<n;k++) {
    	                bx = Rix[k]; by = Riy[k];
    	                Rjx[k] -= bx*ax-by*ay;
    	                Rjy[k] -= by*ax+bx*ay;
    	            }
    	        }
    	    }
    	    for(i=n-1;i>0;i--) {
    	        Rix = Rx[i]; Riy = Ry[i];
    	        for(j=i-1;j>=0;j--) {
    	            Rjx = Rx[j]; Rjy = Ry[j];
    	            ax = Ax[j][i]; ay = Ay[j][i];
    	            for(k=n-1;k>=0;k--) {
    	                bx = Rix[k]; by = Riy[k];
    	                Rjx[k] -= ax*bx - ay*by;
    	                Rjy[k] -= ax*by + ay*bx;
    	            }
    	        }
    	    }
    	    return new numeric.T(Rx,Ry);
    	};
    	numeric.T.prototype.get = function get(i) {
    	    var x = this.x, y = this.y, k = 0, ik, n = i.length;
    	    if(y) {
    	        while(k<n) {
    	            ik = i[k];
    	            x = x[ik];
    	            y = y[ik];
    	            k++;
    	        }
    	        return new numeric.T(x,y);
    	    }
    	    while(k<n) {
    	        ik = i[k];
    	        x = x[ik];
    	        k++;
    	    }
    	    return new numeric.T(x);
    	};
    	numeric.T.prototype.set = function set(i,v) {
    	    var x = this.x, y = this.y, k = 0, ik, n = i.length, vx = v.x, vy = v.y;
    	    if(n===0) {
    	        if(vy) { this.y = vy; }
    	        else if(y) { this.y = undefined; }
    	        this.x = x;
    	        return this;
    	    }
    	    if(vy) {
    	        if(y) ;
    	        else {
    	            y = numeric.rep(numeric.dim(x),0);
    	            this.y = y;
    	        }
    	        while(k<n-1) {
    	            ik = i[k];
    	            x = x[ik];
    	            y = y[ik];
    	            k++;
    	        }
    	        ik = i[k];
    	        x[ik] = vx;
    	        y[ik] = vy;
    	        return this;
    	    }
    	    if(y) {
    	        while(k<n-1) {
    	            ik = i[k];
    	            x = x[ik];
    	            y = y[ik];
    	            k++;
    	        }
    	        ik = i[k];
    	        x[ik] = vx;
    	        if(vx instanceof Array) y[ik] = numeric.rep(numeric.dim(vx),0);
    	        else y[ik] = 0;
    	        return this;
    	    }
    	    while(k<n-1) {
    	        ik = i[k];
    	        x = x[ik];
    	        k++;
    	    }
    	    ik = i[k];
    	    x[ik] = vx;
    	    return this;
    	};
    	numeric.T.prototype.getRows = function getRows(i0,i1) {
    	    var n = i1-i0+1, j;
    	    var rx = Array(n), ry, x = this.x, y = this.y;
    	    for(j=i0;j<=i1;j++) { rx[j-i0] = x[j]; }
    	    if(y) {
    	        ry = Array(n);
    	        for(j=i0;j<=i1;j++) { ry[j-i0] = y[j]; }
    	        return new numeric.T(rx,ry);
    	    }
    	    return new numeric.T(rx);
    	};
    	numeric.T.prototype.setRows = function setRows(i0,i1,A) {
    	    var j;
    	    var rx = this.x, ry = this.y, x = A.x, y = A.y;
    	    for(j=i0;j<=i1;j++) { rx[j] = x[j-i0]; }
    	    if(y) {
    	        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
    	        for(j=i0;j<=i1;j++) { ry[j] = y[j-i0]; }
    	    } else if(ry) {
    	        for(j=i0;j<=i1;j++) { ry[j] = numeric.rep([x[j-i0].length],0); }
    	    }
    	    return this;
    	};
    	numeric.T.prototype.getRow = function getRow(k) {
    	    var x = this.x, y = this.y;
    	    if(y) { return new numeric.T(x[k],y[k]); }
    	    return new numeric.T(x[k]);
    	};
    	numeric.T.prototype.setRow = function setRow(i,v) {
    	    var rx = this.x, ry = this.y, x = v.x, y = v.y;
    	    rx[i] = x;
    	    if(y) {
    	        if(!ry) { ry = numeric.rep(numeric.dim(rx),0); this.y = ry; }
    	        ry[i] = y;
    	    } else if(ry) {
    	        ry = numeric.rep([x.length],0);
    	    }
    	    return this;
    	};

    	numeric.T.prototype.getBlock = function getBlock(from,to) {
    	    var x = this.x, y = this.y, b = numeric.getBlock;
    	    if(y) { return new numeric.T(b(x,from,to),b(y,from,to)); }
    	    return new numeric.T(b(x,from,to));
    	};
    	numeric.T.prototype.setBlock = function setBlock(from,to,A) {
    	    if(!(A instanceof numeric.T)) A = new numeric.T(A);
    	    var x = this.x, y = this.y, b = numeric.setBlock, Ax = A.x, Ay = A.y;
    	    if(Ay) {
    	        if(!y) { this.y = numeric.rep(numeric.dim(this),0); y = this.y; }
    	        b(x,from,to,Ax);
    	        b(y,from,to,Ay);
    	        return this;
    	    }
    	    b(x,from,to,Ax);
    	    if(y) b(y,from,to,numeric.rep(numeric.dim(Ax),0));
    	};
    	numeric.T.rep = function rep(s,v) {
    	    var T = numeric.T;
    	    if(!(v instanceof T)) v = new T(v);
    	    var x = v.x, y = v.y, r = numeric.rep;
    	    if(y) return new T(r(s,x),r(s,y));
    	    return new T(r(s,x));
    	};
    	numeric.T.diag = function diag(d) {
    	    if(!(d instanceof numeric.T)) d = new numeric.T(d);
    	    var x = d.x, y = d.y, diag = numeric.diag;
    	    if(y) return new numeric.T(diag(x),diag(y));
    	    return new numeric.T(diag(x));
    	};
    	numeric.T.eig = function eig() {
    	    if(this.y) { throw new Error('eig: not implemented for complex matrices.'); }
    	    return numeric.eig(this.x);
    	};
    	numeric.T.identity = function identity(n) { return new numeric.T(numeric.identity(n)); };
    	numeric.T.prototype.getDiag = function getDiag() {
    	    var n = numeric;
    	    var x = this.x, y = this.y;
    	    if(y) { return new n.T(n.getDiag(x),n.getDiag(y)); }
    	    return new n.T(n.getDiag(x));
    	};

    	// 4. Eigenvalues of real matrices

    	numeric.house = function house(x) {
    	    var v = numeric.clone(x);
    	    var s = x[0] >= 0 ? 1 : -1;
    	    var alpha = s*numeric.norm2(x);
    	    v[0] += alpha;
    	    var foo = numeric.norm2(v);
    	    if(foo === 0) { /* this should not happen */ throw new Error('eig: internal error'); }
    	    return numeric.div(v,foo);
    	};

    	numeric.toUpperHessenberg = function toUpperHessenberg(me) {
    	    var s = numeric.dim(me);
    	    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
    	    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
    	    for(j=0;j<m-2;j++) {
    	        x = Array(m-j-1);
    	        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
    	        if(numeric.norm2(x)>0) {
    	            v = numeric.house(x);
    	            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
    	            C = numeric.tensor(v,numeric.dot(v,B));
    	            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
    	            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
    	            C = numeric.tensor(numeric.dot(B,v),v);
    	            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
    	            B = Array(m-j-1);
    	            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
    	            C = numeric.tensor(v,numeric.dot(v,B));
    	            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
    	        }
    	    }
    	    return {H:A, Q:Q};
    	};

    	numeric.epsilon = 2.220446049250313e-16;

    	numeric.QRFrancis = function(H,maxiter) {
    	    if(typeof maxiter === "undefined") { maxiter = 10000; }
    	    H = numeric.clone(H);
    	    numeric.clone(H);
    	    var s = numeric.dim(H),m=s[0],x,v,a,b,c,d,det,tr, Hloc, Q = numeric.identity(m), Qi, Hi, B, C, Ci,i,j,k,iter;
    	    if(m<3) { return {Q:Q, B:[ [0,m-1] ]}; }
    	    var epsilon = numeric.epsilon;
    	    for(iter=0;iter<maxiter;iter++) {
    	        for(j=0;j<m-1;j++) {
    	            if(Math.abs(H[j+1][j]) < epsilon*(Math.abs(H[j][j])+Math.abs(H[j+1][j+1]))) {
    	                var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[j,j]),maxiter);
    	                var QH2 = numeric.QRFrancis(numeric.getBlock(H,[j+1,j+1],[m-1,m-1]),maxiter);
    	                B = Array(j+1);
    	                for(i=0;i<=j;i++) { B[i] = Q[i]; }
    	                C = numeric.dot(QH1.Q,B);
    	                for(i=0;i<=j;i++) { Q[i] = C[i]; }
    	                B = Array(m-j-1);
    	                for(i=j+1;i<m;i++) { B[i-j-1] = Q[i]; }
    	                C = numeric.dot(QH2.Q,B);
    	                for(i=j+1;i<m;i++) { Q[i] = C[i-j-1]; }
    	                return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,j+1))};
    	            }
    	        }
    	        a = H[m-2][m-2]; b = H[m-2][m-1];
    	        c = H[m-1][m-2]; d = H[m-1][m-1];
    	        tr = a+d;
    	        det = (a*d-b*c);
    	        Hloc = numeric.getBlock(H, [0,0], [2,2]);
    	        if(tr*tr>=4*det) {
    	            var s1,s2;
    	            s1 = 0.5*(tr+Math.sqrt(tr*tr-4*det));
    	            s2 = 0.5*(tr-Math.sqrt(tr*tr-4*det));
    	            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
    	                                           numeric.mul(Hloc,s1+s2)),
    	                               numeric.diag(numeric.rep([3],s1*s2)));
    	        } else {
    	            Hloc = numeric.add(numeric.sub(numeric.dot(Hloc,Hloc),
    	                                           numeric.mul(Hloc,tr)),
    	                               numeric.diag(numeric.rep([3],det)));
    	        }
    	        x = [Hloc[0][0],Hloc[1][0],Hloc[2][0]];
    	        v = numeric.house(x);
    	        B = [H[0],H[1],H[2]];
    	        C = numeric.tensor(v,numeric.dot(v,B));
    	        for(i=0;i<3;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<m;k++) Hi[k] -= 2*Ci[k]; }
    	        B = numeric.getBlock(H, [0,0],[m-1,2]);
    	        C = numeric.tensor(numeric.dot(B,v),v);
    	        for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=0;k<3;k++) Hi[k] -= 2*Ci[k]; }
    	        B = [Q[0],Q[1],Q[2]];
    	        C = numeric.tensor(v,numeric.dot(v,B));
    	        for(i=0;i<3;i++) { Qi = Q[i]; Ci = C[i]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
    	        var J;
    	        for(j=0;j<m-2;j++) {
    	            for(k=j;k<=j+1;k++) {
    	                if(Math.abs(H[k+1][k]) < epsilon*(Math.abs(H[k][k])+Math.abs(H[k+1][k+1]))) {
    	                    var QH1 = numeric.QRFrancis(numeric.getBlock(H,[0,0],[k,k]),maxiter);
    	                    var QH2 = numeric.QRFrancis(numeric.getBlock(H,[k+1,k+1],[m-1,m-1]),maxiter);
    	                    B = Array(k+1);
    	                    for(i=0;i<=k;i++) { B[i] = Q[i]; }
    	                    C = numeric.dot(QH1.Q,B);
    	                    for(i=0;i<=k;i++) { Q[i] = C[i]; }
    	                    B = Array(m-k-1);
    	                    for(i=k+1;i<m;i++) { B[i-k-1] = Q[i]; }
    	                    C = numeric.dot(QH2.Q,B);
    	                    for(i=k+1;i<m;i++) { Q[i] = C[i-k-1]; }
    	                    return {Q:Q,B:QH1.B.concat(numeric.add(QH2.B,k+1))};
    	                }
    	            }
    	            J = Math.min(m-1,j+3);
    	            x = Array(J-j);
    	            for(i=j+1;i<=J;i++) { x[i-j-1] = H[i][j]; }
    	            v = numeric.house(x);
    	            B = numeric.getBlock(H, [j+1,j],[J,m-1]);
    	            C = numeric.tensor(v,numeric.dot(v,B));
    	            for(i=j+1;i<=J;i++) { Hi = H[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Hi[k] -= 2*Ci[k-j]; }
    	            B = numeric.getBlock(H, [0,j+1],[m-1,J]);
    	            C = numeric.tensor(numeric.dot(B,v),v);
    	            for(i=0;i<m;i++) { Hi = H[i]; Ci = C[i]; for(k=j+1;k<=J;k++) Hi[k] -= 2*Ci[k-j-1]; }
    	            B = Array(J-j);
    	            for(i=j+1;i<=J;i++) B[i-j-1] = Q[i];
    	            C = numeric.tensor(v,numeric.dot(v,B));
    	            for(i=j+1;i<=J;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
    	        }
    	    }
    	    throw new Error('numeric: eigenvalue iteration does not converge -- increase maxiter?');
    	};

    	numeric.eig = function eig(A,maxiter) {
    	    var QH = numeric.toUpperHessenberg(A);
    	    var QB = numeric.QRFrancis(QH.H,maxiter);
    	    var T = numeric.T;
    	    var n = A.length,i,k,B = QB.B,H = numeric.dot(QB.Q,numeric.dot(QH.H,numeric.transpose(QB.Q)));
    	    var Q = new T(numeric.dot(QB.Q,QH.Q)),Q0;
    	    var m = B.length,j;
    	    var a,b,c,d,p1,p2,disc,x,y,p,q,n1,n2;
    	    var sqrt = Math.sqrt;
    	    for(k=0;k<m;k++) {
    	        i = B[k][0];
    	        if(i === B[k][1]) ; else {
    	            j = i+1;
    	            a = H[i][i];
    	            b = H[i][j];
    	            c = H[j][i];
    	            d = H[j][j];
    	            if(b === 0 && c === 0) continue;
    	            p1 = -a-d;
    	            p2 = a*d-b*c;
    	            disc = p1*p1-4*p2;
    	            if(disc>=0) {
    	                if(p1<0) x = -0.5*(p1-sqrt(disc));
    	                else     x = -0.5*(p1+sqrt(disc));
    	                n1 = (a-x)*(a-x)+b*b;
    	                n2 = c*c+(d-x)*(d-x);
    	                if(n1>n2) {
    	                    n1 = sqrt(n1);
    	                    p = (a-x)/n1;
    	                    q = b/n1;
    	                } else {
    	                    n2 = sqrt(n2);
    	                    p = c/n2;
    	                    q = (d-x)/n2;
    	                }
    	                Q0 = new T([[q,-p],[p,q]]);
    	                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
    	            } else {
    	                x = -0.5*p1;
    	                y = 0.5*sqrt(-disc);
    	                n1 = (a-x)*(a-x)+b*b;
    	                n2 = c*c+(d-x)*(d-x);
    	                if(n1>n2) {
    	                    n1 = sqrt(n1+y*y);
    	                    p = (a-x)/n1;
    	                    q = b/n1;
    	                    x = 0;
    	                    y /= n1;
    	                } else {
    	                    n2 = sqrt(n2+y*y);
    	                    p = c/n2;
    	                    q = (d-x)/n2;
    	                    x = y/n2;
    	                    y = 0;
    	                }
    	                Q0 = new T([[q,-p],[p,q]],[[x,y],[y,-x]]);
    	                Q.setRows(i,j,Q0.dot(Q.getRows(i,j)));
    	            }
    	        }
    	    }
    	    var R = Q.dot(A).dot(Q.transjugate()), n = A.length, E = numeric.T.identity(n);
    	    for(j=0;j<n;j++) {
    	        if(j>0) {
    	            for(k=j-1;k>=0;k--) {
    	                var Rk = R.get([k,k]), Rj = R.get([j,j]);
    	                if(numeric.neq(Rk.x,Rj.x) || numeric.neq(Rk.y,Rj.y)) {
    	                    x = R.getRow(k).getBlock([k],[j-1]);
    	                    y = E.getRow(j).getBlock([k],[j-1]);
    	                    E.set([j,k],(R.get([k,j]).neg().sub(x.dot(y))).div(Rk.sub(Rj)));
    	                } else {
    	                    E.setRow(j,E.getRow(k));
    	                    continue;
    	                }
    	            }
    	        }
    	    }
    	    for(j=0;j<n;j++) {
    	        x = E.getRow(j);
    	        E.setRow(j,x.div(x.norm2()));
    	    }
    	    E = E.transpose();
    	    E = Q.transjugate().dot(E);
    	    return { lambda:R.getDiag(), E:E };
    	};

    	// 5. Compressed Column Storage matrices
    	numeric.ccsSparse = function ccsSparse(A) {
    	    var m = A.length,n,foo, i,j, counts = [];
    	    for(i=m-1;i!==-1;--i) {
    	        foo = A[i];
    	        for(j in foo) {
    	            j = parseInt(j);
    	            while(j>=counts.length) counts[counts.length] = 0;
    	            if(foo[j]!==0) counts[j]++;
    	        }
    	    }
    	    var n = counts.length;
    	    var Ai = Array(n+1);
    	    Ai[0] = 0;
    	    for(i=0;i<n;++i) Ai[i+1] = Ai[i] + counts[i];
    	    var Aj = Array(Ai[n]), Av = Array(Ai[n]);
    	    for(i=m-1;i!==-1;--i) {
    	        foo = A[i];
    	        for(j in foo) {
    	            if(foo[j]!==0) {
    	                counts[j]--;
    	                Aj[Ai[j]+counts[j]] = i;
    	                Av[Ai[j]+counts[j]] = foo[j];
    	            }
    	        }
    	    }
    	    return [Ai,Aj,Av];
    	};
    	numeric.ccsFull = function ccsFull(A) {
    	    var Ai = A[0], Aj = A[1], Av = A[2], s = numeric.ccsDim(A), m = s[0], n = s[1], i,j,j0,j1;
    	    var B = numeric.rep([m,n],0);
    	    for(i=0;i<n;i++) {
    	        j0 = Ai[i];
    	        j1 = Ai[i+1];
    	        for(j=j0;j<j1;++j) { B[Aj[j]][i] = Av[j]; }
    	    }
    	    return B;
    	};
    	numeric.ccsTSolve = function ccsTSolve(A,b,x,bj,xj) {
    	    var Ai = A[0], Aj = A[1], Av = A[2],m = Ai.length-1, max = Math.max,n=0;
    	    if(typeof bj === "undefined") x = numeric.rep([m],0);
    	    if(typeof bj === "undefined") bj = numeric.linspace(0,x.length-1);
    	    if(typeof xj === "undefined") xj = [];
    	    function dfs(j) {
    	        var k;
    	        if(x[j] !== 0) return;
    	        x[j] = 1;
    	        for(k=Ai[j];k<Ai[j+1];++k) dfs(Aj[k]);
    	        xj[n] = j;
    	        ++n;
    	    }
    	    var i,j,j0,j1,k,l,a;
    	    for(i=bj.length-1;i!==-1;--i) { dfs(bj[i]); }
    	    xj.length = n;
    	    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    	    for(i=bj.length-1;i!==-1;--i) { j = bj[i]; x[j] = b[j]; }
    	    for(i=xj.length-1;i!==-1;--i) {
    	        j = xj[i];
    	        j0 = Ai[j];
    	        j1 = max(Ai[j+1],j0);
    	        for(k=j0;k!==j1;++k) { if(Aj[k] === j) { x[j] /= Av[k]; break; } }
    	        a = x[j];
    	        for(k=j0;k!==j1;++k) {
    	            l = Aj[k];
    	            if(l !== j) x[l] -= a*Av[k];
    	        }
    	    }
    	    return x;
    	};
    	numeric.ccsDFS = function ccsDFS(n) {
    	    this.k = Array(n);
    	    this.k1 = Array(n);
    	    this.j = Array(n);
    	};
    	numeric.ccsDFS.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv) {
    	    var m = 0,foo,n=xj.length;
    	    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    	    if(x[J]!==0) return;
    	    x[J] = 1;
    	    j[0] = J;
    	    k[0] = km = Ai[J];
    	    k1[0] = k11 = Ai[J+1];
    	    while(1) {
    	        if(km >= k11) {
    	            xj[n] = j[m];
    	            if(m===0) return;
    	            ++n;
    	            --m;
    	            km = k[m];
    	            k11 = k1[m];
    	        } else {
    	            foo = Pinv[Aj[km]];
    	            if(x[foo] === 0) {
    	                x[foo] = 1;
    	                k[m] = km;
    	                ++m;
    	                j[m] = foo;
    	                km = Ai[foo];
    	                k1[m] = k11 = Ai[foo+1];
    	            } else ++km;
    	        }
    	    }
    	};
    	numeric.ccsLPSolve = function ccsLPSolve(A,B,x,xj,I,Pinv,dfs) {
    	    var Ai = A[0], Aj = A[1], Av = A[2];Ai.length-1;
    	    var Bi = B[0], Bj = B[1], Bv = B[2];
    	    
    	    var i,i0,i1,j,j0,j1,k,l,a;
    	    i0 = Bi[I];
    	    i1 = Bi[I+1];
    	    xj.length = 0;
    	    for(i=i0;i<i1;++i) { dfs.dfs(Pinv[Bj[i]],Ai,Aj,x,xj,Pinv); }
    	    for(i=xj.length-1;i!==-1;--i) { x[xj[i]] = 0; }
    	    for(i=i0;i!==i1;++i) { j = Pinv[Bj[i]]; x[j] = Bv[i]; }
    	    for(i=xj.length-1;i!==-1;--i) {
    	        j = xj[i];
    	        j0 = Ai[j];
    	        j1 = Ai[j+1];
    	        for(k=j0;k<j1;++k) { if(Pinv[Aj[k]] === j) { x[j] /= Av[k]; break; } }
    	        a = x[j];
    	        for(k=j0;k<j1;++k) {
    	            l = Pinv[Aj[k]];
    	            if(l !== j) x[l] -= a*Av[k];
    	        }
    	    }
    	    return x;
    	};
    	numeric.ccsLUP1 = function ccsLUP1(A,threshold) {
    	    var m = A[0].length-1;
    	    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    	    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    	    var x = numeric.rep([m],0), xj = numeric.rep([m],0);
    	    var i,j,k,a,e,c,d;
    	    var sol = numeric.ccsLPSolve, abs = Math.abs;
    	    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    	    var dfs = new numeric.ccsDFS(m);
    	    if(typeof threshold === "undefined") { threshold = 1; }
    	    for(i=0;i<m;++i) {
    	        sol(L,A,x,xj,i,Pinv,dfs);
    	        a = -1;
    	        e = -1;
    	        for(j=xj.length-1;j!==-1;--j) {
    	            k = xj[j];
    	            if(k <= i) continue;
    	            c = abs(x[k]);
    	            if(c > a) { e = k; a = c; }
    	        }
    	        if(abs(x[i])<threshold*a) {
    	            j = P[i];
    	            a = P[e];
    	            P[i] = a; Pinv[a] = i;
    	            P[e] = j; Pinv[j] = e;
    	            a = x[i]; x[i] = x[e]; x[e] = a;
    	        }
    	        a = Li[i];
    	        e = Ui[i];
    	        d = x[i];
    	        Lj[a] = P[i];
    	        Lv[a] = 1;
    	        ++a;
    	        for(j=xj.length-1;j!==-1;--j) {
    	            k = xj[j];
    	            c = x[k];
    	            xj[j] = 0;
    	            x[k] = 0;
    	            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
    	            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
    	        }
    	        Li[i+1] = a;
    	        Ui[i+1] = e;
    	    }
    	    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    	    return {L:L, U:U, P:P, Pinv:Pinv};
    	};
    	numeric.ccsDFS0 = function ccsDFS0(n) {
    	    this.k = Array(n);
    	    this.k1 = Array(n);
    	    this.j = Array(n);
    	};
    	numeric.ccsDFS0.prototype.dfs = function dfs(J,Ai,Aj,x,xj,Pinv,P) {
    	    var m = 0,foo,n=xj.length;
    	    var k = this.k, k1 = this.k1, j = this.j,km,k11;
    	    if(x[J]!==0) return;
    	    x[J] = 1;
    	    j[0] = J;
    	    k[0] = km = Ai[Pinv[J]];
    	    k1[0] = k11 = Ai[Pinv[J]+1];
    	    while(1) {
    	        if(isNaN(km)) throw new Error("Ow!");
    	        if(km >= k11) {
    	            xj[n] = Pinv[j[m]];
    	            if(m===0) return;
    	            ++n;
    	            --m;
    	            km = k[m];
    	            k11 = k1[m];
    	        } else {
    	            foo = Aj[km];
    	            if(x[foo] === 0) {
    	                x[foo] = 1;
    	                k[m] = km;
    	                ++m;
    	                j[m] = foo;
    	                foo = Pinv[foo];
    	                km = Ai[foo];
    	                k1[m] = k11 = Ai[foo+1];
    	            } else ++km;
    	        }
    	    }
    	};
    	numeric.ccsLPSolve0 = function ccsLPSolve0(A,B,y,xj,I,Pinv,P,dfs) {
    	    var Ai = A[0], Aj = A[1], Av = A[2];Ai.length-1;
    	    var Bi = B[0], Bj = B[1], Bv = B[2];
    	    
    	    var i,i0,i1,j,j0,j1,k,l,a;
    	    i0 = Bi[I];
    	    i1 = Bi[I+1];
    	    xj.length = 0;
    	    for(i=i0;i<i1;++i) { dfs.dfs(Bj[i],Ai,Aj,y,xj,Pinv,P); }
    	    for(i=xj.length-1;i!==-1;--i) { j = xj[i]; y[P[j]] = 0; }
    	    for(i=i0;i!==i1;++i) { j = Bj[i]; y[j] = Bv[i]; }
    	    for(i=xj.length-1;i!==-1;--i) {
    	        j = xj[i];
    	        l = P[j];
    	        j0 = Ai[j];
    	        j1 = Ai[j+1];
    	        for(k=j0;k<j1;++k) { if(Aj[k] === l) { y[l] /= Av[k]; break; } }
    	        a = y[l];
    	        for(k=j0;k<j1;++k) y[Aj[k]] -= a*Av[k];
    	        y[l] = a;
    	    }
    	};
    	numeric.ccsLUP0 = function ccsLUP0(A,threshold) {
    	    var m = A[0].length-1;
    	    var L = [numeric.rep([m+1],0),[],[]], U = [numeric.rep([m+1], 0),[],[]];
    	    var Li = L[0], Lj = L[1], Lv = L[2], Ui = U[0], Uj = U[1], Uv = U[2];
    	    var y = numeric.rep([m],0), xj = numeric.rep([m],0);
    	    var i,j,k,a,e,c,d;
    	    var sol = numeric.ccsLPSolve0, abs = Math.abs;
    	    var P = numeric.linspace(0,m-1),Pinv = numeric.linspace(0,m-1);
    	    var dfs = new numeric.ccsDFS0(m);
    	    if(typeof threshold === "undefined") { threshold = 1; }
    	    for(i=0;i<m;++i) {
    	        sol(L,A,y,xj,i,Pinv,P,dfs);
    	        a = -1;
    	        e = -1;
    	        for(j=xj.length-1;j!==-1;--j) {
    	            k = xj[j];
    	            if(k <= i) continue;
    	            c = abs(y[P[k]]);
    	            if(c > a) { e = k; a = c; }
    	        }
    	        if(abs(y[P[i]])<threshold*a) {
    	            j = P[i];
    	            a = P[e];
    	            P[i] = a; Pinv[a] = i;
    	            P[e] = j; Pinv[j] = e;
    	        }
    	        a = Li[i];
    	        e = Ui[i];
    	        d = y[P[i]];
    	        Lj[a] = P[i];
    	        Lv[a] = 1;
    	        ++a;
    	        for(j=xj.length-1;j!==-1;--j) {
    	            k = xj[j];
    	            c = y[P[k]];
    	            xj[j] = 0;
    	            y[P[k]] = 0;
    	            if(k<=i) { Uj[e] = k; Uv[e] = c;   ++e; }
    	            else     { Lj[a] = P[k]; Lv[a] = c/d; ++a; }
    	        }
    	        Li[i+1] = a;
    	        Ui[i+1] = e;
    	    }
    	    for(j=Lj.length-1;j!==-1;--j) { Lj[j] = Pinv[Lj[j]]; }
    	    return {L:L, U:U, P:P, Pinv:Pinv};
    	};
    	numeric.ccsLUP = numeric.ccsLUP0;

    	numeric.ccsDim = function ccsDim(A) { return [numeric.sup(A[1])+1,A[0].length-1]; };
    	numeric.ccsGetBlock = function ccsGetBlock(A,i,j) {
    	    var s = numeric.ccsDim(A),m=s[0],n=s[1];
    	    if(typeof i === "undefined") { i = numeric.linspace(0,m-1); }
    	    else if(typeof i === "number") { i = [i]; }
    	    if(typeof j === "undefined") { j = numeric.linspace(0,n-1); }
    	    else if(typeof j === "number") { j = [j]; }
    	    var p,P = i.length,q,Q = j.length,r,jq,ip;
    	    var Bi = numeric.rep([n],0), Bj=[], Bv=[], B = [Bi,Bj,Bv];
    	    var Ai = A[0], Aj = A[1], Av = A[2];
    	    var x = numeric.rep([m],0),count=0,flags = numeric.rep([m],0);
    	    for(q=0;q<Q;++q) {
    	        jq = j[q];
    	        var q0 = Ai[jq];
    	        var q1 = Ai[jq+1];
    	        for(p=q0;p<q1;++p) {
    	            r = Aj[p];
    	            flags[r] = 1;
    	            x[r] = Av[p];
    	        }
    	        for(p=0;p<P;++p) {
    	            ip = i[p];
    	            if(flags[ip]) {
    	                Bj[count] = p;
    	                Bv[count] = x[i[p]];
    	                ++count;
    	            }
    	        }
    	        for(p=q0;p<q1;++p) {
    	            r = Aj[p];
    	            flags[r] = 0;
    	        }
    	        Bi[q+1] = count;
    	    }
    	    return B;
    	};

    	numeric.ccsDot = function ccsDot(A,B) {
    	    var Ai = A[0], Aj = A[1], Av = A[2];
    	    var Bi = B[0], Bj = B[1], Bv = B[2];
    	    var sA = numeric.ccsDim(A), sB = numeric.ccsDim(B);
    	    var m = sA[0]; sA[1]; var o = sB[1];
    	    var x = numeric.rep([m],0), flags = numeric.rep([m],0), xj = Array(m);
    	    var Ci = numeric.rep([o],0), Cj = [], Cv = [], C = [Ci,Cj,Cv];
    	    var i,j,k,j0,j1,i0,i1,l,p,a,b;
    	    for(k=0;k!==o;++k) {
    	        j0 = Bi[k];
    	        j1 = Bi[k+1];
    	        p = 0;
    	        for(j=j0;j<j1;++j) {
    	            a = Bj[j];
    	            b = Bv[j];
    	            i0 = Ai[a];
    	            i1 = Ai[a+1];
    	            for(i=i0;i<i1;++i) {
    	                l = Aj[i];
    	                if(flags[l]===0) {
    	                    xj[p] = l;
    	                    flags[l] = 1;
    	                    p = p+1;
    	                }
    	                x[l] = x[l] + Av[i]*b;
    	            }
    	        }
    	        j0 = Ci[k];
    	        j1 = j0+p;
    	        Ci[k+1] = j1;
    	        for(j=p-1;j!==-1;--j) {
    	            b = j0+j;
    	            i = xj[j];
    	            Cj[b] = i;
    	            Cv[b] = x[i];
    	            flags[i] = 0;
    	            x[i] = 0;
    	        }
    	        Ci[k+1] = Ci[k]+p;
    	    }
    	    return C;
    	};

    	numeric.ccsLUPSolve = function ccsLUPSolve(LUP,B) {
    	    var L = LUP.L, U = LUP.U; LUP.P;
    	    var Bi = B[0];
    	    var flag = false;
    	    if(typeof Bi !== "object") { B = [[0,B.length],numeric.linspace(0,B.length-1),B]; Bi = B[0]; flag = true; }
    	    var Bj = B[1], Bv = B[2];
    	    var n = L[0].length-1, m = Bi.length-1;
    	    var x = numeric.rep([n],0), xj = Array(n);
    	    var b = numeric.rep([n],0), bj = Array(n);
    	    var Xi = numeric.rep([m+1],0), Xj = [], Xv = [];
    	    var sol = numeric.ccsTSolve;
    	    var i,j,j0,j1,k,J,N=0;
    	    for(i=0;i<m;++i) {
    	        k = 0;
    	        j0 = Bi[i];
    	        j1 = Bi[i+1];
    	        for(j=j0;j<j1;++j) { 
    	            J = LUP.Pinv[Bj[j]];
    	            bj[k] = J;
    	            b[J] = Bv[j];
    	            ++k;
    	        }
    	        bj.length = k;
    	        sol(L,b,x,bj,xj);
    	        for(j=bj.length-1;j!==-1;--j) b[bj[j]] = 0;
    	        sol(U,x,b,xj,bj);
    	        if(flag) return b;
    	        for(j=xj.length-1;j!==-1;--j) x[xj[j]] = 0;
    	        for(j=bj.length-1;j!==-1;--j) {
    	            J = bj[j];
    	            Xj[N] = J;
    	            Xv[N] = b[J];
    	            b[J] = 0;
    	            ++N;
    	        }
    	        Xi[i+1] = N;
    	    }
    	    return [Xi,Xj,Xv];
    	};

    	numeric.ccsbinop = function ccsbinop(body,setup) {
    	    if(typeof setup === "undefined") setup='';
    	    return Function('X','Y',
    	            'var Xi = X[0], Xj = X[1], Xv = X[2];\n'+
    	            'var Yi = Y[0], Yj = Y[1], Yv = Y[2];\n'+
    	            'var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\n'+
    	            'var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\n'+
    	            'var x = numeric.rep([m],0),y = numeric.rep([m],0);\n'+
    	            'var xk,yk,zk;\n'+
    	            'var i,j,j0,j1,k,p=0;\n'+
    	            setup+
    	            'for(i=0;i<n;++i) {\n'+
    	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) {\n'+
    	            '    k = Xj[j];\n'+
    	            '    x[k] = 1;\n'+
    	            '    Zj[p] = k;\n'+
    	            '    ++p;\n'+
    	            '  }\n'+
    	            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) {\n'+
    	            '    k = Yj[j];\n'+
    	            '    y[k] = Yv[j];\n'+
    	            '    if(x[k] === 0) {\n'+
    	            '      Zj[p] = k;\n'+
    	            '      ++p;\n'+
    	            '    }\n'+
    	            '  }\n'+
    	            '  Zi[i+1] = p;\n'+
    	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n'+
    	            '  j0 = Zi[i]; j1 = Zi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) {\n'+
    	            '    k = Zj[j];\n'+
    	            '    xk = x[k];\n'+
    	            '    yk = y[k];\n'+
    	            body+'\n'+
    	            '    Zv[j] = zk;\n'+
    	            '  }\n'+
    	            '  j0 = Xi[i]; j1 = Xi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n'+
    	            '  j0 = Yi[i]; j1 = Yi[i+1];\n'+
    	            '  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n'+
    	            '}\n'+
    	            'return [Zi,Zj,Zv];'
    	            );
    	};

    	(function() {
    	    var k,A,B,C;
    	    for(k in numeric.ops2) {
    	        if(isFinite(eval('1'+numeric.ops2[k]+'0'))) A = '[Y[0],Y[1],numeric.'+k+'(X,Y[2])]';
    	        else A = 'NaN';
    	        if(isFinite(eval('0'+numeric.ops2[k]+'1'))) B = '[X[0],X[1],numeric.'+k+'(X[2],Y)]';
    	        else B = 'NaN';
    	        if(isFinite(eval('1'+numeric.ops2[k]+'0')) && isFinite(eval('0'+numeric.ops2[k]+'1'))) C = 'numeric.ccs'+k+'MM(X,Y)';
    	        else C = 'NaN';
    	        numeric['ccs'+k+'MM'] = numeric.ccsbinop('zk = xk '+numeric.ops2[k]+'yk;');
    	        numeric['ccs'+k] = Function('X','Y',
    	                'if(typeof X === "number") return '+A+';\n'+
    	                'if(typeof Y === "number") return '+B+';\n'+
    	                'return '+C+';\n'
    	                );
    	    }
    	}());

    	numeric.ccsScatter = function ccsScatter(A) {
    	    var Ai = A[0], Aj = A[1], Av = A[2];
    	    var n = numeric.sup(Aj)+1,m=Ai.length;
    	    var Ri = numeric.rep([n],0),Rj=Array(m), Rv = Array(m);
    	    var counts = numeric.rep([n],0),i;
    	    for(i=0;i<m;++i) counts[Aj[i]]++;
    	    for(i=0;i<n;++i) Ri[i+1] = Ri[i] + counts[i];
    	    var ptr = Ri.slice(0),k,Aii;
    	    for(i=0;i<m;++i) {
    	        Aii = Aj[i];
    	        k = ptr[Aii];
    	        Rj[k] = Ai[i];
    	        Rv[k] = Av[i];
    	        ptr[Aii]=ptr[Aii]+1;
    	    }
    	    return [Ri,Rj,Rv];
    	};

    	numeric.ccsGather = function ccsGather(A) {
    	    var Ai = A[0], Aj = A[1], Av = A[2];
    	    var n = Ai.length-1,m = Aj.length;
    	    var Ri = Array(m), Rj = Array(m), Rv = Array(m);
    	    var i,j,j0,j1,p;
    	    p=0;
    	    for(i=0;i<n;++i) {
    	        j0 = Ai[i];
    	        j1 = Ai[i+1];
    	        for(j=j0;j!==j1;++j) {
    	            Rj[p] = i;
    	            Ri[p] = Aj[j];
    	            Rv[p] = Av[j];
    	            ++p;
    	        }
    	    }
    	    return [Ri,Rj,Rv];
    	};

    	// The following sparse linear algebra routines are deprecated.

    	numeric.sdim = function dim(A,ret,k) {
    	    if(typeof ret === "undefined") { ret = []; }
    	    if(typeof A !== "object") return ret;
    	    if(typeof k === "undefined") { k=0; }
    	    if(!(k in ret)) { ret[k] = 0; }
    	    if(A.length > ret[k]) ret[k] = A.length;
    	    var i;
    	    for(i in A) {
    	        if(A.hasOwnProperty(i)) dim(A[i],ret,k+1);
    	    }
    	    return ret;
    	};

    	numeric.sclone = function clone(A,k,n) {
    	    if(typeof k === "undefined") { k=0; }
    	    if(typeof n === "undefined") { n = numeric.sdim(A).length; }
    	    var i,ret = Array(A.length);
    	    if(k === n-1) {
    	        for(i in A) { if(A.hasOwnProperty(i)) ret[i] = A[i]; }
    	        return ret;
    	    }
    	    for(i in A) {
    	        if(A.hasOwnProperty(i)) ret[i] = clone(A[i],k+1,n);
    	    }
    	    return ret;
    	};

    	numeric.sdiag = function diag(d) {
    	    var n = d.length,i,ret = Array(n),i1;
    	    for(i=n-1;i>=1;i-=2) {
    	        i1 = i-1;
    	        ret[i] = []; ret[i][i] = d[i];
    	        ret[i1] = []; ret[i1][i1] = d[i1];
    	    }
    	    if(i===0) { ret[0] = []; ret[0][0] = d[i]; }
    	    return ret;
    	};

    	numeric.sidentity = function identity(n) { return numeric.sdiag(numeric.rep([n],1)); };

    	numeric.stranspose = function transpose(A) {
    	    var ret = []; A.length; var i,j,Ai;
    	    for(i in A) {
    	        if(!(A.hasOwnProperty(i))) continue;
    	        Ai = A[i];
    	        for(j in Ai) {
    	            if(!(Ai.hasOwnProperty(j))) continue;
    	            if(typeof ret[j] !== "object") { ret[j] = []; }
    	            ret[j][i] = Ai[j];
    	        }
    	    }
    	    return ret;
    	};

    	numeric.sLUP = function LUP(A,tol) {
    	    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
    	};

    	numeric.sdotMM = function dotMM(A,B) {
    	    var p = A.length; B.length; var BT = numeric.stranspose(B), r = BT.length, Ai, BTk;
    	    var i,j,k,accum;
    	    var ret = Array(p),reti;
    	    for(i=p-1;i>=0;i--) {
    	        reti = [];
    	        Ai = A[i];
    	        for(k=r-1;k>=0;k--) {
    	            accum = 0;
    	            BTk = BT[k];
    	            for(j in Ai) {
    	                if(!(Ai.hasOwnProperty(j))) continue;
    	                if(j in BTk) { accum += Ai[j]*BTk[j]; }
    	            }
    	            if(accum) reti[k] = accum;
    	        }
    	        ret[i] = reti;
    	    }
    	    return ret;
    	};

    	numeric.sdotMV = function dotMV(A,x) {
    	    var p = A.length, Ai, i,j;
    	    var ret = Array(p), accum;
    	    for(i=p-1;i>=0;i--) {
    	        Ai = A[i];
    	        accum = 0;
    	        for(j in Ai) {
    	            if(!(Ai.hasOwnProperty(j))) continue;
    	            if(x[j]) accum += Ai[j]*x[j];
    	        }
    	        if(accum) ret[i] = accum;
    	    }
    	    return ret;
    	};

    	numeric.sdotVM = function dotMV(x,A) {
    	    var i,j,Ai,alpha;
    	    var ret = [];
    	    for(i in x) {
    	        if(!x.hasOwnProperty(i)) continue;
    	        Ai = A[i];
    	        alpha = x[i];
    	        for(j in Ai) {
    	            if(!Ai.hasOwnProperty(j)) continue;
    	            if(!ret[j]) { ret[j] = 0; }
    	            ret[j] += alpha*Ai[j];
    	        }
    	    }
    	    return ret;
    	};

    	numeric.sdotVV = function dotVV(x,y) {
    	    var i,ret=0;
    	    for(i in x) { if(x[i] && y[i]) ret+= x[i]*y[i]; }
    	    return ret;
    	};

    	numeric.sdot = function dot(A,B) {
    	    var m = numeric.sdim(A).length, n = numeric.sdim(B).length;
    	    var k = m*1000+n;
    	    switch(k) {
    	    case 0: return A*B;
    	    case 1001: return numeric.sdotVV(A,B);
    	    case 2001: return numeric.sdotMV(A,B);
    	    case 1002: return numeric.sdotVM(A,B);
    	    case 2002: return numeric.sdotMM(A,B);
    	    default: throw new Error('numeric.sdot not implemented for tensors of order '+m+' and '+n);
    	    }
    	};

    	numeric.sscatter = function scatter(V) {
    	    var n = V[0].length, Vij, i, j, m = V.length, A = [], Aj;
    	    for(i=n-1;i>=0;--i) {
    	        if(!V[m-1][i]) continue;
    	        Aj = A;
    	        for(j=0;j<m-2;j++) {
    	            Vij = V[j][i];
    	            if(!Aj[Vij]) Aj[Vij] = [];
    	            Aj = Aj[Vij];
    	        }
    	        Aj[V[j][i]] = V[j+1][i];
    	    }
    	    return A;
    	};

    	numeric.sgather = function gather(A,ret,k) {
    	    if(typeof ret === "undefined") ret = [];
    	    if(typeof k === "undefined") k = [];
    	    var n,i,Ai;
    	    n = k.length;
    	    for(i in A) {
    	        if(A.hasOwnProperty(i)) {
    	            k[n] = parseInt(i);
    	            Ai = A[i];
    	            if(typeof Ai === "number") {
    	                if(Ai) {
    	                    if(ret.length === 0) {
    	                        for(i=n+1;i>=0;--i) ret[i] = [];
    	                    }
    	                    for(i=n;i>=0;--i) ret[i].push(k[i]);
    	                    ret[n+1].push(Ai);
    	                }
    	            } else gather(Ai,ret,k);
    	        }
    	    }
    	    if(k.length>n) k.pop();
    	    return ret;
    	};

    	// 6. Coordinate matrices
    	numeric.cLU = function LU(A) {
    	    var I = A[0], J = A[1], V = A[2];
    	    var p = I.length, m=0, i,j,k,a,b,c;
    	    for(i=0;i<p;i++) if(I[i]>m) m=I[i];
    	    m++;
    	    var L = Array(m), U = Array(m), left = numeric.rep([m],Infinity), right = numeric.rep([m],-Infinity);
    	    var Ui, Uj,alpha;
    	    for(k=0;k<p;k++) {
    	        i = I[k];
    	        j = J[k];
    	        if(j<left[i]) left[i] = j;
    	        if(j>right[i]) right[i] = j;
    	    }
    	    for(i=0;i<m-1;i++) { if(right[i] > right[i+1]) right[i+1] = right[i]; }
    	    for(i=m-1;i>=1;i--) { if(left[i]<left[i-1]) left[i-1] = left[i]; }
    	    var countL = 0, countU = 0;
    	    for(i=0;i<m;i++) {
    	        U[i] = numeric.rep([right[i]-left[i]+1],0);
    	        L[i] = numeric.rep([i-left[i]],0);
    	        countL += i-left[i]+1;
    	        countU += right[i]-i+1;
    	    }
    	    for(k=0;k<p;k++) { i = I[k]; U[i][J[k]-left[i]] = V[k]; }
    	    for(i=0;i<m-1;i++) {
    	        a = i-left[i];
    	        Ui = U[i];
    	        for(j=i+1;left[j]<=i && j<m;j++) {
    	            b = i-left[j];
    	            c = right[i]-i;
    	            Uj = U[j];
    	            alpha = Uj[b]/Ui[a];
    	            if(alpha) {
    	                for(k=1;k<=c;k++) { Uj[k+b] -= alpha*Ui[k+a]; }
    	                L[j][i-left[j]] = alpha;
    	            }
    	        }
    	    }
    	    var Ui = [], Uj = [], Uv = [], Li = [], Lj = [], Lv = [];
    	    var p,q,foo;
    	    p=0; q=0;
    	    for(i=0;i<m;i++) {
    	        a = left[i];
    	        b = right[i];
    	        foo = U[i];
    	        for(j=i;j<=b;j++) {
    	            if(foo[j-a]) {
    	                Ui[p] = i;
    	                Uj[p] = j;
    	                Uv[p] = foo[j-a];
    	                p++;
    	            }
    	        }
    	        foo = L[i];
    	        for(j=a;j<i;j++) {
    	            if(foo[j-a]) {
    	                Li[q] = i;
    	                Lj[q] = j;
    	                Lv[q] = foo[j-a];
    	                q++;
    	            }
    	        }
    	        Li[q] = i;
    	        Lj[q] = i;
    	        Lv[q] = 1;
    	        q++;
    	    }
    	    return {U:[Ui,Uj,Uv], L:[Li,Lj,Lv]};
    	};

    	numeric.cLUsolve = function LUsolve(lu,b) {
    	    var L = lu.L, U = lu.U, ret = numeric.clone(b);
    	    var Li = L[0], Lj = L[1], Lv = L[2];
    	    var Ui = U[0], Uj = U[1], Uv = U[2];
    	    var p = Ui.length; Li.length;
    	    var m = ret.length,i,k;
    	    k = 0;
    	    for(i=0;i<m;i++) {
    	        while(Lj[k] < i) {
    	            ret[i] -= Lv[k]*ret[Lj[k]];
    	            k++;
    	        }
    	        k++;
    	    }
    	    k = p-1;
    	    for(i=m-1;i>=0;i--) {
    	        while(Uj[k] > i) {
    	            ret[i] -= Uv[k]*ret[Uj[k]];
    	            k--;
    	        }
    	        ret[i] /= Uv[k];
    	        k--;
    	    }
    	    return ret;
    	};

    	numeric.cgrid = function grid(n,shape) {
    	    if(typeof n === "number") n = [n,n];
    	    var ret = numeric.rep(n,-1);
    	    var i,j,count;
    	    if(typeof shape !== "function") {
    	        switch(shape) {
    	        case 'L':
    	            shape = function(i,j) { return (i>=n[0]/2 || j<n[1]/2); };
    	            break;
    	        default:
    	            shape = function(i,j) { return true; };
    	            break;
    	        }
    	    }
    	    count=0;
    	    for(i=1;i<n[0]-1;i++) for(j=1;j<n[1]-1;j++) 
    	        if(shape(i,j)) {
    	            ret[i][j] = count;
    	            count++;
    	        }
    	    return ret;
    	};

    	numeric.cdelsq = function delsq(g) {
    	    var dir = [[-1,0],[0,-1],[0,1],[1,0]];
    	    var s = numeric.dim(g), m = s[0], n = s[1], i,j,k,p,q;
    	    var Li = [], Lj = [], Lv = [];
    	    for(i=1;i<m-1;i++) for(j=1;j<n-1;j++) {
    	        if(g[i][j]<0) continue;
    	        for(k=0;k<4;k++) {
    	            p = i+dir[k][0];
    	            q = j+dir[k][1];
    	            if(g[p][q]<0) continue;
    	            Li.push(g[i][j]);
    	            Lj.push(g[p][q]);
    	            Lv.push(-1);
    	        }
    	        Li.push(g[i][j]);
    	        Lj.push(g[i][j]);
    	        Lv.push(4);
    	    }
    	    return [Li,Lj,Lv];
    	};

    	numeric.cdotMV = function dotMV(A,x) {
    	    var ret, Ai = A[0], Aj = A[1], Av = A[2],k,p=Ai.length,N;
    	    N=0;
    	    for(k=0;k<p;k++) { if(Ai[k]>N) N = Ai[k]; }
    	    N++;
    	    ret = numeric.rep([N],0);
    	    for(k=0;k<p;k++) { ret[Ai[k]]+=Av[k]*x[Aj[k]]; }
    	    return ret;
    	};

    	// 7. Splines

    	numeric.Spline = function Spline(x,yl,yr,kl,kr) { this.x = x; this.yl = yl; this.yr = yr; this.kl = kl; this.kr = kr; };
    	numeric.Spline.prototype._at = function _at(x1,p) {
    	    var x = this.x;
    	    var yl = this.yl;
    	    var yr = this.yr;
    	    var kl = this.kl;
    	    var kr = this.kr;
    	    var x1,a,b,t;
    	    var add = numeric.add, sub = numeric.sub, mul = numeric.mul;
    	    a = sub(mul(kl[p],x[p+1]-x[p]),sub(yr[p+1],yl[p]));
    	    b = add(mul(kr[p+1],x[p]-x[p+1]),sub(yr[p+1],yl[p]));
    	    t = (x1-x[p])/(x[p+1]-x[p]);
    	    var s = t*(1-t);
    	    return add(add(add(mul(1-t,yl[p]),mul(t,yr[p+1])),mul(a,s*(1-t))),mul(b,s*t));
    	};
    	numeric.Spline.prototype.at = function at(x0) {
    	    if(typeof x0 === "number") {
    	        var x = this.x;
    	        var n = x.length;
    	        var p,q,mid,floor = Math.floor;
    	        p = 0;
    	        q = n-1;
    	        while(q-p>1) {
    	            mid = floor((p+q)/2);
    	            if(x[mid] <= x0) p = mid;
    	            else q = mid;
    	        }
    	        return this._at(x0,p);
    	    }
    	    var n = x0.length, i, ret = Array(n);
    	    for(i=n-1;i!==-1;--i) ret[i] = this.at(x0[i]);
    	    return ret;
    	};
    	numeric.Spline.prototype.diff = function diff() {
    	    var x = this.x;
    	    var yl = this.yl;
    	    var yr = this.yr;
    	    var kl = this.kl;
    	    var kr = this.kr;
    	    var n = yl.length;
    	    var i,dx,dy;
    	    var zl = kl, zr = kr, pl = Array(n), pr = Array(n);
    	    var add = numeric.add, mul = numeric.mul, div = numeric.div, sub = numeric.sub;
    	    for(i=n-1;i!==-1;--i) {
    	        dx = x[i+1]-x[i];
    	        dy = sub(yr[i+1],yl[i]);
    	        pl[i] = div(add(mul(dy, 6),mul(kl[i],-4*dx),mul(kr[i+1],-2*dx)),dx*dx);
    	        pr[i+1] = div(add(mul(dy,-6),mul(kl[i], 2*dx),mul(kr[i+1], 4*dx)),dx*dx);
    	    }
    	    return new numeric.Spline(x,zl,zr,pl,pr);
    	};
    	numeric.Spline.prototype.roots = function roots() {
    	    function sqr(x) { return x*x; }
    	    var ret = [];
    	    var x = this.x, yl = this.yl, yr = this.yr, kl = this.kl, kr = this.kr;
    	    if(typeof yl[0] === "number") {
    	        yl = [yl];
    	        yr = [yr];
    	        kl = [kl];
    	        kr = [kr];
    	    }
    	    var m = yl.length,n=x.length-1,i,j,k;
    	    var ai,bi,ci,di, ret = Array(m),ri,k0,k1,y0,y1,A,B,D,dx,stops,z0,z1,zm,t0,t1,tm;
    	    var sqrt = Math.sqrt;
    	    for(i=0;i!==m;++i) {
    	        ai = yl[i];
    	        bi = yr[i];
    	        ci = kl[i];
    	        di = kr[i];
    	        ri = [];
    	        for(j=0;j!==n;j++) {
    	            if(j>0 && bi[j]*ai[j]<0) ri.push(x[j]);
    	            dx = (x[j+1]-x[j]);
    	            y0 = ai[j];
    	            y1 = bi[j+1];
    	            k0 = ci[j]/dx;
    	            k1 = di[j+1]/dx;
    	            D = sqr(k0-k1+3*(y0-y1)) + 12*k1*y0;
    	            A = k1+3*y0+2*k0-3*y1;
    	            B = 3*(k1+k0+2*(y0-y1));
    	            if(D<=0) {
    	                z0 = A/B;
    	                if(z0>x[j] && z0<x[j+1]) stops = [x[j],z0,x[j+1]];
    	                else stops = [x[j],x[j+1]];
    	            } else {
    	                z0 = (A-sqrt(D))/B;
    	                z1 = (A+sqrt(D))/B;
    	                stops = [x[j]];
    	                if(z0>x[j] && z0<x[j+1]) stops.push(z0);
    	                if(z1>x[j] && z1<x[j+1]) stops.push(z1);
    	                stops.push(x[j+1]);
    	            }
    	            t0 = stops[0];
    	            z0 = this._at(t0,j);
    	            for(k=0;k<stops.length-1;k++) {
    	                t1 = stops[k+1];
    	                z1 = this._at(t1,j);
    	                if(z0 === 0) {
    	                    ri.push(t0); 
    	                    t0 = t1;
    	                    z0 = z1;
    	                    continue;
    	                }
    	                if(z1 === 0 || z0*z1>0) {
    	                    t0 = t1;
    	                    z0 = z1;
    	                    continue;
    	                }
    	                var side = 0;
    	                while(1) {
    	                    tm = (z0*t1-z1*t0)/(z0-z1);
    	                    if(tm <= t0 || tm >= t1) { break; }
    	                    zm = this._at(tm,j);
    	                    if(zm*z1>0) {
    	                        t1 = tm;
    	                        z1 = zm;
    	                        if(side === -1) z0*=0.5;
    	                        side = -1;
    	                    } else if(zm*z0>0) {
    	                        t0 = tm;
    	                        z0 = zm;
    	                        if(side === 1) z1*=0.5;
    	                        side = 1;
    	                    } else break;
    	                }
    	                ri.push(tm);
    	                t0 = stops[k+1];
    	                z0 = this._at(t0, j);
    	            }
    	            if(z1 === 0) ri.push(t1);
    	        }
    	        ret[i] = ri;
    	    }
    	    if(typeof this.yl[0] === "number") return ret[0];
    	    return ret;
    	};
    	numeric.spline = function spline(x,y,k1,kn) {
    	    var n = x.length, b = [], dx = [], dy = [];
    	    var i;
    	    var sub = numeric.sub,mul = numeric.mul,add = numeric.add;
    	    for(i=n-2;i>=0;i--) { dx[i] = x[i+1]-x[i]; dy[i] = sub(y[i+1],y[i]); }
    	    if(typeof k1 === "string" || typeof kn === "string") { 
    	        k1 = kn = "periodic";
    	    }
    	    // Build sparse tridiagonal system
    	    var T = [[],[],[]];
    	    switch(typeof k1) {
    	    case "undefined":
    	        b[0] = mul(3/(dx[0]*dx[0]),dy[0]);
    	        T[0].push(0,0);
    	        T[1].push(0,1);
    	        T[2].push(2/dx[0],1/dx[0]);
    	        break;
    	    case "string":
    	        b[0] = add(mul(3/(dx[n-2]*dx[n-2]),dy[n-2]),mul(3/(dx[0]*dx[0]),dy[0]));
    	        T[0].push(0,0,0);
    	        T[1].push(n-2,0,1);
    	        T[2].push(1/dx[n-2],2/dx[n-2]+2/dx[0],1/dx[0]);
    	        break;
    	    default:
    	        b[0] = k1;
    	        T[0].push(0);
    	        T[1].push(0);
    	        T[2].push(1);
    	        break;
    	    }
    	    for(i=1;i<n-1;i++) {
    	        b[i] = add(mul(3/(dx[i-1]*dx[i-1]),dy[i-1]),mul(3/(dx[i]*dx[i]),dy[i]));
    	        T[0].push(i,i,i);
    	        T[1].push(i-1,i,i+1);
    	        T[2].push(1/dx[i-1],2/dx[i-1]+2/dx[i],1/dx[i]);
    	    }
    	    switch(typeof kn) {
    	    case "undefined":
    	        b[n-1] = mul(3/(dx[n-2]*dx[n-2]),dy[n-2]);
    	        T[0].push(n-1,n-1);
    	        T[1].push(n-2,n-1);
    	        T[2].push(1/dx[n-2],2/dx[n-2]);
    	        break;
    	    case "string":
    	        T[1][T[1].length-1] = 0;
    	        break;
    	    default:
    	        b[n-1] = kn;
    	        T[0].push(n-1);
    	        T[1].push(n-1);
    	        T[2].push(1);
    	        break;
    	    }
    	    if(typeof b[0] !== "number") b = numeric.transpose(b);
    	    else b = [b];
    	    var k = Array(b.length);
    	    if(typeof k1 === "string") {
    	        for(i=k.length-1;i!==-1;--i) {
    	            k[i] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(T)),b[i]);
    	            k[i][n-1] = k[i][0];
    	        }
    	    } else {
    	        for(i=k.length-1;i!==-1;--i) {
    	            k[i] = numeric.cLUsolve(numeric.cLU(T),b[i]);
    	        }
    	    }
    	    if(typeof y[0] === "number") k = k[0];
    	    else k = numeric.transpose(k);
    	    return new numeric.Spline(x,y,y,k,k);
    	};

    	// 8. FFT
    	numeric.fftpow2 = function fftpow2(x,y) {
    	    var n = x.length;
    	    if(n === 1) return;
    	    var cos = Math.cos, sin = Math.sin, i,j;
    	    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    	    j = n/2;
    	    for(i=n-1;i!==-1;--i) {
    	        --j;
    	        xo[j] = x[i];
    	        yo[j] = y[i];
    	        --i;
    	        xe[j] = x[i];
    	        ye[j] = y[i];
    	    }
    	    fftpow2(xe,ye);
    	    fftpow2(xo,yo);
    	    j = n/2;
    	    var t,k = (-6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    	    for(i=n-1;i!==-1;--i) {
    	        --j;
    	        if(j === -1) j = n/2-1;
    	        t = k*i;
    	        ci = cos(t);
    	        si = sin(t);
    	        x[i] = xe[j] + ci*xo[j] - si*yo[j];
    	        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    	    }
    	};
    	numeric._ifftpow2 = function _ifftpow2(x,y) {
    	    var n = x.length;
    	    if(n === 1) return;
    	    var cos = Math.cos, sin = Math.sin, i,j;
    	    var xe = Array(n/2), ye = Array(n/2), xo = Array(n/2), yo = Array(n/2);
    	    j = n/2;
    	    for(i=n-1;i!==-1;--i) {
    	        --j;
    	        xo[j] = x[i];
    	        yo[j] = y[i];
    	        --i;
    	        xe[j] = x[i];
    	        ye[j] = y[i];
    	    }
    	    _ifftpow2(xe,ye);
    	    _ifftpow2(xo,yo);
    	    j = n/2;
    	    var t,k = (6.2831853071795864769252867665590057683943387987502116419/n),ci,si;
    	    for(i=n-1;i!==-1;--i) {
    	        --j;
    	        if(j === -1) j = n/2-1;
    	        t = k*i;
    	        ci = cos(t);
    	        si = sin(t);
    	        x[i] = xe[j] + ci*xo[j] - si*yo[j];
    	        y[i] = ye[j] + ci*yo[j] + si*xo[j];
    	    }
    	};
    	numeric.ifftpow2 = function ifftpow2(x,y) {
    	    numeric._ifftpow2(x,y);
    	    numeric.diveq(x,x.length);
    	    numeric.diveq(y,y.length);
    	};
    	numeric.convpow2 = function convpow2(ax,ay,bx,by) {
    	    numeric.fftpow2(ax,ay);
    	    numeric.fftpow2(bx,by);
    	    var i,n = ax.length,axi,bxi,ayi,byi;
    	    for(i=n-1;i!==-1;--i) {
    	        axi = ax[i]; ayi = ay[i]; bxi = bx[i]; byi = by[i];
    	        ax[i] = axi*bxi-ayi*byi;
    	        ay[i] = axi*byi+ayi*bxi;
    	    }
    	    numeric.ifftpow2(ax,ay);
    	};
    	numeric.T.prototype.fft = function fft() {
    	    var x = this.x, y = this.y;
    	    var n = x.length, log = Math.log, log2 = log(2),
    	        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    	    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    	    var k, c = (-3.141592653589793238462643383279502884197169399375105820/n),t;
    	    var a = numeric.rep([m],0), b = numeric.rep([m],0);
    	    for(k=0;k<n;k++) a[k] = x[k];
    	    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    	    cx[0] = 1;
    	    for(k=1;k<=m/2;k++) {
    	        t = c*k*k;
    	        cx[k] = cos(t);
    	        cy[k] = sin(t);
    	        cx[m-k] = cos(t);
    	        cy[m-k] = sin(t);
    	    }
    	    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    	    X = X.mul(Y);
    	    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    	    X = X.mul(Y);
    	    X.x.length = n;
    	    X.y.length = n;
    	    return X;
    	};
    	numeric.T.prototype.ifft = function ifft() {
    	    var x = this.x, y = this.y;
    	    var n = x.length, log = Math.log, log2 = log(2),
    	        p = Math.ceil(log(2*n-1)/log2), m = Math.pow(2,p);
    	    var cx = numeric.rep([m],0), cy = numeric.rep([m],0), cos = Math.cos, sin = Math.sin;
    	    var k, c = (3.141592653589793238462643383279502884197169399375105820/n),t;
    	    var a = numeric.rep([m],0), b = numeric.rep([m],0);
    	    for(k=0;k<n;k++) a[k] = x[k];
    	    if(typeof y !== "undefined") for(k=0;k<n;k++) b[k] = y[k];
    	    cx[0] = 1;
    	    for(k=1;k<=m/2;k++) {
    	        t = c*k*k;
    	        cx[k] = cos(t);
    	        cy[k] = sin(t);
    	        cx[m-k] = cos(t);
    	        cy[m-k] = sin(t);
    	    }
    	    var X = new numeric.T(a,b), Y = new numeric.T(cx,cy);
    	    X = X.mul(Y);
    	    numeric.convpow2(X.x,X.y,numeric.clone(Y.x),numeric.neg(Y.y));
    	    X = X.mul(Y);
    	    X.x.length = n;
    	    X.y.length = n;
    	    return X.div(n);
    	};

    	//9. Unconstrained optimization
    	numeric.gradient = function gradient(f,x) {
    	    var n = x.length;
    	    var f0 = f(x);
    	    if(isNaN(f0)) throw new Error('gradient: f(x) is a NaN!');
    	    var max = Math.max;
    	    var i,x0 = numeric.clone(x),f1,f2, J = Array(n);
    	    numeric.div; numeric.sub;var errest,max = Math.max,eps = 1e-3,abs = Math.abs, min = Math.min;
    	    var t0,t1,t2,it=0,d1,d2,N;
    	    for(i=0;i<n;i++) {
    	        var h = max(1e-6*f0,1e-8);
    	        while(1) {
    	            ++it;
    	            if(it>20) { throw new Error("Numerical gradient fails"); }
    	            x0[i] = x[i]+h;
    	            f1 = f(x0);
    	            x0[i] = x[i]-h;
    	            f2 = f(x0);
    	            x0[i] = x[i];
    	            if(isNaN(f1) || isNaN(f2)) { h/=16; continue; }
    	            J[i] = (f1-f2)/(2*h);
    	            t0 = x[i]-h;
    	            t1 = x[i];
    	            t2 = x[i]+h;
    	            d1 = (f1-f0)/h;
    	            d2 = (f0-f2)/h;
    	            N = max(abs(J[i]),abs(f0),abs(f1),abs(f2),abs(t0),abs(t1),abs(t2),1e-8);
    	            errest = min(max(abs(d1-J[i]),abs(d2-J[i]),abs(d1-d2))/N,h/N);
    	            if(errest>eps) { h/=16; }
    	            else break;
    	            }
    	    }
    	    return J;
    	};

    	numeric.uncmin = function uncmin(f,x0,tol,gradient,maxit,callback,options) {
    	    var grad = numeric.gradient;
    	    if(typeof options === "undefined") { options = {}; }
    	    if(typeof tol === "undefined") { tol = 1e-8; }
    	    if(typeof gradient === "undefined") { gradient = function(x) { return grad(f,x); }; }
    	    if(typeof maxit === "undefined") maxit = 1000;
    	    x0 = numeric.clone(x0);
    	    var n = x0.length;
    	    var f0 = f(x0),f1,df0;
    	    if(isNaN(f0)) throw new Error('uncmin: f(x0) is a NaN!');
    	    var max = Math.max, norm2 = numeric.norm2;
    	    tol = max(tol,numeric.epsilon);
    	    var step,g0,g1,H1 = options.Hinv || numeric.identity(n);
    	    var dot = numeric.dot; numeric.inv; var sub = numeric.sub, add = numeric.add, ten = numeric.tensor, div = numeric.div, mul = numeric.mul;
    	    var all = numeric.all, isfinite = numeric.isFinite, neg = numeric.neg;
    	    var it=0,s,x1,y,Hy,ys,t,nstep;
    	    var msg = "";
    	    g0 = gradient(x0);
    	    while(it<maxit) {
    	        if(typeof callback === "function") { if(callback(it,x0,f0,g0,H1)) { msg = "Callback returned true"; break; } }
    	        if(!all(isfinite(g0))) { msg = "Gradient has Infinity or NaN"; break; }
    	        step = neg(dot(H1,g0));
    	        if(!all(isfinite(step))) { msg = "Search direction has Infinity or NaN"; break; }
    	        nstep = norm2(step);
    	        if(nstep < tol) { msg="Newton step smaller than tol"; break; }
    	        t = 1;
    	        df0 = dot(g0,step);
    	        // line search
    	        x1 = x0;
    	        while(it < maxit) {
    	            if(t*nstep < tol) { break; }
    	            s = mul(step,t);
    	            x1 = add(x0,s);
    	            f1 = f(x1);
    	            if(f1-f0 >= 0.1*t*df0 || isNaN(f1)) {
    	                t *= 0.5;
    	                ++it;
    	                continue;
    	            }
    	            break;
    	        }
    	        if(t*nstep < tol) { msg = "Line search step size smaller than tol"; break; }
    	        if(it === maxit) { msg = "maxit reached during line search"; break; }
    	        g1 = gradient(x1);
    	        y = sub(g1,g0);
    	        ys = dot(y,s);
    	        Hy = dot(H1,y);
    	        H1 = sub(add(H1,
    	                mul(
    	                        (ys+dot(y,Hy))/(ys*ys),
    	                        ten(s,s)    )),
    	                div(add(ten(Hy,s),ten(s,Hy)),ys));
    	        x0 = x1;
    	        f0 = f1;
    	        g0 = g1;
    	        ++it;
    	    }
    	    return {solution: x0, f: f0, gradient: g0, invHessian: H1, iterations:it, message: msg};
    	};

    	// 10. Ode solver (Dormand-Prince)
    	numeric.Dopri = function Dopri(x,y,f,ymid,iterations,msg,events) {
    	    this.x = x;
    	    this.y = y;
    	    this.f = f;
    	    this.ymid = ymid;
    	    this.iterations = iterations;
    	    this.events = events;
    	    this.message = msg;
    	};
    	numeric.Dopri.prototype._at = function _at(xi,j) {
    	    function sqr(x) { return x*x; }
    	    var sol = this;
    	    var xs = sol.x;
    	    var ys = sol.y;
    	    var k1 = sol.f;
    	    var ymid = sol.ymid;
    	    xs.length;
    	    var x0,x1,xh,y0,y1,yh,xi;
    	    var h;
    	    var c = 0.5;
    	    var add = numeric.add, mul = numeric.mul,sub = numeric.sub, p,q,w;
    	    x0 = xs[j];
    	    x1 = xs[j+1];
    	    y0 = ys[j];
    	    y1 = ys[j+1];
    	    h  = x1-x0;
    	    xh = x0+c*h;
    	    yh = ymid[j];
    	    p = sub(k1[j  ],mul(y0,1/(x0-xh)+2/(x0-x1)));
    	    q = sub(k1[j+1],mul(y1,1/(x1-xh)+2/(x1-x0)));
    	    w = [sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh),
    	         sqr(xi - x0) * sqr(xi - x1) / sqr(x0 - xh) / sqr(x1 - xh),
    	         sqr(xi - x0) * (xi - xh) / sqr(x1 - x0) / (x1 - xh),
    	         (xi - x0) * sqr(xi - x1) * (xi - xh) / sqr(x0-x1) / (x0 - xh),
    	         (xi - x1) * sqr(xi - x0) * (xi - xh) / sqr(x0-x1) / (x1 - xh)];
    	    return add(add(add(add(mul(y0,w[0]),
    	                           mul(yh,w[1])),
    	                           mul(y1,w[2])),
    	                           mul( p,w[3])),
    	                           mul( q,w[4]));
    	};
    	numeric.Dopri.prototype.at = function at(x) {
    	    var i,j,k,floor = Math.floor;
    	    if(typeof x !== "number") {
    	        var n = x.length, ret = Array(n);
    	        for(i=n-1;i!==-1;--i) {
    	            ret[i] = this.at(x[i]);
    	        }
    	        return ret;
    	    }
    	    var x0 = this.x;
    	    i = 0; j = x0.length-1;
    	    while(j-i>1) {
    	        k = floor(0.5*(i+j));
    	        if(x0[k] <= x) i = k;
    	        else j = k;
    	    }
    	    return this._at(x,i);
    	};

    	numeric.dopri = function dopri(x0,x1,y0,f,tol,maxit,event) {
    	    if(typeof tol === "undefined") { tol = 1e-6; }
    	    if(typeof maxit === "undefined") { maxit = 1000; }
    	    var xs = [x0], ys = [y0], k1 = [f(x0,y0)], k2,k3,k4,k5,k6,k7, ymid = [];
    	    var A2 = 1/5;
    	    var A3 = [3/40,9/40];
    	    var A4 = [44/45,-56/15,32/9];
    	    var A5 = [19372/6561,-25360/2187,64448/6561,-212/729];
    	    var A6 = [9017/3168,-355/33,46732/5247,49/176,-5103/18656];
    	    var b = [35/384,0,500/1113,125/192,-2187/6784,11/84];
    	    var bm = [0.5*6025192743/30085553152,
    	              0,
    	              0.5*51252292925/65400821598,
    	              0.5*-2691868925/45128329728,
    	              0.5*187940372067/1594534317056,
    	              0.5*-1776094331/19743644256,
    	              0.5*11237099/235043384];
    	    var c = [1/5,3/10,4/5,8/9,1,1];
    	    var e = [-71/57600,0,71/16695,-71/1920,17253/339200,-22/525,1/40];
    	    var i = 0,er,j;
    	    var h = (x1-x0)/10;
    	    var it = 0;
    	    var add = numeric.add, mul = numeric.mul, y1,erinf;
    	    var min = Math.min, abs = Math.abs, norminf = numeric.norminf,pow = Math.pow;
    	    var any = numeric.any, lt = numeric.lt, and = numeric.and; numeric.sub;
    	    var e0, e1, ev;
    	    var ret = new numeric.Dopri(xs,ys,k1,ymid,-1,"");
    	    if(typeof event === "function") e0 = event(x0,y0);
    	    while(x0<x1 && it<maxit) {
    	        ++it;
    	        if(x0+h>x1) h = x1-x0;
    	        k2 = f(x0+c[0]*h,                add(y0,mul(   A2*h,k1[i])));
    	        k3 = f(x0+c[1]*h,            add(add(y0,mul(A3[0]*h,k1[i])),mul(A3[1]*h,k2)));
    	        k4 = f(x0+c[2]*h,        add(add(add(y0,mul(A4[0]*h,k1[i])),mul(A4[1]*h,k2)),mul(A4[2]*h,k3)));
    	        k5 = f(x0+c[3]*h,    add(add(add(add(y0,mul(A5[0]*h,k1[i])),mul(A5[1]*h,k2)),mul(A5[2]*h,k3)),mul(A5[3]*h,k4)));
    	        k6 = f(x0+c[4]*h,add(add(add(add(add(y0,mul(A6[0]*h,k1[i])),mul(A6[1]*h,k2)),mul(A6[2]*h,k3)),mul(A6[3]*h,k4)),mul(A6[4]*h,k5)));
    	        y1 = add(add(add(add(add(y0,mul(k1[i],h*b[0])),mul(k3,h*b[2])),mul(k4,h*b[3])),mul(k5,h*b[4])),mul(k6,h*b[5]));
    	        k7 = f(x0+h,y1);
    	        er = add(add(add(add(add(mul(k1[i],h*e[0]),mul(k3,h*e[2])),mul(k4,h*e[3])),mul(k5,h*e[4])),mul(k6,h*e[5])),mul(k7,h*e[6]));
    	        if(typeof er === "number") erinf = abs(er);
    	        else erinf = norminf(er);
    	        if(erinf > tol) { // reject
    	            h = 0.2*h*pow(tol/erinf,0.25);
    	            if(x0+h === x0) {
    	                ret.msg = "Step size became too small";
    	                break;
    	            }
    	            continue;
    	        }
    	        ymid[i] = add(add(add(add(add(add(y0,
    	                mul(k1[i],h*bm[0])),
    	                mul(k3   ,h*bm[2])),
    	                mul(k4   ,h*bm[3])),
    	                mul(k5   ,h*bm[4])),
    	                mul(k6   ,h*bm[5])),
    	                mul(k7   ,h*bm[6]));
    	        ++i;
    	        xs[i] = x0+h;
    	        ys[i] = y1;
    	        k1[i] = k7;
    	        if(typeof event === "function") {
    	            var yi,xl = x0,xr = x0+0.5*h,xi;
    	            e1 = event(xr,ymid[i-1]);
    	            ev = and(lt(e0,0),lt(0,e1));
    	            if(!any(ev)) { xl = xr; xr = x0+h; e0 = e1; e1 = event(xr,y1); ev = and(lt(e0,0),lt(0,e1)); }
    	            if(any(ev)) {
    	                var en,ei;
    	                var side=0, sl = 1.0, sr = 1.0;
    	                while(1) {
    	                    if(typeof e0 === "number") xi = (sr*e1*xl-sl*e0*xr)/(sr*e1-sl*e0);
    	                    else {
    	                        xi = xr;
    	                        for(j=e0.length-1;j!==-1;--j) {
    	                            if(e0[j]<0 && e1[j]>0) xi = min(xi,(sr*e1[j]*xl-sl*e0[j]*xr)/(sr*e1[j]-sl*e0[j]));
    	                        }
    	                    }
    	                    if(xi <= xl || xi >= xr) break;
    	                    yi = ret._at(xi, i-1);
    	                    ei = event(xi,yi);
    	                    en = and(lt(e0,0),lt(0,ei));
    	                    if(any(en)) {
    	                        xr = xi;
    	                        e1 = ei;
    	                        ev = en;
    	                        sr = 1.0;
    	                        if(side === -1) sl *= 0.5;
    	                        else sl = 1.0;
    	                        side = -1;
    	                    } else {
    	                        xl = xi;
    	                        e0 = ei;
    	                        sl = 1.0;
    	                        if(side === 1) sr *= 0.5;
    	                        else sr = 1.0;
    	                        side = 1;
    	                    }
    	                }
    	                y1 = ret._at(0.5*(x0+xi),i-1);
    	                ret.f[i] = f(xi,yi);
    	                ret.x[i] = xi;
    	                ret.y[i] = yi;
    	                ret.ymid[i-1] = y1;
    	                ret.events = ev;
    	                ret.iterations = it;
    	                return ret;
    	            }
    	        }
    	        x0 += h;
    	        y0 = y1;
    	        e0 = e1;
    	        h = min(0.8*h*pow(tol/erinf,0.25),4*h);
    	    }
    	    ret.iterations = it;
    	    return ret;
    	};

    	// 11. Ax = b
    	numeric.LU = function(A, fast) {
    	  fast = fast || false;

    	  var abs = Math.abs;
    	  var i, j, k, absAjk, Akk, Ak, Pk, Ai;
    	  var max;
    	  var n = A.length, n1 = n-1;
    	  var P = new Array(n);
    	  if(!fast) A = numeric.clone(A);

    	  for (k = 0; k < n; ++k) {
    	    Pk = k;
    	    Ak = A[k];
    	    max = abs(Ak[k]);
    	    for (j = k + 1; j < n; ++j) {
    	      absAjk = abs(A[j][k]);
    	      if (max < absAjk) {
    	        max = absAjk;
    	        Pk = j;
    	      }
    	    }
    	    P[k] = Pk;

    	    if (Pk != k) {
    	      A[k] = A[Pk];
    	      A[Pk] = Ak;
    	      Ak = A[k];
    	    }

    	    Akk = Ak[k];

    	    for (i = k + 1; i < n; ++i) {
    	      A[i][k] /= Akk;
    	    }

    	    for (i = k + 1; i < n; ++i) {
    	      Ai = A[i];
    	      for (j = k + 1; j < n1; ++j) {
    	        Ai[j] -= Ai[k] * Ak[j];
    	        ++j;
    	        Ai[j] -= Ai[k] * Ak[j];
    	      }
    	      if(j===n1) Ai[j] -= Ai[k] * Ak[j];
    	    }
    	  }

    	  return {
    	    LU: A,
    	    P:  P
    	  };
    	};

    	numeric.LUsolve = function LUsolve(LUP, b) {
    	  var i, j;
    	  var LU = LUP.LU;
    	  var n   = LU.length;
    	  var x = numeric.clone(b);
    	  var P   = LUP.P;
    	  var Pi, LUi, tmp;

    	  for (i=n-1;i!==-1;--i) x[i] = b[i];
    	  for (i = 0; i < n; ++i) {
    	    Pi = P[i];
    	    if (P[i] !== i) {
    	      tmp = x[i];
    	      x[i] = x[Pi];
    	      x[Pi] = tmp;
    	    }

    	    LUi = LU[i];
    	    for (j = 0; j < i; ++j) {
    	      x[i] -= x[j] * LUi[j];
    	    }
    	  }

    	  for (i = n - 1; i >= 0; --i) {
    	    LUi = LU[i];
    	    for (j = i + 1; j < n; ++j) {
    	      x[i] -= x[j] * LUi[j];
    	    }

    	    x[i] /= LUi[i];
    	  }

    	  return x;
    	};

    	numeric.solve = function solve(A,b,fast) { return numeric.LUsolve(numeric.LU(A,fast), b); };

    	// 12. Linear programming
    	numeric.echelonize = function echelonize(A) {
    	    var s = numeric.dim(A), m = s[0], n = s[1];
    	    var I = numeric.identity(m);
    	    var P = Array(m);
    	    var i,j,k,l,Ai,Ii,Z,a;
    	    var abs = Math.abs;
    	    var diveq = numeric.diveq;
    	    A = numeric.clone(A);
    	    for(i=0;i<m;++i) {
    	        k = 0;
    	        Ai = A[i];
    	        Ii = I[i];
    	        for(j=1;j<n;++j) if(abs(Ai[k])<abs(Ai[j])) k=j;
    	        P[i] = k;
    	        diveq(Ii,Ai[k]);
    	        diveq(Ai,Ai[k]);
    	        for(j=0;j<m;++j) if(j!==i) {
    	            Z = A[j]; a = Z[k];
    	            for(l=n-1;l!==-1;--l) Z[l] -= Ai[l]*a;
    	            Z = I[j];
    	            for(l=m-1;l!==-1;--l) Z[l] -= Ii[l]*a;
    	        }
    	    }
    	    return {I:I, A:A, P:P};
    	};

    	numeric.__solveLP = function __solveLP(c,A,b,tol,maxit,x,flag) {
    	    var sum = numeric.sum; numeric.log; var mul = numeric.mul, sub = numeric.sub, dot = numeric.dot, div = numeric.div, add = numeric.add;
    	    var m = c.length, n = b.length,y;
    	    var unbounded = false, i0=0;
    	    var alpha = 1.0;
    	    numeric.transpose(A); numeric.svd;var transpose = numeric.transpose;numeric.leq; var sqrt = Math.sqrt, abs = Math.abs;
    	    numeric.muleq;
    	    numeric.norminf; numeric.any;var min = Math.min;
    	    var all = numeric.all, gt = numeric.gt;
    	    var p = Array(m), A0 = Array(n);numeric.rep([n],1); var H;
    	    var solve = numeric.solve, z = sub(b,dot(A,x)),count;
    	    var dotcc = dot(c,c);
    	    var g;
    	    for(count=i0;count<maxit;++count) {
    	        var i,d;
    	        for(i=n-1;i!==-1;--i) A0[i] = div(A[i],z[i]);
    	        var A1 = transpose(A0);
    	        for(i=m-1;i!==-1;--i) p[i] = (/*x[i]+*/sum(A1[i]));
    	        alpha = 0.25*abs(dotcc/dot(c,p));
    	        var a1 = 100*sqrt(dotcc/dot(p,p));
    	        if(!isFinite(alpha) || alpha>a1) alpha = a1;
    	        g = add(c,mul(alpha,p));
    	        H = dot(A1,A0);
    	        for(i=m-1;i!==-1;--i) H[i][i] += 1;
    	        d = solve(H,div(g,alpha),true);
    	        var t0 = div(z,dot(A,d));
    	        var t = 1.0;
    	        for(i=n-1;i!==-1;--i) if(t0[i]<0) t = min(t,-0.999*t0[i]);
    	        y = sub(x,mul(d,t));
    	        z = sub(b,dot(A,y));
    	        if(!all(gt(z,0))) return { solution: x, message: "", iterations: count };
    	        x = y;
    	        if(alpha<tol) return { solution: y, message: "", iterations: count };
    	        if(flag) {
    	            var s = dot(c,g), Ag = dot(A,g);
    	            unbounded = true;
    	            for(i=n-1;i!==-1;--i) if(s*Ag[i]<0) { unbounded = false; break; }
    	        } else {
    	            if(x[m-1]>=0) unbounded = false;
    	            else unbounded = true;
    	        }
    	        if(unbounded) return { solution: y, message: "Unbounded", iterations: count };
    	    }
    	    return { solution: x, message: "maximum iteration count exceeded", iterations:count };
    	};

    	numeric._solveLP = function _solveLP(c,A,b,tol,maxit) {
    	    var m = c.length, n = b.length,y;
    	    numeric.sum; numeric.log; numeric.mul; var sub = numeric.sub, dot = numeric.dot; numeric.div; numeric.add;
    	    var c0 = numeric.rep([m],0).concat([1]);
    	    var J = numeric.rep([n,1],-1);
    	    var A0 = numeric.blockMatrix([[A                   ,   J  ]]);
    	    var b0 = b;
    	    var y = numeric.rep([m],0).concat(Math.max(0,numeric.sup(numeric.neg(b)))+1);
    	    var x0 = numeric.__solveLP(c0,A0,b0,tol,maxit,y,false);
    	    var x = numeric.clone(x0.solution);
    	    x.length = m;
    	    var foo = numeric.inf(sub(b,dot(A,x)));
    	    if(foo<0) { return { solution: NaN, message: "Infeasible", iterations: x0.iterations }; }
    	    var ret = numeric.__solveLP(c, A, b, tol, maxit-x0.iterations, x, true);
    	    ret.iterations += x0.iterations;
    	    return ret;
    	};

    	numeric.solveLP = function solveLP(c,A,b,Aeq,beq,tol,maxit) {
    	    if(typeof maxit === "undefined") maxit = 1000;
    	    if(typeof tol === "undefined") tol = numeric.epsilon;
    	    if(typeof Aeq === "undefined") return numeric._solveLP(c,A,b,tol,maxit);
    	    var m = Aeq.length, n = Aeq[0].length, o = A.length;
    	    var B = numeric.echelonize(Aeq);
    	    var flags = numeric.rep([n],0);
    	    var P = B.P;
    	    var Q = [];
    	    var i;
    	    for(i=P.length-1;i!==-1;--i) flags[P[i]] = 1;
    	    for(i=n-1;i!==-1;--i) if(flags[i]===0) Q.push(i);
    	    var g = numeric.getRange;
    	    var I = numeric.linspace(0,m-1), J = numeric.linspace(0,o-1);
    	    var Aeq2 = g(Aeq,I,Q), A1 = g(A,J,P), A2 = g(A,J,Q), dot = numeric.dot, sub = numeric.sub;
    	    var A3 = dot(A1,B.I);
    	    var A4 = sub(A2,dot(A3,Aeq2)), b4 = sub(b,dot(A3,beq));
    	    var c1 = Array(P.length), c2 = Array(Q.length);
    	    for(i=P.length-1;i!==-1;--i) c1[i] = c[P[i]];
    	    for(i=Q.length-1;i!==-1;--i) c2[i] = c[Q[i]];
    	    var c4 = sub(c2,dot(c1,dot(B.I,Aeq2)));
    	    var S = numeric._solveLP(c4,A4,b4,tol,maxit);
    	    var x2 = S.solution;
    	    if(x2!==x2) return S;
    	    var x1 = dot(B.I,sub(beq,dot(Aeq2,x2)));
    	    var x = Array(c.length);
    	    for(i=P.length-1;i!==-1;--i) x[P[i]] = x1[i];
    	    for(i=Q.length-1;i!==-1;--i) x[Q[i]] = x2[i];
    	    return { solution: x, message:S.message, iterations: S.iterations };
    	};

    	numeric.MPStoLP = function MPStoLP(MPS) {
    	    if(MPS instanceof String) { MPS.split('\n'); }
    	    var state = 0;
    	    var states = ['Initial state','NAME','ROWS','COLUMNS','RHS','BOUNDS','ENDATA'];
    	    var n = MPS.length;
    	    var i,j,z,N=0,rows = {}, sign = [], rl = 0, vars = {}, nv = 0;
    	    var name;
    	    var c = [], A = [], b = [];
    	    function err(e) { throw new Error('MPStoLP: '+e+'\nLine '+i+': '+MPS[i]+'\nCurrent state: '+states[state]+'\n'); }
    	    for(i=0;i<n;++i) {
    	        z = MPS[i];
    	        var w0 = z.match(/\S*/g);
    	        var w = [];
    	        for(j=0;j<w0.length;++j) if(w0[j]!=="") w.push(w0[j]);
    	        if(w.length === 0) continue;
    	        for(j=0;j<states.length;++j) if(z.substr(0,states[j].length) === states[j]) break;
    	        if(j<states.length) {
    	            state = j;
    	            if(j===1) { name = w[1]; }
    	            if(j===6) return { name:name, c:c, A:numeric.transpose(A), b:b, rows:rows, vars:vars };
    	            continue;
    	        }
    	        switch(state) {
    	        case 0: case 1: err('Unexpected line');
    	        case 2: 
    	            switch(w[0]) {
    	            case 'N': if(N===0) N = w[1]; else err('Two or more N rows'); break;
    	            case 'L': rows[w[1]] = rl; sign[rl] = 1; b[rl] = 0; ++rl; break;
    	            case 'G': rows[w[1]] = rl; sign[rl] = -1;b[rl] = 0; ++rl; break;
    	            case 'E': rows[w[1]] = rl; sign[rl] = 0;b[rl] = 0; ++rl; break;
    	            default: err('Parse error '+numeric.prettyPrint(w));
    	            }
    	            break;
    	        case 3:
    	            if(!vars.hasOwnProperty(w[0])) { vars[w[0]] = nv; c[nv] = 0; A[nv] = numeric.rep([rl],0); ++nv; }
    	            var p = vars[w[0]];
    	            for(j=1;j<w.length;j+=2) {
    	                if(w[j] === N) { c[p] = parseFloat(w[j+1]); continue; }
    	                var q = rows[w[j]];
    	                A[p][q] = (sign[q]<0?-1:1)*parseFloat(w[j+1]);
    	            }
    	            break;
    	        case 4:
    	            for(j=1;j<w.length;j+=2) b[rows[w[j]]] = (sign[rows[w[j]]]<0?-1:1)*parseFloat(w[j+1]);
    	            break;
    	        case 5: /*FIXME*/ break;
    	        case 6: err('Internal error');
    	        }
    	    }
    	    err('Reached end of file without ENDATA');
    	};
    	// seedrandom.js version 2.0.
    	// Author: David Bau 4/2/2011
    	//
    	// Defines a method Math.seedrandom() that, when called, substitutes
    	// an explicitly seeded RC4-based algorithm for Math.random().  Also
    	// supports automatic seeding from local or network sources of entropy.
    	//
    	// Usage:
    	//
    	//   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
    	//
    	//   Math.seedrandom('yipee'); Sets Math.random to a function that is
    	//                             initialized using the given explicit seed.
    	//
    	//   Math.seedrandom();        Sets Math.random to a function that is
    	//                             seeded using the current time, dom state,
    	//                             and other accumulated local entropy.
    	//                             The generated seed string is returned.
    	//
    	//   Math.seedrandom('yowza', true);
    	//                             Seeds using the given explicit seed mixed
    	//                             together with accumulated entropy.
    	//
    	//   <script src="http://bit.ly/srandom-512"></script>
    	//                             Seeds using physical random bits downloaded
    	//                             from random.org.
    	//
    	//   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
    	//   </script>                 Seeds using urandom bits from call.jsonlib.com,
    	//                             which is faster than random.org.
    	//
    	// Examples:
    	//
    	//   Math.seedrandom("hello");            // Use "hello" as the seed.
    	//   document.write(Math.random());       // Always 0.5463663768140734
    	//   document.write(Math.random());       // Always 0.43973793770592234
    	//   var rng1 = Math.random;              // Remember the current prng.
    	//
    	//   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
    	//   document.write(Math.random());       // Pretty much unpredictable.
    	//
    	//   Math.random = rng1;                  // Continue "hello" prng sequence.
    	//   document.write(Math.random());       // Always 0.554769432473455
    	//
    	//   Math.seedrandom(autoseed);           // Restart at the previous seed.
    	//   document.write(Math.random());       // Repeat the 'unpredictable' value.
    	//
    	// Notes:
    	//
    	// Each time seedrandom('arg') is called, entropy from the passed seed
    	// is accumulated in a pool to help generate future seeds for the
    	// zero-argument form of Math.seedrandom, so entropy can be injected over
    	// time by calling seedrandom with explicit data repeatedly.
    	//
    	// On speed - This javascript implementation of Math.random() is about
    	// 3-10x slower than the built-in Math.random() because it is not native
    	// code, but this is typically fast enough anyway.  Seeding is more expensive,
    	// especially if you use auto-seeding.  Some details (timings on Chrome 4):
    	//
    	// Our Math.random()            - avg less than 0.002 milliseconds per call
    	// seedrandom('explicit')       - avg less than 0.5 milliseconds per call
    	// seedrandom('explicit', true) - avg less than 2 milliseconds per call
    	// seedrandom()                 - avg about 38 milliseconds per call
    	//
    	// LICENSE (BSD):
    	//
    	// Copyright 2010 David Bau, all rights reserved.
    	//
    	// Redistribution and use in source and binary forms, with or without
    	// modification, are permitted provided that the following conditions are met:
    	// 
    	//   1. Redistributions of source code must retain the above copyright
    	//      notice, this list of conditions and the following disclaimer.
    	//
    	//   2. Redistributions in binary form must reproduce the above copyright
    	//      notice, this list of conditions and the following disclaimer in the
    	//      documentation and/or other materials provided with the distribution.
    	// 
    	//   3. Neither the name of this module nor the names of its contributors may
    	//      be used to endorse or promote products derived from this software
    	//      without specific prior written permission.
    	// 
    	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
    	// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
    	// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    	// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
    	// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
    	// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
    	// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
    	// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    	// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    	// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    	//
    	/**
    	 * All code is in an anonymous closure to keep the global namespace clean.
    	 *
    	 * @param {number=} overflow 
    	 * @param {number=} startdenom
    	 */

    	// Patched by Seb so that seedrandom.js does not pollute the Math object.
    	// My tests suggest that doing Math.trouble = 1 makes Math lookups about 5%
    	// slower.
    	numeric.seedrandom = { pow:Math.pow, random:Math.random };

    	(function (pool, math, width, chunks, significance, overflow, startdenom) {


    	//
    	// seedrandom()
    	// This is the seedrandom function described above.
    	//
    	math['seedrandom'] = function seedrandom(seed, use_entropy) {
    	  var key = [];
    	  var arc4;

    	  // Flatten the seed string or build one from local entropy if needed.
    	  seed = mixkey(flatten(
    	    use_entropy ? [seed, pool] :
    	    arguments.length ? seed :
    	    [new Date().getTime(), pool, window], 3), key);

    	  // Use the seed to initialize an ARC4 generator.
    	  arc4 = new ARC4(key);

    	  // Mix the randomness into accumulated entropy.
    	  mixkey(arc4.S, pool);

    	  // Override Math.random

    	  // This function returns a random double in [0, 1) that contains
    	  // randomness in every bit of the mantissa of the IEEE 754 value.

    	  math['random'] = function random() {  // Closure to return a random double:
    	    var n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    	    var d = startdenom;                 //   and denominator d = 2 ^ 48.
    	    var x = 0;                          //   and no 'extra last byte'.
    	    while (n < significance) {          // Fill up all significant digits by
    	      n = (n + x) * width;              //   shifting numerator and
    	      d *= width;                       //   denominator and generating a
    	      x = arc4.g(1);                    //   new least-significant-byte.
    	    }
    	    while (n >= overflow) {             // To avoid rounding up, before adding
    	      n /= 2;                           //   last byte, shift everything
    	      d /= 2;                           //   right using integer math until
    	      x >>>= 1;                         //   we have exactly the desired bits.
    	    }
    	    return (n + x) / d;                 // Form the number within [0, 1).
    	  };

    	  // Return the seed that was used
    	  return seed;
    	};

    	//
    	// ARC4
    	//
    	// An ARC4 implementation.  The constructor takes a key in the form of
    	// an array of at most (width) integers that should be 0 <= x < (width).
    	//
    	// The g(count) method returns a pseudorandom integer that concatenates
    	// the next (count) outputs from ARC4.  Its return value is a number x
    	// that is in the range 0 <= x < (width ^ count).
    	//
    	/** @constructor */
    	function ARC4(key) {
    	  var t, u, me = this, keylen = key.length;
    	  var i = 0, j = me.i = me.j = me.m = 0;
    	  me.S = [];
    	  me.c = [];

    	  // The empty key [] is treated as [0].
    	  if (!keylen) { key = [keylen++]; }

    	  // Set up S using the standard key scheduling algorithm.
    	  while (i < width) { me.S[i] = i++; }
    	  for (i = 0; i < width; i++) {
    	    t = me.S[i];
    	    j = lowbits(j + t + key[i % keylen]);
    	    u = me.S[j];
    	    me.S[i] = u;
    	    me.S[j] = t;
    	  }

    	  // The "g" method returns the next (count) outputs as one number.
    	  me.g = function getnext(count) {
    	    var s = me.S;
    	    var i = lowbits(me.i + 1); var t = s[i];
    	    var j = lowbits(me.j + t); var u = s[j];
    	    s[i] = u;
    	    s[j] = t;
    	    var r = s[lowbits(t + u)];
    	    while (--count) {
    	      i = lowbits(i + 1); t = s[i];
    	      j = lowbits(j + t); u = s[j];
    	      s[i] = u;
    	      s[j] = t;
    	      r = r * width + s[lowbits(t + u)];
    	    }
    	    me.i = i;
    	    me.j = j;
    	    return r;
    	  };
    	  // For robust unpredictability discard an initial batch of values.
    	  // See http://www.rsa.com/rsalabs/node.asp?id=2009
    	  me.g(width);
    	}

    	//
    	// flatten()
    	// Converts an object tree to nested arrays of strings.
    	//
    	/** @param {Object=} result 
    	  * @param {string=} prop
    	  * @param {string=} typ */
    	function flatten(obj, depth, result, prop, typ) {
    	  result = [];
    	  typ = typeof(obj);
    	  if (depth && typ == 'object') {
    	    for (prop in obj) {
    	      if (prop.indexOf('S') < 5) {    // Avoid FF3 bug (local/sessionStorage)
    	        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    	      }
    	    }
    	  }
    	  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
    	}

    	//
    	// mixkey()
    	// Mixes a string seed into a key that is an array of integers, and
    	// returns a shortened string seed that is equivalent to the result key.
    	//
    	/** @param {number=} smear 
    	  * @param {number=} j */
    	function mixkey(seed, key, smear, j) {
    	  seed += '';                         // Ensure the seed is a string
    	  smear = 0;
    	  for (j = 0; j < seed.length; j++) {
    	    key[lowbits(j)] =
    	      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
    	  }
    	  seed = '';
    	  for (j in key) { seed += String.fromCharCode(key[j]); }
    	  return seed;
    	}

    	//
    	// lowbits()
    	// A quick "n mod width" for width a power of 2.
    	//
    	function lowbits(n) { return n & (width - 1); }

    	//
    	// The following constants are related to IEEE 754 limits.
    	//
    	startdenom = math.pow(width, chunks);
    	significance = math.pow(2, significance);
    	overflow = significance * 2;

    	//
    	// When seedrandom.js is loaded, we immediately mix a few bits
    	// from the built-in RNG into the entropy pool.  Because we do
    	// not want to intefere with determinstic PRNG state later,
    	// seedrandom will not call math.random on its own again after
    	// initialization.
    	//
    	mixkey(math.random(), pool);

    	// End anonymous scope, and pass initial values.
    	}(
    	  [],   // pool: entropy pool starts empty
    	  numeric.seedrandom, // math: package containing random, pow, and seedrandom
    	  256,  // width: each RC4 output is 0 <= x < 256
    	  6,    // chunks: at least six RC4 outputs for each double
    	  52    // significance: there are 52 significant digits in a double
    	  ));
    	/* This file is a slightly modified version of quadprog.js from Alberto Santini.
    	 * It has been slightly modified by Sébastien Loisel to make sure that it handles
    	 * 0-based Arrays instead of 1-based Arrays.
    	 * License is in resources/LICENSE.quadprog */
    	(function(exports) {

    	function base0to1(A) {
    	    if(typeof A !== "object") { return A; }
    	    var ret = [], i,n=A.length;
    	    for(i=0;i<n;i++) ret[i+1] = base0to1(A[i]);
    	    return ret;
    	}
    	function base1to0(A) {
    	    if(typeof A !== "object") { return A; }
    	    var ret = [], i,n=A.length;
    	    for(i=1;i<n;i++) ret[i-1] = base1to0(A[i]);
    	    return ret;
    	}

    	function dpori(a, lda, n) {
    	    var i, j, k, kp1, t;

    	    for (k = 1; k <= n; k = k + 1) {
    	        a[k][k] = 1 / a[k][k];
    	        t = -a[k][k];
    	        //~ dscal(k - 1, t, a[1][k], 1);
    	        for (i = 1; i < k; i = i + 1) {
    	            a[i][k] = t * a[i][k];
    	        }

    	        kp1 = k + 1;
    	        if (n < kp1) {
    	            break;
    	        }
    	        for (j = kp1; j <= n; j = j + 1) {
    	            t = a[k][j];
    	            a[k][j] = 0;
    	            //~ daxpy(k, t, a[1][k], 1, a[1][j], 1);
    	            for (i = 1; i <= k; i = i + 1) {
    	                a[i][j] = a[i][j] + (t * a[i][k]);
    	            }
    	        }
    	    }

    	}

    	function dposl(a, lda, n, b) {
    	    var i, k, kb, t;

    	    for (k = 1; k <= n; k = k + 1) {
    	        //~ t = ddot(k - 1, a[1][k], 1, b[1], 1);
    	        t = 0;
    	        for (i = 1; i < k; i = i + 1) {
    	            t = t + (a[i][k] * b[i]);
    	        }

    	        b[k] = (b[k] - t) / a[k][k];
    	    }

    	    for (kb = 1; kb <= n; kb = kb + 1) {
    	        k = n + 1 - kb;
    	        b[k] = b[k] / a[k][k];
    	        t = -b[k];
    	        //~ daxpy(k - 1, t, a[1][k], 1, b[1], 1);
    	        for (i = 1; i < k; i = i + 1) {
    	            b[i] = b[i] + (t * a[i][k]);
    	        }
    	    }
    	}

    	function dpofa(a, lda, n, info) {
    	    var i, j, jm1, k, t, s;

    	    for (j = 1; j <= n; j = j + 1) {
    	        info[1] = j;
    	        s = 0;
    	        jm1 = j - 1;
    	        if (jm1 < 1) {
    	            s = a[j][j] - s;
    	            if (s <= 0) {
    	                break;
    	            }
    	            a[j][j] = Math.sqrt(s);
    	        } else {
    	            for (k = 1; k <= jm1; k = k + 1) {
    	                //~ t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
    	                t = a[k][j];
    	                for (i = 1; i < k; i = i + 1) {
    	                    t = t - (a[i][j] * a[i][k]);
    	                }
    	                t = t / a[k][k];
    	                a[k][j] = t;
    	                s = s + t * t;
    	            }
    	            s = a[j][j] - s;
    	            if (s <= 0) {
    	                break;
    	            }
    	            a[j][j] = Math.sqrt(s);
    	        }
    	        info[1] = 0;
    	    }
    	}

    	function qpgen2(dmat, dvec, fddmat, n, sol, crval, amat,
    	    bvec, fdamat, q, meq, iact, nact, iter, work, ierr) {

    	    var i, j, l, l1, info, it1, iwzv, iwrv, iwrm, iwsv, iwuv, nvl, r, iwnbv,
    	        temp, sum, t1, tt, gc, gs, nu,
    	        t1inf, t2min,
    	        vsmall, tmpa, tmpb,
    	        go;

    	    r = Math.min(n, q);
    	    l = 2 * n + (r * (r + 5)) / 2 + 2 * q + 1;

    	    vsmall = 1.0e-60;
    	    do {
    	        vsmall = vsmall + vsmall;
    	        tmpa = 1 + 0.1 * vsmall;
    	        tmpb = 1 + 0.2 * vsmall;
    	    } while (tmpa <= 1 || tmpb <= 1);

    	    for (i = 1; i <= n; i = i + 1) {
    	        work[i] = dvec[i];
    	    }
    	    for (i = n + 1; i <= l; i = i + 1) {
    	        work[i] = 0;
    	    }
    	    for (i = 1; i <= q; i = i + 1) {
    	        iact[i] = 0;
    	    }

    	    info = [];

    	    if (ierr[1] === 0) {
    	        dpofa(dmat, fddmat, n, info);
    	        if (info[1] !== 0) {
    	            ierr[1] = 2;
    	            return;
    	        }
    	        dposl(dmat, fddmat, n, dvec);
    	        dpori(dmat, fddmat, n);
    	    } else {
    	        for (j = 1; j <= n; j = j + 1) {
    	            sol[j] = 0;
    	            for (i = 1; i <= j; i = i + 1) {
    	                sol[j] = sol[j] + dmat[i][j] * dvec[i];
    	            }
    	        }
    	        for (j = 1; j <= n; j = j + 1) {
    	            dvec[j] = 0;
    	            for (i = j; i <= n; i = i + 1) {
    	                dvec[j] = dvec[j] + dmat[j][i] * sol[i];
    	            }
    	        }
    	    }

    	    crval[1] = 0;
    	    for (j = 1; j <= n; j = j + 1) {
    	        sol[j] = dvec[j];
    	        crval[1] = crval[1] + work[j] * sol[j];
    	        work[j] = 0;
    	        for (i = j + 1; i <= n; i = i + 1) {
    	            dmat[i][j] = 0;
    	        }
    	    }
    	    crval[1] = -crval[1] / 2;
    	    ierr[1] = 0;

    	    iwzv = n;
    	    iwrv = iwzv + n;
    	    iwuv = iwrv + r;
    	    iwrm = iwuv + r + 1;
    	    iwsv = iwrm + (r * (r + 1)) / 2;
    	    iwnbv = iwsv + q;

    	    for (i = 1; i <= q; i = i + 1) {
    	        sum = 0;
    	        for (j = 1; j <= n; j = j + 1) {
    	            sum = sum + amat[j][i] * amat[j][i];
    	        }
    	        work[iwnbv + i] = Math.sqrt(sum);
    	    }
    	    nact = 0;
    	    iter[1] = 0;
    	    iter[2] = 0;

    	    function fn_goto_50() {
    	        iter[1] = iter[1] + 1;

    	        l = iwsv;
    	        for (i = 1; i <= q; i = i + 1) {
    	            l = l + 1;
    	            sum = -bvec[i];
    	            for (j = 1; j <= n; j = j + 1) {
    	                sum = sum + amat[j][i] * sol[j];
    	            }
    	            if (Math.abs(sum) < vsmall) {
    	                sum = 0;
    	            }
    	            if (i > meq) {
    	                work[l] = sum;
    	            } else {
    	                work[l] = -Math.abs(sum);
    	                if (sum > 0) {
    	                    for (j = 1; j <= n; j = j + 1) {
    	                        amat[j][i] = -amat[j][i];
    	                    }
    	                    bvec[i] = -bvec[i];
    	                }
    	            }
    	        }

    	        for (i = 1; i <= nact; i = i + 1) {
    	            work[iwsv + iact[i]] = 0;
    	        }

    	        nvl = 0;
    	        temp = 0;
    	        for (i = 1; i <= q; i = i + 1) {
    	            if (work[iwsv + i] < temp * work[iwnbv + i]) {
    	                nvl = i;
    	                temp = work[iwsv + i] / work[iwnbv + i];
    	            }
    	        }
    	        if (nvl === 0) {
    	            return 999;
    	        }

    	        return 0;
    	    }

    	    function fn_goto_55() {
    	        for (i = 1; i <= n; i = i + 1) {
    	            sum = 0;
    	            for (j = 1; j <= n; j = j + 1) {
    	                sum = sum + dmat[j][i] * amat[j][nvl];
    	            }
    	            work[i] = sum;
    	        }

    	        l1 = iwzv;
    	        for (i = 1; i <= n; i = i + 1) {
    	            work[l1 + i] = 0;
    	        }
    	        for (j = nact + 1; j <= n; j = j + 1) {
    	            for (i = 1; i <= n; i = i + 1) {
    	                work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
    	            }
    	        }

    	        t1inf = true;
    	        for (i = nact; i >= 1; i = i - 1) {
    	            sum = work[i];
    	            l = iwrm + (i * (i + 3)) / 2;
    	            l1 = l - i;
    	            for (j = i + 1; j <= nact; j = j + 1) {
    	                sum = sum - work[l] * work[iwrv + j];
    	                l = l + j;
    	            }
    	            sum = sum / work[l1];
    	            work[iwrv + i] = sum;
    	            if (iact[i] < meq) {
    	                // continue;
    	                break;
    	            }
    	            if (sum < 0) {
    	                // continue;
    	                break;
    	            }
    	            t1inf = false;
    	            it1 = i;
    	        }

    	        if (!t1inf) {
    	            t1 = work[iwuv + it1] / work[iwrv + it1];
    	            for (i = 1; i <= nact; i = i + 1) {
    	                if (iact[i] < meq) {
    	                    // continue;
    	                    break;
    	                }
    	                if (work[iwrv + i] < 0) {
    	                    // continue;
    	                    break;
    	                }
    	                temp = work[iwuv + i] / work[iwrv + i];
    	                if (temp < t1) {
    	                    t1 = temp;
    	                    it1 = i;
    	                }
    	            }
    	        }

    	        sum = 0;
    	        for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
    	            sum = sum + work[i] * work[i];
    	        }
    	        if (Math.abs(sum) <= vsmall) {
    	            if (t1inf) {
    	                ierr[1] = 1;
    	                // GOTO 999
    	                return 999;
    	            } else {
    	                for (i = 1; i <= nact; i = i + 1) {
    	                    work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
    	                }
    	                work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
    	                // GOTO 700
    	                return 700;
    	            }
    	        } else {
    	            sum = 0;
    	            for (i = 1; i <= n; i = i + 1) {
    	                sum = sum + work[iwzv + i] * amat[i][nvl];
    	            }
    	            tt = -work[iwsv + nvl] / sum;
    	            t2min = true;
    	            if (!t1inf) {
    	                if (t1 < tt) {
    	                    tt = t1;
    	                    t2min = false;
    	                }
    	            }

    	            for (i = 1; i <= n; i = i + 1) {
    	                sol[i] = sol[i] + tt * work[iwzv + i];
    	                if (Math.abs(sol[i]) < vsmall) {
    	                    sol[i] = 0;
    	                }
    	            }

    	            crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);
    	            for (i = 1; i <= nact; i = i + 1) {
    	                work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
    	            }
    	            work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

    	            if (t2min) {
    	                nact = nact + 1;
    	                iact[nact] = nvl;

    	                l = iwrm + ((nact - 1) * nact) / 2 + 1;
    	                for (i = 1; i <= nact - 1; i = i + 1) {
    	                    work[l] = work[i];
    	                    l = l + 1;
    	                }

    	                if (nact === n) {
    	                    work[l] = work[n];
    	                } else {
    	                    for (i = n; i >= nact + 1; i = i - 1) {
    	                        if (work[i] === 0) {
    	                            // continue;
    	                            break;
    	                        }
    	                        gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
    	                        gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
    	                        if (work[i - 1] >= 0) {
    	                            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
    	                        } else {
    	                            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
    	                        }
    	                        gc = work[i - 1] / temp;
    	                        gs = work[i] / temp;

    	                        if (gc === 1) {
    	                            // continue;
    	                            break;
    	                        }
    	                        if (gc === 0) {
    	                            work[i - 1] = gs * temp;
    	                            for (j = 1; j <= n; j = j + 1) {
    	                                temp = dmat[j][i - 1];
    	                                dmat[j][i - 1] = dmat[j][i];
    	                                dmat[j][i] = temp;
    	                            }
    	                        } else {
    	                            work[i - 1] = temp;
    	                            nu = gs / (1 + gc);
    	                            for (j = 1; j <= n; j = j + 1) {
    	                                temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
    	                                dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
    	                                dmat[j][i - 1] = temp;

    	                            }
    	                        }
    	                    }
    	                    work[l] = work[nact];
    	                }
    	            } else {
    	                sum = -bvec[nvl];
    	                for (j = 1; j <= n; j = j + 1) {
    	                    sum = sum + sol[j] * amat[j][nvl];
    	                }
    	                if (nvl > meq) {
    	                    work[iwsv + nvl] = sum;
    	                } else {
    	                    work[iwsv + nvl] = -Math.abs(sum);
    	                    if (sum > 0) {
    	                        for (j = 1; j <= n; j = j + 1) {
    	                            amat[j][nvl] = -amat[j][nvl];
    	                        }
    	                        bvec[nvl] = -bvec[nvl];
    	                    }
    	                }
    	                // GOTO 700
    	                return 700;
    	            }
    	        }

    	        return 0;
    	    }

    	    function fn_goto_797() {
    	        l = iwrm + (it1 * (it1 + 1)) / 2 + 1;
    	        l1 = l + it1;
    	        if (work[l1] === 0) {
    	            // GOTO 798
    	            return 798;
    	        }
    	        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
    	        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
    	        if (work[l1 - 1] >= 0) {
    	            temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
    	        } else {
    	            temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
    	        }
    	        gc = work[l1 - 1] / temp;
    	        gs = work[l1] / temp;

    	        if (gc === 1) {
    	            // GOTO 798
    	            return 798;
    	        }
    	        if (gc === 0) {
    	            for (i = it1 + 1; i <= nact; i = i + 1) {
    	                temp = work[l1 - 1];
    	                work[l1 - 1] = work[l1];
    	                work[l1] = temp;
    	                l1 = l1 + i;
    	            }
    	            for (i = 1; i <= n; i = i + 1) {
    	                temp = dmat[i][it1];
    	                dmat[i][it1] = dmat[i][it1 + 1];
    	                dmat[i][it1 + 1] = temp;
    	            }
    	        } else {
    	            nu = gs / (1 + gc);
    	            for (i = it1 + 1; i <= nact; i = i + 1) {
    	                temp = gc * work[l1 - 1] + gs * work[l1];
    	                work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
    	                work[l1 - 1] = temp;
    	                l1 = l1 + i;
    	            }
    	            for (i = 1; i <= n; i = i + 1) {
    	                temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
    	                dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
    	                dmat[i][it1] = temp;
    	            }
    	        }

    	        return 0;
    	    }

    	    function fn_goto_798() {
    	        l1 = l - it1;
    	        for (i = 1; i <= it1; i = i + 1) {
    	            work[l1] = work[l];
    	            l = l + 1;
    	            l1 = l1 + 1;
    	        }

    	        work[iwuv + it1] = work[iwuv + it1 + 1];
    	        iact[it1] = iact[it1 + 1];
    	        it1 = it1 + 1;
    	        if (it1 < nact) {
    	            // GOTO 797
    	            return 797;
    	        }

    	        return 0;
    	    }

    	    function fn_goto_799() {
    	        work[iwuv + nact] = work[iwuv + nact + 1];
    	        work[iwuv + nact + 1] = 0;
    	        iact[nact] = 0;
    	        nact = nact - 1;
    	        iter[2] = iter[2] + 1;

    	        return 0;
    	    }

    	    go = 0;
    	    while (true) {
    	        go = fn_goto_50();
    	        if (go === 999) {
    	            return;
    	        }
    	        while (true) {
    	            go = fn_goto_55();
    	            if (go === 0) {
    	                break;
    	            }
    	            if (go === 999) {
    	                return;
    	            }
    	            if (go === 700) {
    	                if (it1 === nact) {
    	                    fn_goto_799();
    	                } else {
    	                    while (true) {
    	                        fn_goto_797();
    	                        go = fn_goto_798();
    	                        if (go !== 797) {
    	                            break;
    	                        }
    	                    }
    	                    fn_goto_799();
    	                }
    	            }
    	        }
    	    }

    	}

    	function solveQP(Dmat, dvec, Amat, bvec, meq, factorized) {
    	    Dmat = base0to1(Dmat);
    	    dvec = base0to1(dvec);
    	    Amat = base0to1(Amat);
    	    var i, n, q,
    	        nact, r,
    	        crval = [], iact = [], sol = [], work = [], iter = [],
    	        message;

    	    meq = meq || 0;
    	    factorized = factorized ? base0to1(factorized) : [undefined, 0];
    	    bvec = bvec ? base0to1(bvec) : [];

    	    // In Fortran the array index starts from 1
    	    n = Dmat.length - 1;
    	    q = Amat[1].length - 1;

    	    if (!bvec) {
    	        for (i = 1; i <= q; i = i + 1) {
    	            bvec[i] = 0;
    	        }
    	    }
    	    for (i = 1; i <= q; i = i + 1) {
    	        iact[i] = 0;
    	    }
    	    nact = 0;
    	    r = Math.min(n, q);
    	    for (i = 1; i <= n; i = i + 1) {
    	        sol[i] = 0;
    	    }
    	    crval[1] = 0;
    	    for (i = 1; i <= (2 * n + (r * (r + 5)) / 2 + 2 * q + 1); i = i + 1) {
    	        work[i] = 0;
    	    }
    	    for (i = 1; i <= 2; i = i + 1) {
    	        iter[i] = 0;
    	    }

    	    qpgen2(Dmat, dvec, n, n, sol, crval, Amat,
    	        bvec, n, q, meq, iact, nact, iter, work, factorized);

    	    message = "";
    	    if (factorized[1] === 1) {
    	        message = "constraints are inconsistent, no solution!";
    	    }
    	    if (factorized[1] === 2) {
    	        message = "matrix D in quadratic function is not positive definite!";
    	    }

    	    return {
    	        solution: base1to0(sol),
    	        value: base1to0(crval),
    	        unconstrained_solution: base1to0(dvec),
    	        iterations: base1to0(iter),
    	        iact: base1to0(iact),
    	        message: message
    	    };
    	}
    	exports.solveQP = solveQP;
    	}(numeric));
    	/*
    	Shanti Rao sent me this routine by private email. I had to modify it
    	slightly to work on Arrays instead of using a Matrix object.
    	It is apparently translated from http://stitchpanorama.sourceforge.net/Python/svd.py
    	*/

    	numeric.svd= function svd(A) {
    	    var temp;
    	//Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
    		var prec= numeric.epsilon; //Math.pow(2,-52) // assumes double prec
    		var tolerance= 1.e-64/prec;
    		var itmax= 50;
    		var c=0;
    		var i=0;
    		var j=0;
    		var k=0;
    		var l=0;
    		
    		var u= numeric.clone(A);
    		var m= u.length;
    		
    		var n= u[0].length;
    		
    		if (m < n) throw "Need more rows than columns"
    		
    		var e = new Array(n);
    		var q = new Array(n);
    		for (i=0; i<n; i++) e[i] = q[i] = 0.0;
    		var v = numeric.rep([n,n],0);
    	//	v.zero();
    		
    	 	function pythag(a,b)
    	 	{
    			a = Math.abs(a);
    			b = Math.abs(b);
    			if (a > b)
    				return a*Math.sqrt(1.0+(b*b/a/a))
    			else if (b == 0.0) 
    				return a
    			return b*Math.sqrt(1.0+(a*a/b/b))
    		}

    		//Householder's reduction to bidiagonal form

    		var f= 0.0;
    		var g= 0.0;
    		var h= 0.0;
    		var x= 0.0;
    		var y= 0.0;
    		var z= 0.0;
    		var s= 0.0;
    		
    		for (i=0; i < n; i++)
    		{	
    			e[i]= g;
    			s= 0.0;
    			l= i+1;
    			for (j=i; j < m; j++) 
    				s += (u[j][i]*u[j][i]);
    			if (s <= tolerance)
    				g= 0.0;
    			else
    			{	
    				f= u[i][i];
    				g= Math.sqrt(s);
    				if (f >= 0.0) g= -g;
    				h= f*g-s;
    				u[i][i]=f-g;
    				for (j=l; j < n; j++)
    				{
    					s= 0.0;
    					for (k=i; k < m; k++) 
    						s += u[k][i]*u[k][j];
    					f= s/h;
    					for (k=i; k < m; k++) 
    						u[k][j]+=f*u[k][i];
    				}
    			}
    			q[i]= g;
    			s= 0.0;
    			for (j=l; j < n; j++) 
    				s= s + u[i][j]*u[i][j];
    			if (s <= tolerance)
    				g= 0.0;
    			else
    			{	
    				f= u[i][i+1];
    				g= Math.sqrt(s);
    				if (f >= 0.0) g= -g;
    				h= f*g - s;
    				u[i][i+1] = f-g;
    				for (j=l; j < n; j++) e[j]= u[i][j]/h;
    				for (j=l; j < m; j++)
    				{	
    					s=0.0;
    					for (k=l; k < n; k++) 
    						s += (u[j][k]*u[i][k]);
    					for (k=l; k < n; k++) 
    						u[j][k]+=s*e[k];
    				}	
    			}
    			y= Math.abs(q[i])+Math.abs(e[i]);
    			if (y>x) 
    				x=y;
    		}
    		
    		// accumulation of right hand gtransformations
    		for (i=n-1; i != -1; i+= -1)
    		{	
    			if (g != 0.0)
    			{
    			 	h= g*u[i][i+1];
    				for (j=l; j < n; j++) 
    					v[j][i]=u[i][j]/h;
    				for (j=l; j < n; j++)
    				{	
    					s=0.0;
    					for (k=l; k < n; k++) 
    						s += u[i][k]*v[k][j];
    					for (k=l; k < n; k++) 
    						v[k][j]+=(s*v[k][i]);
    				}	
    			}
    			for (j=l; j < n; j++)
    			{
    				v[i][j] = 0;
    				v[j][i] = 0;
    			}
    			v[i][i] = 1;
    			g= e[i];
    			l= i;
    		}
    		
    		// accumulation of left hand transformations
    		for (i=n-1; i != -1; i+= -1)
    		{	
    			l= i+1;
    			g= q[i];
    			for (j=l; j < n; j++) 
    				u[i][j] = 0;
    			if (g != 0.0)
    			{
    				h= u[i][i]*g;
    				for (j=l; j < n; j++)
    				{
    					s=0.0;
    					for (k=l; k < m; k++) s += u[k][i]*u[k][j];
    					f= s/h;
    					for (k=i; k < m; k++) u[k][j]+=f*u[k][i];
    				}
    				for (j=i; j < m; j++) u[j][i] = u[j][i]/g;
    			}
    			else
    				for (j=i; j < m; j++) u[j][i] = 0;
    			u[i][i] += 1;
    		}
    		
    		// diagonalization of the bidiagonal form
    		prec= prec*x;
    		for (k=n-1; k != -1; k+= -1)
    		{
    			for (var iteration=0; iteration < itmax; iteration++)
    			{	// test f splitting
    				var test_convergence = false;
    				for (l=k; l != -1; l+= -1)
    				{	
    					if (Math.abs(e[l]) <= prec)
    					{	test_convergence= true;
    						break 
    					}
    					if (Math.abs(q[l-1]) <= prec)
    						break 
    				}
    				if (!test_convergence)
    				{	// cancellation of e[l] if l>0
    					c= 0.0;
    					s= 1.0;
    					var l1= l-1;
    					for (i =l; i<k+1; i++)
    					{	
    						f= s*e[i];
    						e[i]= c*e[i];
    						if (Math.abs(f) <= prec)
    							break
    						g= q[i];
    						h= pythag(f,g);
    						q[i]= h;
    						c= g/h;
    						s= -f/h;
    						for (j=0; j < m; j++)
    						{	
    							y= u[j][l1];
    							z= u[j][i];
    							u[j][l1] =  y*c+(z*s);
    							u[j][i] = -y*s+(z*c);
    						} 
    					}	
    				}
    				// test f convergence
    				z= q[k];
    				if (l== k)
    				{	//convergence
    					if (z<0.0)
    					{	//q[k] is made non-negative
    						q[k]= -z;
    						for (j=0; j < n; j++)
    							v[j][k] = -v[j][k];
    					}
    					break  //break out of iteration loop and move on to next k value
    				}
    				if (iteration >= itmax-1)
    					throw 'Error: no convergence.'
    				// shift from bottom 2x2 minor
    				x= q[l];
    				y= q[k-1];
    				g= e[k-1];
    				h= e[k];
    				f= ((y-z)*(y+z)+(g-h)*(g+h))/(2.0*h*y);
    				g= pythag(f,1.0);
    				if (f < 0.0)
    					f= ((x-z)*(x+z)+h*(y/(f-g)-h))/x;
    				else
    					f= ((x-z)*(x+z)+h*(y/(f+g)-h))/x;
    				// next QR transformation
    				c= 1.0;
    				s= 1.0;
    				for (i=l+1; i< k+1; i++)
    				{	
    					g= e[i];
    					y= q[i];
    					h= s*g;
    					g= c*g;
    					z= pythag(f,h);
    					e[i-1]= z;
    					c= f/z;
    					s= h/z;
    					f= x*c+g*s;
    					g= -x*s+g*c;
    					h= y*s;
    					y= y*c;
    					for (j=0; j < n; j++)
    					{	
    						x= v[j][i-1];
    						z= v[j][i];
    						v[j][i-1] = x*c+z*s;
    						v[j][i] = -x*s+z*c;
    					}
    					z= pythag(f,h);
    					q[i-1]= z;
    					c= f/z;
    					s= h/z;
    					f= c*g+s*y;
    					x= -s*g+c*y;
    					for (j=0; j < m; j++)
    					{
    						y= u[j][i-1];
    						z= u[j][i];
    						u[j][i-1] = y*c+z*s;
    						u[j][i] = -y*s+z*c;
    					}
    				}
    				e[l]= 0.0;
    				e[k]= f;
    				q[k]= x;
    			} 
    		}
    			
    		//vt= transpose(v)
    		//return (u,q,vt)
    		for (i=0;i<q.length; i++) 
    		  if (q[i] < prec) q[i] = 0;
    		  
    		//sort eigenvalues	
    		for (i=0; i< n; i++)
    		{	 
    		//writeln(q)
    		 for (j=i-1; j >= 0; j--)
    		 {
    		  if (q[j] < q[i])
    		  {
    		//  writeln(i,'-',j)
    		   c = q[j];
    		   q[j] = q[i];
    		   q[i] = c;
    		   for(k=0;k<u.length;k++) { temp = u[k][i]; u[k][i] = u[k][j]; u[k][j] = temp; }
    		   for(k=0;k<v.length;k++) { temp = v[k][i]; v[k][i] = v[k][j]; v[k][j] = temp; }
    	//	   u.swapCols(i,j)
    	//	   v.swapCols(i,j)
    		   i = j;	   
    		  }
    		 }	
    		}
    		
    		return {U:u,S:q,V:v}
    	};
    } (numeric1_2_6));

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
    console.log("Psychophysics Version 3.6.0");
    const info = {
        name: "psychophysics",
        description: "A plugin for conducting online/Web-based psychophysical experiments",
        parameters: {
            stimuli: {
                type: jspsych.ParameterType.COMPLEX,
                array: true,
                pretty_name: "Stimuli",
                description: "The objects will be presented in the canvas.",
                nested: {
                    startX: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "startX",
                        default: "center",
                        description: "The horizontal start position.",
                    },
                    startY: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "startY",
                        default: "center",
                        description: "The vertical start position.",
                    },
                    endX: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "endX",
                        default: null,
                        description: "The horizontal end position.",
                    },
                    endY: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "endY",
                        default: null,
                        description: "The vertical end position.",
                    },
                    show_start_time: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Show start time",
                        default: 0,
                        description: "Time to start presenting the stimuli",
                    },
                    show_end_time: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Show end time",
                        default: null,
                        description: "Time to end presenting the stimuli",
                    },
                    show_start_frame: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Show start frame",
                        default: 0,
                        description: "Time to start presenting the stimuli in frames",
                    },
                    show_end_frame: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Show end frame",
                        default: null,
                        description: "Time to end presenting the stimuli in frames",
                    },
                    line_width: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "Line width",
                        default: 1,
                        description: "The line width",
                    },
                    lineJoin: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "lineJoin",
                        default: "miter",
                        description: "The type of the corner when two lines meet.",
                    },
                    miterLimit: {
                        type: jspsych.ParameterType.INT,
                        pretty_name: "miterLimit",
                        default: 10,
                        description: "The maximum miter length.",
                    },
                    drawFunc: {
                        // e.g., call-function
                        type: jspsych.ParameterType.FUNCTION,
                        pretty_name: "Draw function",
                        default: null,
                        description: "This function enables to move objects horizontally and vertically.",
                    },
                    change_attr: {
                        type: jspsych.ParameterType.FUNCTION,
                        pretty_name: "Change attributes",
                        default: null,
                        description: "This function enables to change attributes of objects immediately before drawing.",
                    },
                    is_frame: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "time is in frames",
                        default: false,
                        description: "If true, time is treated in frames.",
                    },
                    prepared: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Stimulus prepared flag",
                        default: false,
                        description: "If true, the stimulus is prepared for presentation",
                    },
                    origin_center: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "origin_center",
                        default: false,
                        description: "The origin is the center of the window.",
                    },
                    is_presented: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "is_presented",
                        default: false,
                        description: "This will be true when the stimulus is presented.",
                    },
                    trial_ends_after_audio: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "Trial ends after audio",
                        default: false,
                        description: "If true, then the trial will end as soon as the audio file finishes playing.",
                    },
                    modulate_color: {
                        type: jspsych.ParameterType.FLOAT,
                        array: true,
                        pretty_name: "modulate_color",
                        default: [1.0, 1.0, 1.0, 1.0],
                        description: "The base RGBA array of the gabor patch.",
                    },
                    offset_color: {
                        type: jspsych.ParameterType.FLOAT,
                        array: true,
                        pretty_name: "offset_color",
                        default: [0.5, 0.5, 0.5, 0.0],
                        description: "The offset RGBA array of the gabor patch.",
                    },
                    min_validModulationRange: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "min_validModulationRange",
                        default: -2,
                        description: "The minimum of the validation range of the gabor patch.",
                    },
                    max_validModulationRange: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "max_validModulationRange",
                        default: 2,
                        description: "The maximum of the validation range of the gabor patch.",
                    },
                    tilt: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "tilt",
                        default: 0,
                        description: "The angle of the gabor patch in degrees.",
                    },
                    sf: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "spatial frequency",
                        default: 0.05,
                        description: "The spatial frequency of the gabor patch.",
                    },
                    phase: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "phase",
                        default: 0,
                        description: "The phase (degrees) of the gabor patch.",
                    },
                    sc: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "standard deviation",
                        default: 20,
                        description: "The standard deviation of the distribution.",
                    },
                    contrast: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "contrast",
                        default: 20,
                        description: "The contrast of the gabor patch.",
                    },
                    contrastPreMultiplicator: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "contrastPreMultiplicator",
                        default: 1,
                        description: "A scaling factor",
                    },
                    drift: {
                        type: jspsych.ParameterType.FLOAT,
                        pretty_name: "drift",
                        default: 0,
                        description: "The velocity of the drifting gabor patch.",
                    },
                    method: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "gabor_drawing_method",
                        default: "numeric",
                        description: "The method of drawing the gabor patch.",
                    },
                    disableNorm: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "disableNorm",
                        default: false,
                        description: "Disable normalization of the gaussian function.",
                    },
                    disableGauss: {
                        type: jspsych.ParameterType.BOOL,
                        pretty_name: "disableGauss",
                        default: false,
                        description: "Disable to convolve with a Gaussian.",
                    },
                    mask_func: {
                        type: jspsych.ParameterType.FUNCTION,
                        pretty_name: "Masking function",
                        default: null,
                        description: "Masking the image manually.",
                    },
                    text_color: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "text color",
                        default: "#000000",
                        description: "The color of the text.",
                    },
                    fontStyle: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "font style",
                        default: "normal",
                        description: "Font style",
                    },
                    fontWeight: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "font weight",
                        default: "normal",
                        description: "Font weight",
                    },
                    fontSize: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "font size",
                        default: "20px",
                        description: "Font size",
                    },
                    fontFamily: {
                        type: jspsych.ParameterType.STRING,
                        pretty_name: "font family",
                        default: "Verdana, Arial, Helvetica, sans-serif",
                        description: "Font family",
                    },
                },
            },
            pixi: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Enable Pixi",
                default: false,
                description: "If true, this plugin will use PixiJS",
            },
            remain_canvas: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Remain canvas",
                default: false,
                description: "If true, the main canvas remains for the next trial.",
            },
            choices: {
                type: jspsych.ParameterType.KEYS,
                array: true,
                pretty_name: "Choices",
                default: "ALL_KEYS",
                description: "The keys the subject is allowed to press to respond to the stimulus.",
            },
            prompt: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Prompt",
                default: null,
                description: "Any content here will be displayed below the stimulus.",
            },
            canvas_width: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Canvas width",
                default: null,
                description: "The width of the canvas.",
            },
            canvas_height: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Canvas height",
                default: null,
                description: "The height of the canvas.",
            },
            canvas_offsetX: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Canvas offset X",
                default: 0,
                description: "This value is subtracted from the width of the canvas.",
            },
            canvas_offsetY: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Canvas offset Y",
                default: 8,
                description: "This value is subtracted from the height of the canvas.",
            },
            trial_duration: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Trial duration",
                default: null,
                description: "How long to show trial before it ends.",
            },
            response_ends_trial: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "Response ends trial",
                default: true,
                description: "If true, trial will end when subject makes a response.",
            },
            background_color: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Background color",
                default: "grey",
                description: "The background color of the canvas.",
            },
            response_type: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "key, mouse or button",
                default: "key",
                description: "How to make a response.",
            },
            response_start_time: {
                type: jspsych.ParameterType.INT,
                pretty_name: "Response start",
                default: 0,
                description: "When the subject is allowed to respond to the stimulus.",
            },
            raf_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Step function",
                default: null,
                description: "This function enables to move objects as you wish.",
            },
            mouse_down_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Mouse down function",
                default: null,
                description: "This function is set to the event listener of the mousedown.",
            },
            mouse_move_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Mouse move function",
                default: null,
                description: "This function is set to the event listener of the mousemove.",
            },
            mouse_up_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Mouse up function",
                default: null,
                description: "This function is set to the event listener of the mouseup.",
            },
            key_down_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Key down function",
                default: null,
                description: "This function is set to the event listener of the keydown.",
            },
            key_up_func: {
                type: jspsych.ParameterType.FUNCTION,
                pretty_name: "Key up function",
                default: null,
                description: "This function is set to the event listener of the keyup.",
            },
            button_choices: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Button choices",
                // default: undefined,
                default: ["Next"],
                array: true,
                description: "The labels for the buttons.",
            },
            button_html: {
                type: jspsych.ParameterType.HTML_STRING,
                pretty_name: "Button HTML",
                default: '<button class="jspsych-btn">%choice%</button>',
                array: true,
                description: "The html of the button. Can create own style.",
            },
            vert_button_margin: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Margin vertical",
                default: "0px",
                description: "The vertical margin of the button.",
            },
            horiz_button_margin: {
                type: jspsych.ParameterType.STRING,
                pretty_name: "Margin horizontal",
                default: "8px",
                description: "The horizontal margin of the button.",
            },
            clear_canvas: {
                type: jspsych.ParameterType.BOOL,
                pretty_name: "clear_canvas",
                default: true,
                description: "Clear the canvas per frame.",
            },
        },
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
                return [...Array(count)].map((_, i) => i + start_num);
            }
            const canvas_for_color = document.createElement("canvas");
            canvas_for_color.id = "canvas_for_color";
            canvas_for_color.style.display = "none";
            const ctx_for_color = canvas_for_color.getContext("2d");
            // 'blue' -> 255
            function getColorNum(color_str) {
                ctx_for_color.fillStyle = color_str;
                const col = ctx_for_color.fillStyle;
                const col2 = col[1] + col[2] + col[3] + col[4] + col[5] + col[6] + col[7] + col[8];
                return parseInt(col2, 16);
            }
            trial.getColorNum = getColorNum;
            // Class for visual and audio stimuli
            class psychophysics_stimulus {
                constructor(stim) {
                    Object.assign(this, stim);
                    const keys = Object.keys(this);
                    for (var i = 0; i < keys.length; i++) {
                        if (typeof this[keys[i]] === "function") {
                            // オブジェクト内のfunctionはここで指定する必要がある。そうしないとここで即時に実行されて、その結果が関数名に代入される
                            if (keys[i] === "drawFunc")
                                continue;
                            if (keys[i] === "change_attr")
                                continue;
                            if (keys[i] === "mask_func")
                                continue;
                            this[keys[i]] = this[keys[i]].call();
                        }
                    }
                }
            }
            class visual_stimulus extends psychophysics_stimulus {
                constructor(stim) {
                    super(stim);
                    if (this.startX === "center") {
                        if (this.origin_center) {
                            this.startX = 0;
                        }
                        else {
                            this.startX = centerX;
                        }
                    }
                    if (this.startY === "center") {
                        if (this.origin_center) {
                            this.startY = 0;
                        }
                        else {
                            this.startY = centerY;
                        }
                    }
                    if (this.endX === "center") {
                        if (this.origin_center) {
                            this.endX = 0;
                        }
                        else {
                            this.endX = centerX;
                        }
                    }
                    if (this.endY === "center") {
                        if (this.origin_center) {
                            this.endY = 0;
                        }
                        else {
                            this.endY = centerY;
                        }
                    }
                    if (this.origin_center) {
                        this.startX = this.startX + centerX;
                        this.startY = this.startY + centerY;
                        if (this.endX !== null)
                            this.endX = this.endX + centerX;
                        if (this.endY !== null)
                            this.endY = this.endY + centerY;
                    }
                    if (typeof this.motion_start_time === "undefined")
                        this.motion_start_time = this.show_start_time; // Motion will start at the same time as it is displayed.
                    if (typeof this.motion_end_time === "undefined")
                        this.motion_end_time = null;
                    if (typeof this.motion_start_frame === "undefined")
                        this.motion_start_frame = this.show_start_frame; // Motion will start at the same frame as it is displayed.
                    if (typeof this.motion_end_frame === "undefined")
                        this.motion_end_frame = null;
                    if (trial.clear_canvas === false && this.show_end_time !== null)
                        alert("You can not specify the show_end_time with the clear_canvas property.");
                    // calculate the velocity (pix/sec) using the distance and the time.
                    // If the pix_sec is specified, the calc_pix_per_sec returns the intact pix_sec.
                    // If the pix_frame is specified, the calc_pix_per_sec returns an undefined.
                    this.horiz_pix_sec = this.calc_pix_per_sec("horiz");
                    this.vert_pix_sec = this.calc_pix_per_sec("vert");
                    // currentX/Y is changed per frame.
                    this.currentX = this.startX;
                    this.currentY = this.startY;
                }
                calc_pix_per_sec(direction) {
                    let pix_sec, pix_frame, startPos, endPos;
                    if (direction === "horiz") {
                        pix_sec = this.horiz_pix_sec;
                        pix_frame = this.horiz_pix_frame;
                        startPos = this.startX;
                        endPos = this.endX;
                    }
                    else {
                        pix_sec = this.vert_pix_sec;
                        pix_frame = this.vert_pix_frame;
                        startPos = this.startY;
                        endPos = this.endY;
                    }
                    const motion_start_time = this.motion_start_time;
                    const motion_end_time = this.motion_end_time;
                    if ((typeof pix_sec !== "undefined" ||
                        typeof pix_frame !== "undefined") &&
                        endPos !== null &&
                        motion_end_time !== null) {
                        alert("You can not specify the speed, location, and time at the same time.");
                        pix_sec = 0; // stop the motion
                    }
                    if (typeof pix_sec !== "undefined" || typeof pix_frame !== "undefined")
                        return pix_sec; // returns an 'undefined' when you specify the pix_frame.
                    // The velocity is not specified
                    if (endPos === null)
                        return 0; // This is not motion.
                    if (startPos === endPos)
                        return 0; // This is not motion.
                    // The distance is specified
                    if (motion_end_time === null) {
                        // Only the distance is known
                        alert("Please specify the motion_end_time or the velocity when you use the endX/Y property.");
                        return 0; // stop the motion
                    }
                    return ((endPos - startPos) /
                        (motion_end_time / 1000 - motion_start_time / 1000));
                }
                calc_current_position(direction, elapsed) {
                    let pix_frame, pix_sec, current_pos, start_pos, end_pos;
                    if (direction === "horiz") {
                        pix_frame = this.horiz_pix_frame;
                        pix_sec = this.horiz_pix_sec;
                        current_pos = this.currentX;
                        start_pos = this.startX;
                        end_pos = this.endX;
                    }
                    else {
                        pix_frame = this.vert_pix_frame;
                        pix_sec = this.vert_pix_sec;
                        current_pos = this.currentY;
                        start_pos = this.startY;
                        end_pos = this.endY;
                    }
                    const motion_start = this.is_frame
                        ? this.motion_start_frame
                        : this.motion_start_time;
                    const motion_end = this.is_frame
                        ? this.motion_end_frame
                        : this.motion_end_time;
                    if (elapsed < motion_start)
                        return current_pos;
                    if (motion_end !== null && elapsed >= motion_end)
                        return current_pos;
                    // Note that: You can not specify the speed, location, and time at the same time.
                    let ascending = true; // true = The object moves from left to right, or from up to down.
                    if (typeof pix_frame === "undefined") {
                        // In this case, pix_sec is defined.
                        if (pix_sec < 0)
                            ascending = false;
                    }
                    else {
                        if (pix_frame < 0)
                            ascending = false;
                    }
                    if (end_pos === null ||
                        (ascending && current_pos <= end_pos) ||
                        (!ascending && current_pos >= end_pos)) {
                        if (typeof pix_frame === "undefined") {
                            // In this case, pix_sec is defined.
                            return (start_pos +
                                Math.round((pix_sec * (elapsed - motion_start)) / 1000)); // This should be calculated in seconds.
                        }
                        else {
                            return current_pos + pix_frame;
                        }
                    }
                    else {
                        return current_pos;
                    }
                }
                update_position(elapsed) {
                    this.currentX = this.calc_current_position("horiz", elapsed);
                    this.currentY = this.calc_current_position("vert", elapsed);
                }
            }
            class image_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.file === "undefined") {
                        alert("You have to specify the file property.");
                        return;
                    }
                    this.img = new Image();
                    this.img.src = this.file;
                    this.img.onload = () => {
                        const tmpRatio = trial.pixi ? 1 : window.devicePixelRatio;
                        if (typeof this.mask === "undefined" &&
                            typeof this.filter === "undefined") {
                            if (trial.pixi) {
                                this.pixi_obj = PIXI__namespace.Sprite.from(this.file);
                                if (typeof this.pixi_mask !== "undefined") {
                                    this.pixi_obj.mask = this.pixi_mask;
                                }
                                if (typeof this.pixi_filters !== "undefined") {
                                    this.pixi_obj.filters = this.pixi_filters;
                                }
                                init_pixi_obj(this.pixi_obj);
                            }
                            this.prepared = true;
                            return;
                        }
                        // For masking and filtering, draw the image on another invisible canvas and get its pixel data using the getImageData function.
                        // Note that masking can only be applied to image files uploaded to a web server.
                        if (document.getElementById("invisible_canvas") === null) {
                            const canvas_element = document.createElement("canvas");
                            canvas_element.id = "invisible_canvas";
                            display_element.appendChild(canvas_element);
                            canvas_element.style.display = "none";
                        }
                        const invisible_canvas = document.getElementById("invisible_canvas");
                        const canvas_info = set_canvas(invisible_canvas, tmpRatio, this.img.width, this.img.height);
                        const invisible_ctx = canvas_info.ctx;
                        invisible_ctx.clearRect(0, 0, invisible_canvas.width, invisible_canvas.height);
                        if (typeof this.filter === "undefined") {
                            invisible_ctx.filter = "none";
                        }
                        else {
                            invisible_ctx.filter = this.filter;
                        }
                        invisible_ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
                        if (typeof this.mask === "undefined") {
                            // Filtering only
                            const invisible_img = invisible_ctx.getImageData(0, 0, this.img.width * tmpRatio, this.img.height * tmpRatio);
                            if (trial.pixi) {
                                const filtered_texture = PIXI__namespace.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height);
                                this.pixi_obj = new PIXI__namespace.Sprite(filtered_texture);
                                init_pixi_obj(this.pixi_obj);
                            }
                            else {
                                this.masking_img = invisible_img;
                            }
                            this.prepared = true;
                            return;
                        }
                        if (this.mask === "manual") {
                            if (this.mask_func === null) {
                                alert("You have to specify the mask_func when applying masking manually.");
                                return;
                            }
                            const manual_img = this.mask_func(invisible_canvas);
                            if (trial.pixi) {
                                const manual_texture = PIXI__namespace.Texture.fromBuffer(manual_img.data, manual_img.width, manual_img.height);
                                this.pixi_obj = new PIXI__namespace.Sprite(manual_texture);
                                init_pixi_obj(this.pixi_obj);
                            }
                            else {
                                this.masking_img = manual_img;
                            }
                            this.prepared = true;
                            return;
                        }
                        if (this.mask === "gauss") {
                            if (typeof this.width === "undefined") {
                                alert("You have to specify the width property for the gaussian mask. For example, 200.");
                                return;
                            }
                            const gauss_width = this.width * tmpRatio;
                            // Getting only the areas to be filtered, not the whole image.
                            const invisible_img = invisible_ctx.getImageData((this.img.width * tmpRatio) / 2 - gauss_width / 2, (this.img.height * tmpRatio) / 2 - gauss_width / 2, gauss_width, gauss_width);
                            let coord_array = getNumbering(Math.round(0 - gauss_width / 2), gauss_width);
                            let coord_matrix_x = [];
                            for (let i = 0; i < gauss_width; i++) {
                                coord_matrix_x.push(coord_array);
                            }
                            coord_array = getNumbering(Math.round(0 - gauss_width / 2), gauss_width);
                            let coord_matrix_y = [];
                            for (let i = 0; i < gauss_width; i++) {
                                coord_matrix_y.push(coord_array);
                            }
                            let exp_value;
                            const adjusted_sc = this.sc * tmpRatio;
                            if (this.method === "math") {
                                alert("The math method is not supported. Please consider using the numeric or ml-matrix method instead.");
                            }
                            if (this.method === "ml-matrix") {
                                const matrix_x = new Matrix(coord_matrix_x);
                                const matrix_y = new Matrix(coord_matrix_y).transpose();
                                const x_factor = Matrix.pow(matrix_x, 2).mul(-1);
                                const y_factor = Matrix.pow(matrix_y, 2).mul(-1);
                                const varScale = 2 * Math.pow(adjusted_sc, 2);
                                exp_value = Matrix.add(Matrix.divide(x_factor, varScale), Matrix.divide(y_factor, varScale))
                                    .exp()
                                    .to2DArray();
                            }
                            else {
                                // numeric
                                const matrix_x = coord_matrix_x;
                                const matrix_y = numeric1_2_6.transpose(coord_matrix_y);
                                const x_factor = numeric1_2_6.mul(numeric1_2_6.pow(matrix_x, 2), -1);
                                const y_factor = numeric1_2_6.mul(numeric1_2_6.pow(matrix_y, 2), -1);
                                // @ts-expect-error `numeric.pow` seems to return a vector here which is treated as a number?
                                const varScale = 2 * numeric1_2_6.pow([adjusted_sc], 2);
                                const tmp = numeric1_2_6.add(numeric1_2_6.div(x_factor, varScale), numeric1_2_6.div(y_factor, varScale));
                                exp_value = numeric1_2_6.exp(tmp);
                            }
                            let cnt = 3;
                            for (let i = 0; i < gauss_width; i++) {
                                for (let j = 0; j < gauss_width; j++) {
                                    invisible_img.data[cnt] = exp_value[i][j] * 255; // 透明度を変更
                                    cnt = cnt + 4;
                                }
                            }
                            if (trial.pixi) {
                                const gauss_texture = PIXI__namespace.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height);
                                this.pixi_obj = new PIXI__namespace.Sprite(gauss_texture);
                                init_pixi_obj(this.pixi_obj);
                            }
                            else {
                                this.masking_img = invisible_img;
                            }
                            this.prepared = true;
                            return;
                        }
                        if (this.mask === "circle" || this.mask === "rect") {
                            if (typeof this.width === "undefined") {
                                alert("You have to specify the width property for the circle/rect mask.");
                                return;
                            }
                            if (typeof this.height === "undefined") {
                                alert("You have to specify the height property for the circle/rect mask.");
                                return;
                            }
                            if (typeof this.center_x === "undefined") {
                                alert("You have to specify the center_x property for the circle/rect mask.");
                                return;
                            }
                            if (typeof this.center_y === "undefined") {
                                alert("You have to specify the center_y property for the circle/rect mask.");
                                return;
                            }
                            const oval_width = this.width * tmpRatio;
                            const oval_height = this.height * tmpRatio;
                            // Note that the center of a circle or rectangle does not necessarily coincide with the center of the image.
                            const oval_cx = this.center_x * tmpRatio;
                            const oval_cy = this.center_y * tmpRatio;
                            // Getting only the areas to be filtered, not the whole image.
                            const invisible_img = invisible_ctx.getImageData(oval_cx - oval_width / 2, oval_cy - oval_height / 2, oval_width, oval_height);
                            const cx = invisible_img.width / 2;
                            const cy = invisible_img.height / 2;
                            // When this.mask === 'rect', the alpha (transparency) value does not chage at all.
                            if (this.mask === "circle") {
                                let cnt = 3;
                                for (let j = 0; j < oval_height; j++) {
                                    for (let i = 0; i < oval_width; i++) {
                                        const tmp = Math.pow(i - cx, 2) / Math.pow(cx, 2) +
                                            Math.pow(j - cy, 2) / Math.pow(cy, 2);
                                        if (tmp > 1) {
                                            invisible_img.data[cnt] = 0; // invisible
                                        }
                                        cnt = cnt + 4;
                                    }
                                }
                            }
                            if (trial.pixi) {
                                const cropped_texture = PIXI__namespace.Texture.fromBuffer(invisible_img.data, invisible_img.width, invisible_img.height);
                                this.pixi_obj = new PIXI__namespace.Sprite(cropped_texture);
                                init_pixi_obj(this.pixi_obj);
                            }
                            else {
                                this.masking_img = invisible_img;
                            }
                            this.prepared = true;
                            return;
                        }
                    };
                }
                show() {
                    if (trial.pixi) {
                        if (typeof this.scale !== "undefined" &&
                            typeof this.image_width !== "undefined") {
                            alert("You can not specify the scale and image_width at the same time.");
                        }
                        if (typeof this.scale !== "undefined" &&
                            typeof this.image_height !== "undefined") {
                            alert("You can not specify the scale and image_height at the same time.");
                        }
                        if (typeof this.image_height !== "undefined" &&
                            typeof this.image_width !== "undefined") {
                            alert("You can not specify the image_height and image_width at the same time.");
                        }
                        let scale = 1;
                        if (typeof this.scale !== "undefined") {
                            scale = this.scale;
                        }
                        if (typeof this.image_width !== "undefined") {
                            scale = this.image_width / this.img.width;
                        }
                        if (typeof this.image_height !== "undefined") {
                            scale = this.image_height / this.img.height;
                        }
                        this.pixi_obj.scale.x = scale;
                        this.pixi_obj.scale.y = scale;
                        if (typeof this.pixi_angle !== "undefined") {
                            this.pixi_obj.angle = this.pixi_angle;
                        }
                        if (typeof this.pixi_rotation !== "undefined") {
                            this.pixi_obj.rotation = this.pixi_rotation;
                        }
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (this.mask || this.filter) {
                            // Note that filtering is done to the invisible_ctx.
                            ctx.putImageData(this.masking_img, this.currentX * window.devicePixelRatio -
                                this.masking_img.width / 2, this.currentY * window.devicePixelRatio -
                                this.masking_img.height / 2);
                        }
                        else {
                            if (typeof this.scale !== "undefined" &&
                                typeof this.image_width !== "undefined")
                                alert("You can not specify the scale and image_width at the same time.");
                            if (typeof this.scale !== "undefined" &&
                                typeof this.image_height !== "undefined")
                                alert("You can not specify the scale and image_height at the same time.");
                            if (typeof this.image_height !== "undefined" &&
                                typeof this.image_width !== "undefined")
                                alert("You can not specify the image_height and image_width at the same time.");
                            let scale = 1;
                            if (typeof this.scale !== "undefined")
                                scale = this.scale;
                            if (typeof this.image_width !== "undefined")
                                scale = this.image_width / this.img.width;
                            if (typeof this.image_height !== "undefined")
                                scale = this.image_height / this.img.height;
                            const tmpW = this.img.width * scale;
                            const tmpH = this.img.height * scale;
                            ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, this.currentX - tmpW / 2, this.currentY - tmpH / 2, tmpW, tmpH);
                        }
                    }
                }
            }
            class gabor_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (!trial.pixi) {
                        this.update_count = 0;
                        this.prepared = true;
                        return;
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

          }`;
                    // const gabor_width = this.width * window.devicePixelRatio; // No need to consider the devicePixelRatio property.
                    const gabor_width = this.width;
                    // create a null image element
                    const img_element = document.createElement("img");
                    img_element.width = gabor_width;
                    img_element.height = gabor_width;
                    const gabor_sprite = PIXI__namespace.Sprite.from(img_element);
                    gabor_sprite.visible = false;
                    // center the sprite's anchor point
                    gabor_sprite.anchor.set(0.5);
                    gabor_sprite.x = pixi_app.screen.width / 2;
                    gabor_sprite.y = pixi_app.screen.height / 2;
                    const uniforms = {
                        Contrast: this.contrast,
                        Phase: this.phase,
                        angle_in_degrees: 90 + this.tilt,
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
                    };
                    const myFilter = new PIXI__namespace.Filter(null, fragmentSrc, uniforms);
                    pixi_app.stage.addChild(gabor_sprite);
                    gabor_sprite.filters = [myFilter];
                    this.pixi_obj = gabor_sprite;
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.filters[0].uniforms.Phase += this.drift;
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.filters[0].uniforms.centerX = this.currentX;
                        this.pixi_obj.filters[0].uniforms.centerY =
                            pixi_app.screen.height - this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        ctx.putImageData(this.img_data, this.currentX * window.devicePixelRatio - this.img_data.width / 2, this.currentY * window.devicePixelRatio - this.img_data.height / 2);
                    }
                }
                update_position(elapsed) {
                    this.currentX = this.calc_current_position("horiz", elapsed);
                    this.currentY = this.calc_current_position("vert", elapsed);
                    if (trial.pixi)
                        return;
                    if (typeof this.img_data !== "undefined" && this.drift === 0)
                        return;
                    let gabor_data;
                    // console.log(this.method)
                    // The following calculation method is based on Psychtoolbox (MATLAB),
                    // although it doesn't use procedural texture mapping.
                    // I also have referenced the gaborgen-js code: https://github.com/jtth/gaborgen-js
                    // You can choose either the numeric.js or the math.js as the method for drawing gabor patches.
                    // The numeric.js is considerably faster than the math.js, but the latter is being developed more aggressively than the former.
                    // Note that "Math" and "math" are not the same.
                    const gabor_width = this.width * window.devicePixelRatio;
                    let coord_array = getNumbering(Math.round(0 - gabor_width / 2), gabor_width);
                    let coord_matrix_x = [];
                    for (let i = 0; i < gabor_width; i++) {
                        coord_matrix_x.push(coord_array);
                    }
                    coord_array = getNumbering(Math.round(0 - gabor_width / 2), gabor_width);
                    let coord_matrix_y = [];
                    for (let i = 0; i < gabor_width; i++) {
                        coord_matrix_y.push(coord_array);
                    }
                    const tilt_rad = deg2rad(90 - this.tilt);
                    // These values are scalars.
                    const a = ((Math.cos(tilt_rad) * this.sf) / window.devicePixelRatio) *
                        (2 * Math.PI); // radians
                    const b = ((Math.sin(tilt_rad) * this.sf) / window.devicePixelRatio) *
                        (2 * Math.PI);
                    const adjusted_sc = this.sc * window.devicePixelRatio;
                    let multConst = 1 / (Math.sqrt(2 * Math.PI) * adjusted_sc);
                    if (this.disableNorm)
                        multConst = 1;
                    // const phase_rad = deg2rad(this.phase)
                    const phase_rad = deg2rad(this.phase + this.drift * this.update_count);
                    this.update_count += 1;
                    if (this.method === "math") {
                        alert("The math method is not supported. Please consider using the numeric or ml-matrix method instead.");
                    }
                    if (this.method === "ml-matrix") {
                        const matrix_x = new Matrix(coord_matrix_x);
                        const matrix_y = new Matrix(coord_matrix_y).transpose();
                        const x_factor = Matrix.pow(matrix_x, 2).mul(-1);
                        const y_factor = Matrix.pow(matrix_y, 2).mul(-1);
                        const sinWave = Matrix.add(Matrix.multiply(matrix_x, a), Matrix.multiply(matrix_y, b))
                            .add(phase_rad)
                            .sin(); // radians
                        const varScale = 2 * Math.pow(adjusted_sc, 2);
                        const exp_value = this.disableGauss
                            ? 1
                            : Matrix.add(Matrix.divide(x_factor, varScale), Matrix.divide(y_factor, varScale)).exp();
                        const tmp1 = Matrix.multiply(sinWave, exp_value);
                        const tmp2 = Matrix.multiply(tmp1, multConst);
                        const tmp3 = Matrix.multiply(Matrix.multiply(tmp2, this.contrastPreMultiplicator), this.contrast);
                        const m = Matrix.multiply(Matrix.add(tmp3, 0.5), 256);
                        gabor_data = m.to2DArray();
                    }
                    else {
                        // numeric
                        const matrix_x = coord_matrix_x;
                        const matrix_y = numeric1_2_6.transpose(coord_matrix_y);
                        const x_factor = numeric1_2_6.mul(numeric1_2_6.pow(matrix_x, 2), -1);
                        const y_factor = numeric1_2_6.mul(numeric1_2_6.pow(matrix_y, 2), -1);
                        const tmp1 = numeric1_2_6.add(numeric1_2_6.mul(matrix_x, a), numeric1_2_6.mul(matrix_y, b), 
                        // @ts-expect-eror This doesn't seem to be considered by `numeric.add`
                        phase_rad); // radians
                        const sinWave = numeric1_2_6.sin(tmp1);
                        // @ts-expect-error `numeric.pow` seems to return a vector here which is treated as a number?
                        const varScale = 2 * numeric1_2_6.pow([adjusted_sc], 2);
                        const tmp2 = numeric1_2_6.add(numeric1_2_6.div(x_factor, varScale), numeric1_2_6.div(y_factor, varScale));
                        const exp_value = this.disableGauss ? 1 : numeric1_2_6.exp(tmp2);
                        const tmp3 = numeric1_2_6.mul(exp_value, sinWave);
                        const tmp4 = numeric1_2_6.mul(multConst, tmp3);
                        const tmp5 = numeric1_2_6.mul(this.contrast, numeric1_2_6.mul(tmp4, this.contrastPreMultiplicator));
                        const m = numeric1_2_6.mul(256, numeric1_2_6.add(0.5, tmp5));
                        gabor_data = m;
                    }
                    // console.log(gabor_data)
                    const imageData = ctx.createImageData(gabor_width, gabor_width);
                    let cnt = 0;
                    // Iterate through every pixel
                    for (let i = 0; i < gabor_width; i++) {
                        for (let j = 0; j < gabor_width; j++) {
                            // Modify pixel data
                            imageData.data[cnt] = Math.round(gabor_data[i][j]); // R value
                            cnt++;
                            imageData.data[cnt] = Math.round(gabor_data[i][j]); // G
                            cnt++;
                            imageData.data[cnt] = Math.round(gabor_data[i][j]); // B
                            cnt++;
                            imageData.data[cnt] = 255; // alpha
                            cnt++;
                        }
                    }
                    this.img_data = imageData;
                }
            }
            class line_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.angle === "undefined") {
                        if (typeof this.x1 === "undefined" ||
                            typeof this.x2 === "undefined" ||
                            typeof this.y1 === "undefined" ||
                            typeof this.y2 === "undefined") {
                            alert("You have to specify the angle of lines, or the start (x1, y1) and end (x2, y2) coordinates.");
                            return;
                        }
                        // The start (x1, y1) and end (x2, y2) coordinates are defined.
                        // For motion, startX/Y must be calculated.
                        this.startX = (this.x1 + this.x2) / 2;
                        this.startY = (this.y1 + this.y2) / 2;
                        if (this.origin_center) {
                            this.startX = this.startX + centerX;
                            this.startY = this.startY + centerY;
                        }
                        this.currentX = this.startX;
                        this.currentY = this.startY;
                        this.angle =
                            Math.atan((this.y2 - this.y1) / (this.x2 - this.x1)) *
                                (180 / Math.PI);
                        this.line_length = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2));
                    }
                    else {
                        if (typeof this.x1 !== "undefined" ||
                            typeof this.x2 !== "undefined" ||
                            typeof this.y1 !== "undefined" ||
                            typeof this.y2 !== "undefined")
                            alert("You can not specify the angle and positions of the line at the same time.");
                        if (typeof this.line_length === "undefined")
                            alert("You have to specify the line_length property.");
                    }
                    if (typeof this.line_color === "undefined")
                        this.line_color = "black";
                    if (trial.pixi) {
                        this.pixi_obj = new PIXI__namespace.Graphics();
                        this.pixi_obj.lineStyle({
                            width: this.line_width,
                            color: getColorNum(this.line_color),
                            join: this.lineJoin,
                            miterLimit: this.miterLimit,
                        });
                        const theta = deg2rad(this.angle);
                        const x1 = (-this.line_length / 2) * Math.cos(theta);
                        const y1 = (-this.line_length / 2) * Math.sin(theta);
                        const x2 = (this.line_length / 2) * Math.cos(theta);
                        const y2 = (this.line_length / 2) * Math.sin(theta);
                        this.pixi_obj.moveTo(x1, y1);
                        this.pixi_obj.lineTo(x2, y2);
                        this.pixi_obj.visible = false;
                        pixi_app.stage.addChild(this.pixi_obj);
                    }
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (typeof this.filter === "undefined") {
                            ctx.filter = "none";
                        }
                        else {
                            ctx.filter = this.filter;
                        }
                        // common
                        ctx.beginPath();
                        ctx.lineWidth = this.line_width;
                        ctx.lineJoin = this.lineJoin;
                        ctx.miterLimit = this.miterLimit;
                        //
                        const theta = deg2rad(this.angle);
                        const x1 = this.currentX - (this.line_length / 2) * Math.cos(theta);
                        const y1 = this.currentY - (this.line_length / 2) * Math.sin(theta);
                        const x2 = this.currentX + (this.line_length / 2) * Math.cos(theta);
                        const y2 = this.currentY + (this.line_length / 2) * Math.sin(theta);
                        ctx.strokeStyle = this.line_color;
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                }
            }
            class rect_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.width === "undefined")
                        alert("You have to specify the width of the rectangle.");
                    if (typeof this.height === "undefined")
                        alert("You have to specify the height of the rectangle.");
                    if (typeof this.line_color === "undefined" &&
                        typeof this.fill_color === "undefined")
                        alert("You have to specify the either of the line_color or fill_color property.");
                    if (trial.pixi) {
                        this.pixi_obj = new PIXI__namespace.Graphics();
                        this.pixi_obj.lineStyle({
                            width: this.line_width,
                            color: getColorNum(this.line_color),
                            join: this.lineJoin,
                            miterLimit: this.miterLimit,
                        });
                        if (typeof this.fill_color !== "undefined")
                            this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
                        this.pixi_obj.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
                        if (typeof this.fill_color !== "undefined")
                            this.pixi_obj.endFill();
                        this.pixi_obj.visible = false;
                        pixi_app.stage.addChild(this.pixi_obj);
                    }
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (typeof this.filter === "undefined") {
                            ctx.filter = "none";
                        }
                        else {
                            ctx.filter = this.filter;
                        }
                        // common
                        // ctx.beginPath();
                        ctx.lineWidth = this.line_width;
                        ctx.lineJoin = this.lineJoin;
                        ctx.miterLimit = this.miterLimit;
                        //
                        // First, draw a filled rectangle, then an edge.
                        if (typeof this.fill_color !== "undefined") {
                            ctx.fillStyle = this.fill_color;
                            ctx.fillRect(this.currentX - this.width / 2, this.currentY - this.height / 2, this.width, this.height);
                        }
                        if (typeof this.line_color !== "undefined") {
                            ctx.strokeStyle = this.line_color;
                            ctx.strokeRect(this.currentX - this.width / 2, this.currentY - this.height / 2, this.width, this.height);
                        }
                    }
                }
            }
            class cross_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.line_length === "undefined")
                        alert("You have to specify the line_length of the fixation cross.");
                    if (typeof this.line_color === "undefined")
                        this.line_color = "#000000";
                    if (trial.pixi) {
                        this.pixi_obj = new PIXI__namespace.Graphics();
                        this.pixi_obj.lineStyle({
                            width: this.line_width,
                            color: getColorNum(this.line_color),
                            join: this.lineJoin,
                            miterLimit: this.miterLimit,
                        });
                        const x1 = -this.line_length / 2;
                        const y1 = 0;
                        const x2 = this.line_length / 2;
                        const y2 = 0;
                        this.pixi_obj.moveTo(x1, y1);
                        this.pixi_obj.lineTo(x2, y2);
                        const x3 = 0;
                        const y3 = -this.line_length / 2;
                        const x4 = 0;
                        const y4 = this.line_length / 2;
                        this.pixi_obj.moveTo(x3, y3);
                        this.pixi_obj.lineTo(x4, y4);
                        this.pixi_obj.visible = false;
                        pixi_app.stage.addChild(this.pixi_obj);
                    }
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (typeof this.filter === "undefined") {
                            ctx.filter = "none";
                        }
                        else {
                            ctx.filter = this.filter;
                        }
                        // common
                        ctx.beginPath();
                        ctx.lineWidth = this.line_width;
                        ctx.lineJoin = this.lineJoin;
                        ctx.miterLimit = this.miterLimit;
                        //
                        ctx.strokeStyle = this.line_color;
                        const x1 = this.currentX;
                        const y1 = this.currentY - this.line_length / 2;
                        const x2 = this.currentX;
                        const y2 = this.currentY + this.line_length / 2;
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        const x3 = this.currentX - this.line_length / 2;
                        const y3 = this.currentY;
                        const x4 = this.currentX + this.line_length / 2;
                        const y4 = this.currentY;
                        ctx.moveTo(x3, y3);
                        ctx.lineTo(x4, y4);
                        // ctx.closePath();
                        ctx.stroke();
                    }
                }
            }
            class circle_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.radius === "undefined")
                        alert("You have to specify the radius of circles.");
                    if (typeof this.line_color === "undefined" &&
                        typeof this.fill_color === "undefined")
                        alert("You have to specify the either of line_color or fill_color.");
                    if (!trial.pixi) {
                        this.prepared = true;
                        return;
                    }
                    this.pixi_obj = new PIXI__namespace.Graphics();
                    // this.pixi_obj.cacheAsBitmap = true;
                    this.pixi_obj.lineStyle({
                        width: this.line_width,
                        color: getColorNum(this.line_color),
                        join: this.lineJoin,
                        miterLimit: this.miterLimit,
                    });
                    if (typeof this.fill_color !== "undefined")
                        this.pixi_obj.beginFill(getColorNum(this.fill_color), 1);
                    this.pixi_obj.drawCircle(0, 0, this.radius);
                    if (typeof this.fill_color !== "undefined")
                        this.pixi_obj.endFill();
                    this.pixi_obj.visible = false;
                    pixi_app.stage.addChild(this.pixi_obj);
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (typeof this.filter === "undefined") {
                            ctx.filter = "none";
                        }
                        else {
                            ctx.filter = this.filter;
                        }
                        // common
                        ctx.beginPath();
                        ctx.lineWidth = this.line_width;
                        ctx.lineJoin = this.lineJoin;
                        ctx.miterLimit = this.miterLimit;
                        //
                        if (typeof this.fill_color !== "undefined") {
                            ctx.fillStyle = this.fill_color;
                            ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2, false);
                            ctx.fill();
                        }
                        if (typeof this.line_color !== "undefined") {
                            ctx.strokeStyle = this.line_color;
                            ctx.arc(this.currentX, this.currentY, this.radius, 0, Math.PI * 2, false);
                            ctx.stroke();
                        }
                    }
                }
            }
            class text_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.content === "undefined")
                        alert("You have to specify the content of texts.");
                    if (trial.pixi) {
                        if (typeof this.text_space !== "undefined")
                            alert(`You can't specify the text_space in Pixi mode.`);
                        this.pixi_obj = new PIXI__namespace.Text(this.content);
                        init_pixi_obj(this.pixi_obj);
                        this.pixi_obj.style.align = "center";
                        this.pixi_obj.style.fontFamily = this.fontFamily;
                        this.pixi_obj.style.fontSize = this.fontSize;
                        this.pixi_obj.style.fontStyle = this.fontStyle;
                        this.pixi_obj.style.fontWeight = this.fontWeight;
                        this.pixi_obj.style.fill = this.text_color;
                        this.pixi_obj.style.lineJoin = this.lineJoin;
                        this.pixi_obj.style.miterLimit = this.miterLimit;
                    }
                    else {
                        if (typeof this.text_space === "undefined")
                            this.text_space = 20;
                        let font_info = "";
                        // Note the order specified.
                        font_info = font_info + " " + this.fontStyle;
                        font_info = font_info + " " + this.fontWeight;
                        font_info = font_info + " " + this.fontSize;
                        font_info = font_info + " " + this.fontFamily;
                        if (typeof this.font === "undefined")
                            this.font = font_info;
                    }
                    this.prepared = true;
                }
                show() {
                    if (trial.pixi) {
                        this.pixi_obj.x = this.currentX;
                        this.pixi_obj.y = this.currentY;
                        this.pixi_obj.visible = true;
                    }
                    else {
                        if (typeof this.filter === "undefined") {
                            ctx.filter = "none";
                        }
                        else {
                            ctx.filter = this.filter;
                        }
                        // common
                        // ctx.beginPath();
                        ctx.lineWidth = this.line_width;
                        ctx.lineJoin = this.lineJoin;
                        ctx.miterLimit = this.miterLimit;
                        ctx.font = this.font;
                        ctx.fillStyle = this.text_color;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        let column = [""];
                        let line = 0;
                        for (let i = 0; i < this.content.length; i++) {
                            let char = this.content.charAt(i);
                            if (char == "\n") {
                                line++;
                                column[line] = "";
                            }
                            else {
                                column[line] += char;
                            }
                        }
                        for (let i = 0; i < column.length; i++) {
                            ctx.fillText(column[i], this.currentX, this.currentY -
                                (this.text_space * (column.length - 1)) / 2 +
                                this.text_space * i);
                        }
                    }
                }
            }
            class manual_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    this.prepared = true;
                }
                show() { }
            }
            class pixi_stimulus extends visual_stimulus {
                constructor(stim) {
                    super(stim);
                    if (!trial.pixi) {
                        alert("To use Pixi objects, the pixi property of the psychophysics plugin must be set to true.");
                        return;
                    }
                    this.pixi_obj.visible = false;
                    pixi_app.stage.addChild(this.pixi_obj);
                    this.prepared = true;
                }
                show() {
                    this.pixi_obj.x = this.currentX;
                    this.pixi_obj.y = this.currentY;
                    this.pixi_obj.visible = true;
                }
            }
            function init_pixi_obj(obj) {
                obj.anchor.set(0.5);
                obj.visible = false;
                pixi_app.stage.addChild(obj);
            }
            const jsPsych = this.jsPsych;
            class audio_stimulus extends psychophysics_stimulus {
                constructor(stim) {
                    super(stim);
                    if (typeof this.file === "undefined") {
                        alert("You have to specify the file property.");
                        return;
                    }
                    // setup stimulus
                    this.context = jsPsych.pluginAPI.audioContext();
                    // load audio file
                    jsPsych.pluginAPI
                        .getAudioBuffer(this.file)
                        .then(function (buffer) {
                        if (this.context !== null) {
                            this.audio = this.context.createBufferSource();
                            this.audio.buffer = buffer;
                            this.audio.connect(this.context.destination);
                            this.prepared = true;
                            console.log("WebAudio");
                        }
                        else {
                            this.audio = buffer;
                            this.audio.currentTime = 0;
                            this.prepared = true;
                            console.log("HTML5 audio");
                        }
                        // setupTrial();
                    }.bind(this))
                        .catch(function (err) {
                        console.error(`Failed to load audio file "${this.file}". Try checking the file path. We recommend using the preload plugin to load audio files.`);
                        console.error(err);
                    }.bind(this));
                    // set up end event if trial needs it
                    if (this.trial_ends_after_audio) {
                        this.audio.addEventListener("ended", end_trial);
                    }
                }
                play() {
                    // start audio
                    if (this.context !== null) {
                        //startTime = this.context.currentTime;
                        // オリジナルのjspsychではwebaudioが使えるときは時間のデータとしてcontext.currentTimeを使っている。
                        // psychophysicsプラグインでは、performance.now()で統一している
                        this.audio.start(this.context.currentTime);
                    }
                    else {
                        this.audio.play();
                    }
                }
                stop() {
                    if (this.context !== null) {
                        this.audio.stop();
                        // this.source.onended = function() { }
                    }
                    else {
                        this.audio.pause();
                    }
                    this.audio.removeEventListener("ended", end_trial);
                }
            }
            if (typeof trial.stepFunc !== "undefined")
                alert(`The stepFunc is no longer supported. Please use the raf_func instead.`);
            const elm_jspsych_content = document.getElementById("jspsych-content");
            const style_jspsych_content = window.getComputedStyle(elm_jspsych_content); // stock
            const default_maxWidth = style_jspsych_content.maxWidth;
            elm_jspsych_content.style.maxWidth = "none"; // The default value is '95%'. To fit the window.
            if (trial.canvas_width === null)
                trial.canvas_width = window.innerWidth - trial.canvas_offsetX;
            if (trial.canvas_height === null)
                trial.canvas_height = window.innerHeight - trial.canvas_offsetY;
            let pixi_app;
            let new_html = "";
            const canvas_exist = document.getElementById("myCanvas") === null ? false : true;
            if (!canvas_exist) {
                if (trial.pixi) {
                    pixi_app = new PIXI__namespace.Application({
                        width: trial.canvas_width,
                        height: trial.canvas_height,
                        backgroundColor: getColorNum(trial.background_color),
                        // antialias: true,
                        // resolution: window.devicePixelRatio || 1,
                    });
                    display_element.appendChild(pixi_app.view);
                }
                else {
                    new_html =
                        '<canvas id="myCanvas" class="jspsych-canvas" width=' +
                            trial.canvas_width +
                            " height=" +
                            trial.canvas_height +
                            ' style="background-color:' +
                            trial.background_color +
                            ';"></canvas>';
                }
            }
            const motion_rt_method = "performance"; // 'date' or 'performance'. 'performance' is better.
            let start_time; // used for mouse and button responses.
            let keyboardListener;
            // allow to respond using keyboard mouse or button
            this.jsPsych.pluginAPI.setTimeout(() => {
                if (trial.response_type === "key") {
                    if (trial.choices != "NO_KEYS") {
                        keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                            callback_function: after_response,
                            valid_responses: trial.choices,
                            rt_method: motion_rt_method,
                            persist: false,
                            allow_held_key: false,
                        });
                    }
                }
                else if (trial.response_type === "mouse") {
                    start_time = performance.now();
                    canvas.addEventListener("mousedown", mouseDownFunc);
                }
                else {
                    // button
                    start_time = performance.now();
                    for (let i = 0; i < trial.button_choices.length; i++) {
                        display_element
                            .querySelector("#jspsych-image-button-response-button-" + i)
                            .addEventListener("click", function (e) {
                            const choice = this.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
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
            if (!canvas_exist && trial.response_type === "button") {
                let buttons = [];
                if (Array.isArray(trial.button_html)) {
                    if (trial.button_html.length == trial.button_choices.length) {
                        buttons = trial.button_html;
                    }
                    else {
                        console.error("Error: The length of the button_html array does not equal the length of the button_choices array");
                    }
                }
                else {
                    for (let i = 0; i < trial.button_choices.length; i++) {
                        buttons.push(trial.button_html);
                    }
                }
                new_html += '<div id="jspsych-image-button-response-btngroup">';
                for (let i = 0; i < trial.button_choices.length; i++) {
                    let str = buttons[i].replace(/%choice%/g, trial.button_choices[i]);
                    new_html +=
                        '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:' +
                            trial.vert_button_margin +
                            " " +
                            trial.horiz_button_margin +
                            '" id="jspsych-image-button-response-button-' +
                            i +
                            '" data-choice="' +
                            i +
                            '">' +
                            str +
                            "</div>";
                }
                new_html += "</div>";
            }
            // add prompt
            if (!canvas_exist && trial.prompt !== null) {
                new_html += trial.prompt;
            }
            display_element.insertAdjacentHTML("beforeend", new_html);
            const canvas = trial.pixi === true ? pixi_app.view : document.getElementById("myCanvas");
            if (!canvas || !canvas.getContext) {
                alert("This browser does not support the canvas element.");
                return;
            }
            let centerX;
            let centerY;
            let ctx;
            function set_canvas(canvas, ratio, width, height) {
                const ctx = canvas.getContext("2d");
                const canvas_scale = ratio; // This will be 2 in a retina display, and 1.5 in a microsoft surface laptop.
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                if (!canvas_exist) {
                    canvas.width = width * canvas_scale;
                    canvas.height = height * canvas_scale;
                    ctx.scale(canvas_scale, canvas_scale);
                }
                const centerX = canvas.width / 2 / canvas_scale;
                const centerY = canvas.height / 2 / canvas_scale;
                return {
                    ctx,
                    centerX,
                    centerY,
                };
            }
            if (trial.pixi) {
                centerX = pixi_app.screen.width / 2;
                centerY = pixi_app.screen.height / 2;
            }
            else {
                const canvas_info = set_canvas(canvas, window.devicePixelRatio, trial.canvas_width, trial.canvas_height);
                centerX = canvas_info.centerX;
                centerY = canvas_info.centerY;
                ctx = canvas_info.ctx;
                trial.context = ctx;
            }
            trial.canvas = canvas;
            trial.centerX = centerX;
            trial.centerY = centerY;
            // add event listeners defined by experimenters.
            if (trial.mouse_down_func !== null) {
                canvas.addEventListener("mousedown", trial.mouse_down_func);
            }
            if (trial.mouse_move_func !== null) {
                canvas.addEventListener("mousemove", trial.mouse_move_func);
            }
            if (trial.mouse_up_func !== null) {
                canvas.addEventListener("mouseup", trial.mouse_up_func);
            }
            if (trial.key_down_func !== null) {
                document.addEventListener("keydown", trial.key_down_func); // It doesn't work if the canvas is specified instead of the document.
            }
            if (trial.key_up_func !== null) {
                document.addEventListener("keyup", trial.key_up_func);
            }
            if (typeof trial.stimuli === "undefined" && trial.raf_func === null) {
                alert("You have to specify the stimuli/raf_func parameter in the psychophysics plugin.");
                return;
            }
            /////////////////////////////////////////////////////////
            // make instances
            const oop_stim = [];
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
                pixi: pixi_stimulus,
            };
            if (typeof trial.stimuli !== "undefined") {
                // The stimuli could be 'undefined' if the raf_func is specified.
                for (let i = 0; i < trial.stimuli.length; i++) {
                    const stim = trial.stimuli[i];
                    if (typeof stim.obj_type === "undefined") {
                        alert("You have missed to specify the obj_type property in the " +
                            (i + 1) +
                            "th object.");
                        return;
                    }
                    oop_stim.push(new set_instance[stim.obj_type](stim));
                }
            }
            trial.stim_array = oop_stim;
            // for (let i = 0; i < trial.stim_array.length; i++){
            //   console.log(trial.stim_array[i].is_presented)
            // }
            function mouseDownFunc(e) {
                let click_time;
                click_time = performance.now();
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
            function step(timestamp) {
                // Wait until all the instance of stimuli are ready.
                if (prepare_check) {
                    for (let i = 0; i < trial.stim_array.length; i++) {
                        if (!trial.stim_array[i].prepared) {
                            frameRequestID = window.requestAnimationFrame(step);
                            return;
                        }
                    }
                }
                prepare_check = false;
                if (!startStep) {
                    startStep = timestamp;
                    sumOfStep = 0;
                }
                else {
                    sumOfStep += 1;
                }
                elapsedTime = timestamp - startStep; // unit is ms. This can be used within the raf_func().
                if (trial.clear_canvas && !trial.pixi)
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (trial.raf_func !== null) {
                    trial.raf_func(trial, elapsedTime, sumOfStep); // customize
                    frameRequestID = window.requestAnimationFrame(step);
                    return;
                }
                for (let i = 0; i < trial.stim_array.length; i++) {
                    const stim = trial.stim_array[i];
                    const elapsed = stim.is_frame ? sumOfStep : elapsedTime;
                    const show_start = stim.is_frame
                        ? stim.show_start_frame
                        : stim.show_start_time;
                    const show_end = stim.is_frame
                        ? stim.show_end_frame
                        : stim.show_end_time;
                    if (stim.obj_type === "sound") {
                        if (elapsed >= show_start && !stim.is_presented) {
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
                            stim.pixi_obj.visible = false;
                            continue;
                        }
                        if (show_end !== null && elapsed >= show_end) {
                            stim.pixi_obj.visible = false;
                            continue;
                        }
                    }
                    else {
                        if (elapsed < show_start)
                            continue;
                        if (show_end !== null && elapsed >= show_end)
                            continue;
                        if (trial.clear_canvas === false && stim.is_presented)
                            continue;
                    }
                    stim.update_position(elapsed);
                    if (stim.drawFunc !== null) {
                        stim.drawFunc(stim, canvas, ctx, elapsedTime, sumOfStep);
                    }
                    else {
                        if (stim.change_attr != null)
                            stim.change_attr(stim, elapsedTime, sumOfStep);
                        stim.show();
                    }
                    stim.is_presented = true;
                }
                frameRequestID = window.requestAnimationFrame(step);
            }
            // Start the step function.
            let frameRequestID = window.requestAnimationFrame(step);
            function deg2rad(degrees) {
                return (degrees / 180) * Math.PI;
            }
            // store response
            let response = {
                rt: null,
                key: null,
            };
            // function to end trial when it is time
            // let end_trial = function() { // This causes an initialization error at stim.audio.addEventListener('ended', end_trial);
            // function end_trial(){
            const end_trial = () => {
                // console.log(default_maxWidth)
                document.getElementById("jspsych-content").style.maxWidth =
                    default_maxWidth; // restore
                window.cancelAnimationFrame(frameRequestID); //Cancels the frame request
                canvas.removeEventListener("mousedown", mouseDownFunc);
                // remove event listeners defined by experimenters.
                if (trial.mouse_down_func !== null) {
                    canvas.removeEventListener("mousedown", trial.mouse_down_func);
                }
                if (trial.mouse_move_func !== null) {
                    canvas.removeEventListener("mousemove", trial.mouse_move_func);
                }
                if (trial.mouse_up_func !== null) {
                    canvas.removeEventListener("mouseup", trial.mouse_up_func);
                }
                if (trial.key_down_func !== null) {
                    document.removeEventListener("keydown", trial.key_down_func);
                }
                if (trial.key_up_func !== null) {
                    document.removeEventListener("keyup", trial.key_up_func);
                }
                // stop the audio file if it is playing
                // remove end event listeners if they exist
                if (typeof trial.stim_array !== "undefined") {
                    // The stimuli could be 'undefined' if the raf_func is specified.
                    for (let i = 0; i < trial.stim_array.length; i++) {
                        const stim = trial.stim_array[i];
                        if (typeof stim.pixi_obj !== "undefined")
                            stim.pixi_obj.destroy();
                        // stim.is_presented = false;
                        // if (typeof stim.context !== 'undefined') { // If the stimulus is audio data
                        if (stim.obj_type === "sound") {
                            // If the stimulus is audio data
                            stim.stop();
                        }
                    }
                }
                if (!trial.remain_canvas && trial.pixi)
                    pixi_app.destroy(true, {
                        children: true,
                        texture: true,
                        baseTexture: true,
                    });
                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();
                // kill keyboard listeners
                if (typeof keyboardListener !== "undefined") {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }
                // gather the data to store for the trial //音の再生時からの反応時間をとるわけではないから不要？
                // if(context !== null && response.rt !== null){
                //   response.rt = Math.round(response.rt * 1000);
                // }
                // gather the data to store for the trial
                const trial_data = {};
                trial_data["rt"] = response.rt;
                trial_data["response_type"] = trial.response_type;
                trial_data["key_press"] = response.key;
                trial_data["response"] = response.key; // compatible with the jsPsych >= 6.3.0
                trial_data["avg_frame_time"] = elapsedTime / sumOfStep;
                trial_data["center_x"] = centerX;
                trial_data["center_y"] = centerY;
                if (trial.response_type === "mouse") {
                    trial_data["click_x"] = response.clickX;
                    trial_data["click_y"] = response.clickY;
                }
                else if (trial.response_type === "button") {
                    trial_data["button_pressed"] = response.button;
                    trial_data["response"] = response.button; // compatible with the jsPsych >= 6.3.0
                }
                // clear the display
                if (!trial.remain_canvas) {
                    display_element.innerHTML = "";
                }
                // move on to the next trial
                this.jsPsych.finishTrial(trial_data);
            };
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
                if (trial.response_type === "button") {
                    // after a valid response, the stimulus will have the CSS class 'responded'
                    // which can be used to provide visual feedback that a response was recorded
                    // display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';
                    // disable all the buttons after a response
                    let btns = document.querySelectorAll(".jspsych-image-button-response-button button");
                    for (let i = 0; i < btns.length; i++) {
                        //btns[i].removeEventListener('click');
                        btns[i].setAttribute("disabled", "disabled");
                    }
                }
                if (trial.response_ends_trial) {
                    end_trial();
                }
            }
            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(function () {
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
            if (trial.response_type === "key") {
                resp = this.jsPsych.pluginAPI.getValidKey(trial.choices);
            }
            if (trial.response_type === "button") {
                resp = this.jsPsych.randomization.randomInt(0, trial.button_choices.length - 1);
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
                    case "key":
                        this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
                        break;
                    case "button":
                        this.jsPsych.pluginAPI.clickTarget(display_element.querySelector(`div[data-choice="${data.response}"] button`), data.rt);
                        break;
                    case "mouse": {
                        const client_rect = document
                            .getElementById("myCanvas")
                            .getBoundingClientRect();
                        if (typeof data.click_x === "undefined")
                            data.click_x = 0;
                        if (typeof data.click_y === "undefined")
                            data.click_y = 0;
                        const mouse_event = new MouseEvent("mousedown", {
                            bubbles: true,
                            clientX: data.click_x + client_rect.left,
                            clientY: data.click_y + client_rect.top,
                        });
                        setTimeout(() => {
                            document.getElementById("myCanvas").dispatchEvent(mouse_event);
                        }, data.rt);
                        break;
                    }
                }
            }
        }
    }
    PsychophysicsPlugin.info = info;

    return PsychophysicsPlugin;

})(jsPsychModule, PIXI);
//# sourceMappingURL=index.browser.js.map
