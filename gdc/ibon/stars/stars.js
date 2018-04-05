function __scene1(director) {

    var scene= director.createScene();

    var background= new CAAT.ActorContainer().setBounds(0,0,director.width,director.height).setFillStyle("#000");
    scene.addChild(background);

    var starsImage= null;
    starsImage= new CAAT.SpriteImage().initialize(director.getImage('stars'), 24,6 );

    var T= 600;

    var kfc_i= new CAAT.Interpolator().createExponentialInInterpolator(2,false);

    background.mouseMove= function(mouseEvent) {

        for( var i=0; i<3; i++ ) {
            var offset0= Math.random()*10*(Math.random()<.5?1:-1) + mouseEvent.point.x;
            var offset1= Math.random()*10*(Math.random()<.5?1:-1) +mouseEvent.point.y;

            var iindex= (Math.random()*6)>>0;
            var actorStar= new CAAT.Actor();
            actorStar.__imageIndex= iindex;

            actorStar.
                    setBackgroundImage(
                        starsImage.getRef().setAnimationImageIndex( [(Math.random()*6)>>0] ), true ).
                    setLocation( offset0, offset1 ).
                    setDiscardable(true).
                    enableEvents(false).
                    setFrameTime(scene.time, T).
                    addBehavior(
                        new CAAT.ScaleBehavior().
                            setFrameTime(scene.time, T).
                            setValues( 1,5, 1,5 ).
                            setInterpolator( kfc_i )
                    );

            actorStar.addBehavior(
                new CAAT.GenericBehavior().
                    setFrameTime(scene.time, T).
                    setValues( 1, .1, null, null, function(value,target,actor) {
                        actor.backgroundImage.setAnimationImageIndex( [
                                actor.__imageIndex+(23-((23*value)>>0))*actor.backgroundImage.getColumns()
                            ] );
                    }));

            background.addChild(actorStar);
        }
    };

    CAAT.loop(60);
}
