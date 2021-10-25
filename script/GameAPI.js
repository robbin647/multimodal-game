/*  
 * GameAPI by YANG Tianxia
 * Last update: Oct 5
 */

import PlaneGame from './index7.0.js';
import LaserBeam from './LaserBeam.js';

export const MyGame = new PlaneGame();

/* Debugging Begin */
const Laser = new LaserBeam();
/* Debugging End */

class Bomber{ 
    /* Declaring private fields */
    #BomberControlledByCursor;
    #oMyPlaneMovesHorizontal;
    #oMyPlaneMovesVertical;
    #HorizontalDelta;
    #VerticalDelta;

    constructor(){
        this.#oMyPlaneMovesHorizontal = MyGame.oMyPlaneMovesHorizontal;
        this.#oMyPlaneMovesVertical = MyGame.oMyPlaneMovesVertical;
        this.#BomberControlledByCursor = MyGame.BomberControlledByCursor;
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

    constructor(){
        this.#GenInterval = 5; //Generation interval of single bullet, unit: millisecond 
        this.#IsFireEnabled = false;
        this.#AllBulletNTimers = [];  // a list of BulletNTimer unity 
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
        }
    }

    /* Debugging Begin */
    StopBullet(){

    }
    /* Debugging End */

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
    
    
    StartGame = () => {
        // 1.0 背景变动
        //MyGame.bgMove();

        //1.1 允许鼠标操控小飞机  
        //已经移到GameAPI.AllowCursorControlOnBomber方法中
        

        // //1.2创建敌机 
        //MyGame.enemyCreate();

        //2.0飞机与飞机之间的碰撞检测
        var DetectCrash = setInterval(() => {
            MyGame.planesCrash();
            MyGame.bulletPlanesCrash();
        },50);
        MyGame.TimerList.push(DetectCrash);

        //3.0实时显示分数 
	    MyGame.displayScore();

        /* Debugging Begin */

        Laser.FireLaserBeam(MyGame.oMyPlane);

        var timer = setTimeout(
                       () => {Laser.StopLaserBeam(MyGame.oMyPlane)}
                       , 5000);
        
        /* Debugging End */
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
}


