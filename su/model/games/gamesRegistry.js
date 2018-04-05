/**
 * Created by Ibon Tolosana - @hyperandroid
 * User: ibon
 * Date: 15/04/12
 * Time: 22:48
 */

(function() {

    var GamesRegistry= function() {

        this.families=  {};
        this.games=     {};

        return this;
    };

    GamesRegistry.prototype= {

        families    : null,
        games       : null,

        /**
         *
         * @param gameRegistry
         *
         * object {
         *  id<string>,
         *  family<string>,
         *  game<string>,
         *  clazz<string>,
         *  constructorParams<array<object>>,
         *  instructions<string>
         * }
         */
        registerGame : function( gameRegistry ) {
            if ( !gameRegistry ) {
                throw "Empty game";
            }

            if ( typeof this.games[ gameRegistry.id ]!=="undefined" ) {
                throw "Game already registered: "+gameRegistry.id;
            }

            var family= this.families[ gameRegistry.family ];
            if ( typeof family==="undefined" ) {
                family= {};
                this.families[ gameRegistry.family ]= family;
            }

            if( typeof family[ gameRegistry.game ]!=="undefined" ) {
                throw "Already registered game. "+gameRegistry.game;
            }

            family[ gameRegistry.game ]= {
                id                  : gameRegistry.id,
                clazz               : gameRegistry.clazz,
                constructorParams   : gameRegistry.params,
                instructions        : gameRegistry.instructions
            };

            this.games[ gameRegistry.id ]= family[ gameRegistry.game ];

            return SU.GamesRegistry;
        },

        createGame : function( id ) {
            if ( typeof this.games[id]==="undefined" ) {
                throw "Game "+id+" does not exist.";
            }

            var gameD= this.games[id];

            var objs= gameD.clazz.split(".");
            var obj= window;
            while( objs.length ) {
                obj= obj[ objs.shift() ];
            }
            return obj.apply(window, gameD.constructorParams );
        },

        enumerate : function( ) {
            console.log("By family: ");
            for ( var family in this.families ) {
                console.log("  Family: "+family);
                for( var game in this.families[family] ) {
                    console.log("    "+this.families[family][game].id);
                }
            }

            console.log("");
            console.log("By Game:");
            for( var game in this.games ) {
                console.log( "  "+this.games[game].id );
            }
        },

        getGames : function() {
            var games= [];

            for( var game in this.games ) {
                games.push( this.games[game].id );
            }

            return games;
        }
    };

    var registry= new GamesRegistry();

    SU.GamesRegistry= {
        register    : registry.registerGame.bind(registry),
        createGame  : registry.createGame.bind(registry),
        enumerate   : registry.enumerate.bind(registry),
        getGames    : registry.getGames.bind(registry)
    };

})();