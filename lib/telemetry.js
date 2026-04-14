'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _telemetrySample = require('./telemetry-sample');

var _telemetrySample2 = _interopRequireDefault(_telemetrySample);

var _telemetryFileLoader = require('./utils/telemetry-file-loader');

var _telemetryFileLoader2 = _interopRequireDefault(_telemetryFileLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var variableHeaders = new WeakMap();
var fileDescriptor = new WeakMap();

/**
 * iRacing Telemetry
 */

var Telemetry = function () {
  /**
   * Telemetry constructor.
   */
  function Telemetry(telemetryHeader, diskSubHeader, sessionInfo, varHeaders, fd) {
    _classCallCheck(this, Telemetry);

    this.headers = telemetryHeader;
    this.diskHeaders = diskSubHeader;
    try {
      this.sessionInfo = _jsYaml2.default.safeLoad(sessionInfo);
    } catch (error) {
      this.sessionInfo = null;
    }

    fileDescriptor.set(this, fd);
    variableHeaders.set(this, varHeaders);
  }

  /**
   * Instantiate a Telemetry instance from the contents of an ibt file
   *
   * @param file path to *.ibt file
   * @return Telemetry instance of telemetry
   */


  _createClass(Telemetry, [{
    key: 'uniqueId',


    /**
     * Generate a unique key for the telemetry session.
     *
     * The unique key is a combination of 3 fields:
     *   accountId-sessionId-subSessionId
     *
     * @return string
     */
    value: function uniqueId() {
      var accountId = this.sessionInfo.DriverInfo.Drivers[this.sessionInfo.DriverInfo.DriverCarIdx].UserID;
      var sessionId = this.sessionInfo.WeekendInfo.SessionID;
      var subSessionId = this.sessionInfo.WeekendInfo.SubSessionID;
      return accountId + '-' + sessionId + '-' + subSessionId;
    }

    /**
     * Telemetry samples generator.
     */

  }, {
    key: 'samples',
    value: /*#__PURE__*/regeneratorRuntime.mark(function samples() {
      var hasSample, count, fd, length, buffer, start, bytesRead;
      return regeneratorRuntime.wrap(function samples$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              hasSample = true;
              count = 0;
              fd = fileDescriptor.get(this);
              length = this.headers.bufLen;
              buffer = Buffer.alloc(length);

            case 5:
              if (!hasSample) {
                _context.next = 16;
                break;
              }

              start = this.headers.bufOffset + count++ * length;
              bytesRead = _fs2.default.readSync(fd, buffer, 0, length, start);

              if (!(bytesRead !== length)) {
                _context.next = 12;
                break;
              }

              hasSample = false;
              _context.next = 14;
              break;

            case 12:
              _context.next = 14;
              return new _telemetrySample2.default(buffer, this.varHeaders);

            case 14:
              _context.next = 5;
              break;

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, samples, this);
    })
  }, {
    key: 'varHeaders',


    /**
     * Telemetry variable headers.
     */
    get: function get() {
      return variableHeaders.get(this);
    }
  }], [{
    key: 'fromFile',
    value: function fromFile(file) {
      return (0, _telemetryFileLoader2.default)(file);
    }
  }]);

  return Telemetry;
}();

exports.default = Telemetry;