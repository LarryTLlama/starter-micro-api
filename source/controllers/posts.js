/** source/controllers/posts.ts */
const { Request, Response, NextFunction } = require('express');
const { axios, AxiosResponse } = require('axios');
const fs = require('fs');
const path = require('path');
const fileGetContents = require('file-get-contents');
const util = require('minecraft-server-util');
//import { pingBedrock } from '@minescope/mineping';

/*interface Post {
    userId: Number;
    id: Number;
    title: String;
    body: String;
}*/

// getting all posts
const getPosts = async (req, res, next) => {
	
    // get some posts
    let result = await fileGetContents("site/index.html");
    let posts = result
    return res.status(200).json({
        message: posts
    });
};

/*//getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts: [Post] = result.data;
    return res.status(200).json({
        message: posts
    });
};*/

// getting a single post
const getPost = async (req, res, next) => {
    // get the post id from the req
    let id = req.params.id;
    // get the post
    let result = await fileGetContents(`get/unions/${id}.json`);
    let post = result
    return res.status(200).json({
        message: post
    });
};

const javaStat = async (req, res, next) => {
    //Get server status
    const options = {
    timeout: 1000 * 5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
    };
    let resp = '';

    // The port and options arguments are optional, the
    // port will default to 25565 and the options will
    // use the default options.
    util.status('mc.peacefulvanilla.club', 25565, options)
    .then((result) => {
      return res.status(200).json({
        "online": true, result
    });
    })
    .catch((error) => { return res.status(200).json({
        online: false, response: Error
    });
});
   
};

const javaStat2 = async (req, res, next) => {
    //Get server status
    const options = {
    timeout: 1000 * 5, // timeout in milliseconds
    enableSRV: true // SRV record lookup
    };
    let resp = '';

    // The port and options arguments are optional, the
    // port will default to 25565 and the options will
    // use the default options.
    util.status('session.minecraft.net', 25565, options)
    .then((result) => {
      return res.status(200).json({
        "online": true, result
    });
    })
    .catch((error) => { return res.status(200).json({
        online: false, response: Error
    });
});
   
};

const bedrockStat = async (req, res, next) => {
  
const { Client } = require('raknet-native')
console.log('Beginning Try Catch')
try {
const client = new Client('bedrock.peacefulvanilla.club', 19132, 'minecraft')
//console.log(client.ping);
    client.on('pong', (data) => {
      const msg = data.extra.toString()
      var parts = msg.split(";");
const json = {
	"online": true,
	"edition": parts[0],
	"motd_line_one": parts[1],
	"motd_line_two": parts[7],
	"players": {
		"online": parts[4],
		"max": parts[5],
	},
	"guid": parts[6],
	"gamemode": {
		"text": parts[8],
		"id": parts[9]
	},
	"port": parts[10]
}
    return res.status(200).json(json);
      //if (!msg || msg != message) throw Error(`PONG mismatch ${msg} != ${message}`)
      client.close()
	});
	client.ping();
} catch(e) {
return res.status(200).json({
      "online": false, message: e
    });
}
};

// updating a post
const updateStatus = async (req, res, next) => {
    // get the post id from the req.params
    var json = "source/routes/site/master.json";
  
    // get the data from req.body
    let content = req.body.json || null;
  
    fs.writeFile(json, content, (err) => {
     if (err) throw err;
     console.log('It\'s saved as:\n' + content);
    });
    // return response
    return res.status(200).json({
      message: "Updated successfully"
    });
};

const updateStatus2 = async (req, res, next) => {
    // get the post id from the req.params
    var json = "source/pvc.json";
  
    // get the data from req.body
    let content = JSON.stringify(req.body) || null;
    //console.log(req.body)
    fs.writeFile(json, content, (err) => {
     if (err) throw err;
     console.log('It\'s saved as:\n' + content);
    });
    // return response
    return res.status(200).json({
      message: "Updated successfully"
    });
};

// updating a post
const addError = async (req, res, next) => {
    // get the post id from the req.params
    var json = "source/routes/site/errors.json";
  
    // get the data from req.body
    let content = req.body.json || null;
    fs.readFile(json, function read(err, data) {
    if (err) {
      console.log(err)
      return res.status(404).json({
      message: "404 - Couldn't read errors.json"
      });
    }
      const ncontent = JSON.parse(`${content}`)
       const ndata = JSON.parse(`${data}`);
      
    var newdata = `
    {
  "error1": {
    "text": "${ncontent.text}",
    "timestamp": "${ncontent.timestamp}"
  },
  "error2": {
    "text": "${ndata.error1.text}",
    "timestamp": "${ndata.error1.timestamp}"
  },
  "error3": {
    "text": "${ndata.error2.text}",
    "timestamp": "${ndata.error2.timestamp}"
  },
  "error4": {
    "text": "${ndata.error3.text}",
    "timestamp": "${ndata.error3.timestamp}"
  },
  "error5": {
    "text": "${ndata.error4.text}",
    "timestamp": "${ndata.error4.timestamp}"
  }
}`      

const date = new Date(Date.now())
    fs.writeFile(json, newdata, (err) => {
     if (err) throw err;
     console.log('Error Logged:\n' + content);
    });
    /*const mkdirp = require('mkdirp');
    

    function writeFile() {

    fs.writeFile(`././logs/${date}`, content, (err) => {
     if (err) throw err;
     console.log('Error Logged:\n' + content);
    });
    });
    }
      
      writeFile();*/
      
    // return response
    return res.status(200).json({
      message: "Successfully added an error"
    });
    });
};

// deleting a post
const deletePost = async (req, res, next) => {
    // get the post id from req.params
    let id = req.params.id;
    // delete the post
    let response = await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
    // return response
    return res.status(200).json({
        message: 'post deleted successfully'
    });
};

const getMojangStat = async (req, res, next) => {
    // get the post id from req.params
    let id = req.params.id;
    // delete the post
  const axios = require('axios');
  const mojang = require('mojang');
    await axios.get(`https://authserver.mojang.com/`, {responseType: "application/json"})
  .then(function (response) {
    // handle success
      console.log(response.data)
      console.log(response.data.Status);
    return res.status(200).json(response.data);
  })
  /*.catch(function (error) {
    // handle error
      console.log(error)
   return res.status(503).json({status: 'NOT OK', error: `${error}`, code: error.status});
  })*/
};

// adding a post
const addPost = async (req, res, next) => {
    // get the data from req.body
    let title = req.body.title;
    let body = req.body.body;
    // add the post
    let response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

module.exports = { updateStatus2, getPosts, getPost, addError, updateStatus, deletePost, addPost, bedrockStat, javaStat, getMojangStat };