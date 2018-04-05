MoMa.Module({
    defines : "Test.BDecorated",
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
            return "superValue='" + this.__super() + "' value='" + this.val2 + "'";
        }
    },

    // decorated = true makes all overriden functions to be decorated.
    // that means they are closured in a function which offers a __super symbol for each superclass's
    // overriden method.
    // see getValue in comparison with B.js getValue function.
    decorated : true
});
