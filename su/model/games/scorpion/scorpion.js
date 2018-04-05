/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 15/12/11
 * Time: 22:53
 */

(function() {

    SU.GamesRegistry.
        register( {
            id              : "Scorpion_Scorpion",
            family          : "Scorpion",
            game            : "Scorpion",
            clazz           : "SU.Game.Scorpion",
            params          : [ 1, 0 ],
            instructions    : ""
        } );

    SU.Game.Scorpion= function( numDecks, maxRedeals ) {
        return  {
            numDecks            :   numDecks,       // number of decks
            maxRedeals          :   maxRedeals,     // 1
            cardsToDeal         :   1,              // take 1 cards from stock to waste
            dealToWaste         :   false,
            trivialMovements    :   false,

            stock               :  SU.Helper.createStock().setLocation(700,50),
            tableau             :
                SU.Helper.createTableau(
                    7,
                    [7,7,7,7,7,7,7],
                    [5,5,5,7,7,7,7],
                    {
                        x               : 30,
                        y               : 50,
                        layout          : SU.Pile.Layout.VERTICAL,
                        cardsDistance   : 30,
                        maxSize         : 470,
                        image           : 'K',
                        xoffset         : 90,
                        yoffset         : 0
                    },
                    {
                        drag : new SU.ConditionAnd().
                                addCondition( new SU.ConditionCardIsVisible()
                                ),
                        drop : new SU.ConditionPileMakeSequence().setType(
                                SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                SU.ConditionPileMakeSequence.SuitType.EQUAL,
                                1
                                )
                    }
                ),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionScorpion()

        };
    };
})();