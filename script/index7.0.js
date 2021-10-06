export default function PlaneGame(){
//游戏界面 
var oPlaneGame = document.getElementById("planeGame");
var bgArr = ["bg1.jpg","bg2.jpg","bg3.jpg","bg4.jpg","bg5.jpg"];
//玩家的飞机 
var oMyPlane = document.getElementById("myPlane");
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
 * @return void; 
 */
this.BomberControlledByCursor = function(){
	oPlaneGame.onmousemove = oMyPlaneMove;
	oMyPlane.onmousemove = oMyPlaneMove; 
}


/**
 * Moves the bomber horizontally by ```XDelta``` pixels
 * @param XDelta: Number; can be positive or negative value
 * @return void;
 */
this.oMyPlaneMovesHorizontal = function(XDelta){
	let MyPlaneLeft = getLinkLeft(oMyPlane);

	let NewLeftValue = MyPlaneLeft + XDelta;
	//Bad practice: hard-coded value
	// This is to ensure the bomber is within the boundary of game board
	if (NewLeftValue > 505 && NewLeftValue < 765){
		oMyPlane.style.left = NewLeftValue;
	}
}
/**
 * Moves the bomber vertically by ```YDelta``` pixels
 * @param XDelta: Number; can be positive or negative value
 * @return void;
 */
this.oMyPlaneMovesVertical = function(YDelta){
	let MyPlaneTop = getLinkTop(oMyPlane);

	let NewTopValue = MyPlaneTop + YDelta;
	//Bad practice: hard-coded value
	// This is to ensure the bomber is within the boundary of game board
	if (NewTopValue > 72 && NewTopValue < 552){
		oMyPlane.style.top = NewTopValue;
	}
}

//1.2.1,玩家飞机发出导弹函数
/* function bulletsMove(){
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
} */


////1.2.1,产生导弹实例
/**
 * @return HTMLElement: the reference to a bullet element
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
/**
 * Let the bullet passed in to move periodically
 * @param Bullet {HTMLElement} the reference to the created Bullet element
 * @param Interval {Number} determines the time interval for Bullet to make a move (unit: ms)
 * @return {Number} the timer ID for the bullet movement
 */
this.BulletMove = function(Bullet, Interval){
	var TimerBulletMove = setInterval(function fun(){
		Bullet.style.top = Bullet.offsetTop - 14 +"px";
		myBulletT = -parseInt(Bullet.style.top);
		if(parseInt(Bullet.style.top) <= -460){
			Bullet.style.top = -20+"px";
		}
		/* Debugging */
		// if(end == true){clearTimeout(t);}
	},Interval);
	/* Don't need to push to TimerList, because we keep TimerID in a BulletNTimerID object in GameAPI*/
	// TimerList.push(TimerBulletMove);
	return TimerBulletMove;
}
////1.2.3,清除导弹实例
this.ClearBullet = function(Bullet, TimerID){
	//TO DO: Given a bullet and its timer. Clear the Bullet from the screen
	// and clear the timer
	try{
		oMyPlane.removeChild(Bullet);
		clearInterval(TimerID);
	}
	catch (e){
		
	}
}
//1.2.2敌机随机出现(数量随机、种类随机、位置随机、速度随机) 
//随机创建敌机函数
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
			//可以再玩一次 
			oRelAlert.style.display = "block";
			oStop.style.display = "block";
			
			//显示分数 
			oScoreIn.innerHTML =  scoreNum;

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
var enemyOver = false;
this.bulletPlanesCrash = function(){

		myPlaneL = getLinkLeft(oMyPlane);
		myBulletL = myPlaneL+30;
		for (var i = 0; i < enemyArr.length; i++) {
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
			 	enemyOver  = true;	
			}
			else{
				enemyOver  = false;
			}		
		};
		

}
//3.0实时显示分数
this.displayScore = function(){
	var t =setInterval(function(){	
		if(enemyOver  == true && end == false){
			scoreNum ++;
		}
		oScoreLTPlay.innerHTML = scoreNum;
		if(end == true){clearTimeout(t);}		
	},1) 
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