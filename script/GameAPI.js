/*  
 * GameAPI by YANG Tianxia
 * Last update: Oct 5
 */

import PlaneGame from './index7.0.js';

const MyGame = new PlaneGame();

class Bomber{ 
    /* Declaring private fields */
    #oMyPlaneMovesHorizontal;
    #HorizontalDelta;

    constructor(){
        this.#oMyPlaneMovesHorizontal = MyGame.oMyPlaneMovesHorizontal;
        
        // Describes how far the bomber moves to left/right at a time
        this.#HorizontalDelta = 20;
    }

    SetHorizontalDelta(value){
        if (value >= 0){
            this.#HorizontalDelta = value;
        }
    }

    GetHorizontalDelta(){
        return this.#HorizontalDelta;
    }

    MoveLeft(){
        this.#oMyPlaneMovesHorizontal(0 - this.#HorizontalDelta);
    }

    MoveRight(){
        this.#oMyPlaneMovesHorizontal(this.#HorizontalDelta);
    }

}

const BulletNTimer = class {
    constructor(Bullet, TimerID) {
        this.Bullet = Bullet;
        this.TimerID = TimerID;
    }
    GetBullet = ()=> (this.Bullet);
    GetTimerID = ()=> (this.TimerID);
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
        MyGame.bgMove();

        //1.1 允许鼠标操控小飞机
        MyGame.BomberControlledByCursor();

        // //1.2创建敌机 
        MyGame.enemyCreate();

        //2.0飞机与飞机之间的碰撞检测
        var DetectCrash = setInterval(() => {
            MyGame.planesCrash();
            MyGame.bulletPlanesCrash();
        },50);
        MyGame.TimerList.push(DetectCrash);

        //3.0实时显示分数 
	    MyGame.displayScore();
    }
    
    StartFire = () => {this.#BulletController.Fire();}

    CeaseFire = () => {this.#BulletController.CeaseFire();}
    
    SetBulletSpeed = (speed) => {this.#BulletController.SetSpeed(speed);} 
}


