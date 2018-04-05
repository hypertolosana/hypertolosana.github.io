
(function() {

    /**
     * @constructor
     */
    SU.ConditionPileMakeSequence= function() {
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionPileMakeSequence.SequenceType= {
        TOP_DOWN:           0,  // K,Q,J...1
        BOTTOM_UP:          1,  // 1,2,3...K
        TOP_DOWN_ANY    :   2,  // any, any-1, any-2, ...
        BOTTOM_UP_ANY   :   3   // any, any+1, any+2, ...
    };

    /**
     * @enum
     */
    SU.ConditionPileMakeSequence.SuitType=  {
        EQUAL:              0,  // same suit on every sequence elements.
        SAME_COLOR:         1,  // same color suit
        ALTERNATE_COLOR:    2,   // alternating color like in klondike
        ANY:                3
    };

    var SQ= SU.ConditionPileMakeSequence.SequenceType;
    var ST= SU.ConditionPileMakeSequence.SuitType;

    SU.ConditionPileMakeSequence.prototype= {

        sequenceType    : SQ.TOP_DOWN,
        suitType        : ST.ALTERNATE_COLOR,
        increment       : 1,
        allowIfEmpty    : true,

        /**
         *
         * @param seqType {SU.ConditionPileMakeSequence.SequenceType}
         * @param suitType {SU.ConditionPileMakeSequence.SuitType}
         * @param increment {integer} how varies next card index in sequence. ie. 3,2,1 
         *  (increment=1) or 6,4,2 (increment=2)...
         */
        setType : function( seqType, suitType, increment ) {
            this.sequenceType= seqType;
            this.suitType= suitType;
            
            if ( typeof increment!=='undefined' )   {
                this.increment= increment;
            }
            
            return this;
        },

        allowDropIfEmpty : function( allow ) {
            this.allowIfEmpty= allow;
            return this;
        },

        /**
         *
         * @param params {object{ card:{SU.Card}Ê}Ê}
         */
        check : function( params )  {

            // drop en pila vac’a,
            if ( params.destinationPile.getSize()===0 ) {
                if ( !this.allowIfEmpty ) {
                    return false;
                }

                if ( this.sequenceType===SQ.TOP_DOWN || this.sequenceType===SQ.BOTTOM_UP ) {
                    var compareValue= this.sequenceType===SQ.TOP_DOWN ?
                            SU.Card.KING :
                            SU.Card.ACE;
                    var index= params.sourcePile.getFirstCard().getIndex();

                    return index===compareValue;
                } else {

                    // for (t-d | b-u)_any, if empty any card will do.
                    return true;
                }
            }

            var card=   params.sourcePile.getFirstCard();
            var suit=   card.getSuit();
            var scolor= card.getSuitColor();
            var sign=   -1;

            if ( this.sequenceType=== SQ.TOP_DOWN || this.sequenceType===SQ.TOP_DOWN_ANY)   {
                sign= 1;
            }
            
            var ncard=  params.destinationPile.getLastCard();
            var nsuit=  ncard.getSuit();
            var nscolor=ncard.getSuitColor();

            if ( ncard.getIndex() != card.getIndex() + sign*this.increment ) {
                return false;
            }

            if ( this.suitType===ST.ANY ) {
                return true;
            } else if ( this.suitType===ST.EQUAL ) {
                if ( suit!==nsuit)  {
                    return false;
                }
            } else if ( this.suitType===ST.SAME_COLOR ) {
                if ( nscolor!==scolor ) {
                    return false;
                }
            } else if ( this.suitType===ST.ALTERNATE_COLOR )    {
                if ( nscolor===scolor ) {
                    return false;
                }
            }

            return true;
        }
    };

})();