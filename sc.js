var screenshot = require('desktop-screenshot');

function takeSc() {
    screenshot("screenshot.png", function (error, complete) {
        if (error)
            console.log("Screenshot failed", error, Date.now());
        else
            console.log("Screenshot succeeded", Date.now(), getIp(function(){
                console.log(arguments);
            }));
    });
}
setInterval(takeSc, 2000);

var fs = require('fs'),
http = require('http'),
url = require('url');



http.createServer(function(req, res) {
    var request = url.parse(req.url, true);
    var action = request.pathname;
    if(action.indexOf('screenshot')!==-1) {
        var img = fs.readFileSync('./screenshot.png');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(img, 'binary');
    } else {//if(action.indexOf('client.html')!==-1) {
        //serve the client file
        var img = fs.readFileSync('./client.html');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(img, 'binary');
    }
}).listen(8080);;

function getIp(cb) {
    var os = require('os');
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                cb(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                cb(ifname, iface.address);
            }
            ++alias;
        });
    });
}