(function () {

    var STOPPED = 0;
    var PAUSED = 1;
    var RUNNING = 2;
    var CREATED = 3;
    var SOLVED = 4;
    var ENDED = 5;
    var RESUMED = 6;

    /**
     * @class
     * @name Behavior
     * @memberOf GS
     * @param id {number} an id.
     * @param start {number} millis relative to scene time to start application of this behavior
     * @param duration {number} apply this behavior for this millis.
     * @constructor
     */
    GS.Behavior = function (start, duration, id) {

        /**
         * Id to identify this behavior.
         * @property
         * @type {number}
         * @memberOf GS.Behavior.prototype
         */
        this._id = id || 0;

        /**
         * Behavior application start time. This time is RELATIVE to the scene virtual timeline.
         * @property
         * @type {number}
         * @memberOf GS.Behavior.prototype
         */
        this._startTime = start || 0;

        /**
         * Behavior duration. This behavior will be applied from _startTime to _startTime + _duration
         * @property
         * @type {Number}
         * @memberOf GS.Behavior.prototype
         */
        this._duration = duration || 0;

        /**
         * Should this behavior repeat ? How many times ?
         *  1 means apply only one.
         *  0 means the behavior will be applied forever
         * @property
         * @type {number}
         * @memberOf GS.Behavior.prototype
         */
        this._repeatTimes = 1;

        /**
         * on start application callback. Called only once the behavior is in frame time.
         * @property
         * @type { function( GS.Behavior ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onStart = null;

        /**
         * On end application callback. Fired each time the behavior ens applying.
         * This callback may not be called is _repeatTimes is set too high.
         *
         * @property
         * @type { function( GS.Behavior ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onEnd = null;

        /**
         * On repeat application callback. Fired each time the behavior is repeated.
         *
         * @property
         * @type { function( GS.Behavior, repetitionIndex ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onRepeat = null;

        /**
         * On application callback. Fired each time the behavior is applied. this callback can be called many times
         * during the behavior life cycle.
         * @property
         * @type { function( GS.Behavior, value {number}, sceneTime {number}, behaviorTime {number} ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onApply = null;

        /**
         * On pause callback. Fired each time the behavior is paused. this callback can be called many times
         * during the behavior life cycle.
         * @property
         * @type { function( GS.Behavior, lastApplicationTime {number} ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onPause = null;

        /**
         * On resume callback. Fired each time the behavior is resumed. this callback can be called many times
         * during the behavior life cycle.
         * @property
         * @type { function( GS.Behavior, sceneTime {number} ) }
         * @memberOf GS.Behavior.prototype
         */
        this._onResume = null;

        /**
         * Interpolation/Ease function application.
         * @property
         * @type {GS.Interpolator}
         * @private
         */
        this._interpolator = new GS.Interpolator.LinearInterpolator();

        /**
         * Offset this behavior application time.
         * @property
         * @type {number}
         * @private
         */
        this._timeOffset = 0;

        /**
         * Behavior status.
         *
         * Status diagram:
         * <pre>
         * CREATED -> SOLVED -> RUNNING <-----> PAUSED
         *    ^                    |       |
         *    |                    |       +-> STOPPED
         *    |                    v
         *    +----------------- ENDED
         * </pre>
         *
         * @type {number}
         * @private
         * @property
         */
        this._status = CREATED;

        /**
         * When was this Behavior last applied ?
         * In case of pause/resume, we must know, to adjust behavior timeline.
         * @property
         * @type {number}
         * @private
         */
        this._lastApplicationTime = 0;

        return this;
    };

    var __GS_BehaviorPrototype = {

        /**
         * Set this behavior offset time.
         * This method is intended to make a behavior start applying (the first) time from a different
         * start time, sometime in the future.
         * @param offset {number} between 0 and 1
         * @return {*}
         */
        setTimeOffset: function (offset) {
            this._timeOffset = offset;
            return this;
        },

        /**
         * Sets this behavior id.
         * @param id {object}
         *
         */
        setId: function (id) {
            this.id = id;
            return this;
        },

        /**
         * Restart this behavior.
         * This call will make the behavior to reset
         * @param start {number}
         */
        setStartTime: function (start) {
            this._status = CREATED;
            this._startTime = start;
            return this;
        },

        /**
         * @param duration {number}
         */
        setDuration: function (duration) {
            this._duration = duration;
            return this;
        },

        setRepeatTimes: function (repeatTimes) {
            this._repeatTimes = repeatTimes;
            return this;
        },

        setRepeatForever: function () {
            return this.setRepeatTimes(0);
        },

        onStart: function (callback) {
            this.onStart = callback;
            return this;
        },

        onEnd: function (callback) {
            this.onEnd = callback;
            return this;
        },

        onRepeat: function (callback) {
            this.onRepeat = callback;
            return this;
        },

        onApply: function (callback) {
            this.onApply = callback;
            return this;
        },

        onPause : function( callback ) {
            this.onPause= callback;
            return this;
        },

        onResume : function( callback ) {
            this.onResume= callback;
            return this;
        },

        /**
         * Make this behavior not applicable.
         * @return {*}
         */
        stop: function () {
            if (this._status === RUNNING) {
                this._status = STOPPED;
            }
            return this;
        },

        pause: function () {
            if (this._status === RUNNING) {
                this._status = PAUSED;
                if ( this._onPause ) {
                    this._onPause( this, this._lastApplicationTime );
                }
            }
            return this;
        },

        /**
         * Resuming behaviors modifies _startTime property.
         * @returns {*}
         */
        resume: function () {
            if (this._status === PAUSED) {
                this._status= RESUMED;
            }
            return this;
        },

        /**
         * Changes behavior default interpolator to another instance of @link{GS.Interpolator}.
         * @param {GS.Interpolator}
         */
        setInterpolator: function (interpolator) {
            this._interpolator = interpolator;
            return this;
        },

        /**
         * Convert scene time into something more manageable for the behavior.
         * behaviorStartTime will be 0 and behaviorStartTime+behaviorDuration will be 1.
         * the time parameter will be proportional to those values.
         * @param time the scene time to be normalized. an integer.
         * @private
         */
        __normalizeTime: function (time) {
            time = time - this._startTime;
            time %= this._duration;

            return this._interpolator.getValue(time / this._duration);
        },

        /**
         * This method must be overriden for every Behavior breed.
         * Must not be called directly.
         * @param time {number} an integer with the scene time.
         * @param actor {GS.Actor} a target actor.
         * @private
         */
        __setForTime: function (time, actor) {

        },

        /**
         * This method must no be called directly.
         * The director loop will call this method in orther to apply actor behaviors.
         * @param time {number} scene time the behaviro is being applied at.
         * @param actor {GS.Actor} actor the behavior is being applied to.
         */
        __apply: function (time, actor) {

            // just created, so set _startTime absolute to scene time.
            if (this._status === CREATED) {
                this._startTime += time;
                this._status = SOLVED;
            } else if ( this._status === RESUMED ) {
                this._startTime+= time - this._lastApplicationTime;
                this._lastApplicationTime= time;
                this._status = RUNNING;
                if ( this._onResume ) {
                    this._onResume( this, time );
                }
            }

            var orgTime = time;
            var v;

            time += this._timeOffset * this._duration;

            var orgTime = time;
            if (this.__isBehaviorInTime(time, actor)) {
                this._lastApplicationTime = time;
                time = this.__normalizeTime(time);
                v = this.__setForTime(time, actor);
                if (this._onApply) {
                    this._onApply(this, v, orgTime, time)
                }

            }
        },

        /**
         * Chekcs whether the behaviour is in scene time.
         * In case it gets out of scene time, and has not been tagged as expired, the behavior is expired and observers
         * are notified about that fact.
         * @param time {number} the scene time to check the behavior against.
         * @param actor {GS.Actor} the actor the behavior is being applied to.
         * @return {boolean} whether the behavior is applicable.
         */
        __isBehaviorInTime: function (time, actor) {

            // not correct status
            if (this._status === PAUSED || this._status === STOPPED) {
                return false;
            }

            if (this._repeatTimes === 0) {
                // in time, and solved ?. Start it, and notify start status.
                if (this._status === SOLVED) {
                    this._status = RUNNING;
                    if (this._onStart) {
                        this._onStart(this);
                    }
                }
                return true;
            }

            // still not in time
            if (time < this._startTime) {
                return false;
            }

            // in time, and solved ?. Start it, and notify start status.
            if (this._status === SOLVED) {
                this._status = RUNNING;
                if (this._onStart) {
                    this._onStart(this);
                }
            }

            if (time < this._startTime + this._duration * this._repeatTimes) {
                return true;
            } else {

                // time out of duration + start.
                // notify end.
                this._status = ENDED;
                this.__setForTime(1, actor);
                if (this._onEnd) {
                    this._onEnd(this);
                }

            }
        }
    }

    GS.Object.extend(GS.Behavior, __GS_BehaviorPrototype);

})();