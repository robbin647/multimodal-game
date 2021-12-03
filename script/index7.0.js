export default function PlaneGame(){
// Game Board 
var oPlaneGame = document.getElementById("planeGame");
var bgArr = ["bg1.jpg","bg2.jpg","bg3.jpg","bg4.jpg","bg5.jpg"];

// Bomber
var oMyPlane = document.getElementById("myPlane");

// The image used for laser beam
const LaserSprite = 'images/own/wp1.png';  // the path is relative to /start.html


//Game Over Popup (deprecated)
var oRelAlert = document.getElementById("relAlert");

// User Score (always displayed on the top left corner of the game board) 
var oScoreLTPlay = document.getElementById("scoreLTPlay");

// User Score (when game over)
var oScoreIn = document.getElementById("scoreIn");
var oStop = document.getElementById("stop");

// Bomber height, width, top and left 
var myPlaneH = getLinkHeight(oMyPlane);
var myPlaneW = getLinkWidth(oMyPlane);
var myPlaneT = 0;
var myPlaneL = 0;

// Enemy planes
var enemyPlaneH = 0;  //Height
var enemyPlaneW = 0;  //Width
var enemyPlaneT = 0;  //Top
var enemyPlaneL = 0;  //Left
var enemyArr = new Array();
var i =0;

// Bullet height, width, top and left (deprecated)
var myBulletH = 0;
var myBulletW = 0;
var myBulletT = 0;
var myBulletL = 0;

// Is game over
var end = false;
//global list to store all timers
this.TimerList = [];
// global timer for enemy creation
this.EnemyGenTimer = null;
// User score
var scoreNum = 0;

/************************************* 1. Game Board Functions ***************************************/
/**
 * Enable Auto-moving of game board background
 * No param required
 * @return void  
 */  
var bgstep = 0;
this.bgMove = function(){
	var t = setInterval(function(){
		bgstep += 2;
		var bgstepLimit = 500;
		var num = 0;
		// Compatibility with Firefox  
		oPlaneGame.style.backgroundPosition = "0px"+"  "+bgstep+"px";
		// Switch to another bg image after some time interval 
		if(bgstep >  bgstepLimit && bgstep <=  bgstepLimit*2){
			num = 1;
		}
		else if(bgstep > bgstepLimit*2 && bgstep <= bgstepLimit*3){
			num = 2;
		}
		else if(bgstep > bgstepLimit*3 && bgstep <= bgstepLimit*4){
			num = 3;
		}
		else if(bgstep > bgstepLimit*4 && bgstep <= bgstepLimit*5){
			num = 4;
		}
		else if(bgstep > bgstepLimit*5){
			num = 0;
			/* Debugging  */
			bgstep = 0;
		}
		oPlaneGame.style.backgroundImage = "url('images/bj/"+bgArr[num]+"')";	
	},50)
	this.TimerList.push(t);
	
}

/**
 * This is a helper function to ```oMyPlaneMove``` 
 * It retrieves the dynamic CSS style values of the HTMLElement "#planeGame"
 * No parameter required
 * @return {CSSStyleDeclaration} an object containing all CSS Styles of "#planeGame"
 */
function GetGameBoardCSSStyle(){
	return window.getComputedStyle(oPlaneGame, false);
}
/************************************* 2. Bomber Functions ***************************************/
/**
 * This function updates the position of ```oMyPlane```
 *   according to the cursor's position
 * @param event {MouseEvent}
 * @return {void}
 */
function oMyPlaneMove(event){ //event is a MouseEvent
	this.style.cursor = "pointer";
	// Compatibility with Internet Explorer
	var e = window.event || event;
	var eX = e.pageX-472;  //pageX is the cursor's X-coordinate with respect to the current document
	var eY = e.pageY-32;   //pageY is ibid.
	//the values above are hard coded - 472 and 32 is the corrdinate of the left top corner of gameboard
	
	// Set bomber position the same as mouse 
	//    if the mouse does not move out of the game board (game board boundaries)
	if((eY-40)>0 && (eY-40)<480 && (eX-33)>0 && (eX-33)<260){
		oMyPlane.style.top = (eY-40)+"px";
		oMyPlane.style.left = (eX-33)+"px";
	}
}

/**
 * This function makes bomber to follow the cursor's movement
 * @param isEnableControl {boolean} : to enable cursor control or not
 * @return void; 
 */
this.BomberControlledByCursor = function(IsEnableControl){
	if (IsEnableControl == true){
		oPlaneGame.onmousemove = oMyPlaneMove;
		oMyPlane.onmousemove = oMyPlaneMove; 
	}
	else{
		oPlaneGame.onmousemove = null;
		oMyPlane.onmousemove = null;
	}
}

/**
 * Set the position of ```oMyPlane``` by the two percentages
 *    in the parameter. 
 * @param XPercent {float}: used to set the ```left``` value
 * @param YPercent {float}: used to set the ```top``` value
 * @return {void}
 * E.g. XPercent means the ```left``` value of ```oMyPlane``` w/ respect to ```oPlaneGame```'s width
 *         and note that XPercent of 100% means ```left: 260px```
 *       ... note that YPercent of 100% means ```Top: 480px``` 
 */
this.oMyPlaneGotoPosition = function(XPercent, YPercent){
	/* Convert percentage into pixel values */
	let LeftValue = XPercent / 100 * (parseInt(window.getComputedStyle(oPlaneGame).width)
									 - parseInt(window.getComputedStyle(oMyPlane).width)
								);
	let TopValue = YPercent / 100  * (parseInt(window.getComputedStyle(oPlaneGame).height) 
	  							- parseInt(window.getComputedStyle(oMyPlane).height)
							  );
	/* Debugging Begin*/
	console.log(`LeftValue is ${LeftValue}, TopValue is ${TopValue}. `);
	/* Debugging End */
	oMyPlane.style.left = LeftValue + 'px';
	oMyPlane.style.top = TopValue + 'px';
}

/**
 * Moves the bomber horizontally by ```XDelta``` pixels
 * @param XDelta Number, can be positive or negative value
 * @return void
 */
this.oMyPlaneMovesHorizontal = function(XDelta){
	let MyPlaneLeft = getLinkLeft(oMyPlane); 

	let NewLeftValue = MyPlaneLeft + XDelta;
	// This is to ensure the bomber is within the boundary of game board
	// 60 is the width of the ```oMyPlane``` element
	if (( NewLeftValue > 0) && 
	     (NewLeftValue < parseInt(GetGameBoardCSSStyle().width) - 60)
	    )
	{
		oMyPlane.style.left = NewLeftValue + 'px';
	}
}
/**
 * Moves the bomber vertically by ```YDelta``` pixels
 * @param XDelta: Number, can be positive or negative value
 * @return void
 */
this.oMyPlaneMovesVertical = function(YDelta){
	let MyPlaneBottom = getLinkBottom(oMyPlane);

	// because we define y-axis positive direction to be downwards
	// so you need to subtract it, not to add it
	let NewBottomValue = MyPlaneBottom - YDelta;

	// This is to ensure the bomber is within the boundary of game board
	// 80 is the height of the ```oMyPlane``` element
	if (NewBottomValue > 0 && 
		NewBottomValue < parseInt(GetGameBoardCSSStyle().height) - 80
		)
	{
		oMyPlane.style.bottom = NewBottomValue + 'px';
	}
}
/************************************* 3. Laser Beam Functions ***************************************/

/**
 * Controls the bomber to fire laser beam
 * no parameter required
 * @return HTMLElement: the reference to the Laser Beam element created
 */
 this.FireLaserBeam = function(){
    var beam = document.createElement("div");
    beam.className = "laser-beam";
    beam.style.backgroundImage= `url(${LaserSprite})`;
    beam.style.bottom = 85+"px";
    beam.style.left = 10+"px";
    oMyPlane.appendChild(beam);
	return beam;
}
/**
 * Stops the bomber for firing laser beam
 * @param Beam {HTMLElement} the reference to Laser Beam element
 * @return void
 */
this.StopLaserBeam = function(Beam){
    //var beam = document.querySelector("#myPlane .laser-beam");
    oMyPlane.removeChild(Beam);
}

/************************************* 4. Bullet Functions ***************************************/

/**
 * Create a new Bullet HTMLElement and add it to ```oMyPlane```
 * No parameter required 
 * @return {HTMLElement} : the reference to a bullet element
 */
this.CreateBullet = function(){
	//创建节点 
	var  bullet = document.createElement("div");
	bullet.className = "bullet";
	bullet.style.bottom = 90+"px";
	oMyPlane.appendChild(bullet);
	return bullet;
}

/**
 * Move a bullet by 14px to top
 * @param Bullet an HTMLElement
 * @return void
 */
this.BulletMove = function(Bullet){
	Bullet.style.top = Bullet.offsetTop - 14 +"px";
}

/**
 * Determine if a bullet flies out of the game boundary
 * @param Bullet an HTMLElement
 * @return Boolean
 */
this.isBulletOutOfBoundary = function(Bullet){
	return (getLinkTop(Bullet) + getLinkTop(oMyPlane) <= 0);
}
/**
 * Removes a bullet from game board
 * @param Bullet an HTMLElement
 * @return void 
 */
this.ClearBullet = function(Bullet){
	oMyPlane.removeChild(Bullet);
}

/************************************* 5. Enemy Plane Functions ***************************************/
//1.2.2敌机随机出现(数量随机、种类随机、位置随机、速度随机) 
//随机创建敌机函数
/**
 * Create an enemy plane HTMLElement, and set a timer for it to move constantly
 * @param Type {Number}: determines which type of enemy plane to create {enemyXiao, enemyZhong1, enemyZhong2, enemyDa}
 * @param TimeBase {Number} generally affects the moving speed of all enemies. Larger TimeBase means slower movement 
 * @reutrn {void}
 */
const enemyPlanes = function(Type, TimeBase){
	var enemyClass = ["enemyXiao","enemyZhong1","enemyZhong2","enemyDa"];
	var enemyType = ["xiaofeiji.png","xiaozhong.png","zhong.png","dafeiji.png"];
	//位置随机、位置随机、速度随机(时间)
	var left_boundary = 0;   //limits the leftmost x-position of an enemy
	var x_range = 0;     //allowed range along x-direction
	var to = 0;    //top
	var time = 0;   //time
	switch(Type){
		// case 0:left_boundary=13; x_range = 260;to = 10;time = parseInt(Math.random()*80+500);break; 
		// case 1:left_boundary=7; x_range = 260;to = 10;time = parseInt(Math.random()*10+1000);break;
		// case 2:left_boundary=0; x_range = 215;to = 10;time = parseInt(Math.random()*10+1200);break;
		// case 3:left_boundary=0; x_range = 205;to = 10;time = 1800;break;
		case 0:left_boundary=13; x_range = 260;to = 10;time = Math.floor(Math.random()*80+Math.floor(TimeBase / 6.0));break; 
		case 1:left_boundary=7; x_range = 260;to = 10;time = Math.floor(Math.random()*10+Math.floor(TimeBase / 3.0));break;
		case 2:left_boundary=0; x_range = 215;to = 10;time = Math.floor(Math.random()*10+Math.floor(TimeBase / 2.5));break;
		case 3:left_boundary=0; x_range = 205;to = 10;time = Math.floor(TimeBase / 1.6);break;
	}
	//动态创建敌机节点
	var enemy = document.createElement("div");
	//种类随机
	enemy.style.backgroundImage = "url('images/enemy/"+enemyType[Type]+"')";
	enemy.className = enemyClass[Type];
	//在各自边界的范围下面取随机值
	var rPOsition = parseInt(left_boundary + Math.random()*x_range);
	enemy.style.top = 10 + "px";
	enemy.style.left =  rPOsition +"px";
	enemyPlaneL = parseInt(enemy.style.left);
	//将这个敌机实例放入全局变量的列表中
	enemyArr[i] = enemy; 
	i++;
	oPlaneGame.appendChild(enemy);
	//敌机周期性移动 
	var t = setInterval(function(){	
		//当敌机还在游戏区域中时
		if(parseInt(enemy.style.top) <= 560){
			 enemy.style.top  = enemy.offsetTop + to + "px";
			 enemyPlaneT = parseInt(enemy.style.top);
			 // alert(crash)
		}
		else{
		//敌机飞出游戏区域，移除这个实例
			oPlaneGame.removeChild(enemy);
			clearTimeout(t);
			/* Debugging */
			clearInterval(t1);
		}
	},time);
	//以下几种情况需要移除敌机实例
	var t1 = setInterval(function(){
		if (parseInt(enemy.style.top) > 560){
			//敌机飞出游戏区域，移除这个实例
			oPlaneGame.removeChild(enemy);
			clearTimeout(t);
			clearInterval(t1);
		}
 		else if(enemy.style.backgroundImage.match('ownbz.png')){
			//当敌机爆炸以后移除敌机 
			clearInterval(t);
 			oPlaneGame.removeChild(enemy);
 			clearTimeout(t1);
 		}
		else if (end == true){
			//此敌机还未飞出游戏区域,也未与小飞机相撞,但是小飞机与其他敌机相撞
			oPlaneGame.removeChild(enemy);
			clearTimeout(t);
			clearInterval(t1);
		} 
 	},500)
	enemyPlaneH = getLinkHeight(enemy);
	enemyPlaneW = getLinkWidth(enemy); 
}
//随机创建敌机
/**
 * Sets a timer for generating enemy planes
 * @param {Number} Interval the interval (in ms) to generate a new enemy
 * @return {void}
 */
this.enemyCreate=function(Interval){
	//15小 = 3中1 = 2中2 = 1大
	var time = 0;
	var t = setInterval(function(){
		time++;
		if(time <= 10){enemyPlanes(0, Interval);}  //小
		if(time > 5 && time <= 7){enemyPlanes(1, Interval)}  //中1
		if(time > 8 && time <= 9){enemyPlanes(2, Interval)}  //中2	
		if(time == 11){time = 0;enemyPlanes(3, Interval);}  //大、
		if(end == true){clearTimeout(t);}
	},Interval)
	// always clear the old timer EnemyGenTimer before create a new one
	if (this.EnemyGenTimer != null)
		window.clearInterval(this.EnemyGenTimer);
	this.EnemyGenimer = t; 
}
/************************************* 6. Collision Detection Functions ***************************************/
//玩家飞机与敌机的碰撞检测
/**
 * Detect if bomber collides with enemy planes
 *   If bomber collies with an enemy plane, do the following:
 *   (1) draw the enemy plane which collides with bomber as explosion picture
 *   (2) draw the Bomber background as explosion picture
 *   (3) remove all timers in global timer list
 *   (4) Disable user mouse control
 *   (5) redirect the page to gameOverPage
 * No param required
 * @return void
 *  */ 
this.planesCrash= function(){

		myPlaneT = getLinkTop(oMyPlane);
		myPlaneL = getLinkLeft(oMyPlane);
		for (var i = 0; i < enemyArr.length; i++) {
			if( 
				(	
					Math.abs(myPlaneL-getLinkLeft(enemyArr[i]))< myPlaneW||
					Math.abs(myPlaneL-getLinkLeft(enemyArr[i]))< getLinkWidth(enemyArr[i])
				)
				&&
				(
				   Math.abs(myPlaneT-parseInt(enemyArr[i].style.top))< myPlaneH||
				   Math.abs(myPlaneT-parseInt(enemyArr[i].style.top))< getLinkHeight(enemyArr[i])	
				)
			 ){
			 	//碰撞以后，游戏结束
				end = true;
				//跟小飞机相撞的敌机爆炸(从而被移除，见enermyPlanes())
				enemyArr[i].style.backgroundImage="url('images/crash/ownbz.png')";
				break;
			 	
			}
		}; 
		if (end == true){
			//游戏结束,玩家飞机被炸毁 
			oMyPlane.style.backgroundImage = "url('images/crash/xzfjbz.png')";
			oMyPlane.style.backgroundSize = "cover";

			window.location.assign("./gameOverPage.html?score="+scoreNum);
			// //可以再玩一次 
			// oRelAlert.style.display = "block";
			// oStop.style.display = "block";
			
			// //显示分数 
			// oScoreIn.innerHTML =  scoreNum;

			/* Debugging: remove all timers when game over */ 
			this.TimerList.map((_) => clearInterval(_));

			//解除用户鼠标对小飞机的操控
			oMyPlane.onmousemove = null;
			oPlaneGame.onmousemove = null;
		}

}
//2.1玩家飞机导弹与敌机的碰撞检测
/**
 * Determine if a bullet collides with enemy planes (stored in enemyArr[] list)
 * @param Bullet an HTMLElement
 * @return Boolean
 */
this.bulletPlanesCrash = function(Bullet){

	/* By default there is only ONE bullet, so it just uses myBulletL, myBulletT, etc.  */

		var myBulletL = getLinkLeft(oMyPlane)+getLinkLeft(Bullet);  //bullet is set to "style.left=30" (relative to myPlane)
		var myBulletT = getLinkTop(oMyPlane)+getLinkTop(Bullet);
		var isCollide = false;  

		for (var i = 0; i < enemyArr.length && isCollide === false; i++) {
			if( 
				(	
					Math.abs(myBulletL-getLinkLeft(enemyArr[i]))< myBulletW||
					Math.abs(myBulletL-getLinkLeft(enemyArr[i]))< getLinkWidth(enemyArr[i])
				)
				&&(
				   Math.abs(myBulletT-parseInt(enemyArr[i].style.top))< myBulletH||
				   Math.abs(myBulletT-parseInt(enemyArr[i].style.top))< getLinkHeight(enemyArr[i])	
				)
			 ){
			 	enemyArr[i].style.backgroundImage = "url('images/crash/ownbz.png')";
			 	enemyArr[i].style.backgroundSize = "cover";
				AddUserGrade(enemyArr[i]);
				isCollide  = true;
			}
			else{
			}		
		};
		return isCollide;
}
/** 
 * Collision detection: laser beam hit at least one enemy (if there is any).
 * If hit, then the global variable {enemyOver} will be set to true.
 * @param LaserBeam {HTMLElement} the reference to the Laser Beam element
 * @return void 
*/
this.EnemyLaserCrash = function(LaserBeam){
	var LBWidth = getLinkWidth(LaserBeam);
	var laserBeamLeft = getLinkLeft(LaserBeam); // relative to myPlane element
	var realLBLeft = getLinkLeft(oMyPlane) + laserBeamLeft; // updated value
	var laserBeamBottom = getLinkBottom(LaserBeam); 
	var realLBBottom = getLinkBottom(oMyPlane) + laserBeamBottom;
	for (let i = 0; i < enemyArr.length; i++) {
		if (
			Math.abs(realLBLeft - getLinkLeft(enemyArr[i])) < Math.min(LBWidth, getLinkWidth(enemyArr[i]))
		   &&
		    realLBBottom < getLinkBottom(enemyArr[i]) 
		)
		{
			enemyArr[i].style.backgroundImage = "url('images/crash/ownbz.png')";
			enemyArr[i].style.backgroundSize = "cover";
			AddUserGrade(enemyArr[i]);
		}
		/* Below is bad logic: to be fixed*/
		else{
		}
		/* Bad Logic Ends*/
	}
}
/************************************* 6. User Grades ***************************************/
/**
 * Add user's grade according to the type of enemy plane he shoots down
 * @param Enemy
 * @return void
 */
function AddUserGrade(Enemy){
	// available enemy class: ["enemyXiao","enemyZhong1","enemyZhong2","enemyDa"];
	switch (Enemy.className){
		case "enemyXiao": scoreNum += 1; break;
		case "enemyZhong1": scoreNum += 2; break;
		case "enemyZhong2": scoreNum += 3; break;
		case "enemyDa": scoreNum += 4; break;
		default: break;
	}
}

//3.0 Display current score
this.displayScore = function(){
	var t =setInterval(function(){
		oScoreLTPlay.innerHTML = scoreNum;
		if(end == true){clearTimeout(t);}		
	},10) 
	this.TimerList.push(t);
}
/************************************* Get CSS Style Value on the fly using JS ***************************************/
function getLinkHeight(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).height : object.currentStyle.height);
}
function getLinkWidth(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).width : object.currentStyle.width);
}
function getLinkLeft(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).left : object.currentStyle.left);
}
function getLinkTop(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).top : object.currentStyle.top);
} 
function getLinkRight(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).right : object.currentStyle.right);
}
function getLinkBottom(object){
	return parseInt(window.getComputedStyle ? window.getComputedStyle(object,false).bottom : object.currentStyle.bottom);
}
}
