/**
 * Created by Ibon Tolosana, Hyperandroid. http://labs.hyperandroid.com
 * Date: 11/05/11
 */
var Modernizer = {};
(function() {

    Modernizer.CSS3Check = function() {
        this.docElement = document.documentElement;
        this.docHead = document.head || document.getElementsByTagName('head')[0];
        this.mod = 'modernizr';
        this.modElem = document.createElement(this.mod);
        this.m_style = this.modElem.style;
        this.prefixes = ' -webkit- -moz- -o- -ms- -khtml- '.split(' ');
        this.domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');

        return this;
    }

    Modernizer.CSS3Check.prototype = {

        test_props: function(props, callback) {
            for (var i in props) {
                if (this.m_style[ props[i] ] !== undefined && ( !callback || callback(props[i], this.modElem) )) {
                    return true;
                }
            }
        },

        testMediaQuery : function(mq) {

            var st = document.createElement('style'),
                    div = document.createElement('div'),
                    ret;

            st.textContent = mq + '{#modernizr{height:3px}}';
            this.docHead.appendChild(st);
            div.id = 'modernizr';
            this.docElement.appendChild(div);

            ret = div.offsetHeight === 3;

            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);

            return !!ret;

        },

        isCSS_transitionsEnabled: function() {

            var me = this;

            function test_props_all(prop, callback) {

                var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
                        props = (prop + ' ' + me.domPrefixes.join(uc_prop + ' ') + uc_prop).split(' ');

                return !!me.test_props(props, callback);
            }

            return !!test_props_all('transitionProperty');
        },

        isCSS3_3DEnabled: function() {

            var ret = !!this.test_props(
                    [
                        'perspectiveProperty',
                        'WebkitPerspective',
                        'MozPerspective',
                        'OPerspective',
                        'msPerspective' ]);

            // Webkit’s 3D transforms are passed off to the browser's own graphics renderer.
            //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
            //   some conditions. As a result, Webkit typically recognizes the syntax but
            //   will sometimes throw a false positive, thus we must do a more thorough check:
            if (ret && 'webkitPerspective' in this.docElement.style) {
                // Webkit allows this media query to succeed only if the feature is enabled.
                // `@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }`
                ret = this.testMediaQuery('@media (' + this.prefixes.join('transform-3d),(') + 'modernizr)');
            }

            return ret;
        }
    }
})();

var Flip = {};
(function() {

    var prevSX;
    var prevSY;
    var time = 1000; // animation time in ms.
    var modernizr = new Modernizer.CSS3Check();
    var isCSS3DEnabled = modernizr.isCSS3_3DEnabled();
    var isCSSTransitionsEnabled = modernizr.isCSS_transitionsEnabled();

    function copyNode(node) {

        var copyNode = node.cloneNode(true);
        copyNode.id = node.id + '-copy';

        for (var i = 0, l = copyNode.childNodes.length; i < l; i++) {
            if (copyNode.childNodes[i].id) {
                copyNode.childNodes[i].id = copyNode.childNodes[i].id + '-copy';
            }
        }

        return copyNode;
    }

    function copyChildNodes(from, to) {

        while (to.hasChildNodes()) {
            to.removeChild(to.lastChild);
        }

        var cn = from.childNodes;
        if (null != cn) {
            for (var i = 0, l = cn.length; i < l; i++) {
                to.appendChild(copyNode(cn[i]));
            }
        }
    }

    Flip.flip = function(nodeName) {
        var node = document.getElementById(nodeName);
        if (node) {

            var fc = document.getElementById('flip_content');
            var fcf = document.getElementById('flip_content_front');

            fc.style['display'] = 'block';
            fcf.style['display'] = 'block';

            fc.style['-webkit-backface-visibility'] = 'hidden';
            fcf.style['-webkit-backface-visibility'] = 'hidden';

            // copy selected node.
            copyChildNodes(node, fcf);

            if (!isCSSTransitionsEnabled) {
                // La madre que pario a ff 3.5+
                var jnode = $("#" + nodeName);
                $("#flip_content_front").css({
                    "width": jnode.width() + "px",
                    "height": jnode.height() + "px"
                });
            }
            else {
                fcf.setAttribute("class", node.getAttribute("class"));
            }

            setup(nodeName, "flip_wrapper_front", "flip_content_front", 0, 1, 1, 1);

            var sx = $("#flip_wrapper").width() / $("#flip_wrapper_front").width();
            var sy = $("#flip_wrapper").height() / $("#flip_wrapper_front").height();

            prevSX = sx;
            prevSY = sy;

            setup(nodeName, "flip_wrapper", "flip_content", 180, 1 / sx, 1 / sy, 0);


            var toff = $("#flip_wrapper").offset();
            var ty = ( $(window).height() - $("#flip_wrapper").height() ) / 2 +
                    $(window).scrollTop() -
                    toff.top +
                    "px";
            var tx = ( $(window).width() - $("#flip_wrapper").width() ) / 2 -
                    toff.left +
                    $(window).scrollLeft() + "px";

            var toffFront = $("#flip_wrapper_front").offset();
            var txf = ( $(window).width() - $("#flip_wrapper_front").width() ) / 2 -
                    (toffFront.left ) +
                    $(window).scrollLeft() + "px";
            var tyf = ( $(window).height() - $("#flip_wrapper_front").height() ) / 2 +
                    $(window).scrollTop() -
                    toffFront.top +
                    "px";

            if (isCSSTransitionsEnabled) {
                /**
                 * if executed sequentially with previous code, animation won't run.
                 */
                setTimeout(function() {

                    fc.style["-webkit-transition"] = "-webkit-transform " + time + "ms ease, opacity " + time + "ms linear";
                    fc.style["-webkit-transform"] = "translateX(" + tx + ") translateY(" + ty + ") " +
                            (isCSS3DEnabled ? "rotateY(360deg)" : "") +
                            " scaleX(1) scaleY(1)";

                    fc.style.MozTransition = "-moz-transform " + time + "ms ease-in-out";
                    fc.style.MozTransitionProperty = "all"
                    fc.style.MozTransform = "translate(" + tx + "," + ty + ") scaleX(1) scaleY(1)";

                    fc.style.OTransition = "-o-transform " + time + "ms ease-in-out";
                    fc.style.OTransitionProperty = "-o-transform, opacity"
                    fc.style.OTransform = "translate(" + tx + "," + ty + ") scaleX(1) scaleY(1)";

                    fc.style.msTransition = "-ms-transform " + time + "ms ease-in-out";
                    fc.style.msTransitionProperty = "all"
                    fc.style.msTransform = "translate(" + tx + "," + ty + ") scaleX(1) scaleY(1)";

                    fc.style["opacity"] = 1;


                    fcf.style["-webkit-transition"] = "-webkit-transform " + time + "ms ease, opacity " + time + "ms linear";
                    fcf.style["-webkit-transform"] =
                            "translate(" + txf + "," + tyf + ") " +
                                    (isCSS3DEnabled ? "rotateY(180deg)" : "") +
                                    " scaleX(" + sx + ") scaleY(" + sy + ")";

                    fcf.style.MozTransition = "-moz-transform " + time + "ms ease-in-out";
                    fcf.style.MozTransitionProperty = "all"
                    fcf.style.MozTransform = "translateX(" + txf + ") translateY(" + tyf + ") scaleX(" + sx + ") scaleY(" + sy + ")";

                    fcf.style.OTransition = "-o-transform " + time + "ms ease-in-out";
                    fcf.style.OTransitionProperty = "-o-transform, opacity"
                    fcf.style.OTransform = "translateX(" + txf + ") translateY(" + tyf + ") scaleX(" + sx + ") scaleY(" + sy + ")";

                    fcf.style.msTransition = "-ms-transform " + time + "ms ease-in-out";
                    fcf.style.msTransitionProperty = "all"
                    fcf.style.msTransform = "translateX(" + txf + ") translateY(" + tyf + ") scaleX(" + sx + ") scaleY(" + sy + ")";

                    fcf.style["opacity"] = 0;
                }, 50);
            } else {
                setTimeout(function() {
                    var _fw = $("#flip_content");
                    var _fwf = $("#flip_content_front");

                    var scale = Math.min(sx, sy);
                    _fwf.animate({
                        'left': txf,
                        'top':  tyf,
                        'opacity':  0,
                        'scale': scale
                    }, time);

                    _fw.animate({
                        'left': tx,
                        'top':  ty,
                        'opacity': 1,
                        'scale': 1
                    }, time);
                }, 50);
            }

            // hide front div. firefox routes input to opacity=0 elements.
            setTimeout(function() {
                fcf.style['display'] = 'none';
            }, time + 50);


            document.body.style.overflow = 'hidden';
            document.getElementById('curtain').style.display = 'block';
        }
    }

    Flip.unflip = function () {

        var fc = document.getElementById('flip_content');
        var fcf = document.getElementById('flip_content_front');

        fc.style['display'] = 'block';
        fcf.style['display'] = 'block';


        if (isCSSTransitionsEnabled) {
            setTimeout(function() {
                fc.style.opacity = 0;
                fc.style["-webkit-transform"] =
                        (isCSS3DEnabled ? "rotateY(180deg)" : "") +
                                " scaleX(" + 1 / prevSX + ") scaleY(" + 1 / prevSY + ")";
                fcf.style.opacity = 1;
                fcf.style["-webkit-transform"] = (isCSS3DEnabled ? "rotateY(0deg)" : "");

                fc.style.MozTransform = "scaleX(" + 1 / prevSX + ") scaleY(" + 1 / prevSY + ")";
                fcf.style.MozTransform = "scaleX(1) scaleY(1)";

                fc.style.OTransform = "scaleX(" + 1 / prevSX + ") scaleY(" + 1 / prevSY + ")";
                fcf.style.OTransform = "scaleX(1) scaleY(1)";

                fc.style.msTransform = "scaleX(" + 1 / prevSX + ") scaleY(" + 1 / prevSY + ")";
                fcf.style.msTransform = "scaleX(1) scaleY(1)";
            }, 50);
        } else {
            setTimeout(function() {

                var fcf = $("#flip_content_front");
                var fc = $("#flip_content");

                fcf.css({
                    'opacity': 0,
                    'scale': 1
                });
                fcf.animate({
                    'left' : '0px',
                    'top' : '0px',
                    'opacity': 1,
                    'scale': 1
                }, time);

                var scale = 1 / Math.min(prevSX, prevSY);
                fc.css({
                    'opacity': 1,
                    'scale': scale
                });
                fc.animate({
                    'left' : '0px',
                    'top' : '0px',
                    'opacity': 0,
                    'scale': scale
                }, time);

            }, 50);
        }

        setTimeout(function() {
            fc.style['display'] = 'none';
            fcf.style['display'] = 'none';
            document.body.style.overflow = 'auto';
        }, time + 50);

        document.getElementById('curtain').style.display = 'none';

    }

    function setup(node, fw, fc, angle, sx, sy, opacity) {

        node = $("#" + node);
        var pos = node.offset();
        var width = node.innerWidth();
        var height = node.innerHeight();

        fw = $("#" + fw);
        var width2 = fw.innerWidth();
        var height2 = fw.innerHeight();

        var x,y;
        x = pos.left + (width - width2) / 2;
        y = pos.top + (height - height2) / 2;

        if (isCSSTransitionsEnabled) {
            //show the menu directly over the placeholder
            fc = document.getElementById(fc);

            fc.style["-webkit-transition"] = "all 0s ease";
            fc.style["-webkit-transform"] =
                    (isCSS3DEnabled ? "rotateY(" + angle + "deg)" : "") +
                            " scaleX(" + sx + ") scaleY(" + sy + ")";

            fc.style.MozTransition = "all 0s ease";
            fc.style.MozTransform = "scaleX(" + sx + ") scaleY(" + sy + ")";

            fc.style.OTransition = "all 0s ease";
            fc.style.OTransform = "scaleX(" + sx + ") scaleY(" + sy + ")";

            fc.style.msTransition = "all 0s ease";
            fc.style.msTransform = "scaleX(" + sx + ") scaleY(" + sy + ")";

            fc.style["opacity"] = opacity;

        } else {
            fc = $("#" + fc);
            var scale = Math.min(sx, sy);
            fc.css({
                "left" : "0px",
                "top"  : "0px",
                'scale': scale,
                'opacity': opacity
            });

            // seems redundant but ff<4 is totally crappy, and at first animation won't perform
            // scale unless doing this.
            fc.animate({
                'scale': scale,
                'opacity': opacity
            },0);
        }

        fw.css({
            "left":     x + "px",
            "top":      y + "px",
            "display":"block"
        });
    }
})();