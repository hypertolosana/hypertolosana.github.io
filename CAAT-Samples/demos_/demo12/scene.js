(function() {

    CAAT.Box2D.Scene= function() {
        CAAT.Box2D.Scene.superclass.constructor.call(this);
        this.world = new Box2D.Dynamics.b2World(
                new Box2D.Common.Math.b2Vec2(0, 9.8),
                true);
        this.world.SetContinuousPhysics(true);

        return this;
    };

    CAAT.Box2D.Scene.prototype= {
        world:  null,

        createBounds: function(director) {
            var BOUNDS_DENSITY= 1.2;
            var BOUNDS_FRICTION= .9;
            var BOUNDS_RESTITUTION= .66;

            var dw= director.width;
            var dh= director.height;

            var me= this;

            director.onRenderStart= function() {
                me.world.Step(1.0/60, 1,1);
                me.world.ClearForces();
            };

            ////// create world bounds.
            // bottom
            this.addChild( new CAAT.Box2D.Edge().createBody(
                        this.world,
                        {
                            bodyType:   Box2D.Dynamics.b2Body.b2_staticBody,
                            density:    BOUNDS_DENSITY,
                            friction:   BOUNDS_FRICTION,
                            restitution:BOUNDS_RESTITUTION,
                            bodyDef:    [{x:0,y:dh}, {x:dw, y:dh}]
                        })
            );

            // left
            this.addChild( new CAAT.Box2D.Edge().createBody(
                        this.world,
                        {
                            bodyType:   Box2D.Dynamics.b2Body.b2_staticBody,
                            density:    BOUNDS_DENSITY,
                            friction:   BOUNDS_FRICTION,
                            restitution:BOUNDS_RESTITUTION,
                            bodyDef:    [{x:0,y:-dh}, {x:0, y:dh}]
                        })
            );

            // right
            this.addChild( new CAAT.Box2D.Edge().createBody(
                        this.world,
                        {
                            bodyType:   Box2D.Dynamics.b2Body.b2_staticBody,
                            density:    BOUNDS_DENSITY,
                            friction:   BOUNDS_FRICTION,
                            restitution:BOUNDS_RESTITUTION,
                            bodyDef:    [{x:dw,y:-dh}, {x:dw, y:dh}]
                        })
            );

            // top
            this.addChild( new CAAT.Box2D.Edge().createBody(
                        this.world,
                        {
                            bodyType:   Box2D.Dynamics.b2Body.b2_staticBody,
                            density:    BOUNDS_DENSITY,
                            friction:   BOUNDS_FRICTION,
                            restitution:BOUNDS_RESTITUTION,
                            bodyDef:    [{x:0,y:-dh}, {x:dw, y:-dh}]
                        })
            );

            var ballc= new CAAT.ActorContainer().
                    setBounds(0,0,dw,dh);
            ballc.mouseClick = function(ev) {
                var body = new CAAT.Box2D.CircularBody().createBody(
                        me.world, {
                    x:                      ev.point.x,
                    y:                      ev.point.y,
                    bodyType:               Box2D.Dynamics.b2Body.b2_dynamicBody,
                    radius:                 10 + 20 * Math.random(),
                    density:                .5 + Math.random(),
                    restitution:            .2 + Math.random() * .8,
                    friction:               .2 + Math.random() * .8,
                    image:                  director.getImage('ball'),
                    userData:               {}
                }).
                enableEvents(false).
                setFrameTime(me.time, 8000).
                addListener({
                    actorLifeCycleEvent : function(actor, event, time) {
                        if (event === 'expired') {
                            var body = actor.worldBody;
                            me.world.DestroyBody(body);
                        }
                    }
                });

                ballc.addChild(body);
            }
            this.addChild(ballc);
        }
    };

    extend( CAAT.Box2D.Scene, CAAT.Scene );
})();