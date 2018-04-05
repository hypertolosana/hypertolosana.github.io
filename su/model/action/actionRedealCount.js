/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 08/01/12
 * Time: 00:36
 */
(function() {
    SU.ActionRedealCount= function(model) {
        this.model= model;
        return this;
    };

    SU.ActionRedealCount.prototype= {

        model:  null,

        undo : function() {
            this.model.numDeals--;
            return this;
        },

        redo: function() {
            this.model.numDeals++;
            return this;
        }
    }
})();