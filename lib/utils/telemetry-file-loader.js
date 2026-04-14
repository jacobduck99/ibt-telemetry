'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _telemetryHeader = require('../headers/telemetry-header');

var _diskSubHeader = require('../headers/disk-sub-header');

var _varHeader = require('../headers/var-header');

var _readFileToBuffer = require('../utils/read-file-to-buffer');

var _readFileToBuffer2 = _interopRequireDefault(_readFileToBuffer);

var _telemetry = require('../telemetry');

var _telemetry2 = _interopRequireDefault(_telemetry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Open the data file and return it's file descriptor as a promise
var openDataFile = function openDataFile(dataFile) {
  return new Promise(function (resolve, reject) {
    _fs2.default.open(dataFile, 'r', function (err, fd) {
      err ? reject(err) : resolve(fd);
    });
  });
};

// Return the Telemetry header from the supplied file descriptor
var telemetryHeaderFromFileDescriptor = function telemetryHeaderFromFileDescriptor(fd) {
  return (0, _readFileToBuffer2.default)(fd, 0, _telemetryHeader.SIZE_IN_BYTES).then(_telemetryHeader.TelemetryHeader.fromBuffer);
};

// Disk sub header telemetry
var diskSubHeaderFromFileDescriptor = function diskSubHeaderFromFileDescriptor(fd) {
  return (0, _readFileToBuffer2.default)(fd, _diskSubHeader.SIZE_IN_BYTES, _telemetryHeader.SIZE_IN_BYTES).then(_diskSubHeader.DiskSubHeader.fromBuffer);
};

var sessionInfoStringFromFileDescriptor = function sessionInfoStringFromFileDescriptor(fd, telemetryHeader) {
  return (0, _readFileToBuffer2.default)(fd, telemetryHeader.sessionInfoOffset, telemetryHeader.sessionInfoLength).then(function (x) {
    return x.toString('ascii');
  });
};

var varHeadersFromFileDescriptor = function varHeadersFromFileDescriptor(fd, telemetryHeader) {
  var numberOfVariables = telemetryHeader.numVars;
  var startPosition = telemetryHeader.varHeaderOffset;
  var fullBufferSize = numberOfVariables * _varHeader.SIZE_IN_BYTES;

  return (0, _readFileToBuffer2.default)(fd, startPosition, fullBufferSize).then(function (buffer) {
    return _ramda2.default.range(0, numberOfVariables).map(function (count) {
      var start = count * _varHeader.SIZE_IN_BYTES;
      var end = start + _varHeader.SIZE_IN_BYTES;
      return _varHeader.VarHeader.fromBuffer(buffer.slice(start, end));
    });
  });
};

var telemetryFileLoader = function telemetryFileLoader(file) {
  return openDataFile(file).then(function (fd) {
    var headers = [telemetryHeaderFromFileDescriptor(fd), diskSubHeaderFromFileDescriptor(fd)];

    return Promise.all(headers).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          telemetryHeader = _ref2[0],
          diskSubHeader = _ref2[1];

      return Promise.all([sessionInfoStringFromFileDescriptor(fd, telemetryHeader), varHeadersFromFileDescriptor(fd, telemetryHeader)]).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            sessionInfo = _ref4[0],
            varHeaders = _ref4[1];

        return new _telemetry2.default(telemetryHeader, diskSubHeader, sessionInfo, varHeaders, fd);
      });
    });
  });
};

exports.default = telemetryFileLoader;