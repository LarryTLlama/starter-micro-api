const axios = require('axios');
const express = require('express');
const app = express();
const path = require('path')
const request = require('request')

app.get('/tile/:z/:x/:y', async (req, res) => {
    let p = req.params
    let z = p.z
    //let offset = 0;
    
    if(z == 0) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -2;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else if(z == 1) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -3;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else if(z == 2) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -5;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else if(z == 3) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -10;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else if(z == 4) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -20;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else if(z == 5) {
        res.setHeader('Content-Type', 'image/apng')
        let offset = -39;
        request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x) + offset}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z}/${Number(p.x) + offset}_${Number(p.y) + offset}.png`)
    } else {
        res.status(400).send("Invalid Zoom level")
    }
    //request.get({ url: `https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x)}_${Number(p.y)}.png`, encoding: null }).pipe(res)
    //console.log(`https://web.peacefulvanilla.club/maps/tiles/World/${p.z - 1}/${Number(p.x)}_${Number(p.y)}.png`)
})

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "index.html")))

app.get('/:f', (req, res) => res.sendFile(path.join(__dirname, req.params.f)))
app.get('/leaflet/:f', (req, res) => res.sendFile(path.join(__dirname, './leaflet/'+req.params.f)))
app.listen(3000)

process.on('uncaughtException', (e) => {
    console.error(e)
})