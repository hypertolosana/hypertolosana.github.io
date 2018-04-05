
(function() {

    /**
     * @constructor
     */
    SU.ConditionCardSequence= function() {
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionCardSequence.SequenceType= {
        TOP_DOWN:           0,  // K,Q,J...1
        BOTTOM_UP:          1   // 1,2,3...K
    };

    /**
     * @enum
     */
    SU.ConditionCardSequence.SuitType=  {
        EQUAL:              0,  // same suit on every sequence elements.
        SAME_COLOR:         1,  // same color suit
        ALTERNATE_COLOR:    2   // alternating color like in klondike
    };

    var SQ= SU.ConditionCardSequence.SequenceType;
    var ST= SU.ConditionCardSequence.SuitType;

    SU.ConditionCardSequence.prototype= {

        sequenceType : SQ.TOP_DOWN,
        suitType:      ST.ALTERNATE_COLOR,
        increment:     1,

        /**
         *
         * @param seqType {SU.ConditionCardSequence.SequenceType}
         * @param suitType {SU.ConditionCardSequence.SuitType}
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

        /**
         *
         * @param params {object{ card:{SU.Card}Ê}Ê}
         */
        check : function( params )  {

            var card=   params.card;
            var suit=   card.getSuit();
            var scolor= card.getSuitColor();
            var pile=   card.getPile();
            var index=  card.getPositionInPile()+1;
            var sign=   1;

            if ( this.sequenceType=== SQ.TOP_DOWN )   {
                sign= -1;
            }

            while( index!=pile.getSize() )  {
                var ncard=  pile.getCard(index);
                var nsuit=  ncard.getSuit();
                var nscolor=ncard.getSuitColor();

                if ( ncard.getIndex() != card.getIndex() + sign*this.increment ) {
                    return false;
                }

                if ( this.suitType===ST.EQUAL ) {
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

                suit= nsuit;
                scolor= nscolor;
                card= ncard;

                index++;
            }

            return true;
        }
    };

})();