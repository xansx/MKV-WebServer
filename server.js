// Import modules
var express = require('express');
var os = require('os');


//Get list of files
const filesfolder = './public/videos/';
var fs = require('fs');

var filesarray = [];
console.log("Files found: ");
fs.readdirSync(filesfolder).forEach(file => {
	filesarray.push(file)
	console.log(file);
});

var app = express();

app.use(express.urlencoded({ extended: false }));

//Host static files from public directory
app.use(express.static('public'));

var server = app.listen(3000);


app.get('/', function (req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log("new access: " + ip);
	res.write('<body>');
	res.write('<h1>Select a file</h1>');
	res.write('<form action="/video" method="POST">');
	filesarray.forEach(file => {
		res.write('<button id="name" name="name" value="' + file + '" type="submit">' + file + '</button>')
	});
	res.write('</form>');
	res.write('</body>');
	res.end();
});

app.post('/video', function (req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log(ip + " is watching: " + req.body.name);
	res.write('<body>');
	res.write('<p><video id="myVideo" src="videos/'+ req.body.name + '" type=\'video/mp4; codecs="vorbis"\' autoplay controls" ></video></p>');
	res.write('</body>');
	res.end();
});

//Get local IP
interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log("The IP of the server is " + addresses + ":3000");
