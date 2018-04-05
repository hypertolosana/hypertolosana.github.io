MoMa.Module({
    defines : "Test.B",
    depends : [
        "Test.A"
    ],
    extendsClass : "Test.A",
    extendsWith : {
        __init : function( val, val2 ) {
            this.__super(val);
            this.val2= val2;
        },

        val2 : "Test.B value",

        getValue : function() {

            // this Class definition is not decorated.
            // see this function in comparison with BDecorated.js getValue function.
            return "superValue=" + Test.B.superclass.getValue.call(this)+ " value=" + this.val2;
        }
    }
});
