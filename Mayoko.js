
var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// Link of background music - set 'null' if you dont want to play background music
var bgMusicURL = './Apna-Bana-Le---Bhediya(iTunesMp3).mp3';
var bgMusicControls = true;
// page load //

window.onload = function() {
  // Your code here
  audioElement.play();
};


// ===================== start =======================
// animation start after 1000 milliseconds
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of the camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// add background music
if (bgMusicURL) {
  // Create the audio element
  var audioElement = document.createElement('audio');
  audioElement.src = bgMusicURL;
  audioElement.loop = true;
  audioElement.autoplay = false; // Set autoplay to true
  
  // Add controls if specified
  if (bgMusicControls) {
    audioElement.controls = true;
  }

  // Append the audio element to the music-container
  document.getElementById('music-container').appendChild(audioElement);
}

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  var sX = e.clientX,
      sY = e.clientY;

// Inside the document.onpointerdown event handler
// audioElement.play();

audioElement.muted = false;

audioElement.play().then(() => {
  // Autoplay started successfully
}).catch(error => {
  // Autoplay failed
});



  this.onpointermove = function (e) {
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 1;
      tY += desY * 1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
