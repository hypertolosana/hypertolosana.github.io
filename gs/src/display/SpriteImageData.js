(function() {

    /**
     * @class SpriteImageData represents a region inside a given image. It is the foundation class for sub texturing.
     * @name SpriteImageData
     * @memberOf GS
     * @constructor
     *
     * @param x {number}
     * @param y {number}
     * @param w {number}
     * @param h {number}
     */
    GS.SpriteImageData= function(x,y,w,h) {

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._x=      x||0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._y=      y||0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._width=  w||0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._height= h||0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._u0=     0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._v0=     0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._u1=     0.0;

        /**
         * @property
         * @type {number}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._v1=     0.0;

        /**
         * @property
         * @type {GS.SpriteImage}
         * @memberOf GS.SpriteImageData.prototype
         */
        this._owner=   null;

        return this;
    };

})();