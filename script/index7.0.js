export default function PlaneGame(){
//游戏界面 
var oPlaneGame = document.getElementById("planeGame");
var bgArr = ["bg1.jpg","bg2.jpg","bg3.jpg","bg4.jpg","bg5.jpg"];
//玩家的飞机 
//var oMyPlane = document.getElementById("myPlane");

/* Debugging */
var oMyPlane = document.getElementById("myPlane");
// this.oMyPlane= oMyPlane;
	// The image used for laser beam
	// the path is relative to /start.html
	const LaserSprite = 'images/own/wp1.png';


//弹出框 
var oRelAlert = document.getElementById("relAlert");
//左上角分数 
var oScoreLTPlay = document.getElementById("scoreLTPlay");
//结束时的分数
var oScoreIn = document.getElementById("scoreIn");
var oStop = document.getElementById("stop");
//碰撞检测使用***********
//玩家飞机 
var myPlaneH = getLinkHeight(oMyPlane);
var myPlaneW = getLinkWidth(oMyPlane);
var myPlaneT = 0;
var myPlaneL = 0;
//敌机 
var enemyPlaneH = 0;  //Height
var enemyPlaneW = 0;  //Width
var enemyPlaneT = 0;  //Top
var enemyPlaneL = 0;  //Left
var enemyArr = new Array();
var i =0;
//玩家导弹 
var myBulletH = 0;
var myBulletW = 0;
var myBulletT = 0;
var myBulletL = 0;
//是否结束 
var end = false;
//global list to store all timers
this.TimerList = [];
/* Debugging 
this.enemyPlanes = this.enemyPlanes.bind(this);
*/
/*************************************一，玩家飞机与敌机的创建***************************************/
//1.0游戏界面滚动
var bgstep = 0;
this.bgMove = function(){
	var t = setInterval(function(){
		bgstep += 2;
		var bgstepLimit = 500;
		var num = 0;
		//滚动(兼容性1，火狐不支持backgroundPositionY) 
		oPlaneGame.style.backgroundPosition = "0px"+"  "+bgstep+"px";
		//换背景 
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
/// 1.1：玩家飞机移动函数 - 鼠标操控
/**
 * This is a helper function to ```oMyPlaneMove``` 
 * It retrieves the dynamic CSS style values of the HTMLElement "#planeGame"
 * No parameter required
 * @return {CSSStyleDeclaration} an object containing all CSS Styles of "#planeGame"
 */
function GetGameBoardCSSStyle(){
	return window.getComputedStyle(oPlaneGame, false);
}

/**
 * This function updates the position of ```oMyPlane```
 *   according to the cursor's position
 * @param event {MouseEvent}
 * @return {void}
 */
function oMyPlaneMove(event){ //event is a MouseEvent
	this.style.cursor = "pointer";
	//处理事件对象的兼容性
	var e = window.event || event;
	var eX = e.pageX-472;  //pageX is the cursor's X-coordinate with respect to the current document
	var eY = e.pageY-32;   //pageY is ibid.
	//the values above are hard coded - 472 and 32 is the corrdinate of the left top corner of gameboard
	//不超出边界
	if((eY-40)>0 && (eY-40)<480 && (eX-33)>0 && (eX-33)<260){
		oMyPlane.style.top = (eY-40)+"px";
		oMyPlane.style.left = (eX-33)+"px";
	}
}

/**
 * This function makes bomber to follow the cursor's movement
 * No parameter required
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
 * @param XDelta: Number; can be positive or negative value
 * @return void;
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
 * @param XDelta: Number; can be positive or negative value
 * @return {void};
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

//1.2.1,玩家飞机发出导弹函数
/*
function bulletsMove(){
	//创建节点 
	var  bullet = document.createElement("div");
	bullet.className = "bullet";
	bullet.style.bottom = 90+"px";
	oMyPlane.appendChild(bullet);
	//设置导弹定时移动 
	var t = setInterval(function fun(){
		bullet.style.top = bullet.offsetTop - 14 +"px";
		myBulletT = -parseInt(bullet.style.top);
		if(parseInt(bullet.style.top) <= -460){
			bullet.style.top = -20+"px";
		}
		if(end == true){clearTimeout(t);}
	},0);
	TimerList.push(t);
	myBulletH = getLinkHeight(bullet);
	myBulletW = getLinkWidth(bullet);
	myBulletL = getLinkLeft(bullet);
} 
*/

/* LASER BEAM FUNCTIONS BEGIN */

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

/* LASER BEAM FUNCTIONS END */

////1.2.1,产生导弹实例
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
////1.2.2,让导弹实例周期性移动
// /**
//  * Let the bullet passed in to move periodically
//  * @param Bullet {HTMLElement} the reference to the created Bullet element
//  * @param Interval {Number} determines the time interval for Bullet to make a move (unit: ms)
//  * @return {Number} the timer ID for the bullet movement
//  */
// this.BulletMove = function(Bullet, Interval){
// 	var TimerBulletMove = setInterval(function fun(){
// 		// the height of bullet image is 14px
// 		Bullet.style.top = Bullet.offsetTop - 14 +"px";
// 		 // if bullet is to fly out of game board
// 		if(getLinkTop(Bullet) + getLinkTop(oMyPlane) <= 0){ 
// 			// reset bullet's position to the head of bomber 
// 			Bullet.style.top = -20+"px";
// 		}
// 		/* Debugging */
// 		// if(end == true){clearTimeout(t);}
// 	},Interval);
// 	/* Don't need to push to TimerList, because we keep TimerID in a BulletNTimerID object in GameAPI*/
// 	// TimerList.push(TimerBulletMove);
// 	return TimerBulletMove;
// }

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

// ////1.2.3 Periodically detect if we need to remove a Bullet instance
// /**
//  * This function checks whether to remove a Bullet instance.
//  * A Bullet instance is removed in the following scenarios:
//  *   (1) The Bullet flies out of the gameboard region
//  *   (2) The Bullet hits an enemy plane and explodes
//  * @param {HTMLElement} Bullet reference to the Bullet  
//  * @param {Number} BulletMovingTimer the TimerID of the timer that 
//  *                  lets Bullet moving periodically
//  * @param {Function} ClearMyself a callback function to remove the timer to this function
//  * @Note I know it's wired to remove a timer inside a function that itself is
//  *       controlled by this timer. But it works. (Also see the timer for EnemyPlane) 
//  */
// this.CheckRemoval = function(Bullet, BulletMovingTimer, ClearMyself){
// 	/* Helper function for checking */
// 	let check = (Bullet) => {
// 		let canRemove = false;
// 		let bulletTop = getLinkTop(Bullet) + getLinkTop(oMyPlane);
// 		let bulletLeft = getLinkLeft(Bullet) + getLinkLeft(oMyPlane);
// 		let bulletRight = getLinkRight(Bullet) + getLinkRight(oMyPlane);
// 		let bulletBottom = getLinkBottom(Bullet) + getLinkBottom(oMyPlane);
		
// 		// debug
// 		console.log(`Bullet left:${bulletLeft}, bullet Top:${bulletTop}`);

// 		// Check if scenario (1) happens
// 		if (bulletTop < 0){
// 			canRemove = true;
// 		}

// 		if (!canRemove){
// 			// Check if scenario (2) happens
// 			for (var i = 0; i < enemyArr.length; i++) {
// 				let thisEnemy = enemyArr[i];
// 				let thisEnemyTop = getLinkTop(thisEnemy);
// 				let thisEnemyBottom = getLinkBottom(thisEnemy);
// 				let thisEnemyLeft = getLinkLeft(thisEnemy);
// 				let thisEnemyRight = getLinkRight(thisEnemy);
				
// 				if (
// 					/* Collision condition */
// 					(
// 						/* (
// 							bulletRight - thisEnemyLeft > 0 &&
// 							bulletRight - thisEnemyLeft < getLinkWidth(thisEnemy)
// 						) ||  
// 						(
// 						thisEnemyRight - bulletLeft > 0 &&
// 						thisEnemyRight - bulletLeft < getLinkWidth(thisEnemy)
// 						) */
// 						bulletLeft - thisEnemyLeft > (-1) * getLinkWidth(Bullet)
// 						&&
// 						bulletLeft - thisEnemyLeft < getLinkWidth(thisEnemy)
// 					) && 
// 					(
// 						/* (
// 							bulletBottom - thisEnemyTop > 0 &&
// 							bulletBottom - thisEnemyTop < getLinkHeight(thisEnemy)
// 						) ||
// 						(
// 							thisEnemyBottom - bulletTop > 0 &&
// 							thisEnemyBottom - bulletTop < getLinkHeight(thisEnemy)	
// 						) */
// 						bulletTop - thisEnemyTop > (-1) * getLinkHeight(Bullet)
// 						&&
// 						bulletTop - thisEnemyTop <  getLinkHeight(thisEnemy)
// 					)
// 				){
// 					canRemove = true; 
// 					thisEnemy.style.backgroundImage = "url('images/crash/ownbz.png')";
// 					thisEnemy.style.backgroundSize = "cover";
// 					enemyOver = true;	
// 					break;
// 				}
// 			}
// 		}
// 		return canRemove;
// 	}
// 	var removalTimer = window.setInterval(() => {
// 		var canRemove = check(Bullet);
// 		if (canRemove){
// 			oMyPlane.removeChild(Bullet);
// 			window.clearInterval(BulletMovingTimer);
// 			window.clearInterval(removalTimer);
// 			ClearMyself(removalTimer);//call GameAPI.BulletNTimer to remove the timer to this function
// 		}
// 	}, 2000); // removal checking time is 500ms
// 	return removalTimer;
// }

////1.2.4,清除导弹实例
// this.ClearBullet = function(Bullet, TimerID){
// 	//TO DO: Given a bullet and its timer. Clear the Bullet from the screen
// 	// and clear the timer
// 	try{
// 		oMyPlane.removeChild(Bullet);
// 		clearInterval(TimerID);
// 	}
// 	catch (e){
		
// 	}
// }
/**
 * Removes a bullet from game board
 * @param Bullet an HTMLElement
 * @return void 
 */
this.ClearBullet = function(Bullet){
	oMyPlane.removeChild(Bullet);
}

//// 1.2.5 Delaying clearing Bullet instance
this.DelayingClearBullet = async function(Bullet, BulletMovingTimer){
	return new Promise((resolve, reject) => {
		let bulletOutOfBoundTimer = window.setInterval(()=>{
			if (getLinkTop(Bullet) + getLinkTop(oMyPlane) <= 0){
				oMyPlane.removeChild(Bullet);
				clearInterval(BulletMovingTimer);
				clearInterval(bulletOutOfBoundTimer);
				resolve(true);
			}
		}, 10)
	});
}

//1.2.2敌机随机出现(数量随机、种类随机、位置随机、速度随机) 
//随机创建敌机函数
/**
 * Create an enemy plane HTMLElement, and set a timer for it to move constantly
 * @param type {Number}: determines which type of enemy plane to create {enemyXiao, enemyZhong1, enemyZhong2, enemyDa}
 * @reutrn {void}
 */
const enemyPlanes = function(type){
	var enemyClass = ["enemyXiao","enemyZhong1","enemyZhong2","enemyDa"];
	var enemyType = ["xiaofeiji.png","xiaozhong.png","zhong.png","dafeiji.png"];
	//位置随机、位置随机、速度随机(时间)
	var le = 0;     //left
	var to = 0;    //top
	var time = 0;   //time
	switch(type){
		case 0:le = 286;to = 10;time = parseInt(Math.random()*80+50);break; 
		case 1:le = 274;to = 10;time = parseInt(Math.random()*10+100);break;
		case 2:le = 230;to = 10;time = parseInt(Math.random()*10+120);break;
		case 3:le = 210;to = 10;time = 180;break;
	}
	//动态创建敌机节点
	var enemy = document.createElement("div");
	//种类随机
	enemy.style.backgroundImage = "url('images/enemy/"+enemyType[type]+"')";
	enemy.className = enemyClass[type];
	//在各自边界的范围下面取随机值
	var rPOsition = parseInt(Math.random()*le);
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
this.enemyCreate=function(){
	//15小 = 3中1 = 2中2 = 1大
	var time = 0;
	var t = setInterval(function(){
		time++;
		if(time <= 10){enemyPlanes(0);}  //小
		if(time > 5 && time <= 7){enemyPlanes(1)}  //中1
		if(time > 8 && time <= 9){enemyPlanes(2)}  //中2	
		if(time == 11){time = 0;enemyPlanes(3);}  //大、
		if(end == true){clearTimeout(t);}
	},800)
	this.TimerList.push(t);
}
/*************************************二，玩家飞机与敌机的交互***************************************/
//2.0玩家飞机与敌机的碰撞检测 
this.planesCrash= function(){

	// var t = setInterval(function(){
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
	// },10)
}
//2.1玩家飞机导弹与敌机的碰撞检测
//分数 
var scoreNum = 0;
//敌机是否与导弹碰撞
// var enemyOver = false;
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
			 	// enemyOver  = true;
				AddUserGrade(enemyArr[i]);
				isCollide  = true;
			}
			else{
				// enemyOver  = false;
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
			// enemyOver  = true;	
		}
		/* Below is bad logic: to be fixed*/
		else{
			// enemyOver  = false;
		}
		/* Bad Logic Ends*/
	}
}

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

//3.0实时显示分数
this.displayScore = function(){
	var t =setInterval(function(){	
		// if(enemyOver  == true && end == false){
		// 	scoreNum ++;
		// }
		oScoreLTPlay.innerHTML = scoreNum;
		if(end == true){clearTimeout(t);}		
	},10) 
	this.TimerList.push(t);
}
/*************************************三，js获取外部样式表属性的函数***************************************/
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
/*************************************四,执行***************************************/
/* function GameStart(){	
	// 1.0 背景变动
	bgMove();
	// //1.1,随着鼠标的移动而移动
	//oPlaneGame.onmousemove = oMyPlaneMove;
	// //从背景移入飞机时，触发e的事件源发生了变化（由背景变为了玩家飞机），所以代码中的数值也发生了变化)  
	//oMyPlane.onmousemove = oMyPlaneMove; 
	//bulletsMove();
	// //1.2创建敌机 
	enemyCreate();
	//2.0飞机与飞机之间的碰撞检测
	var t = setInterval(function(){planesCrash();bulletPlanesCrash()},50);
	TimerList.push(t);
	//2.1飞机与导弹之间的碰撞检测
	//3.0实时显示分数 
	displayScore();
}  */
}

// Execute Main function when <body> is loaded  
// window.addEventListener("load", Main, false);