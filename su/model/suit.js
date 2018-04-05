

(function() {

    SU.Suit= function(id,name,color) {
        this.id=    id;
        this.name=  name;
        this.color= color;

        return this;
    };

    SU.Suit.prototype= {
        id:     null,
        name:   null,
        color:  null,

        toString:   function() {
            return this.name;
        }
    }

    /**
     * @enum
     */
    SU.Suit.Color= {
        RED:    'red',
        BLACK:  'black'
    };

    /**
     * @enum
     */
    SU.Suit.Name= {
        HEARTS:     'H',
        DIAMONDS:   'D',
        SPADES:     'S',
        CLUBS:      'C'
    };

    SU.Suits= [
        new SU.Suit(0,  SU.Suit.Name.HEARTS,    SU.Suit.Color.RED   ),
        new SU.Suit(1,  SU.Suit.Name.DIAMONDS,  SU.Suit.Color.RED   ),
        new SU.Suit(2,  SU.Suit.Name.SPADES,    SU.Suit.Color.BLACK ),
        new SU.Suit(3,  SU.Suit.Name.CLUBS,     SU.Suit.Color.BLACK )
    ];

})();