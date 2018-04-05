(function() {

    GS.WebGLUtils= {
        nextPowerOf2 : function ( val ) {
            val--;
            val = (val >> 1) | val;
            val = (val >> 2) | val;
            val = (val >> 4) | val;
            val = (val >> 8) | val;
            val = (val >> 16) | val;
            val++;
            return val;
        }
    };

})();