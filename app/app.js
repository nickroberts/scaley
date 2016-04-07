(function() {
  'use strict';

  angular.module('app', ['ngRoute'])
    .config(config)
    .controller('AppController', AppController);

  function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/home.html',
        controller: 'AppController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  function AppController($scope) {
    const HID = require('node-hid');
    const VENDOR_ID = 3471;
    const DEVICE_ID = 512;

    let vm = this;
    vm.device = null;
    vm.weight = null;
    vm.weightButton = null;

    vm.enableScale = enableScale;
    vm.getWeight = getWeight;

    activate();

    function activate() {
      enableScale();
    }

    function enableScale() {
      try {
        if (HID.devices().length) {
          vm.device = new HID.HID(VENDOR_ID, DEVICE_ID);
          setupScaleListener();
        } else {
          throw 'No usb devices detected.';
        }
      } catch (e) {
        scaleErrorHandler(e);
      }
    }

    function setupScaleListener() {
      vm.device.on('data', function(data) {
        let ounces = data.readInt16LE(4)/10;
        if (vm.weight !== ounces) {
          vm.weight = ounces;
          $scope.$applyAsync();
        }
      });
      vm.device.on('error', scaleErrorHandler);
    }

    function getWeight() {
      vm.weightButton = vm.weight;
    }

    function scaleErrorHandler() {
      try {
        vm.device.close();
        vm.device = null;
      } catch(err) {
        vm.device = null;
      }
      $scope.$applyAsync();
    }
  }
})();
