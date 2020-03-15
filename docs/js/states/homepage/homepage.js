(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = [
        '$scope',
        '$state',
        'mqttService',
        'brokerDetails',
        'messageService',
        'aloneService'
        ];
    
    function homepageCtrl(
        $scope,
        $state,
        mqttService,
        brokerDetails,
        messageService,
        aloneService
    ) {
        var vm = this;
        vm.go = go;
        var stateName = "homepage";
        vm.stateName = stateName;
        


        //console.log(aloneService.returnFreeChannels());
        

        //Initialises the range of channels that can be selected and the selected channel
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
