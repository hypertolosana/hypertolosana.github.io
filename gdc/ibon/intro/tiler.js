/**
 * @license
 *
 * The MIT License
 * Copyright (c) 2010-2011 Ibon Tolosana, Hyperandroid || http://labs.hyperandroid.com/

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

var CSS= {};

(function() {
    CSS.OpenDiv= function(w,h,x,y,style) {
        var div=  '<div style="';
        div+=' width:'+ w+'px;';
        div+=' height:'+h+'px;';
        div+=' left:'+  x+'px;';
        div+=' top:'+   y+'px;';
        div+=' position:absolute;';

        for( var st in style ) {
            div+= ' '+st+':'+style[st]+';';
        }
        div+='">';

        return div;
    };
    CSS.CloseDiv= function() {
        return '</div>';
    }

    /**
     * Each tile is composed of two overlapping div with inverse 3d plane normal.
     * This tile is attached to the image's imaginary plane's center
     */
    CSS.Tile= function() {
        return this;
    };

    CSS.Tile.prototype= {

        div:        null,
        front:      null,
        back:       null,
        startTime:  0,
        started:    false,
        parent:     null,

        initFromDOM : function(node) {
            this.parent= node;
            this.div=    this.parent.children[0];
            this.front=  this.div.children[0];
            this.back=   this.div.children[1];
        },
        initialize : function( index,x,y,tx,ty,w,h,images, anchor_x, anchor_y ) {

            var def=
            CSS.OpenDiv(0,0,anchor_x,anchor_y, {
                '-webkit-transform-style':   'preserve-3d'
            }) +
                CSS.OpenDiv( w,h,x,y, {
                    '-webkit-transition':       '-webkit-transform 1s ease',
                    '-webkit-transform-style':  'preserve-3d',
                    '-webkit-transform':        'rotateX(0deg) rotateY(0deg) rotateZ(0deg)'
                }) +
                    CSS.OpenDiv(w,h,0,0, {
                        background:                     'url('+images[index%images.length].src+')' + ' -'+tx+'px -'+ty+'px',
                        '-webkit-backface-visibility':  'hidden',
                        '-webkit-transition':           '-webkit-transform 0s ease all'
                    }) +
                    CSS.CloseDiv()+

                    CSS.OpenDiv(w,h,0,0, {
                        background:                     'url('+images[(index+1)%images.length].src+')' + ' -'+tx+'px -'+ty+'px',
                        '-webkit-backface-visibility':   'hidden',
                        '-webkit-transition':           '-webkit-transform 0s ease all',
                        '-webkit-transform':            'rotateY(-180deg)'
                    }) +
                    CSS.CloseDiv() +
                CSS.CloseDiv() +
            CSS.CloseDiv();

            return def;
        },
        prepareRotations : function(type) {

            // 0,1 : left,right
            // 2,3 : top, bottom
            // 3,4 : rotation

            // set for random tile rotation. save the preset rotation value.
            if ( 8===type ) {
                this.__type= (Math.random()*8)>>0;
                type= this.__type;
            }

            // si pones webkitransform afectando a all, la animacion no se har‡ !!! WTF.
            this.div.style.webkitTransition= '-webkit-transform 0s ease';
            this.parent.style.webkitTransition= '-webkit-transform 0s ease';
            this.div.style['-webkit-transition-delay']= '0ms';
            this.parent.style['-webkit-transition-delay']= '0ms';

            switch(type) {
                case 0:
                case 1:
                    this.back.style.webkitTransform='rotateX(0deg) rotateY(-180deg) rotateZ(0deg)';
                    break;
                case 2:
                case 3:
                    this.back.style.webkitTransform='rotateX(0deg) rotateY(-180deg) rotateZ(180deg)';
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                    this.back.style.webkitTransform='rotateX(0deg) rotateY(-180deg) rotateZ(-180deg)';
                    break;
            }
        },
        performRotations : function(type,time,rotationAngleParent,angle) {

            // random. set any rotation for the tile.
            if ( 8===type ) {
                type= this.__type;
            }

            var rx=0,ry=0,rz=0;
            // 0,1 : left,right
            // 2,3 : top, bottom
            // 3,4 : rotation
            switch(type) {
                case 0:
                    ry=180;
                    break;
                case 1:
                    ry=-180;
                    break;
                case 2:
                    rx=180;
                    break;
                case 3:
                    rx=-180;
                    break;
                case 4:
                    ry=180;
                    rz=180;
                    break;
                case 5:
                    ry=-180;
                    rz=-180;
                    break;
                case 6:
                    ry=540;
                    rz=180;
                    break;
                case 7:
                    ry=-540;
                    rz=-180;
                    break;
            }

            this.div.style.webkitTransform='rotateX('+rx+'deg) rotateY('+ry+'deg) rotateZ('+rz+'deg)';

            switch(rotationAngleParent) {
                case 0:
                    this.parent.style['-webkit-transform']='rotateX('+angle+'deg) rotateY(0deg) rotateZ(0deg)';
                    break;
                case 1:
                    this.parent.style['-webkit-transform']='rotateX(0deg) rotateY('+angle+'deg) rotateZ(0deg)';
                    break;
                case 2:
                    this.parent.style['-webkit-transform']='rotateX('+angle+'deg) rotateY('+angle+'deg) rotateZ(0deg)';
                    break;
                case 3:
                    this.parent.style['-webkit-transform']='rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
                    break;
            }

            // ojo con poner primero delay y luego transform. no hara la espera empezara del tiron.
            this.div.style.webkitTransition= '-webkit-transform '+time+'s ease';
            this.parent.style.webkitTransition= '-webkit-transform '+time+'s ease';
            this.div.style['-webkit-transition-delay']= this.time+'ms';
            this.parent.style['-webkit-transition-delay']= this.time+'ms';
        }
    };

    CSS.Tiler= function() {
        return this;
    };

    CSS.Tiler.prototype= {
        rows:                       0,
        columns:                    0,
        parentNode:                 null,
        width:                      0,
        height:                     0,

        tiles:                      null,

        timer:                      null,
        timerAnimationEndNotify:    null,
        time:                       0,

        running:                    false,

        doubleAxisRotationStyle:    'random',
        tileRotationStyle:          'random',

        initialize: function(node,width,height,rows,columns,images,index) {

            this.images= images;
            this.parentNode= node;

            this.width= width;
            this.height= height;

            this.rows= rows;
            this.columns= columns;

            this.tiles= [];
            var tw = (width/columns)>>0;
            var th = (height/rows)>>0;
            var padtw= width  - tw*columns;
            var padth= height - th*rows;

            var definition='';

            var prevY= 0;
            for( var i=0; i<rows; i++ ) {
                var prevX=0;
                for( var j=0; j<columns; j++ ) {
                    var tile= new CSS.Tile();
                    this.tiles.push(tile);
                    definition+= tile.initialize(
                            index,
                            tw*j - width/2,
                            th*i - height/2,
                            tw*j,
                            th*i,
                            tw,
                            th,
                            images,
                            (node.clientWidth)/2,
                            (node.clientHeight)/2);
                }
            }

            node.innerHTML=definition;

            for( var i=0; i<node.childElementCount; i++ ) {
                var tile= node.children[i];
                this.tiles[i].initFromDOM(tile);
            }
        },
        prepareRotations: function(type) {
            for( var i=0; i<this.tiles.length; i++ ) {
                this.tiles[i].prepareRotations(type);
            }
        },
        performRotations: function(tileRotation,time,tileTime,on_end_callback) {
            var me= this;
            var filler= (Math.random()*8)>>0;

            var randomX= (Math.random()*this.columns);
            var randomY= (Math.random()*this.rows);

            var maxt=   0;

            for( var i=0; i<this.rows; i++ ) {
                for( var j=0; j<this.columns; j++ ) {
                    var index= j+i*this.columns;
                    var t;
                    var x1,y1;

                    switch(filler) {
                        case 0:     // columns
                            t= j;
                            break;
                        case 1:     // rows
                            t= i;
                            break;
                        case 2:     // oblique lines
                            t= i+j;
                            break;
                        case 3:     // oblique lines 2
                            t= (this.rows+this.columns-1-1)-(i+j);
                            break;
                        case 4:     // circular from middle
                            x1= j-this.columns/2;
                            y1= i-this.rows/2;
                            t= i+(this.columns-j-1);
                            break;
                        case 5:     // circular random point.
                            x1= j-randomX;
                            y1= i-randomY;
                            t= 4*Math.sqrt( x1*x1 + y1*y1 );
                            break;
                        case 6:     // random
                            t= Math.random()*Math.max(this.rows,this.columns);
                            break;
                        case 7:
                            x1= j-this.columns/2;
                            y1= i-this.rows/2;
                            x1/=this.columns/2;
                            y1/=this.rows/2;
                            t= 12*Math.exp((-x1*x1-y1*y1));
                            break;
                    }

                    var tt= tileTime*t;
                    this.tiles[index].time = 500 /*+ this.time*/ + tt;
                    this.tiles[index].started= false;

                    if ( tt+500>maxt ) {
                        maxt= tt+500;
                    }
                }
            }

            var rotationAngleParent= 0;
            if ( this.doubleAxisRotationStyle=='random' ) {
                rotationAngleParent= (Math.random()*3)>>0;
            } else if ( this.doubleAxisRotationStyle=='horizontal' ) {
                rotationAngleParent= 1;
            } else
            if ( this.doubleAxisRotationStyle=='vertical' ) {
                rotationAngleParent= 0;
            } else
            if ( this.doubleAxisRotationStyle=='both' ) {
                rotationAngleParent= 2;
            } else {
                rotationAngleParent= 3;
            }

            this.timerAnimationEndNotify= setTimeout( function() {
                me.running= false;
                if ( on_end_callback ) {
                    on_end_callback();
                }
            }, maxt+time*1000);


            var angle= 360*(Math.random()<.5?1:-1);
            for( var i=0; i<me.tiles.length; i++ ) {
                this.tiles[i].performRotations(tileRotation,time,rotationAngleParent,angle);
            }
        },
        process : function(time,tileTime,on_end_callback) {
            if ( this.running ) {
                return;
            }

            this.running= true;

            var tileRotation= 0;
            if (this.tileRotationStyle=='random') {
                tileRotation= (Math.random()*8)>>0;
            } else if (this.tileRotationStyle=='horizontal') {
                tileRotation= Math.random()<0.5 ? 1 : 0;
            } else if (this.tileRotationStyle=='vertical') {
                tileRotation= Math.random()<0.5 ? 2 : 3;
            } else if (this.tileRotationStyle=='both') {
                tileRotation= Math.random()<0.5 ? 4 : 5;
            } else if (this.tileRotationStyle=='both-2') {
                tileRotation= Math.random()<0.5 ? 6 : 7;
            } else {
                tileRotation= 8;
            }

            this.prepareRotations(tileRotation);
            this.performRotations(tileRotation,time,tileTime,on_end_callback);

        }
    };

})();