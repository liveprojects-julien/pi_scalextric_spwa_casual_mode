(function () {
  'use strict';

  angular
    .module('mainjs', [])
    .config(function ($stateProvider) {
      $stateProvider
        .state('splashscreen', {
          cache: false,
          url: '/index?uuid&brokerHost&brokerPort&username&password&ssl',
          params: {
              uuid : {
                  dynamic: false
              },
              brokerHost: {
                  dynamic: false
              },
              brokerPort: {
                  dynamic: false
              },
              username: {
                  dynamic : false
              },
              password: {
                  dynamic : false
              },
              ssl:{
                  dynamic : false
              }

          },
          templateUrl: 'js/states/splashscreen/splashscreen.html',
          controller: 'splashscreenCtrl as vm',
          resolve: {
            broker: ['$stateParams','brokerDetails', function ($stateParams,brokerDetails) {
            
                if($stateParams.uuid) brokerDetails.UUID = $stateParams.uuid;
                if($stateParams.brokerHost) brokerDetails.HOST = $stateParams.brokerHost;
                if($stateParams.brokerPort) brokerDetails.PORT = $stateParams.brokerPort;
                if($stateParams.username) brokerDetails.USERNAME = $stateParams.username;
                if($stateParams.password) brokerDetails.PASSWORD = $stateParams.password;
                if($stateParams.ssl) brokerDetails.SSL = ($stateParams.ssl.toLowerCase() == 'true');
            }]
        }
        })
        .state('car_control', {
          cache: false,
          url: '/car_control',
          templateUrl: 'js/states/car.control/car.control.html',
          controller: 'carControlCtrl as vm',
          params: {
            channel: null,
            ip_address: null
          },
          //resolve used to check if transition contains channel and ipaddress params
          resolve: {
              parameters: ['$q', '$state','$stateParams', function ($q, $state,$stateParams) {
                  var deferred = $q.defer();
                 
                  if ($stateParams.channel === null) {
                      $state.transitionTo('homepage', {});
                  }else{
                      deferred.resolve();
                  }
  
                  return deferred.promise;
              }]
          }
        
        })
        .state('homepage', {
          cache: false,
          url: '/homepage',
          templateUrl: 'js/states/homepage/homepage.html',
          controller: 'homepageCtrl as vm'
        })
    });
})();