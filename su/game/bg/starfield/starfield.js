(function() {
    CAAT.Starfield= function() {
        CAAT.Starfield.superclass.constructor.call(this);
        this.m_starData= [];
        this.m_matrix=  [];

        this.createStars();
        return this;
    };

    CAAT.Starfield.prototype= {

        nStars          : 1000,
        m_starData      : null,
        speed           : .2,
        dist            : 256,
        m_matrix        : null,
        xy              : 0,
        xz              : 0,
        yz              : 0,

        paint : function(director, time) {

            var ctx= director.ctx;

            ctx.fillStyle= this.fillStyle;
            ctx.fillRect(0,0,this.width,this.height);

            this.drawStars(ctx);

            for( var i=0; i<this.nStars; i++ ) {
                this.m_starData[i*4+2] -= this.speed;
                if (this.m_starData[i*4+2] < -this.dist) {
                    this.m_starData[i*4+2] = this.dist;
                    this.m_starData[i*4+0] = (((Math.random() > .5) ? 1 : -1) * (Math.random() * this.dist))>>0;
                    this.m_starData[i*4+1] = (((Math.random() > .5) ? 1 : -1) * (Math.random() * this.dist))>>0;
                }
            }

            this.xz= (time%200000)/200000*2*Math.PI;
            this.yz= (time%79000)/79000*2*Math.PI;
            this.rotate();
        },

        createStars : function () {
            this.rotate();

            var i;
            for( i=0; i<this.nStars*4; i++ ) {
                this.m_starData.push(0);
            }

            for ( i = 0; i < this.nStars; i++ ) {
                this.m_starData[i*4+0] = ((Math.random() > .5) ? 1 : -1) * (Math.random() * this.dist)>>0;
                this.m_starData[i*4+1] = ((Math.random() > .5) ? 1 : -1) * (Math.random() * this.dist)>>0;
                this.m_starData[i*4+2] = ((Math.random() > .5) ? 1 : -1) * (Math.random() * this.dist)>>0;

                var d = Math.random();
                if (d < .25) {
                    this.m_starData[i*4+3] = '#444'; //'#ff0000';
                } else if (d < .50) {
                    this.m_starData[i*4+3] = '#888'; //#00ff00';
                } else if (d < .75) {
                    this.m_starData[i*4+3] = '#bbb'; //'#0000ff';
                } else {
                    this.m_starData[i*4+3] = '#fff';
                }
            }
        },

        drawStars : function (ctx) {
            var i,l;

            for ( i = 0, l=this.nStars; i < l; i++ ) {

                var xx = this.m_starData[i*4+0];
                var yy = this.m_starData[i*4+1];
                var zz = this.m_starData[i*4+2];

                var m_matrix= this.m_matrix;

                var x = xx * m_matrix[0] + yy * m_matrix[1] + zz * m_matrix[2] + m_matrix[3];
                var y = xx * m_matrix[4] + yy * m_matrix[5] + zz * m_matrix[6] + m_matrix[7];
                var z = xx * m_matrix[8] + yy * m_matrix[9] + zz * m_matrix[10] + m_matrix[11];

                if (z > 0) {

                    var xp = ( this.width >> 1 ) + (x * 256) / z;
                    var yp = ( this.height >> 1 ) + (y * 256) / z;

                    var s=0;
                    if (z < 128) {
                        s = 4;
                    } else if (z < 256) {
                        s = 2;
                    } else {
                        s = 1;
                    }

                    ctx.fillStyle= this.m_starData[i*4+3];
                    ctx.fillRect( xp, yp, s, s );
                }
            }
        },

        rotate : function() {

            var sxy = Math.sin(this.xy);
            var sxz = Math.sin(this.xz);
            var syz = Math.sin(this.yz);
            var cxy = Math.cos(this.xy);
            var cxz = Math.cos(this.xz);
            var cyz = Math.cos(this.yz);

            var m_matrix= this.m_matrix;

            m_matrix[  0 ] = cxz * cxy;
            m_matrix[  1 ] = -cxz * sxy;
            m_matrix[  2 ] = sxz;
            m_matrix[  3 ] = 0;
            m_matrix[  4 ] = syz * sxz * cxy + sxy * cyz;
            m_matrix[  5 ] = cyz * cxy - syz * sxz * sxy;
            m_matrix[  6 ] = -syz * cxz;
            m_matrix[  7 ] = 0;
            m_matrix[  8 ] = syz * sxy - cyz * sxz * cxy;
            m_matrix[  9 ] = cyz * sxz * sxy + syz * cxy;
            m_matrix[  10] = cyz * cxz;
            m_matrix[ 11 ] = this.dist;
            m_matrix[ 12 ] = 0;
            m_matrix[ 13 ] = 0;
            m_matrix[ 14 ] = 0;
            m_matrix[ 15 ] = 1;
        }
    };

    extend( CAAT.Starfield, CAAT.Actor );

})();