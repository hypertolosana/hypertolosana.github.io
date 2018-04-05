
(function() {

    /**
     * @constructor
     */
    SU.ConditionCardSuit= function()    {
        return this;
    };

    SU.ConditionCardSuit.prototype= {

        operator:   null,
        suit:       suit,

        /**
         *
         * @param suit      {SU.Suit}
         * @param operator  {SU.ConditionOperator.Types}
         */
        setTypes : function( suit, operator )   {
            this.suit= suit;
            this.operator= new SU.ConditionOperator().setOperator(operator);
            return this;
        },

        /**
         *
         * @param params {object{ card:{SU.Card} } }
         */
        check : function( params ) {
            return this.operator.check( params.card.getSuit(), this.suit );
        }
    };
})