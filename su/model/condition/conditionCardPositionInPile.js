
(function() {

    /**
     * @constructor
     */
    SU.ConditionCardPositionInPile= function() {
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionCardPositionInPile.Types= {

        LAST_IN_PILE:   0,
        FIRST_IN_PILE:  1
    };

    SU.ConditionCardPositionInPile.prototype=   {

        type:   null,

        /**
         *
         * @param type {SU.ConditionPositionInPile.Types}
         */
        setType : function(type)    {
            this.type= type;
            return this;
        },

        /**
         *
         * @param params {object{ card:{SU.Card} } }
         */
        check : function( params )  {

            var t= SU.ConditionCardPositionInPile.Types;

            switch( this.type ) {
                case t.LAST_IN_PILE:
                    return params.card.isLastInPile();
                case t.FIRST_IN_PILE:
                    return params.card.isFirstInPile();
            }

            return false;
        }
    };

})();