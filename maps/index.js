window.onload = function() {

let map = L.map('map', {
    crs: L.Util.extend(L.CRS.Simple, {
        // we need to flip the y-axis correctly
        // https://stackoverflow.com/a/62320569/3530727
        transformation: new L.Transformation(1, 0, 1, 0)
    }),
}).setView([0,0], 0);

function centre() {
    map.setView([0,0]);
}


const TileLayerCustom = L.TileLayer.extend({
    getTileUrl(coords) {
        /*if(coords.z == 0) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        } else if(coords.z == 1) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        } else if(coords.z == 2) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        } else if(coords.z == 3) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        } else if(coords.z == 4) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        } else if(coords.z == 5) {
            return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}_${coords.y}.png`;
        }*/
        return `http://web.peacefulvanilla.club/maps/tiles/World/${coords.z}/${coords.x}/${coords.y}`;
    },
    options: {
        noWrap: true,
        bounds: [[-1000, -1000], [1000, 1000]],
        minZoom: 1,
        maxZoom: 5,
        
    }
  });
  
  const mp = new TileLayerCustom().addTo(map);
  console.log(map)

setInterval(() => {
    map.invalidateSize()
}, 1000)
}

