/**
 Slide

 An element composed of background (container) and content (container)
 */

(function() {

    /**
     *
     * An slideContent is a piece of an slide.
     * This slide content has the abbility to be brought in/out of the scene with
     * animation.
     * This content can contain nested content, which can be animated as well.
     *
     * @constructor
     */
    CAAT.SlideContent = function() {
        CAAT.SlideContent.superclass.constructor.call(this);
        this.nestedContent= [];
        return this;
    };

    CAAT.SlideContent.NONE= 0;
    CAAT.SlideContent.OUT=  1;

    CAAT.SlideContent.prototype= {

        nestedContent:  null,
        currentContent: -1,
        focusPolicy:    CAAT.SlideContent.NONE,
        callback:       null,

        /**
         * Add a nested SlideContent.
         * @param content {CAAT.SlideContent}
         */
        addContent : function( content, className ) {
            this.addChild(content);
            this.nestedContent.push(content);
            if ( className ) {
                content.domElement.className+= className;
            }
            content.setOutOfFrameTime();

            return this;
        },

        hasContent : function() {
            return this.nestedContent && this.nestedContent.length;
        },

        /**
         * Show next browsable content.
         * @return {boolean} true, new content has been shown. false, there's no more content, so
         *         probably switch to next slide.
         */
        showNextContent : function() {
            if ( this.hasContent() ) {
                if ( this.currentContent===-1 ) {
                    this.currentContent++;
                    this.show(true);
                    return true;
                } else {
                    if ( !this.nestedContent[ this.currentContent ].showNextContent() ) {
                        if ( this.currentContent < this.nestedContent.length-1 ) {
                            this.nestedContent[ this.currentContent ].lostFocus();
                            this.currentContent++;
                            this.show(true);
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            } else {
                return false;
            }
        },

        /**
         * Hide current content, and focus on previous one.
         */
        showPrevContent : function() {

            if ( this.hasContent() ) {
                if ( -1===this.currentContent ) {
                    return false;
                }
                
                 if ( !this.nestedContent[ this.currentContent ].showPrevContent() ) {
                    if ( this.currentContent >= 0 ) {
                        this.show(false);
                        this.currentContent--;
                        if ( this.currentContent>-1 ) {
                            this.nestedContent[ this.currentContent ].gotFocus();
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },


        /**
         * Show a subcontent
         * @return this
         */
        show : function(show) {
            if (show) {
                this.nestedContent[ this.currentContent ].gotFocus();
            } else {
                this.nestedContent[ this.currentContent ].setOutOfFrameTime();
            }

            return this;
        },

        lostFocus : function() {
            if ( this.focusPolicy===CAAT.SlideContent.OUT ) {
                this.setOutOfFrameTime();
            }
        },

        gotFocus : function() {
            this.setFrameTime(
                this.parent.time,
                Number.MAX_VALUE);

            if ( this.callback ) {
                this.callback(this);
            }
        },

        setText : function(text, styleClass) {

            if ( styleClass ) {
                this.domElement.className+= styleClass;
            }
            this.domElement.innerHTML=text;
            return this;
        },

        setOnFocus : function( focus_policy, callback ) {
            this.focusPolicy= focus_policy;
            if ( callback ) {
                this.callback= callback;
            }
            return this;
        },

        getNestedContentSize : function() {
            return this.nestedContent.length;
        },

        getNestedContentIndex : function() {
            return this.currentContent !== -1 ?
                this.currentContent : 0;
        }
    };

    extend( CAAT.SlideContent, CAAT.ActorContainer );
})();

(function() {

    /**
     * An Slide, is a whole scene
     */
    CAAT.Slide= function() {
        CAAT.Slide.superclass.constructor.call(this);
        return this;
    };

    CAAT.Slide.prototype= {

        mainContent:    null,

        /**
         * Add new content to this Slide.
         * A content is a traversable element.
         * @param content {CAAT.SlideContent}
         */
        addContent : function( content, className ) {
            this.mainContent.addContent( content, className );
            this.setZOrder( this.mainContent, Number.MAX_VALUE );
            return this;
        },

        /**
         * 
         * @param director {CAAT.Director} a director instance.
         */
        initialize : function(w, h, main_content) {
            this.mainContent= main_content;
            this.addChild( this.mainContent );
            return this;
        },

        /**
         * Show next browsable content from this slide.
         * If no more content is available, show next slide.
         */
        showNextContent : function() {
            return this.mainContent.showNextContent();
        },

        showPrevContent : function() {
            return this.mainContent.showPrevContent();
        },

        getContentSize : function() {
            return this.mainContent.getNestedContentSize();
        },

        getCurrentContentIndex : function() {
            return this.mainContent.getNestedContentIndex();
        }


    };

    extend( CAAT.Slide, CAAT.Scene );

})();

(function() {
    CAAT.SlideManager = function() {
        this.slides=        [];
        this.listenerList=  [];
        return this;
    };

    CAAT.SlideManager.prototype= {

        director:       null,
        slides:         null,
        currentSlide:   0,
        listenerList:   null,

        contentPadding: 25,

        initialize : function(director) {
            this.director= director;
            return this;
        },

        createSlide : function(backgroundImage) {
            var w= this.director.width;
            var h= this.director.height;
            var slide= new CAAT.Slide().initialize( w, h, this.createContent(w, h) );
            
            if ( backgroundImage ) {
                slide.setBackgroundImage( backgroundImage );
            }

            this.director.addScene( slide );
            this.slides.push( slide );

            return this;
        },

        next : function() {

            // no content defined.
            if ( !this.slides || !this.slides.length ) {
                return;
            }

            // if the current slide has no more content
            if ( !this.slides[ this.currentSlide ].showNextContent() ) {
                // and there more slides
                if ( this.currentSlide != this.slides.length-1 ) {
                    this.show
                    // show next slide.
                    this.director.easeInOut(
                            this.director.getCurrentSceneIndex()+1,
                            CAAT.Scene.EASE_TRANSLATE,
                            CAAT.Actor.prototype.ANCHOR_BOTTOM,
                            this.director.getCurrentSceneIndex(),
                            CAAT.Scene.EASE_TRANSLATE,
                            CAAT.Actor.prototype.ANCHOR_TOP,
                            1000,
                            false,
                            new CAAT.Interpolator().createExponentialInOutInterpolator(3,false),
                            new CAAT.Interpolator().createExponentialInOutInterpolator(3,false) );

                    this.currentSlide++;

                    this.slides[ this.currentSlide ].showNextContent();
                }
            } else {
                this.fireContentEvent();
            }
        },

        prev : function() {
            // no content defined.
            if ( !this.slides || !this.slides.length ) {
                return;
            }

            if ( !this.slides[ this.currentSlide ].showPrevContent() ) {
                if ( this.currentSlide != 0 ) {
                    this.director.easeInOut(
                            this.director.getCurrentSceneIndex()-1,
                            CAAT.Scene.EASE_TRANSLATE,
                            CAAT.Actor.prototype.ANCHOR_TOP,
                            this.director.getCurrentSceneIndex(),
                            CAAT.Scene.EASE_TRANSLATE,
                            CAAT.Actor.prototype.ANCHOR_BOTTOM,
                            1000,
                            false,
                            new CAAT.Interpolator().createExponentialInOutInterpolator(3,false),
                            new CAAT.Interpolator().createExponentialInOutInterpolator(3,false) );

                    this.currentSlide--;
                }
            } else {
                this.fireContentEvent();
            }
        },

        getSlide : function( slide_index ) {
            return this.slides[ slide_index ];
        },

        /**
         * Create a new SlideContent. Default size will be slide's size.
         *
         * @return {CAAT.SlideContent}
         */
        createContent : function(w,h) {
            var content= new CAAT.SlideContent();
            if ( w && h ) {
                content.setBounds( 0, 0, w, h );
            }
            return content;
        },

        createContentTitle : function(text) {
            var c= new CAAT.SlideContent().
                setText(text,'content-title');
            return c;
        },

        createContentText : function(text, w, h) {
            return new CAAT.SlideContent(w,h).
                setText(text,'content-text');
        },

        createContentImage : function( image ) {
            return new CAAT.SlideContent().
                setBackgroundImage(image,true);
        },

        getContentSize : function() {
            var c=0;
            for( var i=0; i<this.slides.length;i++ ) {
                c+= this.slides[i].getContentSize();
            }
            return c;
        },

        getCurrentContentIndex : function() {
            var c=0;
            for( var i=0; i<this.currentSlide; i++ ) {
                c+= this.slides[i].getContentSize();
            }
            c+= this.slides[this.currentSlide].getCurrentContentIndex();
            return c;
        },

        addContentListener : function( listener ) {
            this.listenerList.push(listener);
        },

        fireContentEvent : function() {
            for( var i=0, l=this.listenerList.length; i<l; i++ ) {
                this.listenerList[i](this);
            }
        }
    };
})();