var node= document.body;
            while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
            }

  node.style='margin:0px; padding:0px;';
  node.style['overflow']='hidden';

  var root= document.createElement('div');
  root.style.width='800px'; 
root.style.height='500px'; 
root.style.position='absolute'; 
root.style.left='0px'; 
root.style.top='0px';
root.style.margin='0 auto';
root.style['-webkit-perspective']= 200; 
root.style['-webkit-perspective-origin']= '50% 50%'; 
root.style['-webkit-transform-style']= 'preserve-3d'; 
root.style.overflow='hidden';
root.style.resize= 'both';
  document.body.insertBefore(root, document.body.children[0]);


  var menu= document.createElement('div');
menu.style.position='relative';
menu.style.width=  '100%';
menu.style.height= '100%';
menu.style.margin= '0 auto';
menu.style['-webkit-transition']= '-webkit-transform 1s ease';
menu.style['-webkit-transform-style']= 'preserve-3d';

  root.appendChild(menu);
 
/*
var more= document.createElement('div');
more.style['position']='absolute';
more.style['left']= '0px';
more.style['top']= '0px'; 
more.style['width']='200px'; 
more.style['height']='20px';
more.style['background']='rgba(240,240,255,.5)';
more.innerHTML="<h1><a style='color: #fff; text-shadow: white 0px 1px 0px, rgba(0, 0, 0, 0.4) 0 0 15px; font-size: 20px;' href=\"/\">More experiments</a></h1>";
document.body.appendChild(more);
*/
    var CSS= {};

    /**
     *
     * @param width {number}
     * @param height {number}
     * @param x {Number|optional}
     * @param y {Number|optional}
     */
    CSS.createDiv= function(width,height,x,y) {
        var page= document.createElement('div');
        page.style['position']='absolute';
        page.style['width']= width+'px';
        page.style['height']= height+'px';

        page.style['left']= x+'px';
        page.style['top']= y+'px';

        return page;
    };

    (function() {
        CSS.MenuItem= function() {
            return this;
        };

        CSS.MenuItem.prototype= {

            div:        null,
            parent:     null,
            pix_sec:    60,
url: null,

            initialize : function(parent, x,y,w,h, rx,ry,rz, img, pix_sec, url) {

                this.pix_sec= pix_sec;
this.url= url;

                var div= CSS.createDiv(w,h,x,y);
                div.style['display']="block";
                
                div.style['margin']= '0 auto';
                div.style.display= 'block';
                div.style.webkitTransition= '-webkit-transform 1s ease';
                div.style.webkitTransformStyle= 'preserve-3d';
                div.style.display= 'block';

var me= this;
div.addEventListener('click',function(event) {
window.open(me.url,'_self');
},
false);
                div.addEventListener('mouseover', function(event) {
                    me.div.style['opacity']= .6;
                }, false);

                div.addEventListener('mouseout', function(event) {
                    me.div.style['opacity']= 1;
                }, false);

                div.style['background-image']= 'url(https://hypertolosana.files.wordpress.com/2011/04/'+img+')';
                div.style['background-position']= '0px 0px';
                div.style['background-repeat']= 'repeat';
                this.div= div;

                parent.appendChild(div);
                
                return this;
            },
            time : function( t ) {
                var x= (t*this.pix_sec/1000)>>0;
                this.div.style['background-position']= ''+x+'px 0px'
            },
            setAngles : function(rx,ry,rz) {
                this.div.style.webkitTransform=
                        'rotateX('+rx+'deg) ' +
                        'rotateY('+ry+'deg) ' +
                        'rotateZ('+rz+'deg) ' ;

            }

        };
    })();


    root.style.width= window.innerWidth+'px';
    root.style.height= window.innerHeight+'px';

    var menuItem= [];
    var N=6;
    var menuItemHeight= 120;
    var menuItemWidth= 2000;
    var offsetHeight= 10;
    var offsetX= (menuItemWidth-window.innerWidth)/2;
    var offsetY= (window.innerHeight-(menuItemHeight+offsetHeight)*N)/2;
    var i;
    var url= [
        'https://hypertolosana.wordpress.com/book',
        'https://hypertolosana.wordpress.com/js1k',
        'https://hypertolosana.wordpress.com/html5-tiler-3d',
        'https://hypertolosana.wordpress.com/mathmayhem',
        'https://hypertolosana.wordpress.com/animation',
        'https://hypertolosana.wordpress.com/particles-html5',
        'https://hypertolosana.wordpress.com/hypnoamoeba-html5'];

    for( i=0; i<N; i++ ) {

        menuItem.push(
                new CSS.MenuItem().initialize(
                    menu,

                    -offsetX,
                    offsetY + (menuItemHeight+offsetHeight)*i,
                    menuItemWidth,
                    menuItemHeight,

                    0,
                    0,
                    0,
                    'm'+((i%7)+1)+'.jpg',

                    // px/second
                    (Math.random()<.5?1:-1)*(30+((1+(Math.random()*3))>>0)*10),
                    url[i%url.length])
        );
    }

    var setup= function() {
        var menur= Math.random()*20*(Math.random()<.5?1:-1);
        menu.style.webkitTransform= 'rotateZ('+menur+'deg)';
        var ry= Math.random()*3+3;
        var rz= Math.random()*10+5;
        rz*=(Math.random()<.5?1:-1);
        ry*=(Math.random()<.5?1:-1);
        for( i=0; i<N; i++ ) {
            menuItem[i].setAngles(0,ry,rz);
        }
    }

    setup();
    setInterval(
            function() {
                setup();
            },
            7000);

    var time= new Date().getTime();

    setInterval(
            function() {
                var t= new Date().getTime() - time; // 30px/seg
                for( var i=0; i<menuItem.length; i++ ) {
                    menuItem[i].time(t);
                }
            },
            1000/60);