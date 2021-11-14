/*  
 * GameAPI by YANG Tianxia
 * Last update: Oct 27
 */

import PlaneGame from './index7.0.js';

export const MyGame = new PlaneGame();

const LaserBeam = class {
    // By default we only allow one laser beam at a time
    #LB;
    #LBTimer;

    constructor(){
        /* By default we do not create a laser beam
            when this class is instantiated. The private 
            laser beam attribute (i.e. #LB) will be null.
            However, once the GameAPI calls this.FireLaser()
            a new laser beam HTMLElement will be created
            and assigned to #LB.
        */
        this.#LB = null;
        this.#LBTimer = null;  // laser beam and enemy collision detection timer
    }
    /**
     * Let the bomber fire laser beam.
     * Internally it is to create a laser beam HTMLElement
     *   and save it to the private attribute #LB.
     * No parameter required.
     * @return void
     */
    Fire = () => {
        // check if a laser beam already exists
        if (this.#LB == null){
            this.#LB = MyGame.FireLaserBeam();
            this.#LBTimer = setInterval(() => {
                MyGame.EnemyLaserCrash(this.#LB);
            }, 50);
            MyGame.TimerList.push(this.#LBTimer);
        }
    }
    /**
     * Stop the bomber from firing laser beam.
     * Internally pass the private attribute #LB
     * to class PlaneGame and let it remove the element.
     * No parameter required.
     * @return void
     */
    Stop = () => {
        if (this.#LB != null){
            MyGame.StopLaserBeam(this.#LB);
            this.#LB = null;
            /* To remove the #LBTimer from MyGame.TimerList */
            clearInterval(this.#LBTimer);
            var idx = MyGame.TimerList.indexOf(this.#LBTimer); 
            MyGame.TimerList = MyGame.TimerList.filter((value, index, array) =>{
                return (index != idx);
            });
        }
    }
}

class Bomber{ 
    /* Declaring private fields */
    #BomberControlledByCursor;
    #oMyPlaneMovesHorizontal;
    #oMyPlaneMovesVertical;
    #HorizontalDelta;
    #VerticalDelta;
    #MyLaserBeam;

    constructor(){
        this.#oMyPlaneMovesHorizontal = MyGame.oMyPlaneMovesHorizontal;
        this.#oMyPlaneMovesVertical = MyGame.oMyPlaneMovesVertical;
        this.#BomberControlledByCursor = MyGame.BomberControlledByCursor;
        this.#MyLaserBeam = new LaserBeam();
        // Describes how far the bomber moves to left/right/up/down at a time
        this.#HorizontalDelta = 20;
        this.#VerticalDelta = 20;
        
    }

    EnableCursorControl(){
        this.#BomberControlledByCursor(true);
    }

    DisableCursorControl(){
        this.#BomberControlledByCursor(false);
    }

    SetHorizontalDelta(value){
        this.#HorizontalDelta = value;
    }

    SetVerticalDelta(value){
        this.#VerticalDelta = value;
    }

    MoveLeft(){
        this.#oMyPlaneMovesHorizontal(0 - this.#HorizontalDelta);
    }

    MoveRight(){
        this.#oMyPlaneMovesHorizontal(this.#HorizontalDelta);
    }

    MoveUp(){
        this.#oMyPlaneMovesVertical(0 - this.#VerticalDelta);
    }

    MoveDown(){
        this.#oMyPlaneMovesVertical(this.#VerticalDelta);
    }

    SetPositionByPercent(XPercent, YPercent){
        if (XPercent >= 0 && XPercent <= 100)
            if (YPercent >= 0 && YPercent <= 100)
                MyGame.oMyPlaneGotoPosition(XPercent, YPercent);
    }

    FireLaser(){
        this.#MyLaserBeam.Fire();
    }

    StopLaser(){
        this.#MyLaserBeam.Stop();
    }
}

const BulletNTimer = class {
    #Bullet;
    #TimerID;
    constructor(Bullet, TimerID) {
        this.Bullet = Bullet;
        this.TimerID = TimerID;
    }
    GetBullet = ()=> (this.Bullet);
    GetTimerID = ()=> (this.TimerID);
    
    /* Debugging Begin*/
    StopBulletMove = () => {clearInterval(this.TimerID);};
    /* Debugging End*/
}

class BulletController{
    /* Declaring private fields */
    #GenInterval;
    #IsFireEnabled;
    #AllBulletNTimers;
    #BulletEnemyCrashTimer;

    constructor(){
        this.#GenInterval = 5; //Generation interval of single bullet, unit: millisecond 
        this.#IsFireEnabled = false;
        this.#AllBulletNTimers = [];  // a list of BulletNTimer unity 
        this.#BulletEnemyCrashTimer = null; 
    }

    /**
     * Internal function: set the generation interval (unit: millisecond) of a single bullet
     * @param value: Number; the interval in millisecond
     * @return void;
     */
    #SetGenInterval(value){
        if (value >0){
            this.#GenInterval = value;
        }
    }

    /**
     * Return the latest bullet generation interval value
     * No parameter required.
     * @return Number; the bullet generation interval in millisecond 
     */
    GetGenInterval(){
        return this.#GenInterval;
    }

    /**
     * Public function: set the generation speed of bullets (unit: bullet/sec)
     * @param speed : Number;  the generation speed of bullets (unit: bullet/sec)
     * @return void;
     */
    SetSpeed(speed){
        if (speed > 0){
            let BulletGenInterval = 1.0 / speed;

            this.#SetGenInterval(Math.floor(BulletGenInterval * 1000));

            /* Speed < 33 bullet/sec is quite slow and will affect user experience*/
            if (speed < 33){
                console.log(`You set bullet speed to be ${speed}, which is a bit slow!`);
            }
        }
    }

    /**
     * Return whether bomber should fire or not
     * No parameter required.
     * @return Boolean; whether the bomber should fire
     */
    GetIsFireEnabled(){
        if (this.#IsFireEnabled) return true;
        else return false;
    }

    /**
     * Let bomber starts to fire bullets.
     * No parameter required.
     * @return void;
     */
    Fire(){
        if (this.#IsFireEnabled == false){
            this.#IsFireEnabled = true;
            var NewBullet = MyGame.CreateBullet();
            var NewTimerID = MyGame.BulletMove(NewBullet, this.GetGenInterval());
            var NewBulletNTimer = new BulletNTimer(NewBullet, NewTimerID);
            this.#AllBulletNTimers.push(NewBulletNTimer);
            // set up the timer to detect bullet and enemy collision
            this.#BulletEnemyCrashTimer = setInterval(() => {
                MyGame.bulletPlanesCrash();
            }, 50);
            MyGame.TimerList.push(this.#BulletEnemyCrashTimer);
        }    
    }

    /**
     * Let bomber cease fire.
     * No parameter required.
     * @return void;
     */
    CeaseFire(){
        if (this.#IsFireEnabled == true){
            this.#IsFireEnabled = false;
 
            //clear the list of BulletNTimer objects
            while (this.#AllBulletNTimers.length > 0){
                let _ = this.#AllBulletNTimers.pop();
                MyGame.ClearBullet(_.GetBullet(), _.GetTimerID());
            }

            //clear the timer for bullet and enemy crash detection
            clearInterval(this.#BulletEnemyCrashTimer);
            //remove the timer from MyGame.TimerList 
            var idx = MyGame.TimerList.indexOf(this.#BulletEnemyCrashTimer);
            MyGame.TimerList = MyGame.TimerList.filter((value, index, array) => {
                return (index != idx);
            });

        }
    }

}

export default class GameAPI {
    /* Declaring private fields */
    #Bomber;
    #BulletController;

    constructor(){
    /*
     * Initialize private attributes 
     * 
     */ 
        this.#Bomber = new Bomber();
        this.#BulletController = new BulletController();
    }
    
    /*      Bullet Features     */
    StartFire = () => {this.#BulletController.Fire();}
    CeaseFire = () => {this.#BulletController.CeaseFire();}
    SetBulletSpeed = (speed) => {this.#BulletController.SetSpeed(speed);} 

    /*      Bomber Features      */
    AllowCursorControlOnBomber = (IsAllow) => {(IsAllow)? this.#Bomber.EnableCursorControl() : this.#Bomber.DisableCursorControl();}
    BomberMovesUpBy = (distance) => {this.#Bomber.SetVerticalDelta(distance); this.#Bomber.MoveUp();}
    BomberMovesDownBy = (distance) => {this.#Bomber.SetVerticalDelta(distance); this.#Bomber.MoveDown();}
    BomberMovesLeftBy = (distance) => {this.#Bomber.SetHorizontalDelta(distance);this.#Bomber.MoveLeft();}
    BomberMovesRightBy = (distance) => {this.#Bomber.SetHorizontalDelta(distance); this.#Bomber.MoveRight();}
    SetBomberPosition = (XPercent, YPercent) => {this.#Bomber.SetPositionByPercent(XPercent, YPercent);}
    BomberFiresLaser = (IsFireLaser) => {(IsFireLaser) ? this.#Bomber.FireLaser() : this.#Bomber.StopLaser();}


    /* Main function */
    StartGame = () => {
        // 1.0 背景变动
        //MyGame.bgMove();

        //1.1 允许鼠标操控小飞机  
        //已经移到GameAPI.AllowCursorControlOnBomber方法中
        

        // //1.2创建敌机 
        MyGame.enemyCreate();

        //2.0飞机与飞机之间的碰撞检测
        var DetectBomberEnemyCrash = setInterval(() => {
            MyGame.planesCrash();
        },50);
        MyGame.TimerList.push(DetectBomberEnemyCrash);

        //2.1 Enemy and bullet collision detection
        var DetectEnemyBulletCrash = 
            MyGame.bulletPlanesCrash();

        //3.0实时显示分数 
	    MyGame.displayScore();

    }

}


