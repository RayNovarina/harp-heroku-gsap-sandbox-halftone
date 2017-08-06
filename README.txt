cd /users/raynovarina/sites/AtomProjects/harp/greensock-getting-started/

per: https://greensock.com/jump-start-js
     https://greensock.com/get-started-js#intro

Cloned from my repos:

$ git clone https://github.com/RayNovarina/harp-heroku-mdn-canvas-tutorial.git greensock-getting-started
$ cd greensock-getting-started/

Start harp server:
$ harp server -p 9007

Access via localhost:9007
============================

Modify package.json and Procfile files for Heroku deploy:
  package.json:

    {
      "name": "greensock-tutorial",
      "version": "0.0.1",
      "description": "Harp server App: javascript/greensock-tutorial",
      "dependencies": {
          "harp": "*"
      }
    }

  Procfile:

    web: harp server --port $PORT

At github account, create new repository: harp-heroku-greensock-getting-started and then
locally.
  $ git init
  $ git remote add origin https://github.com/RayNovarina/harp-heroku-greensock-getting-started.git

Create Heroku app:
  $ heroku create harp-greensock-getting-started-94037

$ git remote -v
  heroku  https://git.heroku.com/harp-greensock-getting-started-9403.git (fetch)
  heroku  https://git.heroku.com/harp-greensock-getting-started-9403.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-greensock-getting-started.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-greensock-getting-started.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-greensock-getting-started-9403.herokuapp.com shows:

  Welcome to harp/greensock-getting-started.
  Deployed locally at http://localhost:9007/
  Deployed on Heroku at https://harp-greensock-getting-started-94037.herokuapp.com/

=========================================================
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
=========================================================


<!-- PREVIOUS EXAMPLES ========================= -->

<!--

<body>

<center style="margin-top: 80px;">
<img id="photo" src="https://mdn.mozillademos.org/files/5397/rhino.jpg">
</center>

<script type="text/javascript">

  var element = $("#photo");

  // Sequencing and grouping tweens with TimelineLite

  // Unlike most other JS animation tools, sequencing in GSAP is much more
  // flexible than building a queue of tweens that run one-after-the-other.
  // You have complete control over the relative timing of each tween - they
  // can overlap as much as you want. And you can control entire sequences as
  // a whole, reverse smoothly anytime, jump to any point, adjust the timeScale,
  // etc. and everything renders in the proper order. Watch this video for a
  // visual demo showing how TimelineLite can save you a lot of time. Of course
  // you could sequence tweens by using the "delay" special property on all your
  // tweens, but that can get complicated when you build a long sequence and
  // then later want to change the timing of something early in the sequence
  // (you'd have to adjust all the delay values in tweens after that). Plus it
  // would be a pain to control the whole sequence, like to pause() or resume()
  // or reverse() the group on-the-fly. Sequencing is much easier with
  // TimelineLite and its big brother, TimelineMax.

  // Let's jump into some sample code:

  //create a TimelineLite instance
  var tl = new TimelineMax();

  //append a to() tween
  tl.to(element, 1, { width: "50%" });

  //add another sequenced tween (by default, tweens are added to the end of the
  //timeline which makes sequencing simple)
  tl.to(element, 1, { height: "300px", ease:Elastic.easeOut });

  //offset the next tween by 0.75 seconds so there's a gap between the end of the previous tween and this new one
  tl.to(element, 1, {opacity:0.5}, "+=0.75");

  t1.to(element, 2, {rotation:"-170_short"}, "+=0.75");

  //overlap the next tween with the previous one by 0.5 seconds (notice the negative offset at the end)
  tl.to(element, 1, {backgroundColor:"#FF0000"}, "-=0.5");

  //animate 3 elements (e1, e2, and e3) to a rotation of 60 degrees, and stagger their start times by 0.2 seconds
  //tl.staggerTo([e1, e2, e3], 1, {rotation:60}, 0.2);

  //then call myFunction()
  tl.call(myFunction);

    //reverse (always goes back towards the beginning)
  //  setTimeout( function() {
  //    tween.reverse();
  //  }, 7000);

  //now we can control the entire sequence with the standard methods like these:
  //tl.pause();
  //tl.resume();
  //tl.restart();
  //tl.reverse();
  //tl.play();

  //jump to exactly 2.5 seconds into the animation
  //tl.seek(2.5);

  //slow down playback to 10% of the normal speed
  //tl.timeScale(0.1);

  //add a label named "myLabel" at exactly 3 seconds:
  //tl.add("myLabel", 3);

  //add a tween that starts at "myLabel"
  //tl.add( TweenLite.to(element, 1, {scale:0.5}), "myLabel");

  //jump to "myLabel" and play from there:
  //tl.play("myLabel");

  // Think of a timeline (as in a TimelineLite or TimelineMax instance) like a
  // collection of tweens that are positioned at specific places on that
  // timeline. It controls their playback. Timelines can be nested inside other
  // timelines as deeply as you want. This is a very powerful concept because
  // it allows you to control entire sequences in a modular way. Imagine 100
  // characters individually animating into place in a staggered fashion
  // (100 tweens). They could all be grouped into a TimelineLite instance and
  // then controlled as a whole (using common methods like pause(), resume(),
  // reverse(), restart(), etc.). In fact, you could create functions that
  // return animations wrapped in a TimelineLite so that you can easily build
  // a larger, more complex animation in a modular way. A central concept to
  // grasp is that every tween is inserted into a timeline. By default, it's
  // the root timeline inside the engine. When a timeline is playing, its
  // virtual playhead advances. If you reverse() a timeline, the playhead
  // travels in the opposite direction back towards its beginning. As the
  // timeline's playhead encounters tweens, it plays them accordingly.
  // For example, if the playhead is positioned halfway through a tween, that
  // tween will render as though it is 50% finished. If the timeline's
  // timeScale is set to 0.5, that would cause the playhead to travel at half
  // speed. Consequently, any tweens it encounters would also appear to progress
  // at half speed. Once you get the hang of how timelines work, they can
  // revolutionize your animation workflow. Just like tweens, timelines play
  // immediately by default but you can pause them initially using pause() or
  // by setting paused:true in the vars parameter of the constructor. There are
  // quite a few methods available in the timeline classes that give you precise
  // control, and we'd encourage you to look through the TimelineLite
  // Documentation to see what's available. If you can think of something you'd
  // like to do, chances are there's a way to do it.

</script>

</body>
-->

<!--
<body>

<center style="margin-top: 200px;">
<img id="photo" src="https://mdn.mozillademos.org/files/5397/rhino.jpg">
</center>

<script type="text/javascript">

  var element = $("#photo");

  // Controlling tweens

  // Most other animation tools offer very limited controls, but GSAP was built
  // from the ground up to be a professional-grade robust set of animation
  // tools. You can easily pause(), resume() reverse(), restart(), seek(), or
  // even alter the timeScale of any tween. In fact, you can tween the timeScale
  // of another tween to gradually slow it down or speed it up. To control a
  // tween, however, you need an instance to work with. The to(), from(), and
  // fromTo() methods all return an instance, so you can dump it into a variable
  // as easily as:

  //using the static to() method...
  //var tween = TweenLite.to(element, 1, {width:"50%"});

  //or use the object-oriented syntax...
  var tween = new TweenLite(element, 5, {width:"50%"});

  // Then, you can call any of its methods:

  //pause
  //tween.pause();

  //resume (honors direction - reversed or not)
  //tween.resume();

  //reverse (always goes back towards the beginning)
  setTimeout( function() {
    tween.reverse();
  }, 7000);

  //jump to exactly 0.5 seconds into the tween
  //tween.seek(0.5);

  //make the tween go half-speed
  //tween.timeScale(0.5);

  //make the tween go double-speed
  //tween.timeScale(2);

  //immediately kill the tween and make it eligible for garbage collection
  //tween.kill();

  // You can also kill ALL of the tweens of a particular element/target like this:

  // TweenLite.killTweensOf(myElement);

  // See the TweenLite Documentation for details about all of the properties
  // and methods available.

</script>

</body>
-->

<!--
<body>

<center style="margin-top: 200px;">
<img id="photo" src="https://mdn.mozillademos.org/files/5397/rhino.jpg">
</center>

<script type="text/javascript">

  var element = $("#photo");

  // directionalRotation -

  // tweens rotation in a particular direction which can
  // be either clockwise ("_cw" suffix), counter-clockwise ("_ccw" suffix), or
  // in the shortest direction ("_short" suffix) in which case the plugin
  // chooses the direction for you based on the shortest path. For example,
  // if the element's rotation is currently 170 degrees and you want to tween
  // it to -170 degrees, a normal rotation tween would travel a total of 340
  // degrees in the counter-clockwise direction, but if you use the "_short"
  // suffix, it would travel 20 degrees in the clockwise direction instead.
  // Example
  //TweenLite.to(element, 2, {rotation:"-170_short"});

  // or even use it on 3D rotations and use relative prefixes:
  //TweenLite.to(element, 2, {rotation:"-170_short", rotationX:"-=30_cw", rotationY:"1.5rad_ccw"});

  // Prior to version 1.9.0, directionalRotation was called shortRotation and it
  // only handled going in the shortest direction. The new directionalRotation
  // functionality is much more flexible and easy to use (just slap a suffix on
  // the regular property). For backwards compatibility, CSSPlugin still
  // recognizes "shortRotation", but it has been deprecated.

  // autoAlpha - the same thing as "opacity" except that when the value hits "0",
  // the "visibility" property will be set to "hidden" in order to improve
  // browser rendering performance and prevent clicks/interactivity on the
  // target. When the value is anything other than 0, "visibility" will be set
  // to "visible".
  // Example: fade out and set visibility:hidden
  //TweenLite.to(element, 5, {autoAlpha:0});
  // in 2 seconds, fade back in with visibility:visible
  //TweenLite.to(element, 10, {autoAlpha:1, delay:7});

  // className -
  // allows you to morph between classes on an element. For example, let's say
  // myElement has a class of "class1" currently and you want to change to
  // "class2" and animate the differences, you could do this:
  //TweenLite.to(myElement, 1, {className:"class2"});

  // And if you want to ADD the class to the existing one, you can simply use
  // the "+=" prefix. To remove a class, use the "-=" prefix like this:
  //TweenLite.to(myElement, 1, {className:"+=class2"});

  // Note: there are a few css-related properties that don't tween like IE
  // filters, but that is a very rare exception. Also, there is a slight speed
  // penalty when using className because the engine needs to loop through all
  // of the css properties to analyze which ones are different.

  // autoRound -
  // By default, CSSPlugin will round pixel values and zIndex to the closest
  // integer during the tween (the inbetween values) because it improves browser
  // performance, but if you'd rather disable that behavior, pass
  // autoRound:false in the css object. You can still use the RoundPropsPlugin
  // to manually define properties that you want rounded.

</script>

</body>
-->

<!--

<body>

<center style="margin-top: 200px;">
<img id="photo" src="https://mdn.mozillademos.org/files/5397/rhino.jpg">
</center>

<script type="text/javascript">

  var photo = $("#photo");
  // transformOrigin - Sets the origin around which all transforms occur.
  // By default, it is in the center of the element ("50% 50%"). You can
  // define the values using the keywords "top", "left", "right", or "bottom"
  // or you can use percentages (bottom right corner would be "100% 100%") or
  // pixels. If, for example, you want an object to spin around its top left
  // corner you can do this:

  // spins around the element's top left corner
  TweenLite.to("#photo", 2, {rotation:360, transformOrigin:"left top"});


</script>

</body>
-->

<!--
  var photo = $("#photo");
  // You can animate 3D transform properties and 2D properties (except skew)
  // together intuitively:
  TweenLite.to("#photo", 2, {rotationX:720, scaleX:1.8, z:-100});
-->

<!--
  var photo = $("#photo");
  // By default, rotation, skewX, and skewY use degrees but you can use radians
  // if you prefer. Simply append one of the standard suffixes ("rad" or "deg")
  // like this:
  //use "deg" or "rad"
  TweenLite.to(photo, 2, {rotation: "300deg", skewX:"30deg"});
-->

<!--
  var photo = $("#photo");

  //Plugins
  // Think of plugins like special properties that are dynamically added to
  // TweenLite, giving it extra abilities. This keeps the core engine small and
  // efficient, yet allows for virtually unlimited capabilities to be added
  // dynamically. Each plugin is associated with a property name and it takes
  // responsibility for handling that property. For example, the CSSPlugin is
  // associated with the "css" property name so if it loaded, it will intercept
  // the "css" property, and the ScrollToPlugin will intercept the "scrollTo"
  // value, etc.:

  //CSSPlugin will intercept the "css" value...
  TweenLite.to(photo, 1, {css:{scaleX:0.5, rotation:30}, ease:Power3.easeOut});

  //ScrollToPlugin will intercept the "scrollTo" value (if it's loaded)...
  TweenLite.to(window, 2, {scrollTo:{y:300}, ease:Bounce.easeOut});
-->

<!--
  var photo = $("#photo");

// To get linear motion, just use the Linear.easeNone ease.
TweenLite.to(photo, 1, {width:100, ease:"Linear.easeNone"});
TweenLite.to(photo, 1, {height:200, ease:"Linear.easeNone"});
-->

<!--

  var photo = $("#photo");

  // The default ease in TweenLite is Power1.easeOut (which gives a more natural
  // feel than a linear ease). Here is the syntax for defining the ease for a
  // few tweens:
  TweenLite.to(photo, 1, {width:100, ease:Power2.easeOut});
  TweenLite.to(photo, 1, {height:200, ease:Elastic.easeOut});
-->

<!--
Let's say, for example, you have an <img> with an id of "photo" and you'd like
to tween its "width" property to a value of 100 over the course of 1.5 seconds.
You can use TweenLite's to() method:

<style type="text/css">

</style>
</head>

<body>

<img id="photo" src="https://mdn.mozillademos.org/files/5397/rhino.jpg">

<script type="text/javascript">

  var photo = $("#photo");

  //notice there's no "()" after the onComplete function because it's just a reference to the function itself (you don't want to call it yet)
  TweenLite.to(photo, 1.5, {width:100, delay:0.5, onComplete:myFunction});
  function myFunction() {
      console.log("tween finished");
  }

</script>

</body>
-->

<!--
The logo element will now have its css "left" property tweened to 632px over the course of 1 second. The syntax is:
TweenLite.to( [target object], [duration in seconds], [destination values] )
-->
<!--
<style type="text/css">
    body{
      background-color:#000;
      color:white;
    }
    #demo {
      width: 692px;
      height: 60px;
      background-color: #333;
      padding: 8px;
    }
    #logo {
      position: relative;
      width: 60px;
      height: 60px;
      background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/logo_black_1.jpg)no-repeat;
    }
</style>
</head>

<body>

<div id="demo">
    <div id="logo"></div>
</div>


<script type="text/javascript">
//we'll use a window.onload for simplicity, but typically it is best to use either jQuery's $(document).ready() or $(window).load() or cross-browser event listeners so that you're not limited to one.
window.onload = function(){
    var logo = document.getElementById("logo");
    TweenLite.to(logo, 1, {left:"632px"});
}
</script>

</body>
-->
===================
