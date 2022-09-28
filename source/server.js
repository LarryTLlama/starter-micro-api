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

// If the file doesn't exist, the content will be an empty object by default.
/*

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

	var mailOptions = {
		from: 'pvclarrytllamanotifications@gmail.com',
		to: p.email,
		subject: 'PVC Notification Service - Added!',
		text: `Yo, thanks for joining our mailing list! You'll get an email when the Bedrock server goes offline. \nCheck status now: https://larrytllama.github.io/pvc-status \nUnsubcribe: https://larrytllama.cyclic.app/email/remove/${p.email}/bedrock`		  
	};
	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log(`Sign-up email sent to ${item}: ` + info.response);
		}
	  });

return res.status(200).send(`Email address added to mailing list!\n Check your inbox for a confirmation!\n\n Subscribed by mistake? Unsubscribe here: https://larrytllama.cyclic.app/email/remove/${p.email}/${p.type}`)
} else {
	//We've already got this email address, try again later!
	return res.status(409).send(`Whoops, you're already added!\n Did you mean to unsubscribe? https://larrytllama.cyclic.app/email/remove/${p.email}/${p.type}`)
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
var mailOptions = {
	from: 'pvclarrytllamanotifications@gmail.com',
	to: p.email,
	subject: 'PVC Notification Service - Added!',
	text: `Yo, thanks for joining our mailing list! You'll get an email when the Java server goes offline. \nCheck status now: https://larrytllama.github.io/pvc-status \nUnsubcribe: https://larrytllama.cyclic.app/email/remove/${p.email}/bedrock`		  
};
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log(`Sign-up email sent to ${item}: ` + info.response);
	}
  });
return res.status(200).send(`Email address added to mailing list!\n Check your inbox for a confirmation!\n\n Subscribed by mistake? Unsubscribe here: https://larrytllama.cyclic.app/email/remove/${p.email}/${p.type}`)
} else {
	//We've already got this email address, try again later!
	return res.status(409).send(`Whoops, you're already added!\n Did you mean to unsubscribe? https://larrytllama.cyclic.app/email/remove/${p.email}/${p.type}`)

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
return res.status(409).send('Your email isn\'t on our list yet!')
} else {
	//We've already got this email address, try again later!
	content.splice (content.indexOf(p.email), 1);
	file.set("list", content);
	file.save();
	return res.status(200).send('We have removed your email from our list. Sad to see you go!')
}
} else if(p.type == "java") {
	let file = editJsonFile(`${__dirname}/java.json`);
let content = await file.get().list;
//If we don't have the email address
if(content.indexOf(p.email) == -1) {
//Tell them to subscribe first!
return res.status(409).send('We couldn\'t find your email on our list. Maybe you meant to add it first?')
} else {
	//We've already got this email address, try again later!
	content.splice (content.indexOf(p.email), 1);
	file.set("list", content);
	file.save();
	return res.status(200).send("We have removed your email. Sad to see you go!")
}
}

});

Error handling
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
		console.log("JAVA Error " + minutesdown + ": " + error)
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
			  console.log(`Java error Email sent to ${item}: ` + info.response);
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
axios.get('https://api.mcstatus.io/v1/status/bedrock/bedrock.peacefulvanilla.club')
.then((response) => {
	//We got it! Yay!
	if(response.data.online) {
		newminutesdown = 0;
	} else if(response.data.online == false) {
		newminutesdown++;
		console.log('Bedrock down!')
	} else {
		console.log('Wuh oh, something went wrong')
	}
})
.catch((error) => {
	console.log(error)
})
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
			text: `This is a notification to let you know that we failed to connect to Peaceful Vanilla Club (bedrock).\nCheck status now: https://larrytllama.github.io/pvc-status \nConnection error: ${newe} \nTime: ${d}.\nUnsubcribe: https://larrytllama.cyclic.app/email/remove/${item}/bedrock`		  
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

setTimeout(function() {console.log("1 minute!")}, 60000)
*/
process.on('uncaughtException', err => {
	console.log('There was an uncaught error', err);
	process.exit(1); // mandatory (as per the Node.js docs)
  });

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));



var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  type: 'OAuth2',
	  user: 'pvclarrytllamanotifications@gmail.com',
	  pass: 'f5sQn5#9S74M$ib9',
	  clientId: '768508631766-j265knan315khl75ua0aggetalq0vjhi.apps.googleusercontent.com',
	  clientSecret: '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',
	  refreshToken: '1//04caSTplnplGICgYIARAAGAQSNwF-L9IrwHD7gAzqD9ZG_0JAL1tpAJ-7VxRXchxvU6K26FECm7QXkExKxTKjkBB2etHgxa04YIE'
	}
  });
  //Logging in...
let counter = 0;

console.log('Alright, lets go!')

setInterval(function() {
axios.get('https://web.peacefulvanilla.club/status.html')
  .then(function (response) {
	if(response.data.includes('online')) {
		counter = 0;
	} else if(response.data.includes('offline')) {
		counter++;
		console.log('[OrwellBeta] The server is offline! I have said this', counter, 'time(s) in a row!')
	} else {
		console.error("The server isn't online nor offline *confused screaming*")
	}
  })
  .catch(function (error) {
    console.log(error);
	console.log('There was an error! Panik! No changes have been made, no emails have been sent. Kalm :)')
  })
  //Does it after 10 fails. No, not *on* 10, after 10.
  if(counter === 10) {
	  console.log('Wuh oh, its properly offline! Loading up email systems...')
	  //peacefulvanillaclub@gmail.com
	  axios.get('https://web.peacefulvanilla.club/maintenance.html')
  .then(function (response) {
    console.log(response.data);
	if(response.data.includes('pizza')) {
		var mailOptions = {
			from: 'pvclarrytllamanotifications@gmail.com',
			to: "larrytllama5@gmail.com",
			subject: 'Peaceful Vanilla Club is Offline!',
			text: `This is a notification to let you know that we failed to connect to Peaceful Vanilla Club (java).\nCheck status now: https://larrytllama.github.io/pvc-status \nTime: ${new Date().toString()}.`		  
		};
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log('OH NO! We failed at the last hurdle! Error with the email sending!')
			  console.log(error);
			} else {
			  console.log(`Email sent to ${item}: ` + info.response);
			}
		  });

		  var mailOptions = {
			from: 'pvclarrytllamanotifications@gmail.com',
			to: "peacefulvanillaclub@gmail.com",
			subject: 'Peaceful Vanilla Club is Offline!',
			text: `This is a notification to let you know that we failed to connect to Peaceful Vanilla Club (java).\nCheck status now: https://larrytllama.github.io/pvc-status \nTime: ${new Date().toString()}.`		  
		};
		  transporter.sendMail(mailOptions, function(error, info){
			if (error) {
			  console.log('OH NO! We failed at the last hurdle! Error with the email sending!')
			  console.log(error);
			} else {
			  console.log(`Email sent to ${item}: ` + info.response);
			}
		  });
	} else if(response.data.includes('maintenance')) {
		console.log('False alarm! All is fine! Its just a bit of maintenance!')
	} else {
		console.error("The server isn't in pizza mode. Its not in maintenance mode either. ¯\_(ツ)_/¯")
		console.error("To be quite honest, idk what to do here. I'll leave this message and *hopefully* it gets sorted.")
	}
  })
  .catch(function (error) {
    console.log(error);
	console.log('There was an error! Panik! No changes have been made, no emails have been sent. Kalm :)')
  })
	  
  }
}, 30000)
//FS.APPENDFILE( FILE< DATA< CALLBACK)
process.on('uncaughtException', err => {
	console.log('There was an uncaught error', err);
	//process.exit(1); // mandatory (as per the Node.js docs) // You what? Mandatory? Nahhh
	console.log('Apologies for the technical difficulties. Back to regular showings of *more server checks*. Yaaaaaaaay')
});


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