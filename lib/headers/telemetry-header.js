"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIZE_IN_BYTES = 112;

/**
 * iRacing Telemtry Header
 *
 * Total Size: 112 bytes
 */

var TelemetryHeader = function () {
  function TelemetryHeader(parts) {
    _classCallCheck(this, TelemetryHeader);

    this.version = parts[0];
    this.status = parts[1];
    this.tickRate = parts[2];

    this.sessionInfoUpdate = parts[3];
    this.sessionInfoLength = parts[4];
    this.sessionInfoOffset = parts[5];

    this.numVars = parts[6];
    this.varHeaderOffset = parts[7];

    this.numBuf = parts[8];
    this.bufLen = parts[9];
    this.bufOffset = parts[13];

    this._parts = parts.slice(10);
  }

  /**
   * Create an instance of TelemetryHeader from the contents of a buffer.
   */


  _createClass(TelemetryHeader, null, [{
    key: "fromBuffer",
    value: function fromBuffer(buf) {
      var telemetryPartsFromBuffer = function telemetryPartsFromBuffer(buffer) {
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
        var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var accum = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

        var bufferLength = buffer.length;

        if (bufferLength % size !== 0) {
          throw new RangeError("Buffer length must be a multiple of size. (buffer: " + bufferLength + ", size: " + size + ")");
        }

        if (start >= bufferLength) {
          return accum;
        } else {
          var a = buffer.slice(start, start + size).readInt32LE();
          return telemetryPartsFromBuffer(buffer, size, start + size, [].concat(_toConsumableArray(accum), [a]));
        }
      };

      return new TelemetryHeader(telemetryPartsFromBuffer(buf));
    }
  }]);

  return TelemetryHeader;
}();

exports.SIZE_IN_BYTES = SIZE_IN_BYTES;
exports.TelemetryHeader = TelemetryHeader;
exports.default = TelemetryHeader;