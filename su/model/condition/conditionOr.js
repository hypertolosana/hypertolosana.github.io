
(function() {

    SU.ConditionOr= function() {
        this.conditionList= [];
        return this;
    };

    SU.ConditionOr.prototype=   {
        
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
                if ( this.conditionList[i].check(params) ) {
                    return true;
                }
            }

            return false;
        }
    }
})();