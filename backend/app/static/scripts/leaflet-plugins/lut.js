// Grabs the LUT-ized image from the server and replaces the tile image with it, in the case of a LUT being selected.

L.TileLayer.Lut = L.TileLayer.extend({
    initialize: function (url, options) {
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileload', function (e) {
            this.lut(e.tile);
        });
    },

    lut: function (img) {

        if (img.getAttribute('data-colorized'))
            return;
        if (this.options.lut == 'grayscale' || this.options.lut == '') {
            return;
        }

    },
    _initContainer: function () {
        let tile = L.TileLayer.prototype._initContainer.call(this);
    },
})

L.tileLayer.lut = function (url, options) {
    return new L.TileLayer.Lut(url, options);
}