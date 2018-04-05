
(function() {

    /**
     * En un monton el indice mayor es lo que esta encima, y cero lo que esta mas abajo
     * del monton.
     * 
     * @constructor
     */
    SU.Pile= function() {
        this.cards=         [];
        this.listenerList=  [];

        return this;
    };

    /**
     * @enum
     */
    SU.Pile.Type=   {
        TABLEAU:    0,
        FOUNDATION: 1,
        WASTE:      2,
        STOCK:      3,
        TRANSFER:   4
    }

    SU.Pile.Layout= {
        NONE:       0,
        VERTICAL:   1,
        HORIZONTAL: 2
    };

    SU.Pile.prototype= {

        cards:          null,   // cards on this pile
        dragCondition:  null,   // drag condition tree
        dropCondition:  null,   // drop condition tree
        name:           null,

        type:           null,
        visualHint:     { x:0, y:0 },

        listenerList:   null,

        getType : function()    {
            return this.type;
        },

        setDragCondition : function(condition)  {
            this.dragCondition= condition;
            return this;
        },

        setDropCondition : function(condition)  {
            this.dropCondition= condition;
            return this;
        },

        setName : function(name)    {
            this.name= name;
            return this;
        },
        getName : function()    {
            return this.name;
        },
        /**
         *
         * @param card {SU.Card}
         */
        addCard : function( card ) {

            var fromPile= card.getPile();

            card.setPile(this);
            this.cards.push( card );

            this.fire( 'card-added',
                {
                    fromPile:   fromPile,
                    cards:      card
                } );

            return this;
        },

        removeCard : function( card )   {
            var index= this.indexOf( card );
            this.cards.splice( index, 1 );
            return this;
        },

        /**
         *
         * @param cards {Array<SU.Card>}
         */
        addCards : function( cards )    {
            if ( cards && cards.length ) {

                var fromPile= cards[0].getPile();


                this.fire( 'cards-to-be-added',
                    {
                        fromPile:   fromPile,
                        cards:      cards
                    } );


                for( var i=0; i<cards.length; i++ ) {
                    this.addCard( cards[i] );
                }

                this.fire( 'cards-added',
                    {
                        fromPile:   fromPile,
                        cards:      cards
                    } );
            }

            return this;
        },

        isEmpty : function() {
            return this.cards.length===0;
        },

        getSize : function()    {
            return this.cards.length;
        },

        getCard : function(index) {
            return index>=0 ?
                this.cards[index] :
                this.cards[ this.cards.length+index >= 0 ? this.cards.length+index : 0 ];
        },

        getFirstCard : function()   {
            return this.cards[0];
        },

        getLastCard : function()    {
            return this.cards[ this.cards.length-1 ];
        },

        indexOf : function(card)    {

            if ( card.getPile()!==this )    {
                throw 'indexOf called on pile with a not owned card.';
            }

            for( var i=0; i<this.cards.length; i++ )    {
                if ( this.cards[i]===card ) {
                    return i;
                }
            }

            throw 'A card thinks to belong to this pile and indexOf says it does not.';

        },

        /**
         * Check whether we can drag a card from this pile.
         *
         * @param card {SU.Card}
         */
        canDrag : function( card ) {
            if ( card.getPile()!==this )    {
                throw 'Trying to drag a card not in this Pile';
            }

            if ( !this.dragCondition ) {
                return false;
            }

            return this.dragCondition.check(
                {
                    card: card
                } );
        },


        /**
         *
         * @param pile
         */
        canDrop : function( transferPile )  {
            if ( transferPile.getSize()===0 )   {
                throw 'Can not drop an empty pile';
            }

            if ( !this.dropCondition )   {
                return false;
            }

            return this.dropCondition.check( {
                sourcePile:         transferPile,
                destinationPile:    this
                } );
        },

        /**
         * extract a gien amount of cards.
         * @param numCards {integer} numero de cartas a extraer.
         *
         * @return {Array<SU.Card>}
         */
        extract : function( numCards )  {
            numCards= Math.min( numCards, this.cards.length );

            var cards= this.cards.splice( this.cards.length-numCards, numCards );

            this.fire(
                'removed',
                {
                    fromPile:   this,
                    cards:      cards
                } );

            return cards;
        },

        extractDealInit : function() {
            var cards= this.cards.splice( 0, 1 );
            this.fire(
                'removed',
                {
                    fromPile:   this,
                    cards:      cards
                } );

            return cards;
        },

        toString : function()   {
            var str= this.name+' ('+this.cards.length+')\n';

            for( var i=this.cards.length-1; i>=0; i-- ) {
                str+= this.cards[i].toString()+' ';
            }

            return str;
        },

        findCard : function( card ) {
            var i;
            var cardDesc;
            for( i=0; i<this.cards.length; i++ )    {
                cardDesc= this.cards[i].toString();
                if ( cardDesc==card || cardDesc=='*'+card ) {
                    return this.cards[i];
                }
            }

            return null;
        },

        setReady : function( undoAction )   {
            return this;
        },

        setVisualHint : function( vh )  {
            this.visualHint= vh;

            if ( typeof vh.x==='undefined' )    {
                vh.x= 0;
            }
            if ( typeof vh.y==='undefined' )    {
                vh.y= 0;
            }
            if ( typeof vh.cardsDistance==='undefined' ) {
                vh.cardsDistance= 30;
            }

            return this;
        },

        fire : function( event, data )  {
            for( var i= 0, l= this.listenerList.length; i < l; i++ )    {
                this.listenerList[ i ]( this, event, data );
            }
        },

        /**
         *
         * @param listener { function( event{string}, type{string}, data{object} ) }
         */
        addListener : function( listener )  {
            this.listenerList.push(listener);
            return this;
        },

        /**
         * Identify dragable cards based on drag conditions
         */
        setDragInfo : function()    {
            if ( this.getType()===SU.Pile.Type.STOCK )  {
                return;
            }

            for( var i=this.cards.length-1; i>=0; i-- )   {
                var card= this.cards[i];
                card.setDragable( this.canDrag( card ) );
            }
        },

        isTableau : function()  {
            return this.type===SU.Pile.Type.TABLEAU;
        },

        isFoundation : function()   {
            return this.type===SU.Pile.Type.FOUNDATION;
        },

        isWaste : function() {
            return this.type===SU.Pile.Type.WASTE;
        },

        isStock : function() {
            return this.type===SU.Pile.Type.STOCK;
        }
    };
})();