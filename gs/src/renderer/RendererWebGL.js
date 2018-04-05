(function () {

    /**
     * @name RendererWebGL
     * @memberOf GS
     * @constructor
     */
    GS.RendererWebGL = function () {

        /**
         * @property
         * @type {HTMLCanvasElement}
         * @memberOf GS.RendererWebGL.prototype
         */
        this._surface = null;

        /**
         * @type {WebGLRenderingContext}
         * @property
         * @memberOf GS.RendererWebGL.prototype
         */
        this._gl = null;

        /**
         *
         * @type {GS.WebGLContext}
         * @property
         * @memberOf GS.RendererWebGL.prototype
         */
        this._glContext = null;

        return this;
    };

    var __GS_RendererWebGLPrototype = {

        /**
         * @lends GS.RendererWebGL.prototype
         */

        /**
         * Create a rendering surface.
         * @param w {number} surface width
         * @param h {number} surface height
         */
        initialize: function (w, h) {
            this._surface = document.createElement("canvas");
            this._surface.width = w;
            this._surface.height = h;

            try {
                var obj = { antialias: false };
                // Try to grab the standard context. If it fails, fallback to experimental.
                this._gl = this._surface.getContext("webgl", obj) || this._surface.getContext("experimental-webgl", obj);
            }
            catch (e) {
                alert(e);
            }

            if (!this._gl) {
                throw new Error('WebGL is not available.');
            }

            this._glContext = new GS.WebGLContext(this._gl, w, h);

            var gl = this._gl;

            if (gl) {
                gl.clearColor(1.0, 1.0, 1.0, 1.0);                      // Set clear color to black, fully opaque
                gl.disable(gl.DEPTH_TEST);                               // Enable depth testing
                gl.disable(gl.CULL_FACE);

                gl.clear(gl.COLOR_BUFFER_BIT);      // Clear the color as well as the depth buffer.

                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }

            this._gl.viewport(0, 0, w, h);
            this._gl.viewportWidth = this._surface.width;
            this._gl.viewportHeight = this._surface.height;
        },

        getContext: function () {
            return this._glContext;
        },

        render: function (scene, elapsedTimeBetweenFrames) {
            this._gl.clear(this._gl.COLOR_BUFFER_BIT);

            scene.incrementTimeLineBy(elapsedTimeBetweenFrames);
            scene.__paintActorGL(this._glContext, scene._time);
            this._glContext.flush()
        },


        /**
         *
         * @param si {GS.SpriteImage}
         */
        addImage: function (si) {
            si.setAsTexture(this._gl);
//            var si= new GS.SpriteImage().setTexture( this._gl, image, id );

        }


    };

    GS.RendererWebGL.prototype = __GS_RendererWebGLPrototype;

})();