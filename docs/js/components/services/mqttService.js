angular.module('app').service('mqttService', mqttService);

mqttService.$inject = [
    '$timeout',
    'brokerDetails',
    '$state'
];


/*
    Mqtt Service uses Eclipse Paho JavaScript Client found :
        - https://github.com/eclipse/paho.mqtt.javascript
        - https://web.archive.org/web/20181212171208/https://github.com/eclipse/paho.mqtt.javascript
*/
function mqttService($timeout, brokerDetails, $state) {
    var self = this;
    self.initialize = initialize;
    self.connect = connect;
    self.subscribe = subscribe;
    self.publish = publish;
    self.onConnectionLost = onConnectionLost;
    self.setMessageListener = setMessageListener;
    self.disconnect = disconnect;
    self.setResubscribeListener = setResubscribeListener;

    var RETRY_DELAY_MS = 2000;
    var MAX_RETRIES = 10;

    var client = null;
    var messageListener;
    var resubscribeListener;
    var _options = {};
    var _counter = 0;
    var retryOrNot = true;
    



    // Initialize mqtt client, this must be the done before any other actions
    function initialize(hostname, port, clientId = "") {
        if (!hostname) { throw new Error("Invalid hostname") }
        if (!port) { throw new Error("Invalid port") }

        client = new Paho.MQTT.Client(
            hostname,
            Number(port),
            "",
            clientId);

        client.onMessageArrived = function (message) {
            if (messageListener) {
                messageListener(message);
            }
        };
        client.onConnectionLost = function () {
            onConnectionLost();
        }
    }

    //connect to the mqtt broker
    function connect(callback, options = {}) {
        if (!client) { throw new Error("Need to Initialize Mqtt") }
        if (callback && typeof callback !== 'function') { throw new Error("Callback must be a function") }

        _options = options;

        _options.onSuccess = function (success) {
            callback(success, undefined)
        };

        _options.onFailure = function (error) {
            callback(undefined, error)
        }


        client.connect(_options);
    }

    //subscribe to a mqtt topic, when message arrives client.onMessageArrived is called
    function subscribe(topic) {
        if (!client) { throw new Error("Need to Initialize Mqtt") }
        if (!topic) { throw new Error("Need to define a topic") }

        client.subscribe(topic)
    }

    //publish mqtt message
    function publish(topic, message) {
        if (!client) { throw new Error("Need to Initialize Mqtt") }
        if (!topic) { throw new Error("Need to define a topic") }


        var mqtt_message = new Paho.MQTT.Message(message);
        mqtt_message.destinationName = topic;
        client.send(mqtt_message);
    }

    function disconnect(retryOrNo) {
        retryOrNot = retryOrNo
        if (client) {
            client.disconnect();
        }
    }


    function setMessageListener(fnListener) {
        messageListener = fnListener;
    }

    function setResubscribeListener(fncListener) {
        resubscribeListener = fncListener;
    }

    
    function retry() {
        console.log("retrying connection...");
        $timeout(
            function () {

                var retryOptions = _options;
                retryOptions
                    .onSuccess = function () {
                        console.log("Successful reconnect!");
                        _counter = 0;
                        if (resubscribeListener) {
                            resubscribeListener();
                        }
                    };

                retryOptions
                    .onFailure = function (error) {
                        console.log("retry failed: " + JSON.stringify(error));
                        _counter++;
                        $timeout(
                            function () {
                                handleRetries();
                            }, RETRY_DELAY_MS);
                    };
                client.connect(retryOptions);
            });

    }


    function handleRetryError() {
        if(retryOrNot){
            alert("Could not reconnect to MQTT, going back to load screen!");
        }
        retryOrNot = true;
        $state.go('splashscreen');
    }

    function handleRetries() {
        if (_counter < MAX_RETRIES) {
            retry();
        } else {
            handleRetryError();
        }
    }


    function onConnectionLost() {
        console.error("connection lost");
        if(retryOrNot){
            $timeout(
                function () {
                    handleRetries();
                }
            );
        }else{
            handleRetryError();
        }
        
    }

}