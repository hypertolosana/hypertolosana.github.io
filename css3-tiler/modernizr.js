/**
 * This code has been taken and freely interpreted from the modernizer project:
 *
 */

/*!
 * Modernizr v2.0.4
 * http://www.modernizr.com
 *
 * Copyright (c) 2009-2011 Faruk Ates, Paul Irish, Alex Sexton
 * Dual-licensed under the BSD or MIT licenses: www.modernizr.com/license/
 */

var Modernizr = {};
(function() {

    Modernizr.CSS3Check = function() {
        this.docElement = document.documentElement;
        this.docHead = document.head || document.getElementsByTagName('head')[0];
        this.mod = 'modernizr';
        this.modElem = document.createElement(this.mod);
        this.m_style = this.modElem.style;
        this.prefixes = ' -webkit- -moz- -o- -ms- -khtml- '.split(' ');
        this.domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');

        return this;
    }

    Modernizr.CSS3Check.prototype = {

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