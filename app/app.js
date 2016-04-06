'use strict';

const HID = require('node-hid');
const VENDOR_ID = 3471;
const DEVICE_ID = 512;

angular.module('app', [])
  .controller('AppController', function($scope, $timeout) {
    let _this = this;

    _this.enableScale = enableScale;
    _this.getWeight = getWeight;

    activate();

    function enableScale() {
      try {
        if (HID.devices().length) {
          _this.device = new HID.HID(VENDOR_ID, DEVICE_ID);
          setupScaleListener();
        } else {
          throw 'No usb devices detected.';
        }
      } catch (e) {
        scaleErrorHandler(e);
      }
    }

    function setupScaleListener() {
      _this.device.on('data', function(data) {
        let ounces = data.readInt16LE(4)/10;
        if (_this.weight !== ounces) {
          _this.weight = ounces;
          $scope.$applyAsync();
        }
      });
      _this.device.on('error', scaleErrorHandler);
    }

    function getWeight() {
      _this.weightButton = _this.weight;
    }

    function activate() {
      enableScale();
    }

    function scaleErrorHandler(e) {
      console.error(e);
      try {
        _this.device.close();
        _this.device = null;
      } catch(e) {
        _this.device = null;
      }
      $scope.$applyAsync();
    }
  });
