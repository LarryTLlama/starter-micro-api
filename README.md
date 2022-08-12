# NodeStatus

This is the NodeJS Statuspage, created by LarryTLlama.
It is built upon an NodeJS express server recieving JSON requests from the service.

## How it works
The service to be monitored will send constant JSON POST requests to the server 

## Preview
This was created at first, for my discord bot (though this will work for any node-js process).
Visit `https://llamabot-statuspage.glitch.me` to load up the statuspage.
(Note that it may take a while to load, due to the nature of the free hosting software used)
The page automatically refreshes every minute, to allow the HTML to update its details

## Getting Started

- Install NodeJs to your machine, or have a server that already has it on. Make sure NPM is installed too.
- Clone repo to a folder somewhere
- Use `npm install` or `npm i` to install dependencies. These include nodemon and axios
- Run `npm start` to instruct nodemon to run the server

Then, to view the HomePage, head to `<IP>:<Port>/home` in any fairly decent web browser (No, not Internet Explorer!)
(If on a local machine, this will most likely be localhost:3000/home)

### Posting the status
Sending a POST request is easy to do, thanks to the axios module.

- Install axios: `npm i axios`
- In your file, define a bit of JSON code, and send a post request.

  Your json should look somewhat like this:
  ```
  const jsondata = `{ 
  "status": "on", 
  "timestamp": "Sat May 14 2022 09:16:55 GMT+0100 (British Summer Time)" 
  }``
  ```
  #### What these are (and how you can change them):

  Status: String, represents the current state of the service.
  Can be any of these variables:
  "on" - Sets the server to be fully on and working
  "error" - Sets the server to be having issues
  "fatal" - Sets the server to being offline

  Timestamp: String, will be displayed as the "Last update" section on the page's status section
  NOTE: For best results, pass this as a date object. You may wish to pass this as so:
  ```
  const date = new Date(Date.now())
  ```
  And then pass the date through the request as a variable in the timestamp section:
  ```
  ...
  "timestamp": "${date}"
  ...
  ```

Once you've got the json data, simply pass it along to axios in a post request, like so:
```
axios.post('IP:PORT/log', {
json: jsondata,
})
.then(function (response) {
console.log(response.data.message);
})
.catch(function (error) {
console.log(error);
});
```
If successful, a response such as "Updated successfully" will appear in the console.
Now heading back to the main page, you'll find that the service has updated, showing a green tab with the request's timestamp on.
You should probably set up a timer to send this repeatedly, around every 5 mins.
(It may be worth noting that if the page doesn't detect a recent POST request in the last 5 mins, it will display on the page as being offline.)

### Sending an error to the Statuspage
Similarly to Updating the status, the error logging works off a POST request

Send another json request, looking like this
```
const errordata = `{ 
"text": "Error: You missed out a } didn't you...",
"timestamp": "Sat May 14 2022 09:16:55 GMT+0100 (British Summer Time)" 
}`
```

#### What these mean (and should be passed as):
Text: String, The error that is passed along to the display to show what went wrong.
Can be passed as any string. See the example below for more details

Timestamp: String, will be displayed as the "Last update" section on the page's status section
NOTE: For best results, pass this as a date object. You may wish to pass this as so:
const date = new Date(Date.now())
And then pass the date through the request as a variable in the timestamp section:
  `
...
"timestamp": "${date}"
...
  `
(TL;DR - This is the same as the timestamp for regular logging)

Then you can also pass this as a JSON POST request like so

```
axios.post('IP:PORT/log', {
json: errordata,
})
.then(function (response) {
console.log(response.data.message);
})
.catch(function (error) {
console.log(error);
});
```

If this has successfully been sent, another success message will be sent.

This can also be automated, by adding a few more lines to the end of your code.
```
process.on('uncaughtException', err => {
const data = `{ "text": err, "timestamp": "${new Date(Date.now())}" }`
axios.post('IP:PORT/log', {
json: data,
})
.then(function (response) {
console.log(response.data.message);
})
.catch(function (error) {
//Yeah, maybe you should test this out first, before you start getting errors that don't log :')
console.log(error);
});
console.error('There was an uncaught error', err);
process.exit(1);
});
```
And there you have it! Your very own DIY StatusPage

## More Info (FAQs):
### How do I customize the StatusPage?
You'll find all the website stuff in the `source/routes/site/index.html` file.

### Where is the data stored?
Thats also in the site folder, @ `source/routes/site/master.json` for the main status stuff and `source/routes/site/errors.json` for the last 5 logged errors

### How do I add another page to this server?
Good question! Lets walk through it.

1. Define a route: Head to the source/routes/posts.ts file
2. You'll find a commented bit towards the top of the file. Copy this code segment and paste it just below the comments.
3. Specify details:
   - Where it says "/newpage" is the suffix to the url, in which the server will route to when requested in the URL bar.
     E.G <IP>:<Port>/newpage
     Make sure this value is different for every route. Otherwise the router will get confused and throw an error :(
   - Where it says "PATH/TO/HTML/FILE" is the path to your website, which the server will also send to the client.
4. Restart the server, and navigate to your specified route in the browser.

### My linked in CSS files are showing as 404 errors when changing them.
You'll also need to define these CSS files in the routes.

- Do the above, but set your "Path to HTML file" to your CSS file
- In your Style's src, link to this new route instead of your file path.

posts.ts:
``` 
  router.get("/styles", function (req, res) { res.sendFile(path.join(__dirname + "PATH/TO/CSS/FILE")); }) 
  ```

HTML Page:
```<style src="/styles" />```
  
  Or just stick all your CSS into the <style> bit and save some extra confusion :)
