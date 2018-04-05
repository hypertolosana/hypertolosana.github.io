/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 15/12/11
 * Time: 22:53
 */

(function() {

    SU.GamesRegistry.
        register( {
            id              : "Whitecard_Whitecard",
            family          : "Whitecard",
            game            : "Whitecard",
            clazz           : "SU.Game.WhiteCard",
            params          : [ 1 ],
            instructions    : ""
        } );

    function tableau() {
        var t0= SU.Helper.createTableau(
            8,
            [7,7,7,7,6,6,6,6],
            [7,7,7,7,6,6,6,6],
            {
                x               : 25,
                y               : 200,
                layout          : SU.Pile.Layout.VERTICAL,
                cardsDistance   : 30,
                maxSize         : 270,
                image           : 'P',
                xoffset         : 75,
                yoffset         : 0
            },
            {
                drag :  new SU.ConditionCardPositionInPile().setType(
                            SU.ConditionCardPositionInPile.Types.LAST_IN_PILE
                        ),
                drop :  new SU.ConditionOr().
                            addCondition(
                                new SU.ConditionPileSize().setType(
                                    new SU.ConditionOperator().setOperator(
                                        SU.ConditionOperator.Types.EQ,
                                        0 ),
                                    SU.ConditionPileSize.Types.DESTINATION_PILE
                                )
                            ).
                            addCondition( new SU.ConditionPileMakeSequence().setType(
                                SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                SU.ConditionPileMakeSequence.SuitType.ALTERNATE_COLOR,
                                1 ) )
            }
        );

        var t1= SU.Helper.createTableau(
            4,
            [0,0,0,0],
            [0,0,0,0],
            {
                x               : 25,
                y               : 50,
                layout          : SU.Pile.Layout.VERTICAL,
                cardsDistance   : 0,
                maxSize         : 270,
                image           : 'P',
                xoffset         : 75,
                yoffset         : 0
            },
            {

                drag : /*new SU.ConditionAnd().
                        addCondition( new SU.ConditionCardIsVisible() ).
                        addCondition( new SU.ConditionCardSequence().setType(
                            SU.ConditionCardSequence.SequenceType.TOP_DOWN,
                            SU.ConditionCardSequence.SuitType.ALTERNATE_COLOR,
                            1)
                        ),
                        */
                        { check: function() { return true; } },

                drop :  SU.Helper.createDestionationPileIsEmptyCondition()
            }
        );

        return [t0, t1];
    }

    SU.Game.WhiteCard= function( numDecks ) {
        return  {
            canRedeal           :   false,
            numDecks            :   numDecks,   // number of decks
            maxRedeals          :   -1,          // unlimited
            cardsToDeal         :   0,          // take 3 cards from stock to waste
            dealToWaste         :   false,
            trivialMovements    :   false,
            stock               :   SU.Helper.createStock('').setLocation( 400, 500 ),
            tableau             :   tableau(),
            foundation          :   SU.Helper.createFoundation(400,75),
            transfer            :   SU.Helper.createTransfer(),
            autoplay            :   'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition        :   SU.Helper.createWinConditionKlondike()

        };
    };
})();