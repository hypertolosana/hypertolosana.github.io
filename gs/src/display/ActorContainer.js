(function () {


    /**
     * @name ActorContainer
     * @memberOf GS
     * @extends GS.Actor
     * @constructor
     */
    GS.ActorContainer = function () {
        GS.ActorContainer._superclass.constructor.call(this);

        /**
         * @property
         * @memberOf GS.ActorContainer.prototype
         * @type {Array}
         */
        this._actorsToAdd = [];

        /**
         * @property
         * @memberOf GS.ActorContainer.prototype
         * @type {Array}
         */
        this._actors= [];

        return this;
    };

    var __GS_ActorContainerPrototype = {

        /**
         * @lends GS.ActorContainer.prototype
         */

        /**
         * Add a new actor. Actors are added in a delayed manner, so we avoid concurrently modify a children traversal.
         * Actors are kept in a double linked list.
         * @param actor
         */
        addActor: function (actor) {

            this._actorsToAdd.push(actor);
            return this;
        },

        __addActorImpl: function (actor, node) {
            this._actors.push(actor);
            actor.parent = this;
        },

        __paintActor: function (ctx, time) {

            GS.ActorContainer._superclass.__paintActor.call(this, ctx, time);
            // if (!this.AABB.intersects(director.AABB)) { return; }

            if ( this._actorsToAdd.length ) {
                for (var i = 0, l = this._actorsToAdd.length; i < l; ++i) {
                    this.__addActorImpl(this._actorsToAdd[i]);
                }
                this._actorsToAdd = [];
            }

            for( var i= 0, l=this._actors.length; i<l; ++i ) {
                this._actors[i].__paintActor(ctx, time);
            }

            return true;
        },

        __paintActorGL: function (ctx, time) {

            GS.ActorContainer._superclass.__paintActorGL.call(this, ctx, time);
            // if (!this.AABB.intersects(director.AABB)) { return; }

            if ( this._actorsToAdd.length ) {
                for (var i = 0, l = this._actorsToAdd.length; i < l; ++i) {
                    this.__addActorImpl(this._actorsToAdd[i]);
                }
                this._actorsToAdd = [];
            }

            for( var i= 0, l=this._actors.length; i<l; ++i ) {
                this._actors[i].__paintActorGL(ctx, time);
            }

            return true;
        }

    };

    GS.Actor.extend(GS.ActorContainer, __GS_ActorContainerPrototype);

})();