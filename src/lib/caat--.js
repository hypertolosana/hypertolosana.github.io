alert('aa');
 /*


 The MIT License
 Copyright (c) 2010 Ibon Tolosana, Hyperandroid || http://hyperandroid.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

*/
var CAAT = CAAT || {};
CAAT.DEBUG = !0;
CAAT.log = function() {
    window.console && window.console.log(Array.prototype.slice.call(arguments))
};
(function() {
    CAAT.Behavior = function() {
        this.lifecycleListenerList = [];
        this.setDefaultInterpolator();
        return this
    };
    CAAT.Behavior.prototype = {lifecycleListenerList: null,behaviorStartTime: -1,behaviorDuration: -1,cycleBehavior: !1,expired: !0,interpolator: null,actor: null,id: 0,setId: function(a) {
            this.id = a;
            return this
        },setDefaultInterpolator: function() {
            this.interpolator = (new CAAT.Interpolator).createLinearInterpolator(!1);
            return this
        },setPingPong: function() {
            this.interpolator = (new CAAT.Interpolator).createLinearInterpolator(!0);
            return this
        },setFrameTime: function(a, b) {
            this.behaviorStartTime = a;
            this.behaviorDuration = b;
            this.expired = !1;
            return this
        },setInterpolator: function(a) {
            this.interpolator = a;
            return this
        },apply: function(a, b) {
            var c = a;
            this.isBehaviorInTime(a, b) && (a = this.normalizeTime(a), this.fireBehaviorAppliedEvent(b, c, a, this.setForTime(a, b)))
        },setCycle: function(a) {
            this.cycleBehavior = a;
            return this
        },addListener: function(a) {
            this.lifecycleListenerList.push(a);
            return this
        },getStartTime: function() {
            return this.behaviorStartTime
        },
        getDuration: function() {
            return this.behaviorDuration
        },isBehaviorInTime: function(a, b) {
            if (this.expired)
                return !1;
            this.cycleBehavior && a > this.behaviorStartTime && (a = (a - this.behaviorStartTime) % this.behaviorDuration + this.behaviorStartTime);
            if (a > this.behaviorStartTime + this.behaviorDuration)
                return this.expired || this.setExpired(b, a), !1;
            return this.behaviorStartTime <= a && a < this.behaviorStartTime + this.behaviorDuration
        },fireBehaviorExpiredEvent: function(a, b) {
            for (var c = 0; c < this.lifecycleListenerList.length; c++)
                this.lifecycleListenerList[c].behaviorExpired(this,
                b, a)
        },fireBehaviorAppliedEvent: function(a, b, c, d) {
            for (var e = 0; e < this.lifecycleListenerList.length; e++)
                this.lifecycleListenerList[e].behaviorApplied && this.lifecycleListenerList[e].behaviorApplied(this, b, c, a, d)
        },normalizeTime: function(a) {
            a -= this.behaviorStartTime;
            this.cycleBehavior && (a %= this.behaviorDuration);
            return this.interpolator.getPosition(a / this.behaviorDuration).y
        },setExpired: function(a, b) {
            this.expired = !0;
            this.setForTime(this.interpolator.getPosition(1).y, a);
            this.fireBehaviorExpiredEvent(a, b)
        },
        setForTime: function() {
        },initialize: function(a) {
            if (a)
                for (var b in a)
                    this[b] = a[b];
            return this
        }}
})();
(function() {
    CAAT.ContainerBehavior = function() {
        CAAT.ContainerBehavior.superclass.constructor.call(this);
        this.behaviors = [];
        return this
    };
    CAAT.ContainerBehavior.prototype = {behaviors: null,addBehavior: function(a) {
            this.behaviors.push(a);
            a.addListener(this);
            return this
        },apply: function(a, b) {
            if (this.isBehaviorInTime(a, b)) {
                a -= this.getStartTime();
                this.cycleBehavior && (a %= this.getDuration());
                for (var c = 0; c < this.behaviors.length; c++)
                    this.behaviors[c].apply(a, b)
            }
        },setInterpolator: function() {
            return this
        },behaviorExpired: function(a) {
            if (this.cycleBehavior)
                a.expired =
                !1
        },setForTime: function(a, b) {
            for (var c = 0; c < this.behaviors.length; c++)
                this.behaviors[c].setForTime(a, b);
            return null
        }};
    extend(CAAT.ContainerBehavior, CAAT.Behavior, null)
})();
(function() {
    CAAT.RotateBehavior = function() {
        CAAT.RotateBehavior.superclass.constructor.call(this);
        this.anchor = CAAT.Actor.prototype.ANCHOR_CENTER;
        return this
    };
    CAAT.RotateBehavior.prototype = {startAngle: 0,endAngle: 0,anchor: 0,rx: 0,ry: 0,setForTime: function(a, b) {
            var c = this.startAngle + a * (this.endAngle - this.startAngle);
            if (this.anchor == CAAT.Actor.prototype.ANCHOR_CUSTOM)
                b.setRotationAnchored(c, this.rx, this.ry);
            else {
                var d = b.getAnchor(this.anchor);
                b.setRotationAnchored(c, d.x, d.y)
            }
            return c
        },setValues: function(a,
        b) {
            this.startAngle = a;
            this.endAngle = b;
            return this
        },setAngles: function(a, b) {
            return this.setValues(a, b)
        },setAnchor: function(a, b, c) {
            this.anchor = a;
            if (a == CAAT.Actor.prototype.ANCHOR_CUSTOM)
                this.rx = b, this.ry = c;
            return this
        }};
    extend(CAAT.RotateBehavior, CAAT.Behavior, null)
})();
(function() {
    CAAT.GenericBehavior = function() {
        CAAT.GenericBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.GenericBehavior.prototype = {start: 0,end: 0,target: null,property: null,callback: null,setForTime: function(a, b) {
            var c = this.start + a * (this.end - this.start);
            this.callback && this.callback(c, this.target, b);
            this.property && (this.target[this.property] = c)
        },setValues: function(a, b, c, d, e) {
            this.start = a;
            this.end = b;
            this.target = c;
            this.property = d;
            this.callback = e;
            return this
        }};
    extend(CAAT.GenericBehavior, CAAT.Behavior,
    null)
})();
(function() {
    CAAT.ScaleBehavior = function() {
        CAAT.ScaleBehavior.superclass.constructor.call(this);
        this.anchor = CAAT.Actor.prototype.ANCHOR_CENTER;
        return this
    };
    CAAT.ScaleBehavior.prototype = {startScaleX: 0,endScaleX: 0,startScaleY: 0,endScaleY: 0,anchor: 0,setForTime: function(a, b) {
            var c = this.startScaleX + a * (this.endScaleX - this.startScaleX), d = this.startScaleY + a * (this.endScaleY - this.startScaleY);
            0 == c && (c = 0.01);
            0 == d && (d = 0.01);
            b.setScaleAnchored(c, d, this.anchor);
            return {scaleX: c,scaleY: d}
        },setValues: function(a, b,
        c, d) {
            this.startScaleX = a;
            this.endScaleX = b;
            this.startScaleY = c;
            this.endScaleY = d;
            return this
        },setAnchor: function(a) {
            this.anchor = a;
            return this
        }};
    extend(CAAT.ScaleBehavior, CAAT.Behavior, null)
})();
(function() {
    CAAT.AlphaBehavior = function() {
        CAAT.AlphaBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.AlphaBehavior.prototype = {startAlpha: 0,endAlpha: 0,setForTime: function(a, b) {
            var c = this.startAlpha + a * (this.endAlpha - this.startAlpha);
            b.setAlpha(c);
            return c
        },setValues: function(a, b) {
            this.startAlpha = a;
            this.endAlpha = b;
            return this
        }};
    extend(CAAT.AlphaBehavior, CAAT.Behavior, null)
})();
(function() {
    CAAT.PathBehavior = function() {
        CAAT.PathBehavior.superclass.constructor.call(this);
        return this
    };
    CAAT.PathBehavior.prototype = {path: null,autoRotate: !1,prevX: -1,prevY: -1,translateX: 0,translateY: 0,setAutoRotate: function(a) {
            this.autoRotate = a;
            return this
        },setPath: function(a) {
            this.path = a;
            return this
        },setFrameTime: function(a, b) {
            CAAT.PathBehavior.superclass.setFrameTime.call(this, a, b);
            this.prevY = this.prevX = -1;
            return this
        },setTranslation: function(a, b) {
            this.translateX = a;
            this.translateY = b;
            return this
        },
        setForTime: function(a, b) {
            var c = this.path.getPosition(a);
            if (this.autoRotate) {
                if (-1 == this.prevX && -1 == this.prevY)
                    this.prevX = c.x, this.prevY = c.y;
                var d = c.x - this.prevX, e = c.y - this.prevY;
                if (d == 0 && e == 0)
                    return {x: d,y: e};
                d = Math.atan2(e, d);
                this.prevX <= c.x ? b.transformation = CAAT.SpriteActor.prototype.TR_NONE : (b.transformation = CAAT.SpriteActor.prototype.TR_FLIP_HORIZONTAL, d += Math.PI);
                b.setRotation(d);
                this.prevX = c.x;
                this.prevY = c.y
            }
            b.setLocation(c.x - this.translateX, c.y - this.translateY);
            return {x: b.x,y: b.y}
        },positionOnTime: function(a) {
            if (this.isBehaviorInTime(a,
            null))
                return a = this.normalizeTime(a), this.path.getPosition(a);
            return {x: -1,y: -1}
        }};
    extend(CAAT.PathBehavior, CAAT.Behavior, null)
})();
(function() {
    CAAT.BrowserDetect = function() {
        this.init();
        return this
    };
    CAAT.BrowserDetect.prototype = {browser: "",version: 0,OS: "",init: function() {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS"
        },searchString: function(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b].string, d = a[b].prop;
                this.versionSearchString = a[b].versionSearch ||
                a[b].identity;
                if (c) {
                    if (c.indexOf(a[b].subString) != -1)
                        return a[b].identity
                } else if (d)
                    return a[b].identity
            }
        },searchVersion: function(a) {
            var b = a.indexOf(this.versionSearchString);
            if (b != -1)
                return parseFloat(a.substring(b + this.versionSearchString.length + 1))
        },dataBrowser: [{string: navigator.userAgent,subString: "Chrome",identity: "Chrome"}, {string: navigator.userAgent,subString: "OmniWeb",versionSearch: "OmniWeb/",identity: "OmniWeb"}, {string: navigator.vendor,subString: "Apple",identity: "Safari",versionSearch: "Version"},
            {prop: window.opera,identity: "Opera"}, {string: navigator.vendor,subString: "iCab",identity: "iCab"}, {string: navigator.vendor,subString: "KDE",identity: "Konqueror"}, {string: navigator.userAgent,subString: "Firefox",identity: "Firefox"}, {string: navigator.vendor,subString: "Camino",identity: "Camino"}, {string: navigator.userAgent,subString: "Netscape",identity: "Netscape"}, {string: navigator.userAgent,subString: "MSIE",identity: "Explorer",versionSearch: "MSIE"}, {string: navigator.userAgent,subString: "Explorer",identity: "Explorer",
                versionSearch: "Explorer"}, {string: navigator.userAgent,subString: "Gecko",identity: "Mozilla",versionSearch: "rv"}, {string: navigator.userAgent,subString: "Mozilla",identity: "Netscape",versionSearch: "Mozilla"}],dataOS: [{string: navigator.platform,subString: "Win",identity: "Windows"}, {string: navigator.platform,subString: "Mac",identity: "Mac"}, {string: navigator.userAgent,subString: "iPhone",identity: "iPhone/iPod"}, {string: navigator.platform,subString: "Linux",identity: "Linux"}]}
})();
function extend(a, b, c) {
    var d = function() {
    }, e;
    if (c) {
        d.prototype = b.prototype;
        a.prototype = new d;
        a.prototype.constructor = a;
        a.superclass = b.prototype;
        if (b.prototype.constructor == Object.prototype.constructor)
            b.prototype.constructor = b;
        for (e in c)
            c.hasOwnProperty(e) && (a.prototype[e] = c[e])
    } else {
        a.prototype.constructor = a;
        a.superclass = b.prototype;
        if (b.prototype.constructor == Object.prototype.constructor)
            b.prototype.constructor = b;
        for (e in b.prototype)
            !1 == a.prototype.hasOwnProperty(e) && (a.prototype[e] = b.prototype[e])
    }
}
;
(function() {
    CAAT.Matrix3 = function() {
        this.matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
        this.fmatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        return this
    };
    CAAT.Matrix3.prototype = {matrix: null,fmatrix: null,transformCoord: function(a) {
            var b = a.x, c = a.y, d = a.z;
            a.x = b * this.matrix[0][0] + c * this.matrix[0][1] + d * this.matrix[0][2] + this.matrix[0][3];
            a.y = b * this.matrix[1][0] + c * this.matrix[1][1] + d * this.matrix[1][2] + this.matrix[1][3];
            a.z = b * this.matrix[2][0] + c * this.matrix[2][1] + d * this.matrix[2][2] + this.matrix[2][3];
            return a
        },
        initialize: function(a, b, c, d, e, f, h, g, i) {
            this.identity();
            this.matrix[0][0] = a;
            this.matrix[0][1] = b;
            this.matrix[0][2] = c;
            this.matrix[1][0] = d;
            this.matrix[1][1] = e;
            this.matrix[1][2] = f;
            this.matrix[2][0] = h;
            this.matrix[2][1] = g;
            this.matrix[2][2] = i;
            return this
        },initWithMatrix: function(a) {
            this.matrix = a;
            return this
        },flatten: function() {
            var a = this.fmatrix, b = this.matrix;
            a[0] = b[0][0];
            a[1] = b[1][0];
            a[2] = b[2][0];
            a[3] = b[3][0];
            a[4] = b[0][1];
            a[5] = b[1][1];
            a[6] = b[2][1];
            a[7] = b[2][1];
            a[8] = b[0][2];
            a[9] = b[1][2];
            a[10] = b[2][2];
            a[11] =
            b[3][2];
            a[12] = b[0][3];
            a[13] = b[1][3];
            a[14] = b[2][3];
            a[15] = b[3][3];
            return this.fmatrix
        },identity: function() {
            for (var a = 0; a < 4; a++)
                for (var b = 0; b < 4; b++)
                    this.matrix[a][b] = a == b ? 1 : 0;
            return this
        },getMatrix: function() {
            return this.matrix
        },rotateXY: function(a) {
            return this.rotate(a, 0, 0)
        },rotateXZ: function(a) {
            return this.rotate(0, a, 0)
        },rotateYZ: function(a) {
            return this.rotate(0, 0, a)
        },setRotate: function(a, b, c) {
            this.copy(this.rotate(a, b, c));
            return this
        },rotate: function(a, b, c) {
            var d = new CAAT.Matrix3, e, f;
            a != 0 && (f = new CAAT.Matrix3,
            e = Math.sin(a), a = Math.cos(a), f.matrix[1][1] = a, f.matrix[1][2] = -e, f.matrix[2][1] = e, f.matrix[2][2] = a, d.multiply(f));
            b != 0 && (f = new CAAT.Matrix3, e = Math.sin(b), a = Math.cos(b), f.matrix[0][0] = a, f.matrix[0][2] = -e, f.matrix[2][0] = e, f.matrix[2][2] = a, d.multiply(f));
            c != 0 && (f = new CAAT.Matrix3, e = Math.sin(c), a = Math.cos(c), f.matrix[0][0] = a, f.matrix[0][1] = -e, f.matrix[1][0] = e, f.matrix[1][1] = a, d.multiply(f));
            return d
        },getClone: function() {
            var a = new CAAT.Matrix3;
            a.copy(this);
            return a
        },multiply: function(a) {
            var b = this.getClone().matrix,
            c = b[0][0], d = b[0][1], e = b[0][2], f = b[0][3], h = b[1][0], g = b[1][1], i = b[1][2], l = b[1][3], k = b[2][0], m = b[2][1], n = b[2][2];
            b = b[2][3];
            var j = a.matrix;
            a = j[0][0];
            var o = j[0][1], p = j[0][2], q = j[0][3], r = j[1][0], s = j[1][1], t = j[1][2], u = j[1][3], v = j[2][0], w = j[2][1], x = j[2][2], y = j[2][3], z = j[3][0], A = j[3][1], B = j[3][2];
            j = j[3][3];
            this.matrix[0][0] = c * a + d * r + e * v + f * z;
            this.matrix[0][1] = c * o + d * s + e * w + f * A;
            this.matrix[0][2] = c * p + d * t + e * x + f * B;
            this.matrix[0][3] = c * q + d * u + e * y + f * j;
            this.matrix[1][0] = h * a + g * r + i * v + l * z;
            this.matrix[1][1] = h * o + g * s + i * w + l *
            A;
            this.matrix[1][2] = h * p + g * t + i * x + l * B;
            this.matrix[1][3] = h * q + g * u + i * y + l * j;
            this.matrix[2][0] = k * a + m * r + n * v + b * z;
            this.matrix[2][1] = k * o + m * s + n * w + b * A;
            this.matrix[2][2] = k * p + m * t + n * x + b * B;
            this.matrix[2][3] = k * q + m * u + n * y + b * j;
            return this
        },premultiply: function(a) {
            var b = this.getClone().matrix, c = b[0][0], d = b[0][1], e = b[0][2], f = b[0][3], h = b[1][0], g = b[1][1], i = b[1][2], l = b[1][3], k = b[2][0], m = b[2][1], n = b[2][2];
            b = b[2][3];
            var j = a.matrix;
            a = j[0][0];
            var o = j[0][1], p = j[0][2], q = j[0][3], r = j[1][0], s = j[1][1], t = j[1][2], u = j[1][3], v = j[2][0],
            w = j[2][1], x = j[2][2];
            j = j[2][3];
            this.matrix[0][0] = c * a + d * r + e * v;
            this.matrix[0][1] = c * o + d * s + e * w;
            this.matrix[0][2] = c * p + d * t + e * x;
            this.matrix[0][3] = c * q + d * u + e * j + f;
            this.matrix[1][0] = h * a + g * r + i * v;
            this.matrix[1][1] = h * o + g * s + i * w;
            this.matrix[1][2] = h * p + g * t + i * x;
            this.matrix[1][3] = h * q + g * u + i * j + l;
            this.matrix[2][0] = k * a + m * r + n * v;
            this.matrix[2][1] = k * o + m * s + n * w;
            this.matrix[2][2] = k * p + m * t + n * x;
            this.matrix[2][3] = k * q + m * u + n * j + b;
            return this
        },setTranslate: function(a, b, c) {
            this.identity();
            this.matrix[0][3] = a;
            this.matrix[1][3] = b;
            this.matrix[2][3] =
            c;
            return this
        },translate: function(a, b, c) {
            var d = new CAAT.Matrix3;
            d.setTranslate(a, b, c);
            return d
        },setScale: function(a, b, c) {
            this.identity();
            this.matrix[0][0] = a;
            this.matrix[1][1] = b;
            this.matrix[2][2] = c;
            return this
        },scale: function(a, b, c) {
            var d = new CAAT.Matrix3;
            d.setScale(a, b, c);
            return d
        },rotateModelView: function(a, b, c) {
            var d = Math.sin(a), e = Math.sin(b), f = Math.sin(c);
            a = Math.cos(a);
            b = Math.cos(b);
            c = Math.cos(c);
            this.matrix[0][0] = b * a;
            this.matrix[0][1] = -b * d;
            this.matrix[0][2] = e;
            this.matrix[0][3] = 0;
            this.matrix[1][0] =
            f * e * a + d * c;
            this.matrix[1][1] = c * a - f * e * d;
            this.matrix[1][2] = -f * b;
            this.matrix[1][3] = 0;
            this.matrix[2][0] = f * d - c * e * a;
            this.matrix[2][1] = c * e * d + f * a;
            this.matrix[2][2] = c * b;
            this.matrix[2][3] = 0;
            this.matrix[3][0] = 0;
            this.matrix[3][1] = 0;
            this.matrix[3][2] = 0;
            this.matrix[3][3] = 1;
            return this
        },copy: function(a) {
            for (var b = 0; b < 4; b++)
                for (var c = 0; c < 4; c++)
                    this.matrix[b][c] = a.matrix[b][c];
            return this
        },calculateDeterminant: function() {
            var a = this.matrix, b = a[0][0], c = a[0][1], d = a[0][2], e = a[0][3], f = a[1][0], h = a[1][1], g = a[1][2], i = a[1][3],
            l = a[2][0], k = a[2][1], m = a[2][2], n = a[2][3], j = a[3][0], o = a[3][1], p = a[3][2];
            a = a[3][3];
            return e * h * m * j + c * i * m * j + e * g * l * o + d * i * l * o + d * f * n * o + b * g * n * o + e * f * k * p + b * i * k * p + d * h * l * a + c * g * l * a + c * f * m * a + b * h * m * a + e * g * k * j - d * i * k * j - d * h * n * j - c * g * n * j - e * f * m * o - b * i * m * o - e * h * l * p - c * i * l * p - c * f * n * p - b * h * n * p - d * f * k * a - b * g * k * a
        },getInverse: function() {
            var a = this.matrix, b = a[0][0], c = a[0][1], d = a[0][2], e = a[0][3], f = a[1][0], h = a[1][1], g = a[1][2], i = a[1][3], l = a[2][0], k = a[2][1], m = a[2][2], n = a[2][3], j = a[3][0], o = a[3][1], p = a[3][2];
            a = a[3][3];
            var q = new CAAT.Matrix3;
            q.matrix[0][0] = g * n * o + i * k * p + h * m * a - i * m * o - h * n * p - g * k * a;
            q.matrix[0][1] = e * m * o + c * n * p + d * k * a - c * m * a - d * n * o - e * k * p;
            q.matrix[0][2] = d * i * o + c * g * a + e * h * p - c * i * p - d * h * a - e * g * o;
            q.matrix[0][3] = e * g * k + c * i * m + d * h * n - d * i * k - e * h * m - c * g * n;
            q.matrix[1][0] = i * m * j + f * n * p + g * l * a - g * n * j - i * l * p - f * m * a;
            q.matrix[1][1] = d * n * j + e * l * p + b * m * a - e * m * j - b * n * p - d * l * a;
            q.matrix[1][2] = e * g * j + b * i * p + d * f * a - d * i * j - e * f * p - b * g * a;
            q.matrix[1][3] = d * i * l + e * f * m + b * g * n - e * g * l - b * i * m - d * f * n;
            q.matrix[2][0] = h * n * j + i * l * o + f * k * a - i * k * j - f * n * o - h * l * a;
            q.matrix[2][1] = e * k * j + b * n * o + c * l * a - b * k * a - c * n *
            j - e * l * o;
            q.matrix[2][2] = d * i * j + e * f * o + b * h * a - e * h * j - b * i * o - c * f * a;
            q.matrix[2][3] = e * h * l + b * i * k + c * f * n - b * h * n - c * i * l - e * f * k;
            q.matrix[3][0] = g * k * j + f * m * o + h * l * p - h * m * j - g * l * o - f * k * p;
            q.matrix[3][1] = c * m * j + d * l * o + b * k * p - d * k * j - b * m * o - c * l * p;
            q.matrix[3][2] = d * h * j + b * g * o + c * f * p - b * h * p - c * g * j - d * f * o;
            q.matrix[3][3] = c * g * l + d * f * k + b * h * m - d * h * l - b * g * k - c * f * m;
            return q.multiplyScalar(1 / this.calculateDeterminant())
        },multiplyScalar: function(a) {
            var b, c;
            for (b = 0; b < 4; b++)
                for (c = 0; c < 4; c++)
                    this.matrix[b][c] *= a;
            return this
        }}
})();
(function() {
    CAAT.Matrix = function() {
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        return this
    };
    CAAT.Matrix.prototype = {matrix: null,transformCoord: function(a) {
            var b = a.x, c = a.y;
            a.x = b * this.matrix[0] + c * this.matrix[1] + this.matrix[2];
            a.y = b * this.matrix[3] + c * this.matrix[4] + this.matrix[5];
            return a
        },rotate: function(a) {
            var b = new CAAT.Matrix;
            b.setRotation(a);
            return b
        },setRotation: function(a) {
            this.identity();
            this.matrix[0] = Math.cos(a);
            this.matrix[1] = -Math.sin(a);
            this.matrix[3] = Math.sin(a);
            this.matrix[4] = Math.cos(a);
            return this
        },
        scale: function(a, b) {
            var c = new CAAT.Matrix;
            c.matrix[0] = a;
            c.matrix[4] = b;
            return c
        },setScale: function(a, b) {
            this.identity();
            this.matrix[0] = a;
            this.matrix[4] = b;
            return this
        },translate: function(a, b) {
            var c = new CAAT.Matrix;
            c.matrix[2] = a;
            c.matrix[5] = b;
            return c
        },setTranslate: function(a, b) {
            this.identity();
            this.matrix[2] = a;
            this.matrix[5] = b;
            return this
        },copy: function(a) {
            a = a.matrix;
            var b = this.matrix;
            b[0] = a[0];
            b[1] = a[1];
            b[2] = a[2];
            b[3] = a[3];
            b[4] = a[4];
            b[5] = a[5];
            b[6] = a[6];
            b[7] = a[7];
            b[8] = a[8];
            return this
        },identity: function() {
            var a =
            this.matrix;
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 1;
            a[5] = 0;
            a[6] = 0;
            a[7] = 0;
            a[8] = 1;
            return this
        },multiply: function(a) {
            var b = this.matrix[0] * a.matrix[1] + this.matrix[1] * a.matrix[4] + this.matrix[2] * a.matrix[7], c = this.matrix[0] * a.matrix[2] + this.matrix[1] * a.matrix[5] + this.matrix[2] * a.matrix[8], d = this.matrix[3] * a.matrix[0] + this.matrix[4] * a.matrix[3] + this.matrix[5] * a.matrix[6], e = this.matrix[3] * a.matrix[1] + this.matrix[4] * a.matrix[4] + this.matrix[5] * a.matrix[7], f = this.matrix[3] * a.matrix[2] + this.matrix[4] * a.matrix[5] +
            this.matrix[5] * a.matrix[8], h = this.matrix[6] * a.matrix[0] + this.matrix[7] * a.matrix[3] + this.matrix[8] * a.matrix[6], g = this.matrix[6] * a.matrix[1] + this.matrix[7] * a.matrix[4] + this.matrix[8] * a.matrix[7], i = this.matrix[6] * a.matrix[2] + this.matrix[7] * a.matrix[5] + this.matrix[8] * a.matrix[8];
            this.matrix[0] = this.matrix[0] * a.matrix[0] + this.matrix[1] * a.matrix[3] + this.matrix[2] * a.matrix[6];
            this.matrix[1] = b;
            this.matrix[2] = c;
            this.matrix[3] = d;
            this.matrix[4] = e;
            this.matrix[5] = f;
            this.matrix[6] = h;
            this.matrix[7] = g;
            this.matrix[8] =
            i;
            return this
        },premultiply: function(a) {
            var b = a.matrix[0] * this.matrix[1] + a.matrix[1] * this.matrix[4] + a.matrix[2] * this.matrix[7], c = a.matrix[0] * this.matrix[2] + a.matrix[1] * this.matrix[5] + a.matrix[2] * this.matrix[8], d = a.matrix[3] * this.matrix[0] + a.matrix[4] * this.matrix[3] + a.matrix[5] * this.matrix[6], e = a.matrix[3] * this.matrix[1] + a.matrix[4] * this.matrix[4] + a.matrix[5] * this.matrix[7], f = a.matrix[3] * this.matrix[2] + a.matrix[4] * this.matrix[5] + a.matrix[5] * this.matrix[8], h = a.matrix[6] * this.matrix[0] + a.matrix[7] * this.matrix[3] +
            a.matrix[8] * this.matrix[6], g = a.matrix[6] * this.matrix[1] + a.matrix[7] * this.matrix[4] + a.matrix[8] * this.matrix[7], i = a.matrix[6] * this.matrix[2] + a.matrix[7] * this.matrix[5] + a.matrix[8] * this.matrix[8];
            this.matrix[0] = a.matrix[0] * this.matrix[0] + a.matrix[1] * this.matrix[3] + a.matrix[2] * this.matrix[6];
            this.matrix[1] = b;
            this.matrix[2] = c;
            this.matrix[3] = d;
            this.matrix[4] = e;
            this.matrix[5] = f;
            this.matrix[6] = h;
            this.matrix[7] = g;
            this.matrix[8] = i;
            return this
        },getInverse: function() {
            var a = this.matrix[0], b = this.matrix[1], c = this.matrix[2],
            d = this.matrix[3], e = this.matrix[4], f = this.matrix[5], h = this.matrix[6], g = this.matrix[7], i = this.matrix[8], l = new CAAT.Matrix, k = a * (e * i - g * f) - d * (b * i - g * c) + h * (b * f - e * c);
            if (k == 0)
                return null;
            var m = l.matrix;
            m[0] = e * i - f * g;
            m[1] = c * g - b * i;
            m[2] = b * f - c * e;
            m[3] = f * h - d * i;
            m[4] = a * i - c * h;
            m[5] = c * d - a * f;
            m[6] = d * g - e * h;
            m[7] = b * h - a * g;
            m[8] = a * e - b * d;
            l.multiplyScalar(1 / k);
            return l
        },multiplyScalar: function(a) {
            var b;
            for (b = 0; b < 9; b++)
                this.matrix[b] *= a;
            return this
        },transformRenderingContext: function(a) {
            var b = this.matrix;
            a.setTransform(b[0], b[3],
            b[1], b[4], b[2], b[5]);
            return this
        }}
})();
(function() {
    CAAT.MatrixStack = function() {
        this.stack = [];
        this.saved = [];
        return this
    };
    CAAT.MatrixStack.prototype = {stack: null,saved: null,pushMatrix: function(a) {
            this.stack.push(a);
            return this
        },popMatrix: function() {
            return this.stack.pop()
        },save: function() {
            this.saved.push(this.stack.length);
            return this
        },restore: function() {
            for (var a = this.saved.pop(); this.stack.length != a; )
                this.popMatrix();
            return this
        },getMatrix: function() {
            for (var a = new CAAT.Matrix, b = 0; b < this.stack.length; b++)
                a.multiply(this.stack[b]);
            return a
        }}
})();
(function() {
    CAAT.Color = function() {
        return this
    };
    CAAT.Color.prototype = {hsvToRgb: function(a, b, c) {
            var d, e, f;
            a = Math.max(0, Math.min(360, a));
            b = Math.max(0, Math.min(100, b));
            c = Math.max(0, Math.min(100, c));
            b /= 100;
            c /= 100;
            if (b == 0)
                return d = b = c, [Math.round(d * 255), Math.round(b * 255), Math.round(c * 255)];
            a /= 60;
            d = Math.floor(a);
            e = a - d;
            a = c * (1 - b);
            f = c * (1 - b * e);
            e = c * (1 - b * (1 - e));
            switch (d) {
                case 0:
                    d = c;
                    b = e;
                    c = a;
                    break;
                case 1:
                    d = f;
                    b = c;
                    c = a;
                    break;
                case 2:
                    d = a;
                    b = c;
                    c = e;
                    break;
                case 3:
                    d = a;
                    b = f;
                    break;
                case 4:
                    d = e;
                    b = a;
                    break;
                default:
                    d = c, b = a, c = f
            }
            return new CAAT.Color.RGB(Math.round(d *
            255), Math.round(b * 255), Math.round(c * 255))
        },RampEnumeration: {RAMP_RGBA: 0,RAMP_RGB: 1,RAMP_CHANNEL_RGB: 2,RAMP_CHANNEL_RGBA: 3,RAMP_CHANNEL_RGB_ARRAY: 4,RAMP_CHANNEL_RGBA_ARRAY: 5},interpolate: function(a, b, c, d, e, f, h, g) {
            if (g <= 0)
                return {r: a,g: b,b: c};
            else if (g >= h)
                return {r: d,g: e,b: f};
            a = a + (d - a) / h * g >> 0;
            b = b + (e - b) / h * g >> 0;
            c = c + (f - c) / h * g >> 0;
            a > 255 ? a = 255 : a < 0 && (a = 0);
            b > 255 ? b = 255 : b < 0 && (b = 0);
            c > 255 ? c = 255 : c < 0 && (c = 0);
            return {r: a,g: b,b: c}
        },makeRGBColorRamp: function(a, b, c) {
            var d = [], e = a.length - 1;
            b /= e;
            for (var f = 0; f < e; f++) {
                var h =
                a[f], g = h >> 24 & 255, i = (h & 16711680) >> 16, l = (h & 65280) >> 8;
                h &= 255;
                var k = a[f + 1], m = ((k >> 24 & 255) - g) / b, n = (((k & 16711680) >> 16) - i) / b, j = (((k & 65280) >> 8) - l) / b;
                k = ((k & 255) - h) / b;
                for (var o = 0; o < b; o++) {
                    var p = g + m * o >> 0, q = i + n * o >> 0, r = l + j * o >> 0, s = h + k * o >> 0;
                    switch (c) {
                        case this.RampEnumeration.RAMP_RGBA:
                            d.push("argb(" + p + "," + q + "," + r + "," + s + ")");
                            break;
                        case this.RampEnumeration.RAMP_RGB:
                            d.push("rgb(" + q + "," + r + "," + s + ")");
                            break;
                        case this.RampEnumeration.RAMP_CHANNEL_RGB:
                            d.push(4278190080 | q << 16 | r << 8 | s);
                            break;
                        case this.RampEnumeration.RAMP_CHANNEL_RGBA:
                            d.push(p <<
                            24 | q << 16 | r << 8 | s);
                            break;
                        case this.RampEnumeration.RAMP_CHANNEL_RGBA_ARRAY:
                            d.push([q, r, s, p]);
                            break;
                        case this.RampEnumeration.RAMP_CHANNEL_RGB_ARRAY:
                            d.push([q, r, s])
                    }
                }
            }
            return d
        }}
})();
(function() {
    CAAT.Color.RGB = function(a, b, c) {
        this.r = a || 255;
        this.g = b || 255;
        this.b = c || 255;
        return this
    };
    CAAT.Color.RGB.prototype = {r: 255,g: 255,b: 255,toHex: function() {
            return ("000000" + ((this.r << 16) + (this.g << 8) + this.b).toString(16)).slice(-6)
        }}
})();
(function() {
    CAAT.Rectangle = function() {
        return this
    };
    CAAT.Rectangle.prototype = {x: 0,y: 0,x1: 0,y1: 0,width: 0,height: 0,setLocation: function(a, b) {
            this.x = a;
            this.y = b;
            this.x1 = this.x + this.width;
            this.y1 = this.y + this.height;
            return this
        },setDimension: function(a, b) {
            this.width = a;
            this.height = b;
            this.x1 = this.x + this.width;
            this.y1 = this.y + this.height;
            return this
        },contains: function(a, b) {
            return a >= 0 && a < this.width && b >= 0 && b < this.height
        },isEmpty: function() {
            return this.width === 0 && this.height === 0
        },union: function(a, b) {
            if (this.isEmpty() &&
            this.x == 0 && this.y == 0)
                this.x = a, this.y = b;
            else {
                this.x1 = this.x + this.width;
                this.y1 = this.y + this.height;
                if (b < this.y)
                    this.y = b;
                if (a < this.x)
                    this.x = a;
                if (b > this.y1)
                    this.y1 = b;
                if (a > this.x1)
                    this.x1 = a;
                this.width = this.x1 - this.x;
                this.height = this.y1 - this.y
            }
        }}
})();
(function() {
    CAAT.Curve = function() {
        return this
    };
    CAAT.Curve.prototype = {coordlist: null,k: 0.05,length: -1,interpolator: !1,HANDLE_SIZE: 20,drawHandles: !0,paint: function(a) {
            if (!1 != this.drawHandles) {
                a = a.crc;
                a.save();
                a.beginPath();
                a.strokeStyle = "#a0a0a0";
                a.moveTo(this.coordlist[0].x, this.coordlist[0].y);
                a.lineTo(this.coordlist[1].x, this.coordlist[1].y);
                a.stroke();
                this.cubic && (a.moveTo(this.coordlist[2].x, this.coordlist[2].y), a.lineTo(this.coordlist[3].x, this.coordlist[3].y), a.stroke());
                a.globalAlpha = 0.5;
                for (var b =
                0; b < this.coordlist.length; b++)
                    a.fillStyle = "#7f7f00", a.beginPath(), a.arc(this.coordlist[b].x, this.coordlist[b].y, this.HANDLE_SIZE / 2, 0, 2 * Math.PI, !1), a.fill();
                a.restore()
            }
        },update: function() {
            this.calcLength()
        },solve: function() {
        },getContour: function(a) {
            var b = [], c;
            for (c = 0; c <= a; c++) {
                var d = new CAAT.Point;
                this.solve(d, c / a);
                b.push(d)
            }
            return b
        },getBoundingBox: function(a) {
            a || (a = new CAAT.Rectangle);
            for (var b = new CAAT.Point, c = this.k; c <= 1 + this.k; c += this.k)
                this.solve(b), a.union(b.x, b.y);
            return a
        },calcLength: function() {
            var a,
            b;
            a = this.coordlist[0].x;
            b = this.coordlist[0].y;
            for (var c = 0, d = new CAAT.Point, e = this.k; e <= 1 + this.k; e += this.k)
                this.solve(d, e), c += Math.sqrt((d.x - a) * (d.x - a) + (d.y - b) * (d.y - b)), a = d.x, b = d.y;
            return this.length = c
        },getLength: function() {
            return this.length
        },endCurvePosition: function() {
            return this.coordlist[this.coordlist.length - 1]
        },startCurvePosition: function() {
            return this.coordlist[0]
        }}
})();
(function() {
    CAAT.Bezier = function() {
        CAAT.Bezier.superclass.constructor.call(this);
        return this
    };
    CAAT.Bezier.prototype = {cubic: !1,setCubic: function(a, b, c, d, e, f, h, g) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a, b));
            this.coordlist.push((new CAAT.Point).set(c, d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.coordlist.push((new CAAT.Point).set(h, g));
            this.cubic = !0;
            this.update();
            return this
        },setQuadric: function(a, b, c, d, e, f) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a,
            b));
            this.coordlist.push((new CAAT.Point).set(c, d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.cubic = !1;
            this.update();
            return this
        },paint: function(a) {
            this.cubic ? this.paintCubic(a) : this.paintCuadric(a);
            CAAT.Bezier.superclass.paint.call(this, a)
        },paintCuadric: function(a) {
            var b, c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            a = a.crc;
            a.save();
            a.beginPath();
            a.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k)
                this.solve(b, c), a.lineTo(b.x, b.y);
            a.stroke();
            a.restore()
        },paintCubic: function(a) {
            var b,
            c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            a = a.crc;
            a.save();
            a.beginPath();
            a.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k)
                this.solve(b, c), a.lineTo(b.x, b.y);
            a.stroke();
            a.restore()
        },solve: function(a, b) {
            return this.cubic ? this.solveCubic(a, b) : this.solveQuadric(a, b)
        },solveCubic: function(a, b) {
            var c = b * b, d = b * c;
            a.x = this.coordlist[0].x + b * (-this.coordlist[0].x * 3 + b * (3 * this.coordlist[0].x - this.coordlist[0].x * b)) + b * (3 * this.coordlist[1].x + b * (-6 * this.coordlist[1].x + this.coordlist[1].x * 3 * b)) +
            c * (this.coordlist[2].x * 3 - this.coordlist[2].x * 3 * b) + this.coordlist[3].x * d;
            a.y = this.coordlist[0].y + b * (-this.coordlist[0].y * 3 + b * (3 * this.coordlist[0].y - this.coordlist[0].y * b)) + b * (3 * this.coordlist[1].y + b * (-6 * this.coordlist[1].y + this.coordlist[1].y * 3 * b)) + c * (this.coordlist[2].y * 3 - this.coordlist[2].y * 3 * b) + this.coordlist[3].y * d;
            return a
        },solveQuadric: function(a, b) {
            a.x = (1 - b) * (1 - b) * this.coordlist[0].x + 2 * (1 - b) * b * this.coordlist[1].x + b * b * this.coordlist[2].x;
            a.y = (1 - b) * (1 - b) * this.coordlist[0].y + 2 * (1 - b) * b * this.coordlist[1].y +
            b * b * this.coordlist[2].y;
            return a
        }};
    extend(CAAT.Bezier, CAAT.Curve, null)
})();
(function() {
    CAAT.CatmullRom = function() {
        CAAT.CatmullRom.superclass.constructor.call(this);
        return this
    };
    CAAT.CatmullRom.prototype = {setCurve: function(a, b, c, d, e, f, h, g) {
            this.coordlist = [];
            this.coordlist.push((new CAAT.Point).set(a, b));
            this.coordlist.push((new CAAT.Point).set(c, d));
            this.coordlist.push((new CAAT.Point).set(e, f));
            this.coordlist.push((new CAAT.Point).set(h, g));
            this.cubic = !0;
            this.update()
        },paint: function(a) {
            var b, c;
            b = this.coordlist[0].x;
            c = this.coordlist[0].y;
            var d = a.crc;
            d.save();
            d.beginPath();
            d.moveTo(b, c);
            b = new CAAT.Point;
            for (c = this.k; c <= 1 + this.k; c += this.k)
                this.solve(b, c), d.lineTo(b.x, b.y);
            d.stroke();
            d.restore();
            CAAT.CatmullRom.superclass.paint.call(this, a)
        },solve: function(a, b) {
            var c = b * b, d = b * c, e = this.coordlist;
            a.x = 0.5 * (2 * e[1].x + (-e[0].x + e[2].x) * b + (2 * e[0].x - 5 * e[1].x + 4 * e[2].x - e[3].x) * c + (-e[0].x + 3 * e[1].x - 3 * e[2].x + e[3].x) * d);
            a.y = 0.5 * (2 * e[1].y + (-e[0].y + e[2].y) * b + (2 * e[0].y - 5 * e[1].y + 4 * e[2].y - e[3].y) * c + (-e[0].y + 3 * e[1].y - 3 * e[2].y + e[3].y) * d);
            return a
        }};
    extend(CAAT.CatmullRom, CAAT.Curve, null)
})();
(function() {
    CAAT.Point = function(a, b, c) {
        this.x = a || 0;
        this.y = b || 0;
        this.z = c || 0;
        return this
    };
    CAAT.Point.prototype = {x: 0,y: 0,z: 0,set: function(a, b, c) {
            this.x = a || 0;
            this.y = b || 0;
            this.z = c || 0;
            return this
        },clone: function() {
            return new CAAT.Point(this.x, this.y, this.z)
        },translate: function(a, b, c) {
            this.x += a;
            this.y += b;
            this.z += c || 0;
            return this
        },translatePoint: function(a) {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
            return this
        },subtract: function(a) {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
            return this
        },multiply: function(a) {
            this.x *= a;
            this.y *= a;
            this.z *= a;
            return this
        },rotate: function(a) {
            var b = this.x, c = this.y;
            this.x = b * Math.cos(a) - Math.sin(a) * c;
            this.y = b * Math.sin(a) + Math.cos(a) * c;
            return this
        },setAngle: function(a) {
            var b = this.getLength();
            this.x = Math.cos(a) * b;
            this.y = Math.sin(a) * b;
            return this
        },setLength: function(a) {
            var b = this.getLength();
            b ? this.multiply(a / b) : this.x = this.y = a;
            return this
        },normalize: function() {
            var a = this.getLength();
            this.x /= a;
            this.y /= a;
            this.z /= a;
            return this
        },getAngle: function() {
            return Math.atan2(this.y, this.x)
        },limit: function(a) {
            var b =
            this.getLengthSquared();
            if (b + 0.01 > a * a)
                b = Math.sqrt(b), this.x = this.x / b * a, this.y = this.y / b * a, this.z = this.z / b * a;
            return this
        },getLength: function() {
            var a = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            if (a < 0.0050 && a > -0.0050)
                return 1.0E-6;
            return a
        },getLengthSquared: function() {
            var a = this.x * this.x + this.y * this.y + this.z * this.z;
            if (a < 0.0050 && a > -0.0050)
                return 0;
            return a
        },getDistance: function(a) {
            var b = this.x - a.x, c = this.y - a.y;
            a = this.z - a.z;
            return Math.sqrt(b * b + c * c + a * a)
        },getDistanceSquared: function(a) {
            var b = this.x -
            a.x, c = this.y - a.y;
            a = this.z - a.z;
            return b * b + c * c + a * a
        },toString: function() {
            return "(CAAT.Point) x:" + String(Math.round(Math.floor(this.x * 10)) / 10) + " y:" + String(Math.round(Math.floor(this.y * 10)) / 10) + " z:" + String(Math.round(Math.floor(this.z * 10)) / 10)
        }}
})();
(function() {
    CAAT.Actor = function() {
        this.behaviorList = [];
        this.lifecycleListenerList = [];
        this.AABB = new CAAT.Rectangle;
        this.viewVertices = [new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0), new CAAT.Point(0, 0, 0)];
        return this
    };
    CAAT.Actor.prototype = {lifecycleListenerList: null,behaviorList: null,parent: null,x: 0,y: 0,width: 0,height: 0,start_time: 0,duration: Number.MAX_VALUE,clip: !1,scaleX: 0,scaleY: 0,scaleTX: 0,scaleTY: 0,scaleAnchor: 0,rotationAngle: 0,rotationY: 0,alpha: 1,rotationX: 0,isGlobalAlpha: !1,
        frameAlpha: 1,expired: !1,discardable: !1,pointed: !1,mouseEnabled: !0,visible: !0,ANCHOR_CENTER: 0,ANCHOR_TOP: 1,ANCHOR_BOTTOM: 2,ANCHOR_LEFT: 3,ANCHOR_RIGHT: 4,ANCHOR_TOP_LEFT: 5,ANCHOR_TOP_RIGHT: 6,ANCHOR_BOTTOM_LEFT: 7,ANCHOR_BOTTOM_RIGHT: 8,ANCHOR_CUSTOM: 9,fillStyle: null,strokeStyle: null,time: 0,AABB: null,viewVertices: null,inFrame: !1,dirty: !0,wdirty: !0,oldX: -1,oldY: -1,modelViewMatrix: null,worldModelViewMatrix: null,modelViewMatrixI: null,worldModelViewMatrixI: null,glEnabled: !1,setVisible: function(a) {
            this.visible =
            a;
            return this
        },setOutOfFrameTime: function() {
            this.setFrameTime(-1, 0);
            return this
        },addListener: function(a) {
            this.lifecycleListenerList.push(a)
        },removeListener: function(a) {
            for (var b = this.lifecycleListenerList.length; b--; )
                if (this.lifecycleListenerList[b] == a) {
                    this.lifecycleListenerList.splice(b, 1);
                    break
                }
        },setGlobalAlpha: function(a) {
            this.isGlobalAlpha = a;
            return this
        },fireEvent: function(a, b) {
            for (var c = 0; c < this.lifecycleListenerList.length; c++)
                this.lifecycleListenerList[c].actorLyfeCycleEvent(this, a, b)
        },setScreenBounds: function() {
            this.viewVertices[0].set(0,
            0);
            this.viewVertices[1].set(this.width, 0);
            this.viewVertices[2].set(this.width, this.height);
            this.viewVertices[3].set(0, this.height);
            this.modelToView(this.viewVertices);
            for (var a = Number.MAX_VALUE, b = Number.MIN_VALUE, c = Number.MAX_VALUE, d = Number.MIN_VALUE, e = 0; e < 4; e++) {
                if (this.viewVertices[e].x < a)
                    a = this.viewVertices[e].x;
                if (this.viewVertices[e].x > b)
                    b = this.viewVertices[e].x;
                if (this.viewVertices[e].y < c)
                    c = this.viewVertices[e].y;
                if (this.viewVertices[e].y > d)
                    d = this.viewVertices[e].y
            }
            this.AABB.x = a;
            this.AABB.y =
            c;
            this.AABB.width = b - a;
            this.AABB.height = d - c;
            return this
        },setExpired: function(a) {
            this.expired = !0;
            this.fireEvent("expired", a);
            return this
        },enableEvents: function(a) {
            this.mouseEnabled = a;
            return this
        },emptyBehaviorList: function() {
            this.behaviorList = [];
            return this
        },setFillStyle: function(a) {
            this.fillStyle = a;
            return this
        },setStrokeStyle: function(a) {
            this.strokeStyle = a;
            return this
        },setPaint: function(a) {
            return this.setFillStyle(a)
        },setAlpha: function(a) {
            this.alpha = a;
            return this
        },resetTransform: function() {
            this.rotationY =
            this.rotationX = this.rotateAnchor = this.rotationAngle = 0;
            this.scaleY = this.scaleX = 1;
            this.scaleAnchor = this.scaleTY = this.scaleTX = 0;
            this.dirty = !0;
            return this
        },setFrameTime: function(a, b) {
            this.start_time = a;
            this.duration = b;
            this.expired = !1;
            this.dirty = !0;
            return this
        },paint: function(a) {
            a = a.crc;
            if (null != this.parent && null != this.fillStyle)
                a.fillStyle = this.pointed ? "orange" : this.fillStyle != null ? this.fillStyle : "white", a.fillRect(0, 0, this.width, this.height)
        },setScale: function(a, b) {
            this.setScaleAnchored(a, b, this.ANCHOR_CENTER);
            this.dirty = !0;
            return this
        },getAnchor: function(a) {
            var b = 0, c = 0;
            switch (a) {
                case this.ANCHOR_CENTER:
                    b = this.width / 2;
                    c = this.height / 2;
                    break;
                case this.ANCHOR_TOP:
                    b = this.width / 2;
                    c = 0;
                    break;
                case this.ANCHOR_BOTTOM:
                    b = this.width / 2;
                    c = this.height;
                    break;
                case this.ANCHOR_LEFT:
                    b = 0;
                    c = this.height / 2;
                    break;
                case this.ANCHOR_RIGHT:
                    b = this.width;
                    c = this.height / 2;
                    break;
                case this.ANCHOR_TOP_RIGHT:
                    b = this.width;
                    c = 0;
                    break;
                case this.ANCHOR_BOTTOM_LEFT:
                    b = 0;
                    c = this.height;
                    break;
                case this.ANCHOR_BOTTOM_RIGHT:
                    b = this.width;
                    c = this.height;
                    break;
                case this.ANCHOR_TOP_LEFT:
                    c = b = 0
            }
            return {x: b,y: c}
        },setScaleAnchored: function(a, b, c) {
            this.scaleAnchor = c;
            c = this.getAnchor(this.scaleAnchor);
            this.scaleTX = c.x;
            this.scaleTY = c.y;
            this.scaleX = a;
            this.scaleY = b;
            this.dirty = !0;
            return this
        },setRotation: function(a) {
            this.setRotationAnchored(a, this.width / 2, this.height / 2);
            return this
        },setRotationAnchored: function(a, b, c) {
            this.rotationAngle = a;
            this.rotationX = b ? b : 0;
            this.rotationY = c ? c : 0;
            this.dirty = !0;
            return this
        },setSize: function(a, b) {
            this.width = a >> 0;
            this.height = b >>
            0;
            return this
        },setBounds: function(a, b, c, d) {
            this.x = a | 0;
            this.y = b | 0;
            this.width = c | 0;
            this.height = d | 0;
            return this
        },setLocation: function(a, b) {
            this.x = a | 0;
            this.y = b | 0;
            this.oldX = a;
            this.oldY = b;
            this.dirty = !0;
            return this
        },isInAnimationFrame: function(a) {
            if (this.expired)
                return !1;
            if (this.duration == Number.MAX_VALUE)
                return this.start_time <= a;
            if (a >= this.start_time + this.duration)
                return this.expired || this.setExpired(a), !1;
            return this.start_time <= a && a < this.start_time + this.duration
        },contains: function(a, b) {
            return a >= 0 && b >=
            0 && a < this.width && b < this.height
        },create: function() {
            this.rotateAnchor = this.scaleAnchor = this.ANCHOR_CENTER;
            this.setScale(1, 1);
            this.setRotation(0);
            this.behaviorList = [];
            this.modelViewMatrix = new CAAT.Matrix;
            this.worldModelViewMatrix = new CAAT.Matrix;
            this.modelViewMatrixI = new CAAT.Matrix;
            this.worldModelViewMatrixI = new CAAT.Matrix;
            return this
        },addBehavior: function(a) {
            this.behaviorList.push(a);
            return this
        },removeBehaviour: function(a) {
            for (var b = this.behaviorList.length - 1; b; )
                if (this.behaviorList[b] == a) {
                    this.behaviorList.splice(b,
                    1);
                    break
                }
            return this
        },removeBehavior: function(a) {
            for (var b = 0; b < this.behaviorList.length; b++)
                this.behaviorList[b].id == a && this.behaviorList.splice(b, 1);
            return this
        },setDiscardable: function(a) {
            this.discardable = a;
            return this
        },destroy: function(a) {
            this.fireEvent("destroyed", a)
        },modelToView: function(a) {
            if (a instanceof Array)
                for (var b = 0; b < a.length; b++)
                    this.worldModelViewMatrix.transformCoord(a[b]);
            else
                this.worldModelViewMatrix.transformCoord(a);
            return a
        },viewToModel: function(a) {
            this.worldModelViewMatrixI =
            this.worldModelViewMatrix.getInverse();
            this.worldModelViewMatrixI.transformCoord(a);
            return a
        },findActorAtPosition: function(a) {
            if (!this.mouseEnabled || !this.isInAnimationFrame(this.time))
                return null;
            this.modelViewMatrixI = this.modelViewMatrix.getInverse();
            this.modelViewMatrixI.transformCoord(a);
            return this.contains(a.x, a.y) ? this : null
        },enableDrag: function() {
            this.my = this.mx = this.ay = this.ax = 0;
            this.asy = this.asx = 1;
            this.screeny = this.screenx = this.ara = 0;
            this.mouseEnter = function() {
                this.ay = this.ax = -1;
                this.pointed =
                !0;
                document.body.style.cursor = "move"
            };
            this.mouseExit = function() {
                this.ay = this.ax = -1;
                this.pointed = !1;
                document.body.style.cursor = "default"
            };
            this.mouseMove = function(a) {
                this.mx = a.point.x;
                this.my = a.point.y
            };
            this.mouseUp = function() {
                this.ay = this.ax = -1
            };
            this.mouseDrag = function(a) {
                if (this.ax == -1 || this.ay == -1)
                    this.ax = a.point.x, this.ay = a.point.y, this.asx = this.scaleX, this.asy = this.scaleY, this.ara = this.rotationAngle, this.screenx = a.screenPoint.x, this.screeny = a.screenPoint.y;
                if (a.isShiftDown()) {
                    var b = (a.screenPoint.x -
                    this.screenx) / 100, c = (a.screenPoint.y - this.screeny) / 100;
                    a.isAltDown() || (c = b = a = Math.max(b, c));
                    this.setScale(b + this.asx, c + this.asy)
                } else
                    a.isControlDown() ? this.setRotation(-Math.atan2(a.screenPoint.x - this.screenx, a.screenPoint.y - this.screeny) + this.ara) : (this.x += a.point.x - this.ax, this.y += a.point.y - this.ay, this.ax = a.point.x, this.ay = a.point.y)
            };
            return this
        },mouseClick: function() {
        },mouseDblClick: function() {
        },mouseEnter: function() {
            this.pointed = !0
        },mouseExit: function() {
            this.pointed = !1
        },mouseMove: function() {
        },
        mouseDown: function() {
        },mouseUp: function() {
        },mouseDrag: function() {
        },drawScreenBoundingBox: function(a) {
            if (this.inFrame && null != this.AABB) {
                var b = this.AABB;
                a.ctx.strokeRect(b.x, b.y, b.width, b.height)
            }
        },animate: function(a, b) {
            if (!this.isInAnimationFrame(b))
                return this.inFrame = !1, this.dirty = !0, !1;
            for (var c = 0; c < this.behaviorList.length; c++)
                this.behaviorList[c].apply(b, this);
            if (this.x != this.oldX || this.y != this.oldY)
                this.dirty = !0, this.oldX = this.x, this.oldY = this.y;
            this.setModelViewMatrix();
            return this.inFrame =
            !0
        },setModelViewMatrix: function() {
            if (this.dirty) {
                this.modelViewMatrix.identity();
                var a = new CAAT.Matrix;
                this.modelViewMatrix.multiply(a.setTranslate(this.x, this.y));
                this.rotationAngle && (this.modelViewMatrix.multiply(a.setTranslate(this.rotationX, this.rotationY)), this.modelViewMatrix.multiply(a.setRotation(this.rotationAngle)), this.modelViewMatrix.multiply(a.setTranslate(-this.rotationX, -this.rotationY)));
                if (this.scaleX || this.scaleY && (this.scaleTX || this.scaleTY))
                    this.modelViewMatrix.multiply(a.setTranslate(this.scaleTX,
                    this.scaleTY)), this.modelViewMatrix.multiply(a.setScale(this.scaleX, this.scaleY)), this.modelViewMatrix.multiply(a.setTranslate(-this.scaleTX, -this.scaleTY))
            }
            if (this.parent) {
                if (this.dirty || this.parent.wdirty)
                    this.worldModelViewMatrix.copy(this.parent.worldModelViewMatrix), this.worldModelViewMatrix.multiply(this.modelViewMatrix), this.wdirty = !0
            } else
                this.worldModelViewMatrix.copy(this.modelViewMatrix);
            (this.dirty || this.wdirty) && this.setScreenBounds();
            this.dirty = !1;
            return this
        },paintActor: function(a,
        b) {
            if (!this.visible)
                return !0;
            var c = a.crc;
            this.frameAlpha = this.parent.frameAlpha * this.alpha;
            c.globalAlpha = this.frameAlpha;
            this.worldModelViewMatrix.transformRenderingContext(a.ctx);
            this.clip && (c.beginPath(), c.rect(0, 0, this.width, this.height), c.clip());
            this.paint(a, b);
            return !0
        },paintActorGL: function(a) {
            this.frameAlpha = this.parent.frameAlpha * this.alpha;
            if (this.glEnabled && this.visible)
                if (this.glNeedsFlush(a)) {
                    a.glFlush();
                    this.glSetShader(a);
                    if (!this.__uv)
                        this.__uv = new Float32Array(8);
                    if (!this.__vv)
                        this.__vv =
                        new Float32Array(12);
                    this.setGLCoords(this.__vv, 0, -a.canvas.height / 2);
                    this.setUV(this.__uv, 0);
                    a.glRender(this.__vv, 12, this.__uv)
                } else {
                    var b = a.coordsIndex;
                    this.setGLCoords(a.coords, b, -a.canvas.height / 2);
                    a.coordsIndex = b + 12;
                    this.setUV(a.uv, a.uvIndex);
                    a.uvIndex += 8
                }
        },setGLCoords: function(a, b, c) {
            var d = this.viewVertices;
            a[b++] = d[0].x;
            a[b++] = d[0].y;
            a[b++] = c;
            a[b++] = d[1].x;
            a[b++] = d[1].y;
            a[b++] = c;
            a[b++] = d[2].x;
            a[b++] = d[2].y;
            a[b++] = c;
            a[b++] = d[3].x;
            a[b++] = d[3].y;
            a[b++] = c
        },setUV: function() {
        },glNeedsFlush: function() {
            return !1
        },
        glSetShader: function(a) {
            this.frameAlpha != a.currentOpacity && a.setGLCurrentOpacity(this.frameAlpha)
        },endAnimate: function() {
            return this
        },initialize: function(a) {
            if (a)
                for (var b in a)
                    this[b] = a[b];
            return this
        },setClip: function(a) {
            this.clip = a;
            return this
        }}
})();
(function() {
    CAAT.ActorContainer = function() {
        CAAT.ActorContainer.superclass.constructor.call(this);
        this.childrenList = [];
        this.pendingChildrenList = [];
        return this
    };
    CAAT.ActorContainer.prototype = {childrenList: null,activeChildren: null,pendingChildrenList: null,drawScreenBoundingBox: function(a, b) {
            if (this.inFrame) {
                for (var c = 0; c < this.childrenList.length; c++)
                    this.childrenList[c].drawScreenBoundingBox(a, b);
                CAAT.ActorContainer.superclass.drawScreenBoundingBox.call(this, a, b)
            }
        },emptyChildren: function() {
            this.childrenList =
            [];
            return this
        },paintActor: function(a, b) {
            if (!this.visible)
                return !0;
            var c = a.crc;
            c.save();
            CAAT.ActorContainer.superclass.paintActor.call(this, a, b);
            if (!this.isGlobalAlpha)
                this.frameAlpha = this.parent.frameAlpha;
            for (var d = 0; d < this.activeChildren.length; d++)
                c.save(), this.activeChildren[d].paintActor(a, b), c.restore();
            c.restore();
            return !0
        },paintActorGL: function(a, b) {
            if (!this.visible)
                return !0;
            if (a.front_to_back)
                for (var c = this.getNumChildren() - 1; c >= 0; ) {
                    var d = this.childrenList[c];
                    d.paintActorGL(a, b);
                    c--
                }
            CAAT.ActorContainer.superclass.paintActorGL.call(this,
            a, b);
            if (!this.isGlobalAlpha)
                this.frameAlpha = this.parent.frameAlpha;
            if (!a.front_to_back) {
                var e = this.getNumChildren();
                for (c = 0; c < e; c++)
                    d = this.childrenList[c], d.paintActorGL(a, b)
            }
        },animate: function(a, b) {
            this.activeChildren = [];
            if (!1 == CAAT.ActorContainer.superclass.animate.call(this, a, b))
                return !1;
            var c;
            for (c = 0; c < this.childrenList.length; c++)
                this.childrenList[c].time = b, this.childrenList[c].animate(a, b) && this.activeChildren.push(this.childrenList[c]);
            return !0
        },endAnimate: function(a, b) {
            CAAT.ActorContainer.superclass.endAnimate.call(this,
            a, b);
            var c;
            for (c = this.childrenList.length - 1; c >= 0; c--) {
                var d = this.childrenList[c];
                d.expired && d.discardable ? (d.destroy(b), this.childrenList.splice(c, 1)) : d.endAnimate(a, b)
            }
            for (c = 0; c < this.pendingChildrenList.length; c++)
                d = this.pendingChildrenList[c], d.parent = this, this.childrenList.push(d);
            this.pendingChildrenList = []
        },addChildImmediately: function(a) {
            return this.addChild(a)
        },addChild: function(a) {
            a.parent = this;
            this.childrenList.push(a);
            return this
        },addChildDelayed: function(a) {
            this.pendingChildrenList.push(a);
            return this
        },addChildAt: function(a, b) {
            if (b < 0 || b > this.childrenList.length)
                return this;
            a.parent = this;
            this.childrenList.unshift(a);
            return this
        },findChild: function(a) {
            var b = 0, c = this.childrenList.length;
            for (b = 0; b < c; b++)
                if (this.childrenList[b] == a)
                    return b;
            return -1
        },removeChild: function(a) {
            a = this.findChild(a);
            -1 != a && this.childrenList.splice(a, 1);
            return this
        },findActorAtPosition: function(a, b) {
            if (null == CAAT.ActorContainer.superclass.findActorAtPosition.call(this, a, b))
                return null;
            for (var c = this.childrenList.length -
            1; c >= 0; c--) {
                var d = this.childrenList[c], e = new CAAT.Point(a.x, a.y, 0), f = d.AABB;
                if (b.x >= f.x && b.y >= f.y && b.x <= f.x + f.width && b.y <= f.y + f.height && (d = d.findActorAtPosition(e, b), null != d))
                    return d
            }
            return this
        },destroy: function() {
            for (var a = this.childrenList.length - 1; a >= 0; a--)
                this.childrenList[a].destroy();
            CAAT.ActorContainer.superclass.destroy.call(this);
            return this
        },getNumChildren: function() {
            return this.childrenList.length
        },getChildAt: function(a) {
            return this.childrenList[a]
        },setZOrder: function(a, b) {
            var c = this.findChild(a);
            if (-1 != c && b != c)
                if (b >= this.childrenList.length)
                    this.childrenList.splice(c, 1), this.childrenList.push(a);
                else {
                    c = this.childrenList.splice(c, 1);
                    if (b < 0)
                        b = 0;
                    else if (b > this.childrenList.length)
                        b = this.childrenList.length;
                    this.childrenList.splice(b, 1, c)
                }
        }};
    extend(CAAT.ActorContainer, CAAT.Actor, null)
})();
(function() {
    CAAT.SpriteActor = function() {
        CAAT.SpriteActor.superclass.constructor.call(this);
        this.glEnabled = !0;
        return this
    };
    CAAT.SpriteActor.prototype = {compoundbitmap: null,animationImageIndex: null,prevAnimationTime: -1,changeFPS: 1E3,transformation: 0,spriteIndex: 0,TR_NONE: 0,TR_FLIP_HORIZONTAL: 1,TR_FLIP_VERTICAL: 2,TR_FLIP_ALL: 3,setSpriteImage: function(a) {
            this.compoundbitmap = a;
            this.width = a.singleWidth;
            this.height = a.singleHeight;
            null == this.animationImageIndex && this.setAnimationImageIndex([0]);
            return this
        },
        setChangeFPS: function(a) {
            this.changeFPS = a;
            return this
        },setSpriteTransformation: function(a) {
            this.transformation = a;
            return this
        },setAnimationImageIndex: function(a) {
            this.animationImageIndex = a;
            this.spriteIndex = a[0];
            return this
        },animate: function(a, b) {
            if (this.compoundbitmap && this.animationImageIndex) {
                if (this.animationImageIndex.length > 1)
                    if (this.prevAnimationTime == -1)
                        this.prevAnimationTime = b;
                    else {
                        var c = b;
                        c -= this.prevAnimationTime;
                        c /= this.changeFPS;
                        c %= this.animationImageIndex.length;
                        this.spriteIndex = this.animationImageIndex[Math.floor(c)]
                    }
                return CAAT.SpriteActor.superclass.animate.call(this,
                a, b)
            }
            return !1
        },paint: function(a) {
            if (-1 != this.spriteIndex)
                switch (a = a.crc, this.transformation) {
                    case this.TR_FLIP_HORIZONTAL:
                        this.compoundbitmap.paintInvertedH(a, this.spriteIndex, 0, 0);
                        break;
                    case this.TR_FLIP_VERTICAL:
                        this.compoundbitmap.paintInvertedV(a, this.spriteIndex, 0, 0);
                        break;
                    case this.TR_FLIP_ALL:
                        this.compoundbitmap.paintInvertedHV(a, this.spriteIndex, 0, 0);
                        break;
                    default:
                        this.compoundbitmap.paint(a, this.spriteIndex, 0, 0)
                }
        },paintActorGL: function(a, b) {
            -1 != this.spriteIndex && CAAT.SpriteActor.superclass.paintActorGL.call(this,
            a, b)
        },setUV: function(a, b) {
            this.compoundbitmap.setUV(this.spriteIndex, a, b)
        },glNeedsFlush: function(a) {
            if (this.compoundbitmap.image.__texturePage != a.currentTexturePage)
                return !0;
            if (this.frameAlpha != a.currentOpacity)
                return !0;
            return !1
        }};
    extend(CAAT.SpriteActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.ImageActor = function() {
        CAAT.ImageActor.superclass.constructor.call(this);
        this.glEnabled = !0;
        return this
    };
    CAAT.ImageActor.prototype = {image: null,transformation: 0,TR_NONE: 0,TR_FLIP_HORIZONTAL: 1,TR_FLIP_VERTICAL: 2,TR_FLIP_ALL: 3,offsetX: 0,offsetY: 0,setOffsetX: function(a) {
            this.offsetX = a | 0;
            return this
        },setOffsetY: function(a) {
            this.offsetY = a | 0;
            return this
        },setImage: function(a) {
            this.image = a;
            if (this.width == 0 || this.height == 0)
                this.width = a.width, this.height = a.height;
            return this
        },setImageTransformation: function(a) {
            this.transformation =
            a;
            return this
        },paint: function(a) {
            a = a.crc;
            switch (this.transformation) {
                case this.TR_FLIP_HORIZONTAL:
                    this.paintInvertedH(a);
                    break;
                case this.TR_FLIP_VERTICAL:
                    this.paintInvertedV(a);
                    break;
                case this.TR_FLIP_ALL:
                    this.paintInvertedHV(a);
                    break;
                default:
                    a.drawImage(this.image, this.offsetX, this.offsetY)
            }
        },paintActorGL: function(a, b) {
            null != this.image && CAAT.ImageActor.superclass.paintActorGL.call(this, a, b)
        },paintInvertedH: function(a) {
            a.save();
            a.translate(this.width, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.offsetX,
            this.offsetY);
            a.restore()
        },paintInvertedV: function(a) {
            a.save();
            a.translate(0, this.height);
            a.scale(1, -1);
            a.drawImage(this.image, this.offsetX, this.offsetY);
            a.restore()
        },paintInvertedHV: function(a) {
            a.save();
            a.translate(0, this.height);
            a.scale(1, -1);
            a.translate(this.width, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.offsetX, this.offsetY);
            a.restore()
        },setUV: function(a, b) {
            var c = b, d = this.image;
            if (d.__texturePage) {
                var e = d.__u, f = d.__v, h = d.__u1, g = d.__v1;
                if (this.offsetX || this.offsetY) {
                    h = this.width;
                    g = this.height;
                    var i = d.__texturePage;
                    e = (d.__tx - this.offsetX) / i.width;
                    f = (d.__ty - this.offsetY) / i.height;
                    h = e + h / i.width;
                    g = f + g / i.height
                }
                d.inverted ? (a[c++] = h, a[c++] = f, a[c++] = h, a[c++] = g, a[c++] = e, a[c++] = g, a[c++] = e, a[c++] = f) : (a[c++] = e, a[c++] = f, a[c++] = h, a[c++] = f, a[c++] = h, a[c++] = g, a[c++] = e, a[c++] = g)
            }
        },glNeedsFlush: function(a) {
            if (this.image.__texturePage != a.currentTexturePage)
                return !0;
            if (this.frameAlpha != a.currentOpacity)
                return !0;
            return !1
        }};
    extend(CAAT.ImageActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.TextActor = function() {
        CAAT.TextActor.superclass.constructor.call(this);
        this.font = "10px sans-serif";
        this.textAlign = "left";
        this.textBaseline = "top";
        this.outlineColor = "black";
        this.clip = !1;
        return this
    };
    CAAT.TextActor.prototype = {font: null,textAlign: null,textBaseline: null,fill: !0,text: null,textWidth: 0,textHeight: 0,outline: !1,outlineColor: null,path: null,pathInterpolator: null,pathDuration: 1E4,sign: 1,setFill: function(a) {
            this.fill = a;
            return this
        },setOutline: function(a) {
            this.outline = a;
            return this
        },
        setOutlineColor: function(a) {
            this.outlineColor = a;
            return this
        },setText: function(a) {
            this.text = a;
            this.setFont(this.font);
            return this
        },setAlign: function(a) {
            this.textAlign = a;
            return this
        },setBaseline: function(a) {
            this.textBaseline = a;
            return this
        },setFont: function(a) {
            if (!a)
                return this;
            this.font = a;
            if (this.text == "" || null == this.text)
                this.width = this.height = 0;
            return this
        },calcTextSize: function(a) {
            if (a.glEnabled)
                return this;
            a.ctx.save();
            a.ctx.font = this.font;
            this.textWidth = a.crc.measureText(this.text).width;
            if (this.width ==
            0)
                this.width = this.textWidth;
            try {
                var b = this.font.substring(0, this.font.indexOf("px"));
                this.textHeight = parseInt(b, 10)
            } catch (c) {
                this.textHeight = 20
            }
            if (this.height == 0)
                this.height = this.textHeight;
            a.crc.restore();
            return this
        },paint: function(a, b) {
            if (null != this.text) {
                (this.textWidth == 0 || this.textHeight == 0) && this.calcTextSize(a);
                var c = a.crc;
                if (null != this.font)
                    c.font = this.font;
                if (null != this.textAlign)
                    c.textAlign = this.textAlign;
                if (null != this.textBaseline)
                    c.textBaseline = this.textBaseline;
                if (null != this.fillStyle)
                    c.fillStyle =
                    this.fillStyle;
                if (null == this.path) {
                    var d = 0;
                    if (this.textAlign == "center")
                        d = this.width / 2 | 0;
                    else if (this.textAlign == "right")
                        d = this.width;
                    if (this.fill) {
                        if (c.fillText(this.text, d, 0), this.outline) {
                            if (null != this.outlineColor)
                                c.strokeStyle = this.outlineColor;
                            c.beginPath();
                            c.strokeText(this.text, d, 0)
                        }
                    } else {
                        if (null != this.outlineColor)
                            c.strokeStyle = this.outlineColor;
                        c.strokeText(this.text, d, 0)
                    }
                } else
                    this.drawOnPath(a, b)
            }
        },drawOnPath: function(a, b) {
            for (var c = a.crc, d = this.sign * this.pathInterpolator.getPosition(b %
            this.pathDuration / this.pathDuration).y * this.path.getLength(), e = new CAAT.Point(0, 0, 0), f = new CAAT.Point(0, 0, 0), h = 0; h < this.text.length; h++) {
                var g = this.text[h].toString(), i = c.measureText(g).width;
                this.path.getLength();
                f = i / 2 + d;
                e = this.path.getPositionFromLength(f).clone();
                f = this.path.getPositionFromLength(f - 0.1).clone();
                f = Math.atan2(e.y - f.y, e.x - f.x);
                c.save();
                c.translate(0.5 + e.x | 0, 0.5 + e.y | 0);
                c.rotate(f);
                this.fill && c.fillText(g, 0, 0);
                if (this.outline)
                    c.strokeStyle = this.outlineColor, c.strokeText(g, 0, 0);
                c.restore();
                d += i
            }
        },setPath: function(a, b, c) {
            this.path = a;
            this.pathInterpolator = b || (new CAAT.Interpolator).createLinearInterpolator();
            this.pathDuration = c || 1E4;
            this.mouseEnabled = !1;
            return this
        }};
    extend(CAAT.TextActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.Button = function() {
        CAAT.Button.superclass.constructor.call(this);
        this.glEnabled = !0;
        return this
    };
    CAAT.Button.prototype = {iNormal: 0,iOver: 0,iPress: 0,iDisabled: 0,iCurrent: 0,fnOnClick: null,enabled: !0,setEnabled: function(a) {
            this.enabled = a
        },initialize: function(a, b, c, d, e, f) {
            this.setSpriteImage(a);
            this.iNormal = b || 0;
            this.iOver = c || this.iNormal;
            this.iPress = d || this.iNormal;
            this.iDisabled = e || this.iNormal;
            this.iCurrent = this.iNormal;
            this.width = a.singleWidth;
            this.height = a.singleHeight;
            this.fnOnClick =
            f;
            this.spriteIndex = b;
            return this
        },mouseEnter: function() {
            this.spriteIndex = this.iOver;
            document.body.style.cursor = "pointer"
        },mouseExit: function() {
            this.spriteIndex = this.iNormal;
            document.body.style.cursor = "default"
        },mouseDown: function() {
            this.spriteIndex = this.iPress
        },mouseUp: function() {
            this.spriteIndex = this.iNormal
        },mouseClick: function() {
            this.enabled && null != this.fnOnClick && this.fnOnClick()
        },toString: function() {
            return "CAAT.Button " + this.iNormal
        }};
    extend(CAAT.Button, CAAT.SpriteActor, null)
})();
(function() {
    CAAT.ShapeActor = function() {
        CAAT.ShapeActor.superclass.constructor.call(this);
        this.compositeOp = "source-over";
        return this
    };
    CAAT.ShapeActor.prototype = {shape: 0,compositeOp: null,SHAPE_CIRCLE: 0,SHAPE_RECTANGLE: 1,setShape: function(a) {
            this.shape = a;
            return this
        },setCompositeOp: function(a) {
            this.compositeOp = a;
            return this
        },paint: function(a, b) {
            switch (this.shape) {
                case 0:
                    this.paintCircle(a, b);
                    break;
                case 1:
                    this.paintRectangle(a, b)
            }
        },paintCircle: function(a) {
            a = a.crc;
            a.globalCompositeOperation = this.compositeOp;
            if (null != this.fillStyle)
                a.fillStyle = this.fillStyle, a.beginPath(), a.arc(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2, 0, 2 * Math.PI, !1), a.fill();
            if (null != this.strokeStyle)
                a.strokeStyle = this.strokeStyle, a.beginPath(), a.arc(this.width / 2, this.height / 2, Math.min(this.width, this.height) / 2, 0, 2 * Math.PI, !1), a.stroke()
        },paintRectangle: function(a) {
            a = a.crc;
            a.globalCompositeOperation = this.compositeOp;
            if (null != this.fillStyle)
                a.fillStyle = this.fillStyle, a.beginPath(), a.fillRect(0, 0, this.width, this.height),
                a.fill();
            if (null != this.strokeStyle)
                a.strokeStyle = this.strokeStyle, a.beginPath(), a.strokeRect(0, 0, this.width, this.height), a.stroke()
        }};
    extend(CAAT.ShapeActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.StarActor = function() {
        CAAT.StarActor.superclass.constructor.call(this);
        return this
    };
    CAAT.StarActor.prototype = {nPeaks: 0,maxRadius: 0,minRadius: 0,initialAngle: 0,outlined: !1,filled: !0,setFilled: function(a) {
            this.filled = a;
            return this
        },setOutlined: function(a) {
            this.outlined = a;
            return this
        },initialize: function(a, b, c) {
            this.setSize(2 * b, 2 * b);
            this.nPeaks = a;
            this.maxRadius = b;
            this.minRadius = c;
            return this
        },paint: function(a) {
            a = a.ctx;
            var b = this.width / 2, c = this.height / 2, d = this.maxRadius, e = this.minRadius;
            a.moveTo(b + d * Math.cos(this.initialAngle), c + d * Math.sin(this.initialAngle));
            for (var f = 1; f < this.nPeaks * 2; f++) {
                var h = Math.PI / this.nPeaks * f + this.initialAngle, g = f % 2 == 0 ? d : e;
                a.lineTo(b + g * Math.cos(h), c + g * Math.sin(h))
            }
            a.closePath();
            a.lineTo(b + d * Math.cos(this.initialAngle), c + d * Math.sin(this.initialAngle));
            if (this.filled)
                a.fillStyle = this.fillStyle, a.fill();
            if (this.outlined && this.strokeStyle)
                a.strokeStyle = this.strokeStyle, a.stroke()
        }};
    extend(CAAT.StarActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.IMActor = function() {
        CAAT.IMActor.superclass.constructor.call(this);
        return this
    };
    CAAT.IMActor.prototype = {imageProcessor: null,changeTime: 100,lastApplicationTime: -1,setImageProcessor: function(a) {
            this.imageProcessor = a;
            return this
        },setImageProcessingTime: function(a) {
            this.changeTime = a;
            return this
        },paint: function(a, b) {
            if (b - this.lastApplicationTime > this.changeTime)
                this.imageProcessor.apply(a, b), this.lastApplicationTime = b;
            this.imageProcessor.paint(a, b)
        }};
    extend(CAAT.IMActor, CAAT.ActorContainer,
    null)
})();
(function() {
    CAAT.CSSActor = function() {
        CAAT.CSSActor.superclass.constructor.call(this);
        this.setFillStyle(null);
        this.setStrokeStyle(null);
        this.DOMParent = document.body;
        return this
    };
    CAAT.CSSActor.prototype = {domElement: null,dirty: !0,oldX: -1,oldY: -1,DOMParent: null,setInnerHTML: function(a) {
            this.domElement.innerHTML = a;
            return this
        },create: function() {
            CAAT.CSSActor.superclass.create.call(this);
            this.domElement = document.createElement("div");
            this.DOMParent.appendChild(this.domElement);
            this.domElement.style.position = "absolute";
            this.domElement.style["-webkit-transition"] = "all 0s linear";
            return this
        },setDOMParent: function(a) {
            this.DOMParent = a;
            return this
        },setLocation: function(a, b) {
            CAAT.CSSActor.superclass.setLocation.call(this, a, b);
            this.domElement.style.left = a + "px";
            this.domElement.style.top = b + "px";
            return this
        },setSize: function(a, b) {
            CAAT.CSSActor.superclass.setSize.call(this, a, b);
            this.domElement.style.width = "" + a + "px";
            this.domElement.style.height = "" + b + "px";
            return this
        },setBounds: function(a, b, c, d) {
            this.setLocation(a, b);
            this.setSize(c,
            d);
            return this
        },setBackground: function(a) {
            this.domElement.style.background = "url(" + a + ")";
            return this
        },setOpacity: function() {
            this.domElement.style.filter = "alpha(opacity=" + (this.alpha * 100 >> 0) + ")";
            this.domElement.style["-moz-opacity"] = this.alpha;
            this.domElement.style["-khtml-opacity"] = this.alpha;
            this.domElement.style["-opacity"] = this.alpha
        },addChild: function(a) {
            a instanceof CAAT.CSSActor && (this.domElement.appendChild(a.domElement), CAAT.CSSActor.superclass.addChild.call(this, a))
        },paintActor: function(a,
        b) {
            if (!this.isInAnimationFrame(b))
                return this.inFrame = !1;
            if (this.oldX != this.x || this.oldY != this.y)
                this.domElement.style.top = this.y + "px", this.domElement.style.left = this.x + "px", this.oldX = this.x, this.oldY = this.y;
            if (this.dirty) {
                var c = "translate3d(0,0,0)";
                this.rotationAngle != 0 && (c = c + " rotate(" + this.rotationAngle + "rad)");
                this.scaleX != 1 && (c = c + " scale(" + this.scaleX + ")");
                this.domElement.style["-webkit-transform"] = c;
                this.domElement.style["-o-transform"] = c;
                this.domElement.style["-moz-transform"] = c;
                this.dirty =
                !1
            }
            for (c = 0; c < this.childrenList.length; c++)
                this.childrenList[c].paintActor(a, b);
            return this.inFrame = !0
        },paint: function() {
        }};
    extend(CAAT.CSSActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.AudioManager = function() {
        this.browserInfo = new CAAT.BrowserDetect;
        return this
    };
    CAAT.AudioManager.prototype = {browserInfo: null,musicEnabled: !0,fxEnabled: !0,audioCache: null,channels: null,workingChannels: null,loopingChannels: [],audioTypes: {mp3: "audio/mpeg;",ogg: 'audio/ogg; codecs="vorbis"',wav: 'audio/wav; codecs="1"',mp4: 'audio/mp4; codecs="mp4a.40.2"'},initialize: function(a) {
            this.audioCache = [];
            this.channels = [];
            this.workingChannels = [];
            for (var b = 0; b < a; b++) {
                var c = document.createElement("audio");
                if (null != c) {
                    c.finished = -1;
                    this.channels.push(c);
                    var d = this;
                    c.addEventListener("ended", function(a) {
                        a = a.target;
                        var b;
                        for (b = 0; b < d.workingChannels.length; b++)
                            if (d.workingChannels[b] == a) {
                                d.workingChannels.splice(b, 1);
                                break
                            }
                        a.caat_callback && a.caat_callback(a.caat_id);
                        d.channels.push(a)
                    }, !1)
                }
            }
            return this
        },addAudioFromURL: function(a, b, c) {
            var d = null, e = document.createElement("audio");
            if (null != e) {
                if (!e.canPlayType)
                    return !1;
                d = b.substr(b.lastIndexOf(".") + 1);
                d = e.canPlayType(this.audioTypes[d]);
                if (d !== "" && d !== "no") {
                    e.src =
                    b;
                    e.preload = "auto";
                    e.load();
                    if (c)
                        e.caat_callback = c, e.caat_id = a;
                    this.audioCache.push({id: a,audio: e});
                    return !0
                }
            }
            return !1
        },addAudioFromDomNode: function(a, b, c) {
            var d = b.src.substr(b.src.lastIndexOf(".") + 1);
            if (b.canPlayType(this.audioTypes[d])) {
                if (c)
                    b.caat_callback = c, b.caat_id = a;
                this.audioCache.push({id: a,audio: b});
                return !0
            }
            return !1
        },addAudioElement: function(a, b, c) {
            if (typeof b == "string")
                return this.addAudioFromURL(a, b, c);
            else
                try {
                    if (b instanceof HTMLAudioElement)
                        return this.addAudioFromDomNode(a, b, c)
                } catch (d) {
                }
            return !1
        },
        addAudio: function(a, b, c) {
            if (b instanceof Array)
                for (var d = 0; d < b.length; d++) {
                    if (this.addAudioElement(a, b[d], c))
                        break
                }
            else
                this.addAudioElement(a, b, c);
            return this
        },getAudio: function(a) {
            for (var b = 0; b < this.audioCache.length; b++)
                if (this.audioCache[b].id == a)
                    return this.audioCache[b].audio;
            return null
        },play: function(a) {
            if (!this.fxEnabled)
                return this;
            a = this.getAudio(a);
            if (null != a && this.channels.length > 0) {
                var b = this.channels.shift();
                b.src = a.src;
                b.load();
                b.play();
                this.workingChannels.push(b)
            }
            return this
        },loop: function(a) {
            if (!this.musicEnabled)
                return this;
            a = this.getAudio(a);
            if (null != a) {
                var b = document.createElement("audio");
                if (null != b)
                    return b.src = a.src, b.preload = "auto", this.browserInfo.browser == "Firefox" ? b.addEventListener("ended", function(a) {
                        a.target.currentTime = 0
                    }, !1) : b.loop = !0, b.load(), b.play(), this.loopingChannels.push(b), b
            }
            return null
        },endSound: function() {
            var a;
            for (a = 0; a < this.workingChannels.length; a++)
                this.workingChannels[a].pause(), this.channels.push(this.workingChannels[a]);
            for (a = 0; a < this.loopingChannels.length; a++)
                this.loopingChannels[a].pause();
            return this
        },setSoundEffectsEnabled: function(a) {
            this.fxEnabled = a;
            return this
        },isSoundEffectsEnabled: function() {
            return this.fxEnabled
        },setMusicEnabled: function(a) {
            this.musicEnabled = a;
            for (var b = 0; b < this.loopingChannels.length; b++)
                a ? this.loopingChannels[b].play() : this.loopingChannels[b].pause();
            return this
        },isMusicEnabled: function() {
            return this.musicEnabled
        }}
})();
(function() {
    CAAT.Dock = function() {
        CAAT.Dock.superclass.constructor.call(this);
        return this
    };
    CAAT.Dock.prototype = {scene: null,ttask: null,minSize: 0,maxSize: 0,range: 2,layoutOp: 0,OP_LAYOUT_BOTTOM: 0,OP_LAYOUT_TOP: 1,OP_LAYOUT_LEFT: 2,OP_LAYOUT_RIGHT: 3,setApplicationRange: function(a) {
            this.range = a;
            return this
        },setLayoutOp: function(a) {
            this.layoutOp = a;
            return this
        },setSizes: function(a, b) {
            this.minSize = a;
            this.maxSize = b;
            return this
        },layout: function() {
            var a;
            if (this.layoutOp == this.OP_LAYOUT_BOTTOM || this.layoutOp == this.OP_LAYOUT_TOP) {
                var b =
                0, c = 0;
                for (a = 0; a < this.getNumChildren(); a++)
                    b += this.getChildAt(a).width;
                c = (this.width - b) / 2;
                for (a = 0; a < this.getNumChildren(); a++)
                    b = this.getChildAt(a), b.x = c, c += b.width, b.y = this.layoutOp == this.OP_LAYOUT_BOTTOM ? this.maxSize - b.height : 0
            } else {
                for (a = c = b = 0; a < this.getNumChildren(); a++)
                    b += this.getChildAt(a).height;
                c = (this.height - b) / 2;
                for (a = 0; a < this.getNumChildren(); a++)
                    b = this.getChildAt(a), b.y = c, c += b.height, b.x = this.layoutOp == this.OP_LAYOUT_LEFT ? 0 : this.width - b.width
            }
        },mouseMove: function() {
            this.actorNotPointed()
        },
        mouseExit: function() {
            this.actorNotPointed()
        },actorNotPointed: function() {
            var a, b = this;
            for (a = 0; a < this.getNumChildren(); a++) {
                var c = this.getChildAt(a);
                c.emptyBehaviorList();
                c.addBehavior((new CAAT.GenericBehavior).setValues(c.width, this.minSize, c, "width").setFrameTime(this.scene.time, 250)).addBehavior((new CAAT.GenericBehavior).setValues(c.height, this.minSize, c, "height").setFrameTime(this.scene.time, 250));
                a == this.getNumChildren() - 1 && c.behaviorList[0].addListener({behaviorApplied: function(a, b, c, h) {
                        h.parent.layout()
                    },
                    behaviorExpired: function(d, e, f) {
                        for (a = 0; a < b.getNumChildren(); a++)
                            c = b.getChildAt(a), c.width = b.minSize, c.height = b.minSize;
                        f.parent.layout()
                    }})
            }
        },actorPointed: function(a, b, c) {
            var d = this.findChild(c), e = 0;
            e = this.layoutOp == this.OP_LAYOUT_BOTTOM || this.layoutOp == this.OP_LAYOUT_TOP ? a / c.width : b / c.height;
            for (a = 0; a < this.childrenList.length; a++)
                b = this.childrenList[a], b.emptyBehaviorList(), c = 0, c = a < d - this.range || a > d + this.range ? this.minSize : a == d ? this.maxSize : a < d ? this.minSize + (this.maxSize - this.minSize) * (Math.cos((a -
                d - e + 1) / this.range * Math.PI) + 1) / 2 : this.minSize + (this.maxSize - this.minSize) * (Math.cos((a - d - e) / this.range * Math.PI) + 1) / 2, b.height = c, b.width = c;
            this.layout()
        },actorMouseExit: function(a) {
            null != this.ttask && this.ttask.cancel();
            this.ttask = this.scene.createTimer(this.scene.time, 100, function() {
                a.source.parent.actorNotPointed()
            }, null, null)
        },actorMouseEnter: function() {
            if (null != this.ttask)
                this.ttask.cancel(), this.ttask = null
        },addChild: function(a) {
            var b = this;
            a.__Dock_mouseEnter = a.mouseEnter;
            a.__Dock_mouseExit = a.mouseExit;
            a.__Dock_mouseMove = a.mouseMove;
            a.mouseEnter = function(a) {
                b.actorMouseEnter(a);
                a.source.__Dock_mouseEnter(a)
            };
            a.mouseExit = function(a) {
                b.actorMouseExit(a);
                a.source.__Dock_mouseExit(a)
            };
            a.mouseMove = function(a) {
                b.actorPointed(a.point.x, a.point.y, a.source);
                a.source.__Dock_mouseMove(a)
            };
            return CAAT.Dock.superclass.addChild.call(this, a)
        }};
    extend(CAAT.Dock, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.Director = function() {
        CAAT.Director.superclass.constructor.call(this);
        this.browserInfo = new CAAT.BrowserDetect;
        this.audioManager = (new CAAT.AudioManager).initialize(8);
        this.scenes = [];
        this.mousePoint = new CAAT.Point(0, 0, 0);
        this.prevMousePoint = new CAAT.Point(0, 0, 0);
        this.screenMousePoint = new CAAT.Point(0, 0, 0);
        this.isMouseDown = !1;
        this.lastSelectedActor = null;
        this.dragging = !1;
        return this
    };
    CAAT.Director.prototype = {debug: !1,mousePoint: null,prevMousePoint: null,screenMousePoint: null,isMouseDown: !1,
        lastSelectedActor: null,dragging: !1,scenes: null,currentScene: null,canvas: null,crc: null,ctx: null,time: 0,timeline: 0,imagesCache: null,audioManager: null,clear: !0,transitionScene: null,browserInfo: null,gl: null,glEnabled: !1,glTtextureProgram: null,glColorProgram: null,pMatrix: null,coords: null,coordsIndex: 0,uv: null,uvIndex: 0,front_to_back: !1,currentTexturePage: 0,currentOpacity: 1,intervalId: null,frameCounter: 0,initialize: function(a, b, c) {
            c = c || document.createElement("canvas");
            c.width = a;
            c.height = b;
            this.setBounds(0,
            0, c.width, c.height);
            this.create();
            this.canvas = c;
            this.crc = this.ctx = c.getContext("2d");
            this.enableEvents();
            this.timeline = (new Date).getTime();
            this.transitionScene = (new CAAT.Scene).create().setBounds(0, 0, a, b);
            c = document.createElement("canvas");
            c.width = a;
            c.height = b;
            a = (new CAAT.ImageActor).create().setImage(c);
            this.transitionScene.ctx = c.getContext("2d");
            this.transitionScene.addChildImmediately(a);
            this.transitionScene.setEaseListener(this);
            return this
        },initializeGL: function(a, b, c) {
            c = c || document.createElement("canvas");
            c.width = a;
            c.height = b;
            try {
                this.gl = c.getContext("experimental-webgl"), this.gl.viewportWidth = c.width, this.gl.viewportHeight = c.height
            } catch (d) {
            }
            if (this.gl)
                this.setBounds(0, 0, c.width, c.height), this.create(), this.canvas = c, this.crc = this.ctx, this.enableEvents(), this.timeline = (new Date).getTime(), this.pMatrix = makePerspective(90, a / b, 0.1, 3E3, b), this.glColorProgram = (new CAAT.ColorProgram(this.gl)).create().initialize(), this.glColorProgram.setMatrixUniform(this.pMatrix), this.glTextureProgram = (new CAAT.TextureProgram(this.gl)).create().initialize(),
                this.glTextureProgram.setMatrixUniform(this.pMatrix), this.glTextureProgram.useProgram(), this.coords = new Float32Array(24576), this.uv = new Float32Array(16384), this.gl.clearColor(0, 0, 0, 255), this.front_to_back ? (this.gl.clearDepth(1), this.gl.enable(this.gl.DEPTH_TEST), this.gl.depthFunc(this.gl.LESS)) : this.gl.disable(this.gl.DEPTH_TEST), this.gl.enable(this.gl.BLEND), this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA), this.glEnabled = !0;
            else
                return this.initialize(a, b, c);
            return this
        },createScene: function() {
            var a =
            (new CAAT.Scene).create();
            this.addScene(a);
            return a
        },setImagesCache: function(a, b, c) {
            if (null != this.glTextureManager)
                this.glTextureManager.deletePages(), this.glTextureManager = null;
            this.imagesCache = a;
            if (this.glEnabled)
                b = b || 2048, c = c || 2048, this.glTextureManager = new CAAT.GLTexturePageManager, this.glTextureManager.createPages(this.gl, b, c, this.imagesCache), this.currentTexturePage = this.glTextureManager.pages[0], this.glTextureProgram.setTexture(this.currentTexturePage.texture)
        },setGLCurrentOpacity: function(a) {
            this.currentOpacity =
            a;
            this.glTextureProgram.setAlpha(a)
        },glRender: function(a, b, c) {
            a = a || this.coords;
            c = c || this.uv;
            b = b || this.coordsIndex;
            var d = this.gl;
            b = b / 12 * 2;
            this.glTextureProgram.updateVertexBuffer(a);
            this.glTextureProgram.updateUVBuffer(c);
            d.drawElements(d.TRIANGLES, 3 * b, d.UNSIGNED_SHORT, 0)
        },glFlush: function() {
            this.coordsIndex != 0 && this.glRender(this.coords, this.coordsIndex, this.uv);
            this.uvIndex = this.coordsIndex = 0
        },render: function(a) {
            this.time += a;
            this.setupRender(a);
            var b = this.childrenList.length, c, d;
            if (this.glEnabled) {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT |
                this.gl.DEPTH_BUFFER_BIT);
                for (c = this.uvIndex = this.coordsIndex = 0; c < b; c++) {
                    var e = this.childrenList[c];
                    if (e.isInAnimationFrame(this.time))
                        e.wdirty = !1, d = e.time - e.start_time, e.paintActorGL(this, d), e.time += a
                }
                this.glFlush()
            } else {
                this.ctx.globalAlpha = 1;
                this.ctx.globalCompositeOperation = "source-over";
                this.clear && this.ctx.clearRect(0, 0, this.width, this.height);
                for (c = 0; c < b; c++)
                    if (this.childrenList[c].isInAnimationFrame(this.time)) {
                        d = this.childrenList[c].time - this.childrenList[c].start_time;
                        this.ctx.save();
                        this.childrenList[c].paintActor(this,
                        d);
                        this.ctx.restore();
                        if (this.debug)
                            this.ctx.strokeStyle = "red", this.childrenList[c].drawScreenBoundingBox(this, d);
                        this.childrenList[c].time += a
                    }
            }
            this.endAnimate(this, a);
            this.frameCounter++
        },setupRender: function() {
            for (var a = 0; a < this.childrenList.length; a++)
                this.childrenList[a].animate(this, this.childrenList[a].time - this.childrenList[a].start_time);
            return this
        },renderToContext: function(a, b) {
            a.globalAlpha = 1;
            a.globalCompositeOperation = "source-over";
            a.clearRect(0, 0, this.width, this.height);
            a.setTransform(1,
            0, 0, 1, 0, 0);
            var c = this.ctx, d = this.crc;
            this.ctx = this.crc = a;
            b.isInAnimationFrame(this.time) && (a.save(), b.paintActor(this, b.time - b.start_time), a.restore());
            this.ctx = c;
            this.crc = d
        },addScene: function(a) {
            a.setBounds(0, 0, this.width, this.height);
            this.scenes.push(a);
            a.setEaseListener(this);
            null == this.currentScene && this.setScene(0)
        },getNumScenes: function() {
            return this.scenes.length
        },easeInOut: function(a, b, c, d, e, f, h, g, i, l) {
            if (a != this.getCurrentSceneIndex()) {
                a = this.scenes[a];
                d = this.scenes[d];
                if (!this.glEnabled)
                    this.renderToContext(this.transitionScene.ctx,
                    d), d = this.transitionScene;
                a.setExpired(!1);
                d.setExpired(!1);
                a.mouseEnabled = !1;
                d.mouseEnabled = !1;
                a.resetTransform();
                d.resetTransform();
                a.setLocation(0, 0);
                d.setLocation(0, 0);
                a.alpha = 1;
                d.alpha = 1;
                b == CAAT.Scene.prototype.EASE_ROTATION ? a.easeRotationIn(h, g, c, i) : b == CAAT.Scene.prototype.EASE_SCALE ? a.easeScaleIn(0, h, g, c, i) : a.easeTranslationIn(h, g, c, i);
                e == CAAT.Scene.prototype.EASE_ROTATION ? d.easeRotationOut(h, g, f, l) : e == CAAT.Scene.prototype.EASE_SCALE ? d.easeScaleOut(0, h, g, f, l) : d.easeTranslationOut(h, g, f, l);
                this.childrenList = [];
                this.addChild(d);
                this.addChild(a)
            }
        },easeInOutRandom: function(a, b, c, d) {
            var e = Math.random(), f = Math.random(), h;
            e < 0.33 ? (e = CAAT.Scene.prototype.EASE_ROTATION, h = (new CAAT.Interpolator).createExponentialInOutInterpolator(4)) : e < 0.66 ? (e = CAAT.Scene.prototype.EASE_SCALE, h = (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4)) : (e = CAAT.Scene.prototype.EASE_TRANSLATE, h = (new CAAT.Interpolator).createBounceOutInterpolator());
            var g;
            f < 0.33 ? (f = CAAT.Scene.prototype.EASE_ROTATION, g = (new CAAT.Interpolator).createExponentialInOutInterpolator(4)) :
            f < 0.66 ? (f = CAAT.Scene.prototype.EASE_SCALE, g = (new CAAT.Interpolator).createExponentialOutInterpolator(4)) : (f = CAAT.Scene.prototype.EASE_TRANSLATE, g = (new CAAT.Interpolator).createBounceOutInterpolator());
            this.easeInOut(a, e, Math.random() * 8.99 >> 0, b, f, Math.random() * 8.99 >> 0, c, d, h, g)
        },easeIn: function(a, b, c, d, e, f) {
            a = this.scenes[a];
            b == CAAT.Scene.prototype.EASE_ROTATION ? a.easeRotationIn(c, d, e, f) : b == CAAT.Scene.prototype.EASE_SCALE ? a.easeScaleIn(0, c, d, e, f) : a.easeTranslationIn(c, d, e, f);
            this.childrenList = [];
            this.addChild(a);
            a.resetTransform();
            a.setLocation(0, 0);
            a.alpha = 1;
            a.mouseEnabled = !1;
            a.setExpired(!1)
        },setScene: function(a) {
            a = this.scenes[a];
            this.childrenList = [];
            this.addChild(a);
            this.currentScene = a;
            a.setExpired(!1);
            a.mouseEnabled = !0;
            a.resetTransform();
            a.setLocation(0, 0);
            a.alpha = 1;
            a.activated()
        },switchToScene: function(a, b, c, d) {
            var e = this.getSceneIndex(this.currentScene);
            d ? this.easeInOutRandom(a, e, b, c) : this.setScene(a)
        },switchToPrevScene: function(a, b, c) {
            var d = this.getSceneIndex(this.currentScene);
            this.getNumScenes() <=
            1 || d == 0 || (c ? this.easeInOutRandom(d - 1, d, a, b) : this.setScene(d - 1))
        },switchToNextScene: function(a, b, c) {
            var d = this.getSceneIndex(this.currentScene);
            this.getNumScenes() <= 1 || d == this.getNumScenes() - 1 || (c ? this.easeInOutRandom(d + 1, d, a, b) : this.setScene(d + 1))
        },mouseEnter: function() {
        },mouseExit: function() {
        },mouseMove: function() {
        },mouseDown: function() {
        },mouseUp: function() {
        },mouseDrag: function() {
        },easeEnd: function(a, b) {
            b ? (this.currentScene = a, this.currentScene.activated()) : a.setExpired(!0);
            a.mouseEnabled = !0;
            a.emptyBehaviorList()
        },
        getSceneIndex: function(a) {
            for (var b = 0; b < this.scenes.length; b++)
                if (this.scenes[b] == a)
                    return b;
            return -1
        },getScene: function(a) {
            return this.scenes[a]
        },getCurrentSceneIndex: function() {
            return this.getSceneIndex(this.currentScene)
        },getBrowserName: function() {
            return this.browserInfo.browser
        },getBrowserVersion: function() {
            return this.browserInfo.version
        },getOSName: function() {
            return this.browserInfo.OS
        },getImage: function(a) {
            for (var b = 0; b < this.imagesCache.length; b++)
                if (this.imagesCache[b].id == a)
                    return this.imagesCache[b].image;
            return null
        },addAudio: function(a, b) {
            this.audioManager.addAudio(a, b);
            return this
        },audioPlay: function(a) {
            this.audioManager.play(a)
        },audioLoop: function(a) {
            return this.audioManager.loop(a)
        },emptyScenes: function() {
            this.scenes = []
        },addChild: function(a) {
            a.parent = this;
            this.childrenList.push(a)
        },loop: function(a, b) {
            a = 1E3 / (a || 30);
            var c = this, d = function() {
                var a = (new Date).getTime(), d = a - c.timeline;
                c.render(d);
                c.timeline = a;
                b && b(c, d)
            };
            d();
            this.interval = setInterval(d, a)
        },endLoop: function() {
            clearInterval(this.interval)
        },
        setClear: function(a) {
            this.clear = a;
            return this
        },getAudioManager: function() {
            return this.audioManager
        },getCanvasCoord: function(a, b) {
            var c = 0, d = 0;
            if (!b)
                b = window.event;
            if (b.pageX || b.pageY)
                c = b.pageX, d = b.pageY;
            else if (b.clientX || b.clientY)
                c = b.clientX + document.body.scrollLeft + document.documentElement.scrollLeft, d = b.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            for (var e = b.target; !1 == e instanceof HTMLBodyElement; ) {
                if (e.offsetLeft != 0 && e.offsetTop != 0) {
                    c -= e.offsetLeft;
                    d -= e.offsetTop;
                    break
                }
                e =
                e.parentNode ? e.parentNode : e.parentElement
            }
            a.set(c, d);
            this.screenMousePoint.set(c, d)
        },enableEvents: function() {
            function a(a) {
                var b = a.changedTouches[0], f = "";
                switch (a.type) {
                    case "touchstart":
                        f = "mousedown";
                        break;
                    case "touchmove":
                        f = "mousemove";
                        break;
                    case "touchend":
                        f = "mouseup";
                        break;
                    default:
                        return
                }
                var h = document.createEvent("MouseEvent");
                h.initMouseEvent(f, !0, !0, c.canvas, 1, b.screenX, b.screenY, b.clientX, b.clientY, !1, !1, !1, !1, 0, null);
                c.canvas.dispatchEvent(h);
                a.preventDefault()
            }
            CAAT.RegisterDirector(this);
            var b = this.canvas, c = this;
            b.addEventListener("mouseup", function(a) {
                c.isMouseDown = !1;
                c.getCanvasCoord(c.mousePoint, a);
                var b;
                null != c.lastSelectedActor && (b = c.lastSelectedActor.viewToModel(new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0)), c.lastSelectedActor.mouseUp((new CAAT.MouseEvent).init(b.x, b.y, a, c.lastSelectedActor, c.screenMousePoint)));
                c.dragging ? c.dragging = !1 : null != c.lastSelectedActor && c.lastSelectedActor.mouseClick((new CAAT.MouseEvent).init(b.x, b.y, a, c.lastSelectedActor, c.screenMousePoint))
            },
            !1);
            b.addEventListener("mousedown", function(a) {
                c.getCanvasCoord(c.mousePoint, a);
                c.isMouseDown = !0;
                c.lastSelectedActor = c.findActorAtPosition(c.mousePoint, new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0));
                var b = c.mousePoint.x, f = c.mousePoint.y;
                if (null != c.lastSelectedActor)
                    c.lastSelectedActor.viewToModel(c.mousePoint), c.prevMousePoint.x = b, c.prevMousePoint.y = f, c.lastSelectedActor.mouseDown((new CAAT.MouseEvent).init(c.mousePoint.x, c.mousePoint.y, a, c.lastSelectedActor, c.screenMousePoint))
            }, !1);
            b.addEventListener("mouseover",
            function(a) {
                c.getCanvasCoord(c.mousePoint, a);
                c.lastSelectedActor = c.findActorAtPosition(c.mousePoint, new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0));
                if (null != c.lastSelectedActor) {
                    var b = new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0);
                    c.lastSelectedActor.viewToModel(b);
                    c.lastSelectedActor.mouseEnter((new CAAT.MouseEvent).init(b.x, b.y, a, c.lastSelectedActor, c.screenMousePoint))
                }
            }, !1);
            b.addEventListener("mouseout", function(a) {
                if (null != c.lastSelectedActor) {
                    c.getCanvasCoord(c.mousePoint, a);
                    var b = new CAAT.Point(c.mousePoint.x,
                    c.mousePoint.y, 0);
                    c.lastSelectedActor.viewToModel(b);
                    c.lastSelectedActor.mouseExit((new CAAT.MouseEvent).init(b.x, b.y, a, c.lastSelectedActor, c.screenMousePoint));
                    c.lastSelectedActor = null
                }
                c.isMouseDown = !1
            }, !1);
            b.addEventListener("mousemove", function(a) {
                c.getCanvasCoord(c.mousePoint, a);
                if (c.isMouseDown && null != c.lastSelectedActor) {
                    if (c.dragging || !(Math.abs(c.prevMousePoint.x - c.mousePoint.x) < CAAT.DRAG_THRESHOLD_X && Math.abs(c.prevMousePoint.y - c.mousePoint.y) < CAAT.DRAG_THRESHOLD_Y))
                        c.dragging = !0, null != c.lastSelectedActor.parent &&
                        c.lastSelectedActor.parent.viewToModel(c.mousePoint), c.lastSelectedActor.mouseDrag((new CAAT.MouseEvent).init(c.mousePoint.x, c.mousePoint.y, a, c.lastSelectedActor, c.screenMousePoint))
                } else {
                    var b = c.findActorAtPosition(c.mousePoint, new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0)), f = b.viewToModel(new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0));
                    if (b != c.lastSelectedActor) {
                        if (null != c.lastSelectedActor) {
                            var h = c.lastSelectedActor.viewToModel(new CAAT.Point(c.mousePoint.x, c.mousePoint.y, 0));
                            c.lastSelectedActor.mouseExit((new CAAT.MouseEvent).init(h.x,
                            h.y, a, c.lastSelectedActor, c.screenMousePoint))
                        }
                        null != b && b.mouseEnter((new CAAT.MouseEvent).init(f.x, f.y, a, b, c.screenMousePoint))
                    }
                    c.lastSelectedActor = b;
                    null != b && c.lastSelectedActor.mouseMove((new CAAT.MouseEvent).init(f.x, f.y, a, c.lastSelectedActor, c.screenMousePoint))
                }
            }, !1);
            b.addEventListener("dblclick", function(a) {
                c.getCanvasCoord(c.mousePoint, a);
                null != c.lastSelectedActor && (c.lastSelectedActor.viewToModel(c.mousePoint.x, c.mousePoint.y), c.lastSelectedActor.mouseDblClick((new CAAT.MouseEvent).init(c.mousePoint.x,
                c.mousePoint.y, a, c.lastSelectedActor, c.screenMousePoint)))
            }, !1);
            b.addEventListener("touchstart", a, !0);
            b.addEventListener("touchmove", a, !0);
            b.addEventListener("touchend", a, !0);
            b.addEventListener("touchcancel", a, !0)
        }};
    extend(CAAT.Director, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.MouseEvent = function() {
        this.point = new CAAT.Point(0, 0, 0);
        this.screenPoint = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.MouseEvent.prototype = {screenPoint: null,point: null,time: 0,source: null,shift: !1,control: !1,alt: !1,meta: !1,sourceEvent: null,init: function(a, b, c, d, e) {
            this.point.set(a, b);
            this.source = d;
            this.screenPoint = e;
            this.alt = c.altKey;
            this.control = c.ctrlKey;
            this.shift = c.shiftKey;
            this.meta = c.metaKey;
            this.sourceEvent = c;
            return this
        },isAltDown: function() {
            return this.alt
        },isControlDown: function() {
            return this.control
        },
        isShiftDown: function() {
            return this.shift
        },isMetaDown: function() {
            return this.meta
        },getSourceEvent: function() {
            return this.sourceEvent
        }}
})();
CAAT.GlobalEventsEnabled = !1;
CAAT.prevOnDeviceMotion = null;
CAAT.onDeviceMotion = null;
CAAT.accelerationIncludingGravity = {x: 0,y: 0,z: 0};
CAAT.rotationRate = {alpha: 0,beta: 0,gamma: 0};
CAAT.DRAG_THRESHOLD_X = 5;
CAAT.DRAG_THRESHOLD_Y = 5;
CAAT.keyListeners = [];
CAAT.registerKeyListener = function(a) {
    CAAT.keyListeners.push(a)
};
CAAT.GlobalEnableEvents = function() {
    if (!CAAT.GlobalEventsEnabled)
        this.GlobalEventsEnabled = !0, window.addEventListener("keydown", function(a) {
            a = a.which ? a.which : a.keyCode;
            for (var b = 0; b < CAAT.keyListeners.length; b++)
                CAAT.keyListeners[b](a, "down")
        }, !1), window.addEventListener("keyup", function(a) {
            a = a.which ? a.which : a.keyCode;
            for (var b = 0; b < CAAT.keyListeners.length; b++)
                CAAT.keyListeners[b](a, "up")
        }, !1)
};
CAAT.RegisterDirector = function() {
    if (!CAAT.director)
        CAAT.director = [];
    CAAT.director.push(this);
    CAAT.GlobalEnableEvents()
};
(function() {
    try {
        if (window.DeviceMotionEvent != void 0)
            CAAT.prevOnDeviceMotion = window.ondevicemotion, window.ondevicemotion = CAAT.onDeviceMotion = function(a) {
                CAAT.accelerationIncludingGravity = {x: a.accelerationIncludingGravity.x,y: a.accelerationIncludingGravity.y,z: a.accelerationIncludingGravity.z};
                if (a.rotationRate)
                    CAAT.rotationRate = {alpha: a.rotationRate.alpha,beta: a.rotationRate.beta,gamma: a.rotationRate.gamma}
            }
    } catch (a) {
    }
})();
(function() {
    CAAT.CompoundImage = function() {
        return this
    };
    CAAT.CompoundImage.prototype = {NORMAL: 1,INV_VERTICAL: 2,INV_HORIZONTAL: 4,INV_VERTICAL_AND_HORIZONTAL: 8,image: null,rows: 0,cols: 0,width: 0,height: 0,singleWidth: 0,singleHeight: 0,xyCache: null,initialize: function(a, b, c) {
            this.image = a;
            this.rows = b;
            this.cols = c;
            this.width = a.width;
            this.height = a.height;
            this.singleWidth = Math.floor(this.width / c);
            this.singleHeight = Math.floor(this.height / b);
            this.xyCache = [];
            var d, e;
            if (a.__texturePage) {
                a.__du = this.singleWidth / a.__texturePage.width;
                a.__dv = this.singleHeight / a.__texturePage.height;
                d = this.singleWidth;
                e = this.singleHeight;
                var f = this.cols;
                if (a.inverted)
                    a = d, d = e, e = a, f = this.rows;
                var h = this.image.__tx, g = this.image.__ty, i = this.image.__texturePage;
                for (a = 0; a < b * c; a++) {
                    var l = h + (a % f >> 0) * d, k = g + (a / f >> 0) * e, m = l + d, n = k + e;
                    this.xyCache.push([l / i.width, k / i.height, m / i.width, n / i.height, l, k, m, n])
                }
            } else
                for (a = 0; a < b * c; a++)
                    d = (a % this.cols | 0) * this.singleWidth, e = (a / this.cols | 0) * this.singleHeight, this.xyCache.push([d, e]);
            return this
        },paintInvertedH: function(a,
        b, c, d) {
            a.save();
            a.translate((0.5 + c | 0) + this.singleWidth, 0.5 + d | 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },paintInvertedV: function(a, b, c, d) {
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },
        paintInvertedHV: function(a, b, c, d) {
            a.save();
            a.translate(c + 0.5 | 0, 0.5 + d + this.singleHeight | 0);
            a.scale(1, -1);
            a.translate(this.singleWidth, 0);
            a.scale(-1, 1);
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, 0, 0, this.singleWidth, this.singleHeight);
            a.restore();
            return this
        },paint: function(a, b, c, d) {
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, c + 0.5 | 0, d + 0.5 | 0, this.singleWidth, this.singleHeight);
            return this
        },paintScaled: function(a,
        b, c, d, e, f) {
            a.drawImage(this.image, this.xyCache[b][0], this.xyCache[b][1], this.singleWidth, this.singleHeight, c + 0.5 | 0, d + 0.5 | 0, e, f);
            return this
        },getNumImages: function() {
            return this.rows * this.cols
        },setUV: function(a, b, c) {
            var d = this.image;
            d.__texturePage && (d.inverted ? (b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][1]) : (b[c++] = this.xyCache[a][0], b[c++] =
            this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][1], b[c++] = this.xyCache[a][2], b[c++] = this.xyCache[a][3], b[c++] = this.xyCache[a][0], b[c++] = this.xyCache[a][3]))
        }}
})();
(function() {
    CAAT.ImagePreloader = function() {
        this.images = [];
        return this
    };
    CAAT.ImagePreloader.prototype = {images: null,notificationCallback: null,imageCounter: 0,loadImages: function(a, b) {
            var c = this;
            this.notificationCallback = b;
            this.images = [];
            for (var d = 0; d < a.length; d++)
                this.images.push({id: a[d].id,image: new Image}), this.images[d].image.onload = function() {
                    c.imageCounter++;
                    c.notificationCallback.call(this, c.imageCounter, c.images)
                }, this.images[d].image.src = a[d].url
        }}
})();
(function() {
    CAAT.TimerTask = function() {
        return this
    };
    CAAT.TimerTask.prototype = {startTime: 0,duration: 0,callback_timeout: null,callback_tick: null,callback_cancel: null,scene: null,taskId: 0,remove: !1,create: function(a, b, c, d, e) {
            this.startTime = a;
            this.duration = b;
            this.callback_timeout = c;
            this.callback_tick = d;
            this.callback_cancel = e;
            return this
        },checkTask: function(a) {
            var b = a;
            b -= this.startTime;
            b >= this.duration ? (this.remove = !0, this.callback_timeout && this.callback_timeout(a, b, this)) : this.callback_tick && this.callback_tick(a,
            b, this);
            return this
        },reset: function(a) {
            this.remove = !1;
            this.startTime = a;
            this.scene.ensureTimerTask(this);
            return this
        },cancel: function() {
            this.remove = !0;
            null != this.callback_cancel && this.callback_cancel(this.scene.time, this.scene.time - this.startTime, this);
            return this
        }}
})();
(function() {
    CAAT.Scene = function() {
        CAAT.Scene.superclass.constructor.call(this);
        this.timerList = [];
        this.fillStyle = null;
        return this
    };
    CAAT.Scene.prototype = {easeContainerBehaviour: null,easeContainerBehaviourListener: null,easeIn: !1,EASE_ROTATION: 1,EASE_SCALE: 2,EASE_TRANSLATE: 3,timerList: null,timerSequence: 0,checkTimers: function(a) {
            for (var b = this.timerList.length - 1; b >= 0; )
                this.timerList[b].remove || this.timerList[b].checkTask(a), b--
        },ensureTimerTask: function(a) {
            this.hasTimer(a) || this.timerList.push(a);
            return this
        },
        hasTimer: function(a) {
            for (var b = this.timerList.length - 1; b >= 0; ) {
                if (this.timerList[b] == a)
                    return !0;
                b--
            }
            return !1
        },createTimer: function(a, b, c, d, e) {
            a = (new CAAT.TimerTask).create(a, b, c, d, e);
            a.taskId = this.timerSequence++;
            a.sceneTime = this.time;
            a.scene = this;
            this.timerList.push(a);
            return a
        },removeExpiredTimers: function() {
            var a;
            for (a = 0; a < this.timerList.length; a++)
                this.timerList[a].remove && this.timerList.splice(a, 1)
        },animate: function(a, b) {
            this.checkTimers(b);
            CAAT.Scene.superclass.animate.call(this, a, b);
            this.removeExpiredTimers()
        },
        createAlphaBehaviour: function(a, b) {
            var c = new CAAT.AlphaBehavior;
            c.setFrameTime(0, a);
            c.startAlpha = b ? 0 : 1;
            c.endAlpha = b ? 1 : 0;
            this.easeContainerBehaviour.addBehavior(c)
        },easeTranslationIn: function(a, b, c, d) {
            this.easeTranslation(a, b, c, !0, d)
        },easeTranslationOut: function(a, b, c, d) {
            this.easeTranslation(a, b, c, !1, d)
        },easeTranslation: function(a, b, c, d, e) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            this.easeIn = d;
            var f = new CAAT.PathBehavior;
            e && f.setInterpolator(e);
            f.setFrameTime(0, a);
            c < 1 ? c = 1 : c > 4 && (c = 4);
            switch (c) {
                case CAAT.Actor.prototype.ANCHOR_TOP:
                    d ? f.setPath((new CAAT.Path).setLinear(0, -this.height, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, 0, -this.height));
                    break;
                case CAAT.Actor.prototype.ANCHOR_BOTTOM:
                    d ? f.setPath((new CAAT.Path).setLinear(0, this.height, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, 0, this.height));
                    break;
                case CAAT.Actor.prototype.ANCHOR_LEFT:
                    d ? f.setPath((new CAAT.Path).setLinear(-this.width, 0, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, -this.width, 0));
                    break;
                case CAAT.Actor.prototype.ANCHOR_RIGHT:
                    d ?
                    f.setPath((new CAAT.Path).setLinear(this.width, 0, 0, 0)) : f.setPath((new CAAT.Path).setLinear(0, 0, this.width, 0))
            }
            b && this.createAlphaBehaviour(a, d);
            this.easeContainerBehaviour.addBehavior(f);
            this.easeContainerBehaviour.setFrameTime(this.time, a);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },easeScaleIn: function(a, b, c, d, e) {
            this.easeScale(a, b, c, d, !0, e);
            this.easeIn = !0
        },easeScaleOut: function(a, b, c, d, e) {
            this.easeScale(a,
            b, c, d, !1, e);
            this.easeIn = !1
        },easeScale: function(a, b, c, d, e, f) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            var h = 0, g = 0, i = 0, l = 0;
            switch (d) {
                case CAAT.Actor.prototype.ANCHOR_TOP_LEFT:
                case CAAT.Actor.prototype.ANCHOR_TOP_RIGHT:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM_LEFT:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM_RIGHT:
                case CAAT.Actor.prototype.ANCHOR_CENTER:
                    l = i = 1;
                    break;
                case CAAT.Actor.prototype.ANCHOR_TOP:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM:
                    i = h = 1;
                    g = 0;
                    l = 1;
                    break;
                case CAAT.Actor.prototype.ANCHOR_LEFT:
                case CAAT.Actor.prototype.ANCHOR_RIGHT:
                    l =
                    g = 1;
                    h = 0;
                    i = 1;
                    break;
                default:
                    alert("scale anchor ?? " + d)
            }
            if (!e) {
                var k;
                k = h;
                h = i;
                i = k;
                k = g;
                g = l;
                l = k
            }
            c && this.createAlphaBehaviour(b, e);
            c = new CAAT.ScaleBehavior;
            c.setFrameTime(a, b);
            c.startScaleX = h;
            c.startScaleY = g;
            c.endScaleX = i;
            c.endScaleY = l;
            c.anchor = d;
            f && c.setInterpolator(f);
            this.easeContainerBehaviour.addBehavior(c);
            this.easeContainerBehaviour.setFrameTime(this.time, b);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },
        addBehavior: function() {
            return this
        },easeRotationIn: function(a, b, c, d) {
            this.easeRotation(a, b, c, !0, d);
            this.easeIn = !0
        },easeRotationOut: function(a, b, c, d) {
            this.easeRotation(a, b, c, !1, d);
            this.easeIn = !1
        },easeRotation: function(a, b, c, d, e) {
            this.easeContainerBehaviour = new CAAT.ContainerBehavior;
            var f = 0, h = 0;
            switch (c) {
                case CAAT.Actor.prototype.ANCHOR_CENTER:
                    c = CAAT.Actor.prototype.ANCHOR_TOP;
                case CAAT.Actor.prototype.ANCHOR_TOP:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM:
                case CAAT.Actor.prototype.ANCHOR_LEFT:
                case CAAT.Actor.prototype.ANCHOR_RIGHT:
                    f =
                    Math.PI * (Math.random() < 0.5 ? 1 : -1);
                    break;
                case CAAT.Actor.prototype.ANCHOR_TOP_LEFT:
                case CAAT.Actor.prototype.ANCHOR_TOP_RIGHT:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM_LEFT:
                case CAAT.Actor.prototype.ANCHOR_BOTTOM_RIGHT:
                    f = Math.PI / 2 * (Math.random() < 0.5 ? 1 : -1);
                    break;
                default:
                    alert("rot anchor ?? " + c)
            }
            if (!1 == d) {
                var g = f;
                f = h;
                h = g
            }
            b && this.createAlphaBehaviour(a, d);
            b = new CAAT.RotateBehavior;
            b.setFrameTime(0, a);
            b.startAngle = f;
            b.endAngle = h;
            b.anchor = c;
            e && b.setInterpolator(e);
            this.easeContainerBehaviour.addBehavior(b);
            this.easeContainerBehaviour.setFrameTime(this.time, a);
            this.easeContainerBehaviour.addListener(this);
            this.emptyBehaviorList();
            CAAT.Scene.superclass.addBehavior.call(this, this.easeContainerBehaviour)
        },setEaseListener: function(a) {
            this.easeContainerBehaviourListener = a
        },behaviorExpired: function() {
            this.easeContainerBehaviourListener.easeEnd(this, this.easeIn)
        },activated: function() {
        },setExpired: function(a) {
            this.expired = a
        },paint: function(a) {
            if (this.fillStyle)
                a = a.crc, a.fillStyle = this.fillStyle, a.fillRect(0,
                0, this.width, this.height)
        }};
    extend(CAAT.Scene, CAAT.ActorContainer, null)
})();
CAAT.modules = CAAT.modules || {};
CAAT.modules.CircleManager = CAAT.modules.CircleManager || {};
(function() {
    CAAT.modules.CircleManager.PackedCircle = function() {
        this.boundsRule = CAAT.modules.CircleManager.PackedCircle.BOUNDS_RULE_IGNORE;
        this.position = new CAAT.Point(0, 0, 0);
        this.offset = new CAAT.Point(0, 0, 0);
        this.targetPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.modules.CircleManager.PackedCircle.prototype = {id: 0,delegate: null,position: new CAAT.Point(0, 0, 0),offset: new CAAT.Point(0, 0, 0),targetPosition: null,targetChaseSpeed: 0.02,isFixed: !1,boundsRule: 0,collisionMask: 0,collisionGroup: 0,BOUNDS_RULE_WRAP: 1,
        BOUNDS_RULE_CONSTRAINT: 2,BOUNDS_RULE_DESTROY: 4,BOUNDS_RULE_IGNORE: 8,containsPoint: function(a) {
            return this.position.getDistanceSquared(a) < this.radiusSquared
        },getDistanceSquaredFromPosition: function(a) {
            return this.position.getDistanceSquared(a) < this.radiusSquared
        },intersects: function(a) {
            var b = this.position.getDistanceSquared(a.position);
            return b < this.radiusSquared || b < a.radiusSquared
        },setPosition: function(a) {
            this.position = a;
            return this
        },setDelegate: function(a) {
            this.delegate = a;
            return this
        },setOffset: function(a) {
            this.offset =
            a;
            return this
        },setTargetPosition: function(a) {
            this.targetPosition = a;
            return this
        },setTargetChaseSpeed: function(a) {
            this.targetChaseSpeed = a;
            return this
        },setIsFixed: function(a) {
            this.isFixed = a;
            return this
        },setCollisionMask: function(a) {
            this.collisionMask = a;
            return this
        },setCollisionGroup: function(a) {
            this.collisionGroup = a;
            return this
        },setRadius: function(a) {
            this.radius = a;
            this.radiusSquared = this.radius * this.radius;
            return this
        },initialize: function(a) {
            if (a)
                for (var b in a)
                    this[b] = a[b];
            return this
        },dealloc: function() {
            this.targetPosition =
            this.delegate = this.offset = this.position = null
        }}
})();
(function() {
    CAAT.modules.CircleManager.PackedCircleManager = function() {
        return this
    };
    CAAT.modules.CircleManager.PackedCircleManager.prototype = {allCircles: [],numberOfCollisionPasses: 1,numberOfTargetingPasses: 0,bounds: new CAAT.Rectangle,addCircle: function(a) {
            a.id = this.allCircles.length;
            this.allCircles.push(a);
            return this
        },removeCircle: function(a) {
            var b = 0, c = !1, d = this.allCircles.length;
            if (d === 0)
                throw "Error: (PackedCircleManager) attempting to remove circle, and allCircles.length === 0!!";
            for (; d--; )
                if (this.allCircles[d] ===
                a) {
                    c = !0;
                    b = d;
                    break
                }
            if (!c)
                throw "Could not locate circle in allCircles array!";
            this.allCircles[b].dealloc();
            this.allCircles[b] = null;
            return this
        },forceCirclesToMatchDelegatePositions: function() {
            for (var a = this.allCircles.length, b = 0; b < a; b++) {
                var c = this.allCircles[b];
                c && c.delegate && c.position.set(c.delegate.x + c.offset.x, c.delegate.y + c.offset.y)
            }
        },pushAllCirclesTowardTarget: function() {
            for (var a = new CAAT.Point(0, 0, 0), b = this.allCircles, c = b.length, d = 0; d < this.numberOfTargetingPasses; d++)
                for (var e = 0; e < c; e++) {
                    var f =
                    b[e];
                    if (!f.isFixed)
                        a.x = f.position.x - (f.targetPosition.x + f.offset.x), a.y = f.position.y - (f.targetPosition.y + f.offset.y), a.multiply(f.targetChaseSpeed), f.position.x -= a.x, f.position.y -= a.y
                }
        },handleCollisions: function() {
            this.removeExpiredElements();
            for (var a = new CAAT.Point(0, 0, 0), b = this.allCircles, c = b.length, d = 0; d < this.numberOfCollisionPasses; d++)
                for (var e = 0; e < c; e++)
                    for (var f = b[e], h = e + 1; h < c; h++) {
                        var g = b[h];
                        if (this.circlesCanCollide(f, g)) {
                            var i = g.position.x - f.position.x, l = g.position.y - f.position.y, k = (f.radius +
                            g.radius) * 1.08, m = f.position.getDistanceSquared(g.position);
                            if (m < k * k - 0.02)
                                a.x = i, a.y = l, a.normalize(), a.multiply((k - Math.sqrt(m)) * 0.5), g.isFixed || (f.isFixed && a.multiply(2.2), g.position.translatePoint(a)), f.isFixed || (g.isFixed && a.multiply(2.2), f.position.subtract(a))
                        }
                    }
        },handleBoundaryForCircle: function(a, b) {
            var c = a.position.x, d = a.position.y, e = a.radius, f = e * 2;
            b = 12;
            if (b & 1 && c - f > this.bounds.right)
                a.position.x = this.bounds.left + e;
            else if (b & 1 && c + f < this.bounds.left)
                a.position.x = this.bounds.right - e;
            if (b & 4 && d - f >
            this.bounds.bottom)
                a.position.y = this.bounds.top - e;
            else if (b & 4 && d + f < this.bounds.top)
                a.position.y = this.bounds.bottom + e;
            if (b & 8 && c + e >= this.bounds.right)
                a.position.x = a.position.x = this.bounds.right - e;
            else if (b & 8 && c - e < this.bounds.left)
                a.position.x = this.bounds.left + e;
            if (b & 16 && d + e > this.bounds.bottom)
                a.position.y = this.bounds.bottom - e;
            else if (b & 16 && d - e < this.bounds.top)
                a.position.y = this.bounds.top + e
        },getCircleAt: function(a, b, c) {
            var d = this.allCircles, e = d.length;
            a = new CAAT.Point(a, b, 0);
            b = null;
            for (var f = Number.MAX_VALUE,
            h = 0; h < e; h++) {
                var g = d[h];
                if (g) {
                    var i = g.position.getDistanceSquared(a);
                    i < f && i < g.radiusSquared + c && (f = i, b = g)
                }
            }
            return b
        },circlesCanCollide: function(a, b) {
            if (!a || !b || a === b)
                return !1;
            return !0
        },setBounds: function(a, b, c, d) {
            this.bounds.x = a;
            this.bounds.y = b;
            this.bounds.width = c;
            this.bounds.height = d
        },setNumberOfCollisionPasses: function(a) {
            this.numberOfCollisionPasses = a;
            return this
        },setNumberOfTargetingPasses: function(a) {
            this.numberOfTargetingPasses = a;
            return this
        },sortOnDistanceToTarget: function(a, b) {
            var c = a.getDistanceSquaredFromPosition(a.targetPosition),
            d = b.getDistanceSquaredFromPosition(a.targetPosition), e = 0;
            c > d ? e = -1 : c < d && (e = 1);
            return e
        },removeExpiredElements: function() {
            for (var a = this.allCircles.length; a >= 0; a--)
                this.allCircles[a] === null && this.allCircles.splice(a, 1)
        },initialize: function(a) {
            if (a)
                for (var b in a)
                    this[b] = a[b];
            return this
        }}
})();
(function() {
    CAAT.modules.LocalStorage = function() {
        return this
    };
    CAAT.modules.LocalStorage.prototype = {save: function(a, b) {
            try {
                localStorage.setItem(a, JSON.stringify(b))
            } catch (c) {
            }
            return this
        },load: function(a) {
            try {
                return JSON.parse(localStorage.getItem(a))
            } catch (b) {
                return null
            }
        },remove: function(a) {
            try {
                localStorage.removeItem(a)
            } catch (b) {
            }
            return this
        }}
})();
(function() {
    CAAT.modules.ImageUtil = function() {
        return this
    };
    CAAT.modules.ImageUtil.prototype = {createAlphaSpriteSheet: function(a, b, c, d) {
            if (a < b) {
                var e = a;
                a = b;
                b = e
            }
            e = document.createElement("canvas");
            e.width = d.width;
            e.height = d.height * c;
            var f = e.getContext("2d");
            f.fillStyle = "rgba(255,255,255,0)";
            f.clearRect(0, 0, d.width, d.height * c);
            var h;
            for (h = 0; h < c; h++)
                f.globalAlpha = 1 - (a - b) / c * h, f.drawImage(d, 0, h * d.height);
            return e
        }}
})();
(function() {
    CAAT.Interpolator = function() {
        this.interpolated = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.Interpolator.prototype = {interpolated: null,paintScale: 90,createLinearInterpolator: function(a, b) {
            this.getPosition = function(c) {
                var d = c;
                a && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                b != null && b && (c = 1 - c);
                return this.interpolated.set(d, c)
            };
            return this
        },createBackOutInterpolator: function(a) {
            this.getPosition = function(b) {
                var c = b;
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                b -= 1;
                return this.interpolated.set(c, b * b * (2.70158 * b + 1.70158) + 1)
            };
            return this
        },
        createExponentialInInterpolator: function(a, b) {
            this.getPosition = function(c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                return this.interpolated.set(d, Math.pow(c, a))
            };
            return this
        },createExponentialOutInterpolator: function(a, b) {
            this.getPosition = function(c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                return this.interpolated.set(d, 1 - Math.pow(1 - c, a))
            };
            return this
        },createExponentialInOutInterpolator: function(a, b) {
            this.getPosition = function(c) {
                var d = c;
                b && (c < 0.5 ? c *= 2 : c = 1 - (c - 0.5) * 2);
                if (c * 2 < 1)
                    return this.interpolated.set(d,
                    Math.pow(c * 2, a) / 2);
                return this.interpolated.set(d, 1 - Math.abs(Math.pow(c * 2 - 2, a)) / 2)
            };
            return this
        },createQuadricBezierInterpolator: function(a, b, c, d) {
            this.getPosition = function(e) {
                var f = e;
                d && (e < 0.5 ? e *= 2 : e = 1 - (e - 0.5) * 2);
                e = (1 - e) * (1 - e) * a.y + 2 * (1 - e) * e * b.y + e * e * c.y;
                return this.interpolated.set(f, e)
            };
            return this
        },createCubicBezierInterpolator: function(a, b, c, d, e) {
            this.getPosition = function(f) {
                var h = f;
                e && (f < 0.5 ? f *= 2 : f = 1 - (f - 0.5) * 2);
                var g = f * f;
                f = a.y + f * (-a.y * 3 + f * (3 * a.y - a.y * f)) + f * (3 * b.y + f * (-6 * b.y + b.y * 3 * f)) + g * (c.y * 3 - c.y *
                3 * f) + d.y * f * g;
                return this.interpolated.set(h, f)
            };
            return this
        },createElasticOutInterpolator: function(a, b, c) {
            this.getPosition = function(d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                if (d == 0)
                    return {x: 0,y: 0};
                if (d == 1)
                    return {x: 1,y: 1};
                return this.interpolated.set(d, a * Math.pow(2, -10 * d) * Math.sin((d - b / (2 * Math.PI) * Math.asin(1 / a)) * 2 * Math.PI / b) + 1)
            };
            return this
        },createElasticInInterpolator: function(a, b, c) {
            this.getPosition = function(d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                if (d == 0)
                    return {x: 0,y: 0};
                if (d == 1)
                    return {x: 1,y: 1};
                var e = b / (2 * Math.PI) *
                Math.asin(1 / a);
                return this.interpolated.set(d, -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b)))
            };
            return this
        },createElasticInOutInterpolator: function(a, b, c) {
            this.getPosition = function(d) {
                c && (d < 0.5 ? d *= 2 : d = 1 - (d - 0.5) * 2);
                var e = b / (2 * Math.PI) * Math.asin(1 / a);
                d *= 2;
                if (d <= 1)
                    return this.interpolated.set(d, -0.5 * a * Math.pow(2, 10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b));
                return this.interpolated.set(d, 1 + 0.5 * a * Math.pow(2, -10 * (d -= 1)) * Math.sin((d - e) * 2 * Math.PI / b))
            };
            return this
        },bounce: function(a) {
            return (a /= 1) < 1 / 2.75 ?
            {x: a,y: 7.5625 * a * a} : a < 2 / 2.75 ? {x: a,y: 7.5625 * (a -= 1.5 / 2.75) * a + 0.75} : a < 2.5 / 2.75 ? {x: a,y: 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375} : {x: a,y: 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375}
        },createBounceOutInterpolator: function(a) {
            this.getPosition = function(b) {
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                return this.bounce(b)
            };
            return this
        },createBounceInInterpolator: function(a) {
            this.getPosition = function(b) {
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                b = this.bounce(1 - b);
                b.y = 1 - b.y;
                return b
            };
            return this
        },createBounceInOutInterpolator: function(a) {
            this.getPosition =
            function(b) {
                a && (b < 0.5 ? b *= 2 : b = 1 - (b - 0.5) * 2);
                if (b < 0.5)
                    return b = this.bounce(1 - b * 2), b.y = (1 - b.y) * 0.5, b;
                b = this.bounce(b * 2 - 1, a);
                b.y = b.y * 0.5 + 0.5;
                return b
            };
            return this
        },paint: function(a) {
            a = a.crc;
            a.save();
            a.beginPath();
            a.moveTo(0, this.getPosition(0).y * this.paintScale);
            for (var b = 0; b <= this.paintScale; b++)
                a.lineTo(b, this.getPosition(b / this.paintScale).y * this.paintScale);
            a.strokeStyle = "black";
            a.stroke();
            a.restore()
        },getContour: function(a) {
            for (var b = [], c = 0; c <= a; c++)
                b.push({x: c / a,y: this.getPosition(c / a).y});
            return b
        },
        enumerateInterpolators: function() {
            return [(new CAAT.Interpolator).createLinearInterpolator(!1, !1), "Linear pingpong=false, inverse=false", (new CAAT.Interpolator).createLinearInterpolator(!0, !1), "Linear pingpong=true, inverse=false", (new CAAT.Interpolator).createLinearInterpolator(!1, !0), "Linear pingpong=false, inverse=true", (new CAAT.Interpolator).createLinearInterpolator(!0, !0), "Linear pingpong=true, inverse=true", (new CAAT.Interpolator).createExponentialInInterpolator(2, !1), "ExponentialIn pingpong=false, exponent=2",
                (new CAAT.Interpolator).createExponentialOutInterpolator(2, !1), "ExponentialOut pingpong=false, exponent=2", (new CAAT.Interpolator).createExponentialInOutInterpolator(2, !1), "ExponentialInOut pingpong=false, exponent=2", (new CAAT.Interpolator).createExponentialInInterpolator(2, !0), "ExponentialIn pingpong=true, exponent=2", (new CAAT.Interpolator).createExponentialOutInterpolator(2, !0), "ExponentialOut pingpong=true, exponent=2", (new CAAT.Interpolator).createExponentialInOutInterpolator(2, !0), "ExponentialInOut pingpong=true, exponent=2",
                (new CAAT.Interpolator).createExponentialInInterpolator(4, !1), "ExponentialIn pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialOutInterpolator(4, !1), "ExponentialOut pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialInOutInterpolator(4, !1), "ExponentialInOut pingpong=false, exponent=4", (new CAAT.Interpolator).createExponentialInInterpolator(4, !0), "ExponentialIn pingpong=true, exponent=4", (new CAAT.Interpolator).createExponentialOutInterpolator(4, !0), "ExponentialOut pingpong=true, exponent=4",
                (new CAAT.Interpolator).createExponentialInOutInterpolator(4, !0), "ExponentialInOut pingpong=true, exponent=4", (new CAAT.Interpolator).createExponentialInInterpolator(6, !1), "ExponentialIn pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialOutInterpolator(6, !1), "ExponentialOut pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialInOutInterpolator(6, !1), "ExponentialInOut pingpong=false, exponent=6", (new CAAT.Interpolator).createExponentialInInterpolator(6, !0), "ExponentialIn pingpong=true, exponent=6",
                (new CAAT.Interpolator).createExponentialOutInterpolator(6, !0), "ExponentialOut pingpong=true, exponent=6", (new CAAT.Interpolator).createExponentialInOutInterpolator(6, !0), "ExponentialInOut pingpong=true, exponent=6", (new CAAT.Interpolator).createBounceInInterpolator(!1), "BounceIn pingpong=false", (new CAAT.Interpolator).createBounceOutInterpolator(!1), "BounceOut pingpong=false", (new CAAT.Interpolator).createBounceInOutInterpolator(!1), "BounceInOut pingpong=false", (new CAAT.Interpolator).createBounceInInterpolator(!0),
                "BounceIn pingpong=true", (new CAAT.Interpolator).createBounceOutInterpolator(!0), "BounceOut pingpong=true", (new CAAT.Interpolator).createBounceInOutInterpolator(!0), "BounceInOut pingpong=true", (new CAAT.Interpolator).createElasticInInterpolator(1.1, 0.4, !1), "ElasticIn pingpong=false, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4, !1), "ElasticOut pingpong=false, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInOutInterpolator(1.1, 0.4, !1), "ElasticInOut pingpong=false, amp=1.1, d=.4",
                (new CAAT.Interpolator).createElasticInInterpolator(1.1, 0.4, !0), "ElasticIn pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticOutInterpolator(1.1, 0.4, !0), "ElasticOut pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInOutInterpolator(1.1, 0.4, !0), "ElasticInOut pingpong=true, amp=1.1, d=.4", (new CAAT.Interpolator).createElasticInInterpolator(1, 0.2, !1), "ElasticIn pingpong=false, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticOutInterpolator(1, 0.2, !1), "ElasticOut pingpong=false, amp=1.0, d=.2",
                (new CAAT.Interpolator).createElasticInOutInterpolator(1, 0.2, !1), "ElasticInOut pingpong=false, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticInInterpolator(1, 0.2, !0), "ElasticIn pingpong=true, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticOutInterpolator(1, 0.2, !0), "ElasticOut pingpong=true, amp=1.0, d=.2", (new CAAT.Interpolator).createElasticInOutInterpolator(1, 0.2, !0), "ElasticInOut pingpong=true, amp=1.0, d=.2"]
        }}
})();
(function() {
    CAAT.InterpolatorActor = function() {
        CAAT.InterpolatorActor.superclass.constructor.call(this);
        return this
    };
    CAAT.InterpolatorActor.prototype = {interpolator: null,contour: null,S: 50,gap: 5,setGap: function(a) {
            this.gap = a;
            return this
        },setInterpolator: function(a, b) {
            this.interpolator = a;
            this.contour = a.getContour(b || this.S);
            return this
        },paint: function(a, b) {
            CAAT.InterpolatorActor.superclass.paint.call(this, a, b);
            if (this.interpolator) {
                var c = a.crc, d = this.width - 2 * this.gap, e = this.height - 2 * this.gap;
                c.beginPath();
                c.moveTo(this.gap + d * this.contour[0].x, -this.gap + this.height - e * this.contour[0].y);
                for (var f = 1; f < this.contour.length; f++)
                    c.lineTo(this.gap + d * this.contour[f].x, -this.gap + this.height - e * this.contour[f].y);
                c.strokeStyle = this.strokeStyle;
                c.stroke()
            }
        },getInterpolator: function() {
            return this.interpolator
        }};
    extend(CAAT.InterpolatorActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.PathSegment = function() {
        return this
    };
    CAAT.PathSegment.prototype = {color: "black",setColor: function(a) {
            if (a)
                this.color = a;
            return this
        },endCurvePosition: function() {
        },startCurvePosition: function() {
        },getPosition: function() {
        },getLength: function() {
        },getBoundingBox: function() {
        },numControlPoints: function() {
        },getControlPoint: function() {
        },endPath: function() {
        },getContour: function() {
        },updatePath: function() {
        }}
})();
(function() {
    CAAT.LinearPath = function() {
        this.initialPosition = new CAAT.Point(0, 0, 0);
        this.finalPosition = new CAAT.Point(0, 0, 0);
        this.newPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.LinearPath.prototype = {initialPosition: null,finalPosition: null,newPosition: null,setInitialPosition: function(a, b) {
            this.initialPosition.x = a;
            this.initialPosition.y = b;
            this.newPosition.set(a, b);
            return this
        },setFinalPosition: function(a, b) {
            this.finalPosition.x = a;
            this.finalPosition.y = b;
            return this
        },endCurvePosition: function() {
            return this.finalPosition
        },
        startCurvePosition: function() {
            return this.initialPosition
        },getPosition: function(a) {
            if (a > 1 || a < 0)
                a %= 1;
            a < 0 && (a = 1 + a);
            this.newPosition.set(this.initialPosition.x + (this.finalPosition.x - this.initialPosition.x) * a, this.initialPosition.y + (this.finalPosition.y - this.initialPosition.y) * a);
            return this.newPosition
        },getLength: function() {
            var a = this.finalPosition.x - this.initialPosition.x, b = this.finalPosition.y - this.initialPosition.y;
            return Math.sqrt(a * a + b * b)
        },initialPositionX: function() {
            return this.initialPosition.x
        },
        finalPositionX: function() {
            return this.finalPosition.x
        },paint: function(a, b) {
            var c = a.crc;
            c.save();
            c.strokeStyle = this.color;
            c.beginPath();
            c.moveTo(this.initialPosition.x, this.initialPosition.y);
            c.lineTo(this.finalPosition.x, this.finalPosition.y);
            c.stroke();
            if (b)
                c.globalAlpha = 0.5, c.fillStyle = "#7f7f00", c.beginPath(), c.arc(this.initialPosition.x, this.initialPosition.y, CAAT.Curve.prototype.HANDLE_SIZE / 2, 0, 2 * Math.PI, !1), c.arc(this.finalPosition.x, this.finalPosition.y, CAAT.Curve.prototype.HANDLE_SIZE / 2, 0,
                2 * Math.PI, !1), c.fill();
            c.restore()
        },getBoundingBox: function(a) {
            a.union(this.initialPosition.x, this.initialPosition.y);
            a.union(this.finalPosition.x, this.finalPosition.y);
            return a
        },numControlPoints: function() {
            return 2
        },getControlPoint: function(a) {
            if (0 == a)
                return this.initialPosition;
            else if (1 == a)
                return this.finalPosition
        },getContour: function() {
            var a = [];
            a.push(this.getPosition(0).clone());
            a.push(this.getPosition(1).clone());
            return a
        }};
    extend(CAAT.LinearPath, CAAT.PathSegment, null)
})();
(function() {
    CAAT.CurvePath = function() {
        this.newPosition = new CAAT.Point(0, 0, 0);
        return this
    };
    CAAT.CurvePath.prototype = {curve: null,newPosition: null,setQuadric: function(a, b, c, d, e, f) {
            var h = new CAAT.Bezier;
            h.setQuadric(a, b, c, d, e, f);
            this.curve = h;
            return this
        },setCubic: function(a, b, c, d, e, f, h, g) {
            var i = new CAAT.Bezier;
            i.setCubic(a, b, c, d, e, f, h, g);
            this.curve = i;
            return this
        },updatePath: function() {
            this.curve.update();
            return this
        },getPosition: function(a) {
            if (a > 1 || a < 0)
                a %= 1;
            a < 0 && (a = 1 + a);
            this.curve.solve(this.newPosition,
            a);
            return this.newPosition
        },getPositionFromLength: function(a) {
            this.curve.solve(this.newPosition, a / this.getLength());
            return this.newPosition
        },initialPositionX: function() {
            return this.curve.coordlist[0].x
        },finalPositionX: function() {
            return this.curve.coordlist[this.curve.coordlist.length - 1].x
        },getLength: function() {
            return this.curve.getLength()
        },paint: function(a, b) {
            this.curve.drawHandles = b;
            a.ctx.strokeStyle = this.color;
            this.curve.paint(a)
        },getBoundingBox: function(a) {
            this.curve.getBoundingBox(a);
            return a
        },
        numControlPoints: function() {
            return this.curve.coordlist.length
        },getControlPoint: function(a) {
            return this.curve.coordlist[a]
        },endCurvePosition: function() {
            return this.curve.endCurvePosition()
        },startCurvePosition: function() {
            return this.curve.startCurvePosition()
        },getContour: function(a) {
            for (var b = [], c = 0; c <= a; c++)
                b.push({x: c / a,y: this.getPosition(c / a).y});
            return b
        }};
    extend(CAAT.CurvePath, CAAT.PathSegment, null)
})();
(function() {
    CAAT.Path = function() {
        this.newPosition = new CAAT.Point(0, 0, 0);
        this.pathSegments = [];
        return this
    };
    CAAT.Path.prototype = {pathSegments: null,pathSegmentDurationTime: null,pathSegmentStartTime: null,newPosition: null,pathLength: -1,beginPathX: -1,beginPathY: -1,trackPathX: -1,trackPathY: -1,ax: -1,ay: -1,point: [],interactive: !0,setInteractive: function(a) {
            this.interactive = a;
            return this
        },endCurvePosition: function() {
            return this.pathSegments[this.pathSegments.length - 1].endCurvePosition()
        },startCurvePosition: function() {
            return this.pathSegments[0].startCurvePosition()
        },
        setLinear: function(a, b, c, d) {
            this.beginPath(a, b);
            this.addLineTo(c, d);
            this.endPath();
            return this
        },setQuadric: function(a, b, c, d, e, f) {
            this.beginPath(a, b);
            this.addQuadricTo(c, d, e, f);
            this.endPath();
            return this
        },setCubic: function(a, b, c, d, e, f, h, g) {
            this.beginPath(a, b);
            this.addCubicTo(c, d, e, f, h, g);
            this.endPath();
            return this
        },addSegment: function(a) {
            this.pathSegments.push(a);
            return this
        },addQuadricTo: function(a, b, c, d, e) {
            var f = new CAAT.Bezier;
            f.setQuadric(this.trackPathX, this.trackPathY, a, b, c, d);
            this.trackPathX =
            c;
            this.trackPathY = d;
            a = (new CAAT.CurvePath).setColor(e);
            a.curve = f;
            this.pathSegments.push(a);
            return this
        },addCubicTo: function(a, b, c, d, e, f, h) {
            var g = new CAAT.Bezier;
            g.setCubic(this.trackPathX, this.trackPathY, a, b, c, d, e, f);
            this.trackPathX = e;
            this.trackPathY = f;
            a = (new CAAT.CurvePath).setColor(h);
            a.curve = g;
            this.pathSegments.push(a);
            return this
        },addCatmullTo: function(a, b, c, d, e, f, h) {
            h = (new CAAT.CatmullRom).setColor(h);
            h.setCurve(this.trackPathX, this.trackPathY, a, b, c, d, e, f);
            this.trackPathX = e;
            this.trackPathY = f;
            a = new CAAT.CurvePath;
            a.curve = h;
            this.pathSegments.push(a);
            return this
        },addLineTo: function(a, b, c) {
            c = (new CAAT.LinearPath).setColor(c);
            c.setInitialPosition(this.trackPathX, this.trackPathY);
            c.setFinalPosition(a, b);
            this.trackPathX = a;
            this.trackPathY = b;
            this.pathSegments.push(c);
            return this
        },beginPath: function(a, b) {
            this.trackPathX = a;
            this.trackPathY = b;
            this.beginPathX = a;
            this.beginPathY = b;
            return this
        },closePath: function() {
            this.addLineTo(this.beginPathX, this.beginPathY);
            this.trackPathX = this.beginPathX;
            this.trackPathY =
            this.beginPathY;
            this.endPath();
            return this
        },endPath: function() {
            this.pathSegmentStartTime = [];
            this.pathSegmentDurationTime = [];
            this.pathLength = 0;
            var a;
            for (a = 0; a < this.pathSegments.length; a++)
                this.pathLength += this.pathSegments[a].getLength(), this.pathSegmentStartTime.push(0), this.pathSegmentDurationTime.push(0);
            for (a = 0; a < this.pathSegments.length; a++)
                this.pathSegmentDurationTime[a] = this.pathSegments[a].getLength() / this.pathLength, a > 0 ? this.pathSegmentStartTime[a] = this.pathSegmentStartTime[a - 1] + this.pathSegmentDurationTime[a -
                1] : this.pathSegmentStartTime[0] = 0, this.pathSegments[a].endPath();
            return this
        },getLength: function() {
            return this.pathLength
        },getPosition: function(a) {
            if (a > 1 || a < 0)
                a %= 1;
            a < 0 && (a = 1 + a);
            for (var b = 0; b < this.pathSegments.length; b++)
                if (this.pathSegmentStartTime[b] <= a && a <= this.pathSegmentStartTime[b] + this.pathSegmentDurationTime[b]) {
                    a = (a - this.pathSegmentStartTime[b]) / this.pathSegmentDurationTime[b];
                    a = this.pathSegments[b].getPosition(a);
                    this.newPosition.x = a.x;
                    this.newPosition.y = a.y;
                    break
                }
            return this.newPosition
        },
        getPositionFromLength: function(a) {
            a %= this.getLength();
            a < 0 && (a += this.getLength());
            for (var b = 0, c = 0; c < this.pathSegments.length; c++) {
                if (b <= a && a <= this.pathSegments[c].getLength() + b) {
                    a -= b;
                    a = this.pathSegments[c].getPositionFromLength(a);
                    this.newPosition.x = a.x;
                    this.newPosition.y = a.y;
                    break
                }
                b += this.pathSegments[c].getLength()
            }
            return this.newPosition
        },paint: function(a) {
            for (var b = 0; b < this.pathSegments.length; b++)
                this.pathSegments[b].paint(a, this.interactive)
        },getBoundingBox: function(a) {
            null == a && (a = new CAAT.Rectangle);
            for (var b = 0; b < this.pathSegments.length; b++)
                this.pathSegments[b].getBoundingBox(a);
            return a
        },release: function() {
            this.ay = this.ax = -1
        },getNumSegments: function() {
            return this.pathSegments.length
        },getSegment: function(a) {
            return this.pathSegments[a]
        },updatePath: function() {
            for (var a = 0; a < this.pathSegments.length; a++)
                this.pathSegments[a].updatePath();
            this.endPath()
        },press: function(a, b) {
            if (this.interactive) {
                for (var c = CAAT.Curve.prototype.HANDLE_SIZE / 2, d = 0; d < this.pathSegments.length; d++)
                    for (var e = 0; e < this.pathSegments[d].numControlPoints(); e++) {
                        var f =
                        this.pathSegments[d].getControlPoint(e);
                        if (a >= f.x - c && b >= f.y - c && a < f.x + c && b < f.y + c) {
                            this.point = [];
                            this.point.push(f);
                            e == 0 ? (c = d - 1, c < 0 && (c = this.pathSegments.length - 1), this.point.push(this.pathSegments[c].endCurvePosition())) : e == this.pathSegments[d].numControlPoints() - 1 && this.point.push(this.pathSegments[(d + 1) % this.pathSegments.length].startCurvePosition());
                            return
                        }
                    }
                this.point = null
            }
        },drag: function(a, b) {
            if (this.interactive && null != this.point) {
                if (-1 == this.ax || -1 == this.ay)
                    this.ax = a, this.ay = b;
                for (var c = 0; c < this.point.length; c++)
                    this.point[c].x +=
                    a - this.ax, this.point[c].y += b - this.ay;
                this.ax = a;
                this.ay = b;
                this.updatePath()
            }
        },getContour: function(a) {
            for (var b = [], c = 0; c <= a; c++)
                b.push((new CAAT.Point).set(c / a, this.getPosition(c / a).y, 0));
            return b
        }};
    extend(CAAT.Path, CAAT.PathSegment, null)
})();
(function() {
    CAAT.PathActor = function() {
        CAAT.PathActor.superclass.constructor.call(this);
        return this
    };
    CAAT.PathActor.prototype = {path: null,pathBoundingRectangle: null,bOutline: !1,getPath: function() {
            return this.path
        },setPath: function(a) {
            this.path = a;
            this.pathBoundingRectangle = a.getBoundingBox();
            return this
        },paint: function(a) {
            var b = a.crc;
            b.strokeStyle = "black";
            this.path.paint(a);
            if (this.bOutline)
                b.strokeStyle = "black", b.strokeRect(0, 0, this.width, this.height)
        },mouseDrag: function(a) {
            this.path.drag(a.point.x,
            a.point.y)
        },mouseDown: function(a) {
            this.path.press(a.point.x, a.point.y)
        },mouseUp: function() {
            this.path.release()
        }};
    extend(CAAT.PathActor, CAAT.ActorContainer, null)
})();
(function() {
    CAAT.Program = function(a) {
        this.gl = a;
        return this
    };
    CAAT.Program.prototype = {shaderProgram: null,gl: null,setAlpha: function() {
        },getShader: function(a, b, c) {
            if (b == "x-shader/x-fragment")
                b = a.createShader(a.FRAGMENT_SHADER);
            else if (b == "x-shader/x-vertex")
                b = a.createShader(a.VERTEX_SHADER);
            else
                return null;
            a.shaderSource(b, c);
            a.compileShader(b);
            if (!a.getShaderParameter(b, a.COMPILE_STATUS))
                return alert(a.getShaderInfoLog(b)), null;
            return b
        },getDomShader: function(a, b) {
            var c = document.getElementById(b);
            if (!c)
                return null;
            for (var d = "", e = c.firstChild; e; )
                e.nodeType == 3 && (d += e.textContent), e = e.nextSibling;
            if (c.type == "x-shader/x-fragment")
                c = a.createShader(a.FRAGMENT_SHADER);
            else if (c.type == "x-shader/x-vertex")
                c = a.createShader(a.VERTEX_SHADER);
            else
                return null;
            a.shaderSource(c, d);
            a.compileShader(c);
            if (!a.getShaderParameter(c, a.COMPILE_STATUS))
                return alert(a.getShaderInfoLog(c)), null;
            return c
        },initialize: function() {
            return this
        },getFragmentShader: function() {
            return null
        },getVertexShader: function() {
            return null
        },create: function() {
            var a =
            this.gl;
            this.shaderProgram = a.createProgram();
            a.attachShader(this.shaderProgram, this.getVertexShader());
            a.attachShader(this.shaderProgram, this.getFragmentShader());
            a.linkProgram(this.shaderProgram);
            a.useProgram(this.shaderProgram);
            return this
        },setMatrixUniform: function(a) {
            this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, !1, new Float32Array(a.flatten()))
        },useProgram: function() {
            this.gl.useProgram(this.shaderProgram);
            return this
        }}
})();
(function() {
    CAAT.ColorProgram = function(a) {
        CAAT.ColorProgram.superclass.constructor.call(this, a);
        return this
    };
    CAAT.ColorProgram.prototype = {colorBuffer: null,vertexPositionBuffer: null,vertexPositionArray: null,getFragmentShader: function() {
            return this.getShader(this.gl, "x-shader/x-fragment", "#ifdef GL_ES \nprecision highp float; \n#endif \nvarying vec4 color; \nvoid main(void) { \n  gl_FragColor = color;\n}\n")
        },getVertexShader: function() {
            return this.getShader(this.gl, "x-shader/x-vertex", "attribute vec3 aVertexPosition; \nattribute vec4 aColor; \nuniform mat4 uPMatrix; \nvarying vec4 color; \nvoid main(void) { \ngl_Position = uPMatrix * vec4(aVertexPosition, 1.0); \ncolor= aColor; \n}\n")
        },
        initialize: function() {
            this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aColor");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
            this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.useProgram();
            this.colorBuffer = this.gl.createBuffer();
            this.setColor([1, 1, 1, 1]);
            this.vertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertexPositionArray = new Float32Array(49152);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, !1, 0, 0);
            return CAAT.ColorProgram.superclass.initialize.call(this)
        },setColor: function(a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(a), this.gl.STATIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.colorBuffer, this.gl.FLOAT, !1, 0, 0)
        }};
    extend(CAAT.ColorProgram, CAAT.Program, null)
})();
(function() {
    CAAT.TextureProgram = function(a) {
        CAAT.TextureProgram.superclass.constructor.call(this, a);
        return this
    };
    CAAT.TextureProgram.prototype = {vertexPositionBuffer: null,vertexPositionArray: null,vertexUVBuffer: null,vertexUVArray: null,vertexIndexBuffer: null,linesBuffer: null,prevAlpha: -1,prevR: -1,prevG: -1,prevB: -1,prevA: -1,prevTexture: null,getFragmentShader: function() {
            return this.getShader(this.gl, "x-shader/x-fragment", "#ifdef GL_ES \nprecision highp float; \n#endif \nvarying vec2 vTextureCoord; \nuniform sampler2D uSampler; \nuniform float alpha; \nuniform bool uUseColor;\nuniform vec4 uColor;\nvoid main(void) { \nif ( uUseColor ) {\n  gl_FragColor= vec4(uColor.rgb, uColor.a*alpha);\n} else { \n  vec4 textureColor= texture2D(uSampler, vec2(vTextureCoord)); \n  gl_FragColor = vec4(textureColor.rgb, textureColor.a * alpha); \n}\n}\n")
        },
        getVertexShader: function() {
            return this.getShader(this.gl, "x-shader/x-vertex", "attribute vec3 aVertexPosition; \nattribute vec2 aTextureCoord; \nuniform mat4 uPMatrix; \nvarying vec2 vTextureCoord; \nvoid main(void) { \ngl_Position = uPMatrix * vec4(aVertexPosition, 1.0); \nvTextureCoord = aTextureCoord;\n}\n")
        },useProgram: function() {
            CAAT.TextureProgram.superclass.useProgram.call(this);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        },initialize: function() {
            this.linesBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            for (var a = [], b = 0; b < 1024; b++)
                a[b] = b;
            this.linesBufferArray = new Uint16Array(a);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.linesBufferArray, this.gl.DYNAMIC_DRAW);
            this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
            this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);
            this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.shaderProgram.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
            this.shaderProgram.alphaUniform = this.gl.getUniformLocation(this.shaderProgram, "alpha");
            this.shaderProgram.useColor = this.gl.getUniformLocation(this.shaderProgram,
            "uUseColor");
            this.shaderProgram.color = this.gl.getUniformLocation(this.shaderProgram, "uColor");
            this.setAlpha(1);
            this.setUseColor(!1);
            this.vertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertexPositionArray = new Float32Array(49152);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexPositionArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, this.gl.FLOAT, !1, 0, 0);
            this.vertexUVBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.vertexUVArray = new Float32Array(32768);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexUVArray, this.gl.DYNAMIC_DRAW);
            this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 2, this.gl.FLOAT, !1, 0, 0);
            this.vertexIndexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            a = [];
            for (b = 0; b < 4096; b++)
                a.push(0 + b * 4), a.push(1 + b * 4), a.push(2 + b * 4), a.push(0 + b * 4), a.push(2 + b * 4), a.push(3 + b *
                4);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(a), this.gl.STATIC_DRAW);
            return CAAT.TextureProgram.superclass.initialize.call(this)
        },setUseColor: function(a, b, c, d, e) {
            this.gl.uniform1i(this.shaderProgram.useColor, a ? 1 : 0);
            if (a && (this.prevA != e || this.prevR != b || this.prevG != c || this.prevB != d))
                this.gl.uniform4f(this.shaderProgram.color, b, c, d, e), this.prevA = e, this.prevR = b, this.prevG = c, this.prevB = d
        },setTexture: function(a) {
            if (this.prevTexture != a) {
                var b = this.gl;
                b.activeTexture(b.TEXTURE0);
                b.bindTexture(b.TEXTURE_2D,
                a);
                b.uniform1i(this.shaderProgram.samplerUniform, 0);
                this.prevTexture = a
            }
            return this
        },updateVertexBuffer: function(a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, a);
            return this
        },updateUVBuffer: function(a) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexUVBuffer);
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, a);
            return this
        },setAlpha: function(a) {
            if (this.prevAlpha != a)
                this.gl.uniform1f(this.shaderProgram.alphaUniform, a), this.prevAlpha =
                a;
            return this
        },drawLines: function(a, b, c, d, e, f, h) {
            var g = this.gl;
            this.setAlpha(f);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            g.lineWidth(h);
            this.updateVertexBuffer(a);
            this.setUseColor(!0, c, d, e, 1);
            g.drawElements(g.LINES, b, g.UNSIGNED_SHORT, 0);
            this.setAlpha(1);
            this.setUseColor(!1);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        },drawPolylines: function(a, b, c, d, e, f, h) {
            var g = this.gl;
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.linesBuffer);
            g.lineWidth(h);
            this.setAlpha(f);
            this.updateVertexBuffer(a);
            this.setUseColor(!0, c, d, e, 1);
            g.drawElements(g.LINE_STRIP, b, g.UNSIGNED_SHORT, 0);
            this.setAlpha(1);
            this.setUseColor(!1);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer)
        }};
    extend(CAAT.TextureProgram, CAAT.Program, null)
})();
function makePerspective(a, b, c, d, e) {
    a = c * Math.tan(a * Math.PI / 360);
    var f = -a;
    return makeFrustum(f * b, a * b, f, a, c, d, e)
}
function makeFrustum(a, b, c, d, e, f, h) {
    var g = 2 * e / (b - a), i = 2 * e / (d - c);
    a = (b + a) / (b - a);
    c = (d + c) / (d - c);
    d = -(f + e) / (f - e);
    e = -2 * f * e / (f - e);
    return (new CAAT.Matrix3).initWithMatrix([[g, 0, a, -h / 2], [0, -i, c, h / 2], [0, 0, d, e], [0, 0, -1, 0]])
}
function makeOrtho(a, b, c, d, e, f, h) {
    var g = -(b + a) / (b - a) - h / 2;
    h = -(d + c) / (d - c) + h / 2;
    var i = -(f + e) / (f - e);
    return (new CAAT.Matrix3).initWithMatrix([[2 / (b - a), 0, 0, g], [0, 2 / (d - c), 0, h], [0, 0, -2 / (f - e), i], [0, 0, 0, 1]])
}
;
(function() {
    CAAT.GLTextureElement = function() {
        return this
    };
    CAAT.GLTextureElement.prototype = {inverted: !1,image: null,u: 0,v: 0,glTexture: null}
})();
(function() {
    CAAT.GLTextureScan = function(a) {
        this.freeChunks = [{position: 0,size: a || 1024}];
        return this
    };
    CAAT.GLTextureScan.prototype = {freeChunks: null,findWhereFits: function(a) {
            if (this.freeChunks.length == 0)
                return [];
            var b = [], c;
            for (c = 0; c < this.freeChunks.length; c++)
                for (var d = 0; d + a <= this.freeChunks[c].size; )
                    b.push(d + this.freeChunks[c].position), d += a;
            return b
        },fits: function(a, b) {
            var c = 0;
            for (c = 0; c < this.freeChunks.length; c++) {
                var d = this.freeChunks[c];
                if (d.position <= a && a + b <= d.position + d.size)
                    return !0
            }
            return !1
        },
        substract: function(a, b) {
            var c = 0;
            for (c = 0; c < this.freeChunks.length; c++) {
                var d = this.freeChunks[c];
                if (d.position <= a && a + b <= d.position + d.size) {
                    var e = 0, f = 0, h = 0, g = 0;
                    e = d.position;
                    f = a - d.position;
                    h = a + b;
                    g = d.position + d.size - h;
                    this.freeChunks.splice(c, 1);
                    f > 0 && this.freeChunks.splice(c++, 0, {position: e,size: f});
                    g > 0 && this.freeChunks.splice(c, 0, {position: h,size: g});
                    return !0
                }
            }
            return !1
        },log: function(a) {
            if (0 == this.freeChunks.length)
                CAAT.log("index " + a + " empty");
            else {
                a = "index " + a;
                for (var b = 0; b < this.freeChunks.length; b++) {
                    var c =
                    this.freeChunks[b];
                    a += "[" + c.position + "," + c.size + "]"
                }
                CAAT.log(a)
            }
        }}
})();
(function() {
    CAAT.GLTextureScanMap = function(a, b) {
        this.scanMapHeight = b;
        this.scanMapWidth = a;
        this.scanMap = [];
        for (var c = 0; c < this.scanMapHeight; c++)
            this.scanMap.push(new CAAT.GLTextureScan(this.scanMapWidth));
        return this
    };
    CAAT.GLTextureScanMap.prototype = {scanMap: null,scanMapWidth: 0,scanMapHeight: 0,whereFitsChunk: function(a, b) {
            if (a > this.width || b > this.height)
                return null;
            for (var c, d, e = 0; e <= this.scanMapHeight - b; ) {
                var f = null;
                for (c = !1; e <= this.scanMapHeight - b; e++)
                    if (f = this.scanMap[e].findWhereFits(a), null != f &&
                    f.length > 0) {
                        c = !0;
                        break
                    }
                if (c) {
                    for (d = 0; d < f.length; d++) {
                        var h = !0;
                        for (c = e; c < e + b; c++)
                            if (!this.scanMap[c].fits(f[d], a)) {
                                h = !1;
                                break
                            }
                        if (h)
                            return {x: f[d],y: e}
                    }
                    e++
                } else
                    break
            }
            return null
        },substract: function(a, b, c, d) {
            for (var e = 0; e < d; e++)
                this.scanMap[e + b].substract(a, c) || CAAT.log("Error: removing chunk ", c, d, " at ", a, b)
        },log: function() {
            for (var a = 0; a < this.scanMapHeight; a++)
                this.scanMap[a].log(a)
        }}
})();
(function() {
    CAAT.GLTexturePage = function(a, b) {
        this.width = a || 1024;
        this.height = b || 1024;
        this.scan = new CAAT.GLTextureScanMap(this.width, this.height);
        this.images = [];
        return this
    };
    CAAT.GLTexturePage.prototype = {width: 1024,height: 1024,gl: null,texture: null,scan: null,images: null,create: function(a, b) {
            this.gl = a;
            a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            this.texture = a.createTexture();
            a.bindTexture(a.TEXTURE_2D, this.texture);
            a.enable(a.BLEND);
            a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA);
            for (var c = new Uint8Array(this.width * this.height * 4), d = 0; d < 4 * this.width *
            this.height; )
                c[d++] = 0, c[d++] = 0, c[d++] = 0, c[d++] = 0;
            a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, this.width, this.height, 0, a.RGBA, a.UNSIGNED_BYTE, c);
            b.sort(function(a, b) {
                var c = a.image.height, d = b.image.height;
                return d - c ? d - c : b.image.width - a.image.width
            });
            for (c = 0; c < b.length; c++)
                if (d = b[c].image, !d.__texturePage) {
                    var e = this.normalizeSize(d), f = e.width, h = e.height, g;
                    (g = f % 4) || (g = 4);
                    f + g <= this.width && (f += g);
                    (g = h % 4) || (g = 4);
                    h + g <= this.height && (h += g);
                    g = this.scan.whereFitsChunk(f, h);
                    null != g ? (this.images.push(d), a.texSubImage2D(a.TEXTURE_2D,
                    0, g.x, g.y, a.RGBA, a.UNSIGNED_BYTE, e), d.__tx = g.x, d.__ty = g.y, d.__u = g.x / this.width, d.__v = g.y / this.height, d.__u1 = (g.x + e.width) / this.width, d.__v1 = (g.y + e.height) / this.height, d.__texturePage = this, d.__w = e.width, d.__h = e.height, d.inverted = e.inverted, this.scan.substract(g.x, g.y, f, h)) : CAAT.log("Imagen ", d.src, " de tama\ufffdo ", d.width, d.height, " no cabe.")
                }
            a.enable(a.BLEND)
        },normalizeSize: function(a) {
            a.inverted = !1;
            return a
        },endCreation: function() {
            var a = this.gl;
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER,
            a.LINEAR);
            a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_NEAREST);
            a.generateMipmap(a.TEXTURE_2D)
        },deletePage: function() {
            for (var a = 0; a < this.images.length; a++)
                delete this.images[a].__texturePage, delete this.images[a].__u, delete this.images[a].__v;
            this.gl.deleteTexture(this.texture)
        }}
})();
(function() {
    CAAT.GLTexturePageManager = function() {
        this.pages = [];
        return this
    };
    CAAT.GLTexturePageManager.prototype = {pages: null,createPages: function(a, b, c, d) {
            for (var e = !1; !e; ) {
                e = new CAAT.GLTexturePage(b, c);
                e.create(a, d);
                e.endCreation();
                this.pages.push(e);
                e = !0;
                for (var f = 0; f < d.length; f++)
                    if (!d[f].image.__texturePage) {
                        d[f].image.width <= b && d[f].height <= c && (e = !1);
                        break
                    }
            }
        },deletePages: function() {
            for (var a = 0; a < this.pages.length; a++)
                this.pages[a].deletePage();
            this.pages = null
        }}
})();
