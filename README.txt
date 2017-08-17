cd /users/raynovarina/sites/AtomProjects/harp/gsap-sandbox-halftone/

per: https://greensock.com/jump-start-js
     https://greensock.com/get-started-js#intro

Cloned from my repos:

$ git clone https://github.com/RayNovarina/harp-heroku-greensock-getting-started.git gsap-sandbox-halftone
$ cd gsap-sandbox-halftone/

Start harp server:
$ harp server -p 9008

Access via localhost:9008
============================

Modify package.json and Procfile files for Heroku deploy:
  package.json:

    {
      "name": "greensock-sandbox-halftone",
      "version": "0.0.1",
      "description": "Harp server App: javascript/greensock-sandbox-halftone",
      "dependencies": {
        "harp": "*"
      }
    }

  Procfile:

    web: harp server --port $PORT

At github account, create new repository: harp-heroku-gsap-sandbox-halftone and then
locally.
  $ git init
  $ git remote add origin https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git

Create Heroku app:
  $ heroku create harp-gsap-sandbox-htone-94037

$ git remote -v
  heroku  https://git.heroku.com/harp-gsap-sandbox-htone-9403.git (fetch)
  heroku  https://git.heroku.com/harp-gsap-sandbox-htone-9403.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-gsap-sandbox-htone-9403.herokuapp.com shows:

  Welcome to harp/gsap-sandbox-halftone.
  Deployed locally at http://localhost:9008/
  Deployed on Heroku at https://harp-gsap-sandbox-htone-94037.herokuapp.com/

=======================================================================
Create array of animation elements:
    That appear when attached to the conversionContainer.
OR timeline.scene1:
    Draw halftone image - from start till end of drawing image. Start
    with total fade out/invisible. Draw with
    tween.to(dot, homeX, homeY), duration: 0.
<img>.timeline:
  scene1:
      Collapse AnimationElements showing full image to center
      column that fades out.
=======================================================================



Notes:

* Convert link: Display converted particle map once it is done.
    Create particle map and then create a
    canvas in the conversionContainer and write the particle
    dots on it in one pass, i.e. without animation. Just call
    createAnimationElements() with isDrawOnSingleCanvas = true;
* Elements link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
Explode link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then apply the explode animation effect.
    Elements move up and out.
Collapse link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then apply the collapse animation effect.
    Elements move down and inward.
Rise Up link: Create AnimationElements in the animationContainer. Pin below
    their image bottom position, i.e. photo image is visible below the
    animationContainer.
    Delay and then apply the rise up animation effect.
    Elements move up and out.
All link: Create AnimationElements in the animationContainer. Pin them to
    their image home position, i.e. re-create the photo image.
    Delay and then animate a sequence of events: collaspe, rise up.

Create Particle Map: Get exclude and transform cluster logic working.

Create Animation Elements: Get <svg Ball> working, <div>ball</div> working.

All effects link: Add option to animate as GASP TimeLine of effects.

==============================================

// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playStory( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playStory() for activeStory: '" + _this.activeStory.tag + "' *");

  // Play story for active/selectedPhoto. All scenes, i.e. collapse and expand.

  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.storyTimeline ) {
    alert('You MUST create animationElements first via the "Particles, Elements" links.');
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }


  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );

  photoTagToStory( _this, _this.selectedPhotoTag,
  /*3-Resume here when done*/ function( activeScene ) {

  if ( !_this.activeStory.particleMap.particles ) {
  particles( _this, { isOnlyIfNew: true, isRenderParticleMap: true, isCreateSceneInCenterPanel: true },
  /*1-Resume here when done*/ function( activeScene ) {

  /*1-*/});


  var delayMsToWaitForCollapsedState = 0;
  if ( !_this.activeStory.timelines.expandTimelineIsReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    _this.activeStory.timelines.expandTimeline.reverse();
    _this.activeStory.timelines.expandTimelineIsReversed = true;
  }
  setTimeout(function() {
  /*2a-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.play();
  _this.activeStory.timelines.expandTimelineIsReversed = false;
  setTimeout(function() {
  /*2b-Resume here when Timeout done*/
  _this.activeStory.timelines.expandTimeline.reverse();
  _this.activeStory.timelines.expandTimelineIsReversed = true;
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  }, 2500); // end /*2b-timeout*/
  }, delayMsToWaitForCollapsedState); // end /*2a-timeout*/

  /*2-*/});/*1-*/});
}; // end: playStory()


/*
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playStory( _this, options, /*Code to resume when done/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playStory() for activeStory: '" + _this.activeStory.tag + "' *");

  // Play story for active/selectedPhoto. All scenes, i.e. collapse and expand.

  // animationElements MUST have already been created.
  if ( !_this.activeStory.timelines ||
       !_this.activeStory.timelines.storyTimeline ) {
    alert('You MUST create animationElements first via the "Particles, Elements" links.');
    if ( typeof callback == 'function' ) { callback(); return; }
    return;
  }

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done/ function( result ) {

  openSceneContainer( _this, result.item );
  var delayMsToWaitForCollapsedState = 0;
  if ( !_this.activeStory.timelines.expandTimelineIsReversed ) {
    delayMsToWaitForCollapsedState = 2000;
    _this.activeStory.timelines.expandTimeline.reverse();
    _this.activeStory.timelines.expandTimelineIsReversed = true;
  }
  setTimeout(function() {
  /*2a-Resume here when Timeout done/
  _this.activeStory.timelines.expandTimeline.play();
  _this.activeStory.timelines.expandTimelineIsReversed = false;
  setTimeout(function() {
  /*2b-Resume here when Timeout done/
  _this.activeStory.timelines.expandTimeline.reverse();
  _this.activeStory.timelines.expandTimelineIsReversed = true;
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  }, 2500); // end /*2b-timeout/
  }, delayMsToWaitForCollapsedState); // end /*2a-timeout*/

  /*2-/});/*1-/});
}; // end: playStory()
*/

===================================


//----------------------------------------------------------------------------
function storyToActiveScene( _this, story, callback ) {
  //----------------------------------------------------------------------------
  tagToScene( _this, 'particles', story,
  /*1-Resume here when done*/ function( result ) {
  if ( result.isFound &&
       result.item.container.html.elem.style.display == 'block' ) {
    if ( typeof callback == 'function' ) { callback( result.item ); return; }
    return result.item;
  }
  tagToScene( _this, 'elements', story,
  /*2-Resume here when done*/ function( result ) {
  if ( result.isFound &&
       result.item.container.html.elem.style.display == 'block' ) {
    if ( typeof callback == 'function' ) { callback( result.item ); return; }
    return result.item;
  }
  if ( typeof callback == 'function' ) { callback( null ); return; }
  return null;
  /*2-*/});/*1-*/});
};// end: storyToActiveScene()

==================================

//----------------------------------------------------------------------------
function expand( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  var selectedStory = result.item;
  console.log( " ..*4.2) expand() *");
  // Hide the active/visible sceneContainer, we will replace it with ours.
  _this.activeScene.container.html.elem.style.display = 'none';
  tagToScene( _this, 'elements', selectedStory,
  /*2-Resume here when done*/ function( result ) {
  var elementsSceneForSelectedStory = result.item
  elementsSceneForSelectedStory.container.html.elem.style.display = 'block';
  selectedStory.expandTimeline.play();
  if ( typeof callback == 'function' ) { callback(); return; }
  return;
  /*2-*/});/*1-*/});
}; // end: expand()


===================================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'collapse';
  collapse_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );

  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  _this.activeStory = result.item;

  // animationElements MUST have already been created.
  if ( !_this.activeStory.animationElements ||
       !_this.activeStory.animationElements.container ||
       _this.activeStory.animationElements.domElements.html.elems.length == 0 ) {
    alert('You MUST create Animation Elements first via the "Elements" link.');
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  var elementsScene = result.item
  // We need to create a new scene that uses the animationElements[] for the
  // activeStory.
  var collapseScene = newScene( _this, options.sceneTag );
  collapseScene.tag = options.sceneTag;
  collapseScene.container = elementsScene.container;
  collapseScene.animationElements = elementsScene.animationElements;
  collapseScene.proxyContainerTag = 'elements';
  _this.activeScene = collapseScene;
  var animationElements = _this.activeScene.animationElements.domElements.html.elems;

  console.log( " ..*4.3) collapse() animationElementsContainer: '" + $( _this.activeScene.animationElements.container.html.elem ).attr( 'id' ) +
               "' which has " + animationElements.length + " elements" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

  _this.activeStory.collapseTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );
  // Just collaspe down to our "compressed core". If we wanted the position of
  // all particles, we could call a function upon pause() and get the pos info.  via "vars"?
  //_this.collapseTimeline.addPause( options.tweenDuration - ( options.tweenDuration * .30) );

  setAnimationBoundaries( _this, options );
  $.each( animationElements, function( idx, element ) {
    // NOTE: ASSUME that 'particles' scene has played and all animiation elements
    // are currently at their 'home' position.x/y.
    // Collaspe down to our "compressed core".
    // Move element from element.x, element.y to collasped.x, collasped.y.

    // NOTE: maybe each element should have attributes for home.x/y, collasped.x/y?
    // NOTE: if ( isSVGanimationElements)
    _this.activeStory.collapseTimeline.insert(
      TweenMax.to(
        element, _this.settings.tweenDuration,
        { attr: { cx: getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ),
                  cy: getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ),
                },
             	  //autoAlpha: 0,
                //ease: Power0.easeInOut,
                ease: Power2.easeOut,
        }
    )); // end Timeline.insert()
    if ( idx == animationElements.length - 1 ) {
      /**-Resume here when done with $.each() loop.*/
      console.log( " ..*4.3a) collapse() Tweened " + ( animationElements.length - 1 ) +
                   " AnimationElements. *");
      playSceneIfAutoPlay( _this, { scene: collapseScene },
      /*2a-Resume here when done*/ function( timeline ) {
      if ( typeof callback == 'function' ) { callback(); return; }
      return;
      /*2a-*/});
    }
  }); // end $.each()
  /*2-*/});/*1-*/});
}; // end: collapse()

//----------------------------------------------------------------------------
function collapse_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    if ( _this.activeScene ) {
      // Hide the active/visible sceneContainer, we will replace it with ours.
      _this.activeScene.container.html.elem.style.display = 'none';
    }
  }
};// end: collapse_reset()

/*
var main_tl = new TimelineMax({repeat:-1});

   var planets = $(".planet"),
       sun = $("#sun");

   TweenMax.set(sun, {
       perspective:800
   });

   var timeGap = 4;

   planets.each(function (index, element){
       var waitDelay = index*timeGap;
       // rising animation
       TweenMax.from(element, 1, {ease:Power1.ease, scale:0, alpha:0, top:"50%", delay:waitDelay});
       // rotation loop
       var tl = new TimelineMax({delay:waitDelay+1, repeat:-1});
       tl.insert(TweenMax.to(element, 20, {bezier:{values:[{x:-200, y:-50}, {x:0, y:-100}, {x:200, y:-50}, {x:0, y:0}]}, ease:Linear.easeNone}), "rotation");
       tl.insert(TweenMax.to(element, 3, {alpha: 0.4, scale:0.6, zIndex:1, ease:Linear.easeNone}), "rotation+=3");;
       tl.insert(TweenMax.to(element, 3, {alpha: 1, scale:1, zIndex:100, ease:Linear.easeNone}), "rotation+=14");;

       main_tl.insert(tl);
   });

   sun.on('click', function() {
       main_tl.reverse();
   });

});


 */

=============================================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function collapse( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'collapse';
  collapse_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );

  selectedPhotoToStory( _this,
  /*1-Resume here when done*/ function( result ) {
  _this.activeStory = result.item;

  // animationElements MUST have already been created.
  if ( !_this.activeStory.animationElements ||
       !_this.activeStory.animationElements.container ||
       _this.activeStory.animationElements.domElements.html.elems.length == 0 ) {
    alert('You MUST create Animation Elements first via the "Elements" link.');
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  var elementsScene = result.item
  // We need to create a new scene that uses the animationElements[] for the
  // activeStory.
  var collapseScene = newScene( _this, options.sceneTag );
  collapseScene.tag = options.sceneTag;
  collapseScene.container = elementsScene.container;
  collapseScene.animationElements = elementsScene.animationElements;
  collapseScene.proxyContainerTag = 'elements';
  _this.activeScene = collapseScene;
  var animationElements = _this.activeScene.animationElements.domElements.html.elems;

  console.log( " ..*4.3) collapse() animationElementsContainer: '" + $( _this.activeScene.animationElements.container.html.elem ).attr( 'id' ) +
               "' which has " + animationElements.length + " elements" +
               ". Tween Duration: '" + options.tweenDuration + "'. *");

  _this.activeStory.collapseTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );
  // Just collaspe down to our "compressed core". If we wanted the position of
  // all particles, we could call a function upon pause() and get the pos info.  via "vars"?
  //_this.collapseTimeline.addPause( options.tweenDuration - ( options.tweenDuration * .30) );

  setAnimationBoundaries( _this, options );
  $.each( animationElements, function( idx, element ) {
    // NOTE: ASSUME that 'particles' scene has played and all animiation elements
    // are currently at their 'home' position.x/y.
    // Collaspe down to our "compressed core".
    // Move element from element.x, element.y to collasped.x, collasped.y.

    // NOTE: maybe each element should have attributes for home.x/y, collasped.x/y?
    // NOTE: if ( isSVGanimationElements)
    _this.activeStory.collapseTimeline.insert(
      TweenMax.to(
        element, _this.settings.tweenDuration,
        { attr: { cx: getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ),
                  cy: getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ),
                },
             	  //autoAlpha: 0,
                //ease: Power0.easeInOut,
                ease: Power2.easeOut,
        }
    )); // end Timeline.insert()
    if ( idx == animationElements.length - 1 ) {
      /**-Resume here when done with $.each() loop.*/
      console.log( " ..*4.3a) collapse() Tweened " + ( animationElements.length - 1 ) +
                   " AnimationElements. *");
      playSceneIfAutoPlay( _this, { scene: collapseScene },
      /*2a-Resume here when done*/ function( timeline ) {
      if ( typeof callback == 'function' ) { callback(); return; }
      return;
      /*2a-*/});
    }
  }); // end $.each()
  /*2-*/});/*1-*/});
}; // end: collapse()

//----------------------------------------------------------------------------
function collapse_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {
    if ( _this.activeScene ) {
      // Hide the active/visible sceneContainer, we will replace it with ours.
      _this.activeScene.container.html.elem.style.display = 'none';
    }
  }
};// end: collapse_reset()

/*
var main_tl = new TimelineMax({repeat:-1});

   var planets = $(".planet"),
       sun = $("#sun");

   TweenMax.set(sun, {
       perspective:800
   });

   var timeGap = 4;

   planets.each(function (index, element){
       var waitDelay = index*timeGap;
       // rising animation
       TweenMax.from(element, 1, {ease:Power1.ease, scale:0, alpha:0, top:"50%", delay:waitDelay});
       // rotation loop
       var tl = new TimelineMax({delay:waitDelay+1, repeat:-1});
       tl.insert(TweenMax.to(element, 20, {bezier:{values:[{x:-200, y:-50}, {x:0, y:-100}, {x:200, y:-50}, {x:0, y:0}]}, ease:Linear.easeNone}), "rotation");
       tl.insert(TweenMax.to(element, 3, {alpha: 0.4, scale:0.6, zIndex:1, ease:Linear.easeNone}), "rotation+=3");;
       tl.insert(TweenMax.to(element, 3, {alpha: 1, scale:1, zIndex:100, ease:Linear.easeNone}), "rotation+=14");;

       main_tl.insert(tl);
   });

   sun.on('click', function() {
       main_tl.reverse();
   });

});


 */

==============================================
// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function elements( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  options.sceneTag = 'elements';
  elements_reset( _this, { sceneTag: options.sceneTag } );
  updateSettings( _this, options );
  console.log( " ..*4.2) elements() " + "'. RenderParticleMap: '" + _this.settings.isRenderParticleMap +
               "' for active story '" + _this.activeStory.tag + "' *");

  // particleMap MUST have already been created.
  if ( !_this.activeStory.particleMap.particles ||
       _this.activeStory.particleMap.particles.length == 0 ) {
    alert('You MUST create Particles first via the "Particles" link.');
    if ( typeof callback == 'function' ) { callback( null ); return; }
    return null;
  }

  // display particles in Panel specified by options (now in .settings).
  createScene( _this, {
    id: _this.activeStory.tag + '_particleMap',
    sceneTag: options.sceneTag,
    panel: settingsToPanel( _this ),
    createContainerParams: {
      width: _this.settings.img.width + 8,
      height: _this.settings.img.height,
      left: 0,
      top: 0,
      backgroundColor: _this.defaults.sceneBackgroundColor, //  '#E7F1F7', Climate Corp "halftone background blue"
      //  background color of Climate Corp profile photo for Meg: rgb(234, 233, 238) #eae9ee
      border: '',
    },
    createAnimationElementsParams: {
      method:   _this.settings.isRenderParticleMapAsSingleCanvas ? 'renderParticleMapAsSingleCanvas'
              : _this.settings.isUseSVGelements ? 'renderParticleMapAsSvgElements'
              : _this.settings.isUseCanvasElements ? 'renderParticleMapAsCanvasElements'
              //: _this.settings.isUseDivElements ?
              : 'renderParticleMapAsDivElements',
      offsetX: 0, //-80,
      offsetY: 0, //-20,
    },
  },
  /*1-Resume here when done*/ function( scene ) {
  // _this.movie.stories[0].scenes[0].animationElements.domElements.objects
  playSceneIfAutoPlay( _this, { scene: scene },
  /*2-Resume here when done*/ function( timeline ) {
  if ( typeof callback == 'function' ) { callback( scene ); return; }
  return scene;
  /*2-*/});/*1-*/});
};// end: elements()

//----------------------------------------------------------------------------
function elements_reset( _this, options ) {
  //----------------------------------------------------------------------------
  if ( _this.settings == 'undefined' ) {
    // onDomReady() init.
  } else {

  }
}; // end: elements_reset()

//----------------------------------------------------------------------------
function renderParticleMapAsSvgElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) For HomePositionParticles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  // Insert the REQUIRED <svg> tag within the sceneContainer to contain the svg <circle> elements.
  // NOTE: browser can not directly add <svg> or <circle> tags, need to use "w3.org namespace".
  elementsContainer.html = {
    elem: $( makeSvgElementNS('svg') )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'circle' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  _this.activeStory.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

  $.each( particles, function( idx, particle ) {
    // NOTE: particleAnimationMethod should return a Tween for the element. And it
    // should call its own "make an element" method.
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationSVGelement( _this, particle );
    if ( element ) {

      // Move element from element.x, element.y to home.x, home.y.
      $elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      _this.activeStory.particlesTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          { attr: { cx: particle.x, // + animationElementOffsetX,
                    cy: particle.y, // + animationElementOffsetY,
                  },
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut,
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end Timeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.2) renderParticleMapAsTweens(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " canvas AnimationElements. *");

  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsSvgElements()

//----------------------------------------------------------------------------
function createParticleAnimationSVGelement( _this, particle ) {
  //----------------------------------------------------------------------------
  //var panel_bottom = $(_this.settings.sceneContainer).height(),
  //    panel_width = $(_this.settings.sceneContainer).width(),
  //    left_boundaryX = Math.round( panel_width * 3/8 ),
  //    right_boundaryX = Math.round( panel_width - (panel_width * 3/8) );

  // Create elements to start at our "collapsed core". i.e. in a column in the
  // middle of the panel.
  var circle = $( makeSvgElementNS( 'circle' ) )
      .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
      .attr( 'cy', getRandom( _this.settings.animationPanelTopBoundary, _this.settings.animationPanelBottom ) )
      .attr( 'r', particle.r )
      .attr( 'fill', _this.settings.animationElementColor );
      // NOTE: hx/hy is the "home" position x,y for this particle.
      //.attr( 'hx', particle.x )
      //.attr( 'hy', particle.y );

  /*
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var circle = $( makeSvgElementNS( 'circle' ) )
      .attr( 'cx', getRandom( _this.settings.animationPanelLeftBoundaryX, _this.settings.animationPanelRightBoundaryX ) )
      .attr( 'cy', _this.settings.animationPanelBottom - getRandom( 40, 50 ) )
      .attr( 'r', particle.r )
      .attr( 'fill', _this.settings.animationElementColor )
      // NOTE: hx/hy is the "home" position x,y for this particle.
      .attr( 'hx', particle.x )
      .attr( 'hy', particle.y );
  */

  return circle;
}; // end createParticleAnimationSVGelement()


  /* per: https://stackoverflow.com/questions/32637811/how-can-i-add-a-svg-graphic-dynamically-using-javascript-or-jquery
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "640");
    ...
    document.getElementById("div").appendChild(svg);

    per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html

    ###html file
    < svg version="1.1" id="circle" width="400px" height="400px">
      < circle fill="#FFFFFF" stroke="#000000" stroke-width="4" stroke-miterlimit="10" cx="300" cy="300" r="55.5"/>
    </ svg>

    ###js file
    (function() {
      $(document).ready(function() {
        drawCircle();
        drawCircle(100,100,"red");
        drawCircle(200,200,"blue");
        drawCircle(400,400,"gray");
      });
    })();

    function SVG(tag) {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }

    var drawCircle = function(x,y,color) {
        var $svg = $("svg");
        $(SVG('circle'))
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 50)
            .attr('fill', color)
            .appendTo($svg);
    };
  */

//------------------------------------------------------------------------------
function makeSvgElementNS( tag ) {
  //----------------------------------------------------------------------------
  // per: http://chubao4ever.github.io/tech/2015/07/16/jquerys-append-not-working-with-svg-element.html
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}; // end makeSvgElementNS()


//----------------------------------------------------------------------------
function renderParticleMapAsDivElements( _this, options, callback ) {
  //----------------------------------------------------------------------------
  updateSettings( _this, options );
  var particleAnimationElementMethod = '',
      particles = _this.activeStory.particleMap.particles,
      sceneContainerElem = _this.activeScene.container.html.elem,
      $sceneContainerElem = $( sceneContainerElem ),
      elementsContainer = _this.activeScene.animationElements.container,
      domElementsObjsArray = [],
      animationElementOffsetX = _this.settings.createAnimationElementsParams.offsetX,
      animationElementOffsetY = _this.settings.createAnimationElementsParams.offsetY;
  console.log( " ..*5a.1) renderParticleMapAsDivElements() For Particles[].len = " + particles.length +
               "'. animationElementOffsetX: '" + animationElementOffsetX +
               "'. animationElementOffsetY: '" + animationElementOffsetY +
               ". *");

  elementsContainer.html = {
    elem: $( document.createElement( "div" ) )
      .attr( 'id', 'aniElems_Con_' )
      .attr( 'width', '589' )
      .attr( 'height', '600' )
      .attr( 'trr-ani-elem-type', 'div' )
      .addClass( 'trr-ani-elems-container' ),
    string: '',
  };
  var elementsContainerElem = elementsContainer.html.elem,
      $elementsContainerElem = $( elementsContainerElem );

  // Assume container.style.display = 'none'. Now attach to specified Panel.
  $( _this.centerPanel ).children().last().append( elementsContainerElem );
  sceneContainerElem.style.display = 'block';
  setAnimationBoundaries( _this, options );

  var numElements = 0;
  _this.activeStory.particlesTimeline = new TimelineMax( { repeat: 0, yoyo: false, repeatDelay: 0, paused: true } );

// Assume container.style.display = 'none'. Now attach to specified Panel.
//_this.settings.sceneContainer.style.display = 'block';
//_this.settings.sceneContainer.panel.appendChild( _this.settings.sceneContainer );

  $.each( particles, function( idx, particle ) {
    // Create element "below the fold", i.e. element.y is off the bottom of the page.
    var element = createParticleAnimationDivElement( _this, particle );
    if ( element ) {
      elementsContainerElem.append( element );
      domElementsObjsArray.push( element );

      // Move element from element.x, element.y to home.x, home.y.
      _this.activeStory.particlesTimeline.insert(
        TweenMax.to(
          element, _this.settings.tweenDuration,
          // NOTE: we don't want to do math calculations when creating DOM elements.
          //       So require that all adjustments were made when the particle
          //       map was created.
          { left: particle.x, // + animationElementOffsetX,
            top:  particle.y, // + animationElementOffsetY,
    	      //autoAlpha: 0,
            //ease: Power0.easeInOut,
            ease: Power2.easeOut,
          }
        ) // end TweenMax.to()
      ); // end Timeline.insert()
      numElements += 1;
    } // end if ( element )
  }); // end $.each()

  $sceneContainerElem.attr( 'numElements', numElements + '' );
  var results = {
    animationElementsContainerElem: elementsContainerElem,
    domElementsObjsArray: domElementsObjsArray,
  };
  console.log( " ..*5a.1a) renderParticleMapAsDivElements(): Made " + $sceneContainerElem.attr( 'numElements' ) +
               " <div> AnimationElements. *");
  if ( typeof callback == 'function' ) { callback( results ); return; }
  return results;
}; // end renderParticleMapAsDivElements()

//----------------------------------------------------------------------------
function createParticleAnimationDivElement( _this, particle, gridSize ) {
  //----------------------------------------------------------------------------
  var gridSize = _this.activeStory.particleMap.gridSize;
  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  var div = document.createElement( 'div' );
  div.style.position = 'absolute';
  div.style.left = getRandom( 225, 425 ) + "px";
  div.style.top = _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  // Math.round( particle.r * _this.particleMaps.gridSize
  // // max 8px, min 2px.
  var diameter = Math.round( particle.r * gridSize );
  if ( diameter < 1 ) {
    return null;
  } else if ( diameter > ( 2 * gridSize ) ) {
    diameter = diameter / 2;
    if ( diameter > ( 2 * gridSize ) ) {
      diameter = ( 2 * gridSize );
    }
  }
  diameter = Math.round( diameter );

  div.style.width = diameter + "px";
  div.style.height = div.style.width;
  div.style.background = _this.settings.animationElementColor;
  div.style.borderRadius = '50%';

  return div;
}; // end createParticleAnimationDivElement()

//----------------------------------------------------------------------------
function setAnimationBoundaries( _this, particle ) {
  //----------------------------------------------------------------------------
  var $sceneContainer = $( _this.activeScene.container.html.elem ),
      panel_bottom = $sceneContainer.height(),
      panel_width = $sceneContainer.width();
  _this.settings.animationPanelTop = 0;
  _this.settings.animationPanelTopBoundary = Math.round( panel_bottom * .45 );
  _this.settings.animationPanelBottom = panel_bottom;
  _this.settings.animationPanelWidth = panel_width;
  _this.settings.animationPanelLeftBoundaryX = Math.round( panel_width * .42 );
  _this.settings.animationPanelRightBoundaryX = Math.round( panel_width - _this.settings.animationPanelLeftBoundaryX );
}; // end setAnimationBoundaries()

//----------------------------------------------------------------------------
function createParticleAnimationCanvasElement( _this, particle ) {
  //----------------------------------------------------------------------------
  var canvasAndCtx = makeCanvasAndCtx(),
      canvas = canvasAndCtx.canvas,
      context = canvasAndCtx.ctx,
      elementWidth = 6,
      elementHeight = 6;

  // NOTE: canvas.width and heigth is set by the radius of the dot we write.

  // Create element "below the fold" and in a column in the middle of the panel.
  // i.e. element.y is off the bottom of the page, element.x is in middle.
  canvas.style.position = 'absolute';
  canvas.style.left = getRandom( 225, 425 ) + "px";
  canvas.style.top =  _this.settings.animationPanelBottom - getRandom( 40, 50 ) + "px";
  canvas.width = elementWidth;
  canvas.height = elementHeight;
  context.fillStyle = _this.settings.animationElementColor;
  context.beginPath();
  // NOTE: arc( x, y, radius )
  context.arc( 0, 0, particle.r, 0, _this.TAU );
  context.fill();
  context.closePath();
  return canvas;
}; // end createParticleAnimationCanvasElement()
