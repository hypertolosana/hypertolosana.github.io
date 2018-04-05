CAAT.Box2D= {};
CAAT.Box2D.PMR= 80;              // Pixel/Meter ratio

(function() {

    CAAT.Box2D.CircularBody= function() {
        CAAT.Box2D.CircularBody.superclass.constructor.call(this);
        return this;
    };

    CAAT.Box2D.CircularBody.prototype= {

        bodyType:           Box2D.Dynamics.b2Body.b2_dynamicBody,

        worldBody:          null,
        worldBodyFixture:   null,

        animate: function(director, time) {

            var b= this.worldBody;
            var xf= b.m_xf;
            this.setLocation(
                    CAAT.Box2D.PMR*xf.position.x - this.width/2,
                    CAAT.Box2D.PMR*xf.position.y - this.height/2 );
            this.setRotation( b.GetAngle() );

            return CAAT.Box2D.CircularBody.superclass.animate.call(this,director,time);
        },
        createBody : function(world, bodyData) {

            var scale= (bodyData.radius || 20);
            bodyData.radius= scale;

            if ( bodyData ) {
                if ( bodyData.density!='undefined' )     this.density=       bodyData.density;
                if ( bodyData.friction!='undefined')     this.friction=      bodyData.friction;
                if ( bodyData.restitution!='undefined' ) this.restitution=   bodyData.restitution;
                if ( bodyData.bodyType!='undefined' )    this.bodyType=      bodyData.bodyType;
                if ( bodyData.image!='undefined' )       this.image=         bodyData.image;
                if ( !bodyData.userData)                 bodyData.userData=  {};
            }

            if ( bodyData.radius )  this.radius= bodyData.radius;

            var fixDef=             new Box2D.Dynamics.b2FixtureDef();
            fixDef.density=         this.density;
            fixDef.friction=        this.friction;
            fixDef.restitution=     this.restitution;
            fixDef.shape =          new Box2D.Collision.Shapes.b2CircleShape(this.radius/CAAT.Box2D.PMR);

            var bodyDef =           new Box2D.Dynamics.b2BodyDef();
            bodyDef.type =          this.bodyType;
            bodyDef.position.x=     bodyData.x/CAAT.Box2D.PMR;
            bodyDef.position.y=     bodyData.y/CAAT.Box2D.PMR;

            var worldBody=          world.CreateBody(bodyDef);
            var worldBodyFixture=   worldBody.CreateFixture(fixDef);

            if ( bodyData.isSensor ) {
                worldBodyFixture.SetSensor(true);
            }

            this.worldBody=         worldBody;

            this.setFillStyle(worldBodyFixture.IsSensor() ? 'red' : 'blue').
                    setBackgroundImage(this.image).
                    setSize(2*this.radius,2*this.radius).
                    setImageTransformation(CAAT.ImageActor.prototype.TR_FIXED_TO_SIZE);


            return this;
        }
    };

    extend( CAAT.Box2D.CircularBody, CAAT.Actor );
})();

(function() {

    CAAT.Box2D.Edge= function() {
        CAAT.Box2D.Edge.superclass.constructor.call(this);
        return this;
    };

    CAAT.Box2D.Edge.prototype= {

        boundingBox: null,

        getCenter : function() {
            var b= this.worldBody;
            var xf= b.m_xf;
            var poly= b.GetFixtureList().GetShape();
            return Box2D.Common.Math.b2Math.MulX(xf, poly.m_centroid);
        },
        animate: function(director, time) {

            var b= this.worldBody;
            var xf= b.m_xf;
            var poly= this.worldBodyFixture.GetShape();
            if ( poly ) {
                var v= Box2D.Common.Math.b2Math.MulX(xf, poly.m_centroid);
                this.setLocation(
                        v.x*CAAT.Box2D.PMR - this.width/2,
                        v.y*CAAT.Box2D.PMR - this.height/2 );
                this.setRotation( b.GetAngle() );
            }

            return CAAT.Box2D.Edge.superclass.animate.call(this,director,time);
        },
        createBody : function(world, bodyData) {
            if ( bodyData ) {
                if ( bodyData.density!='undefined' )     this.density=       bodyData.density;
                if ( bodyData.friction!='undefined')     this.friction=      bodyData.friction;
                if ( bodyData.restitution!='undefined' ) this.restitution=   bodyData.restitution;
                if ( bodyData.bodyType!='undefined' )    this.bodyType=      bodyData.bodyType;
                if ( bodyData.image!='undefined' )       this.image=         bodyData.image;
                if ( !bodyData.userData)                 bodyData.userData=  {};
            }

            var fixDef=         new Box2D.Dynamics.b2FixtureDef();
            fixDef.density=     this.density;
            fixDef.friction=    this.friction;
            fixDef.restitution= this.restitution;
            fixDef.shape =      new Box2D.Collision.Shapes.b2PolygonShape();

            var minx= Number.MAX_VALUE;
            var maxx= Number.MIN_VALUE;
            var miny= Number.MAX_VALUE;
            var maxy= Number.MIN_VALUE;

            var vec= [];

            var scale= (bodyData.bodyDefScale || 1);
            scale= scale+ (bodyData.bodyDefScaleTolerance || 0)*Math.random();

            for( var i=0; i<bodyData.bodyDef.length; i++ ) {
                var x= bodyData.bodyDef[i].x* scale;
                var y= bodyData.bodyDef[i].y* scale;
                if ( x<minx ) { minx= x; }
                if ( x>maxx ) { maxx= x; }
                if ( y<miny ) { miny= y; }
                if ( y>maxy ) { maxy= y; }

                x+= bodyData.x || 0;
                y+= bodyData.y || 0;
                vec.push( new Box2D.Common.Math.b2Vec2(x/CAAT.Box2D.PMR,y/CAAT.Box2D.PMR) );
            }

            this.boundingBox= [{x:minx, y:miny}, {x:maxx, y:maxy}];

            fixDef.shape.SetAsEdge( vec[0], vec[1] );

            var bodyDef =           new Box2D.Dynamics.b2BodyDef();
            bodyDef.type =          this.bodyType;

            var worldBody=          world.CreateBody(bodyDef);
            var worldBodyFixture=   worldBody.CreateFixture(fixDef);

            if ( bodyData.isSensor ) {
                worldBodyFixture.SetSensor(true);
            }

            this.worldBody=         worldBody;
            this.worldBodyFixture=  worldBodyFixture;

            this.setBackgroundImage( bodyData.image ).
                setSize(
                    this.boundingBox[1].x-this.boundingBox[0].x+1,
                    this.boundingBox[1].y-this.boundingBox[0].y+1 ).
                setFillStyle( worldBodyFixture.IsSensor() ? 'red' : 'green').
                setImageTransformation(CAAT.ImageActor.prototype.TR_FIXED_TO_SIZE);

            return this;
        }
    };

    extend( CAAT.Box2D.Edge, CAAT.Actor );
})();
