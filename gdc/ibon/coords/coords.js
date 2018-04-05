
(function() {

    var director;

    impress().addListener( function(a) {
        director.stopped=  a.newId!=="slide5";
    });

    window.addEventListener('load',__coordinates,false);

    function __coordinates() {

        director= new CAAT.Director().initialize( 900, 500, document.getElementById("_pp") );

        var scene= director.createScene();


        var cc= new CAAT.ActorContainer().
            setBounds( 0,0,director.width,director.height );
        cc.setGestureEnabled(true);

        scene.addChild(cc);

        var coords= new CAAT.TextActor().
                setFont("20px sans-serif").
                setTextAlign('left').
                setTextBaseline('top').
                setText("").
                setLocation(15,20).
                setTextFillStyle('black').
                setOutlineColor('#aaa').
                setOutline(true);
        scene.addChild(coords);

        var coords2= new CAAT.TextActor().
            setFont("20px sans-serif").
            setTextAlign('left').
            setTextBaseline('top').
            setText("").
            setLocation(15,42).
            setTextFillStyle('black').
            setOutlineColor('#aaa').
            setOutline(true);
        scene.addChild(coords2);

        var coords3= new CAAT.TextActor().
            setFont("20px sans-serif").
            setTextAlign('left').
            setTextBaseline('top').
            setText("").
            setLocation(15,64).
            setTextFillStyle('black').
            setOutlineColor('#aaa').
            setOutline(true);
        scene.addChild(coords3);

        // on doubleclick, zorder maximo.
        var dblclick= function(mouseEvent) {
            var actor= mouseEvent.source;
            if( null==actor ) {
                return;
            }

            var parent= actor.parent;
            parent.setZOrder(actor,Number.MAX_VALUE);
        };

        scene.enableInputList(2);

        var np = 20;
        var s = 80;
        for ( var i = 0; i < np; i++) {
            var sc= 1+Math.random()*.25;

            var p = new CAAT.ActorContainer().
                setBounds(
                    Math.random() * director.canvas.width,
                    Math.random()* director.canvas.height,
                    s,
                    s).
                setRotation( Math.PI*2*Math.random() ).
                setScale( sc, sc ).
                setFillStyle( i===0 ? '#00f' : '#ff3fff');

            p.setGestureEnabled(true);

            p.mouseEnter= function(ev) {
                this.pointed= true;
            }
            p.mouseExit= function(ev) {
                this.pointed= false;
            }
            p.paint= function(director, time) {

                var canvas= director.ctx;

                if ( null!=this.parent && null!=this.fillStyle ) {
                    canvas.fillStyle= this.pointed ? 'orange' : (this.fillStyle!=null ? this.fillStyle : 'white'); //'white';
                    canvas.fillRect(0,0,this.width,this.height );
                }

                canvas.strokeStyle= this.pointed ? 'red' : 'black';
                canvas.strokeRect(0,0,this.width,this.height );

                canvas.strokeStyle='white';
                canvas.beginPath();
                canvas.moveTo(5,10);
                canvas.lineTo(20,10);
                canvas.lineTo(15,5);

                canvas.moveTo(20,10);
                canvas.lineTo(15,15);

                canvas.lineWidth=2;
                canvas.lineJoin='round';
                canvas.lineCap='round';

                canvas.stroke();


            };
            p.mouseDblClick= dblclick;
            cc.addChild(p);

            var fpaint= function(director,time) {
                var canvas= director.crc;

                if ( null!=this.parent && null!=this.fillStyle ) {
                    canvas.fillStyle= this.pointed ? 'orange' : (this.fillStyle!=null ? this.fillStyle : 'white'); //'white';
                    canvas.fillRect(0,0,this.width,this.height );
                }

                canvas.fillStyle='black';
                canvas.fillRect(1,1,5,5);
            };

            var p0= new CAAT.Actor().
                setBounds( s/4, s/4, s/4, s/4 ).
                setRotation( Math.PI*2*Math.random() ).
                setFillStyle('#a03f00');
            p0.mouseDblClick= dblclick;
            p0.paint=fpaint;
            p.addChild(p0);

            var p1= new CAAT.Actor().
                setBounds( s/2, s/2, s/4, s/4 ).
                setRotation( Math.PI*2*Math.random() ).
                setFillStyle('#ffff3f');
            p1.mouseDblClick= dblclick;
            p1.paint=fpaint;

            p.addChild(p1);
            p1.enableDrag();
            p0.enableDrag();
            p.enableDrag();

            p1.__mouseMove= p1.mouseMove;
            p0.__mouseMove= p0.mouseMove;
            p.__mouseMove= p.mouseMove;

            var mouseMoveHandler= function(mouseEvent) {
                var actor= mouseEvent.source;
                actor.__mouseMove(mouseEvent);

                coords.setText("Local Coord: ("+
                        ((mouseEvent.point.x*100)>>0)/100+","+
                        ((mouseEvent.point.y*100)>>0)/100+")");
                coords2.setText("Screen Coord: ("+
                        mouseEvent.screenPoint.x+","+
                        mouseEvent.screenPoint.y+")");
                coords3.setText(
                        "Parent Pos: ("+((actor.x*100)>>0)/100+","+((actor.y*100)>>0)/100+")" );
            };

            p.mouseMove= mouseMoveHandler;
            p0.mouseMove= mouseMoveHandler;
            p1.mouseMove= mouseMoveHandler;

            if (i===0) {
                scene.addActorToInputList(p,1);
                scene.addActorToInputList(p0,0);
                scene.addActorToInputList(p1,0);
            }

        }

        cc.__mouseMove= scene.mouseMove;
        cc.mouseMove= function(mouseEvent) {
            mouseEvent.source.__mouseMove(mouseEvent);
            coords.setText("Local Coord: ("+mouseEvent.point.x+","+mouseEvent.point.y+")");
            coords2.setText("");
            coords3.setText("");
        };

    }

})();