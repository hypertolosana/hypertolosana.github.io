
(function() {

    /**
     * @constructor
     */
    SU.Model= function() {
        this.undoList=      [];
        this.listenerList=  [];

        return this;
    };

    /**
     * @enum
     */
    SU.Model.Status= {
        DEALING     :   0,
        TESTING     :   1,
        USER        :   2,
        AUTOMATIC   :   3,
        ANIMATION   :   4,
        LOST        :   5,
        WIN         :   6
    };

    SU.Model.prototype= {

        listenerList:       null,   // Model listener collection.
        undoList:           null,   // Collection of Actions performed on model.
        undoIndex:          -1,     // This value is the index into de undoList to undo/redo actions.
        winConditionList:   null,   // Array of conditions that must be met to win the game.
        validDropTargets:   null,   // At any given time, the list of valid drop piles.

        maxRedeals:         3,      // Maximum number of game redeals.
        numDeals:           0,      // If this value reaches maxRedeals the game is over.
        cardsToDeal:        3,      // Cards transferred from deck to waste pile each time.

        transfer:           null,   // Transfer pile instance.
        stock:              null,   // Stock pile instance.
        waste:              null,   // Waste pile instance.
        tableau:            null,   // Tableau piles collection on the current game.
        foundation:         null,   // Foundation piles collection on the current game.

        piles:              null,

        actionCount:        0,      // Number of actions for each valid movement.

        moves:              0,
        startTime:          0,

        suggestedMoves:     null,

        dealToWaste     :   true,
        trivialMovements:   true,

        restart : function() {
            this.create( this.game );
            this.fire( 'restart', null );

        },

        /**
         *
         * {
            numDecks:   1,      // number of decks
            maxRedeals: 0,      // unlimited
            cardsToDeal:3,      // take 3 cards from stock to waste

            tableau:    {
                0:  { dealSize: 1 },
                1:  { dealSize: 2 },
                2:  { dealSize: 3 },
                3:  { dealSize: 4 },
                4:  { dealSize: 5 },
                5:  { dealSize: 6 },
                6:  { dealSize: 7 }
            },
            foundation: {
                0:  {},
                1:  {},
                2:  {},
                3:  {}
            }
         * @param game
         */
        create : function( game )   {
            this.game=          game;

            this.maxRedeals=    game.maxRedeals;
            this.cardsToDeal=   game.cardsToDeal;

            if ( typeof game.trivialMovements!=='undefined' ) {
                this.trivialMovements= game.trivialMovements;
            }

            if ( typeof game.dealToWaste!=='undefined' ) {
                this.dealToWaste= game.dealToWaste;
            }

            this.piles=         [];
            this.numDecks=      game.numDecks;

            this.stock=         new SU.PileStock().
                initialize( game.numDecks, this.cardEvent.bind(this) ).
                setVisualHint( game.stock );

            if ( typeof game.waste!=='undefined' ) {
                this.waste=         new SU.PileWaste().
                    setVisualHint( game.waste.visualHints ).
                    setDragCondition( game.waste.dragCondition );
                this.piles.push( this.waste );
            }

            this.transfer=      new SU.PileTransfer().
                setVisualHint( game.transfer.visualHints );

            this.createTableau(game);

            if ( typeof game.foundation!=='undefined' ) {
                this.createFoundation(game);
                for( i=0; i<this.foundation.length; i++ )  {
                    this.piles.push( this.foundation[i] );
                }
            }

            this.piles.push( this.stock );

            var i;
            for( i=0; i<this.tableau.length; i++ )  {
                this.piles.push( this.tableau[i] );
            }


            this.winConditionList= game.winCondition;

            return this;
        },

        /**
         * Reclamar todas las cartas a baraja
         * Eliminar lista de undo/redo
         * Repartir nuevamente.
         */
        reInit : function() {
            var i;

            // FIX FIX call this.piles[i].reinit( this.stock );

            for( i=0; i<this.piles.length; i++ ) {
                if ( !this.piles[i].isStock() ) {
                    var pile= this.piles[i];

                    for( var j=0; j<pile.cards.length; j++ ) {
                        var card= pile.cards[j];
                        this.stock.cards.push( card );
                        card.pile= this.stock;
                    }

                    pile.cards= [];
                }
            }

            for( i=0; i<this.stock.cards.length; i++ ) {
                this.stock.cards[i].reInit();
            }

            this.undoList= [];
            this.undoIndex= -1;
            this.validDropTargets= [];
            this.actionCount= 0;
            this.moves= 0;
            this.startTime= new Date().getTime();
            this.suggestedMoves= [];

            this.fire( 'reinit', null );

            this.stock.shuffle();
            this.dealInit();


        },

        getNumDecks : function() {
            return this.numDecks
        },

        addListener : function( f ) {
            this.listenerList.push(f);
        },

        fire : function( event, data ) {
            for( var i=0; i<this.listenerList.length; i++ ) {
                this.listenerList[i]( event, data );
            }
        },

        createFoundation : function(game)  {

            var index=0;
            var foundationInfo;
            var pile;

            this.foundation= [];

            for( var i=0; i<this.numDecks*4; i++ )  {
                foundationInfo= game.foundation[index];

                pile= new SU.PileFoundation().
                    setName( 'Foundation-'+(1+index) ).
                    setDragCondition( game.foundation.dragCondition ).
                    setDropCondition( game.foundation.dropCondition ).
                    setVisualHint( foundationInfo );

                this.foundation.push( pile );

                index++;
            }

        },

        createTableau : function(game)  {

            var i;
            this.tableau= [];

            function addTableauObject( tableauSource, tableauModel ) {
                var index=0;
                var tableauInfo;
                var pile;

                while( tableauSource[index] )    {
                    tableauInfo= tableauSource[index];

                    pile= new SU.PileTableau().
                        setCardsOnStart( tableauInfo.dealSize ).
                        setName( 'Tableau-'+(1+index) ).
                        setDragCondition( tableauSource.dragCondition ).
                        setDropCondition( tableauSource.dropCondition ).
                        setVisualHint( tableauInfo );

                    tableauModel.push( pile );

                    index++;
                }
            }

            // game es array
            if ( Object.prototype.toString.call(game.tableau) == "[object Array]" ) {
                for( i=0; i<game.tableau.length; i++ ) {
                    addTableauObject( game.tableau[i], this.tableau );
                }
                for( i=0; i<this.tableau.length; i++ ) {
                    this.tableau[i].setName('Tableau-'+i);
                }
            } else {
                addTableauObject(game.tableau, this.tableau);
            }


        },

        shuffle : function()    {
            this.stock.shuffle();
            return this;
        },

        /**
         *
         * @param status {SU.Model.Status}
         */
        setStatus : function( status ) {
            this.status= status;
            this.fire('status', status);
            return this;
        },

        getStatus : function() {
            return this.status;
        },

        dealInit : function() {

            this.startTime= new Date().getTime();
            this.setStatus( SU.Model.Status.DEALING );
            
            var i,j;

            for( i=0; i<this.tableau.length; i++ )  {

                var visible= this.tableau[i].visualHint.visible;
                var size= this.tableau[i].getCardsOnStart();

                for( j=0; j<size; j++ ) {
                    var card= this.stock.getLastCard( );

                    if ( visible ) {
                        if ( (size-(visible|0))<=j ) {
                            card.setVisible(true);
                        }
                    }

                    this.transfer.startTransfer( card );
                    //this.transfer.startTransferDealInit( card );
                    this.transferCards( this.tableau[i], true );
                }
            }

            for( i=0; i<this.tableau.length; i++ )  {
                this.tableau[i].setReady();
                this.actionCount++;
            }

            this.fire( 'dealInit', { actions: this.actionCount } );
            
            this.actionCount=0;
            this.setDragInfo();

            return this;
        },

        afterDealInit : function() {
            this.ready();
        },

        checkWin : function() {
            return this.winConditionList.check( this );
        },

        ready : function() {

            this.setStatus( SU.Model.Status.TESTING );

            if ( this.checkWin() ) {
                this.setStatus( SU.Model.Status.WIN );
            } else {

                this.suggestedMoves= this.findAvailableMovements();
                if ( this.suggestedMoves.length===0 && !this.canRedeal() ) {
                    this.setStatus( SU.Model.Status.LOST )
                } else {

                    // identify draggable sources
                    this.setDragInfo();

                    if ( !this.solveTrivialMovements() ) {
                        this.setStatus( SU.Model.Status.USER );
                    }
                }
            }
        },

        canRedeal : function() {
            return  this.maxRedeals===-1 ||              // inifinitos redeals
                    !this.stock.isEmpty() ||
                    (this.waste && !this.waste.isEmpty() && this.numDeals < this.maxRedeals);   // hay cartas para recoger y repartir.
        },

        /**
         * Pasar cartas de baraja a waste si es que queda alguna.
         */
        deal : function()   {

            this.actionCount=0;

            this.incrementMoves();

            if ( !this.stock.getSize() ) {

                if ( ! this.canRedeal() ) {
                    return this;
                }

                if ( !this.waste.getSize() )    {
                    return this;
                }

                this.transfer.startTransfer( this.waste.getFirstCard() );
                this.transferCards( this.stock );

                this.numDeals++;
                this.addAction( new SU.ActionRedealCount(this) );

            } else {

                if ( this.dealToWaste ) {
                    this.transfer.startTransfer( this.stock.getCard( -this.cardsToDeal ) );
                    this.transferCards( this.waste );
                } else {
                    var max= Math.min( this.tableau.length, this.stock.getSize() );
                    this.dealToMulti( max );
                }
            }

            this.setDragInfo();

            return this;
        },

        createUndo : function() {
            var action= new SU.Action();

            if ( this.undoIndex!==-1 ) {
                this.undoList= this.undoList.slice(0,this.undoIndex+1);
            } else {
                this.undoList= [];
            }

            this.undoList.push( action );
            this.undoIndex= this.undoList.length-1;

            return action;
        },

        addAction : function( action ) {
            this.undoList[ this.undoIndex ].addAction( action );
            return this;
        },

        dealToMulti : function( numCards )    {

            var tindex= 0;
            var action= this.createUndo();

            while( numCards ) {
                var tbl= this.tableau[ tindex ];

                this.transfer.startTransfer( this.stock.getCard( -1 ) );
                var cards= this.transfer.extract();
                action.addAction(
                    new SU.ActionTransfer(this).init(
                        this.transfer.getSourcePile(),
                        tbl,
                        cards ) );

                tbl.addCards( cards );
                tbl.setReady( action );

                tindex++;
                numCards--;
            }

            this.actionCount+= numCards;
            this.setDragInfo();
        },

        transferCards : function( destinationPile, cantUndo )    {
            var cards=  this.transfer.extract();
            var action= null;

            if ( !cantUndo ) {
                action= this.createUndo();
                action.addAction(
                    new SU.ActionTransfer(this).init(
                        this.transfer.getSourcePile(),
                        destinationPile,
                        cards ) );
            }

            destinationPile.addCards( cards );

            if ( !cantUndo ) {
                this.transfer.setReady( action );
                destinationPile.setReady( action );
            }

            this.actionCount+= cards.length;

            this.setDragInfo();
        },

        /**
         * Set dragging status ready.
         * Executed after dealing, initial dealing, and tranferring cards.
         */
        setDragInfo : function()   {


            for( var i=0; i<this.piles.length; i++ )   {
                this.piles[i].setDragInfo();
            }

            return this;
        },

        incrementMoves : function() {
            this.moves++;
            this.fire('moves', this.moves);
        },

        dump : function()   {
            var i;

            console.log( this.stock.toString() );
            console.log( this.waste.toString() );
            console.log( this.transfer.toString() );
            for( i=0; i<this.tableau.length; i++ )  {
                console.log( this.tableau[i].toString() );
            }
            for( i=0; i<this.foundation.length; i++ )  {
                console.log( this.foundation[i].toString() );
            }
        },

        /**
         *
         * @param card_to_find {SU.Card}
         */
        findCard : function( card_to_find ) {
            var card= null;
            var i;

            for( i=0; i<this.piles.length; i++ )   {
                card= this.piles[i].findCard( card_to_find );
                if ( null!==card )   {
                    return card;
                }
            }

            return null;
        },

        /**
         * find tableau cards available movements.
         */
        findAvailableMovements : function() {
            var i,j,k;
            var pairs= [];

            for( i=0; i<this.piles.length; i++ ) {

                var tableau= this.piles[ i ];
                if ( tableau.isTableau() || tableau.isWaste() ) {

                    for( var j=0; j<tableau.getSize(); j++ ) {

                        var card= tableau.getCard(j);
                        if ( card.canDrag() ) {

                            var pp= new SU.Pile();
                            pp.cards.push(card);
    /*
                            // firts try to find a foundation drop.
                            if ( this.foundation ) {
                                for(k=0; k<this.foundation.length; k++ ) {
                                    var pile= this.piles[k];
                                    if  ( pile.canDrop( pp ) ) {
                                        pairs.push( {
                                            card    : card,
                                            pile    : pile
                                        });
                                    }
                                }
                            }
    */
                            for (k = 0; k < this.piles.length; k++) {
                                var pile= this.piles[k];
                                // avoid drop on self
                                if  ( pile!=tableau && (pile.isTableau() || pile.isFoundation()) && pile.canDrop( pp ) ) {

    // ---- bugbug solo si es la primera carta una k a una pila vacia
                                    if ( pile.getSize()===0 && j===0 && card.getIndex()===13  ) {
                                    } else {
                                        pairs.push( {
                                            card    : card,
                                            pile    : pile
                                        });
                                    }
                                }
                            }

                        }
                    }
                }
            }

            return pairs;
        },

        suggestMove : function() {
            if ( !this.suggestedMoves || !this.suggestedMoves.length ) {
                if ( !this.stock.isEmpty() || (this.waste && !this.waste.isEmpty() ) ) {
                    this.deal();
                }
                return;
            }

            var move= this.suggestedMoves[ (Math.random()*this.suggestedMoves.length)>>0 ];

            if ( this.drag( move.card ) ) {
                this.drop( move.pile );
            }

        },

        /**
         *
         * @param card {SU.Card}
         */
        drag : function( card ) {
            if ( card.canDrag() )   {
                this.actionCount= 0;
                this.transfer.startTransfer(card);

                this.findValidDropTargetList();

                return true;
            }

            return false;
        },

        getCurrentTransferSource : function() {
            return this.transfer.sourcePile;
        },

        /**
         * find suitable drop piles. Only either foundation or tableau are elligible as drop areas.
         */
        findValidDropTargetList : function()  {
            var i;
            var fromPile= this.transfer.getSourcePile();

            this.validDropTargets= [];

            for (i = 0; i < this.piles.length; i++) {
                var dropOnPileTest = this.piles[i];
                if  ( dropOnPileTest!=fromPile && this.isDropTarget(dropOnPileTest) ) {
                    this.validDropTargets.push( dropOnPileTest );
                }
            }
        },

        isDropTarget : function( pile ) {
            return  ( pile.isFoundation() || pile.isTableau() ) &&
                    pile.canDrop( this.transfer );
        },

        isValidDropTarget : function( testPile )    {
            for (var i = 0; i < this.validDropTargets.length; i++) {
                var pile = this.validDropTargets[i];
                if ( pile===testPile )  {
                    return true;
                }
            }

            return false;
        },

        solveTrivialMovements : function() {

            if ( !this.trivialMovements || !this.foundation || this.foundation.length===0 ) {
                return;
            }

            this.setStatus( SU.Model.Status.AUTOMATIC );

            var t= this.tableau;
            var f= this.foundation;

            function trivialDD( pile, me ) {
                var tt= pile;
                var lastCard= tt.getLastCard();
                if ( !lastCard ) {
                    return false;
                }
var pp= new SU.Pile();
pp.cards.push(lastCard);

                if ( !lastCard.hasVisitedFoundation() && tt.canDrag( lastCard ) ) {
                    for( var j=0; j<f.length; j++ ) {
                        if ( f[j].canDrop( pp ) ) {

                            
                            me.drag( lastCard );
                            me.drop( f[j] )

                            return true;
                        }
                    }
                }

                return false;
            }

            for( var i=0; i<t.length; i++ ) {
                if ( trivialDD( t[i], this ) ) {
                    return true;
                }
            }

            if ( this.waste ) {
                return trivialDD( this.waste, this );
            }

            return false;
        },

        autoFoundation : function(card) {
            var f= this.foundation;
            for( var i=0; i<f.length; i++ ) {
                this.drag( card );
                if ( this.drop( f[i] ) )    {
                    return;
                }
            }
        },

        /**
         *
         * @param onPile {SU.Pile} null indica que se haga undo de transferencia.
         */
        drop : function( onPile )   {

            if ( null!==onPile && this.isValidDropTarget( onPile ) ) {
                this.incrementMoves();
                this.transferCards( onPile );
                return true;
            } else {
                this.transfer.undo();
                return false;
            }
        },

        undo : function()   {
            if ( this.undoIndex!==-1 ) {
//            if ( this.undoList.length ) {

                this.incrementMoves();

                this.actionCount=0;
                
//                if ( this.undoList[ this.undoIndex ].canUndo() ) {
                    this.undoList[ this.undoIndex ].undo();
//                    if ( this.undoIndex ) {
                        this.undoIndex--;
//                    }
//                } else {
//                    throw 'Undoing already undone';
//                }

            } else {
                throw 'Undo underflow';
            }
        },

        redo : function()   {
            if( this.undoList.length )  {
                if ( this.undoList[ this.undoIndex ].canRedo() )    {
                    this.undoList[ this.undoIndex ].redo();
                    if ( this.undoIndex<this.undoList.length-1 ) {
                        this.undoIndex++;
                    }
                } else {
                    throw 'Redoing already done';
                }
            } else {
                throw 'Undo Overflow';
            }
        },

        getSize : function()    {
            return this.stock.getSize();
        },

        /**
         *
         * @param i {number}
         */
        getCard : function(i)   {
            return this.stock.getCard(i);
        },

        /**
         *
         * @param card {SU.Card}
         * @param type {string}
         * @param data {object}
         */
        cardEvent : function( card, type, data ) {
            /**
             * cada vez que se vuelva una carta, sumamos una accion.
             */
            if ( type==='visibilityChange' || type==='pileChanged' ) {
                this.actionCount++;
            }
        },

        getActionCount : function() {
            return this.actionCount;
        },

        getPilesSize : function()    {
            return this.piles.length;
        },

        /**
         *
         * @param i {number}
         */
        getPile : function( i ) {
            return this.piles[i];
        },

        getStockPile : function()   {
            return this.stock;
        },

        getWastePile : function()   {
            return this.waste;
        },

        getTransferPile : function()    {
            return this.transfer;
        },

        getFoundationPiles : function() {
            return this.foundation;
        },

        getTableauPiles : function()    {
            return this.tableau;
        }

    };

})();