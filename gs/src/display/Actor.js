(function () {
    /**
     * @class
     * <p>An actor is any displayable element.
     * It is defined by position, size, and a local and a global affine transform.
     * The local affine transformation is calculated by using:
     *   <li>position, and position anchor.
     *   <li>rotation angle, scale for x and y axes, and a transformation anchor.
     *
     * <p>The global affine transformation is calculated by using:
     *  <li>this actor's local affine transform.
     *  <li>its parent's local affine transform.
     * <p>
     *
     * @name Actor
     * @memberOf GS
     * @constructor
     */
    GS.Actor = function () {

        /**
         * @memberOf GS.Actor.prototype
         * @property _x
         * @type {number}
         */
        this._x = Number.MAX_VALUE;
        this.x= 0.0;
        /**
         * @memberOf GS.Actor.prototype
         * @property _y
         * @type {number}
         */
        this._y = Number.MAX_VALUE;
        this.y= 0.0;
        /**
         * @memberOf GS.Actor.prototype
         * @property _width
         * @type {number}
         */
        this._width = 0.0;

        /**
         * @memberOf GS.Actor.prototype
         * @property _height
         * @type {number}
         */
        this._height = 0.0;

        /**
         * @memberOf GS.Actor.prototype
         * @property _rotationAngle
         * @type {number}
         */
        this._rotationAngle = 0.0;
        this.rotationAngle = 0.0;

        /**
         * @memberOf GS.Actor.prototype
         * @property _scaleX
         * @type {number}
         */
        this._scaleX = 1.0;
        this.scaleX = 1.0;

        /**
         * @memberOf GS.Actor.prototype
         * @property _scaleY
         * @type {number}
         */
        this._scaleY = 1.0;
        this.scaleY = 1.0;

        /**
         * @memberOf GS.Actor.prototype
         * @property _positionAnchorX
         * @type {number}
         */
        this._positionAnchorX = .5;

        /**
         * @memberOf GS.Actor.prototype
         * @property _positionAnchorY
         * @type {number}
         */
        this._positionAnchorY = .5;

        /**
         * @memberOf GS.Actor.prototype
         * @property _transformationAnchorX
         * @type {number}
         */
        this._transformationAnchorX = 0.5;

        /**
         * @memberOf GS.Actor.prototype
         * @property _transformationAnchorY
         * @type {number}
         */
        this._transformationAnchorY = 0.5;

        /**
         * @memberOf GS.Actor.prototype
         * @property _alpha
         * @type {Array|Float32Array}
         */
        this._color = typeof Float32Array!=="undefined" ? new Float32Array([1,1,1,1]) : new Array(4);

        /**
         * @memberOf GS.Actor.prototype
         * @property _parent
         * @type {GS.Actor}
         */
        this._parent = null;

        /**
         * @memberOf GS.Actor.prototype
         * @property _modelViewMatrix
         * @type {Float32Array}
         */
        this._modelViewMatrix = typeof Float32Array!=="undefined" ? new Float32Array(9) : new Array(9);

        /**
         * @memberOf GS.Actor.prototype
         * @property _worldModelViewMatrix
         * @type {Float32Array}
         */
        this._worldModelViewMatrix = typeof Float32Array!=="undefined" ? new Float32Array(9) : new Array(9);

        /**
         * is this displayable axis aligned ?
         * @memberOf GS.Actor.prototype
         * @property _isAA
         * @type {boolean}
         */
        this._isAA = true;

        /**
         * has this displayable's transformation matrix changed ?
         * @memberOf GS.Actor.prototype
         * @property _dirty
         * @type {boolean}
         */
        this._dirty = true;

        /**
         * Bounding Box.
         * @type {Array.<{x:number, y:number}>}
         * @property
         * @memberOf GS.Actor.prototype
         */
        this._viewVertices= [
            { x:0, y:0 },
            { x:0, y:0 },
            { x:0, y:0 },
            { x:0, y:0 }
        ];

        this._spriteImageData= null;

        /**
         * @property
         * @type {Array.<GS.Behavior>}
         * @private
         */
        this._behaviorList= [];

        GS.Math.Matrix.identity(this._modelViewMatrix);
        GS.Math.Matrix.identity(this._worldModelViewMatrix);

        return this;
    };


    var __GS_ActorPrototype = {

        /**
         * @lends GS.Actor.prototype
         */

        /**
         * Set this displayable's position.
         * @param x {number}
         * @param y {number}
         */
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },

        /**
         * Set this displayable's dimension.
         * @param w {number}
         * @param h {number}
         */
        setSize: function (w, h) {
            this._width = w;
            this._height = h;
            return this;
        },

        setAlpha : function( alpha ) {
            this._color[3]= alpha;
            return this;
        },

        /**
         * Set this actor color.
         * Color by default is 1,1,1,1 that means, opaque white, which does not modify texture values.
         * @param r {number} 0..1
         * @param g {number} 0..1
         * @param b {number} 0..1
         * @param a {number=} 0..1
         * @returns {*}
         */
        setColor : function( r,g,b,a ) {
            this._color[0]= typeof r!=="undefined" ? r : 0;
            this._color[1]= typeof g!=="undefined" ? g : 0;
            this._color[2]= typeof b!=="undefined" ? b : 0;
            if (typeof a!=="undefined") {
                this._color[3]= a;
            }
            return this;
        },

        /**
         * Set this displayable's bounds: position and size.
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {number}
         * @returns {*}
         */
        setBounds: function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this._width = w;
            this._height = h;
            return this;
        },

        /**
         * Set this displayable's rotation angle
         * @param angle {number}
         */
        setRotation: function (angle) {
            this.rotationAngle = angle;
            return this;
        },

        /**
         * Set this displayable's scale on x and y axes.
         * @param scaleX {number}
         * @param scaleY {number}
         */
        setScale: function (scaleX, scaleY) {
            this.scaleX = scaleX;
            this.scaleY = scaleY;
            return this;
        },

        /**
         * Set this displayable's position anchor. By default, displayables have 0,0 in its center.
         * @param ax {number}
         * @param ay {number}
         */
        setPositionAnchor: function (ax, ay) {
            this._positionAnchorX = ax;
            this._positionAnchorY = ay;
            return this;
        },

        /**
         * Set this displayable's transformation anchor. By default, displayables rotate and scale by its center position,
         * regardless where the positional anchor is located.
         * @param ax {number}
         * @param ay {number}
         */
        setTransformationAnchor: function (ax, ay) {
            this._transformationAnchorX = ax;
            this._transformationAnchorY = ay;
            return this;
        },

        __setModelViewMatrixAll : function() {

            var c, s, _m00, _m01, _m10, _m11;
            var m00, m01, m02, m10, m11, m12;

            m00 = 1;
            m01 = 0;
            m10 = 0;
            m11 = 1;

            m02 = this.x - this._positionAnchorX * this._width;
            m12 = this.y - this._positionAnchorY * this._height;

            var rx = this._transformationAnchorX * this._width;
            var ry = this._transformationAnchorY * this._height;

            m02 += m00 * rx + m01 * ry;
            m12 += m10 * rx + m11 * ry;

            c = Math.cos(this.rotationAngle);
            s = Math.sin(this.rotationAngle);
            _m00 = m00;
            _m01 = m01;
            _m10 = m10;
            _m11 = m11;
            m00 = _m00 * c + _m01 * s;
            m01 = -_m00 * s + _m01 * c;
            m10 = _m10 * c + _m11 * s;
            m11 = -_m10 * s + _m11 * c;

            m00 = m00 * this.scaleX;
            m01 = m01 * this.scaleY;
            m10 = m10 * this.scaleX;
            m11 = m11 * this.scaleY;

            m02 += -m00 * rx - m01 * ry;
            m12 += -m10 * rx - m11 * ry;

            this._rotationAngle = this.rotationAngle;
            this._scaleX = this.scaleX;
            this._scaleY = this.scaleY;
            this._x= this.x;
            this._y= this.y;

            this._dirty = true;

            var mm = this._modelViewMatrix;
            mm[0] = m00;
            mm[1] = m01;
            mm[3] = m10;
            mm[4] = m11;
            mm[2] = m02;
            mm[5] = m12;
        },

        __setModelViewMatrixScale : function() {

            var m00, m01, m02, m10, m11, m12;

            m00 = 1;
            m01 = 0;
            m10 = 0;
            m11 = 1;

            m02 = this.x - this._positionAnchorX * this._width;
            m12 = this.y - this._positionAnchorY * this._height;

            var rx = this._transformationAnchorX * this._width;
            var ry = this._transformationAnchorY * this._height;

            m02 += m00 * rx + m01 * ry;
            m12 += m10 * rx + m11 * ry;

            m00 = m00 * this.scaleX;
            m01 = m01 * this.scaleY;
            m10 = m10 * this.scaleX;
            m11 = m11 * this.scaleY;

            m02 += -m00 * rx - m01 * ry;
            m12 += -m10 * rx - m11 * ry;

            this._scaleX = this.scaleX;
            this._scaleY = this.scaleY;
            this._x= this.x;
            this._y= this.y;

            this._dirty = true;

            var mm = this._modelViewMatrix;
            mm[0] = m00;
            mm[1] = m01;
            mm[3] = m10;
            mm[4] = m11;
            mm[2] = m02;
            mm[5] = m12;
        },

        /**
         * Set this displayable's transformation matrices.
         * @private
         */
        __setModelViewMatrix: function () {

            var mm, mmm;

            if (this._rotationAngle !== this.rotationAngle) {
                this.__setModelViewMatrixAll();
            } else if (this._scaleX !== this.scaleX || this._scaleY !== this.scaleY) {
                this.__setModelViewMatrixScale();
            } else if ( this.x!==this._x || this.y!==this._y ) {
                mm = this._modelViewMatrix;
                var x = this.x - this._positionAnchorX * this._width;
                var y = this.y - this._positionAnchorY * this._height;
                mm[2]= x;
                mm[5]= y;
                this._x= this.x;
                this._y= this.y;
                this._dirty= true;
            }

            if (this.parent) {

                this._isAA = this.parent._isAA && this._rotationAngle === 0 && this._scaleX===1 && this._scaleY===1;

                if (this._dirty || this.parent._dirty) {

                    var pmm = this.parent._worldModelViewMatrix;
                    mmm = this._worldModelViewMatrix;

                    mmm[0]= pmm[0];
                    mmm[1]= pmm[1];
                    mmm[2]= pmm[2];
                    mmm[3]= pmm[3];
                    mmm[4]= pmm[4];
                    mmm[5]= pmm[5];

                    if (this._isAA) {
                        mm= this._modelViewMatrix;
                        mmm[2] += mm[2];
                        mmm[5] += mm[5];
                    } else {
                        GS.Math.Matrix.multiply(this._worldModelViewMatrix, this._modelViewMatrix);
                    }

                    this._dirty = true;
                }

            } else {

                var wmm= this._worldModelViewMatrix;
                mmm= this._modelViewMatrix;
                wmm[0]= mmm[0];
                wmm[1]= mmm[1];
                wmm[2]= mmm[2];
                wmm[3]= mmm[3];
                wmm[4]= mmm[4];
                wmm[5]= mmm[5];
                this._isAA = this._rotationAngle === 0;
            }
        },

        /**
         * transform a local coordinate to screen space coordinate system.
         * @param point { { x: number, y:number} }
         */
        modelToView: function (point) {
            var x, y, tm;

            tm = this._worldModelViewMatrix;

            x = point.x;
            y = point.y;
            point.x = x * tm[0] + y * tm[1] + tm[2];
            point.y = x * tm[3] + y * tm[4] + tm[5];

            return point;
        },

        getViewToModelMatrix : function( matrix ) {
            GS.Math.Matrix.inverse( this._worldModelViewMatrix, matrix );
        },

        /**
         * transform a screen space coordinate into this actor's coordinate system.
         * @param point { { x: number, y:number} }
         */
        viewToModel : function( point ) {

            var tm = this.getViewToModelMatrix();
            var x = point.x;
            var y = point.y;
            point.x = x * tm[0] + y * tm[1] + tm[2];
            point.y = x * tm[3] + y * tm[4] + tm[5];

            return point;
        },

        /**
         * transform a local coordinate to another actor's local coordinate system.
         * @param point { { x: number, y:number} }
         * @param otherActor {GS.Actor}
         */
        modelToModel : function( point, otherActor ) {
            return otherActor.viewToModel(this.modelToView(point));
        },

        __setScreenBounds: function () {

//            var AABB = this._AABB;
            var vv = this._viewVertices;
            var vvv, m, x, y, w, h;

            if (this._isAA) {
                m = this._worldModelViewMatrix;
                x = m[2];
                y = m[5];
                w = this._width;
                h = this._height;
                /*
                AABB.x = x;
                AABB.y = y;
                AABB.width = w;
                AABB.height = h;
*/

                vvv = vv[0];
                vvv.x = x;
                vvv.y = y;
                vvv = vv[1];
                vvv.x = x + w;
                vvv.y = y;
                vvv = vv[2];
                vvv.x = x + w;
                vvv.y = y + h;
                vvv = vv[3];
                vvv.x = x;
                vvv.y = y + h;

                return this;
            }

            vvv = vv[0];
            vvv.x = 0;
            vvv.y = 0;
            vvv = vv[1];
            vvv.x = this._width;
            vvv.y = 0;
            vvv = vv[2];
            vvv.x = this._width;
            vvv.y = this._height;
            vvv = vv[3];
            vvv.x = 0;
            vvv.y = this._height;

            for( var i= 0, l=this._viewVertices.length; i<l; i++ ) {
                this.modelToView(this._viewVertices[i]);
            }
/*
            var xmin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE;
            var ymin = Number.MAX_VALUE, ymax = -Number.MAX_VALUE;

            vvv = vv[0];
            if (vvv.x < xmin) {
                xmin = vvv.x;
            }
            if (vvv.x > xmax) {
                xmax = vvv.x;
            }
            if (vvv.y < ymin) {
                ymin = vvv.y;
            }
            if (vvv.y > ymax) {
                ymax = vvv.y;
            }
            vvv = vv[1];
            if (vvv.x < xmin) {
                xmin = vvv.x;
            }
            if (vvv.x > xmax) {
                xmax = vvv.x;
            }
            if (vvv.y < ymin) {
                ymin = vvv.y;
            }
            if (vvv.y > ymax) {
                ymax = vvv.y;
            }
            vvv = vv[2];
            if (vvv.x < xmin) {
                xmin = vvv.x;
            }
            if (vvv.x > xmax) {
                xmax = vvv.x;
            }
            if (vvv.y < ymin) {
                ymin = vvv.y;
            }
            if (vvv.y > ymax) {
                ymax = vvv.y;
            }
            vvv = vv[3];
            if (vvv.x < xmin) {
                xmin = vvv.x;
            }
            if (vvv.x > xmax) {
                xmax = vvv.x;
            }
            if (vvv.y < ymin) {
                ymin = vvv.y;
            }
            if (vvv.y > ymax) {
                ymax = vvv.y;
            }

            AABB.x = xmin;
            AABB.y = ymin;
            AABB.width = (xmax - xmin);
            AABB.height = (ymax - ymin);
*/
            return this;
        },

        /**
         * Process and paint this displayable.
         * @param ctx
         * @param time
         * @returns {boolean}
         * @private
         */
        __paintActor: function (ctx, time) {

            this._dirty = false;
            this.__setModelViewMatrix();

            // if (!this.AABB.intersects(director.AABB)) { return false; }

//        ctx.globalAlpha = this.frameAlpha;

            GS.Math.Matrix.transformRenderingContextSet(ctx, this._worldModelViewMatrix);
            this.paint(ctx, time);

            return true;
        },

        paint: function (ctx, time) {
            ctx.strokeStyle = 'blue';
            ctx.strokeRect(0, 0, this._width, this._height);

        },

        __paintActorGL: function (ctx, time) {

            for( var i= 0, l=this._behaviorList.length; i<l; i+=1 ) {
                this._behaviorList[i].__apply( time, this );
            }

            this._dirty = false;
            this.__setModelViewMatrix();
            if ( this._dirty ) {
                this.__setScreenBounds();
            }

            // if (!this.AABB.intersects(director.AABB)) { return false; }

//        ctx.globalAlpha = this.frameAlpha;
            this.paintGL( ctx, time );
        },

        paintGL : function( ctx, time ) {
            if ( this._spriteImageData ) {
                ctx.drawImage(this);
            } else {
                ctx.fillRect( this );
            }
        },

        /**
         * Associate this actor with some image data.
         * @param sid {GS.SpriteImageData}
         * @param adjustActorToImageSize {boolean=}
         */
        setSpriteImageData : function( sid, adjustActorToImageSize ) {
            this._spriteImageData= sid;
            if ( adjustActorToImageSize ) {
                this._width= sid._width;
                this._height= sid._height;
            }
            return this;
        },

        /**
         *
         * @param behavior {GS.Behavior}
         */
        addBehavior : function( behavior ) {
            this._behaviorList.push( behavior );
            return this;
        },

        pauseAllBehaviors : function() {
            for( var i= 0, l=this._behaviorList.length; i<l; i+=1 ) {
                this._behaviorList[i].pause();
            }
        },

        resumeAllBehaviors : function() {
            for( var i= 0, l=this._behaviorList.length; i<l; i+=1 ) {
                this._behaviorList[i].resume();
            }
        }

    };

    GS.Object.extend(GS.Actor, __GS_ActorPrototype);

})();