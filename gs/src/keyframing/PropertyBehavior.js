(function () {

    /**
     * @name RotateBehavior
     * @memberOf GS
     * @extends GS.Behavior
     * @constructor
     *
     * @param starAngle
     * @param endAngle
     */
    GS.PropertyBehavior = function (property, start, end, startTime, duration, id) {

        GS.PropertyBehavior._superclass.constructor.call(this, startTime, duration, id);

        this._property= property;
        this._start= start;
        this._end= end;

        return this;
    };

    var __GS_PropertyBehaviorPrototype = {

        /**
         *
         * @param time {number} normalized time relative to Behavior start and end time.
         * @param actor {GS.Actor}
         * @returns {number}
         * @private
         */
        __setForTime: function (time, actor) {

            var v = this._start + time * (this._end - this._start);
            actor[this._property]= v;
        }
    };

    GS.Behavior.extend(GS.PropertyBehavior, __GS_PropertyBehaviorPrototype);

})();