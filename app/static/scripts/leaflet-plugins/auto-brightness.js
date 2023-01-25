L.Control.Brightness = L.Control.extend({
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'fas fa-sun leaflet-control-fullscreen-button leaflet-bar-part', container);
        link.href = '#';


        link.setAttribute('title', 'Toggle Auto Brightness');
        if (autobrightness) {
            link.style.backgroundColor = 'rgb(200, 200, 200)';
        }
        else {
            link.style.backgroundColor = 'rgb(255, 255, 255)';
        }

        // if button is clicked, darken the buttons background

        L.DomEvent.on(link, 'click', function () {
            L.DomEvent.stopPropagation;
            L.DomEvent.preventDefault;
            toggleAutoBrightness();
        });


        return container;

    },

    onRemove: function (map) {
        // Nothing to do here
    },

    hide: function () {
        this._container.style.display = 'none';
    },
    show: function () {
        this._container.style.display = 'block';
    }

});

L.control.brightness = function () {
    return new L.Control.Brightness();
}
