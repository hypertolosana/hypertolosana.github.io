(function() {

    function keyNote()   {

        var director = new CAAT.Director().initialize(819,600,document.getElementById('keyNote')).setClear(false);
        //director.enableResizeEvents(CAAT.Director.prototype.RESIZE_PROPORTIONAL);

        new CAAT.ImagePreloader().loadImages(
            [

                {id:'fail',             url:'images/samples/fail.png'},
                {id:'sumon',            url:'images/samples/sumon-canvas.png'},

                {id:'logo',             url:'images/fondo/logo.png'},

                {id:'bg-slide-1',       url:'images/fondo/1.png'},
                {id:'bg-slide-2',       url:'images/fondo/2.png'},
                {id:'bg-slide-3',       url:'images/fondo/3.png'},
                {id:'bg-slide-4',       url:'images/fondo/4.png'},
                {id:'bg-slide-5',       url:'images/fondo/5.png'},
                {id:'bg-slide-6',       url:'images/fondo/6.png'},
                {id:'bg-slide-7',       url:'images/fondo/7.png'},
                {id:'bg-slide-8',       url:'images/fondo/8.png'},

                // slide 1
                {id:'sun',              url:'images/otros/sol.png'},
                {id:'nubes',            url:'images/otros/nubes.png'},
                {id:'barco',            url:'images/otros/barco.png'},
                {id:'burbujas',         url:'images/otros/burbujas.png'},

                // underwater
                {id:'causticas',        url:'images/otros/causticas.png'},
                {id:'bb',               url:'images/otros/particulas-blancas.png'},
                {id:'bn',               url:'images/otros/particulas-negras.png'},

                // fish
                {id:'f1',               url:'images/peces/pez1.png'},
                {id:'f2',               url:'images/peces/pez2.png'},
                {id:'f3',               url:'images/peces/pez-3.png'},
                {id:'f4',               url:'images/peces/pez-standard.png'},
                {id:'f5',               url:'images/peces/tiburon.png'},
                {id:'f6',               url:'images/peces/pulpo.png'},
                {id:'f7',               url:'images/peces/calamar.png'},
                {id:'f8',               url:'images/peces/malacara.png'}
            ],

            function( counter, images ) {
                if ( counter==images.length ) {

                    director.addAudio('broken', document.getElementById('broken'));

                    director.setImagesCache(images);
                    init(director);
                }
            }
        );

        CAAT.loop(60);
    }

    function createHorizontalSprites( minTime, maxTime, maxy, spriteImage, numElements, parent ) {

        var i, x0, y0, x1, y1, maxw, maxt;

        maxw= parent.width+spriteImage.singleWidth*2;
        maxt= (minTime+(maxTime-minTime)*Math.random());

        for( i=0; i<numElements; i++ ) {

            x0= parent.width*Math.random();
            x1= parent.width+Math.random()*200;
            y0= Math.random()*maxy;
            y1= y0+(Math.random()<.5?1:-1)*(10*Math.random());

            parent.addChild(
                new CAAT.Actor().
                    setBackgroundImage( spriteImage.getRef(), true ).
                    setSpriteIndex( (Math.random()*spriteImage.columns)>>0 ).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setFrameTime( 0, maxTime - maxt*x0/maxw ).
                            setValues( new CAAT.Path().setLinear( x0,y0,x1,y1 ) ).
                            addListener( {
                                behaviorExpired : function( behavior, time, actor) {
                                    x0= -spriteImage.singleWidth-Math.random()*200;
                                    x1= parent.width+Math.random()*200;
                                    y0= Math.random()*maxy;
                                    y1= y0+(Math.random()<.5?1:-1)*(10*Math.random());

                                    behavior.setFrameTime(time, minTime+(maxTime-minTime)*Math.random() );
                                    behavior.setValues(new CAAT.Path().setLinear( x0,y0,x1,y1 ));

                                    actor.setSpriteIndex( (Math.random()*spriteImage.columns)>>0 );
                                }
                            })
                    )
            );
        }
    }

    function createBasurilla( maxTime, spriteImage, parent ) {

        for( var i=0; i<spriteImage.length; i++ ) {

            parent.addChild(
                new CAAT.Actor().
                    setBackgroundImage( spriteImage[i].getRef(), true ).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setFrameTime( 0, maxTime[i] ).
                            setValues( new CAAT.Path().setLinear(
                                -spriteImage[i].singleWidth/2, 0,
                                parent.width-spriteImage[i].singleWidth/2, 0) ).
                            setCycle(true).
                            setInterpolator(
                                new CAAT.Interpolator().createLinearInterpolator(true,i===0)
                            )
                    )
            );
        }
    }

    function createVerticalSprites( minTime, maxTime, maxx, spriteImage, numElements, parent ) {

        var i, x0, y0, x1, y1, maxh, maxt;

        maxh= parent.height+spriteImage.singleHeight*2;
        maxt= (minTime+(maxTime-minTime)*Math.random());

        for( i=0; i<numElements; i++ ) {

            y0= parent.height*Math.random();
            y1= -Math.random()*spriteImage.singleHeight - spriteImage.singleHeight;
            x0= Math.random()*maxx;
            x1= x0;

            parent.addChild(
                new CAAT.Actor().
                    setBackgroundImage( spriteImage.getRef(), true ).
                    setSpriteIndex( (Math.random()*spriteImage.columns)>>0 ).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setFrameTime( 0, maxt*y0/maxh ).
                            setValues( new CAAT.Path().setLinear( x0,y0,x1,y1 ) ).
                            addListener( {
                                behaviorExpired : function( behavior, time, actor) {
                                    y0= parent.height;
                                    y1= -Math.random()*spriteImage.singleHeight - spriteImage.singleHeight;
                                    x0= Math.random()*maxx;
                                    x1= x0;

                                    behavior.setFrameTime(time, minTime+(maxTime-minTime)*Math.random() );
                                    behavior.setValues(new CAAT.Path().setLinear( x0,y0,x1,y1 ));

                                    actor.setSpriteIndex( (Math.random()*spriteImage.columns)>>0 );
                                },
                                behaviorApplied : function( behavior, time, normalizedTime, actor, value) {
                                    
                                }
                            })
                    )
            );
        }
    }

    function setupUnderWater( director, slide, maxfish, images ) {

        var i,j;

        // setup bubbles.
        var bubble_ci= new CAAT.SpriteImage().initialize( director.getImage('burbujas'), 1, 3 );
        createVerticalSprites( 5000, 10000, slide.width, bubble_ci, 15, slide );

        // setup fish
        for( i=0; i<maxfish; i++ ) {
            var s= .8+.2*Math.random();
            slide.addChild(
                new CAAT.Actor().
                    setImageTransformation( CAAT.SpriteImage.prototype.TR_FLIP_HORIZONTAL ).
                    setBackgroundImage( director.getImage(images[i%images.length]), true ).
                    setScale( s,s ).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setAutoRotate(true, true).
                            setPath(
                                new CAAT.Path().
                                    setLinear(0,0,Math.random()*slide.width,Math.random()*slide.height)).
                            //setInterpolator(
                            //    new CAAT.Interpolator().createExponentialInOutInterpolator(2, false)).
                            setFrameTime(0, 1).
                            addListener({
                                behaviorExpired : function(behaviour, time, actor) {
                                    var endCoord = behaviour.path.endCurvePosition();
                                    var x= Math.random()<.5;
                                    var y= Math.random()<.5;
                                    var maxy= 200, miny=80;

                                    var curvey= Math.random()*slide.height;
                                    behaviour.setPath(
                                        new CAAT.Path().setCubic(
                                            x ? -actor.width-20-Math.random()*150 : slide.width+20 * Math.random()*150,
                                            curvey,
                                            x ? Math.random() * slide.width/2 : slide.width/2 + Math.random()*slide.width/2,
                                            (!y?1:-1) * Math.random() * maxy + curvey + miny*(!y?1:-1),
                                            !x ? Math.random() * slide.width/2 : slide.width/2 + Math.random()*slide.width/2,
                                            (y?1:-1) * Math.random() * maxy + curvey + miny*(y?1:-1) ,
                                            x ? slide.width+Math.random()*150 + 20 : -actor.width-20-Math.random()*150,
                                            (Math.random()<.5?1:-1) * Math.random() * maxy/2 + curvey

                                        ));
                                    behaviour.setFrameTime(time, 12000 + Math.random() * 10000);
                                }
                            })
                    )
            )
        }

        // caustics
        slide.addChild(
            new CAAT.Actor().
                setBackgroundImage( director.getImage('causticas'), true ).
                addBehavior(
                    new CAAT.PathBehavior().
                        setFrameTime( 0, 5000 ).
                        setValues(
                            new CAAT.Path().setLinear( 0,0, 100,0 )
                        ).
                        setInterpolator(
                            new CAAT.Interpolator().createLinearInterpolator(true,false)
                        ).
                        setCycle(true)
                )
        )

        createBasurilla( [60000,80000], [
                new CAAT.SpriteImage().initialize(director.getImage('bb'),1,1),
                new CAAT.SpriteImage().initialize(director.getImage('bn'),1,1)
            ], slide );
    }

    function createLogo(director,sm) {

        var slide= sm.getSlide(0);

        var nubes_ci= new CAAT.SpriteImage().initialize( director.getImage('nubes'), 1, 4 );
        createHorizontalSprites( 20000, 30000, slide.height, nubes_ci, 3, slide );

        var rows= 4;
        var columns= 16;

        var logo_ci= new CAAT.SpriteImage().initialize(
            director.getImage('logo'), rows, columns
        );

        var i,j;
        var xoff= (slide.width-logo_ci.width)/2;
        var yoff= (slide.height-logo_ci.height)/2;

        for( i=0; i<rows; i++ ) {
            for( j=0; j<columns; j++ ) {
                var actor= new CAAT.Actor().
                    setBackgroundImage( logo_ci.getRef(), true ).
                    setSpriteIndex( j + i * columns ).
                    setLocation(-100,-100);

                var bc= new CAAT.ContainerBehavior().
                            setFrameTime(0, 23000).
                            setCycle( true );


                var b1=new CAAT.PathBehavior().
                            setFrameTime( Math.random()*2000, 5000+Math.random()*2000 ).
                            setValues(
                                new CAAT.Path().
                                    setCubic(
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -50-Math.random()*slide.width,
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -50-Math.random()*slide.height,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.width,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.height,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.width,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.height,
                                        xoff + j * logo_ci.singleWidth,
                                        yoff + i * logo_ci.singleHeight
                                    )
                            ).
                            addListener({
                                behaviorExpired : function(behavior, time, actor) {
                                    behavior.path.pathSegments[0].curve.coordlist[0].set(
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.width,
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.height
                                    )
                                }
                            });
                var b2= new CAAT.PathBehavior().
                            setFrameTime( 15000+Math.random()*2000, 5000 ).
                            setValues(
                                new CAAT.Path().
                                    setCubic(
                                        xoff + j * logo_ci.singleWidth,
                                        yoff + i * logo_ci.singleHeight,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.width,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.height,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.width,
                                        (Math.random()<.5 ?1 :-1) * Math.random() * slide.height,
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.width,
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.height
                                    )
                            ).
                            addListener({
                                behaviorExpired : function(behavior, time, actor) {
                                    behavior.path.pathSegments[0].curve.coordlist[3].set(
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.width,
                                        Math.random()<.5 ? slide.width+Math.random() * 50 : -20-Math.random()*slide.height
                                    )
                                }
                            });

                bc.addBehavior(b1);
                bc.addBehavior(b2);

                actor.addBehavior( bc );
                slide.addChild( actor );
            }
        }
    }

    function init(director) {

        var sm= new CAAT.SlideManager().initialize(director);

        var i;
        var peces= ['f1','f2','f3','f4','f5','f6','f7','f8'];


        for( i=0; i<8; i++ ) {
            sm.createSlide( director.getImage( 'bg-slide-' + ( 1 + i ) ) );
            if ( i>1 ) {
                var pi= i-1;
                setupUnderWater(
                    director,
                    sm.getSlide(i),
                    4+((4*Math.random())>>0),
                    [ peces[pi], peces[pi+1], peces[pi+2] ]
                );
            }

            var slide= sm.getSlide(i);
            slide.id= i;

            sm.addContentListener( function( sm ) {
                var y= 50+ // position original flecha
                        (600*(1+sm.getCurrentContentIndex())/sm.getContentSize() )
                          ;
                document.getElementById('flecha').style['top']= y+'px';
            });
        }

        createLogo(director,sm);
        setupIntro(director, sm);
        setupCanvas(director, sm);
        setupGL(director, sm);
        setupCSS(director, sm);
        setupHybrid(director,sm );
        setupConclusion(director,sm );
        setupQA(director,sm );

        CAAT.registerKeyListener( function( key, str_up_or_down, mods ) {
            if ( str_up_or_down==='up' && key===CAAT.ENTER_KEY ) {
                if ( !mods.control ) {  // next slide/content
                    sm.next();
                } else {                // prev slide
                    sm.prev();
                }
            }
        });
    }

    function setupIntro(director, sm) {

        var c;
        var padding=    50;
        var dw= director.width;
        var dw2= dw/2;
        var dh= director.height;
        var dh2= dh/2;
        var slide= sm.getSlide(1);
        var nubes_ci= new CAAT.SpriteImage().initialize( director.getImage('nubes'), 1, 4 );

        slide.addChild(
            new CAAT.Actor().
                setBackgroundImage(director.getImage('sun'), true).
                addBehavior(
                    new CAAT.PathBehavior().
                        setFrameTime(0,10000).
                        setValues(
                            new CAAT.Path().
                                beginPath(dw2-20, dh2).
                                addCubicTo( dw2-20,dh2-20, dw2+20,dh2-20, dw2+20,dh2 ).
                                addCubicTo( dw2+20,dh2+20, dw2-20,dh2+20, dw2-20,dh2 ).
                                endPath()
                        ).
                        setTranslation( 270, 400 ).
                        setCycle(true)
                )
        );
        createHorizontalSprites( 20000, 30000, dh2, nubes_ci, 3, slide );
        slide.addChild(
            new CAAT.Actor().
                setBackgroundImage( director.getImage('barco'), true ).
                setScale( .5, .5 ).
                addBehavior(
                    new CAAT.PathBehavior().
                        setFrameTime(0, 120000).
                        setAutoRotate(true, true).
                        setValues(
                            new CAAT.Path().beginPath(-300,200).
                                addCubicTo(-100, 150, 100, 250, 300, 180).
                                addCubicTo(300+200*Math.cos(Math.atan(.35)), 180-200*Math.sin(Math.atan(.35)), 700, 190, 900, 180).
                                endPath()
                        ).
                        setTranslation( 0, -50 ).
                        setInterpolator(
                            new CAAT.Interpolator().createLinearInterpolator(true,false)
                        ).
                        setCycle(true)
                )
            );




        slide.
            addChild(
                sm.createContentTitle('Introduction').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText('About me<br><br>'+
                    '+ CTO @ludei (by @ideateca)<br>'+
                    '+ 10+ years of internet experience<br>'+
                    '+ Doer<br>'+
                    '+ Father of two<br>'+
                    '+ @hyperandroid').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContent().
                    setBounds( 0, 150, slide.width-2*padding, slide.height-150 ).
                    addChild(
                        sm.createContentText('Javascript as an integral plaftorm for games development.').
                            setBounds( padding, 0, slide.width-2*padding, slide.height-150 ).
                            setOnFocus( CAAT.SlideContent.NONE )
                    ).
                    addContent(
                        sm.createContentText('Target cross browser, rendering technology ' +
                            'and cross-platform.').
                            setBounds( padding, 120, slide.width-2*padding, slide.height-150 ).
                            setOnFocus( CAAT.SlideContent.NONE )
                    ).
                    addContent(
                        sm.createContentText('W/o code base changes.').
                            setBounds( padding, 220, slide.width-2*padding, slide.height-150 ).
                            setOnFocus( CAAT.SlideContent.NONE )
                    ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'CAAT<br><br>' +
                    ' + Obsolete name.<br>' +
                    ' + Canvas, WebGL, CSS and Hybrid native/JS are available rendering engines.<br>' +
                    ' + A complete framework for games development.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Provides:<br><br>' +
                    '+ Actor, Container, Scene, Director, Path, Behavior, Interpolator, ...<br>' +
                    '+ Box2D integration<br>' +
                    '+ System abstractions for virtual timeline, storage, keyboard, mouse, accelerometer, dragging... ').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.NONE )
            ).
            addContent(
                sm.createContentText(
                    '<span class="important">Most of them just abstractions</span>').
                    setBounds( padding*3, 280, slide.width-2*padding, slide.height-150 ).
                    setRotation( -Math.PI/16 ).
                    setOnFocus( CAAT.SlideContent.NONE,
                        function(content) {
                            content.emptyBehaviorList().
                                addBehavior(
                                    new CAAT.AlphaBehavior().
                                        setFrameTime( content.time, 2000 ).
                                        setValues(0,1)
                                ).
                                addBehavior(
                                    new CAAT.ScaleBehavior().
                                        setFrameTime( content.time, 2000 ).
                                        setValues( 3,1, 3,1 ).
                                        setInterpolator(
                                            new CAAT.Interpolator().
                                                createBounceOutInterpolator(false)
                                        )
                                )
                    })
            )
            ;
    }

    function setupCanvas(director, sm) {
        var slide= sm.getSlide(2);
        var c;
        var padding=    50;

        slide.
            addChild(
                sm.createContentTitle('CANVAS').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText(
                        'Focus on:<br><br>'+
                        '+ Filling in the gaps.<br>' +
                        '+ Developing with classical inheritance.<br>' +
                        '+ Imposing reusability.<br>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Events: <br><br>' +
                    'how to get the correct coordinate on canvas regardless of dom nesting elements ?<br><br>' +
                    'AKA: no screen capture').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Rendering context\'s M2V matrix is not available.<br><br>'+
                    'Custom matrix stack provides:<br>' +
                    '&nbsp;+ Pixel perfect collision detection<br>' +
                    '&nbsp;+ Homogeneous coords<br>' +
                    '&nbsp;+ Hierarchically applied Affine TR.<br>'+
                    '&nbsp;+ Coordinate system conversion.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContent().
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    addChild(
                        canvasEx1(slide)
                    ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'No path measurer.<br>' +
                    'How can I traverse a path ? why should I settle just for lines/bezier ?<br>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT ).
                addChild(
                        sm.createContentText('<a href=""><img src="images/samples/path.png"></a>').
                            setBounds( 150, 165, 400, 300 ).
                            setAlpha(.8)
                    )
            ).
            addContent(
                sm.createContentText(
                    'Sound: crapiest implementation ever.<br><br>'+
                    '  + Formats<br>'+
                    '  + Loop bug<br>'+
                    '  + Concurrent play<br>'+
                    '  + ...').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Trivial optimizations:<br><br>'+
                    '+ Integer coordinates, a canvas\' best friend.<br>'+
                    '+ {antialias: false}.<br>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentImage(
                    new CAAT.SpriteImage().initialize( director.getImage('sumon'), 1, 1)).
                    setBounds( 160, 150 ).
                    setAlpha(.75).
                    setOnFocus( CAAT.SlideContent.OUT,
                        function(content) {
                            content.emptyBehaviorList().
                                addBehavior(
                                    new CAAT.AlphaBehavior().
                                        setFrameTime( content.time, 2000 ).
                                        setValues(0,.8)
                                ).
                                addBehavior(
                                    new CAAT.PathBehavior().
                                        setFrameTime( content.time, 2000 ).
                                        setValues( new CAAT.Path().
                                            setLinear( director.width, 150, 160, 150 )).
                                        setInterpolator(
                                            new CAAT.Interpolator().
                                                createBounceOutInterpolator(false)
                                        )
                                )
                    })
            )
            ;


        function canvasEx1(scene) {
            var cc= new CAAT.ActorContainer().
                setBounds( 0,0,719,400 ).
                setClip(true).
                setFillStyle( '#eee' ).
                setAlpha(.9).
                setGlobalAlpha(false);

            var coords= new CAAT.Actor().setLocation(10,10).setFillStyle( '#000' );
            cc.addChild(coords);
            var coords3= new CAAT.Actor().setLocation(10,34).setFillStyle( '#000' );
            cc.addChild(coords3);

            // on doubleclick, zorder maximo.
            var dblclick= function(mouseEvent) {
                var actor= mouseEvent.source;
                if( null==actor ) {
                    return;
                }

                var parent= actor.parent;
                parent.setZOrder(actor,Number.MAX_VALUE);
            };

            var np = 8;
            var s = 80;
            for ( var i = 0; i < np; i++) {
                var sc= 1+Math.random();

                var p = new CAAT.ActorContainer().
                    setBounds(
                        Math.random() * 600,
                        Math.random()* 300,
                        s,
                        s).
                    setRotation( Math.PI*2*Math.random() ).
                    setScale( sc, sc ).
                    setFillStyle('#f3f').
                    setClip(true);

                p.mouseDblClick= dblclick;
                cc.addChild(p);

                var p0= new CAAT.Actor().
                    setBounds( 0,0, s/4, s/4 ).
                    setFillStyle('#a03f00');
                p0.mouseDblClick= dblclick;
                p.addChild(p0);

                var p1= new CAAT.Actor().
                    setBounds( s/2, s/2, s/4, s/4 ).
                    setRotation( Math.PI*2*Math.random() ).
                    setFillStyle('#ffff3f');
                p1.mouseDblClick= dblclick;

                p.addChild(p1);
                p1.enableDrag();
                p0.enableDrag();
                p.enableDrag();

                p.__me= p.mouseEnter;
                p.mouseEnter= function(ev) {
                    this.setFillStyle('#3f3')
                    this.__me(ev);
                }
                p.__mex=p.mouseExit;
                p.mouseExit= function(ev) {
                    this.setFillStyle('#f3f');
                    this.__mex(ev);
                }

                p1.__mouseMove= p1.mouseMove;
                p0.__mouseMove= p0.mouseMove;
                p.__mouseMove= p.mouseMove;

                var mouseMoveHandler= function(mouseEvent) {
                    var actor= mouseEvent.source;
                    actor.__mouseMove(mouseEvent);

                    coords.domElement.innerText= "Local Coord: ("+
                            ((mouseEvent.point.x*100)>>0)/100+","+
                            ((mouseEvent.point.y*100)>>0)/100+")";
                    coords3.domElement.innerText=
                            "Parent Pos: ("+((actor.x*100)>>0)/100+","+((actor.y*100)>>0)/100+")";
                };

                p.mouseMove= mouseMoveHandler;
                p0.mouseMove= mouseMoveHandler;
                p1.mouseMove= mouseMoveHandler;
            }

            cc.__mouseMove= scene.mouseMove;
            cc.mouseMove= function(mouseEvent) {
                mouseEvent.source.__mouseMove(mouseEvent);
                coords.domElement.innerText="Local Coord: ("+mouseEvent.point.x+","+mouseEvent.point.y+")";
                coords3.domElement.innerText="";
            };

            return cc;
        }
    }

    function setupGL(director, sm) {
        var slide= sm.getSlide(3);
        var c;
        var padding=    50;

        slide.
            addChild(
                sm.createContentTitle('WebGL').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText(
                    'Motivation:<br><br>' +
                        '&nbsp;+ Natural evolution.<br>' +
                        '&nbsp;+ Boost performance at no cost.<br>' +
                        '&nbsp;+ Luckily, we had already filled in some gaps.<br>' +
                        '&nbsp;+ Don\'t give up when results are odd.<br>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'What happened to my gorgeous canvas 2d RenderingContext ?.<br><br>' +
                    'A 2D engine means the worst scenario for a graphics card.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'As a rule of thumb, make as few calls to your opengl driver as possible.<br><br>'+
                    'Batch as much as possible your quad rendering operations.<br>'+
                    'But how ?').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    '+ Pre-pack images with transparencies.<br><br>' +
                    '+ Behind the scenes, there\'s a texture packer.<br><br>' +
                    '+ JS transformation of AABB').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'BTW, what\'s happening to my blending ?<br><br>' +
                    'Watch out where<br>' +
                    'your canvas lays <br>' +
                    'on bg color.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT ).
                addChild(
                        sm.createContentText('<img src="images/samples/blend_error.png">').
                            setBounds( 360, 90, 150, 320 )
                    ).
                addChild(
                    sm.createContentText('<img src="images/samples/blend.png">').
                        setBounds( 540, 90, 150, 320 )
                    )
            )
            ;
    }

    function setupCSS(director, sm) {
        var slide= sm.getSlide(4);
        var c;
        var padding=    50;

        slide.
            addChild(
                sm.createContentTitle('CSS').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText(
                    'Motivation:<br><br>' +
                    '&nbsp;+ A solution for mobile devices ?.<br>' +
                    '&nbsp;+ Become cross browser.<br>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Input routing.<br><br>' +
                    '&nbsp; + The dom standard overlaps a div with other even if it has no content.<br>' +
                    '&nbsp; + Again, abstraction FTW.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Must add every vendor prefix to your transformations.<br><br>' +
                    '&nbsp; -webkit, -moz, -o, -ms...<br><br>' +
                    'BTW, CSS3 Transformations may be a must.' ).
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'translate3d(0,0,0), your very best friend..<br><br>' +
                    'Or how to make your CSS hardware accelerated.<br><br>' +
                    'Better flatten the prototype chain depth.' ).
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Big issue:<br><br>' +
                    'how to deal with two implementations of the same objects ?<br><br>' +
                    'Module or Sandbox ?' ).
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            )
            ;
    }

    function setupHybrid(director, sm) {
        var slide= sm.getSlide(5);
        var c;
        var padding=    50;

        slide.
            addChild(
                sm.createContentTitle('Hybrid').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText(
                    'Motivation:<br><br>'+
                    '&nbsp; + Conquer the iTunes Store.<br>' +
                    '&nbsp; + Boost Mobile performance.<br>' +
                    '&nbsp; + Become Cross-platform (iOS and Android by now).<br>' +
                    '&nbsp; + Bring Web to Native and not viceversa.' ).
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Compile Javascript Core to make it run inside a native process.<br><br>'+
                    'Just to realize, Javascript core is naked.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Build your own context.<br><br>'+
                    'Create custom objects implementation, such as window, navigator, canvas, renderingContext...').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Create events abstraction functions, and don\'t worry about concurrency.<br><br>' +
                    'Create a native timer to invoke your JS entry point. Oh wait, don\'t forget to "protect" the function reference.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Bind image drawing primitives with OpenGL FTW.<br><br>'+
                    'Map every canvas to a GL FrameBuffer FTW again.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText('Result: 10-15FPS on iPad2.').
                    setOnFocus( CAAT.SlideContent.OUT ).
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                addContent(
                    sm.createContentImage(
                        new CAAT.SpriteImage().initialize( director.getImage('fail'),1 ,1 ) ).
                        setLocation( padding, 100 ).
                        setOnFocus(
                            CAAT.SlideContent.NONE,
                            function(content) {
                                director.audioPlay('broken');

                                content.emptyBehaviorList().
                                    addBehavior(
                                        new CAAT.AlphaBehavior().
                                            setFrameTime( content.time, 2000 ).
                                            setValues(0,1)
                                    ).
                                    addBehavior(
                                        new CAAT.ScaleBehavior().
                                            setFrameTime( content.time, 2000 ).
                                            setValues( 3,1, 3,1 ).
                                            setInterpolator(
                                                new CAAT.Interpolator().
                                                    createBounceOutInterpolator(false)
                                            )
                                    )
                            })
                )
            ).
            addContent(
                sm.createContentText(
                    'Optimizations to the rescue:<br><br>'+
                    ' + Keep your prototype chain short.<br>' +
                    ' + function.call/apply is evil.<br>' +
                    ' + In-house type inference where suitable.<br>'+
                    ' + Upgrade to the latest available JSCore version').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    'Results after optimizations: <br><br>' +
                    ' + steady 95FPS on iPad2.<br>' +
                    ' + steady 50FPS on iPhone 3GS.<br><br>' +
                    '<span class="red">And add a 30% extra performance gain if JIT enabled</span>.').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            ).
            addContent(
                sm.createContentText(
                    '+ Audio: OpenAL mapping<br><br>' +
                    '+ WebSocket: custom object<br><br>' +
                    '+ Rendering Context: on-demand create drawing primitives').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            )
            ;
    }

    function setupConclusion(director, sm) {
        var slide= sm.getSlide(6);
        var c;
        var padding=    50;

        var f= function(content) {
                    content.emptyBehaviorList().
                        addBehavior(
                            new CAAT.AlphaBehavior().
                                setFrameTime( content.time, 2000 ).
                                setValues(0,1)
                        ).
                        addBehavior(
                            new CAAT.ScaleBehavior().
                                setFrameTime( content.time, 2000 ).
                                setValues( 3,1, 3,1 ).
                                setInterpolator(
                                    new CAAT.Interpolator().
                                        createBounceOutInterpolator(false)
                                )
                        )
                };

        slide.
            addChild(
                sm.createContentTitle('Conclusions').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText('+ Abstraction FTW.').
                    setBounds( padding, 150, slide.width-2*padding, 50 ).
                    setOnFocus( CAAT.SlideContent.NONE, f )
            ).
            addContent(
                sm.createContentText('+ One code base, four rendering engine targets.').
                    setBounds( padding, 200, slide.width-2*padding, 100 ).
                    setOnFocus( CAAT.SlideContent.NONE, f )
            ).
            addContent(
                sm.createContentText('+ Technology state: for early adopters.').
                    setBounds( padding, 300, slide.width-2*padding, 100 ).
                    setOnFocus( CAAT.SlideContent.NONE, f )
            ).
            addContent(
                sm.createContentText('+ Canvas, is not always a compelling choice.').
                    setBounds( padding, 400, slide.width-2*padding, 100 ).
                    setOnFocus( CAAT.SlideContent.NONE, f )
            )
            ;
    }

    function setupQA(director, sm) {
        var slide= sm.getSlide(7);
        var c;
        var padding=    50;

        slide.
            addChild(
                sm.createContentTitle('The end').
                    setLocation( padding, 20 )
            ).
            addContent(
                sm.createContentText(
                    '<center>Ibon Tolosana<br>@hyperandroid<br><br>'+
                    'Thanks for attending<br><br>' +
                    'Any Questions ?</center>').
                    setBounds( padding, 150, slide.width-2*padding, slide.height-150 ).
                    setOnFocus( CAAT.SlideContent.OUT )
            )
        ;
    }

    window.addEventListener('load', keyNote, false);

})();