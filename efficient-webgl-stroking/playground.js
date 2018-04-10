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
                    return [];
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

                    // if (points[0] === points[points.length - 1] ||
                            // (points[0].x === points[points.length - 1].x && points[0].y === points[points.length - 1].y )) {
        // 
                        // var p0 = points.shift();
                        // p0 = Point.Middle(p0, points[0]);
                        // points.unshift(p0);
                        // points.push(p0);
                        // closed= true;
                    // }

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

                // make the round caps point in the right direction.

                // calculate minimum angle between two given angles.
                // for example: -Math.PI, Math.PI = 0, -Math.PI/2, Math.PI= Math.PI/2, etc.
                if ( angle1 > angle0) {
               		while ( angle1-angle0>=Math.PI-EPSILON) {
               			angle1=angle1-2*Math.PI;
               		}
               	}
               	else {
               		while ( angle0-angle1>=Math.PI-EPSILON) {
               			angle0=angle0-2*Math.PI;
               		}
               	}

                var angleDiff = angle1-angle0;

                // for angles equal Math.PI, make the round point in the right direction.
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


                // calculate points, and make the cap.
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

                t0.perpendicular().normalize().scalarMult(width);
                t2.perpendicular().normalize().scalarMult(width);

                // triangle composed by the 3 points if clockwise or couterclockwise.
                // if counterclockwise, we must invert the line threshold points, otherwise the intersection point
                // could be erroneous and lead to odd results.
                if (signedArea(p0, p1, p2) > 0) {
                    t0.invert();
                    t2.invert();
                }

                var pintersect = lineIntersection(Point.Add(p0, t0), Point.Add(p1, t0), Point.Add(p2, t2), Point.Add(p1, t2));

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
                 * This case deserves more attention to avoid redraw, currently works by overdrawing large parts.
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
                    ctx.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI, false);
                    ctx.fill();
                }



            }

            var lineCap= "butt";
            var lineJoin= "bevel";
            var lines= false;
            var miterLimit= 10;
            var drawWithCanvas= false;
            var lineWidth= 10;
            var points = JSON.parse('[{"x":30,"y":268},{"x":29,"y":267},{"x":27,"y":255},{"x":27,"y":242},{"x":27,"y":230},{"x":30,"y":220},{"x":40,"y":206},{"x":49,"y":197},{"x":59,"y":189},{"x":73,"y":180},{"x":83,"y":176},{"x":92,"y":183},{"x":94,"y":198},{"x":94,"y":216},{"x":94,"y":227},{"x":94,"y":245},{"x":93,"y":261},{"x":92,"y":278},{"x":89,"y":292},{"x":86,"y":306},{"x":85,"y":317},{"x":81,"y":336},{"x":80,"y":347},{"x":78,"y":359},{"x":76,"y":377},{"x":75,"y":387},{"x":73,"y":397},{"x":70,"y":409},{"x":56,"y":401},{"x":49,"y":389},{"x":43,"y":373},{"x":43,"y":360},{"x":46,"y":347},{"x":50,"y":336},{"x":58,"y":324},{"x":69,"y":317},{"x":83,"y":316},{"x":97,"y":316},{"x":108,"y":316},{"x":129,"y":316},{"x":139,"y":314},{"x":152,"y":303},{"x":163,"y":288},{"x":167,"y":277},{"x":172,"y":260},{"x":175,"y":245},{"x":175,"y":234},{"x":175,"y":223},{"x":173,"y":212},{"x":162,"y":210},{"x":153,"y":222},{"x":148,"y":236},{"x":147,"y":252},{"x":146,"y":264},{"x":145,"y":277},{"x":145,"y":293},{"x":145,"y":304},{"x":145,"y":318},{"x":145,"y":330},{"x":145,"y":342},{"x":145,"y":355},{"x":145,"y":367},{"x":145,"y":380},{"x":148,"y":392},{"x":157,"y":397},{"x":170,"y":392},{"x":183,"y":380},{"x":194,"y":362},{"x":197,"y":348},{"x":200,"y":338},{"x":215,"y":342},{"x":228,"y":346},{"x":236,"y":339},{"x":237,"y":329},{"x":232,"y":320},{"x":222,"y":312},{"x":212,"y":311},{"x":203,"y":317},{"x":198,"y":326},{"x":194,"y":336},{"x":194,"y":349},{"x":197,"y":359},{"x":202,"y":369},{"x":210,"y":377},{"x":219,"y":383},{"x":229,"y":386},{"x":241,"y":386},{"x":254,"y":377},{"x":272,"y":363},{"x":284,"y":350},{"x":292,"y":337},{"x":301,"y":322},{"x":307,"y":312},{"x":311,"y":300},{"x":314,"y":289},{"x":317,"y":275},{"x":321,"y":260},{"x":322,"y":243},{"x":322,"y":229},{"x":318,"y":219},{"x":312,"y":209},{"x":301,"y":215},{"x":295,"y":228},{"x":291,"y":240},{"x":288,"y":254},{"x":287,"y":264},{"x":286,"y":274},{"x":286,"y":286},{"x":286,"y":300},{"x":286,"y":312},{"x":286,"y":325},{"x":287,"y":335},{"x":288,"y":346},{"x":292,"y":358},{"x":295,"y":371},{"x":302,"y":380},{"x":318,"y":380},{"x":333,"y":373},{"x":348,"y":363},{"x":360,"y":351},{"x":366,"y":340},{"x":370,"y":328},{"x":375,"y":316},{"x":378,"y":304},{"x":381,"y":293},{"x":385,"y":277},{"x":387,"y":265},{"x":389,"y":254},{"x":390,"y":240},{"x":390,"y":226},{"x":390,"y":215},{"x":380,"y":211},{"x":369,"y":220},{"x":362,"y":232},{"x":359,"y":246},{"x":359,"y":257},{"x":358,"y":268},{"x":358,"y":279},{"x":357,"y":291},{"x":356,"y":304},{"x":355,"y":317},{"x":352,"y":327},{"x":353,"y":337},{"x":357,"y":347},{"x":364,"y":357},{"x":372,"y":364},{"x":383,"y":366},{"x":398,"y":363},{"x":408,"y":352},{"x":417,"y":340},{"x":424,"y":331},{"x":432,"y":323},{"x":438,"y":314},{"x":432,"y":327},{"x":428,"y":338},{"x":427,"y":349},{"x":427,"y":361},{"x":440,"y":359},{"x":449,"y":353},{"x":458,"y":344},{"x":462,"y":333},{"x":464,"y":318},{"x":458,"y":307},{"x":447,"y":303},{"x":440,"y":314},{"x":444,"y":324},{"x":456,"y":326},{"x":467,"y":326},{"x":477,"y":324},{"x":486,"y":331},{"x":492,"y":341},{"x":492,"y":353},{"x":492,"y":369},{"x":485,"y":387},{"x":481,"y":397},{"x":477,"y":409},{"x":452,"y":424},{"x":437,"y":431},{"x":427,"y":434},{"x":412,"y":437},{"x":401,"y":437},{"x":387,"y":437},{"x":372,"y":434},{"x":356,"y":430},{"x":338,"y":426},{"x":326,"y":424},{"x":313,"y":423},{"x":289,"y":420},{"x":278,"y":419},{"x":267,"y":419},{"x":252,"y":421},{"x":238,"y":424},{"x":226,"y":429},{"x":216,"y":433},{"x":207,"y":440},{"x":203,"y":450},{"x":204,"y":460},{"x":215,"y":465},{"x":226,"y":465},{"x":241,"y":465}]');

            var maxPoints= 50;

            var canvas = document.getElementById("cc");
            canvas.width = 600;
            canvas.height = 600;
            var ctx = canvas.getContext("2d");


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

                ctx.lineWidth=1;
                drawStroke(lineWidth, points, "#999");
            }


            redraw();

            //////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////
            /////////////////                                                    /////////////////////
            /////////////////      Input Code - Don't pay attention to this      /////////////////////
            /////////////////                                                    /////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////

            var _isDown= false;
            var prevX=0;
            var prevY=0;
            var firstTimeEver= true;

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
                    _isDown= false;
                }, false);

                canvas.addEventListener( "touchcancel", function(e) {
                    e.preventDefault();
                    if (e.stopPropagation) {e.stopPropagation()}
                    _isDown= false;
                }, false);

            } else {

                canvas.addEventListener( "mouseup", function(e) {
                    e.preventDefault();
                    if (e.stopPropagation) {e.stopPropagation()}
                    _isDown= false;
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
                
                if ( firstTimeEver ) {
                    points= [];
                    lineWidth= 20;
                }

                var r=e.target.getClientRects()[0];
                var x= e.offsetX || (e.clientX - (r.x||r.left));
                var y= e.offsetY || (e.clientY - (r.y||r.top));
                _isDown= true;

                points.push( new Point(x,y) );

            }

            function move( e ) {

                if ( _isDown ) {
                    var r=e.target.getClientRects()[0];
                    var x= e.offsetX || (e.clientX - (r.x||r.left));
                    var y= e.offsetY || (e.clientY - (r.y||r.top));

                    var difx= x-prevX, dify= y-prevY;

                    var d= Math.sqrt( difx*difx + dify*dify );
                    if ( d>10 ) {
                        if ( points.length>maxPoints ) {
                            points.shift();
                        }
                        points.push( new Point(x, y) );
                        prevX= x;
                        prevY= y;
                    }


                    redraw();
                }
            }

                document.getElementById("pcap").onchange= function(e) {
                    lineCap= e.target[e.target.selectedIndex].value;
                    redraw();
                };
                document.getElementById("pjoin").onchange= function(e) {
                    lineJoin= e.target[e.target.selectedIndex].value;
                    redraw();
                };
                document.getElementById("pmiter").onchange= function(e) {
                    miterLimit= parseInt(e.target[e.target.selectedIndex].value);
                    redraw();
                };
                document.getElementById("pclear").onclick= function(e) {
                    points= [];
                    redraw();
                };
                document.getElementById("pcanvas").onclick= function(e) {
                    drawWithCanvas= e.target.checked;
                    redraw();
                };
                document.getElementById("plineWidth").onchange= function(e) {
                    lineWidth= e.target.value;
                    redraw();
                };
                document.getElementById("ppoints").onchange= function(e) {
                    maxPoints= parseInt(e.target[e.target.selectedIndex].value);
                    while( points.length>maxPoints ) {
                        points.shift();
                    }
                    redraw();
                };

            })();
