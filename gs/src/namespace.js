/**
 * @name GS
 * @namespace
 */
window.GS= window.GS || {};

/**
 * @name Math
 * @memberOf GS
 * @namespace
 */
GS.Math= GS.Math || {};

/**
 * @name Object
 * @memberOf GS
 * @returns {*}
 * @constructor
 */
GS.Object= function() {
    this._superclass= null;
    return this;
};

GS.Object.prototype= {};
GS.Object.prototype.constructor= GS.Object;
GS.Object.extend= function( derivative, new_pr ) {
    var obj= Object.create(this.prototype);
    for( var pr in new_pr ) {
        if ( new_pr.hasOwnProperty(pr) ) {
            obj[pr]= new_pr[pr];
        }
    }

    derivative._superclass= this.prototype;
    derivative.extend= this.extend;
    derivative.prototype= obj;
    derivative.prototype.constructor= derivative;

};

