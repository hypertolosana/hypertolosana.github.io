/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 16/12/11
 * Time: 23:05
 */
(function() {
    SU.Game.VisualHint= function() {
        return this;
    };

    SU.Game.VisualHint.CardImage= {
        A : 'A',
        K : 'K',
        NONE : ''
    }

    SU.Game.VisualHint.prototype= {
        dealSize        :   0,                      // num cards to deal
        visible         :   0,                      // number of dealed cards visible
        x               :   0,                      // x position
        y               :   0,                      // y position
        layout          :   SU.Pile.Layout.NONE,    // how to layout cards
        maxSize         :   500,                    // maximum size a pile's card will hold
        cardsDistance   :   30,                     // maximum space between cards
        image           :   'K',                    // image when no cards are present
        cardsShown      :   0,

        setCardsShown : function( cs ) {
            this.cardsShown= cs;
            return this;
        },

        setLocation : function( x, y) {
            this.x= x;
            this.y= y;
            return this;
        },

        setLayout : function( layout ) {
            this.layout= layout;
            return this;
        },

        setMaxSize : function( size ) {
            this.maxSize= size;
            return this;
        },

        setCardsDistance : function( d ) {
            this.cardsDistance= d;
            return this;
        },

        setImage : function( i ) {
            this.image= i;
            return this;
        }

    };
})();