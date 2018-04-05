/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 30/12/11
 * Time: 20:19
 */

(function() {

    SU.GamesRegistry.
        register( {
            id              : "Canfield_Canfield",
            family          : "Canfielf",
            game            : "Canfield",
            clazz           : "SU.Game.Canfield",
            params          : [ 1, 1 ],
            instructions    : ""
        } );

    SU.Game.Canfield= function( cardsToDeal, numDecks ) {
        return  {
            canRedeal:  true,
            numDecks:   numDecks,      // number of decks
            maxRedeals: -1,             // unlimited
            cardsToDeal:cardsToDeal,   // take 3 cards from stock to waste

            waste:  SU.Helper.createWaste(5, 700, 200, SU.Pile.Layout.VERTICAL ),
            stock:  SU.Helper.createStock().setLocation( 700, 50 ),
            tableau:
                [
                    SU.Helper.createTableau(
                        4,
                        [1,1,1,1],
                        [1,1,1,1],
                        {
                            x               : 50,
                            y               : 200,
                            layout          : SU.Pile.Layout.VERTICAL,
                            cardsDistance   : 30,
                            maxSize         : 270,
                            image           : 'K',
                            xoffset         : 100,
                            yoffset         : 0
                        },
                        {
                            drag : new SU.ConditionAnd().
                                    addCondition( new SU.ConditionCardIsVisible() ).
                                    addCondition( new SU.ConditionCardSequence().setType(
                                        SU.ConditionCardSequence.SequenceType.TOP_DOWN,
                                        SU.ConditionCardSequence.SuitType.ALTERNATE_COLOR,
                                        1)
                                    ),
                            drop : new SU.ConditionPileMakeSequence().setType(
                                    SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN_ANY,
                                    SU.ConditionPileMakeSequence.SuitType.ALTERNATE_COLOR,
                                    1
                                    )
                        }
                    ),

                    SU.Helper.createTableau(
                        1,
                        [14],
                        [1],
                        {
                            x               : 450,
                            y               : 200,
                            layout          : SU.Pile.Layout.VERTICAL,
                            cardsDistance   : 15,
                            maxSize         : 250,
                            image           : 'K',
                            xoffset         : 100,
                            yoffset         : 0
                        },
                        {
                            drag    : new SU.ConditionCardPositionInPile().
                                        setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
                        }
                    )
                ],
            foundation  : SU.Helper.createFoundation( 50, 100 ),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionKlondike()

        };
    };

})();