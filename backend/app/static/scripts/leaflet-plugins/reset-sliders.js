L.Control.Reset = L.Control.extend({

    onAdd: function (map, options) {
        this._container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'fas fa-undo leaflet-control-fullscreen-button leaflet-bar-part', this._container);
        link.href = '#';


        link.setAttribute('title', 'Reset Sliders');
        L.DomEvent.on(link, 'click', function () {
            L.DomEvent.stopPropagation;
            L.DomEvent.preventDefault;

            if (options.side !== undefined && options.side === 'right') {
                resetSliders_right();
            }
            else {
                resetSliders();
            }
        });

        return this._container
    },
    hide: function () {

        this._container.style.display = 'none';
    },
    show: function () {
        this._container.style.display = 'block';
    }


});
L.control.reset = function () {
    return new L.Control.Reset();
}

