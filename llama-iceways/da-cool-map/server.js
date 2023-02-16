let values = [ -1, -1, -3, -5, -8, -15];
let fetch = require("node-fetch");
let fs = require('fs');
let path = require("path")
async function download(width, height, zoom) {
    const response = await fetch(`https://web.peacefulvanilla.club/maps/tiles/World_nether/${zoom}/${width}_${height}.png`);
    const buffer = await response.buffer();
    fs.writeFile(`./tiles/${zoom}/${width}_${height}.png`, buffer, () => {})
  }
async function go() {
values.forEach(async (x, index) => {
    const original = x
    let width = original;
    let w1 = 0;
    let height = original;
    let h1 = 0;
    while(width < Math.abs(original)) {
        console.log(`Downloading image at location:  X = ${width}   Y = ${height}    Zoom level ${index}`)
        download(width, height, index)
        height = height + 1;
        h1 = h1 + 512
        if(height == Math.abs(original)) {
        height = original;
        h1 = 0;
        width = width + 1;
        w1 = w1 + 512
        }
    }
})
}

go()