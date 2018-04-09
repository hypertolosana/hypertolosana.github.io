
    var sheets= document.getElementsByClassName('sheet');
    var currentSheet= 0;
    var elem= document.getElementById('ring');
    var face_angle= 90;
    var sizew= elem.clientWidth;
    var sizewh= sizew/2;
    var sizeh= elem.clientHeight;
    var sizehh= sizeh/2;
    var bookXZ=195;
    var bookYZ=45;
    var angle= -90;
    var animationFunction= null;
    var imagesCache;
    var scenes= [];
    var currentScene;
 
    var r= 400; //Math.round( ( sizeh ) / Math.tan( Math.PI / 2 ) );
    elem.style.webkitTransform=
        'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
 
    function setupbook() {
        var ladow= sizeh;
 
        var sideleft= document.getElementById('bookleft');
        sideleft.style.webkitTransform=
                'translateX(-'+ladow/2+'px) translateZ('+ladow/2+'px) rotateY(90deg) translateY('+sizeh+'px)';
 
        var sideright= document.getElementById('bookright');
        sideright.style.webkitTransform=
                'translateX('+(sizew-ladow/2)+'px) translateZ('+ladow/2+'px) rotateY(90deg) translateY('+sizeh+'px)';
 
        var sidefront= document.getElementById('bookfront');
        sidefront.style.webkitTransform=
                'translateZ('+ladow+'px) translateY('+sizeh+'px)';
 
        var sidetitle= document.getElementById('booktitle');
        sidetitle.style.webkitTransform=
                'translateY('+sizeh+'px) rotateY(180deg)';
 
        var backcover= document.getElementById('bookbackcover');
        backcover.style.webkitTransform=
                'translateY(50px) rotateX(-90deg) ';
 
    };
 
    function getSheetLayerList(sheet) {
        return sheet.getElementsByClassName('layer');
    }
 
    function initializeSheets() {
 
        var map= document.getElementById('map');
 
        for( var i=0; i<sheets.length; i++ ) {
            prepareSheet( i, -90 );
            if ( i>0 ) {
                sheets[i].style.display='none';
            }
 
            if ( i>0 ) {
                var d= document.createElement('div');
                d.style.position='absolute';
                d.style.width= 18+'px';
                d.style.height= 18+'px';
                d.style.background= "url('http://ludei.com/ioshtml5/book/numeros1.png')";
                d.style.top= 6+'px';
                d.style.left= ((i-1)*20)+'px';
                d.id= "map"+i;
                d.__id= i-1;
                d.style.backgroundPosition=(-d.__id*18)+"px 0px";
 
                map.appendChild(d);
            }
        }
    }
 
    function prepareSheet(sheetIndex, initialAngle) {
        var element= sheets[sheetIndex];
        element.style.webkitTransform= 'rotateX('+initialAngle+'deg) ';
    }
 
    function openSheet(sheetIndex, fromSheetIndex) {
        var element= sheets[sheetIndex];
 
        element.style.display='block';
 
        var layers= getSheetLayerList(element);
        var i=0;
 
        for( i=0; i<layers.length; i++ ) {
 
            var lh= layers[i].clientHeight;
            var lh2= lh/2;
 
            layers[i].style.webkitTransform=
                    'rotateX(90deg) '+
                    '';
        }
 
        if ( sheetIndex>0 ) {
            var mm= fromSheetIndex;
            sheets[mm].style.webkitTransform='rotateX(5deg)';
            sheets[mm].style.opacity=0;
/*            setTimeout( function() {
                sheets[mm].style.display='none';
            },950);*/
        }
 
        var floor= element.getElementsByClassName('floor');
        floor[0].style.display='block';
    }
 
    function closeSheet(sheetIndex) {
        var element= sheets[sheetIndex];
        var layers= getSheetLayerList(element);
        var i=0;
 
        for( i=0; i<layers.length; i++ ) {
            layers[i].style.webkitTransform='rotateX(0deg)';
        }
 
        element.style.webkitTransform='rotateX(0deg)';
    }
 
    function nextSheet(index) {
        if ( currentSheet<sheets.length-1 ) {
            closeSheet(currentSheet);
            exit(currentSheet);
            var prevSheet= currentSheet;
            currentSheet=index;
            openSheet(currentSheet, prevSheet);
            enter(currentSheet);
        }
    }
 
    function closeSheetBack(sheetIndex) {
        var element= sheets[sheetIndex];
 
        var layers= getSheetLayerList(element);
        var i=0;
 
        for( i=0; i<layers.length; i++ ) {
            layers[i].style.webkitTransform='rotateX(0deg)';
        }
    }
 
    function openSheetBack(sheetIndex) {
        var element= sheets[sheetIndex];
        element.style.display='block';
        element.style.opacity=1;
        element.style.webkitTransform='rotateX(-90deg)';
 
        var layers= getSheetLayerList(element);
        for( var i=0; i<layers.length; i++ ) {
            layers[i].style.webkitTransform='rotateX(90deg) ';
        }
 
        if ( sheetIndex<sheets.length-1 ) {
            var mm= sheetIndex+1;
            setTimeout( function() {
                sheets[mm].style.display='none';
            },950);
        }
 
    }
 
    function enter(sheetIndex) {
        if ( sheetIndex>=1 ) {
            director.setScene(sheetIndex-1);
            var map= document.getElementById('map'+sheetIndex);
            map.style.background= "url('http://ludei.com/ioshtml5/book/numeros2.png')";
            map.style.backgroundPosition=-(map.__id*18)+"px 0px";
 
/*
            bookXZ= (sheetIndex%3 ? 15 : 5);
            document.getElementById('ring').style.webkitTransform=
                    'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
*/
        }
    }
 
    function exit(sheetIndex) {
        if ( sheetIndex>=1 ) {
            var map= document.getElementById('map'+sheetIndex);
            map.style.background= "url('http://ludei.com/ioshtml5/book/numeros1.png')";
            map.style.backgroundPosition=-(map.__id*18)+"px 0px";
        }
    }
 
    function prevSheet(index) {
 
        if ( index!=currentSheet && currentSheet>0 ) {
 
            sheets[index].style.display='block';
            closeSheetBack( currentSheet );
            exit(currentSheet);
 
            currentSheet=index;
            setTimeout( function() {
                openSheetBack( currentSheet );
                enter(currentSheet);
            }, 10);
        }
    }
 
    function start() {
        initializeSheets();
        setupbook();
        enableEvents();
        director.loop(1000/30);
    }
 
    var director;
 
    new CAAT.ImagePreloader().loadImages(
        [
            {id:'http://ludei.com/ioshtml5/scene1/ovni.png',   url:'http://ludei.com/ioshtml5/scene1/ovni.png'},
            {id:'http://ludei.com/ioshtml5/scene1/nube1.png',  url:'http://ludei.com/ioshtml5/scene1/nube1.png'},
            {id:'http://ludei.com/ioshtml5/scene1/nube2.png',  url:'http://ludei.com/ioshtml5/scene1/nube2.png'},
            {id:'http://ludei.com/ioshtml5/scene1/nube3.png',  url:'http://ludei.com/ioshtml5/scene1/nube3.png'}
        ],
        function( counter, images ) {
            if ( counter==images.length ) {
 
                director = new CAAT.Director().initialize(1,1);
                director.setImagesCache(images);
                document.body.appendChild(director.canvas);
 
                director.addScene( createScene3(director,document.getElementById('scene8'),4,'http://ludei.com/ioshtml5/scene1/nube3.png' ) );                
                director.addScene( createScene1(director,document.getElementById('scene1'),2 ) );
                director.addScene( createScene1(director,document.getElementById('scene2'),2 ) );
                director.addScene( createScene3(director,document.getElementById('scene3'),5,'http://ludei.com/ioshtml5/scene1/nube3.png' ) );
                director.addScene( createScene3(director,document.getElementById('scene4'),3,'http://ludei.com/ioshtml5/scene1/nube2.png' ) );
                director.addScene( createScene1(director,document.getElementById('scene5'),3 ) );
                director.addScene( createScene3(director,document.getElementById('scene6'),2,'http://ludei.com/ioshtml5/scene1/nube1.png' ) );
                director.addScene( createScene1(director,document.getElementById('scene7'),2 ) );
                director.addScene( createScene9(director,document.getElementById('scene9') ) );
 
                director.setScene(0);
 
                start();
            }
        });
 
    function createScene1(director,parent,numClouds) {
        var i;
        var scene= new CAAT.Scene();
        scene.create();
 
        var ww= parent.clientWidth;
        var hh= parent.clientHeight;
 
        var container= new CAAT.CSSActor().
                setDOMParent(parent).
                create().
                setBounds( 0, 0, ww, hh );
 
        scene.addChild(container);
 
        for( i=0; i<numClouds; i++ ) {
 
            var simage= 'http://ludei.com/ioshtml5/scene1/ovni.png';
 
            var x,y;
            x= (i%7)*(container.width/5);
            y= ((i/7)>>0)*(container.height/5);
            var css= new CAAT.CSSActor().
//                        setDOMParent(container).
                    create().
                    setBounds( x, y, 1, 1 ).
                    setBackground(simage).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setAutoRotate(true).
                            setPath(
                                new CAAT.Path().setCubic(
                                    x,
                                    y,
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180),
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180),
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180) ) ).
                            setFrameTime( scene.time, 3000+Math.random()*3000 ).
                            addListener( {
                                behaviorExpired : function(behaviour,time) {
                                    var endCoord= behaviour.path.endCurvePosition();
                                    behaviour.setPath(
                                            new CAAT.Path().setCubic(
                                                endCoord.x,
                                                endCoord.y,
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180),
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180),
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180) ) );
                                    behaviour.setFrameTime( scene.time, 3000+Math.random()*3000 )
                                }
                            })
                    );
 
            var img= director.getImage(simage);
            css.setSize( img.width, img.height );
            container.addChild(css);
        }
 
        return scene;
    }
 
    function createScene9(director,parent) {
 
        var i;
        var scene= new CAAT.Scene();
        scene.create();
 
        var ww= parent.clientWidth;
        var hh= parent.clientHeight;
 
        var container= new CAAT.CSSActor().
                setDOMParent(parent).
                create().
                setBounds( 0, 0, ww, hh );
 
        scene.addChild(container);
 
        for( i=0; i<25; i++ ) {
            var css= new CAAT.CSSActor().
                    create().
                    setBounds( 0,0,40,40 );
 
            var x= ww/2;
            var y= hh;
            var x1= (i%2) ? ww+Math.random()*150 : ww-Math.random()*150;
            var y1= hh-Math.random()*100;
            var x2= (i%2) ? x1+Math.random()*150 : x1-Math.random()*150;
            var y2= y1-Math.random()*100;
 
 
            var bh= new CAAT.PathBehavior().
                            setAutoRotate(true).
                            setPath(
                                new CAAT.Path().setCubic(
                                    x,
                                    y,
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180),
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180),
                                    Math.random()*(80+ww-160),
                                    Math.random()*(90+hh-180) ) ).
                            setFrameTime( scene.time, 3000+Math.random()*3000 ).
                            addListener( {
                                behaviorExpired : function(behaviour,time) {
                                    var endCoord= behaviour.path.endCurvePosition();
                                    behaviour.setPath(
                                            new CAAT.Path().setCubic(
                                                endCoord.x,
                                                endCoord.y,
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180),
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180),
                                                Math.random()*(80+ww-160),
                                                Math.random()*(90+hh-180) ) );
                                    behaviour.setFrameTime( scene.time, 3000+Math.random()*3000 )
                                }
                            })
            css.addBehavior(bh);
            bh.__id= i%2;
 
            css.setInnerHTML('<h1 class="titulo1" style="color:#ffff00">?</h1>');
 
            container.addChild(css);
        }
 
        return scene;
 
    }
 
    function createScene3(director,parent,numClouds,simage) {
        simage= simage || 'scene1/nube1.png';
        var img= director.getImage(simage);
 
 
        var i;
        var scene= new CAAT.Scene();
        scene.create();
 
        var ww= parent.clientWidth;
        var hh= parent.clientHeight;
 
        var container= new CAAT.CSSActor().
                setDOMParent(parent).
                create().
                setBounds( 0, 0, ww, hh );
 
        scene.addChild(container);
 
        for( i=0; i<numClouds; i++ ) {
 
            var css= new CAAT.CSSActor().
                    create().
                    setBounds( 0, 0, 1, 1 ).
                    setBackground(simage).
                    addBehavior(
                        new CAAT.PathBehavior().
                            setAutoRotate(true).
                            setPath(
                                new CAAT.Path().setLinear(
                                    -img.width + Math.random()*(ww+img.width*2),
                                    10+Math.random()*100,
                                    ww+Math.random()*100,
                                    10+Math.random()*100 ) ).
                            setFrameTime( scene.time, 4000+Math.random()*5000 ).
                            addListener( {
                                behaviorExpired : function(behaviour,time) {
                                    var endCoord= behaviour.path.endCurvePosition();
                                    behaviour.setPath(
                                            new CAAT.Path().setLinear(
                                                -Math.random()*img.width-img.width,
                                                10+Math.random()*100,
                                                ww+Math.random()*100,
                                                10+Math.random()*100 ) );
                                    behaviour.setFrameTime( scene.time, 20000+Math.random()*5000 )
                                }
                            })
                    );
 
            css.setSize( img.width, img.height );
            container.addChild(css);
        }
        return scene;
    }
 
    function enableEvents() {
/*
 
        elem.addEventListener("touchstart", function(event) {
            var touches = event.changedTouches;
            prevtouches= touches;
            event.preventDefault();
        }, false);
 
        elem.addEventListener("touchmove", function(event) {
 
            if ( !drag ) {
                var touches = event.changedTouches;
                var incx= touches[0].screenX - prevtouches[0].screenX;
                var incy= touches[0].screenY - prevtouches[0].screenY;
                if ( incx>5 || incy>5 ) {
                    drag= true;
                }
            }
 
            if ( drag ) {
 
            drag= true;
                var touches = event.changedTouches;
                var incx= (touches[0].screenX - prevtouches[0].screenX)/20;
                var incy= (touches[0].screenY - prevtouches[0].screenY)/20;
 
                elem.style.webkitTransform='rotateY('+incx+'deg) rotateX('+incy+'deg)';
            }
 
            event.preventDefault();
        }, false);
 
        elem.addEventListener("touchend", function(event) {
 
            if ( !drag) {
                if ( prevtouches.length==2) {
                 nextSheet();
                } else {
                    if ( prevtouches.length==3 ) {
                        prevSheet();
                    }
                }
            }
 
            drag= false;
            event.preventDefault();
        }, false);
 
        elem.addEventListener("touchcancel", function(event) {
            event.preventDefault();
        }, false);
*/
 
        document.addEventListener(
            'keydown',
            function(e) {
    
                var k= e.keyCode;
                if ( k==65||k==68||k==83||k==87 ) {
                    switch(k) {
                    case 68:    // top
                        rotateXZ(true);
                        break;
                    case 65:    // bottom
                        rotateXZ(false);
                        break;
                    case 87:
                        rotateYZ(true);
                        break;
                    case 83:
                        rotateYZ(false);
                        break;
                    }
                } else if ( k==13 ) {
                    if (e.ctrlKey) {
                        prevSheet(currentSheet-1);
                    } else {
                        nextSheet(currentSheet+1);
                    }
                } else if ( k==49 ) {   // 1 .- bio
                    bio();
                } else if ( k==50 ) {   // 2 .- pages
                    paginas();
                } else if ( k==51 ) {   // 3 .- portada
                    portada();
                } else if ( k==33 ) {   // pageup
                    prevSheet(currentSheet-1);
                } else if ( k==34 ) {   // page down
                    nextSheet(currentSheet+1);
                } else if ( k==116 ) {
 
                    bookXZ= -bookXZ;
 
                    document.getElementById('ring').style.webkitTransform=
                            'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
 
                }
            },
            false
        );
    }
 
    function bio() {
        bookXZ= -10;
        bookYZ= 410;
        document.getElementById('ring').style.webkitTransform=
                'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
    }
 
    function paginas() {
        bookXZ= -15;
        bookYZ= 355;
        document.getElementById('ring').style.webkitTransform=
                'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
    }
 
    function portada() {
        bookXZ= 195;
        bookYZ= 45;
        document.getElementById('ring').style.webkitTransform=
                'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
    }
 
    function rotateXZ(mas) {
        bookXZ+= mas ? 10 : -10;
        document.getElementById('ring').style.webkitTransform=
                'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
 
    }
 
    function rotateYZ(mas) {
        bookYZ+= mas ? 10 : -10;
        document.getElementById('ring').style.webkitTransform=
                'translateZ( -'+r+'px ) rotateY('+bookXZ+'deg) rotateX('+bookYZ+'deg)';
 
    }
