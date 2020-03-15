(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = [
        'aloneService'
        ];
    
    function homepageCtrl(
        aloneService
    ) {
        var vm = this;
        vm.go = go;
        var stateName = "homepage";
        vm.stateName = stateName;

        vm.channels = Array.apply(null, {
            length: 2
        }).map(Function.call, Number);

        vm.channel = 0;

        function go(valid) {
            if (!valid) {
                alert("Invalid Details")
            } else {
                aloneService.checkResponse(vm.channel);
            }
        }
        
    }
})();
