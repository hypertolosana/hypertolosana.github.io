(function () {


    GS.WebGLTextureShaderProgram = function (gl, initialQuads) {

        GS.WebGLTextureShaderProgram._superclass.constructor.call(this, gl, initialQuads);

        this._currentTextureId = null;

        return this;
    };

    var __GS_WebGLTextureSharedProgramPrototype = {

        __initialize: function (quads) {
            var gl = this._gl;

            this._shaderProgram.vertexPositionAttribute = gl.getAttribLocation(this._shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(this._shaderProgram.vertexPositionAttribute);

            this._shaderProgram.textureCoordAttribute = gl.getAttribLocation(this._shaderProgram, "aTextureCoord");
            gl.enableVertexAttribArray(this._shaderProgram.textureCoordAttribute);

            this._shaderProgram.vertexColorAttribute = gl.getAttribLocation(this._shaderProgram, "aColor");
            gl.enableVertexAttribArray(this._shaderProgram.vertexColorAttribute);

            this._shaderProgram.pMatrixUniform = gl.getUniformLocation(this._shaderProgram, "uPMatrix");
            this._shaderProgram.samplerUniform = gl.getUniformLocation(this._shaderProgram, "uSampler");

            GS.WebGLTextureShaderProgram._superclass.__initialize.call(this, quads);

            return this;
        },
        __getFragmentShader: function () {
            return this.__getShader(this._gl, "x-shader/x-fragment",
                "precision mediump float; \n" +

                    "varying vec2 vTextureCoord; \n" +
                    "uniform sampler2D uSampler; \n" +
                    "varying vec4 vAttrColor;\n" +

                    "void main(void) { \n" +

                    "  vec4 textureColor= texture2D(uSampler, vec2(vTextureCoord)); \n" +
                    "  gl_FragColor = textureColor * vAttrColor; \n" +

                    "}\n"
            );
        },
        __getVertexShader: function () {
            return this.__getShader(this._gl, "x-shader/x-vertex",
                "attribute vec2 aVertexPosition; \n" +
                    "attribute vec2 aTextureCoord; \n" +
                    "attribute vec4 aColor; \n" +

                    "uniform mat4 uPMatrix; \n" +

                    "varying vec2 vTextureCoord; \n" +
                    "varying vec4 vAttrColor; \n" +

                    "void main(void) { \n" +
                    "gl_Position = uPMatrix * vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0); \n" +
                    //"gl_Position = vec4( aVertexPosition.x / 400.0 -1.0, aVertexPosition.y / -300.0 + 1.0, 0, 1.0 );\n"+
                    "vTextureCoord = aTextureCoord;\n" +
                    "vAttrColor = aColor;\n" +
                    "}\n"
            );
        },
        flush: function () {

            var numQuads = this.vertexPositionArrayIndex / 8;

            var gl = this._gl;

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexPositionArray);
            gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexUVBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexUVArray);
            gl.vertexAttribPointer(this._shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray);
            gl.vertexAttribPointer(this._shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

            gl.drawElements(gl.TRIANGLES, numQuads * 6, gl.UNSIGNED_SHORT, 0);

            this.vertexPositionArrayIndex = 0;
            this.vertexUVArrayIndex = 0;
            this.vertexColorArrayIndex = 0;
        },

        __initBuffers: function () {

            var gl = this._gl;

            /// set vertex data
            this.vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertexPositionArray = new Float32Array(this.currentQuads * 8);  // 2 coords (x,y) * 4 bytes
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexPositionArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this._shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

            // uv info
            this.vertexUVBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.vertexUVArray = new Float32Array(this.currentQuads * 8);  // 2 coords (u,v) * 4 bytes each
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexUVArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this._shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

            // color info
            this.vertexColorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            this.vertexColorArray = new Float32Array(this.currentQuads * 16);  // 4 coords (rgba) * 4 bytes each
            gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(this._shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);


            // vertex index
            this.vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            this.vertexIndexArray = new Uint16Array(this.currentQuads * 6)
            for (i = 0; i < this.currentQuads * 6; i++) {
                this.vertexIndexArray[i * 6  ] = 0 + i * 4;
                this.vertexIndexArray[i * 6 + 1] = 1 + i * 4;
                this.vertexIndexArray[i * 6 + 2] = 2 + i * 4;

                this.vertexIndexArray[i * 6 + 3] = 0 + i * 4;
                this.vertexIndexArray[i * 6 + 4] = 2 + i * 4;
                this.vertexIndexArray[i * 6 + 5] = 3 + i * 4;
            }
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexArray, gl.STATIC_DRAW);
        },

        addQuad: function (actor) {

            var uvData = actor._spriteImageData;
            if (uvData._owner._textureId !== this._currentTextureId) {
                this.__setCurrentTexture(uvData._owner._textureId);
            }

            var vv = actor._viewVertices;

            var glCoords = this.vertexPositionArray;
            var glCoordsIndex = this.vertexPositionArrayIndex;
            glCoords[glCoordsIndex++] = vv[0].x;
            glCoords[glCoordsIndex++] = vv[0].y;
            glCoords[glCoordsIndex++] = vv[1].x;
            glCoords[glCoordsIndex++] = vv[1].y;
            glCoords[glCoordsIndex++] = vv[2].x;
            glCoords[glCoordsIndex++] = vv[2].y;
            glCoords[glCoordsIndex++] = vv[3].x;
            glCoords[glCoordsIndex  ] = vv[3].y;
            this.vertexPositionArrayIndex += 8;

            var c = actor._color;
            var colorBuffer = this.vertexColorArray;
            var colorIndex = this.vertexColorArrayIndex;
            colorBuffer[colorIndex++] = c[0];
            colorBuffer[colorIndex++] = c[1];
            colorBuffer[colorIndex++] = c[2];
            colorBuffer[colorIndex++] = c[3];
            colorBuffer[colorIndex++] = c[0];
            colorBuffer[colorIndex++] = c[1];
            colorBuffer[colorIndex++] = c[2];
            colorBuffer[colorIndex++] = c[3];
            colorBuffer[colorIndex++] = c[0];
            colorBuffer[colorIndex++] = c[1];
            colorBuffer[colorIndex++] = c[2];
            colorBuffer[colorIndex++] = c[3];
            colorBuffer[colorIndex++] = c[0];
            colorBuffer[colorIndex++] = c[1];
            colorBuffer[colorIndex++] = c[2];
            colorBuffer[colorIndex  ] = c[3];
            this.vertexColorArrayIndex += 16;

            var uvBuffer = this.vertexUVArray;
            var uvIndex = this.vertexUVArrayIndex;
            uvBuffer[uvIndex++] = uvData._u0;
            uvBuffer[uvIndex++] = uvData._v0;
            uvBuffer[uvIndex++] = uvData._u1;
            uvBuffer[uvIndex++] = uvData._v0;
            uvBuffer[uvIndex++] = uvData._u1;
            uvBuffer[uvIndex++] = uvData._v1;
            uvBuffer[uvIndex++] = uvData._u0;
            uvBuffer[uvIndex  ] = uvData._v1;
            this.vertexUVArrayIndex += 8;

            if (this.vertexPositionArrayIndex >= this.currentQuads * 8) {
                this.flush();
                this.__realloc();
            }
        },


        /**
         * Set current texture.
         * @param textureId {}
         * @private
         */
        __setCurrentTexture: function (textureId) {
            this._currentTextureId = textureId;
            this.__setTexture(textureId);
        },

        __setTexture: function (glTexture) {
            var gl = this._gl;

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.uniform1i(this._shaderProgram.samplerUniform, 0);

            return this;
        }
    };

    GS.WebGLShaderProgram.extend(GS.WebGLTextureShaderProgram, __GS_WebGLTextureSharedProgramPrototype);

})();