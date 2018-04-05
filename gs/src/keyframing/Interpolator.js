(function () {


    /**
     * @name Interpolator
     * @memberOf GS
     * @constructor
     */
    GS.Interpolator = function () {
        return this;
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param pingpong {boolean}
     * @param inverse {boolean}
     * @returns {number}
     */
    GS.Interpolator.LinearInterpolator = function (pingpong, inverse) {

        this.getValue = function (time) {

            if (pingpong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            if (inverse) {
                time = 1 - time;
            }

            return time;
        };

        return this;
    }

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.BackOutInterpolator = function (bPingPong) {

        this.getValue = function (time, bPingPong) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            time = time - 1;

            return time * time * ((1.70158 + 1) * time + 1.70158) + 1;
        }

        return this;
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param exponent {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.ExponentialInInterpolator = function (exponent, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            return Math.pow(time, exponent);
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param exponent {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.ExponentialOutInterpolator = function (exponent, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            return 1 - Math.pow(1 - time, exponent);
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param exponent {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.ExponentialInOutInterpolator = function (exponent, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            if (time * 2 < 1) {
                return Math.pow(time * 2, exponent) / 2;
            }

            return 1 - Math.abs(Math.pow(time * 2 - 2, exponent)) / 2;
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param p0 { {x:number, y:number } }
     * @param p1 { {x:number, y:number } }
     * @param p2 { {x:number, y:number } }
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.QuadricBezierInterpolator = function (p0, p1, p2, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            return (1 - time) * (1 - time) * p0.y + 2 * (1 - time) * time * p1.y + time * time * p2.y;
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param p0 { {x:number, y:number } }
     * @param p1 { {x:number, y:number } }
     * @param p2 { {x:number, y:number } }
     * @param p3 { {x:number, y:number } }
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.CubicBezierInterpolator = function (p0, p1, p2, p3, bPingPong) {

        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.bPingPong = bPingPong;

        this.getValue = function (time) {
            if (this.bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            var t2 = time * time;
            var t3 = time * t2;

            return (
                this.p0.y + time * (-this.p0.y * 3 + time * (3 * this.p0.y -
                    this.p0.y * time))) + time * (3 * this.p1.y + time * (-6 * this.p1.y +
                this.p1.y * 3 * time)) + t2 * (this.p2.y * 3 - this.p2.y * 3 * time) +
                this.p3.y * t3;
        }

    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param amplitude {number}
     * @param p {number}
     * @param bPingPong {boolean}
     * @returns {number}
     * @constructor
     */
    GS.Interpolator.ElasticOutInterpolator = function (amplitude, p, bPingPong) {

        this.getValue = function (time) {

            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            var s = 0;
            if (time === 0) {
                s = 0;
            } else if (time === 1) {
                s = 1;
            } else {
                s = p / (2 * Math.PI) * Math.asin(1 / amplitude);
            }

            return (amplitude * Math.pow(2, -10 * time) * Math.sin((time - s) * (2 * Math.PI) / p) + 1 );
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param amplitude {number}
     * @param p {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.ElasticInInterpolator = function (amplitude, p, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            var s;
            if (time === 0) {
                s = 0;
            } else if (time === 1) {
                s = 1;
            } else {
                s = p / (2 * Math.PI) * Math.asin(1 / amplitude);
            }

            return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time - s) * (2 * Math.PI) / p) );
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param amplitude {number}
     * @param p {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.ElasticInOutInterpolator = function (amplitude, p, bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            var s = p / (2 * Math.PI) * Math.asin(1 / amplitude);
            time *= 2;
            var v = (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time - s) * (2 * Math.PI) / p));
            if (time <= 1) {
                return -0.5 * v;
            }

            return 1 + 0.5 * v;
        }
    };

    function bounce(time) {
        if ((time /= 1) < (1 / 2.75)) {
            return 7.5625 * time * time;
        } else if (time < (2 / 2.75)) {
            return 7.5625 * (time -= (1.5 / 2.75)) * time + 0.75;
        } else if (time < (2.5 / 2.75)) {
            return 7.5625 * (time -= (2.25 / 2.75)) * time + 0.9375;
        } else {
            return 7.5625 * (time -= (2.625 / 2.75)) * time + 0.984375;
        }
    }

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @returns {number}
     */
    GS.Interpolator.Bounce = function () {

        this.getValue = function (time) {
            return bounce(time);
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.BounceOutInterpolator = function (bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }
            return bounce(time);
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.BounceInInterpolator = function (bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }
            return 1 - bounce(1 - time);
        }
    };

    /**
     * @memberOf GS.Interpolator
     * @static
     * @param time {number}
     * @param bPingPong {boolean}
     * @returns {number}
     */
    GS.Interpolator.BounceInOutInterpolator = function (bPingPong) {

        this.getValue = function (time) {
            if (bPingPong) {
                if (time < 0.5) {
                    time *= 2;
                } else {
                    time = 1 - (time - 0.5) * 2;
                }
            }

            if (time < 0.5) {
                return (1 - bounce(1 - time * 2)) * .5;
            }

            return bounce(time * 2 - 1) * .5 + .5;
        }
    }

})();