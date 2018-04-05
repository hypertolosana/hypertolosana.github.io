

(function() {

    /**
     * @constructor
     */
    SU.ConditionCardSuitColor= function()    {
        return this;
    };

    SU.ConditionCardSuitColor.prototype= {

        operator:   null,
        suitcolor:  null,

        /**
         *
         * @param suit      {SU.Suit.Color}
         * @param operator  {SU.ConditionOperator.Types}
         */
        setTypes : function( suitcolor, operator )   {
            this.suitcolor= suitcolor;
            this.operator= new SU.ConditionOperator().setOperator(operator);
            return this;
        },

        /**
         *
         * @param params {object{ card:{SU.Card} } }
         */
        check : function( params ) {
            return this.operator.check( params.card.getSuitColor(), this.suitcolor );
        }
    };
})