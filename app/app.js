angular.module('app', [])
  .controller('AppController', function($scope, $timeout) {
    var _this = this;

    var HID = require('node-hid');
    var VENDOR_ID = 3471;
    var DEVICE_ID = 512;
    var usbDetect = require('usb-detection');

    _this.enableScale = enableScale;
    _this.getWeight = getWeight;

    activate();

    function enableScale() {
      try {
        _this.device = new HID.HID(VENDOR_ID, DEVICE_ID);
        setupScaleListener();
      } catch (e) {
        console.error(e);
      }
    }

    function setupScaleListener() {
      _this.device.on('data', function(data) {
        var ounces = data.readInt16LE(4)/10;
        if (_this.weight !== ounces) {
          _this.weight = ounces;
          $scope.$applyAsync();
        }
      });
      _this.device.on('error', function(data) {
        _this.device.close();
        _this.device = null;
        $scope.$applyAsync();
      });
    }

    function getWeight() {
      _this.weightButton = _this.weight;
    }

    function activate() {
      enableScale();
      usbDetect.on('add:' + VENDOR_ID + ':' + DEVICE_ID, function(device) {
        _this.initializingScale = true;
        $scope.$applyAsync();
        $timeout(function() {
          _this.initializingScale = false;
          enableScale();
        }, 5000);
      });
    }
  });
