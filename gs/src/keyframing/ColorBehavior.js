(function() {

    GS.ColorBehavior= function( r0, g0, b0, r1, g1, b1, start, duration, id ) {

        GS.ColorBehavior._superclass.constructor.call( this, start, duration, id );

        this._r0= r0;
        this._g0= b0;
        this._b0= b0;

        this._r1= r1;
        this._g1= g1;
        this._b1= b1;

        return this;
    };

    var __GS_ColorBehavior= {

        __setForTime: function (time, actor) {

            var r = this._r0 + time * (this._r1 - this._r0);
            var g = this._g0 + time * (this._g1 - this._g0);
            var b = this._b0 + time * (this._b1 - this._b0);
            actor.setColor( r,g,b );
        }
    }

    GS.Behavior.extend( GS.ColorBehavior, __GS_ColorBehavior );

})();