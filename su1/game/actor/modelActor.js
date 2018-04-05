// SU.PileActor
(function () {

    /**
     * @constructor
     */
    SU.PileActor = function () {
        SU.PileActor.superclass.constructor.call(this);
        return this;
    };

    SU.PileActors = null;

    SU.PileActor.prototype = {

        pile:null,
        dorsoImage:null,
        model:null,
        horizontalLayout:false,
        pileImages:null,

        initialize:function (model, pile, images) {

            var t = SU.Pile.Type;

            this.dorsoImage = images.dorso;
            this.model = model;
            this.pile = pile;
            this.pileImages = images;

            this.setPileBackgroundImage();

            this.pile.addListener(this.pileEvent.bind(this));

            var p = this.getPileOnScreenPosition();
            this.setLocation(p.x, p.y);

            this.setSize(this.dorsoImage.width, this.dorsoImage.height);

            return this;
        },

        setPileBackgroundImage:function () {
            switch (this.pile.visualHint.image) {
                case 'A':
                    this.setBackgroundImage(this.pileImages.A);
                    break;
                case 'K':
                    this.setBackgroundImage(this.pileImages.K);
                    break;
                case 'P':
//                default:
                    this.setBackgroundImage(this.pileImages.P);
            }
            ;
        },

        pileEvent:function (pile, action, data) {
            if (action === 'card-added') {
                this.cardAdded(data.cards, data.fromPile);
            } else if (action === 'cards-to-be-added') {
                this.cardsToBeAdded(data.cards, data.fromPile);
            } else if (action === 'cards-added') {
                this.cardsAdded(data.cards, data.fromPile);
            } else if (action === 'removed') {
                this.cardsRemoved(data.cards, data.fromPile);
            }
        },

        cardsToBeAdded:function (cards, fromPile) {

        },

        cardsAdded:function (cards, fromPile) {
            for (var i = 0; i < cards.length; i++) {
                var cardActor = SU.CardActors[ cards[i].getName() ];
                var pile = SU.PileActors[ this.pile.getName() ];
                var pt = pile.modelToModel(new CAAT.Point(cardActor.x, cardActor.y, 0), this);
                cardActor.x = pt.x;
                cardActor.y = pt.y;
            }

            this.parent.setZOrder(this, Number.MAX_VALUE);
        },

        cardsRemoved:function (cards, fromPile) {

        },

        /**
         * Llamado despues de añadir la carta al pile.
         * Si se sobreescirbe, ojo que tambien mueve la carta de pila.
         * @param card
         * @param fromPile
         */
        cardAdded:function (card, fromPile) {

        },

        calcPileSize:function () {
            // set new pile size.
            var rw = this.dorsoImage.width;
            var rh = this.dorsoImage.height;

            var pt = this.getNextCardPosition();

            this.setSize(rw + pt.x, rh + pt.y);
        },

        getPileOnScreenPosition:function () {
            var vh = this.pile.visualHint;
            var x = 0, y = 0;

            if (vh) {
                x = vh.x;
                y = vh.y;
            }

            return  {
                x:x,
                y:y
            };
        },

        /**
         * Organiza (con animacion) las cartas dentro de un monton.
         * @param layout
         */
        layout:function (start, end) {

            var pile = this.pile;

            if (typeof start === 'undefined') {
                start = 0;
            }

            if (typeof end === 'undefined') {
                end = pile.cards.length;
            }

            var vh = this.pile.visualHint;
            var l = SU.Pile.Layout;
            var x = 0;
            var y = 0;
            var c;
            var nCards = pile.cards.length;

            var offset = vh.cardsDistance;
            if (nCards * offset > vh.maxSize) {
                offset = (vh.maxSize / nCards) >> 0
            }

            switch (vh.layout) {
                case l.VERTICAL:
                    y = offset * start;
                    break;
                case l.HORIZONTAL:
                    x = offset * start;
                    break;
            }

            for (var i = start; i < end; i++) {
                c = SU.CardActors[ pile.cards[i].getName() ];

                c.__moveTo(
                    {
                        x:c.x,
                        y:c.y
                    },
                    {
                        x:x,
                        y:y
                    },
                    0
                );

                switch (vh.layout) {
                    case l.VERTICAL:
                        y += offset;
                        break;
                    case l.HORIZONTAL:
                        x += offset;
                        break;
                }
            }
        },

        unlayoutHorizontal:function () {
            this.setAlpha(1);
            this.setPileBackgroundImage();
            this.horizontalLayout = false;
            var pos = this.getPileOnScreenPosition();
            this.setLocation(pos.x, pos.y).calcPileSize();
            this.setModelViewMatrix(false);

            var ca;
            var ps_src_local;
            var pile = this.pile;

            for (var i = 0; i < pile.cards.length; i++) {
                ca = SU.CardActors[ pile.cards[i].getName() ];
                ps_src_local = this.parent.modelToModel(new CAAT.Point(ca.x, ca.y, 0), this);
                ca.setLocation(ps_src_local.x, ps_src_local.y);
            }

            this.layout();

        },

        layoutHorizontal:function () {
            var pile = this.pile;

            if (this.pile.cards.length <= 1) {
                return;
            }

            this.parent.setZOrder(this, Number.MAX_VALUE);

            if (this.horizontalLayout) {
                this.unlayoutHorizontal();
            } else {

                var offset = 10;
                //var w= this.backgroundImage.width+offset;
                //var y= (this.parent.height - this.backgroundImage.height)/2;
                var w = SU.BackgroundImage.width + offset;
                var y = (this.parent.height - SU.BackgroundImage.height) / 2;
                var x = (this.parent.width - (pile.cards.length - 1) * w) / 2 - w / 2;

                if (x < 10) {
                    x = 10;
                    w = (this.parent.width - 20) / pile.cards.length;
                }

                var ca;
                var ps_src_local;

                for (var i = 0; i < pile.cards.length; i++) {
                    ca = SU.CardActors[ pile.cards[i].getName() ];
                    ps_src_local = ca.modelToModel(new CAAT.Point(0, 0, 0), this.parent);

                    ca.moveTo(
                        {
                            x:ps_src_local.x,
                            y:ps_src_local.y
                        },
                        {
                            x:x + w * i,
                            y:y
                        },
                        0,
                        this.pile
                    );
                }

                this.setAlpha(.5);
                this.setBackgroundImage(null);
                this.setFillStyle('#000');
                this.setBounds(0, 0, this.parent.width, this.parent.height);
                this.horizontalLayout = true;

                this.emptyBehaviorList();
                this.addBehavior(new CAAT.AlphaBehavior().setValues(0, .75).setDelayTime(0, 500));
            }
        },

        getNextCardPosition:function () {

            var vh = this.pile.visualHint;
            var l = SU.Pile.Layout;
            var x = 0;
            var y = 0;

            switch (vh.layout) {
                case l.VERTICAL:
                    y += (this.pile.getSize() - 1) * vh.cardsDistance;
                    break;
                case l.HORIZONTAL:
                    x += (this.pile.getSize() - 1) * vh.cardsDistance;
                    break;
            }

            return {
                x:x,
                y:y
            }
        },

        mouseClick:function (e) {
            if (this.layoutHorizontal) {
                this.unlayoutHorizontal();
            }
        }

    };

    extend(SU.PileActor, CAAT.ActorContainer);
})();

// SU.PileActorTableau
(function () {

    /**
     * @constructor
     */
    SU.PileActorTableau = function () {
        SU.PileActorTableau.superclass.constructor.call(this);
        return this;
    };

    SU.PileActorTableau.prototype = {

        pile:null,
        dorsoImage:null,
        model:null,

        cardsAdded:function (addedCards, fromPile) {

            SU.PileActorTableau.superclass.cardsAdded.call(this, addedCards, fromPile);

            var vh = this.pile.visualHint;
            var i;
            var pileFrom = SU.PileActors[ fromPile.getName() ];
            var ps_src_local;
            var cardActor = null;
            var index;

            SU.modelActor.readyIn(this.model.getActionCount() + addedCards.length);

            if (this.model.getStatus() !== SU.Model.Status.DEALING) {
                this.layout(0, this.pile.cards.length - addedCards.length);
            }
            var offset = vh.cardsDistance;
            if (offset * this.pile.cards.length > vh.maxSize) {
                offset = (vh.maxSize / this.pile.cards.length) >> 0;
            }

            for (i = 0; i < addedCards.length; i++) {
                cardActor = SU.CardActors[ addedCards[i].getName() ];
                ps_src_local = pileFrom.modelToModel(new CAAT.Point(cardActor.x, cardActor.y, 0), this);
                cardActor.setLocation(
                    ps_src_local.x,
                    ps_src_local.y);

                pileFrom.removeChild(cardActor);
                this.addChildImmediately(cardActor);

                index = this.findChild(cardActor);

                cardActor.moveTo(
                    {
                        x:cardActor.x,
                        y:cardActor.y
                    },
                    {
                        x:vh.layout === SU.Pile.Layout.VERTICAL ? 0 : index * offset,
                        y:vh.layout === SU.Pile.Layout.VERTICAL ? index * offset : 0
                    },
                    (this.model.getActionCount() + i) * SU.CardActor.NEXT_ANIMATION_DELAY,
                    this.pile,
                    this.model.getStatus() === SU.Model.Status.DEALING);
            }

            this.calcPileSize();
        },

        cardsRemoved:function (cards, fromPile) {

            if (!this.horizontalLayout) {
                this.layout(0, this.pile.cards.length);
            }
        },

        cardAdded:function (cards, fromPile) {

        }

    };

    extend(SU.PileActorTableau, SU.PileActor);
})();

// SU.PileActorTransfer
(function () {

    /**
     * @constructor
     */
    SU.PileActorTransfer = function () {
        SU.PileActorTransfer.superclass.constructor.call(this);
        this.visualHint = {
            layout:SU.Pile.Layout.NONE
        };

        return this;
    };

    SU.PileActorTransfer.prototype = {

        setPositionAtCard:function (card) {

            var cardActor = SU.CardActors[card.getName()];
            var pt = new CAAT.Point(0, 0);
            cardActor.modelToView(pt);
            this.setPosition(pt.x, pt.y);
            this.setModelViewMatrix();
        },

        cardsToBeAdded:function (cards, fromPile) {
            this.setPositionAtCard(cards[0]);
        },

        cardsAdded:function (addedCards, fromPile) {
            SU.PileActorTransfer.superclass.cardsAdded.call(this, addedCards, fromPile);

            this.visualHint.layout = fromPile.visualHint.layout;
            this.visualHint.cardsDistance = fromPile.visualHint.cardsDistance;

            var i;
            var pileFrom = SU.PileActors[ fromPile.getName() ];
            var ps_src_local;
            var cardActor = null;

            for (i = 0; i < addedCards.length; i++) {

                cardActor = SU.CardActors[ addedCards[i].getName() ];
                ps_src_local = pileFrom.modelToModel(new CAAT.Point(cardActor.x, cardActor.y, 0), this);
                cardActor.setLocation(
                    ps_src_local.x,
                    ps_src_local.y);
                pileFrom.removeChild(cardActor);
                this.addChildImmediately(cardActor);

            }

            this.calcPileSize();


        },

        calcPileSize:function () {

        }
    };

    extend(SU.PileActorTransfer, SU.PileActor);
})();

// SU.PileActorWaste
(function () {

    /**
     * @constructor
     */
    SU.PileActorWaste = function () {
        SU.PileActorWaste.superclass.constructor.call(this);
        return this;
    };

    SU.PileActorWaste.prototype = {

        doLayout:function (add) {
            var i;
            var pile = this.pile;
            var pileSize = this.pile.getSize();
            var card;
            var cardActor;

            if (add) {
                SU.modelActor.readyIn(1);
            }

            var vh = this.pile.visualHint;
            var nCards = vh.cardsShown;

            // todas las cartas excepto las �ltimas a�adidas.
            for (i = 0; i < pileSize - nCards && add; i++) {
                card = pile.getCard(i);
                cardActor = SU.CardActors[ card.getName() ];
                if (i < pileSize - 2 * nCards) {

                    cardActor.visible = false;
                    cardActor.setPosition(0, 0);
                } else {
                    cardActor.visible = true;
                    cardActor.moveTo(
                        {
                            x:cardActor.x,
                            y:cardActor.y
                        },
                        {
                            x:0,
                            y:0
                        },
                        0,
                        this.pile);
                    cardActor.BL_HideCard();
                }
            }

            // mostrar siempre las ultimas de la pila bien.
            var index = Math.min(nCards, pileSize);
            for (i = 0; i < index; i++) {
                card = pile.getCard(pileSize - index + i);
                cardActor = SU.CardActors[ card.getName() ];
//                if ( cardActor.expired ) {
//                    cardActor.setFrameTime( this.scene.time, Number.MAX_VALUE );
//                }
                cardActor.visible = true;
                cardActor.moveTo(
                    {
                        x:cardActor.x,
                        y:cardActor.y
                    },
                    {
                        x:vh.layout === SU.Pile.Layout.HORIZONTAL ? i * vh.cardsDistance : 0,
                        y:vh.layout === SU.Pile.Layout.HORIZONTAL ? 0 : i * vh.cardsDistance
                    },
                    0,
                    this.pile);
                cardActor.BL_Nothing();
            }
        },

        cardsAdded:function (addedCards, fromPile) {

            SU.PileActorWaste.superclass.cardsAdded.call(this, addedCards, fromPile);

            var i;
            var pileFrom = SU.PileActors[ fromPile.getName() ];
            var ps_src_local = pileFrom.modelToModel(new CAAT.Point(0, 0, 0), this);
            var cardActor = null;

            for (i = 0; i < addedCards.length; i++) {
                cardActor = SU.CardActors[ addedCards[i].getName() ]; //pileFrom.getActorFor( addedCards[i] );
                cardActor.setLocation(
                    ps_src_local.x + ( this.pile.visualHint.layout !== SU.Pile.Layout.VERTICAL ? SU.PileActorStock.LayoutOffset * i : 0),
                    ps_src_local.y + ( this.pile.visualHint.layout === SU.Pile.Layout.VERTICAL ? SU.PileActorStock.LayoutOffset * i : 0 ));

                var ret = pileFrom.removeChild(cardActor);
                if (null === ret) {
                    console.log("remove cardActor not present");
                }
                this.addChildImmediately(cardActor);
            }

            this.doLayout(true);
            this.calcPileSize();
        },

        cardsRemoved:function (removedCards) {
            this.doLayout(false);
            this.calcPileSize();
        },

        calcPileSize:function () {
            // set new pile size.
            var rw = this.dorsoImage.width;
            var rh = this.dorsoImage.height;
            var vh = this.pile.visualHint;
            var s = Math.min(vh.cardsShown, this.pile.getSize());

            if (vh.layout === SU.Pile.Layout.VERTICAL) {
                rh += s * (vh.cardsDistance ? vh.cardsDistance : 30);
            } else {
                rw += s * (vh.cardsDistance ? vh.cardsDistance : 30);
            }

            this.setSize(rw, rh);

        },

        cardAdded:function (cards, fromPile) {

        },

        getNextCardPosition:function () {

            var vh = this.pile.visualHint;
            var x = 0;
            var y = 0;

            var s = Math.min(vh.cardsShown, this.pile.getSize());

            if (vh.verticalLayout) {
                y += s * (vh.cardsDistance ? vh.cardsDistance : 30);
            } else {
                x += s * (vh.cardsDistance ? vh.cardsDistance : 30);
            }

            return {
                x:x,
                y:y
            }
        }
    };

    extend(SU.PileActorWaste, SU.PileActor);
})();

// SU.PileActorStock
(function () {

    /**
     * @constructor
     */
    SU.PileActorStock = function () {
        SU.PileActorStock.superclass.constructor.call(this);

        return this;
    };

    var NC = 3;
    var CARD_OFFSET = 5;
    SU.PileActorStock.LayoutOffset = CARD_OFFSET;

    SU.PileActorStock.prototype = {

        NC:3,
        CARD_OFFSET:5,

        mouseEnter:function () {
            if (this.pile.model.canRedeal()) {
                CAAT.setCursor('pointer');
            }
        },

        mouseExit:function () {
            CAAT.setCursor('default');
        },

        mouseDown:function () {
            this.model.deal();
        },

        mouseClick:function () {
            // avoid horizontal layout to select cards from
        },

        /**
         * siempre se mostraran como maximo 3 cartas.
         * 2 cartas como maximo se esconderan.
         *
         * @param num <nymber> numero de cartas que se a�aden, o eliminan (negativo)
         *
         */
        doLayout:function (num) {
            /*
             var i;
             var pileSize= this.pile.getSize();

             var a_esconder= pileSize > NC ? Math.min(2,pileSize-NC) : 0;

             // add cartas
             if ( num>0 ) {
             // esconder
             for( i=0; i<a_esconder; i++ ) {
             var cesconder= SU.CardActors[ this.pile.getCard( this.pile.getSize()-1-NC-i ).getName() ];
             cesconder.visible= true;
             cesconder.moveTo(
             {
             x: 0,
             y: (a_esconder-1-i)*CARD_OFFSET
             },
             {
             x: 0,
             y: 0
             },
             0,
             this.pile );
             cesconder.BL_HideCard();
             }
             }

             var a_mostrar= num;
             for( i=0; i<a_mostrar; i++ ) {
             var cmostrar= SU.CardActors[ this.pile.getCard( this.pile.getSize()-1-NC-i ).getName() ];
             //cmostrar.setFrameTime(this.scene.time, Number.MAX_VALUE);
             cmostrar.visible= true;
             cmostrar.moveTo(
             {
             x: cmostrar.x,
             y: cmostrar.y
             },
             {
             x: i<NC ? (a_mostrar-1-i)*CARD_OFFSET : 0,
             y: 0
             },
             i*SU.CardActor.NEXT_ANIMATION_DELAY,
             this.pile );

             if ( i<NC ) {
             cmostrar.BL_Nothing();
             } else {
             cmostrar.BL_HideCard();
             }
             }
             */
        },

        cardsAdded:function (addedCards, fromPile) {

            SU.PileActorStock.superclass.cardsAdded.call(this, addedCards, fromPile);

            var i;
            var pileFromActor = SU.PileActors[ fromPile.getName() ];
            var pt_src_local;
            var cardActor = null;
            var offset = 0;
            var pileSize = this.pile.getSize();
            var card;

            SU.modelActor.readyIn(addedCards.length);

            // recoger cartas visibles.
            var cartas_a_mover = Math.min(addedCards.length, this.NC - 1);
            var rem = Math.min(pileSize, this.NC) - addedCards.length;

            //for( i=0; i<this.NC - cartas_a_mover; i++ ) {
            for (i = 0; i < rem; i++) {

                card = this.pile.getCard(-i - addedCards.length - 1);
                cardActor = SU.CardActors[ card.getName() ];
                cardActor.visible = true;
                cardActor.moveTo(
                    {
                        x:cardActor.x,
                        y:cardActor.y
                    },
                    {
                        x:i + cartas_a_mover >= this.NC - 1 ? -rem * this.CARD_OFFSET : -this.CARD_OFFSET * (1 + i),
                        y:0
                    },
                    0,
                    this.pile
                );

            }


            for (i = 0; i < addedCards.length; i++) {
                cardActor = SU.CardActors[ addedCards[i].getName() ];

                offset = i < addedCards.length - this.NC ?
                    0 :
                    (1 - addedCards.length + i);

                pt_src_local = pileFromActor.modelToModel(new CAAT.Point(cardActor.x, cardActor.y, 0), this);
                cardActor.moveTo(
                    pt_src_local,
                    {
                        x:offset * this.CARD_OFFSET,
                        y:0
                    },
                    i * SU.CardActor.NEXT_ANIMATION_DELAY,
                    this.pile
                );

                if (i < addedCards.length - this.NC) {
                    cardActor.BL_HideCard();
                } else {
                    cardActor.BL_Nothing();
                }

                var ret = pileFromActor.removeChild(cardActor);
                if (null === ret) {
                    console.log("remove cardActor not present");
                }
                // a�adir detr�s del cosm�tico de pulsaci�n.
                this.addChild(cardActor);

            }

        },

        cardAdded:function (cards, fromPile) {

        },

        cardsRemoved:function (removedCards) {
            var i;
            var pile = this.pile;
            var pileSize = this.pile.getSize();
            var card;
            var cardActor;

            var index = Math.max(0, pileSize - this.NC);

            for (i = 0; i < index; i++) {
                card = pile.getCard(i);
                cardActor = SU.CardActors[ card.getName() ];

                if (i === index - 1) {
                    cardActor.visible = true;
                    cardActor.setLocation(-(this.NC - 1) * this.CARD_OFFSET, 0);
                } else {
                    cardActor.visible = false;
                }
            }


            // si hay menos elementos que los que esperamos visibles, hay que reorganizar los elementos hacia
            // la derecha
            var rem = Math.min(this.NC, pileSize);
//            var rem= Math.min( this.NC, removedCards.length+1 );
            for (i = 0; i < rem; i++) {
                // cartas desde arriba
                card = pile.getCard(-i - 1);
                cardActor = SU.CardActors[ card.getName() ];

                cardActor.visible = true;
                var offset = i;
                cardActor.setLocation(-(rem - 1) * this.CARD_OFFSET, 0);
                var pt_src_local = new CAAT.Point(cardActor.x, cardActor.y, 0);
                cardActor.moveTo(
                    pt_src_local,
                    {
                        x:-offset * this.CARD_OFFSET,
                        y:0
                    },
                    0,
                    this.pile
                );
                cardActor.BL_Nothing();
            }


        }

    };

    extend(SU.PileActorStock, SU.PileActor);

})();

//SU.PileActorFoundation
(function () {
    SU.PileActorFoundation = function () {
        SU.PileActorFoundation.superclass.constructor.call(this);
        return this;
    };

    SU.PileActorFoundation.prototype = {

        doLayout:function (b_addedcards) {
            var i;
            var pile = this.pile;
            var pileSize = this.pile.getSize();
            var card;
            var cardActor;

            var cs = this.pile.visualHint.cardsShown ? this.pile.visualHint.cardsShown : 2;

            for (i = 0; i < pileSize - cs; i++) {
                card = pile.getCard(i);
                cardActor = SU.CardActors[ card.getName() ];
//                cardActor.setOutOfFrameTime();
                cardActor.visible = false;
            }

            var index = Math.min(cs, pileSize);

            if (b_addedcards) {
                SU.modelActor.readyIn(1);
            }

            for (i = 0; i < index; i++) {
                card = pile.getCard(pileSize - index + i);
                cardActor = SU.CardActors[ card.getName() ];
                //cardActor.setFrameTime( this.scene.time, Number.MAX_VALUE );
                cardActor.visible = true;
                cardActor.moveTo(
                    {
                        x:cardActor.x,
                        y:cardActor.y
                    },
                    {
                        x:0,
                        y:0
                    },
                    0,
                    this.pile,
                    false);
            }
        },

        cardsAdded:function (addedCards, fromPile) {

            SU.PileActorFoundation.superclass.cardsAdded.call(this, addedCards, fromPile);

            var i;
            var pileFrom = SU.PileActors[ fromPile.getName() ];
            var ps_src_local = pileFrom.modelToModel(new CAAT.Point(0, 0, 0), this);
            var cardActor = null;

            for (i = 0; i < addedCards.length; i++) {
                cardActor = SU.CardActors[ addedCards[i].getName() ]; //pileFrom.getActorFor( addedCards[i] );
                cardActor.setLocation(
                    ps_src_local.x,
                    ps_src_local.y);

                pileFrom.removeChild(cardActor);
                this.addChildImmediately(cardActor);
            }

            this.doLayout(true);
            this.calcPileSize();
        },

        cardsRemoved:function (removedCards) {
            this.doLayout(false);
            this.calcPileSize();
        },

        calcPileSize:function () {
            // set new pile size.
            var rw = this.dorsoImage.width;
            var rh = this.dorsoImage.height;

            this.setSize(rw, rh);

        },

        cardAdded:function (cards, fromPile) {

        }
    };

    extend(SU.PileActorFoundation, SU.PileActor);

})();

// SU.CardActor
(function () {

    /**
     * @constructor
     */
    SU.CardActor = function () {
        SU.CardActor.superclass.constructor.call(this);
        this.setId(512);
        return this;
    };

    SU.CardActor.BEHAVIOR_TIME = 400;
    SU.CardActor.BEHAVIOR_VISIBILITY_TIME = 200;
    SU.CardActor.NEXT_ANIMATION_DELAY = 30;

    SU.CardActor.prototype = {

        card:null,
        imageIndex:0,
        cardImage:null,
        dorsoImage:null,
        scene:null,
        model:null,
        bshow:null,
        bhide:null,

        canDrag:false,
        dragPrevX:-1,
        dragPrevY:-1,

        pile2Actor:null,

        inAnimation:false,

        /**
         *
         * @param card {SU.Card}
         * @param cardImage {CAAT.SpriteImage}
         */
        initialize:function (scene, model, card, cardImage, dorsoImage, pile2Actor) {
            this.card = card;
            this.cardImage = cardImage;
            this.scene = scene;
            this.model = model;
            this.dorsoImage = dorsoImage;
            this.pile2Actor = pile2Actor;
            this.imageIndex = (card.getIndex() - 1) * 4 + card.getSuitId();
            //(card.getIndex()-1) + card.getSuitId() * 13;

            if (card.visible) {
                this.setBackgroundImage(this.cardImage);
                this.setSpriteIndex(this.imageIndex);

            } else {
                this.setBackgroundImage(dorsoImage, true);
            }

            card.addListener(this.cardListener.bind(this));

//            this.setOutOfFrameTime();

            return this;
        },

        /**
         * Show compact selection format
         * @param e
         */
        mouseClick:function (e) {
            if (this.parent.pile.getType() === SU.Pile.Type.TABLEAU) {
                this.parent.layoutHorizontal();
            }
        },

        mouseDblClick:function (e) {
            if (this.card.isLastInPile()) {
                this.model.autoFoundation(this.card);
            }
        },

        /**
         *
         * @param e {CAAT.MouseEvent}
         */
        mouseEnter:function (e) {
            if (this.canDrag || this.card.pile.getType() === SU.Pile.Type.STOCK) {
                CAAT.setCursor('pointer');
            }
        },

        /**
         *
         * @param e {CAAT.MouseEvent}
         */
        mouseExit:function (e) {
            CAAT.setCursor('default');
        },

        mouseDown:function (e) {
            if (this.parent.pile.getType() === SU.Pile.Type.STOCK) {
                this.model.deal();
            } else {
                if (this.canDrag) {

                    this.model.drag(this.card);

                    this.dragPrevX = e.screenPoint.x;
                    this.dragPrevY = e.screenPoint.y;
                }
            }
        },

        mouseUp:function (e) {
            this.dragPrevX = -1;
            this.dragPrevY = -1;
            // was dragging
            if (this.canDrag) {
                // mirar a ver si se suelta transfer sobre una pila concreta.
                // si es asi, transfer.
                var dropTarget = this.checkPositionWithDropTargets();
                this.model.drop(dropTarget ? dropTarget.pile : null);
            }
        },

        mouseDrag:function (e) {
            if (this.canDrag) {

                /**
                 * Si la carta pertenecia a un monton que esta organizado horizontalmente,
                 * hacer una animaci�n para llevar las cartas no seleccionadas al origen, y
                 * otra para llevar las cartas del transfer a su posici�n ordenada.
                 */
                var currentTR = this.model.getCurrentTransferSource();
                if (currentTR.getType() === SU.Pile.Type.TABLEAU) {
                    var pa = SU.PileActors[currentTR.getName()];
                    if (pa.horizontalLayout) {
                        pa.unlayoutHorizontal();

                        SU.PileActors[this.parent.pile.getName()].layout();
                    }
                }

                var sp = e.screenPoint;
                var parent = this.parent;
                var x = parent.x + sp.x - this.dragPrevX;
                var y = parent.y + sp.y - this.dragPrevY;
                parent.setLocation(x, y);
                this.dragPrevX = sp.x;
                this.dragPrevY = sp.y;

            }
        },

        /**
         * Comprueba para los targets de drop validos, si tenemos las esquinas superiores
         * un 30% dentro de su area.
         */
        checkPositionWithDropTargets:function () {
            var i;
            var pile;
            var pileActor;
            var dropTargets = this.model.validDropTargets;
            var pileActorTransfer = this.parent;
            var x, y;

            for (i = 0; i < dropTargets.length; i++) {
                pile = dropTargets[i];
                pileActor = SU.PileActors[ pile.getName() ];

                x = pileActorTransfer.x - pileActor.x;
                y = pileActorTransfer.y - pileActor.y;

                x /= pileActor.width;
                y /= pileActor.height;

                //dentro un 20%
                if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
                    return pileActor;
                }
            }

            return null;
        },

        /**
         *
         * @param card {SU.Card}
         * @param eventType{string}
         * @param data{object}
         */
        cardListener:function (card, eventType, data) {
            if (eventType === 'visibilityChange') {
                this.setVisibility(data);
            } else if (eventType === 'dragInfo') {
                this.canDrag = data;
            } else if (eventType === 'selected') {
                this.alpha = .5;
            } else if (eventType === 'unselected') {
                this.alpha = 1;
            }
        },

        reInit:function () {
            this.setBackgroundImage(this.dorsoImage);
            this.setLocation(0, 0);
//            this.setOutOfFrameTime();
            this.visible = false;
            this.emptyBehaviorList();
        },

        setVisibility:function (show) {

            var pb = this.getBehavior(101);
            var me = this;

            if (!pb) {

                pb = new CAAT.ContainerBehavior().setId(101);

                this.bshow = new CAAT.ScaleBehavior().
                    setValues(0, 1, 1.1, 1).
                    setFrameTime(SU.CardActor.BEHAVIOR_VISIBILITY_TIME / 2, SU.CardActor.BEHAVIOR_VISIBILITY_TIME / 2);
                this.bhide = new CAAT.ScaleBehavior().
                    setValues(1, 0, 1, 1.1).
                    setFrameTime(0, SU.CardActor.BEHAVIOR_VISIBILITY_TIME / 2);

                pb.addBehavior(this.bhide);
                pb.addBehavior(this.bshow);

                this.addBehavior(pb);
            }

            if (show) {
                me.setBackgroundImage(me.dorsoImage);
                this.bhide.emptyListenerList();
                this.bhide.addListener({
                    behaviorExpired:function (behavior, time, actor) {
                        actor.setBackgroundImage(me.cardImage);
                        actor.setSpriteIndex(me.imageIndex);
                        actor.inAnimation = false;
                    }
                });
            } else {
                me.setBackgroundImage(me.cardImage);
                me.setSpriteIndex(me.imageIndex);
                this.bhide.emptyListenerList();
                this.bhide.addListener({
                    behaviorExpired:function (behavior, time, actor) {
                        actor.setBackgroundImage(me.dorsoImage);
                        actor.inAnimation = false;
                    }
                });
            }

            this.inAnimation = true;
            pb.setDelayTime(
                (this.model.getActionCount() - 1) * SU.CardActor.NEXT_ANIMATION_DELAY +
                    (show ? SU.CardActor.BEHAVIOR_TIME - SU.CardActor.BEHAVIOR_VISIBILITY_TIME : 0 ),
                SU.CardActor.BEHAVIOR_VISIBILITY_TIME);
        },

        BL_Nothing:function () {
            var b0 = this.getBehavior(100);
            if (b0) {
                b0.emptyListenerList();
            }
            this.inAnimation = false;

        },

        BL_HideCard:function (callback) {
            var me = this;
            var b0 = this.getBehavior(100);
            b0.emptyListenerList();
            b0.addListener({
                behaviorExpired:function (behavior, time, actor) {
                    actor.visible = false;
                    actor.getBehavior(100).emptyListenerList();
                    actor.inAnimation = false;
                    if (callback) {
                        callback();
                    }
                }
            });
        },

        moveTo:function (pt_src_local, pt_dst_local, start_time, toPile, rotate) {
            this.setLocation(pt_src_local.x, pt_src_local.y);

            if (toPile.getType() !== SU.Pile.Type.TRANSFER) {
                var b1 = this.getBehavior(102);

                this.visible = true;

                if (rotate && toPile.getType() !== SU.Pile.Type.WASTE && toPile.getType() !== SU.Pile.Type.STOCK) {
                    if (null === b1) {
                        b1 = new CAAT.RotateBehavior().
                            setValues(0, 2 * (Math.random() < .5 ? 1 : 2) * Math.PI).
                            setId(102).
                            setInterpolator(new CAAT.Interpolator().createExponentialOutInterpolator(3, false));
                        this.addBehavior(b1);
                    }

                    b1.setDelayTime(start_time, SU.CardActor.BEHAVIOR_TIME);
                }

                this.__moveTo(pt_src_local, pt_dst_local, start_time);

            } else {
                this.setLocation(pt_dst_local.x, pt_dst_local.y);
            }
        },

        __moveTo:function (pt_src_local, pt_dst_local, start_time) {
            var b0 = this.getBehavior(100);

            if (!b0) {
                b0 = new CAAT.PathBehavior().
                    setValues(new CAAT.Path().setLinear(0, 0, 0, 0)).
                    setId(100).
                    setInterpolator(new CAAT.Interpolator().createExponentialOutInterpolator(3, false));
                b0.addListener({
                    behaviorExpired:function (behavior, time, actor) {
                        actor.inAnimation = false;
                    }
                });

                this.addBehavior(b0);
            }

            if (pt_src_local.x != pt_dst_local.x || pt_src_local.y != pt_dst_local.y) {
                this.inAnimation = true;
                b0.setValues(
                    new CAAT.Path().setLinear(
                        pt_src_local.x,
                        pt_src_local.y,
                        pt_dst_local.x,
                        pt_dst_local.y)
                ).setDelayTime(start_time, SU.CardActor.BEHAVIOR_TIME);
            }

        }
    };

    extend(SU.CardActor, CAAT.Actor);

})();

// SU.ModelActor
(function () {

    SU.ModelActor = function () {
        SU.ModelActor.superclass.constructor.call(this);
        return this;
    };

    SU.ModelActor.prototype = {
        model:null,
        stockActor:null,
        wasteActor:null,
        transferActor:null,
        foundationActors:null,
        tableauActors:null,

        pile2Actor:null,

        scene:null,

        initGame:function (model, director, scene, images) {

            this.emptyChildren();

            this.pile2Actor = {};

            var cardsImage = new CAAT.SpriteImage().initialize(director.getImage('cards'), 13, 4);
            var i;
            var tp;
            var fp;

            this.stockActor = new SU.PileActorStock().initialize(model, model.getStockPile(), images);

            this.addChild(this.stockActor);

            this.pile2Actor[ model.getStockPile().getName() ] = this.stockActor;

            if (model.getWastePile()) {
                this.wasteActor = new SU.PileActorWaste().initialize(model, model.getWastePile(), images);
                this.addChild(this.wasteActor);
                this.pile2Actor[ model.getWastePile().getName() ] = this.wasteActor;
            }

            tp = model.getTableauPiles();
            this.tableauActors = [];
            for (i = 0; i < tp.length; i++) {
                this.tableauActors.push(
                    new SU.PileActorTableau()
                        .initialize(model, tp[i], images)
                );
                this.pile2Actor[ tp[i].getName() ] = this.tableauActors[i];
            }
            /**
             * zorder de las pilas tiene que ser inverso para que no se pisen las cartas a la hora de hacer
             * las animacionces.
             */
            for (i = tp.length - 1; i >= 0; i--) {
                this.addChild(this.tableauActors[i]);
            }

            fp = model.getFoundationPiles();
            if (fp && fp.length > 0) {
                this.foundationActors = [];
                for (i = 0; i < fp.length; i++) {
                    this.foundationActors.push(
                        new SU.PileActorFoundation().initialize(model, fp[i], images));
                    this.addChild(this.foundationActors[i]);
                    this.pile2Actor[ fp[i].getName() ] = this.foundationActors[i];
                }
            }


            this.transferActor = new SU.PileActorTransfer().
                initialize(model, model.getTransferPile(), images).
                enableEvents(false);
            this.addChild(this.transferActor);
            this.pile2Actor[ model.getTransferPile().getName() ] = this.transferActor;

            SU.PileActors = this.pile2Actor;

            SU.PileActor.prototype.scene = scene;

            var card2Actor = {};
            for (i = 0; i < model.getSize(); i++) {
                var card = model.getCard(i);
                var cardActor = new SU.CardActor().initialize(
                    scene,
                    model,
                    card,
                    cardsImage.getRef(),
                    images.dorso,
                    this.pile2Actor);
                this.stockActor.addChild(cardActor);

                card2Actor[card.getName()] = cardActor;
            }

            SU.CardActors = card2Actor;

        },

        initialize:function (director, scene, model) {
            var images = {
                dorso:director.getImage('dorso'),
                A:director.getImage('A'),
                K:director.getImage('K'),
                P:director.getImage('P')
            };
            var me = this;

            SU.BackgroundImage = images.dorso;

            this.model = model;

            this.model.addListener(this.modelEvent.bind(this));

            this.scene = scene;
            this.setSize(director.width, director.height);

            SU.modelActor = this;

            this.initGame(model, director, scene, images);

            var undo = new CAAT.Actor().
                setFillStyle('green').
                setAsButton(images.dorso, 0, 0, 0, 0,function (button) {
                    model.undo();
                }).
                setBounds(director.width - 30, director.height - 40, 30, 30).
                setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            this.addChild(undo);

            var suggest = new CAAT.Actor().
                setFillStyle('green').
                setAsButton(images.dorso, 0, 0, 0, 0,function (button) {

                    model.suggestMove();
                }).
                setBounds(director.width - 70, director.height - 40, 30, 30).
                setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            this.addChild(suggest);

            var newgame = new CAAT.Actor().
                setFillStyle('green').
                setAsButton(images.dorso, 0, 0, 0, 0,function (button) {

                    me.model.reInit();
                }).
                setBounds(30, director.height - 40, 30, 30).
                setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
            this.addChild(newgame);


            ///// moves
            //var str= "JMovesTim:0123456789";
            var font = new CAAT.Font().
                setFont("'Baumans'").
                setFontSize(30, "px").
                setFontStyle("bold").
                setFillStyle('#aaf').
                setStrokeStyle('#bbb').
                setStrokeSize(.5).
                createDefault(2);

            var aa = new CAAT.TextActor().setFont(font).setLocation(10, 10);
            aa.moves = function (event, data) {
                if (event === 'moves') {
                    this.setText(data + (data > 1 ? " moves" : " move"));
                }
            };
            this.addChild(aa);
            this.model.addListener(aa.moves.bind(aa));

            var fam = new CAAT.TextActor().setFont(font).setLocation(500, 10).setText(model.game.name);
            this.addChild(fam);

            ///// time
            var bb = new CAAT.TextActor().setFont(font).setLocation(250, 10);
            scene.onRenderStart = function () {
                var t = new Date().getTime() - model.startTime;

                t = (t / 1000) >> 0;
                var secs = '' + (t % 60);
                if (secs < 10) {
                    secs = '0' + secs;
                }
                t = (t / 60) >> 0;
                var mins = '' + t;
                if (mins < 10) {
                    mins = '0' + mins;
                }

                var time = 'Time: ' + mins + ':' + secs;

                bb.setText(time);
            }
            this.addChild(bb);

            return this;
        },

        modelEvent:function (event, data) {
            var i;

            if (event === 'reinit') {

                for (i in SU.PileActors) {
                    SU.PileActors[i].emptyChildren();
                }

                for (i in SU.CardActors) {
                    var card = SU.CardActors[i];
                    card.setLocation(0, 0);
                    card.reInit();
                    card.resetTransform();
                    card.setModelViewMatrix();
                    card.setParent(null);
                    card.visible = false;
                    card.BL_Nothing();
                    this.stockActor.addChildImmediately(card);
                }

            } else if (event === 'dealInit') {

                // sort out stockActor cards with that of its model.
                this.stockActor.emptyChildren();
                for (i = 0; i < this.model.getSize(); i++) {
                    var c = SU.CardActors[ this.model.getCard(i).name ];
                    c.parent = null;
                    this.stockActor.addChildImmediately(c);
                }

                var me = this;
                var t = SU.CardActor.BEHAVIOR_TIME + SU.CardActor.NEXT_ANIMATION_DELAY * (data.actions - 1);

                this.scene.createTimer(this.scene.time, t, function () {
                    me.model.afterDealInit();

                    /** make tableau relayout. needed for the cases where after dealing cards have not enough room **/
                    for (i = 0; i < me.tableauActors.length; i++) {
                        if (!me.tableauActors[i].horizontalLayout) {
                            me.tableauActors[i].layout(0, me.tableauActors[i].pile.cards.length);
                        }
                    }
                });
                /*
                 setTimeout(
                 function() {
                 me.model.afterDealInit();

                 // make tableau relayout. needed for the cases where after dealing cards have not enough room
                 for( i=0; i<me.tableauActors.length; i++ ) {
                 if ( !me.tableauActors[i].horizontalLayout ) {
                 me.tableauActors[i].layout( 0, me.tableauActors[i].pile.cards.length );
                 }
                 }
                 },
                 t );
                 */
            } else if (event === 'status') {
                this.scene.enableEvents(data === SU.Model.Status.USER);

                if (data === SU.Model.Status.WIN) {
                    this.gameWin();
                } else if (data === SU.Model.Status.LOST) {
                    this.gameEnded();
                }
            }
        },

        readyIn:function (actions) {
            if (!actions) {
                return;
            }

            var me = this;
            if (this.model.getStatus() === SU.Model.Status.USER || this.model.getStatus() === SU.Model.Status.AUTOMATIC) {

                this.model.setStatus(SU.Model.Status.ANIMATION);

                var t = SU.CardActor.BEHAVIOR_TIME + actions * SU.CardActor.NEXT_ANIMATION_DELAY;
                this.scene.createTimer(this.scene.time, t, function () {
                    me.model.ready();
                });

                /*
                 setTimeout(
                 function() {
                 me.model.ready();
                 },
                 t );
                 */
            }
        },

        gameWin:function () {
            console.log('win');
        },

        gameEnded:function () {
            console.log('end');
        }
    };

    extend(SU.ModelActor, CAAT.ActorContainer);

})();