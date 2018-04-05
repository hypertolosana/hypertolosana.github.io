
(function() {

    /**
     * @constructor
     */
    SU.ConditionPileInSequence= function()    {
        this.sequenceType= SU.ConditionPileInSequence.Type.TOP_DOWN;
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionPileInSequence.Type=  {
        FULL_TOP_DOWN       :   5,  // complete K..1
        FULL_BOTTOM_UP      :   6,  // complete 1..K
        TOP_DOWN            :   0,  // K,Q,J...1
        BOTTOM_UP           :   1,  // 1,2,3...K
        WRAPPED_TOP_DOWN    :   2,  // 2,1,K,...
        WRAPPED_BOTTOM_UP   :   3,  // Q,K,1,...
        WRAPPED             :   4   // 1,2,3,2,1,K,1,K,Q,...
    };

    SU.ConditionPileInSequence.prototype= {

        sequenceType:   null,

        /**
         *
         * @param type {SU.ConditionPileInSequence.Type}
         */
        setSequenceType : function( type ) {
            this.sequenceType= type;
            return this;
        },

        /**
         *
         * @param params { object{ pile:{SU.Pile}Ê}Ê}
         */
        check : function(params)    {

            var SequenceType=   SU.ConditionPileInSequence.Type;
            var Card=           SU.Card;
            var card_first=     params.pile.getFirstCard();
            var i;
            var index;
            var card;
            var pile=           params.pile;

            // secuencia de tipo TOP_DOWN (K->Ace), y no comienza por K
            if ( this.sequenceType===SequenceType.TOP_DOWN || this.sequenceType===SequenceType.FULL_TOP_DOWN )  {
                if ( card_first.getIndex()!=Card.KING )   {
                    return false;
                }
            }
            // secuencia de tipo TOP_DOWN (Ace->K), y no comienza por Ace
            else if ( this.sequenceType===SequenceType.BOTTOM_UP || this.sequenceType===SequenceType.FULL_BOTTOM_UP )  {
                if ( card_first.getIndex()!=Card.ACE )   {
                    return false;
                }
            }

            if ( this.sequenceType===SequenceType.FULL_BOTTOM_UP || this.sequenceType===SequenceType.FULL_TOP_DOWN )  {
                // BUGBUG change 13 by number of cards by suit.
                if ( pile.getSize()!=13 ) { // FULL piles require complete suits.
                    return false;
                }
            }

            for( i=1; i<pile.getSize(); i++ ) {

                card= pile.getCard(i);

                // las cartas del monton no tienen el mismo palo
                if ( card.getSuit()!=card_first.getSuit() )   {
                    return false;
                }

                if ( this.sequenceType==SequenceType.TOP_DOWN )  {
                    // indice ahora debe ser 1+indice anterior
                    if ( card_first.getIndex()!=card.getIndex()+1 )   {
                        return false;
                    }
                }
                else if ( this.sequenceType==SequenceType.BOTTOM_UP )  {
                    // indice ahora debe ser indice anterior-1
                    if ( card_first.getIndex()!=card.getIndex()-1 )   {
                        return false;
                    }
                }
                if ( this.sequenceType==SequenceType.WRAPPED_TOP_DOWN )  {
                    // wrap hacia abajo, el siguiente del as debe ser rey
                    index= card_first.getIndex();
                    if ( index==Card.ACE )  {
                        if ( card.getIndex()!=Card.KING )   {
                            return false;
                        }
                    }
                    // indice ahora debe ser 1+indice anterior
                    if ( index!=card.getIndex()+1 )   {
                        return false;
                    }
                }
                else if ( this.sequenceType==SequenceType.WRAPPED_BOTTOM_UP )  {
                    // wrap hacia arriba, el siguiente del rey debe ser as
                    index= card_first.getIndex();
                    if ( index==Card.KING ) {
                        if ( card.getIndex()!=Card.ACE )    {
                            return false;
                        }
                    }
                    // indice ahora debe ser indice anterior-1
                    if ( index!=card.getIndex()-1 )   {
                        return false;
                    }
                }
                else if ( this.sequenceType==SequenceType.WRAPPED )  {
                    index= card_first.getIndex();
                    if ( index==Card.ACE )  {
                        if ( card.getIndex()!=Card.KING && card.getIndex()!=2 ) {
                            return false;
                        }
                    }
                    else if ( index==Card.KING )  {
                        if ( card.getIndex()!=Card.QUEEN && card.getIndex()!=Card.ACE ) {
                            return false;
                        }
                    }
                    else if ( card_first.getIndex()!=card.getIndex()-1 && card_first.getIndex()!=card.getIndex()+1 )   {
                        return false;
                    }
                }

                card_first= card;
            }

            return true;
        }
    }

})();