/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 15/12/11
 * Time: 22:53
 */

(function() {

    SU.GamesRegistry.
        register( {
            id              : "Klondike_Klondike",
            family          : "Klondike",
            game            : "Klondike",
            clazz           : "SU.Game.Klondike",
            params          : [ 1, 1, -1 ],
            instructions    : ""
        } ).
        register( {
            id              : "Klondike_Klondike3",
            family          : "Klondike",
            game            : "Klondike Deal 3",
            clazz           : "SU.Game.Klondike",
            params          : [ 3, 1, -1 ],
            instructions    : ""
        } ).
        register( {
            id              : "Klondike_Whitehead",
            family          : "Klondike",
            game            : "Klondike_WhiteHead",
            clazz           : "SU.Game.Klondike_Whitehead",
            params          : [],
            instructions    : ""
        } ).
        register( {
            id              : "Klondike_Yukon",
            family          : "Klondike",
            game            : "Klondike_Yukon",
            clazz           : "SU.Game.Klondike_Yukon",
            params          : [],
            instructions    : ""
        } );



    SU.Game.Klondike= function( cardsToDeal, numDecks, maxRedeals ) {
        return  {
            canRedeal:  true,
            numDecks:   numDecks,      // number of decks
            maxRedeals: maxRedeals,    // unlimited
            cardsToDeal:cardsToDeal,   // take 3 cards from stock to waste

            waste:  SU.Helper.createWaste(),
            stock:  SU.Helper.createStock(),
            tableau:
                SU.Helper.createTableau(
                    7,
                    [1,2,3,4,5,6,7],
                    [0,0,0,0,0,0,0],
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
                                SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                SU.ConditionPileMakeSequence.SuitType.ALTERNATE_COLOR,
                                1
                                )
                    }
                ),
            foundation  : SU.Helper.createFoundation(),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionKlondike()

        };
    };


    SU.Game.Klondike_Yukon= function( ) {
        return  {
            canRedeal:  false,
            numDecks:   1,      // number of decks
            maxRedeals: -1,    // unlimited
            cardsToDeal:0,   // take 3 cards from stock to waste

            waste:  SU.Helper.createWaste(),
            stock:  SU.Helper.createStock(),
            tableau:
                SU.Helper.createTableau(
                    7,
                    [1,6,7,8,9,10,11],
                    [1,5,5,5,5,5,5],
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
                                addCondition( new SU.ConditionCardIsVisible() ),
                        drop : new SU.ConditionPileMakeSequence().setType(
                                SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                SU.ConditionPileMakeSequence.SuitType.ALTERNATE_COLOR,
                                1
                                )
                    }
                ),
            foundation  : SU.Helper.createFoundation(),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionKlondike()

        };
    };

    SU.Game.Klondike_Whitehead= function( ) {
        return  {
            canRedeal:  false,
            numDecks:   1,  // 1 deck
            maxRedeals: 0,  // 0
            cardsToDeal:1,  // take 1 cards from stock to waste

            waste:  SU.Helper.createWaste(),
            stock:  SU.Helper.createStock(),
            tableau:
                SU.Helper.createTableau(
                    7,
                    [1,2,3,4,5,6,7],
                    [1,2,3,4,5,6,7],
                    {
                        x               : 50,
                        y               : 200,
                        layout          : SU.Pile.Layout.VERTICAL,
                        cardsDistance   : 30,
                        image           : 'P',
                        xoffset         : 100,
                        yoffset         : 0,
                        maxSize         : 270
                    },
                    {
                        drag : new SU.ConditionAnd().
                                addCondition( new SU.ConditionCardIsVisible() ).
                                addCondition( new SU.ConditionCardSequence().setType(
                                    SU.ConditionCardSequence.SequenceType.TOP_DOWN,
                                    SU.ConditionCardSequence.SuitType.EQUAL,
                                    1)
                                ),
                        drop : new SU.ConditionOr().
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
                                    SU.ConditionPileMakeSequence.SuitType.SAME_COLOR,
                                    1 ) )
                    }
                ),
            foundation  : SU.Helper.createFoundation(),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionKlondike()

        };
    };
})();