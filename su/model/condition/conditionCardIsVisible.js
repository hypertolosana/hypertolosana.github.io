
(function() {

    /**
     * @constructor
     */
    SU.ConditionCardIsVisible= function()   {
        return this;
    };

    SU.ConditionCardIsVisible.prototype=    {

        visible:    true,

        setCondition : function(visible)    {
            this.visible= visible;
            return this;
        },

        /**
         *
         * @param params {object{ card:{SU.Card} } }
         */
        check : function( params )  {
            return params.card.isVisible()===this.visible;
        }
    }

})();
