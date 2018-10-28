(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 DEBUG = false;
//  DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 popups = [];
 toBoom = 0.5;
 toToBoom = 0.5;
 boom = {};

 votes = []
 yes = 0;
 no = 0;
 time = 60;

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

 clamp = function(v, min, max) {
     if (v < min) {
         return min;
     } else if (v > max) {
         return max;
     } else {
         return v;
     }
 };

 collides = function(a, b) {
     return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h;
 };

 player = {
   x: 400,
   y: 480,
   w: 50,
   h: 50,
 }

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     if (!ogre) {
         return window.requestAnimationFrame(tick);
     }
 };

 speed = 120;

 update = function(delta) {
     console.log(speed);

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }

     if(keysDown[68] && player.x <= (800 - player.w)) {
         player.x += delta * speed * 4.0;
     } else if(keysDown[65] && player.x >= 0) {
         player.x -= delta * speed * 4.0;
     }

    console.log(keysDown)

    time -= delta;

    if(time <= 0) {
        time = 0;
        ogre = true;
    }

    toBoom -= delta;
    if(toBoom <= 0) {
        toBoom = toToBoom;

        votes.push({
            x: Math.random() * 700 + 50,
            y: -100,
            w: 40,
            h: 80,
            yes: Math.random() > 0.3,
        })
    }

    var v = [];

     for(var i = 0; i < votes.length; i++) {
         var vote = votes[i];

         var c = collides(vote, player);
         var o = vote.y > 600;

         if(o) {
            if(vote.yes) {
                ++yes;
            } else  {
                ++no;
            }
         } else if(!c) {
            v.push(vote);
         }

         vote.y += delta * speed;
     }

     votes = v;
 };

 draw = function(delta) {
     ctx.fillStyle = "#eeeeee";
     ctx.fillRect(0, 0, c.width, c.height);

     if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Visitor";
        ctx.fillText(Math.round(fps), 20, 590);
     }

     ctx.fillStyle = "#521515";

     ctx.drawImage(images['player'], player.x, player.y - 10);

     ctx.drawImage(images['urn'], 0, 560);

     for(var i = 0; i < votes.length; i++) {
         var vote = votes[i];
         var img = vote.yes ? 'yes' : 'no';
         ctx.drawImage(images[img], vote.x, vote.y);
     }

     ctx.drawImage(images['urn_bottom'], 0, 591);

     ctx.textAlign = 'center';

    ctx.fillStyle = "#000000";
    ctx.font = "60px Visitor";
    ctx.fillText('Abolish DST?', 400, 60);

    ctx.fillStyle = "#000000";
    ctx.font = "60px Visitor";
    ctx.fillText('YES ' + yes + ' : ' + no + ' NO', 400, 110);

    ctx.fillStyle = "#000000";
    ctx.font = "60px Visitor";
    ctx.fillText(time.toFixed(2), 400, 160);

     if(ogre) {
        ctx.fillStyle = "#000000";
        ctx.font = "80px Visitor";
        ctx.fillText("Voting finished!", 400, 400);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }



    loadImage('yes');
    loadImage('no');
    loadImage('player');
    loadImage('urn');
    loadImage('urn_bottom');

//  audios["jeb"] = new Audio('sounds/jeb.ogg');
//  audios["ultimate_jeb"] = new Audio("sounds/ultimate_jeb.ogg");

//  loadMusic("melody1");

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 load();

}).call(this);
