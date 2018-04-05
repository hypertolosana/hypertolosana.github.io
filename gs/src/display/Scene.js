(function() {

    /**
     * @name Scene
     * @memberOf GS
     * @extends GS.ActorContainer
     * @constructor
     */
    GS.Scene= function() {

        GS.Scene._superclass.constructor.call(this);

        /**
         * @memberOf GS.Scene.prototype
         * @type {number}
         */
        this._time= 0;

        /**
         * @member GS.Scene.prototype
         * @type { {frameBuffer, frameBufferTexture, width : number, height : number, spriteImage } }
         * @private
         */
        this._WebGLRenderToTextureInfo= null;



        this.setTransformationAnchor(0,0.5);
        this.setPositionAnchor(0,0);
    };

    var __GS_ScenePrototype= {

        /**
         * @lends GS.Scene.prototype
         */

        incrementTimeLineBy : function( elapsedTime ) {
            if ( elapsedTime > 500 ) {
                elapsedTime= 500;
            }

            this._time+= elapsedTime;
        },

        getTime : function() {
            return this._time;
        }

    };

    GS.ActorContainer.extend( GS.Scene, __GS_ScenePrototype );

})();