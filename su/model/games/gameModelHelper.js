SU.Helper= {};

/**
 *
 * @param numTableau    {number}
 * @param cards         {number|Array<number>}
 * @param visible       {number|Array<number>}
 * @param layout {
 *          x               {number},
 *          y               {number},
 *          image           {string},
 *          cardsDistance   {number},
 *          layout          { SU.Pile.Layout },
 *          xoffset         {number},
 *          yoffset         {number}
 *        }
 */
SU.Helper.createTableau= function( numTableau, dealSize, visible, layout, condition ) {
    var tableaus= {};

    for( var i=0; i<numTableau; i++ ) {
        var tableau= new SU.Game.VisualHint();

        tableau.dealSize=       dealSize[i];
        tableau.visible=        visible[i];
        tableau.x=              layout.x + layout.xoffset*i;
        tableau.y=              layout.y + layout.yoffset*i;
        if ( typeof layout.layout!=='undefined' )   {
            tableau.layout=         layout.layout ;
        }
        if ( typeof layout.maxSize!=='undefined' ) {
            tableau.maxSize=        layout.maxSize;
        }
        if ( typeof layout.cardsDistance!=='undefined' ) {
            tableau.cardsDistance=  layout.cardsDistance;
        }
        if ( typeof layout.image!=='undefined' ) {
            tableau.image=          layout.image;
        }

        tableaus[i]= tableau;
    }

    tableaus.dragCondition= condition.drag;
    tableaus.dropCondition= condition.drop;

    return tableaus;
};

SU.Helper.createWaste= function( cardsShown, x, y, layout ) {

    if ( typeof cardsShown==='undefined' ) {
        cardsShown= 3;
    }
    if ( typeof x==='undefined' ) {
        x= 150;
    }
    if ( typeof y==='undefined' ) {
        y= 50;
    }
    if ( typeof layout==='undefined' ) {
        layout= SU.Pile.Layout.HORIZONTAL;
    }

    return {
        visualHints     : new SU.Game.VisualHint().
                            setLocation( x, y ).
                            setLayout( layout ).
                            setCardsDistance( 30 ).
                            setImage( SU.Game.VisualHint.CardImage.P ).
                            setCardsShown( cardsShown ) ,
        dragCondition   : new SU.ConditionCardPositionInPile().
                            setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
    };
    /*
    return {
            visualHints: {
                x:              150,
                y:              50,
                layout:         SU.Pile.Layout.NONE,
                cardsShown:     cardsShown,
                cardsDistance:  30,
                image:          'P'
            },
            dragCondition : new SU.ConditionCardPositionInPile().
                setType( SU.ConditionCardPositionInPile.Types.LAST_IN_PILE )
        };
        */
};

SU.Helper.createStock= function( image ) {
    if ( typeof image==="undefined" ) {
        image= SU.Game.VisualHint.CardImage.A;
    }

    return  new SU.Game.VisualHint().
            setLocation( 50, 50 ).
            setLayout( SU.Pile.Layout.NONE ).
            setCardsDistance( 30 ).
            setImage( image );
};

SU.Helper.createFoundation= function( x, xoffset, numDecks, y, yoffset, suitType ) {

    if ( typeof suitType==="undefined" ) {
        suitType= SU.ConditionPileMakeSequence.SuitType.EQUAL;
    }

    if ( typeof numDecks==="undefined" ) {
        numDecks= 1;
    }

    if ( typeof y==='undefined' ) {
        y= 50;
        yoffset= 0;
    }

    if ( typeof x==='undefined' ) {
        x= 350;
    }
    if ( typeof xoffset==='undefined' ) {
        xoffset= 100;
    }

    var obj= {
            dropCondition:
                new SU.ConditionAnd().
                    addCondition(  // se suelta una sola carta
                        SU.Helper.createDestionationPileSizeEquals(
                            1,
                            SU.ConditionOperator.Types.EQ,
                            SU.ConditionPileSize.Types.SOURCE_PILE )
                    ).
                    addCondition(  // y hace una secuencia
                        new SU.ConditionPileMakeSequence().setType(
                                SU.ConditionPileMakeSequence.SequenceType.BOTTOM_UP,
                                suitType,
                                1
                        )
                    ),
            dragCondition:
                new SU.ConditionCardPositionInPile().setType(
                    SU.ConditionCardPositionInPile.Types.LAST_IN_PILE
                )
        };

    for( var i=0; i<4*numDecks; i++ ) {
        obj[i]= {
            x:      x+xoffset*i,
            y:      y+yoffset*i,
            image:  'A',
            layout: SU.Pile.Layout.NONE
        };
    }

    return obj;
};

SU.Helper.createTransfer= function() {
    return {
            visualHints: {
                    x:              0,
                    y:              0,
                    layout:         SU.Pile.Layout.VERTICAL,
                    cardsDistance:  30
                }
        };
};


SU.Helper.createWinConditionKlondike= function() {
    return new SU.ConditionWin();
};

SU.Helper.createWinConditionScorpion= function() {
    return new SU.ConditionWinScorpion();
};

SU.Helper.createDestionationPileIsEmptyCondition= function() {
    return SU.Helper.createDestionationPileSizeEquals(
        0,
        SU.ConditionOperator.Types.EQ,
        SU.ConditionPileSize.Types.DESTINATION_PILE);
};

SU.Helper.createDestionationPileSizeEquals= function( size, operator, pile ) {
    return new SU.ConditionPileSize().setType(
        new SU.ConditionOperator().setOperator( operator, size ),
        pile
    );

}