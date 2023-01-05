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


        let image = new Image();
        image.onload = function () {
        }

        image.src = img.src;



        var canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pix = imgd.data;
        console.log(imgd);
        for (var i = 0, n = pix.length; i < n; i += 1) {
            if (pix[i] != 0) {
                alert("ii");
            }

        }

        //     // // iterate through the pixels

        //     var pixel = this.options.colorize({ r: pix[i], g: pix[i + 1], b: pix[i + 2], a: pix[i + 3] });
        //     console.log(pix[i]);

        //     // if(!!!pixel || pixel !== Object(pixel) || Object.prototype.toString.call(pixel) === '[object Array]') {

        //     //     if(i === 0) {
        //     //         throw 'The colorize option should return an object with at least one of "r", "g", "b", or "a" properties.';
        //     //     }

        //     // } else {

        //     //     if(pixel.hasOwnProperty('r') && typeof pixel.r === 'number') {
        //     //         pix[i] = pixel.r;
        //     //     }
        //     //     if(pixel.hasOwnProperty('g')) {
        //     //         pix[i+1] = pixel.g;
        //     //     }
        //     //     if(pixel.hasOwnProperty('b')) {
        //     //         pix[i+2] = pixel.b;
        //     //     }
        //     //     if(pixel.hasOwnProperty('a')) {
        //     //         pix[i+3] = pixel.a;
        //     //     }
        //     // }

        // }

        // ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-colorized', true);

        // img.src = canvas.toDataURL();
    },
    _initContainer: function () {
        let tile = L.TileLayer.prototype._initContainer.call(this);

    },

    _colorize: function (img) {

    },
})

L.tileLayer.lut = function (url, options) {
    return new L.TileLayer.Lut(url, options);
}