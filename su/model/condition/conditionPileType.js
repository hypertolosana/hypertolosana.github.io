

(function() {

    /**
     * @constructor
     */
    SU.ConditionPileType= function()    {
        return this;
    };

    SU.ConditionPileType.prototype= {

        type:   null,

        /**
         *
         * @param type {Array<SU.Pile.Type>}
         */
        setType : function(type)    {
            this.type= [].concat( type );
            return this;
        },

        /**
         *
         * @param params {object{ pile:{SU.Pile}Ê}Ê}
         */
        check : function( params )  {

            var t= params.pile.getType();
            var i;

            if ( this.type ) {
                for( i=0; i<this.type.length; i++ ) {
                    if ( this.type[i]===t ) {
                        return true;
                    }
                }
            }

            return false;
        }
    }
})();