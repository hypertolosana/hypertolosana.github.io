/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 30/12/11
 * Time: 20:19
 */

(function() {

    SU.GamesRegistry.
        register( {
            id              : "Bakers_BakersDozen",
            family          : "Bakers",
            game            : "Bakers dozen",
            clazz           : "SU.Game.Bakers",
            params          : [ 1, false, false ],
            instructions    : ""
        } ).
        register( {
            id              : "Bakers_BakersDozen2",
            family          : "Bakers",
            game            : "Bakers dozen II",
            clazz           : "SU.Game.Bakers",
            params          : [ 1, true, false ],
            instructions    : ""
        }).
        register( {
            id              : "Bakers_SpanishPatience",
            family          : "Bakers",
            game            : "Spanish patience",
            clazz           : "SU.Game.Bakers",
            params          : [ 1, false, true ],
            instructions    : ""
        } ).
        register( {
            id              : "Bakers_SpanishPatience2",
            family          : "Bakers",
            game            : "Spanish patience II",
            clazz           : "SU.Game.Bakers",
            params          : [ 1, true, true ],
            instructions    : ""
        } );


    SU.Game.Bakers= function( numDecks, help, spanish ) {
        var obj=  {
            canRedeal:  false,
            numDecks:   numDecks,       // number of decks
            maxRedeals: -1,             // unlimited
            cardsToDeal:1,              // take 3 cards from stock to waste

//            waste:  SU.Helper.createWaste(1, 1000, 200, SU.Pile.Layout.VERTICAL ),
            stock:  SU.Helper.createStock( SU.Game.VisualHint.CardImage.NONE ).setLocation( 600, 500 ),
            tableau:
                [
                    SU.Helper.createTableau(
                        7,
                        [4,4,4,4,4,4,4],
                        [4,4,4,4,4,4,4],
                        {
                            x               : 25,
                            y               : 60,
                            layout          : SU.Pile.Layout.VERTICAL,
                            cardsDistance   : 30,
                            maxSize         : 170,
                            image           : '',
                            xoffset         : 90,
                            yoffset         : 0
                        },
                        {
                            drag : new SU.ConditionAnd().
                                    addCondition( new SU.ConditionCardIsVisible() ).
                                    addCondition( new SU.ConditionCardPositionInPile().
                                        setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
                                    ),
                            drop : new SU.ConditionPileMakeSequence().
                                    setType(
                                        SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                        SU.ConditionPileMakeSequence.SuitType.ANY,
                                        1
                                        ).
                                    allowDropIfEmpty( false )
                        }
                    ),

                    SU.Helper.createTableau(
                        6,
                        [4,4,4,4,4,4],
                        [4,4,4,4,4,4],
                        {
                            x               : 25,
                            y               : 310,
                            layout          : SU.Pile.Layout.VERTICAL,
                            cardsDistance   : 30,
                            maxSize         : 170,
                            image           : '',
                            xoffset         : 90,
                            yoffset         : 0
                        },
                        {
                            drag : new SU.ConditionAnd().
                                    addCondition( new SU.ConditionCardIsVisible() ).
                                    addCondition( new SU.ConditionCardPositionInPile().
                                        setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
                                    ),
                            drop : new SU.ConditionPileMakeSequence().
                                    setType(
                                        SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                        SU.ConditionPileMakeSequence.SuitType.ANY,
                                        1
                                        ).
                                    allowDropIfEmpty( false )
                        }
                    )
                ],
            foundation  : SU.Helper.createFoundation( 700, 0, 1, help ? 40 : 60, 100,
                !spanish ?
                    SU.ConditionPileMakeSequence.SuitType.EQUAL :
                    SU.ConditionPileMakeSequence.SuitType.ANY ),
            transfer    : SU.Helper.createTransfer(),
            autoplay    :  'tableau-foundation waste-foundation tableau-tableau waste-foundation deal',
            winCondition: SU.Helper.createWinConditionKlondike()

        };

        if ( help ) {
            obj.tableau.push(
                SU.Helper.createTableau(
                    1,
                    [0],
                    [0],
                    {
                        x               : 700,
                        y               : 440,
                        layout          : SU.Pile.Layout.NONE,
                        cardsDistance   : 0,
                        maxSize         : 0,
                        image           : 'K',
                        xoffset         : 0,
                        yoffset         : 0
                    },
                    {
                        drag : new SU.ConditionAnd().
                                addCondition( new SU.ConditionCardIsVisible() ).
                                addCondition( new SU.ConditionCardPositionInPile().
                                    setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
                                ),
                        drop : !spanish ?
                            new SU.ConditionAnd().
                                addCondition(
                                    SU.Helper.createDestionationPileIsEmptyCondition()
                                ).
                                addCondition(
                                    new SU.ConditionPileMakeSequence().
                                        setType(
                                            SU.ConditionPileMakeSequence.SequenceType.TOP_DOWN,
                                            SU.ConditionPileMakeSequence.SuitType.ANY,
                                            1 )
                                ) :
                            new SU.ConditionAnd().
                                addCondition(
                                    SU.Helper.createDestionationPileIsEmptyCondition()
                                )

                    }
                )
            )
        }

        return obj;
    };

})();