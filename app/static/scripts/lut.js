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

        fetch("/lut", {
            method: "POST",
            body: JSON.stringify({ body: img.src }),

        })
            .then(response => response.blob())
            .then(imageBlob => {
                console.log(imageBlob);
                const imageObjectURL = URL.createObjectURL(imageBlob);
                img.src = imageObjectURL;
                img.setAttribute('data-colorized', true);
            });

    },
    _initContainer: function () {
        let tile = L.TileLayer.prototype._initContainer.call(this);
    },
})

L.tileLayer.lut = function (url, options) {
    return new L.TileLayer.Lut(url, options);
}