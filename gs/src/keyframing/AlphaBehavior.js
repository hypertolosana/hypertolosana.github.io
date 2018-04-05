(function() {

    GS.AlphaBehavior= function( a0, a1, start, duration, id ) {

        GS.AlphaBehavior._superclass.constructor.call( this, start, duration, id );

        this._a0= a0;
        this._a1= a1;

        return this;
    };

    var __GS_AlphaBehavior= {

        __setForTime: function (time, actor) {

            var a = this._a0 + time * (this._a1 - this._a0);
            actor.setAlpha(a);
        }
    }

    GS.Behavior.extend( GS.AlphaBehavior, __GS_AlphaBehavior );

})();