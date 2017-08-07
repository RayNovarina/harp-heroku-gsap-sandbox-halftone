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
  $ heroku create harp-gsap-sandbox-halftone-94037

$ git remote -v
  heroku  https://git.heroku.com/harp-gsap-sandbox-halftone-9403.git (fetch)
  heroku  https://git.heroku.com/harp-gsap-sandbox-halftone-9403.git (push)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (fetch)
  origin  https://github.com/RayNovarina/harp-heroku-gsap-sandbox-halftone.git (push)

Deploy changes to github and heroku:
  $ git add .
  $ git commit -am "First Harp + Heroku commit"
  $ git push origin master
  $ git push heroku master

View on Heroku:

  https://harp-gsap-sandbox-halftone-9403.herokuapp.com shows:

  Welcome to harp/gsap-sandbox-halftone.
  Deployed locally at http://localhost:9008/
  Deployed on Heroku at https://harp-gsap-sandbox-halftone-94037.herokuapp.com/

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
