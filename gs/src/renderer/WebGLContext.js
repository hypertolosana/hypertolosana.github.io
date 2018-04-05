(function () {

    var INITIAL_NUM_QUADS = 4096;

    /**
     * Create an orthogonal projection matrix.
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param znear
     * @param zfar
     */
    function makeOrtho(left, right, bottom, top, znear, zfar) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(zfar + znear) / (zfar - znear);

        return new Float32Array([
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, -2 / (zfar - znear), 0,
            tx, ty, tz, 1 ]
        );
    }

    var pMatrix;

    /**
     * @private
     * @constructor
     */
    var Context = function () {

        this._currentMatrix = GS.Math.Matrix.create();
        this._pathX = 0;
        this._pathY = 0;

        /**
         * @property
         * @memberOf GS.RendererWebGL.prototype
         * @type {Array}
         * @private
         */
        this._frameBufferInfo = [];

        return this;
    };

    /**
     * @name WebGLContext
     * @memberOf GS
     * @param gl
     * @param width
     * @param height
     * @constructor
     */
    GS.WebGLContext = function (gl, width, height) {

        this._width = width;
        this._height = height;
        this._gl = gl;

        this._textureProgram = new GS.WebGLTextureShaderProgram(gl, INITIAL_NUM_QUADS);
        this._colorProgram = new GS.WebGLColorShaderProgram(gl, INITIAL_NUM_QUADS);
        this._currentProgram = this._textureProgram;

        /**
         * Current rendering context info.
         * @type {Context}
         * @property
         * @memberOf GS.WebGLContext.prototype
         */
        this._currentContext = new Context();

        /**
         * Frame buffers available in the rendering context.
         * @property
         * @map
         * @memberOf GS.WebGLContext.prototype
         */
        this._frameBufferInfo = {};

        pMatrix = makeOrtho(0, width, height, 0, -1, 1);

        this.useProgram(this._textureProgram);

        return this;
    };

    var __GS_WebGLContext = {

        useProgram: function (pr) {
            this.flush();
            this._currentProgram = pr;
            pr.useProgram();
            pr.setMatrixUniform(pMatrix);
        },

        fillRect: function (actor) {
            if (this._currentProgram !== this._colorProgram) {
                this.useProgram(this._colorProgram);
            }

            this._colorProgram.addQuad(actor);
        },

        /**
         * Generate a quad info to draw the image.
         * @param spriteImageData {GS.SpriteImageData}
         * @param actor {GS.Actor}
         */
        drawImage: function (actor) {

            var uvData = actor._spriteImageData;
            if (!uvData) {
                return;
            }

            if (this._currentProgram !== this._textureProgram) {
                this.useProgram(this._textureProgram);
            }

            this._textureProgram.addQuad(actor);
        },

        setTransform: function (matrix) {
            GS.Math.Matrix.copy(matrix, this._currentMatrix);
        },

        beginPath: function () {

        },

        lineTo: function (x, y) {

        },

        closePath: function () {

        },

        moveTo: function (x, y) {

        },

        flush: function () {
            this._currentProgram.flush();
        },

        /**
         * Add a frame buffer object. Frame buffer are meant to be off screen images.
         * @param id {string} frame buffer id, so that you can select it later.
         * @param flags { {depth : boolean}= } flags object with hints about the frame buffer.
         */
        addFrameBuffer: function (id, flags) {

            var gl = this._gl;

            if (!this._frameBufferInfo[id]) {

                var width = GS.WebGLUtils.nextPowerOf2(this._width);
                var height = GS.WebGLUtils.nextPowerOf2(this._height);

                // create frame buffer
                var frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

                // create frame buffer texture
                var frameBufferTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                // no texture pixels
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0, gl.RGBA,
                    width, height,
                    0, gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    null);

                // render buffers
                if ( flags && flags.depth ) {
                    var renderbuffer = gl.createRenderbuffer();
                    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
                    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
                    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);
                }

                // attach color
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0);


                // clean up
                gl.bindTexture(gl.TEXTURE_2D, null);
                if ( flags && flags.depth ) {
                    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                }
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                this._frameBufferInfo[id] = {
                    flags : flags,
                    textureWidth: width,
                    textureHeight: height,
                    width: this._width,
                    height: this._height,
                    frameBuffer: frameBuffer,
                    frameBufferTexture: frameBufferTexture,
                    spriteImage: new GS.SpriteImage().setFrameBuffer(frameBufferTexture, this._width, this._height, width, height)
                };
            }
        },

        getFrameBufferSpriteImage: function (id) {
            var fbi = this._frameBufferInfo[ id ];

            if (fbi) {
                return fbi.spriteImage
            }

            return null;
        },

        /**
         * enable a preivously created frame buffer. Use null to switch to screen frame buffer.
         * @param id {string | null}
         */
        enableFrameBuffer: function (id) {
            var fbi = this._frameBufferInfo[ id ];
            var gl = this._gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbi ? fbi.frameBuffer : null);
        }

    };

    GS.Object.extend(GS.WebGLContext, __GS_WebGLContext);

})();