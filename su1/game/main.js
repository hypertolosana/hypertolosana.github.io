(function () {

    var _director = null;
    var _scene = null;
    var _modelActor = null;
    var _model = null;
    var _timer = null;

    function __CAAT__loadingScene(director) {

        var scene = director.createScene();

        var TIME = 1000;
        var time = new Date().getTime();

        var background = new CAAT.ActorContainer().
            setBackgroundImage(director.getImage('splash'), false).
            setSize(director.width, director.height).
            setImageTransformation(CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE);
        scene.addChild(background);

        var lading = new CAAT.Actor().
            setBackgroundImage(director.getImage('lading'), true);
        lading.setLocation(director.width - lading.width - 10, director.height - lading.height - 30);
        scene.addChild(lading);

        var rueda = new CAAT.Actor().
            setBackgroundImage(director.getImage('rueda'), true).
            setLocation(lading.x + 20, lading.y + 10);
        scene.addChild(rueda);
        rueda.addBehavior(
            new CAAT.RotateBehavior().
                setValues(0, 2 * Math.PI).
                setFrameTime(0, 1000).
                setCycle(true)
        );
        var starsImage = null;
        starsImage = new CAAT.SpriteImage().initialize(director.getImage('stars'), 24, 6);

        var T = 600;

        var mouseStars = function (mouseEvent) {

            for (var i = 0; i < 3; i++) {
                var offset0 = Math.random() * 10 * (Math.random() < .5 ? 1 : -1);
                var offset1 = Math.random() * 10 * (Math.random() < .5 ? 1 : -1);

                var iindex = (Math.random() * 6) >> 0;
                var actorStar = new CAAT.Actor();
                actorStar.__imageIndex = iindex;

                actorStar.
                    setBackgroundImage(
                    starsImage.getRef().setAnimationImageIndex([(Math.random() * 6) >> 0]), true).
                    setLocation(offset0 + mouseEvent.point.x, offset1 + mouseEvent.point.y).
                    setDiscardable(true).
                    enableEvents(false).
                    setFrameTime(scene.time, T).
                    addBehavior(
                    new CAAT.ScaleBehavior().
                        setFrameTime(scene.time, T).
                        setValues(1, 5, 1, 5).
                        setInterpolator(
                        new CAAT.Interpolator().createExponentialInInterpolator(
                            3,
                            false)
                    )
                ).
                    addBehavior(
                    new CAAT.GenericBehavior().
                        setFrameTime(scene.time, T).
                        setValues(1, .1, null, null,function (value, target, actor) {
                            actor.setSpriteIndex(
                                actor.__imageIndex + (23 - ((23 * value) >> 0)) * actor.backgroundImage.getColumns()
                            );
                        }).
                        setInterpolator(
                        new CAAT.Interpolator().createExponentialInInterpolator(
                            3,
                            false)));

                background.addChild(actorStar);
            }
        };
        background.mouseMove = mouseStars;
        background.mouseDrag = mouseStars;

        scene.loadedImage = function (count, images) {

            if (count === images.length) {

                var difftime = new Date().getTime() - time;
                if (difftime < TIME) {
                    difftime = Math.abs(TIME - difftime);
                    if (difftime > TIME) {
                        difftime = TIME;
                    }

                    scene.createTimer(
                        scene.time,
                        difftime,
                        function () {
                            __end_loading(director, images);
                        }
                    );

                } else {
                    __end_loading(director, images);
                }

            }
        };

        return scene;
    }

    function __end_loading(director, images) {

        director.emptyScenes();
        director.setImagesCache(images);

        createMenuScene(director);
        createSolitaireScene(director);

        director.setScene(0);
    }

    function createMenuScene(director) {
        //return;
        //new SU.Menu().create( director );
        var games = SU.GamesRegistry.getGames();

        var div = document.createElement("div");
        div.style.cssText = "position: fixed; right: 0; top: 0; width: 150px; height: 100%;";

        for (var i = 0; i < games.length; i++) {
            var d = document.createElement("div");
            d.style.cssText = "width:100%;";

            (function (game, d) {
                var a = document.createElement("a");
                a.innerHTML = games[i];
                a.href = "#";
                a.style.cssText = "font-size: .9em; color: #fff;"
                a.onclick = function (e) {
                    changeGame(game);
                };

                d.appendChild(a);
            })(games[i], d);


            div.appendChild(d);
        }

        document.body.appendChild(div);

    }

    function changeGame(gameName) {
        var model = new SU.Model().create(
            SU.GamesRegistry.createGame(gameName)
        ).shuffle();

        if (_modelActor !== null) {
            _scene.removeChild(_modelActor);
        }
        _model = model;
        _modelActor = new SU.ModelActor().initialize(_director, _scene, model);
        _scene.addChild(_modelActor);

        if (_timer !== null) {
            _timer.cancel;
        }

        _timer = _scene.createTimer(
            0, 100, function () {
                _model.dealInit();
            }
        );

    }

    function createSolitaireScene(director) {

        //director.setRenderMode( CAAT.Director.RENDER_MODE_DIRTY );

        var scene = director.createScene();
        _scene = scene;
        /*
         var aa= new CAAT.Actor().setBounds(10,10,director.width,director.height).setBackgroundImage(
         new CAAT.SpriteImage().initialize(director.getImage("dorso"),1,1), true ).setImageTransformation( CAAT.SpriteImage.prototype.TR_TILE ).setClip(true);
         scene.addChild( aa );
         scene.createTimer(0,Number.MAX_VALUE,null,function(time) {
         aa.setBackgroundImageOffset( -time/200, time/300 );
         });
         */

        new SU.FishPond().initialize(director, scene);

        /*
         scene.addChild( new CAAT.Garden().
         setBounds(0,0,director.width,director.height).
         initialize( director.ctx, 80, director.height*.4, false ) );
         */

        /*
         scene.addChild( new CAAT.Starfield().
         setBounds(0,0,director.width,director.height) );
         */
        //Math.seedrandom('paula');

        changeGame("Klondike_Klondike3");

        //scene.setFillStyle("#337");
        scene.activated = function () {
//            director.setClear(false);
        }
    }

    function ss() {

        //CAAT.DEBUG=1;
        //var director = new CAAT.Director().initialize(800,600,document.getElementById('game')).setClear(false);
//        director.enableResizeEvents(CAAT.Director.prototype.RESIZE_PROPORTIONAL);

        var director = new CAAT.Director().initialize(960, 640).setClear( false );
        _director = director;
//        var game= document.getElementById('game');

//        game.style.cssText="position:absolute; top:50%; left:50%; width:800px; height:600px; margin-left:-400px; margin-top:-300px; display: block;";
//        game.appendChild(director.canvas);

        CAAT.browser = navigator.browser;

        new CAAT.ImagePreloader().loadImages(
            [
                {id:'stars', url:'game/res/stars.png'},
                {id:'splash', url:'game/splash/splash.png'},
                {id:'lading', url:'game/splash/lading.png'},
                {id:'rueda', url:'game/splash/rueda.png'}
            ],
            function (counter, images) {

                if (counter === images.length) {
                    director.setImagesCache(images);
                    var scene_loading = __CAAT__loadingScene(director);

                    new CAAT.ImagePreloader().loadImages(
                        [
                            {id:'cards', url:'game/res/cartas.png'},
                            {id:'dorso', url:'game/res/dorso.png'},
                            {id:'start', url:'game/res/stars.png'},
                            {id:'K', url:'game/res/rey.png'},
                            {id:'A', url:'game/res/as.png'},
                            {id:'P', url:'game/res/palos.png'},

                            {id:'game-canfield', url:'game/res/games/canfield.png'},
                            {id:'game-klondike', url:'game/res/games/klondike.png'},
                            {id:'game-scorpion', url:'game/res/games/scorpion.png'},
                            {id:'game-whitecard', url:'game/res/games/whitecard.png'},
                            {id:'game-whitehead', url:'game/res/games/whitehead.png'}
                        ],

                        function (counter, images) {
                            scene_loading.loadedImage(counter, images);
                        }
                    );

                }
            }
        );

        CAAT.loop(60);
    }

    window.addEventListener('load', ss, false);

})();