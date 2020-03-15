angular.module('app').service('dataService', dataService);

dataService.$inject = [
    '$http'
];

function dataService($http) {
    var self = this;


    self.validateDetails = validateDetails;
    self.setThrottle = setThrottle;
    self.getThrottle = getThrottle;
    self.stop = stop;


    /*
        Validates IP Address and Channel, return 200 if details are ok

        Path : /macros/start
        Method : Post
    */
    function validateDetails(ip_address,options = {}) {
        if(!ip_address) throw new Error("Need to define host");
        if(options && typeof options !== "object") throw new Error("Options must be a object");

        var configOptions = configureOptions(options);
        var protocol = configOptions.protocol;
        
        var url = `${protocol}://${ip_address}/macros/start`
        return $http.post(url);
    }

    /*
        Sends throttle percentage

        Path : /macros/setPercent/:channel,:percentage
        Method : Post
    */
    function setThrottle(ip_address, channel, percentage,options = {}) {
        if(!ip_address) throw new Error("Need to define host");
        if(!channel) throw new Error("Need to define channel");
        if(!percentage) throw new Error("Need to define percentage");
        if(options && typeof options !== "object") throw new Error("Options must be a object");

        var configOptions = configureOptions(options);
        var protocol = configOptions.protocol;
        
        var url = `${protocol}://${ip_address}/macros/setPercent/${channel},${percentage}`
        return $http.post(url);
    }

    /*
        Gets throttle percentage
        
        Path :/macros/getPercent/:channel
        Method : Post
    */
    function getThrottle(ip_address, channel,options = {}) {
        if(!ip_address) throw new Error("Need to define host");
        if(!channel) throw new Error("Need to define channel");
        if(options && typeof options !== "object") throw new Error("Options must be a object");

        var configOptions = configureOptions(options);
        var protocol = configOptions.protocol;
        
        var url = `${protocol}://${ip_address}/macros/getPercent/${channel}`
        return $http.get(url);

    }


    /*
	    Stops channel 
	
	    Path : /macros/stop
	    Method : Post
    */
    function stop(ip_address,options = {}) {
        if(!ip_address) throw new Error("Need to define host");
        if(options && typeof options !== "object") throw new Error("Options must be a object");

        var configOptions = configureOptions(options);
        var protocol = configOptions.protocol;

        var url = `${protocol}://${ip_address}/macros/stop`
        return $http.post(url);
    }

    //configure dataService options
    function configureOptions(options){
        const PROTOCOL_DEFAULT = "http"

        if(!options.hasOwnProperty('protocol')){
            options.protocol = PROTOCOL_DEFAULT;
        }

        return options;
    }

}