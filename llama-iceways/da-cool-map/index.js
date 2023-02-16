window.onload = async function() {
    function imageToDataUri(img, width, height) {

        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
    
        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;
        let newimg = document.createElement('img')
        newimg.src = img;

        // draw source image into the off-screen canvas:
        ctx.drawImage(newimg, 0, 0, width, height);
    
        // encode image to data-uri with base64 version of compressed image
        console.log(canvas.toDataURL())
        return canvas.toDataURL();
    }

let map = L.map('map', {
    crs: L.Util.extend(L.CRS.Simple, {
        // we need to flip the y-axis correctly
        // https://stackoverflow.com/a/62320569/3530727
        transformation: new L.Transformation(1, 0, 1, 0)
    }),
    zoom: 5
}).setView([0,0], 0);

function centre() {
    map.setView([0,0]);
}


const TileLayerCustom = L.TileLayer.extend({
    getTileUrl(coords) {
        //let x = imageToDataUri(`http://localhost:443?url=http://web.peacefulvanilla.club/maps/tiles/World_nether/${coords.z}/${coords.x}_${coords.y}.png`, 512, 512)
        return `./tiles/${coords.z}/${coords.x}_${coords.y}.png`;
    },
    options: {
        noWrap: true,
        bounds: [[-1000, -1000], [1000, 1000]],
        minZoom: 1,
        maxZoom: 5,
        tileSize: 768
    }
  });
  
  function onMapClick(e) {
    navigator.clipboard.writeText("[" + e.latlng.toString().split("LatLng(")[1].split(")")[0] + "],");
  }

  map.on('click', onMapClick);
  const mp = new TileLayerCustom()
  mp.addTo(map);
  console.log(map)
    setTimeout(function() {
        map.panBy( L.point( 86, 10 ) );
    }, 5000);
    setInterval(() => {
        map.invalidateSize()
    }, 1000)

    let lines = [[
        [-23, -33.34375],
        [-23, 42.136031]
    ],
    [
        [-23, -31.65625],
        [-23.556332, -33.3125]
    ],
    [
        [-42.779785, -33.34375],
        [41.414527, -33.34375],
    ],
    [
        [-23.556332, -33.3125],
        [-23.556332, -42.0625],
    ],
    [
        [-42.779785, -42.0625],
        [-42.779785, 42.136031],
    ],
    [
        [-42.779785, -42.0625],
        [41.414527, -42.0625],
    ],
    [
        [-42.779785, 42.136031],
        [41.414527, 42.136031],
    ],
    [   
        [41.414527, -42.0625],
        [41.414527, 42.136031],
    ],
    [
        [0, 42.9375],
        [0, 5.8125],
    ],
    [
        [3.132002, 3.4375],
        [3.132002, 5.8125],
        [-11.28108, 5.8125],
    ],
    [
        [-11.28108, 0],
        [-11.28108, 32.90625],
    ],
    [
        [-0.083391, 32.90625],
        [-42.779785, 32.90625],
    ],
    [
        [-5.369821, 0],
        [-18.450789, 0],
        [-18.450789, -0.5],
        [-42.779785, -0.5],

    ],
    [
        [-3.806366, 3.5],
        [-23, 3.21875],
    ],
    [
        [-5.369821, -2.3125],
        [-5.336662, 3.5],
    ],
    [
        [-4.618236, 3.5],
        [-4.618236, 5.8125],
    ],
    [
        [-5.369821, -2.3125],
        [-1.80594, -2.3125],
    ],
    [
        [-1.80594, -2.3125],
        [-1.80594, -42.0625],
    ],
    [
        [-1.80594, -7.1875],
        [-0.99511, -7.1875],
        [-1.80594, -9],
    ],
    [
        [-0.99511, -7.1875],
        [-0.99511, -3.1875],
        [-0.370315, -3.1875],
        [-0.370315, -5.28125],
        [2.944605, -5.28125],
        [2.944605, -0.96875],
        [5.571036, -0.96875],
        [5.571036, 3.4375],
    ],
    [
        [3.132002, 3.4375],
        [10.980029, 3.46875],
        [10.980029, 42.136031],
    ],
    [
        [4.410731, 0.15625],
        [41.414527, 0.15625],
    ],
    [
        [10.980029, 4.401372],
        [41.414527, 4.401372],
    ],
    [
        [-11.245432, 26.528161],
        [41.414527, 26.528161],
    ],
    [
        [0, 16.557482],
        [-5.184385, 16.557482],
        [-8.030497, 18.056811],
        [-11.245432, 18.056811],
    ],
    [
        [-11.245432, 18.466262],
        [-13.589649, 18.446262],
        [-13.589649, 17.872778],
        [-42.779785, 17.872778],
    ],
    [
        [-23, 3.21875],
        [-31.913128, -0.5],
    ],
    [
        [-12.6875, 16.589299],
        [-12.6875, -33.31],
    ],
    [
        [41.414527, 15.180511],
        [-42.779785, 15.180511],
    ],
    [
        [27.65625, 42.136031],
        [27.65625, 4.5],
    ],
    [
        [-10.59375, 32.90625],
        [-10.59375, 39.593975],
        [-10.3125, 39.593975],
        [-10.3125, 42.136031],
    ],
    [
        [19.8125, -29.8125],
        [19.8125, -33.31],
    ],
    [
        [-34.952206, -0.5],
        [-34.952206, -42.0625],
    ],
    [
        [-23.556332, -37.837269],
        [-34.952906, -37.837269],
    ]
    ]
    let colorPicker = document.getElementById("colour")
    var polyline = L.polyline(lines, {color: '#94dee7'}).addTo(map);
    colorPicker.addEventListener("change", watchColorPicker, false);
    let player = null;
    let llamabut = document.querySelector(".button1")
    let boatbut = document.querySelector(".button2")
    let stevebut = document.querySelector(".button3")
    llamabut.addEventListener("click", changeType, false)
    boatbut.addEventListener("click", changeType, false)
    stevebut.addEventListener("click", changeType, false)
    function watchColorPicker(event) {
        console.log(polyline)
        polyline.setStyle({color: event.target.value});
    }
    map.fitBounds(polyline.getBounds());

   
    var llama = L.icon({
        iconUrl: 'llama.png',
        iconSize: [25, 25],
    });
    var boat = L.icon({
        iconUrl: 'boat.png',
        iconSize: [25, 25],
    });
    var steve = L.icon({
        iconUrl: 'steve.png',
        iconSize: [25, 25],
    });

    function changeType(type) {
        if(!player) return;
        if(type.target.innerText == "Llama") {
            player.setIcon(llama)
        } else if(type.target.innerText == "Boat") {
            player.setIcon(boat)
        } else if(type.target.innerText == "Steve") {
            player.setIcon(steve)
        }
    }

    function addPlayer(name) {
        player = L.marker([0, 0], {icon: llama}).addTo(map)
        setInterval(async () => {
            let x = await fetch("http://larrytllama.cyclic.app/pvc");
            let x2 = await x.json();
            console.log(x2)
            console.log(name)
            let y = false;
            x2.players.forEach((x3) => {
                if(x3.name == name) {
                    console.log(player.setLatLng([x3.z/21.5, x3.x/21.5]))
                    y = true
                }
            })
            console.log(y)
        }, 1000)
    }
    addPlayer(window.location.search.split("?player=")[1])
}

