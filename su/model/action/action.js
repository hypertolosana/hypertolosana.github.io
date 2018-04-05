
(function() {

    /**
     * @constructor
     */
    SU.Action= function()   {
        this.actions= [];
        return this;
    };

    /**
     * @enum
     */
    SU.Action.Types= {
        DONE:     0,
        UNDONE:   1
    };

    SU.Action.prototype=    {
        actions:    null,
        status:     SU.Action.Types.DONE,

        /**
         *
         * @param action {SU.ActionCardVisible|SU.ActionTransfer}
         */
        addAction : function( action )  {
            this.actions.push( action );
            return this;
        },

        undo : function()   {
            if ( status===SU.Action.Types.UNDONE )  {
                throw 'Undoing already undone action.'
            }

            for( var i=this.actions.length-1; i>=0; i-- )   {
                this.actions[i].undo();
            }

            this.status= SU.Action.Types.UNDONE;

            return this;
        },

        canUndo : function()    {
            return this.status===SU.Action.Types.DONE;
        },

        canRedo : function()    {
            return this.status===SU.Action.Types.UNDONE;
        },

        redo : function()   {
            if ( status===SU.Action.Types.DONE )  {
                throw 'Doing already done action.'
            }

            for( var i=0, l= this.actions.length; i<l; i++ )    {
                this.actions[i].redo();
            }

            this.status= SU.Action.Types.DONE;

            return this;
        }
    };

})();