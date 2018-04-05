/**
 * @class
 * @name Matrix
 * @memberOf GS.Math
 */

GS.Math.Matrix = {

    /**
     * @lends GS.Math.Matrix
     */

    create : function() {
        var matrix= typeof Float32Array!=="undefined" ? new Float32Array(9) : new Array(9);
        GS.Math.Matrix.identity( matrix );
        return matrix;
    },

    /**
     * @param matrix {Array | Float32Array}
     * @static
     */
    identity: function (matrix) {
        matrix[0] = 1;
        matrix[1] = 0;
        matrix[2] = 0;

        matrix[3] = 0;
        matrix[4] = 1;
        matrix[5] = 0;

        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 1;
    },

    /**
     * Copy a matrix data into another matrix.
     *
     * @param src {Array | Float32Array}
     * @param dst {Array | Float32Array}
     */
    copy: function (src, dst) {

        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
    },

    /**
     * Multiply matrix m0 by matrix m1.
     * @param m0 {Array | Float32Array}
     * @param m1 {Array | Float32Array}
     */
    multiply: function (m0, m1) {

        var mm0 = m1[0];
        var mm1 = m1[1];
        var mm2 = m1[2];
        var mm3 = m1[3];
        var mm4 = m1[4];
        var mm5 = m1[5];

        /*
         var mm6 = m1[6];
         var mm7 = m1[7];
         var mm8 = m1[8];
         */

        var tm0 = m0[0];
        var tm1 = m0[1];
        var tm2 = m0[2];

        m0[0] = tm0 * mm0 + tm1 * mm3; // + tm2 * mm6;
        m0[1] = tm0 * mm1 + tm1 * mm4; // + tm2 * mm7;
        m0[2] = tm0 * mm2 + tm1 * mm5 + tm2; // * mm8;

        var tm3 = m0[3];
        var tm4 = m0[4];
        var tm5 = m0[5];

        m0[3] = tm3 * mm0 + tm4 * mm3; // + tm5 * mm6;
        m0[4] = tm3 * mm1 + tm4 * mm4; // + tm5 * mm7;
        m0[5] = tm3 * mm2 + tm4 * mm5 + tm5; // * mm8;

        /*
         var tm6 = m0[6];
         var tm7 = m0[7];
         var tm8 = m0[8];

         m0[6] = tm6 * mm0 + tm7 * mm3 + tm8 * mm6;
         m0[7] = tm6 * mm1 + tm7 * mm4 + tm8 * mm7;
         m0[8] = tm6 * mm2 + tm7 * mm5 + tm8 * mm8;
         */
    },

    inverse: function (inMatrix, outMatrix) {

        var m00 = inMatrix[0];
        var m01 = inMatrix[1];
        var m02 = inMatrix[2];
        var m10 = inMatrix[3];
        var m11 = inMatrix[4];
        var m12 = inMatrix[5];
        var m20 = inMatrix[6];
        var m21 = inMatrix[7];
        var m22 = inMatrix[8];

        outMatrix = outMatrix || new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        var determinant = m00 * (m11 * m22 - m21 * m12) - m10 * (m01 * m22 - m21 * m02) + m20 * (m01 * m12 - m11 * m02);
        if (determinant === 0) {
            return outMatrix;
        }
        determinant = 1 / determinant;

        outMatrix[0] = (m11 * m22 - m12 * m21) * determinant;
        outMatrix[1] = (m02 * m21 - m01 * m22) * determinant;
        outMatrix[2] = (m01 * m12 - m02 * m11) * determinant;
        outMatrix[3] = (m12 * m20 - m10 * m22) * determinant;
        outMatrix[4] = (m00 * m22 - m02 * m20) * determinant;
        outMatrix[5] = (m02 * m10 - m00 * m12) * determinant;
        outMatrix[6] = (m10 * m21 - m11 * m20) * determinant;
        outMatrix[7] = (m01 * m20 - m00 * m21) * determinant;
        outMatrix[8] = (m00 * m11 - m01 * m10) * determinant;

        return outMatrix;
    },

    /**
     * Reset this rendering context transformation matrix to the one represented by this matrix.
     * @param ctx rendering context
     * @param m {Float32Array | Array.<number>}
     */
    transformRenderingContextSet: function (ctx, m) {
        ctx.setTransform(m[0], m[3], m[1], m[4], m[2], m[5]);
        return this;
    },

    /**
     * Add this rendering context transformation matrix to the one represented by this matrix.
     * @param ctx rendering context
     * @param m {Float32Array | Array.<number>}
     */
    transformRenderingContext: function (ctx, m) {
        ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
        return this;
    }
};

