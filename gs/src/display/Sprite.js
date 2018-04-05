(function () {

    /**
     * @name Sprite
     * @memberOf GS
     * @extends GS.ActorContainer
     * @constructor
     */
    GS.Sprite = function () {

        GS.Sprite._superclass.constructor.call(this);

        /**
         * @map
         * @property
         * @memberOf GS.Sprite.prototype
         */
        this._animations = {};

        /**
         * @property
         * @type {null}
         * @memberOf GS.Sprite.prototype
         */
        this._currentAnimation = null;

        /**
         * When the animation started playing.
         * @property
         * @type {number}
         * @memberOf GS.Sprite.prototype
         */
        this._animationStartTime = -1;

        /**
         * Does this sprite have to keep original SpriteImage size, or its own ?
         * @property
         * @type {boolean}
         * @private
         */
        this._boundsSet = false;

        return this;
    };


    var __GS_Sprite = {

        /**
         *
         * @param name {string} name to identify this animation
         * @param si {GS.SpriteImage} a SpriteImage object.
         * @param animationFramesIndexes {Array.<number>} An array of indexes that identify SpriteImageData objects by
         *      index.
         */
        addAnimation: function (name, si, animationFramesIndexes) {
            this._animations[ name ] = {
                spriteImage: si,
                animationFrames: animationFramesIndexes,
                interval: 100
            };

            return this;
        },

        setBounds : function( x,y,w,h ) {

            this._boundsSet= true;
            return GS.Sprite._superclass.setBounds.call( this, x,y,w,h );
        },

        /**
         * Play an animation. Change animation frame every 'interval' millis, and notify onEndSequenceCallback every
         * time the animation should restarts.
         * @param name {string} a previously allocated animation name.
         * @param interval {number} milliseconds between two animation frames.
         * @param onEndSequenceCallback { function(animationName : string) } a callback notifying the animation should restart.
         */
        playAnimation: function (name, interval, onEndSequenceCallback) {
            if (this._currentAnimation === name) {
                return this;
            }

            var animation = this._animations[ name ];
            if (!animation) {
                return this;
            }

            animation.interval = interval;
            this._currentAnimation = animation;
            this._animationStartTime = -1;

            return this;
        },

        __paintActorGL: function (ctx, time) {

            if (!this._currentAnimation) {
                return this;
            }

            if (this._animationStartTime === -1) {
                this._animationStartTime = time;
            }

            var elapsedAnimationTime = time - this._animationStartTime;
            var animationIndex = ( (elapsedAnimationTime / this._currentAnimation.interval) | 0 ) % this._currentAnimation.animationFrames.length;

            var spriteImageData = this._currentAnimation.spriteImage.getImageDataByIndex(
                this._currentAnimation.animationFrames[animationIndex]);
            this.setSpriteImageData(spriteImageData, !this._boundsSet);

            GS.Sprite._superclass.__paintActorGL.call( this, ctx, time );
        },

        paintGL : function( ctx, time ) {
            ctx.drawImage(this);
        }
    };

    GS.Actor.extend(GS.Sprite, __GS_Sprite);

})();