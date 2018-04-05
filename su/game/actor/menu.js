/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 07/01/12
 * Time: 21:07
 */


(function() {
    SU.Menu= function() {
        return this;
    };

    SU.Menu.prototype= {

        create : function( director ) {

            var img= [];
            img.push( director.getImage('game-canfield') );
            img.push( director.getImage('game-klondike') );
            img.push( director.getImage('game-scorpion') );
            img.push( director.getImage('game-whitecard') );
            img.push( director.getImage('game-whitehead') );

            var scene= director.createScene();

            var inset_left= 40;
            var min= img[0].height*.3;
            var max= img[0].height;

            var dock= new CAAT.Dock().
                initialize(scene).
                setBounds( inset_left, 20, director.width-2*inset_left, img[0].height ).
                setSizes(min, max).
                setApplicationRange(2).
                setLayoutOp(CAAT.Dock.prototype.OP_LAYOUT_TOP);

            for( var i=0; i<img.length; i++ ) {
                dock.addChild(
                    new CAAT.Actor().
                        setBackgroundImage( img[i] ).
                        setImageTransformation( CAAT.SpriteImage.prototype.TR_FIXED_TO_SIZE )
                )
            }

            dock.layout();

            scene.addChild( dock );

            scene.activated= function() {
                director.setClear(true);
            }

            return scene;
        }
    };



})();