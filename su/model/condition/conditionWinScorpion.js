
(function() {

    SU.ConditionWinScorpion= function( ) {
        this.conditionInSequence= new SU.ConditionPileInSequence().setSequenceType( SU.ConditionPileInSequence.Type.FULL_TOP_DOWN );
        return this;
    };

    SU.ConditionWinScorpion.prototype= {

        conditionInSequence : null,

        check : function( params ) {

            var model= params;

            var nPiles= model.getNumDecks()*4;

            var tableau= model.getTableauPiles();
            for( var i=0; i<tableau.length; i++ ) {
                if ( !tableau[i].isEmpty() ) {
                    if ( this.conditionInSequence.check( { pile : tableau[i] } ) ) {
                        nPiles--;
                    }
                }
            }

            return !nPiles;
        }
    };
})();