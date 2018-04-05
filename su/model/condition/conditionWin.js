
(function() {



    SU.ConditionWin= function( ) {
        this.conditionInSequence=
            new SU.ConditionPileInSequence().setSequenceType(
                SU.ConditionPileInSequence.Type.FULL_BOTTOM_UP );
        return this;
    };

    SU.ConditionWin.prototype= {

        conditionInSequence : null,

        check : function( params ) {

            var model= params;

            var foundation= model.getFoundationPiles();
            for( var i=0; i<foundation.length; i++ ) {
                if ( foundation[i].isEmpty() || !this.conditionInSequence.check( { pile : foundation[i] } ) ) {
                    return false;
                }
            }

            return true;
        }
    };

})();