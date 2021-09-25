const mqtt = require('mqtt');
const fs = require('fs');

const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
const mqttTopic = 'chintan/messagetopic';

mqttClient.on('message', function (topic, message) {
  if(topic === mqttTopic){
    let strMsg =  message.toString();
    fs.readFile('./message.txt', (err, data) =>{  
      if(!err){
        strMsg = data.toString() + strMsg;
        fs.writeFile('./message.txt', strMsg, (error) => {
          if(error)
            console.log(error);
        });        
      }
      else
        console.log(err);
  });    
  }
})

mqttClient.on('connect', function () {
    mqttClient.subscribe(mqttTopic, function (err) {
    if (!err) {
      fs.writeFile('./message.txt', '', (error) => {
        if (error)
          console.log(error);
        else
          mqttClient.publish(mqttTopic, new Date() + ' Server : Connected!')
      });  
        
    }
    else
      console.log(err);
  })
})



exports.mqttClient = mqttClient;
exports.mqttTopic = mqttTopic;