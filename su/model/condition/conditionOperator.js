
(function() {

    /**
     * @constructor
     */
    SU.ConditionOperator= function() {
        return this;
    };

    /**
     * @enum
     */
    SU.ConditionOperator.Types= {
        EQ:     0,
        NEQ:    1,
        GT:     2,
        LT:     3,
        GTE:    4,
        LTE:    5
    };

    SU.ConditionOperator.prototype= {

        operator:   null,
        value:      null,

        /**
         *
         * @param operator {SU.ConditionOperator.Types}
         */
        setOperator : function(operator, value) {
            this.operator= operator;
            this.value= value;
            return this;
        },

        /**
         *
         * @param params {object { op1: object, op2: object } }
         */
        check : function( op2 ) {
            var t=      SU.ConditionOperator.Types;

            switch( this.operator ) {
                case  t.EQ:
                    return this.value===op2;
                case t.NEQ:
                    return this.value!==op2;
                case t.GT:
                    return this.value>op2;
                case t.LT:
                    return this.value<op2;
                case t.GTE:
                    return this.value>=op2;
                case t.LTE:
                    return this.value<=op2;
            }

            return false;
        }
    };


})();