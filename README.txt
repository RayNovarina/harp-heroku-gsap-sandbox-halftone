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

  // isProcessBySkipCount
  if ( _this.settings.nthPixelToProcess == 1 ) {
    // Not every pixel is to be looked at.
    // Reject (if isExcludePixels) or accept (if isTransformPixels) every nth pixel.
    if ( _this.settings.isExcludePixels ) {
      _this.particlesRejectedBecauseIsExcludedNthPixell += 1;
      return { isAccepted: false };
    }
  } else { // _this.settings.nthPixelToProcess > 1
    // Not every pixel is to be looked at.
    // Reject (if isExcludePixels) or accept (if isTransformPixels) every nth pixel.
    if ( y % _this.settings.nthPixelToProcess == 0 &&
         x % _this.settings.nthPixelToProcess == 0 ) {
      // _this is the nth pixel.
      if ( _this.settings.isExcludePixels ) {
        _this.particlesRejectedBecauseIsExcludedNthPixell += 1;
        return { isAccepted: false };
      }
    // Else _this is not the nth pixel.
    } else if ( _this.settings.isTransformPixels ) {
      // And we are only accepting the nth pixel.
      _this.particlesRejectedBecauseIsExcludedNotNthPixell += 1;
      return { isAccepted: false };
    }
  }
    if ( _this.settings.isExcludePixels ) {
      // Reject every nth pixel.
      if ( y % _this.settings.nthPixelToProcess == 0 &&
           x % _this.settings.nthPixelToProcess == 0 ) {
        _this.particlesRejectedBecauseIsExcludedNthPixell += 1;
        return { isAccepted: false };
      }
    }  else { // isTransformPixels
      // Keep processing every nth pixel.
    }
  }

  ==============================
  
//----------------------------------------------------------------------------
function loadReadyForScroll( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) loadReadyForScroll() *");
  var $clickedElem = $( options.event.currentTarget );

  // To be able to use the scrollTo links smoothly, for each photo:
  //   1) make ParticleMap
  //   2) make Animation Elements
  //   3) Expand to Full Image
  //   4) Collapse to rest position.
  // When done with all: checkmark checkbox, change text msg, make it bold.

  var photo_imgs = $( '.trr-photo-effect' ).toArray();
  var locals = { _this: _this, $clickedElem: $clickedElem, callback: callback };
  var forEachFunction = function( idx, photo_img, locals ) {
  particles( locals._this, { isRenderParticleMap: false },
  /*1-Resume here when done*/ function() {

  // Done with all: checkmark checkbox, change text msg, make it bold.
  $( '#cbox_load4scroll' ).prop('checked', true ).prop('disabled', true );
  locals.$clickedElem.css('font-weight', 'bold')
                     .css('color', 'green')
                     .css('text-decoration', 'none')
                     .css('cursor', 'default')
                     //.style('disabled', 'disabled')
                     .html('READY FOR SCROLLING');
  if ( typeof locals.callback == 'function' ) { locals.callback(); }
  return { isDone: true };
  /*1-*/});
  }; // end forEachFunction()

  var forEach = new TrrForEach( photo_imgs, locals, forEachFunction );
  //NOTE: we don't get here until TrrForEach() has completed all iterations.
  forEach = null;
}; // end: loadReadyForScroll()

=====================================

particles( locals:_this, { isRenderParticleMap: false },
/*1-Resume here when done*/ function() {

// Done with all: checkmark checkbox, change text msg, make it bold.
$( '#cbox_load4scroll' ).prop('checked', true ).prop('disabled', true );
locals.$clickedElem.css('font-weight', 'bold')
                   .css('color', 'green')
                   .css('text-decoration', 'none')
                   .css('cursor', 'default')
                   //.style('disabled', 'disabled')
                   .html('READY FOR SCROLLING');
if ( typeof locals.callback == 'function' ) { locals.callback(); }
return { isDone: true };
/*1-*/})
==============================

var photo_imgs = $( '.trr-photo-effect' ).toArray(),
    nextIdx = 0;
var forEach = new TrrForEach();
forEach( photo_imgs,
/*1-Resume here when previous loop done*/ function( idx, photo_img ) {

/*1-*/}, next); // end $.each()
forEach = null;


// Done with all: checkmark checkbox, change text msg, make it bold.
$( '#cbox_load4scroll' ).prop('checked', true ).prop('disabled', true );
$clickedElem.css('font-weight', 'bold')
          .css('color', 'green')
          .css('text-decoration', 'none')
          .css('cursor', 'default')
          //.style('disabled', 'disabled')
          .html('READY FOR SCROLLING');
if ( typeof callback == 'function' ) { callback(); return; }
return;

=================================

// Private methods in context of plugIn instance, i.e. this
// // NOTE: Private methods MUST use _this to get 'this' for this instance of TrrPlugin

//----------------------------------------------------------------------------
function playMovie( _this, options, /*Code to resume when done*/ callback ) {
  //--------------------------------------------------------------------------
  console.log( " ..*4.2) playMovie() *");

  // Hide the active/visible sceneContainer, we will replace it with ours.
  closeActiveSceneContainer( _this,
  /*1-Resume here when done*/ function( activeScene ) {
  tagToScene( _this, 'elements', _this.activeStory,
  /*2-Resume here when done*/ function( result ) {
  openSceneContainer( _this, result.item );
  var photo_imgs = $( '.trr-photo-effect' ).toArray();
  $.each( photo_imgs, function( idx, photo_img ) {
  var playStoryDelayMs = 5000 * idx,
      photoTag = $(photo_img).attr('photoTag');
  // Select, display specified photo.
  newPhoto( _this, { photoTag: photoTag, photoType: $(photo_img).attr('photoType'), imgSrc: $(photo_img).attr('data-src') },
  /*2a-Resume here when done*/ function( image ) {
  console.log( " ..*4.2) playMovie() Waiting '" + playStoryDelayMs + "ms' to play story for '" + photoTag + "'. *");
  setTimeout(function() {
  /*2b-Resume here when Timeout done*/
  // Play story for active/selectedPhoto. All scenes, i.e. expand and collapse.
  playStory( _this, photoTag, options,
  /*2c-Resume here when done*/ function( story ) {
  if ( idx == photo_imgs.length - 1 ) {
    if ( typeof callback == 'function' ) { callback( story ); return; }
    return story;
  }
  /*2c-*/}); }, playStoryDelayMs); // end /*2b-timeout*/
  /*2a-*/});
  }); // end $.each()
  /*2-*/});/*1-*/});
}; // end: playMovie()

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

==========================================

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

===================================
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
==========================
