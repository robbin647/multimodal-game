export default function LaserBeam(){

var oPlaneGame = document.getElementById("planeGame");
var oMyPlane = document.getElementById("myPlane");

// since this function is called in the start.html
// the path should be relative to /start.html
const LaserSprite = 'images/own/wp1.png';

/**
 * Controls the bomber to fire laser beam
 * @param myPlane {HTMLElement}: reference to the bomber element
 * @return void
 */
this.FireLaserBeam = function(myPlane){
    var beam = document.createElement("div");
    beam.className = "laser-beam";
    beam.style.backgroundImage= `url(${LaserSprite})`;
    beam.style.bottom = 85+"px";
    beam.style.left = 10+"px";
    myPlane.appendChild(beam);
}

this.StopLaserBeam = function(myPlane){
    var beam = document.querySelector("#myPlane .laser-beam");
    myPlane.removeChild(beam);
}

}