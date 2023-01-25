L.Control.Reset = L.Control.extend({
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar leaflet-control');
        var link = L.DomUtil.create('a', 'fas fa-undo leaflet-control-fullscreen-button leaflet-bar-part', container);
        link.href = '#';
        link.setAttribute('title', 'Reset Sliders');
        L.DomEvent.on(link, 'click', function () {
            L.DomEvent.stopPropagation;
            L.DomEvent.preventDefault;
            resetSliders();
        });
        return container;
    },


});
L.control.reset = function () {
    return new L.Control.Reset();
}

