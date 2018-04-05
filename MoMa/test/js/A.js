MoMa.Module({

    defines : "Test.A",
    extendsWith : {

        // initialization function is called from the constructor.
        __init : function( val ) {

            if ( typeof val!=="undefined" ) {
                this.val= val;
            }
        },

        val : "test.a value",

        getValue : function() {
            return this.val;
        }
    }

});