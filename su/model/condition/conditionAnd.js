
(function() {

    /**
     * @constructor
     */
    SU.ConditionAnd= function() {
        this.conditionList= [];
        return this;
    };

    SU.ConditionAnd.prototype= {
        conditionList:  null,

        /**
         *
         * @param condition {SU.Condition}
         */
        addCondition : function(condition)  {
            this.conditionList.push(condition);
            return this;
        },

        /**
         *
         * @param params {object}
         */
        check : function(params)  {
            for( var i=0, l=this.conditionList.length; i<l; i++ )    {
                if ( !this.conditionList[i].check(params) ) {
                    return false;
                }
            }

            return true;
        }
    };

})();