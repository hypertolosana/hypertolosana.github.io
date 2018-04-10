
    (function() {
    /**
     *
     * License: see license.txt file.
     *
     */


    var EPSILON = 0.0001;

    /*
     StrokeGeometryAttributes {
     width? : number;        // 1 if not defined
     cap? : string;          // butt, round, square
     join?: string;          // bevel, round, miter
     mitterLimit? : number   // for join miter, the maximum angle value to use the miter
     }
     */

    var Point = function (x, y) {

        this.x = typeof x === "undefined" ? 0 : x;
        this.y = typeof y === "undefined" ? 0 : y;
    };

    Point.prototype = {

        scalarMult: function (f) {
            this.x *= f;
            this.y *= f;

            return this;
        },

        perpendicular: function () {
            var x = this.x;
            this.x = -this.y;
            this.y = x;

            return this;
        },

        invert: function () {
            this.x = -this.x;
            this.y = -this.y;

            return this;
        },

        length: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },

        normalize: function () {
            var mod = this.length();
            this.x /= mod;
            this.y /= mod;
            return this;
        },

        angle : function() {
            return this.y/this.x;
        }
    };

    Point.Angle = function( p0, p1 ) {
        return Math.atan2( p1.x-p0.x, p1.y-p0.y ) ;
    };

    Point.Add = function (p0, p1) {
        return new Point(p0.x + p1.x, p0.y + p1.y);
    };

    Point.Sub = function (p1, p0) {
        return new Point(p1.x - p0.x, p1.y - p0.y);
    };

    Point.Middle = function (p0, p1) {
        return Point.Add(p0, p1).scalarMult(.5);
    };

    function getStrokeGeometry(points, attrs) {

        // trivial reject
        if (points.length < 2) {
            return;
        }

        var cap = attrs.cap || "butt";
        var join = attrs.join || "bevel";
        var lineWidth = (attrs.width || 1) / 2;
        var miterLimit = attrs.miterLimit || 10;
        var vertices = [];
        var middlePoints = [];  // middle points per each line segment.
        var closed= false;

        if (points.length === 2) {
            join = "bevel";
            createTriangles(points[0], Point.Middle(points[0], points[1]), points[1], vertices, lineWidth, join, miterLimit);
        } else {

/** Disable for simulation purposes, but uncomment for have the system working otherwise.
            if (points[0] === points[points.length - 1] ||
                    (points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y )) {

                var p0 = points.shift();
                p0 = Point.Middle(p0, points[0]);
                points.unshift(p0);
                points.push(p0);
                closed= true;
            }
*/
            var i;
            for (i = 0; i < points.length - 1; i++) {
                if (i === 0) {
                    middlePoints.push(points[0]);
                } else if (i === points.length - 2) {
                    middlePoints.push(points[points.length - 1])
                } else {
                    middlePoints.push(Point.Middle(points[i], points[i + 1]));
                }
            }

            for (i = 1; i < middlePoints.length; i++) {
                createTriangles(middlePoints[i - 1], points[i], middlePoints[i], vertices, lineWidth, join, miterLimit);
            }
        }

        if ( !closed ) {

            if (cap === "round") {

                var p00 = vertices[0];
                var p01 = vertices[1];
                var p02 = points[1];
                var p10 = vertices[vertices.length - 1];
                var p11 = vertices[vertices.length - 3];
                var p12 = points[points.length - 2];

                createRoundCap(points[0], p00, p01, p02, vertices);
                createRoundCap(points[points.length - 1], p10, p11, p12, vertices);

            } else if (cap === "square") {

                var p00 = vertices[vertices.length - 1];
                var p01 = vertices[vertices.length - 3];

                createSquareCap(
                        vertices[0],
                        vertices[1],
                        Point.Sub(points[0], points[1]).normalize().scalarMult(Point.Sub(points[0], vertices[0]).length()),
                        vertices);
                createSquareCap(
                        p00,
                        p01,
                        Point.Sub(points[points.length - 1], points[points.length - 2]).normalize().scalarMult(Point.Sub(p01, points[points.length - 1]).length()),
                        vertices);
            }
        }

        return vertices;
    }

    function createSquareCap(p0, p1, dir, verts) {

        verts.push(p0);
        verts.push(Point.Add(p0, dir));
        verts.push(Point.Add(p1, dir));

        verts.push(p1);
        verts.push(Point.Add(p1, dir));
        verts.push(p0);
    }

    function createRoundCap(center, _p0, _p1, nextPointInLine, verts) {

        var radius = Point.Sub(center, _p0).length();

        var angle0 = Math.atan2((_p1.y - center.y), (_p1.x - center.x));
        var angle1 = Math.atan2((_p0.y - center.y), (_p0.x - center.x));

        var orgAngle0= angle0;

        if ( angle1 > angle0) {
       		if ( angle1-angle0>=Math.PI-EPSILON) {
       			angle1=angle1-2*Math.PI;
       		}
       	}
       	else {
       		if ( angle0-angle1>=Math.PI-EPSILON) {
       			angle0=angle0-2*Math.PI;
       		}
       	}

        var angleDiff = angle1-angle0;

        if (Math.abs(angleDiff) >= Math.PI - EPSILON && Math.abs(angleDiff) <= Math.PI + EPSILON) {
            var r1 = Point.Sub(center, nextPointInLine);
            if ( r1.x===0 ) {
                if (r1.y>0) {
                    angleDiff= -angleDiff;
                }
            } else if ( r1.x>=-EPSILON ) {
                angleDiff= -angleDiff;
            }
        }

        var nsegments = (Math.abs(angleDiff * radius) / 7) >> 0;
        nsegments++;

        var angleInc = angleDiff / nsegments;

        for (var i = 0; i < nsegments; i++) {
            verts.push(new Point(center.x, center.y));
            verts.push(new Point(
                    center.x + radius * Math.cos(orgAngle0 + angleInc * i),
                    center.y + radius * Math.sin(orgAngle0 + angleInc * i)
            ));
            verts.push(new Point(
                    center.x + radius * Math.cos(orgAngle0 + angleInc * (1 + i)),
                    center.y + radius * Math.sin(orgAngle0 + angleInc * (1 + i))
            ));
        }
    }

    function signedArea(p0, p1, p2) {
        return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
    }

    function lineIntersection(p0, p1, p2, p3) {

        var a0 = p1.y - p0.y;
        var b0 = p0.x - p1.x;

        var a1 = p3.y - p2.y;
        var b1 = p2.x - p3.x;

        var det = a0 * b1 - a1 * b0;
        if (det > -EPSILON && det < EPSILON) {
            return null;
        } else {
            var c0 = a0 * p0.x + b0 * p0.y;
            var c1 = a1 * p2.x + b1 * p2.y;

            var x = (b1 * c0 - b0 * c1) / det;
            var y = (a0 * c1 - a1 * c0) / det;
            return new Point(x, y);
        }
    }

    function createTriangles(p0, p1, p2, verts, width, join, miterLimit) {
        var t0 = Point.Sub(p1, p0);
        var t2 = Point.Sub(p2, p1);

        t0.perpendicular();
        t2.perpendicular();

        // triangle composed by the 3 points if clockwise or couterclockwise.
        // if counterclockwise, we must invert the line threshold points, otherwise the intersection point
        // could be erroneous and lead to odd results.
        if (signedArea(p0, p1, p2) > 0) {
            t0.invert();
            t2.invert();
        }

        t0.normalize();
        t2.normalize();
        t0.scalarMult(width);
        t2.scalarMult(width);

        var pintersect = lineIntersection(Point.Add(t0, p0), Point.Add(t0, p1), Point.Add(t2, p2), Point.Add(t2, p1));

        var anchor = null;
        var anchorLength= Number.MAX_VALUE;
        if ( pintersect ) {
            anchor= Point.Sub(pintersect, p1);
            anchorLength= anchor.length();
        }
        var dd = (anchorLength / width)|0;
        var p0p1= Point.Sub( p0,p1 );
        var p0p1Length= p0p1.length();
        var p1p2= Point.Sub( p1,p2 );
        var p1p2Length= p1p2.length();

        /**
         * the cross point exceeds any of the segments dimension.
         * do not use cross point as reference.
         */
        if ( anchorLength>p0p1Length || anchorLength>p1p2Length ) {

            verts.push(Point.Add(p0, t0));
            verts.push(Point.Sub(p0, t0));
            verts.push(Point.Add(p1, t0));

            verts.push(Point.Sub(p0, t0));
            verts.push(Point.Add(p1, t0));
            verts.push(Point.Sub(p1, t0));

            if ( join === "round" ) {
                createRoundCap(p1, Point.Add(p1,t0), Point.Add(p1,t2), p2, verts);
            } else if ( join==="bevel" || (join==="miter" && dd>=miterLimit) ) {
                verts.push( p1 );
                verts.push( Point.Add(p1,t0) );
                verts.push( Point.Add(p1,t2) );
            } else if (join === 'miter' && dd<miterLimit && pintersect) {

                verts.push( Point.Add(p1,t0) );
                verts.push( p1 );
                verts.push( pintersect );

                verts.push( Point.Add(p1,t2) );
                verts.push( p1 );
                verts.push( pintersect );
            }

            verts.push(Point.Add(p2, t2));
            verts.push(Point.Sub(p1, t2));
            verts.push(Point.Add(p1, t2));

            verts.push(Point.Add(p2, t2));
            verts.push(Point.Sub(p1, t2));
            verts.push(Point.Sub(p2, t2));


        } else {

            verts.push(Point.Add(p0, t0));
            verts.push(Point.Sub(p0, t0));
            verts.push(Point.Sub(p1, anchor));

            verts.push(Point.Add(p0, t0));
            verts.push(Point.Sub(p1, anchor));
            verts.push(Point.Add(p1, t0));

            if (join === "round") {

                var _p0 = Point.Add(p1, t0);
                var _p1 = Point.Add(p1, t2);
                var _p2 = Point.Sub(p1, anchor);

                var center = p1;

                verts.push(_p0);
                verts.push(center);
                verts.push(_p2);

                createRoundCap(center, _p0, _p1, _p2, verts);

                verts.push(center);
                verts.push(_p1);
                verts.push(_p2);

            } else {

                if (join === "bevel" || (join === "miter" && dd >= miterLimit)) {
                    verts.push(Point.Add(p1, t0));
                    verts.push(Point.Add(p1, t2));
                    verts.push(Point.Sub(p1, anchor));
                }

                if (join === 'miter' && dd < miterLimit) {
                    verts.push(pintersect);
                    verts.push(Point.Add(p1, t0));
                    verts.push(Point.Add(p1, t2));
                }
            }

            verts.push(Point.Add(p2, t2));
            verts.push(Point.Sub(p1, anchor));
            verts.push(Point.Add(p1, t2));

            verts.push(Point.Add(p2, t2));
            verts.push(Point.Sub(p1, anchor));
            verts.push(Point.Sub(p2, t2));
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    /////////////////                                                    /////////////////////
    /////////////////        DRAWING CODE - DON'T WORRY ABOUT THIS       /////////////////////
    /////////////////                                                    /////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////

    function drawStroke(lineWidth, points, color) {

        var tris = getStrokeGeometry(points, {
            width: lineWidth,
            cap : lineCap,
            join : lineJoin,
            miterLimit : miterLimit
        });

        // every 3 points, is a tri
        ctx.strokeStyle=color;
        for (var i = 0; i < tris.length; i += 3) {
            ctx.beginPath();
            ctx.moveTo(tris[i].x, tris[i].y);
            ctx.lineTo(tris[i + 1].x, tris[i + 1].y);
            ctx.lineTo(tris[i + 2].x, tris[i + 2].y);
            ctx.closePath();

            ctx.stroke();
        }

        // draw points.
        for (var i = 0; i < points.length; i++) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 10, 0, 2 * Math.PI, false);
            ctx.fill();
        }



    }

    var lineCap= "butt";
    var lineJoin= "round";
    var lines= true;
    var miterLimit= 10;
    var drawWithCanvas= true;
    var lineWidth= 80;
    var points = [
        new Point(500, 100),
        new Point(100, 300),
        new Point(400, 500)
    ];

    var canvas = document.getElementById("c");
    canvas.width = 600;
    canvas.height = 600;
    var ctx = canvas.getContext("2d");

    function drawLine( p0, p1, color, width ) {
        if ( !lines ) {
            return;
        }

        ctx.save();
        ctx.translate( p0.x, p0.y );
        ctx.rotate( -Point.Angle(p0,p1) );

        var len= Point.Sub( p0, p1).length();

        ctx.lineWidth= width;
        ctx.strokeStyle= color;
        ctx.beginPath();
        ctx.moveTo( 0,0 );
        ctx.lineTo( 0, len );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo( 0, len );
        ctx.lineTo( -5, len-10 );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo( 0, len );
        ctx.lineTo( 5, len-10 );
        ctx.stroke();

        ctx.restore();
    }

    function drawCrossingLine( _p0, _p1, t1, color, width ) {

        if ( !lines ) {
            return;
        }

        var p0= Point.Add( _p0, t1 );
        var p1= Point.Add( _p1, t1 );
        var pdif= Point.Sub( p1,p0).normalize();
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth= width;
        ctx.strokeStyle=color;
        ctx.moveTo( p0.x- 1000*pdif.x, p0.y-1000*pdif.y );
        ctx.lineTo( p0.x + 1000*pdif.x, p0.y + 1000*pdif.y );
        ctx.stroke();
        ctx.restore();
    }

    function drawInfo() {
        drawLine( points[0], points[1], "#00f", 4 );
        drawLine( points[1], points[2], "#00f", 4 );

        var t1= Point.Sub( points[1], points[0]).perpendicular().normalize().scalarMult( lineWidth/2 );
        var t2= Point.Sub( points[2], points[1]).perpendicular().normalize().scalarMult( lineWidth/2 );
        if ( signedArea( points[0], points[1], points[2]) > 0 ) {
            t1.scalarMult(-1);
            t2.scalarMult(-1);
        }

        if ( sizePoints===null ) {
            sizePoints= [
                { point: new Point(), reference:points[0] },
                { point: new Point(), reference:points[0] },
                { point: new Point(), reference:points[1] },
                { point: new Point(), reference:points[1] },
                { point: new Point(), reference:points[2] },
                { point: new Point(), reference:points[2] }
            ];
        }

        var p;
        drawLine( points[0], p=Point.Add( points[0], t1 ), "#0f0", 2 );
        sizePoints[0].point.x= p.x;
        sizePoints[0].point.y= p.y;
        drawLine( points[0], p=Point.Sub( points[0], t1 ), "#070", 2 );
        sizePoints[1].point.x= p.x;
        sizePoints[1].point.y= p.y;
        drawLine( points[1], p=Point.Add( points[1], t1 ), "#0f0", 2 );
        sizePoints[2].point.x= p.x;
        sizePoints[2].point.y= p.y;

        drawLine( points[1], p=Point.Add( points[1], t2 ), "#0f0", 2 );
        sizePoints[3].point.x= p.x;
        sizePoints[3].point.y= p.y;
        drawLine( points[2], p=Point.Add( points[2], t2 ), "#0f0", 2 );
        sizePoints[4].point.x= p.x;
        sizePoints[4].point.y= p.y;
        drawLine( points[2], p=Point.Sub( points[2], t2 ), "#070", 2 );
        sizePoints[5].point.x= p.x;
        sizePoints[5].point.y= p.y;


        // from p0+t1 to p1+t1, draw a line.

        drawCrossingLine( points[0], points[1], t1, "#f00", 3 );
        drawCrossingLine( points[1], points[2], t2, "#f00", 3 );

        var pintersect = lineIntersection(
                Point.Add(t1, points[0]), Point.Add(t1, points[1]),
                Point.Add(t2, points[2]), Point.Add(t2, points[1]));

        if ( pintersect && lines ) {

            var anchor = null;
            var anchorLength = Number.MAX_VALUE;
            anchor = Point.Sub(pintersect, points[1]);
            anchorLength = anchor.length();

            var p0p1 = Point.Sub(points[0], points[1]);
            var p0p1Length = p0p1.length();
            var p1p2 = Point.Sub(points[1], points[2]);
            var p1p2Length = p1p2.length();

            /**
             * the cross point exceeds any of the segments dimension.
             * do not use cross point as reference.
             */
            if (anchorLength <= p0p1Length && anchorLength <= p1p2Length) {
                ctx.save();
                ctx.fillStyle="#00f";
                ctx.beginPath();
                ctx.arc( pintersect.x, pintersect.y, 10, 0, 2*Math.PI, false );
                ctx.fill();
                ctx.restore();

                var pintersect2= Point.Add( points[1], Point.Sub( points[1], pintersect) );
                ctx.save();
                ctx.fillStyle="#00f";
                ctx.beginPath();
                ctx.arc( pintersect2.x, pintersect2.y, 10, 0, 2*Math.PI, false );
                ctx.fill();
                ctx.restore();

                drawLine(points[1], pintersect2, "#f0f", 3);
            }
        }

    }

    function redraw() {
        ctx.fillStyle="#eee";
        ctx.fillRect( 0, 0, canvas.width, canvas.height );

        if ( drawWithCanvas ) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth= lineWidth;
            ctx.miterLimit= miterLimit;
            ctx.lineCap= lineCap;
            ctx.lineJoin= lineJoin;
            ctx.moveTo( points[0].x, points[0].y );
            for( var i=1; i<points.length; i++ ) {
                ctx.lineTo( points[i].x, points[i].y );
            }
            ctx.strokeStyle="#ccc";
            ctx.stroke();
            ctx.restore();
        }


        drawStroke(lineWidth, points, "#999");
        drawInfo();
    }


    var sizePoints= null;

    redraw();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var capturedPoint= null;
    var capturedType= "none";
    var capturedReference= null;
    var prevX= 0;
    var prevY= 0;


    function hasTouch() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    if ( hasTouch() ) {
        canvas.addEventListener( "touchstart", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            e= e.targetTouches[0];
            down( e );
        }, false);

        canvas.addEventListener( "touchmove", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            move( e.changedTouches[0] );
        }, false);

        canvas.addEventListener( "touchend", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            capturedPoint= null;
        }, false);

        canvas.addEventListener( "touchcancel", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            capturedPoint= null;
        }, false);

    } else {

        canvas.addEventListener( "mouseup", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            capturedPoint= null;
        }, false );

        canvas.addEventListener( "mousedown", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            down( e );
        }, false );

        canvas.addEventListener( "mousemove", function(e) {
            e.preventDefault();
            if (e.stopPropagation) {e.stopPropagation()}
            move( e );
        }, false );
    }

    function down( e ) {
        
        var r=e.target.getClientRects()[0];
        var x= e.offsetX || (e.clientX - (r.x||r.left));
        var y= e.offsetY || (e.clientY - (r.y||r.top));

        if ( lines && sizePoints ) {
            for (var i = 0; i < sizePoints.length; i++) {
                if (Point.Sub(sizePoints[i].point, new Point(x, y)).length() < 15) {
                    capturedPoint = new Point(sizePoints[i].point.x, sizePoints[i].point.y);
                    prevX = x;
                    prevY = y;
                    capturedReference = sizePoints[i].reference;
                    capturedType = "size";
                    return;
                }
            }
        }

        for( var i=0; i<points.length; i++ ) {
            if ( Point.Sub( points[i], new Point(x,y)).length()<15 ) {
                capturedPoint= points[i];
                capturedType="move";
                prevX= x;
                prevY= y;
                return;
            }
        }

        capturedPoint= null;

    }

    function move( e ) {

        if ( !capturedPoint ) {
            return;
        }

        var r=e.target.getClientRects()[0];
        var x= e.offsetX || (e.clientX - (r.x||r.left));
        var y= e.offsetY || (e.clientY - (r.y||r.top));

        capturedPoint.x += x - prevX;
        capturedPoint.y += y - prevY;

        if ( lines && capturedType==="size") {
            var nv= Point.Sub( new Point( capturedPoint.x, capturedPoint.y ), capturedReference );
            var s= Math.cos( Point.Angle( nv, Point.Sub(capturedPoint, capturedReference) ) ) * nv.length();
            lineWidth= Math.abs(2*s);
        }

        prevX = x;
        prevY = y;

        redraw();

    }

        document.getElementById("cap").onchange= function(e) {
            lineCap= e.target[e.target.selectedIndex].value;
            redraw();
        };
        document.getElementById("join").onchange= function(e) {
            lineJoin= e.target[e.target.selectedIndex].value;
            redraw();
        };
        document.getElementById("miter").onchange= function(e) {
            miterLimit= parseInt(e.target[e.target.selectedIndex].value);
            redraw();
        };
        document.getElementById("lines").onclick= function(e) {
            lines= e.target.checked;
            redraw();
        };
        document.getElementById("canvas").onclick= function(e) {
            drawWithCanvas= e.target.checked;
            redraw();
        };

    })();