//============================================
//                  HTML
//============================================
<div id="containerDiv"></div>

<button id="explode">EXPLODE!</button>
<button id="reset">RESET PARTICLES</button>

//==============================================
//                  CSS
//==============================================

//==============================================
//                  JS
//==============================================
var img = "https://netgfx.com/trunk/blockwars/assets/textures/objects/woodCrate6.png";

$(document).ready(function(){
  //---------------------
  var objs = new obj();
  //---------------------
    var $this = this;
    this.img;
    var d = new Date().getTime();
    this.id = 'mapObj_'+d;;
  	this.particles = [];
    var particles = [];

  //------------------------
  objs.createCanvas();
  //------------------------
    this.img = new Image();
    this.img.src = img; // Load photo in private <img>, not visible?
    this.img.onload = function(){
    //-------------------------------------------------------
    var obj = createParticles($this.img, 100, 100, this.id);
    //-------------------------------------------------------
        var animationContainer = document.createElement("div");
    		particles = new Array();
    		for(var n = 0; n < 10; n++) {
    	    for(var i = 0; i < 10; i++) {
    	      var imgX = n * 5;
    	      var imgY = i * 5;
    	      particles.push({
    	        x: imgX,
    	        y: imgY,
    	        imgX: imgX,
    	        imgY: imgY,
    	        vx: 0,
    	        vy: 0,
    	        isRolling: false,
    	        isLocked: true
    	      });
    	    }
    	  }
        animationContainer.id = $this.id;
    	  animationContainer.style.width = 50+"px";
    	  animationContainer.style.height = 50+"px";
    	  animationContainer.style.position = "absolute";
    	  animationContainer.style.left = left+"px";
    	  animationContainer.style.top  = top+"px";

    		var canvas;
    		var context;
    		for(var n = 0; n < particles.length; n++) {
    		  var particle = particles[n];
    			canvas = document.createElement("canvas");
    			canvas.width = 5;
    			canvas.height = 5;
    			canvas.style.left = particle.x+"px";
    			canvas.style.top = particle.y+"px";
    			canvas.style.position = 'absolute';
    			context = canvas.getContext("2d");
          context.drawImage(imgObj, particle.imgX, particle.imgY, 5, 5, 0, 0, 5, 5);

          animationContainer.appendChild(canvas);
        }
      return animationContainer;

    //-------------------------------
    this.item = animationContainer;
    var parent = document.getElementById('containerDiv');
    parent.appendChild( animationContainer );
    // end createParticles() ---------------------

  //-------------------------
  $("#explode").click(function(){
    objs.explode();
  });
  //--------------------------
    var elem = this.item;
    console.log(this.item);
  	var childrenNum = $("#"+this.item.id).children();

  	for(var i = 0; i < childrenNum.length; i++) {
  		var item = childrenNum.eq(i);
  		var randX = getRandom(  300 , -300 );
                  //---------------------------
                  return Math.floor(Math.random() * (1 + max - min) + min);
                  //---------------------------
  		var randY = getRandom(  300 , -300 );

      var tmax = TweenMax.to( item, 1.0, {
  				left:randX,
  				top:randY,
  				autoAlpha:0,
          ease:Power0.easeInOut
  		});
  	}

  //--------------------------
  $("#reset").click(function(){
    objs.reset();
  });
  //-------------------------------
    console.log($("#"+this.id).children().length);
    $("#"+this.id).empty().remove();
    $("#containerDiv").children("div").remove();
    $this.createCanvas();
