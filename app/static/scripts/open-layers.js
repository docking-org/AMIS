var map;
var mapBounds = new OpenLayers.Bounds( 0.0, -8192.0, 8192.0, 0.0);
var mapMinZoom = 0;
var mapMaxZoom = 7;
var emptyTileURL = "static/images/no_image.png";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function init(img_dir){
    var options = {
      div: "map",
      controls: [],
      maxExtent: new OpenLayers.Bounds(0.0, -8192.0, 8192.0, 0.0),
      maxResolution: 32.000000,
      numZoomLevels: 8
    };
    map = new OpenLayers.Map(options);

    var layer = new OpenLayers.Layer.TMS("TMS Layer", "",
    {
        serviceVersion: '.',
        layername: '.',
        alpha: true,
        type: 'png',
        img_dir: img_dir,
        getURL: getURL
    });

    map.addLayer(layer);
    map.zoomToExtent(mapBounds);

    map.addControls([new OpenLayers.Control.PanZoomBar(),
                   new OpenLayers.Control.Navigation(),
                   new OpenLayers.Control.MousePosition(),
                   new OpenLayers.Control.ArgParser(),
                   new OpenLayers.Control.Attribution()]);
}

function getURL(bounds) {
    bounds = this.adjustBounds(bounds);
    var res = this.getServerResolution();
    var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
    var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.getServerZoom();
    var path = this.img_dir + "/" + this.serviceVersion + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type;
    var url = this.url;
    if (OpenLayers.Util.isArray(url)) {
      url = this.selectUrl(path, url);
    }
    if (mapBounds.intersectsBounds(bounds) && (z >= mapMinZoom) && (z <= mapMaxZoom)) {
      return url + path;
    } else {
      return emptyTileURL;
    }
}

function getWindowHeight() {
if (self.innerHeight) return self.innerHeight;
    if (document.documentElement && document.documentElement.clientHeight)
        return document.documentElement.clientHeight;
    if (document.body) return document.body.clientHeight;
        return 0;
}

function getWindowWidth() {
    if (self.innerWidth) return self.innerWidth;
    if (document.documentElement && document.documentElement.clientWidth)
        return document.documentElement.clientWidth;
    if (document.body) return document.body.clientWidth;
        return 0;
}

function resize() {
    var map = document.getElementById("map");
    var header = document.getElementById("header");
    var subheader = document.getElementById("subheader");
    map.style.height = (getWindowHeight()-150) + "px";
    map.style.width = (getWindowWidth()-20) + "px";
    // header.style.width = (getWindowWidth()-20) + "px";
    subheader.style.width = (getWindowWidth()-20) + "px";
    if (map.updateSize) { map.updateSize(); };
}

onresize=function(){ resize(); };