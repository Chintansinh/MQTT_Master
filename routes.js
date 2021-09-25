const mqttClient = require('./mqtt').mqttClient;
const mqttTopic = require('./mqtt').mqttTopic;

const handleRequests = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/' && method === 'GET') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/" method="POST">Your Name: <input type="text" name="name"> Your Message: <input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/' && method === 'POST') {
        const body = [];
        let name;
        req.on('data', (chunk) => {
            
            body.push(chunk);
        });
        req.on('end', () => {
            let parsedBody = Buffer.concat(body).toString();
            parsedBody = parsedBody.split('&');
            name = parsedBody[0].split('=')[1];
            const message = parsedBody[1].split('=')[1];
            const msgLine = '\n' + new Date() + ' ' + name + ': ' + message;
            mqttClient.publish(mqttTopic, msgLine);             
        });
        res.url = '/';
        res.write('<html>');
        res.write('<head><title>Enter Message</title><head>');
        res.write('<body><form action="/" method="POST">Your Name: <input type="text" name="name"> Your Message: <input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
};

exports.handler = handleRequests;