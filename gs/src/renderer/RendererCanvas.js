(function() {

    /**
     * @name RendererCanvas
     * @memberOf GS
     * @constructor
     */
    GS.RendererCanvas= function() {

        this._surface= null;
        this._ctx= null;

        return this;
    };

    GS.RendererCanvas.prototype= {


        /**
         * @lends GS.RendererCanvas.prototype
         */

        /**
         *
         * @param w
         * @param h
         */
        initialize: function (w, h) {

            this._surface = document.createElement("canvas");
            this._surface.width = w;
            this._surface.height = h;

            this._ctx= this._surface.getContext("2d");
        },

        getContext : function() {
            return this._ctx;
        },

        render : function( scene ) {

            this._ctx.save();
            this._ctx.clearRect(0,0,this._surface.width,this._surface.height);
            scene.__paintActor( this._ctx, 0 );
            this._ctx.restore();
        },

        addImage : function( img ) {

        }

    };

})();