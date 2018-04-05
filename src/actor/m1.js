
function createCanvas() {
    var director;

    if ( window.innerWidth>window.innerHeight ) {
        director= new CAAT.Director().initialize(700,500).setClear(false);
    } else {
        director= new CAAT.Director().initialize(500,750).setClear(false);
    }

    //document.getElementById('game').appendChild(director.canvas);
    document.body.appendChild(director.canvas)

    return director;
}

function __Hypernumbers_init()   {

    var director= createCanvas();
    var scene= director.createScene();

    var t= new CAAT.TextActor().
            setFont("40px arial").
            setText("Text on Path").
            calcTextSize(director).
            setTextAlign("center").
            setFillStyle('#00f');

    scene.addChild(t);


    CAAT.loop(60);
}

window.addEventListener('load', __Hypernumbers_init, false);

