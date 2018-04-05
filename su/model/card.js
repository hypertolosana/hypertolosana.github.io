
(function() {


    /**
     *
     * @param index {number[1..13]}
     * @param suit {SU.Suit}
     * @constructor
     */
    SU.Card= function(index, suit) {
        this.index=         index;
        this.suit=          suit;
        this.listenerList=  [];

        this.setName();

        return this;
    };

    SU.Card.KING=   13;
    SU.Card.QUEEN=  12;
    SU.Card.JACK=   11;
    SU.Card.ACE=     1;

    SU.Card.prototype= {

        index:          -1,
        suit:           null,
        visible:        false,
        name:           null,
        pile:           null,
        listenerList:   null,

        isDraggable:    false,

        visitedFoundation   :   false,

        reInit : function() {
            this.visitedFoundation= false;
            this.visible= false;
        },
        setVisitedFoundation : function(b) {
            this.visitedFoundation= b;
        },
        hasVisitedFoundation : function() {
            return this.visitedFoundation;
        },
        getIndex : function() {
            return this.index;
        },
        getSuit : function() {
            return this.suit;
        },
        getSuitColor : function() {
            return this.suit.color;
        },
        getSuitId : function() {
            return this.suit.id;
        },
        getSuitName : function() {
            return this.suit.name;
        },
        /**
         *
         * @param visible {boolean}
         */
        setVisible : function(visible) {
            this.visible= visible;
            this.fire( 'visibilityChange', visible );
            //this.setName();
            return this;
        },
        isVisible : function()  {
            return this.visible;
        },
        toString : function() {
            return (this.visible ? '' : '*') + this.name;
        },
        setName : function() {
            //var str= this.visible ? '' : '*';
            var str= '';
            switch(this.index) {
                case  1: str+='A'; break;
                case  2: str+='2'; break;
                case  3: str+='3'; break;
                case  4: str+='4'; break;
                case  5: str+='5'; break;
                case  6: str+='6'; break;
                case  7: str+='7'; break;
                case  8: str+='8'; break;
                case  9: str+='9'; break;
                case 10: str+='10'; break;
                case 11: str+='J'; break;
                case 12: str+='Q'; break;
                case 13: str+='K'; break;
            }

            str+= this.suit.toString();

            this.name= str;
        },
        getName : function()    {
            return this.name;
        },
        /**
         *
         * @param pile {SU.Pile}
         */
        setPile : function( pile ) {
            var fromPile= this.pile;

            this.pile= pile;
            this.fire( 'pileChange', fromPile );
            return this;
        },
        getPile : function() {
            return this.pile;
        },
        getPositionInPile : function()  {
            return this.pile.indexOf(this);
        },

        drag : function()    {
            if ( this.pile.canDrag( this ) ) {

            }
        },

        canDrag : function()    {
            return this.pile.canDrag(this);
        },

        isLastInPile : function()   {
            return this.pile.getLastCard()===this;
        },

        isFirstInPile : function()  {
            return this.pile.getFirstCard()===this;
        },

        /**
         * extract all cards from this pile starting with this and to the last one.
         */
        extract : function()    {
            // extract necesita el numero de cartas a extraer desde el final de la pila.
            // indexof nos da la posicion en la pila, asi que el numero de cartas que
            // queremos extraer es tamPila-posCarta.
            return this.pile.extract( this.pile.getSize() - this.pile.indexOf(this) );
        },

        extractDealInit : function() {
            return this.pile.extractDealInit( );
        },

        removeFromPile : function() {
            this.pile.removeCard( this );
            return this;
        },

        fire : function( type, data ) {
            for( var i=0, l=this.listenerList.length; i<l; i++ )    {
                this.listenerList[i](this, type, data);
            }
        },

        /**
         *
         * @param listener { function( event{string}, type{string}, data{object} ) }
         */
        addListener : function( listener )  {
            this.listenerList.push(listener);
        },

        /**
         * Mark this card as draggable.
         * @param canDrag {boolean}
         */
        setDragable : function( canDrag )   {
            this.isDraggable= canDrag;
            this.fire( 'dragInfo', canDrag );
        },

        isDraggable : function()    {
            return this.isDraggable;
        },

        dealInit : function() {
            this.fire('dealInit', null);
        }

    };
})();