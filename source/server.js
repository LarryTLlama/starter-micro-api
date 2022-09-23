/** source/server.ts */
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const fileGetContents = require('file-get-contents');
const util = require('minecraft-server-util');
const path = require('path');
const axios = require('axios');
const fs = require('fs')
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
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
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

app.post("/log", updateStatus); //Update JSON with new data

app.post("/error", addError); //Update Errors JSON with new data

app.post("/pvc", updateStatus2); //Update Errors JSON with new data

//Email service
var nodemailer = require('nodemailer');
const editJsonFile = require("edit-json-file");

// If the file doesn't exist, the content will be an empty object by default.


app.use("/email/add/:email/:type", async function(req, res) {
	//Adding emails
	//Getting email from url
const p = req.params;
if(p.type == "bedrock") {
//Get the json file
let file = editJsonFile(`${__dirname}/bedrock.json`);
let content = await file.get().list;
//If we dont already have the email address
if(content.indexOf(p.email) == -1) {
//Add the email to the content
content.push(p.email)
//And save it!
file.set("list", content);
file.save();
//Everything is okay!
return res.status(200).json({
	message: "Email subscribed!"
});
} else {
	//We've already got this email address, try again later!
	return res.status(409).json({
        message: "Email already subscribed!"
    });
}
} else if(p.type == "java") {
	//Get the json file
let file = editJsonFile(`${__dirname}/java.json`);
let content = await file.get().list;
//If we dont already have the email address
if(content.indexOf(p.email) == -1) {
//Add the email to the content
content.push(p.email)
//And save it!
file.set("list", content);
file.save();
//Everything is okay!
return res.status(200).json({
	message: "Email subscribed!"
});
} else {
	//We've already got this email address, try again later!
	return res.status(409).json({
        message: "Email already subscribed!"
    });
}
}
});

app.use("/email/remove/:email/:type", async function(req, res) {
	//Adding emails
	//Getting email from url
const p = req.params;
//Get the json file
if(p.type == "bedrock") {
let file = editJsonFile(`${__dirname}/bedrock.json`);
let content = await file.get().list;
//If we don't have the email address
if(content.indexOf(p.email) == -1) {
//Tell them to subscribe first!
return res.status(409).json({
	message: "Email not found. Maybe subscribe first?"
});
} else {
	//We've already got this email address, try again later!
	content.splice (content.indexOf(p.email), 1);
	file.set("list", content);
	file.save();
	return res.status(200).json({
        message: "Email removed. Sad to see you go :')"
    });
}
} else if(p.type == "java") {
	let file = editJsonFile(`${__dirname}/java.json`);
let content = await file.get().list;
//If we don't have the email address
if(content.indexOf(p.email) == -1) {
//Tell them to subscribe first!
return res.status(409).json({
	message: "Email not found. Maybe subscribe first?"
});
} else {
	//We've already got this email address, try again later!
	content.splice (content.indexOf(p.email), 1);
	file.set("list", content);
	file.save();
	return res.status(200).json({
        message: "Email removed. Sad to see you go :')"
    });
}
}

});

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

const EventEmitter = require('events');
//Java events
const java = new EventEmitter();
//Bedrock events
const bedrock = new EventEmitter();
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

//Alright, time for java
const options = {
    timeout: 1000 * 5, 
    enableSRV: true
};

let minutesdown = 0;
let e;
setInterval(async function() {
util.status('mc.peacefulvanilla.club', 25565, options)
    .then((result) => {
		//Do nothing :DDD
		minutesdown = 0;
	})
    .catch(async (error) => {
		//Here we go!
		minutesdown++;
		e = error;
	});
	if(minutesdown == 5) {
		//Wuh oh, we're seriously down!
		let file = editJsonFile(`${__dirname}/java.json`);
		let content = await file.get().list;
		let d = new Date().toString()
		content.forEach(function(item, index) {
		var mailOptions = {
			from: 'pvclarrytllamanotifications@gmail.com',
			to: item,
			subject: 'Peaceful Vanilla Club is Offline!',
			text: `This is a notification to let you know that we failed to connect to Peaceful Vanilla Club (java).\nCheck status now: https://larrytllama.github.io/pvc-status \nConnection error: ${e} \nTime: ${d}.\nUnsubcribe: https://larrytllama.cyclic.app/email/remove/${item}/java `
		  };
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log(`Email sent to ${item}: ` + info.response);
			}
		  });
	})
	}

}, 60000)

//And now, bedrock
const newoptions = {
    enableSRV: true
};

let newminutesdown = 0;
let newe;
setInterval(async function() {
util.status('bedrock.peacefulvanilla.club', 19132, newoptions)
    .then((result) => {
		//Do nothing :DDD
		newminutesdown = 0;
		console.log(result)
	})
    .catch(async (error) => {
		//Here we go!
		newminutesdown++;
		newe = error;
		console.log('Issue on bedrock: ', error)
	});
	if(newminutesdown == 5) {
		//Wuh oh, we're seriously down!
		let file = editJsonFile(`${__dirname}/bedrock.json`);
		let content = await file.get().list;
		let d = new Date().toString()
		content.forEach(function(item, index) {
		var mailOptions = {
			from: 'pvclarrytllamanotifications@gmail.com',
			to: item,
			subject: 'Peaceful Vanilla Club is Offline!',
			text: `This is a notification to let you know that we failed to connect to Peaceful Vanilla Club (bedrock).\nCheck status now: https://larrytllama.github.io/pvc-status \nConnection error: ${newe} \nTime: ${d}.\nUnsubcribe: https://larrytllama.cyclic.app/email/remove/${item}/bedrock`		  };
		  /*transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			  console.log(`Email sent to ${item}: ` + info.response);
			}
		  });*/
	})
	}

}, 10000)

setTimeout(function() {console.log("1 minute!")}, 60000)

process.on('uncaughtException', err => {
	console.log('There was an uncaught error', err);
	process.exit(1); // mandatory (as per the Node.js docs)
  });

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));


