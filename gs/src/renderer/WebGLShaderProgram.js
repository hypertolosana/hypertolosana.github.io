(function () {


    /**
     * @name WebGLShaderProgram
     * @memberOf GS
     * @constructor
     */
    GS.WebGLShaderProgram = function (gl, initialQuads) {

        this._gl = gl;
        this._shaderProgram = null;

        this.vertexPositionBuffer = null;    // buffer for vertex coordinates
        this.vertexUVBuffer = null;          // uv buffer for vertex
        this.vertexColorBuffer = null;       // color for each vertex
        this.vertexIndexBuffer = null;       // vertex indexes

        this.vertexPositionArray = null;
        this.vertexUVArray = null;
        this.vertexColorArray = null;
        this.vertexIndexArray = null;

        this.vertexPositionArrayIndex = 0;
        this.vertexUVArrayIndex = 0;
        this.vertexColorArrayIndex = 0;

        this.currentQuads = 8192;

        this.__create();
        this.__initialize(initialQuads);

        return this;
    };

    var __GS_WebGLShaderProgramPrototype = {

        __realloc: function (initialQuads) {
            var gl = this._gl;

            this.currentQuads = (this.currentQuads * 1.5) | 0;

            gl.deleteBuffer(this.vertexPositionBuffer);
            gl.deleteBuffer(this.vertexUVBuffer);
            gl.deleteBuffer(this.vertexColorBuffer);
            gl.deleteBuffer(this.vertexIndexBuffer);

            this.__initBuffers(initialQuads);

            this.vertexPositionArrayIndex = 0;
            this.vertexUVArrayIndex = 0;
            this.vertexColorArrayIndex = 0;

        },

        __initBuffers: function (initialQuads) {
        },

        __initialize: function (initialQuads) {
            this.__initBuffers(initialQuads);
            return this;
        },

        __getShader: function (gl, type, str) {
            var shader;
            if (type === "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (type === "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return null;
            }

            gl.shaderSource(shader, str);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }

            return shader;

        },
        __getFragmentShader: function () {

        },
        __getVertexShader: function () {

        },
        __create: function () {
            var gl = this._gl;

            this._shaderProgram = gl.createProgram();
            gl.attachShader(this._shaderProgram, this.__getVertexShader());
            gl.attachShader(this._shaderProgram, this.__getFragmentShader());
            gl.linkProgram(this._shaderProgram);
            gl.useProgram(this._shaderProgram);
            return this;
        },

        setMatrixUniform: function (matrix) {
            this._gl.uniformMatrix4fv(
                this._shaderProgram.pMatrixUniform,
                false,
                new Float32Array(matrix)
            );

        },

        useProgram: function () {
            this._gl.useProgram(this._shaderProgram);
            return this;
        },

        flush: function () {
        }
    };

    GS.Object.extend(GS.WebGLShaderProgram, __GS_WebGLShaderProgramPrototype);

})();