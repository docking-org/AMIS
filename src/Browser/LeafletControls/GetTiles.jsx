import L, { Bounds, bounds } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

//Create a custom layer that will fetch tiles from the server and display them on the map
function CustomLayers(props) {
  function TiledSlice() {
    const createTiledSlice = L.TileLayer.extend({
      options: {
        minZoom: 0,
        maxZoom: 4,
        noWrap: true,
        bounds: [
          [-10000, -10000],
          [10000, 10000],
        ],
        tms: true,
      },

      getTileUrl: function (tilePoint, tile) {
        //enable tms

        const zoom = tilePoint.z;
        const x = tilePoint.x;
        const y = tilePoint.y;

        if (props.url) {
          let url = "/lut" + "/" + zoom + "/" + x + "/" + y + ".png";
          console.log(props);
          url += "?lut=" + props.lut;
          url += "&url=" + props.url;
          url += "&min=" + props.min;
          url += "&max=" + props.max;
          url += "&brightness=" + props.brightness;
          url += "&contrast=" + props.contrast;
          url += "&opacityThreshold=" + props.opacityThreshold;
          url += "&cliplow=" + props.min;
          url += "&cliphigh=" + props.max;
          url += "&autobrightness=" + props.auto;

          let result = fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              let element = document.getElementById(
                "tile" + x + "-" + y + "-" + zoom + "-" + props.wavelength
              );

              element.src = data.image;
              element.style.filter =
                "brightness(" +
                props.brightness +
                "%) contrast(" +
                props.contrast +
                "%)";
              // element.style = "filter: brightness(" + props.brightness + "%) contrast(" + props.contrast + "%)";
              // document.getElementById(
              //   "tile" + x + "-" + y + "-" + zoom + "-" + props.wavelength
              // ).style = "filter: brightness(" + props.brightness + "%) contrast(" + props.contrast + "%)";
            });
        } else {
          return "";
        }
      },
      createTile: function (coords, done) {
        const tile = document.createElement("img");

        tile.class = "leaflet-tile";
        console.log("y axis", coords.y);
        tile.id =
          "tile" +
          coords.x +
          "-" +
          coords.y +
          "-" +
          coords.z +
          "-" +
          props.wavelength;
        tile.onload = function () {
          done(null, tile);
        };
        tile.onerror = function () {
          done(new Error("Tile could not be loaded"));
        };
        this.getTileUrl(coords, tile);
        return tile;
      },
    });

    return new createTiledSlice();
  }
  useEffect(() => {
    const menu = TiledSlice();

    menu.addTo(props.map);
    return function cleanup() {
      props.map.removeControl(menu);
    };
  });
}

function withMap(Component) {
  return function WrappedComponent(props) {
    const map = useMap();
    return <Component {...props} map={map} />;
  };
}

export default withMap(CustomLayers);
