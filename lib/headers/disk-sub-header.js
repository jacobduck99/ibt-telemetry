"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIZE_IN_BYTES = 32;

/**
 * Sub header used when writing telemetry to disk
 *
 * Total size: 32 bytes
 */

var DiskSubHeader = function () {
  /**
   * DiskSubHeader constructor.
   *
   * params = {
   *  startDate,
   *  startTime,
   *  endTime,
   *  lapCount,
   *  recordCount
   * }
   */
  function DiskSubHeader(params) {
    _classCallCheck(this, DiskSubHeader);

    Object.assign(this, params);
  }

  /**
   * Instantiate an instance of DiskSubHeader using the contents of the supplied buffer.
   */


  _createClass(DiskSubHeader, null, [{
    key: "fromBuffer",
    value: function fromBuffer(buffer) {
      return new DiskSubHeader({
        startDate: buffer.slice(0, 8).readFloatLE(),
        startTime: buffer.slice(8, 16).readDoubleLE(),
        endTime: buffer.slice(16, 24).readDoubleLE(),
        lapCount: buffer.slice(24, 28).readInt32LE(),
        recordCount: buffer.slice(28, 32).readInt32LE()
      });
    }
  }]);

  return DiskSubHeader;
}();

exports.SIZE_IN_BYTES = SIZE_IN_BYTES;
exports.DiskSubHeader = DiskSubHeader;
exports.default = DiskSubHeader;