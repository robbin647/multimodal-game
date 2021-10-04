class PlaneGame{
	//游戏界面 
	#oPlaneGame = document.getElementById("planeGame");
	#bgArr = ["bg1.jpg","bg2.jpg","bg3.jpg","bg4.jpg","bg5.jpg"];
	//玩家的飞机 
	#oMyPlane = document.getElementById("myPlane");
	//弹出框 
	#oRelAlert = document.getElementById("relAlert");
	//左上角分数 
	#oScoreLTPlay = document.getElementById("scoreLTPlay");
	//结束时的分数
	#oScoreIn = document.getElementById("scoreIn");
	#oStop = document.getElementById("stop");
	//碰撞检测使用***********
	//玩家飞机 
	#myPlaneH = getLinkHeight(this.#oMyPlane);
	#myPlaneW = getLinkWidth(this.#oMyPlane);
	#myPlaneT = 0;
	#myPlaneL = 0;
	//敌机 
	#enemyPlaneH = 0;  //Height
	#enemyPlaneW = 0;  //Width
	#enemyPlaneT = 0;  //Top
	#enemyPlaneL = 0;  //Left
	#enemyArr = new Array();
	#i =0;  
	//玩家导弹 
	#myBulletH = 0;
	#myBulletW = 0;
	#myBulletT = 0;
	#myBulletL = 0;
	//是否结束 
	#end = false;
	/*************************************一，玩家飞机与敌机的创建***************************************/
	//1.0游戏界面滚动
	#bgstep = 0;
	bgMove(){
		var t = setInterval(function(){
			this.#bgstep += 2;
			var bgstepLimit = 500;
			var num = 0;
			//滚动(兼容性1，火狐不支持backgroundPositionY) 
			this.#oPlaneGame.style.backgroundPosition = "0px"+"  "+ this.#bgstep +"px";
			//换背景 
			if(this.#bgstep >  bgstepLimit && this.#bgstep <=  bgstepLimit*2){
				num = 1;
			}
			else if(this.#bgstep > bgstepLimit*2 && this.#bgstep <= bgstepLimit*3){
				num = 2;
			}
			else if(this.#bgstep > bgstepLimit*3 && this.#bgstep <= bgstepLimit*4){
				num = 3;
			}
			else if(this.#bgstep > bgstepLimit*4 && this.#bgstep <= bgstepLimit*5){
				num = 4;
			}
			else if(this.#bgstep > bgstepLimit*5){
				num = 0;
			}
			this.#oPlaneGame.style.backgroundImage = "url('images/bj/"+ this.#bgArr[num] +"')";	
		},50)
		if(this.#end == true){clearTimeout(t);}
	}
	//1.1：玩家飞机移动函数 
	oMyPlaneMove(event){
		this.style.cursor = "pointer";  //"this" refers to the object calling this function - in this case, oPlaneGame and oMyPlane
		//处理事件对象的兼容性
		var e = window.event || event;  
		var eX = e.pageX-472;
		var eY = e.pageY-32;
		
		//不超出边界
		if((eY-40)>0 && (eY-40)<480 && (eX-33)>0 && (eX-33)<260){
			#oMyPlane.style.top = (eY-40)+"px";
			#oMyPlane.style.left = (eX-33)+"px";
		}
	}
	/*  For demonstration

	function #oMyPlaneMoveLeft(leftDelta){
		if((eY-40)>0 && (eY-40)<480 && (eX-leftDelta)>0 && (eX-leftDelta)<260){
			#oMyPlane.style.top = (eY-40)+"px";
			#oMyPlane.style.left = (eX-leftDelta)+"px";
		}
	}

	if (detect user moves left){
		
		const leftDelta = 20px;
		#oMyPlaneMoveLeft(leftDelta);

		=======
		leftDelta = MapFromUserToPlane(BlazeFace.MeasureAngle());
		#oMyPlaneMoveLeft(leftDelta);
	}

	*/


	//1.2.1,玩家飞机发出导弹函数
	function bulletsMove(){
		//创建节点 
		var  bullet = document.createElement("div");
		bullet.className = "bullet";
		bullet.style.bottom = 90+"px";
		#oMyPlane.app#endChild(bullet);
		//创建节点hi起来 
		var t = setInterval(function fun(){
			bullet.top = bullet.offsetTop - 14 +"px";
			#myBulletT = -parseInt(bullet.style.top);
			if(parseInt(bullet.style.top) <= -460){
				bullet.style.top = -20+"px";
			}
			if(#end == true){clearTimeout(t);}
		},0);
		#myBulletH = getLinkHeight(bullet);
		#= getLinkWidth(bullet);
		#myBulletL = getLinkLeft(bullet);
	}
	//1.2.2敌机随机出现(数量随机、种类随机、位置随机、速度随机) 
	//随机创建敌机函数
	function enemyPlanes(type){
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
		ene#myPlaneL = parseInt(enemy.style.left);
		enemyArr[i] = enemy; 
		#oPlaneGame.app#endChild(enemy);
		//移动 
		var t = setInterval(function(){	
			if(parseInt(my.style.top) <= 560){
				enemy.style.top  = enemy.offsetTop+to+"px";
				ene#myPlaneT = parseInt(enemy.style.top);
				// alert(crash)
			}
			else{
				#oPlaneGame.removeChild(enemy);
				clearTimeout(t);
			}
		},time);
		//当敌机爆炸以后移除敌机 
		var t1 = setInterval(function(){
			if(enemy.style.backgroundImage.match('ownbz.png')){
				#oPlaneGame.removeChild(enemy);
				clearTimeout(t1);
			}
		},500)
		ene#myPlaneH = getLinkHeight(enemy);
		ene#myPlaneW = getLinkWidth(enemy); 
		i++;
	}
	function enemyCreate(){
		//15小 = 3中1 = 2中2 = 1大
		var time = 0;
		var t = setInterval(function(){
			time++;
			if(time <= 10){enemyPlanes(0);}  //小
			if(time > 5 && time <= 7){enemyPlanes(1)}  //中1
			if(time > 8 && time <= 9){enemyPlanes(2)}  //中2	
			if(time == 11){time = 0;enemyPlanes(3);}  //大、
			if(#end == true){clearTimeout(t);}
		},800)
		
		/*************************************二，玩家飞机与敌机的交互***************************************/
	//2.0玩家飞机与敌机的碰撞检测 
	function planesCrash(){

		// var t = setInterval(function(){
			#myPlaneT = getLinkTop(#oMyPlane);
			#myPlaneL = getLinkLeft(#oMyPlane);
			for (var i = 0; i < enemyArr.length; i++) {
				if( 
					
					(	
						Math.abs(#myPlaneL-getLinkLeft(enemyArr[i]))< #myPlaneW||
						Math.abs(#myPlaneL-getLinkLeft(enemyArr[i]))< getLinkWidth(enemyArr[i])
					)
					&&(
					Math.abs(#myPlaneT-parseInt(enemyArr[i].style.top))< #myPlaneH||
					Math.abs(#myPlaneT-parseInt(enemyArr[i].style.top))< getLinkHeight(enemyArr[i])	
					)
				){
					//碰撞以后，游戏结束
					//玩家飞机被炸毁， 
					#oMyPlane.style.backgroundImage = "url('images/crash/xzfjbz.png')";
					#oMyPlane.style.backgroundSize = "cover";
					//可以再玩一次 
					#oRelAlert.style.display = "block";
					#oStop.style.display = "block";
					//显示分数 
					oScoreIn.innerHTML =  scoreNum;
					clearTimeout(t);
					#end = true;
				}
			}; 
		// },	}
	//2.1玩家飞机导弹与敌机的碰撞检测
	//分数 
	var scoreNum = 0;
	//敌机是否与导弹碰撞
	var enemyOver = false;
	function bulletPlanesCrash(){
		// var t =setInterval(function(){
			#myPlaneL = getLinkLeft(#oMyPlane);
			#myBulletL = #myPlaneL+30;
			for (var i = 0; i < enemyArr.length; i++) {
				if( 
					(	
						Math.abs(#myBulletL-getLinkLeft(enemyArr[i]))< #myBulletW||
						Math.abs(#myBulletL-getLinkLeft(enemyArr[i]))< getLinkWidth(enemyArr[i])
					)
					&&(
					Math.abs(#myBulletT-parseInt(enemyArr[i].style.top))< #myBulletH||
					Math.abs(#myBulletT-parseInt(enemyArr[i].style.top))< getLinkHeight(enemyArr[i])	
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
			if(#end == true){clearTimeout(t);} 
		// },10);
	}
	//3.数
	function displayScore(){
		var t =setInterval(function(){	
			if(enemyOver  == true && #end == false){
				scoreNum ++;
			}
			#oScoreLTPlay.innerHTML = reNum;
			if(#end == true){clearTimeout(t);}		
		},1) 
	}
	***********************三，js获取外部样式表属性的函数***************************************/
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
	function Main(){	
		// 1.0 背景变动
		bgMove();
		// //1.1,随着鼠标的移动而移动
		#oPlaneGame.onmousemove = #oMyPlaneMove;
		// //从背景移入飞机时，触发e的事件源发生了变化（由背景变为了玩家飞机），所以代码中的数值也发生了变化)  
		#oMyPlane.onmousemove = #oMyPlaneMove; 
		bulletsMove();
		// //1.2创建敌机 
		enemyCreate();
		//2.0飞机与飞机之间的碰撞检测
		var t = setInterval(function(){planesCrash();bulletPlanesCrash()},50);
		//2.1飞机与导弹之间的碰撞检测
		// var t = setInterval(function(){},10);
		//3.0实时显示分数 
		displayScore();
	}
}
	
// execute Main function when body loading is finished  
window.addEventListener("load", Main, false);