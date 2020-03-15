(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('carControlCtrl', carControlCtrl);

        carControlCtrl.$inject = [
        '$scope',
        '$stateParams',
        'brokerDetails',
        'messageService',
        'aloneService',
        '$timeout',
        '$interval'
        ];
    
    function carControlCtrl(
        $scope,
        $stateParams, 
        brokerDetails,
        messageService,
        aloneService,
        $timeout,
        $interval
    ) {
        
        var vm = this;
        var stateName = "car_control";
        
        var changed = false;

        var channel = $stateParams.channel;
        var WEAPONS_DISABLED = true;

        const DEFAULT_THROTTLE = 0;
        const WEAPON_DELAY_MS = 5000;
    
        var slider = document.getElementById("throttle");
        
        /*
        throttle : is the throttle percentage the user is demanding.
        actualThrottle : is the throttle percentage the real world car is at.
        resources : is the array holding the available special weapons
        */
        vm.throttle = DEFAULT_THROTTLE;
        
        vm.actualThrottle = DEFAULT_THROTTLE;
        vm.resources = [];
        vm.stateName = stateName;
        vm.targetChannel = -1;
        vm.setId = setId;
        vm.WEAPONS_DISABLED = WEAPONS_DISABLED;

        //Used to show error message when there is a server error.
        vm.throttleError = false;

        vm.stop = stop;
 
        aloneService.setWeaponsListener(toggleWeapons);
        function toggleWeapons(){
            vm.WEAPONS_DISABLED = false;
        }
        aloneService.checkOtherTrack();

        aloneService.setDisableListener(disableWeapons);
        function disableWeapons(){
            vm.WEAPONS_DISABLED = true;
        }

        //function called every 5 seconds to check if a player has left
        function dataTime() {
            aloneService.checkIfPlayerHasLeft();
        }
        // start interval 
        var interval = $interval(dataTime, 5000);

        var throttleTopic = `${brokerDetails.UUID}/control/${channel}/throttle`;
        var getResourcesTopic = `${brokerDetails.UUID}/resources`;
        var resourceStateTopic = `${brokerDetails.UUID}/control/{channel}/{resourceId}/state`;

        //subscribe to channel throttle
        messageService.subscribe(throttleTopic);

        // subscribe to channel resources
        messageService.subscribe(getResourcesTopic);
        
        //Stops the car and returns user back to the splashscreen
        function stop() {
            aloneService.publishOnClose();
            var retryOrNot = false;
            messageService.disconnect(retryOrNot);
        }

       //sets id of special weapon to be used
        var rID;
        function setId(id){
            vm.WEAPONS_DISABLED = true;
            $timeout(function(){
            vm.WEAPONS_DISABLED = false;
            },WEAPON_DELAY_MS);
            if(channel == 1){
                vm.targetChannel = 0;
            }
            if(channel == 0){
                vm.targetChannel = 1;
            }
            rID = vm.resources[id].id;
            console.log(rID);
            console.log(vm.targetChannel);
            fireSpecialWeapon(rID);
        }

        //fires special weapon
        function fireSpecialWeapon(resourceId) {
            let payload = {
                state: "requested",
                target: vm.targetChannel
            };
            messageService.publish(resourceStateTopic.replace(/\{resourceId\}/, resourceId).replace(/\{channel\}/, channel), JSON.stringify(payload));
        }

        messageService.subscribe(throttleTopic,stateName, function(message){
            if(message.topic == throttleTopic){
                console.log(message.payloadString.replace(/"/g,""));
                var throttle  = JSON.parse(message.payloadString);
                //filter out any set throttle messages
                if(throttle.hasOwnProperty("throttle")){
                    vm.actualThrottle = throttle.throttle;
                }
            }
        });

        messageService.subscribe(getResourcesTopic,stateName, function(message){
            if(message.topic == getResourcesTopic){
                vm.resources = JSON.parse(message.payloadString);
                    vm.resources.forEach(resource => {
                        // subscribe to resource state for this channel
                        messageService.subscribe(resourceStateTopic.replace(/\{resourceId\}/, resource.id));
                    });
                    $scope.$apply();
            }
        });

        messageService.subscribe(resourceStateTopic,stateName, function(message){
            if (vm.resources !== undefined) {
                vm.resources.forEach(resource => {
                    if (message.topic === resourceStateTopic.replace(/\{resourceId\}/, resource.id)) {
                        console.log(message.payloadString.replace(/"/g,""));
                    }
                })
            }
        });

        /*
        When users changes car throttle a change request is sent to server. 
        */
        $scope.$watch("vm.throttle", function (newThrottle, oldThrottle) {
            if (newThrottle != oldThrottle) {
                var payload = {
                    set : newThrottle
                }
                messageService.publish(throttleTopic, JSON.stringify(payload));
            }
        })
     
    }
})();
