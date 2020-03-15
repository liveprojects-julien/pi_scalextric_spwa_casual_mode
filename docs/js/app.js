(function () {
  angular.module('app', [
    'ui.router',// ADDED for page navigation
    'mainjs',// ADDED for our states module
    'angular-uuid'// ADDED for uuid generation
  ])

    .config(function ($urlRouterProvider){
      $urlRouterProvider.otherwise('/splashscreen');
    })

    .run(function ($state, $rootScope) {
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
        
        event.preventDefault();

        $state.get('splashscreen').error = { code: 123, descriptions: 'Exception stack trace' }
        return $state.go('splashscreen');
      });

    })
})();
