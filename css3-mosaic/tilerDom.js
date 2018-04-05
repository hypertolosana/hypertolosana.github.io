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

var canLaunch= true;
var tilerWidth = 400;
var tilerHeight = 500;
var images= [];
var li= [];         // elementos de paginacion
var tiler = new CSS.Tiler();
var xz = 0, yz = 1;
var imagesIndex = 0;
var autoRun = true;

var modernizr= new Modernizr.CSS3Check();

if ( modernizr.isCSS3_3DEnabled() ) {

    var preferences = {
        rows:               8,
        columns:            8,
        tileRotationTime:   2500,
        tileDelay:          50,
        secondAxisRotation: 'none',
        tileRotationStyle:  'random',
        waitForNextSlide:   3000
    };

    document.addEventListener(
            'keydown',
            function(e) {

                var k = e.keyCode;
                if (k === 39) { // LEFT
                    rotate(-1, 0);
                } else if (k === 37) {  // RIGHT
                    rotate(1, 0);
                } else if (k === 38) { // TOP
                    rotate(0, -.25);
                } else if (k === 40) {  // BOTTOM
                    rotate(0, .25);
                }
            },
            false);

    function rotate(_xz, _yz) {
        xz += 10 * _xz;
        yz += _yz;
        document.getElementById('tiler').style.webkitTransform =
                'rotateY(' + xz + 'deg) scale(' + yz + ')';
    }

    function setPref(property, value, control) {
        preferences[property] = value;
        if (control) {
            document.getElementById(control).innerHTML = value;
        }
    }

    function run() {
        if (autoRun) {
            tiler.process(
                    (preferences.tileRotationTime >> 0) / 1000,
                    preferences.tileDelay >> 0,
                    onEnd);
            imagesIndex++;
        }
    }

    function hasClass(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(ele, cls) {
        if (!this.hasClass(ele, cls)) ele.className += " " + cls;
    }

    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }

    function onEnd() {

        for( var i=0; i<images.length; i++ ) {
            var ii= imagesIndex%images.length;
            if ( i===ii ) {
                removeClass( li[i], 'not-current-page');
                addClass( li[i], 'current-page' );
            } else {
                removeClass( li[i], 'current-page' );
                addClass( li[i], 'not-current-page');
            }
        }

        setTimeout( function() {
            slide();
        }, preferences.waitForNextSlide );
    }

    function slide() {

        tiler.doubleAxisRotationStyle = preferences.secondAxisRotation;
        tiler.tileRotationStyle = preferences.tileRotationStyle;

        tiler.initialize(
                document.getElementById('tiler'),
                tilerWidth,
                tilerHeight,
                1 + ((Math.random() * preferences.rows) >> 0),
                1 + ((Math.random() * preferences.columns) >> 0),
                images,
                imagesIndex);

        if (autoRun) {
            setTimeout(run, 0);
        }

    }

    function setAutoRun() {
        autoRun = !autoRun;
        if (autoRun && !tiler.running) {
            run();
        }
    }

    function loadImages( ) {

        var loadedImages=0;
        var foundImages= [];
        var tilerElement= document.getElementById('tiler');
        var nodes= tilerElement.getElementsByTagName('img');
        for( var i=0, l=nodes.length; i<l; i++ ) {
            foundImages.push(nodes[i].cloneNode(false));
        }
        tilerElement.innerHTML='<div class="middle">Loading images ...</div>';

        for( var i=0; i<foundImages.length; i++ ) {

            var image= new Image();
            image.onload = function imageLoaded(event) {
                loadedImages++;
                images.push( event.target );
                if ( loadedImages==foundImages.length ) {
                    endLoading();
                }
            };
            image.onerror= function imageErrored() {
                loadedImages++;
                if ( loadedImages==foundImages.length ) {
                    endLoading();
                }
            }
            image.src= foundImages[i].src;
        }
    }

    function endLoading() {

        var paginator= document.getElementById('paginator');
        for( var i=0; i<images.length; i++ ) {
            var _li= document.createElement('li');
            _li.setAttribute('data-index',i);
            paginator.appendChild(_li);

            _li.onclick= function(event) {
                var element= event.target;
                var value= element.getAttribute('data-index');
                imagesIndex= parseInt(value,10);
            }
    
            li.push(_li);
            if ( i==0 ) {
                addClass( _li, 'current-page');
            } else {
                addClass( _li, 'not-current-page');
            }
        }

        slide();
    }

    loadImages();
} else{

    var tilerElement= document.getElementById('tiler');
    tilerElement.innerHTML='<div class="middle">To view this experiment, you need a CSS3 3D enabled browser, sorry.</div>';
}
