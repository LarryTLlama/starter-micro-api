/** source/server.ts */
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const fileGetContents = require('file-get-contents');
const util = require('minecraft-server-util');
const path = require('path');
const axios = require('axios');
const fs = require('fs')
const request = require('request')
const { getPlayers, updateStatus2, getMojangStat, getPosts, getPost, addError, updateStatus, deletePost, addPost, bedrockStat, javaStat } = require('./controllers/posts.js');
console.log(`We're running on ${process.platform}`)
const app = express();

/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', 'local');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
	res.header('Access-Control-Allow-Origin', 'https://larrytllama.github.io');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Routes */
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/routes/site/index.html"));
}); //Gets main page
app.get("/require.js", function (req, res) {
  res.sendFile(path.join(__dirname + "/routes/site/require.js"));
}); //Gets requireJS for getting node modules in HTML
app.get("/info", function (req, res) {
  res.sendFile(path.join(__dirname + "/routes/site/master.json"));
})
app.get("/errors", function (req, res) {
  res.sendFile(path.join(__dirname + "/routes/site/errors.json"));
})

// Llama Iceways Stuff
app.get('/llama-iceways', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/index.html'))
})

app.get('/llama-iceways/map', (req, res) => {
	res.sendFile(path.join(__dirname, "../llama-iceways/map.html"))
})

app.get('/llama-iceways/directions', (req, res) => {
	res.sendFile(path.join(__dirname, "../llama-iceways/directions.html"))
})

app.get('/llama-iceways/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/' + req.params.file));
})

// Images

app.get('/llama-iceways/images/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/images/' + req.params.file));
})

// All the stuff in the assets folder

// js

app.get('/llama-iceways/assets/js/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/js/' + req.params.file));
})

// css

app.get('/llama-iceways/assets/css/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/css/' + req.params.file));
})

app.get('/llama-iceways/assets/css/images/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/css/images/' + req.params.file));
})

// sass

app.get('/llama-iceways/assets/sass/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/sass/' + req.params.file));
})

app.get('/llama-iceways/assets/sass/libs/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/sass/libs/' + req.params.file));
})

// webfonts

app.get('/llama-iceways/assets/webfonts/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../llama-iceways/assets/webfonts/' + req.params.file));
})

app.get('/maps/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../maps/' + req.params.file));
})

app.get('/maps/tiles/:z/:x/:y/.png', (req, res) => {
	res.setHeader('Content-Type', 'image/apng')
	request('https://web.peacefulvanilla.club/maps/tiles/World/' + req.params.z + '/' + req.params.x + '_' + req.params.y + '.png').pipe(res)
})


app.get('/maps/leaflet/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../maps/leaflet/' + req.params.file));
})

app.get('/maps/leaflet/images/:file', (req, res) => {
	res.sendFile(path.join(__dirname, '../maps/leaflet/images/' + req.params.file));
})



// Gandalf :D
app.get('/secret', (req, res) => {
	const ytdl = require('ytdl-core');
	res.set('Content-Type', 'video/mp4')
	res.send(ytdl('https://www.youtube.com/watch?v=G1IbRujko-A&t=20s'));
})

app.get('/pvc', getPlayers);
app.get('/ice/long/:startx/:starty/:endx/:endy', function (req, res) {
var PF = require('pathfinding');
const p = req.params;
fs.readFile('arraytester2.txt', 'utf8', async function(err, content) {
	if(err) throw err;
	let fancy = eval(content);
	var grid = new PF.Grid(fancy); 
	var finder = new PF.AStarFinder();
	var path = finder.findPath(p.startx, p.starty, p.endx, p.endy, grid);
	/*console.log('Compressed:')
	console.log(PF.Util.compressPath(path))*/
	res.json({result: PF.Util.expandPath(path)})
	/*res.json({result: PF.Util.expandPath(path)})*/
})
});
app.get('/ice/short/:startx/:starty/:endx/:endy', function (req, res) {
var PF = require('pathfinding');
const p = req.params;
fs.readFile('arraytester2.txt', 'utf8', async function(err, content) {
	if(err) throw err;
	let fancy = eval(content);
	var grid = new PF.Grid(fancy); 
	var finder = new PF.AStarFinder();
	console.log(p);
	var path = finder.findPath(Number(p.startx), Number(p.starty), Number(p.endx), Number(p.endy), grid);
	/*console.log('Compressed:')
	console.log(PF.Util.compressPath(path))*/
	res.json({result: PF.Util.compressPath(path)})
	/*res.json({result: PF.Util.expandPath(path)})*/
})
});
app.get("/pvc/bedrock", bedrockStat)
app.get("/pvc/java", javaStat)
app.get("/mojang", getMojangStat)
app.get("/pvc/main", function(req, res) {
	axios.get('https://web.peacefulvanilla.club/status.html')
	.then((response) => {
		res.status(200).json({
			"status": response.data,
			"error": null
		})
	})
	.catch((error) => {
		res.status(500).json({
			"status": "unknown",
			"error": error
		})
	})
})

app.get("/pvc/maintenance", function(req, res) {
	axios.get('https://web.peacefulvanilla.club/maintenance.html')
	.then((response) => {
		if(response.data == "pizza") {
		res.status(200).json({
			"status": false,
			"error": null
		})
	} else {
		res.status(200).json({
			"status": true,
			"error": null
		})
	}
	})
	.catch((error) => {
		res.status(500).json({
			"status": "unknown",
			"error": error
		})
	});
})


app.post("/log", updateStatus); //Update JSON with new data

app.post("/error", addError); //Update Errors JSON with new data

app.post("/pvc", updateStatus2); //Update Errors JSON with new data

//Email service
var nodemailer = require('nodemailer');
//Logging into emails
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  type: 'OAuth2',
	  user: 'pvclarrytllamanotifications@gmail.com',
	  pass: process.env.PASSWORD,
	  clientId: process.env.CLIENTID,
	  clientSecret: process.env.SECRET,
	  refreshToken: process.env.TOKEN
	}
  });

const editJsonFile = require("edit-json-file");
process.on('uncaughtException', err => {
	console.log('There was an uncaught error', err);
	process.exit(1); // mandatory (as per the Node.js docs)
  });

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));




  //Logging in...


/*const { Client } = require('raknet-native')
const client = new Client('bedrock.peacefulvanilla.club', 19132, 'minecraft')
console.log('listening for data');
let timer = 

client.on('pong', (data) => {
      const msg = data.extra?.toString()
      console.log('Decoded Buffer:')
      console.log(msg);
      console.log('OK')
	  clearTimeout(timer)
    });
	console.log(client);
	
	setTimeout(function() {
	timer = setTimeout(function() {
    console.log('Offline')
	}, 5000);
    client.ping();
	}, 10000)
*/