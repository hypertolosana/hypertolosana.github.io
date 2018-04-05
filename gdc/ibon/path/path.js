(function() {

    var __director;

    impress().addListener( function(data) {
        __director.stopped=  data.newId!=="slide7";
    });

    /**
     * Startup it all up when the document is ready.
     * Change for your favorite frameworks initialization code.
     */
    window.addEventListener(
            'load',
            start,
            false);

    function start() {
        new CAAT.ImagePreloader().loadImages(
            [
                {id:'fish',  url:'ibon/anim2.png'},
                {id:'score', url:"ibon/numerospuntos.png"}
            ],
            function( count, images ) {
                if ( count===images.length ) {
                    __director= new CAAT.Director().initialize( 900, 500, document.getElementById("_path") );
                    __director.setImagesCache(images);
                    __scene1( __director );
                }
            }
        )
    }

    /**
     * Create an Actor for every available interpolator/easing function built in CAAT.
     * This Actors are indeed InterpolatorActor, an out-of-the-box scene actor which draws
     * a function.
     * Interpolators will be laid out in a OSX Dock fashion. To do so, there's an special
     * CAAT.Dock actor. This Docking element allows to define its direction, whether
     * horizontal or vertical, and the direction to anchor its contained elements zoom.
     *
     * @param director {CAAT.Director}
     * @param scene {CAAT.Scene}
     * @param pathBehavior {CAAT.PathBehavior} The path to modify traverse speed for.
     */
    function generateInterpolators(director, scene, pathBehavior) {

        var lerps = CAAT.Interpolator.prototype.enumerateInterpolators();

        /**
         * Lay interpolators out on 20 rows, and construct as much as Dock
         * elements to hold the whole collection of interpolators.
         */
        var cols = 20;
        var j = 0, i = 0;
        var rows = lerps.length / 2 / cols;
        var min = 20;
        var max = 45;
        var selectedInterpolatorActor = null;

        // generate interpolator actors.
        for (j = 0; j < rows; j++) {

            var root = new CAAT.Dock().
                    initialize(scene).
                    setBounds(
                        director.canvas.width - (j + 1) * max - 20,
                        0,
                        max,
                        director.canvas.height).
                    setSizes(min, max).
                    setApplicationRange(3).
                    setLayoutOp(CAAT.Dock.prototype.OP_LAYOUT_RIGHT);

            scene.addChild(root);

            for (i = 0; i < cols; i++) {

                if (j * cols + i >= lerps.length) {
                    break;
                }

                var actor = new CAAT.InterpolatorActor().
                        create().
                        setInterpolator(lerps[(j * cols + i) * 2]).
                        setBounds(0, 0, min, min).
                        setStrokeStyle('blue');

                actor.mouseExit = function(mouseEvent) {
                    if (this != selectedInterpolatorActor) {
                        this.setFillStyle(null);
                    }
                }
                actor.mouseEnter = function(mouseEvent) {
                    if (this != selectedInterpolatorActor) {
                        this.setFillStyle('#f0f0f0');
                    }
                }
                actor.mouseClick = function(mouseEvent) {
                    if (null != selectedInterpolatorActor) {
                        selectedInterpolatorActor.setFillStyle(null);
                    }
                    selectedInterpolatorActor = mouseEvent.source;
                    this.setFillStyle('#00ff00');
                    selectedInterpolatorActor = mouseEvent.source;

                    pathBehavior.setInterpolator(mouseEvent.source.getInterpolator());
                }

                root.addChild(actor);
            }

            root.layout();
        }
    }

    function buildPath( x, y, w, h ) {
        var i;
        var R= Math.min( w,h )/2;
        var pp= [];
        var angle;
        var NP=7;
        for( i=0; i<NP; i++ ) {
            angle= i*Math.PI/(NP);

            pp.push( new CAAT.Point(
                    x + R*Math.cos(angle + (Math.PI*(i%2)) ) ,
                    y + R*Math.sin(angle + (Math.PI*(i%2))) ) );

        }

        return pp;
    }

    function __scene1(director) {

        var scene = director.createScene();

        var dw= director.width;
        var dh= director.height;

        var path2= new CAAT.Path().
            setCatmullRom(
                buildPath(200, dh/2, 300, 300),
                true
            ).
            endPath();

        path2.addBehavior(
            new CAAT.RotateBehavior().
                setValues( 0,2*Math.PI ).
                setDelayTime( 0, 120000 ).
                setCycle( true )
        ).addBehavior(
            new CAAT.ScaleBehavior().
                setValues( 1,1.2, 1,1.2 ) .
                setDelayTime( 0, 60000 ).
                setCycle( true ).
                setPingPong()
        );

        __fishpond(director, scene, path2);

        var path= new CAAT.Path().setCatmullRom( buildPath(550, dh/2, 400, 400 ), true ).endPath().setColor('#f00');

        var pa= new CAAT.PathActor().
                setSize( director.width, director.height ).
                setPath( path ).
                setInteractive(true).
                setOnUpdateCallback( function(path) {
                    var np = path.flatten(200, true);
                    text2.setPath(
                            np,
                            new CAAT.Interpolator().createLinearInterpolator(false),
                            20000)
                });

        var fontScore= new CAAT.SpriteImage().
            initializeAsMonoTypeFontMap(
                director.getImage("score"),
                "0123456789,p/*-"
            );
        var text2 = new CAAT.TextActor().
            setFont( fontScore ).
            setText( "0123456789" ).
            setTextAlign("left").
            setTextBaseline("top").
            setPath(
                path,
                new CAAT.Interpolator().createLinearInterpolator(false),
                20000).
            setPathTraverseDirection( CAAT.TextActor.TRAVERSE_PATH_BACKWARD );
        scene.addChild(text2);


        /**
         * Create a fish which will traverse the path.
         */
        var fish = new CAAT.Actor().
                setBackgroundImage(
                        new CAAT.SpriteImage().
                                initialize(director.getImage('fish'), 1, 3),
                        true).
                setAnimationImageIndex([0,1,2,1]).
                setChangeFPS(300).
                enableEvents(false).
                setId(111);

        fish.setPositionAnchor(.5, .5);

        // path measurer behaviour
        var pb = new CAAT.PathBehavior().
                setPath(path).
                setFrameTime(0, 20000).
                setCycle(true).
                setAutoRotate(true, CAAT.PathBehavior.autorotate.LEFT_TO_RIGHT);

        fish.addBehavior(pb);

        scene.addChild(pa);
        scene.addChild(fish);

        generateInterpolators(director, scene, pb);

        CAAT.loop(60);
    }

    function __fishpond(director, scene, path) {

        var gr= new CAAT.ActorContainer().
                setBounds(0,0,director.width,director.height).
                setFillStyle('#003');

        scene.addChild(gr);

        gr.setClip( true, path );
        createFish(director,scene,gr);
    }

    function createFish(director,scene,gr) {
        var colors= ['red', 'blue', 'white', 'rgb(0,255,255)', 'yellow'];
        var NP=20;

        for( var i=0; i<NP; i++ ) {

            var fw= (100 + Math.random()*40*(Math.random()<.5?1:-1))>>0;
            var fh= (20+ Math.random()*5*(Math.random()<.5?1:-1))>>0;

            var inTime= i*1000;

            var pb = new CAAT.PathBehavior().
                    setPath(new CAAT.Path().setCubic(
                    -fw - Math.random() * 300,
                    Math.random() * director.height,

                    director.width * Math.random(),
                    Math.random() * director.height,

                    director.width * Math.random(),
                    Math.random() * director.height,

                    Math.random() < .5 ? director.width + fw + Math.random() * 150 : Math.random() * director.width,
                    Math.random() < .5 ? -director.height * Math.random() - 300 : director.height + Math.random() * director.height
                    )).
                    setFrameTime(scene.time + inTime, (20000 + 5000 * Math.random()) >> 0).
                    setCycle(true).
                    setAutoRotate(true).
                    addListener({
                            behaviorExpired : function(behavior, time, actor) {
                                behavior.path.setCubic(
                                        -fw - Math.random() * 300,
                                        Math.random() * director.height,

                                        director.width * Math.random(),
                                        -Math.random() * director.height / 2 + Math.random() * director.height,

                                        director.width * Math.random(),
                                        -Math.random() * director.height / 2 + Math.random() * director.height,

                                        Math.random() < .5 ? director.width + fw + Math.random() * 150 : Math.random() * director.width,
                                        Math.random() < .5 ? -director.height * Math.random() - 300 : director.height + Math.random() * director.height
                                        );
                                behavior.setFrameTime(scene.time, (20000 + 5000 * Math.random()) >> 0);
                                actor.born();
                            },
                            behaviorApplied : function(actor, time, normalizedTime, value) {

                            }
                        });

            var f= new CAAT.Fish().
                    setBounds(300,400,fw,fh).
                    born().
                    setFrameTime( scene.time+inTime, Number.MAX_VALUE ).
                    setBodyColor(colors[i%colors.length]);

            f.addBehavior(pb);
            gr.addChild(f);
        }
    }
})();