(function () {

    var SPRITE_IMAGE_ID = "si_";
    var SPRITE_IMAGE_INDEX = 0;

    /**
     * @name SpriteImage
     * @memberOf GS
     * @constructor
     * @param image {Image=}
     */
    GS.SpriteImage = function (image) {

        /**
         * @memberOf GS.SpriteImage.prototype
         * @property
         * @type {number}
         */
        this._textureId = -1;

        /**
         * @memberOf GS.SpriteImage.prototype
         * @property
         * @type {Image}
         */
        this._image = null;

        /**
         * @memberOf GS.SpriteImage.prototype
         * @property
         * @type {number}
         */
        this._imageWidth= 0;

        /**
         * @memberOf GS.SpriteImage.prototype
         * @property
         * @type {number}
         */
        this._imageHeight= 0;

        /**
         *
         * A map of SpriteImageData objects which identify image sub-regions. This map represents an atlas object.
         * @property
         * @map
         * @type {Object}
         * @memberOf GS.SpriteImage.prototype
         *
         */
        this._imageMap = {};

        /**
         * An array of Image regions.
         * @property
         * @type {Array.<GS.SpriteImageData>}
         * @memberOf GS.SpriteImage.prototype
         */
        this._imageMapArray= [];

        /**
         * An element representing the whole image.
         * @type {GS.SpriteImageData}
         * @property
         * @memberOf GS.SpriteImage.prototype
         */
        this._mainImageElement= null;

        if ( image ) {
            this.setImage( image );
        }

        return this;
    };

    GS.SpriteImage.prototype = {

        /**
         * Set this sprite image.
         * @param image {Image}
         */
        setImage: function (image) {
            this._image = image;
            this._imageWidth= image.width;
            this._imageHeight= image.height;
            return this;
        },

        /**
         * Create an spriteImage object from a given glTexture. EG from a frambuffer texture.
         * @param glTextureId
         * @param width
         * @param height
         * @returns {*}
         */
        setFrameBuffer : function( glTextureId, width, height, textureWidth, textureHeight ) {
            this._textureId= glTextureId;
            this._imageWidth= textureWidth;
            this._imageHeight= textureHeight;

            this._mainImageElement = new GS.SpriteImageData( 0,0,width,height);
            this.addSpriteElement( 'image', this._mainImageElement );

            return this;
        },

        /**
         * Retrieve an SpriteImageData by name.
         * @param name {string}
         * @returns {null | GS.SpriteImageData}
         */
        getImageData : function( name ) {

            var ret= this._imageMap[ name ];

            return ret || this._mainImageElement;
        },

        /**
         * Get the nth added image element to this SpriteImage.
         * If this SpriteImage is created from a map, the index will identify elements defined sequentially in the JSON
         * file. Therefore, this method is mostly useful when creating a SpriteImage by calling
         * @link{createWithRowsAndColumns} method.
         *
         * @param index {number}
         * @returns {GS.SpriteImageData}
         */
        getImageDataByIndex : function( index ) {
            return this._imageMapArray[ index ];
        },

        getTexture : function() {
            return this._textureId;
        },

        /**
         * Set this Sprite texture.
         * After setting as texture, the image is discarded, and only the texture id is kept.
         * @param gl {Object}
         * @param image {Image}
         * @param id {string} how to refer to this whole sprite.
         */
        setAsTexture : function( gl ) {

            this._imageWidth= this._imageWidth;
            this._imageHeight= this._imageHeight;

            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            this._textureId = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, this._textureId);
            gl.enable( gl.BLEND );
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            var nw= GS.WebGLUtils.nextPowerOf2( this._imageWidth );
            var nh= GS.WebGLUtils.nextPowerOf2( this._imageHeight );

            // image is not power of 2 in size.
            // build a new image, and set it as texture.
            if ( nw!==this._imageWidth || nh!==this._imageHeight ) {
                var canvas= document.createElement('canvas');
                canvas.width= nw;
                canvas.height= nh;
                var ctx= canvas.getContext("2d");
                ctx.drawImage( this._image, 0, 0 );

                // reset all spriteimagedata elements.
                for( var el in this._imageMap ) {
                    var sid= this._imageMap[ el ];
                    var rw= this._imageWidth/nw;
                    var rh= this._imageHeight/nh;
                    sid._u0*= rw;
                    sid._u1*= rw;
                    sid._v0*= rh;
                    sid._v1*= rh;
                }

                // reset image dimension
                this._imageWidth= nw;
                this._imageHeight= nh;

                this._image= canvas;
            }

            gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    this._image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            this._image= null;

            return this;
        },

        /**
         * Add a new sprite descriptor in this image.
         * @param id {string}
         * @param data { { x:number, y:number, width:number, height:number } }
         */
        addSpriteElement: function (id, data) {

            data._u0 = data._x / this._imageWidth;
            data._v0 = data._y / this._imageHeight;
            data._u1 = (data._x + data._width) / this._imageWidth;
            data._v1 = (data._y + data._height) / this._imageHeight;

            data._owner= this;
            this._imageMap[ id ] = data;

            this._imageMapArray.push( data );

            return this;
        },

        /**
         *
         * @param img {HTMLImageElement|Image|Canvas|HTMLCanvasElement}
         * @param rows {number}
         * @param columns {number}
         * @param padding {{ left:number, top:number, right:number, bottom:number }}
         * @param gap {{ horizontal : number, vertical: number }}
         * @param nameFactory {function( row:number, column : number )} a callback function which must return an string
         *          identifying the sprite sub-image. Otherwise names will be 'si_<index>_<row>_<column>'.
         */
        createWithRowsAndColumns: function ( rows, columns, nameFactory, extents, padding, gap ) {

            var ww= extents && extents.width || this._imageWidth;
            var hh= extents && extents.height || this._imageHeight;

            var left = (padding && ((padding.left || 0) >> 0)) || 0;
            var top = (padding && ((padding.top || 0) >> 0)) || 0;
            var right = ww - ((padding && ((padding.right || 0) >> 0)) || 0);
            var bottom = hh - ((padding && ((padding.bottom || 0) >> 0) ) || 0);

            var width = (right - left) / columns - (gap ? gap.width || 0 : 0);
            var height = (bottom - top) / rows - (gap ? gap.height || 0 : 0);

            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < columns; ++j) {

                    var name = nameFactory ?
                        nameFactory(i, j) :
                        (SPRITE_IMAGE_ID + (SPRITE_IMAGE_INDEX++) ) + "_" + i + "_" + j;

                    this.addSpriteElement(
                        name,
                        new GS.SpriteImageData(
                            left + j * width,
                            top + i * height,
                            width,
                            height
                        ));
                }
            }

            this._mainImageElement = new GS.SpriteImageData( 0,0,ww,hh);
            this.addSpriteElement( 'image', this._mainImageElement );

            return this;
        },

        /**
         * load a map from a JSON file.
         * Expected to be generated from TexturePacker tool.
         * @param map { Object }
         */
        createWithJSON : function( map ) {

            map= map['frames'] || map;

            for( var element in map ) {
                var frame= map[element]['frame'];
                this.addSpriteElement(
                    element,
                    new GS.SpriteImageData(
                        parseFloat(frame['x']),
                        parseFloat(frame['y']),
                        parseFloat(frame['w']),
                        parseFloat(frame['h'])
                    )
                )
            }
        },

        getElementCount : function() {
            return this._imageMapArray.length;
        }
    };

})();