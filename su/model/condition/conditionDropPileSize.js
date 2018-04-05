
(function() {

    /**
     * @constructor
     */
    SU.ConditionPileSize= function()    {
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionPileSize.Types= {
        DESTINATION_PILE:   0,
        SOURCE_PILE:        1
    };

    SU.ConditionPileSize.prototype= {

        operator:   null,
        type:       null,

        setType : function( operator, type )    {
            this.operator=  operator;
            this.type=      type;
            return this;
        },

        /**
         *
         * @param params {object{ sourcePile:{SU.Pile}, destinationPile:{SU.Pile}Ê}Ê}
         */
        check : function( params )  {

            var pile= this.type===SU.ConditionPileSize.Types.SOURCE_PILE ?
                params.sourcePile :
                params.destinationPile;

            return this.operator.check( pile.getSize() );
        }
    }

})();