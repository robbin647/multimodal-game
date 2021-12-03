/*  
 * GameAPI by YANG Tianxia
 * Last update: Nov 27
 */

import PlaneGame from './index7.0.js';

export const MyGame = new PlaneGame();

/**
 * Queue data structure 
 * @apiNote available methods enqueue(), dequeue(), isEmpty(), forEach()
 * 
 */
const Queue = class {
    #_queue;   // the internal JS list
    #size;

    constructor(){
        this.#_queue = [];
        this.#size = 0;
    }
    /**
     * @param item {Any}
     * @return void
     */
    enqueue(item){
        this.#_queue.push(item);
        this.#size++;
    }

    /**
     * @return Any
     */
    dequeue(){
        let result = this.#_queue.shift();
        this.#size--;
        return result;
    }
    /**
     * @return Boolean
     */
    isEmpty(){
        return (this.#size == 0);
    }

    /**
     * Wraps vanilla JS's Array.forEach((value, index, array) => Any)
     * 
     */
    forEach(forEachFunction){
        this.#_queue.forEach(forEachFunction);
    }
}

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

/**
 * 
 * A data structure storing relevant info about a Bullet HTMLElement instance     
 * 
 * Fields: 
 *   - Bullet: HTMLElement
 *   - TimerID: the Timer ID for Bullet moving periodically
 *   - RemovalID: the Timer ID for detecting the event that will cause
 *       the removal of a bullet (i.e. bullet hits an enemy or 
 *       bullet flies out of the gameboard) 
 */
const BulletNTimer = class {
    #Bullet;
    #TimerID;
    // #RemovalID;
    constructor(Bullet, TimerID) {
        this.#Bullet = Bullet;
        this.#TimerID = TimerID;
        // this.RemovalID = RemovalID;
    }
    GetBullet = ()=> (this.#Bullet);
    GetTimerID = ()=> (this.#TimerID);
    // GetRemovalID = () => (this.RemovalID);
    
    /* Debugging Begin */
    // StopBulletMove = () => {clearInterval(this.#TimerID);};
    /* Debugging End  */
}

class BulletController{
    /* Declaring private fields */
    #GenInterval;
    #IsFireEnabled;
    #AllBulletNTimers;
    #AllBullets;
    #BulletEnemyCrashTimer;
    #GenerateBulletTimer;
    #BulletFireReqQue;
    //#MainController;
    #MainControllerCounter;
    #MainControllerTimer;
    //#UpdateMainController;

    constructor(){
        this.#GenInterval = 5; //Generation interval of single bullet, unit: millisecond 
        this.#IsFireEnabled = false;
        this.#AllBulletNTimers = [];  // a list of BulletNTimer unity 
        this.#AllBullets = [];
        this.#BulletEnemyCrashTimer = null; 
        this.#GenerateBulletTimer = null;
        this.#BulletFireReqQue = new Queue();
        this.#MainControllerCounter = 0;
        this.#MainControllerTimer = window.setInterval(function(){this.#MainController();}.bind(this), 10);
    }

    /**
     * Core logic 
     */
    #MainController(){
        
        // increment the time counter
        this.#MainControllerCounter += 10;

        // check if #IsFireEnabled is true
        if (this.#IsFireEnabled){
            // Only when an amount time of #GenInterval has elapsed,
            // we create a new bullet instance
            if (this.#MainControllerCounter % this.#GenInterval === 0){
                var NewBullet = MyGame.CreateBullet();
                this.#AllBullets.push(NewBullet);
            }
        }

        // check if we should remove some bullets 
        // bullets are removed in any of these cases:
        //    (1) Bullet flies out of game boundary
        //    (2) Bullet crashes with any enemy plane
        var bulletsToRemove = [];
        // (1)
        // check if any bullet in #AllBullets list flies out of game boundary 
        // if a bullet does so, it is removed from the gameboard and also #AllBulelts list
        this.#AllBullets.forEach((value) => {
            if (MyGame.isBulletOutOfBoundary(value) === true){
                MyGame.ClearBullet(value);
                bulletsToRemove.push(value);
            }
        });
        // (2)
        //check if any bullet in #AllBullets crashes with enemy planes
        this.#AllBullets.forEach((value) => {
            if (MyGame.bulletPlanesCrash(value) === true){
                MyGame.ClearBullet(value);
                bulletsToRemove.push(value);
            }
        })
        this.#AllBullets = this.#AllBullets.filter((value) => {
            if (value in bulletsToRemove) return false;
            else return true;
        });

        // check if there's still bullets in #AllBullets list
        // if there is, make each of these bullets move
        this.#AllBullets.forEach((value)=>{
            if (this.#MainControllerCounter % this.#GenInterval === 0){
                MyGame.BulletMove(value);
            }
        });

        // if #MainControllerTimer exceeds the #GenInterval, reset it to 0
        if (this.#MainControllerCounter >= this.#GenInterval){
            this.#MainControllerCounter = 0;
        }

    }

    /**
     * This method is called when the user changes the bullet speed i.e. #GenInterval 
     * This method will:
     *     (1) remove the old timer for #MainController 
     *     (2) reset #MainControllerCounter to 0
     *     (3) create a new timer for #MainController, store it in #MainControllerTimer 
     */
    #UpdateMainController(){
        window.clearInterval(this.#MainControllerTimer);  //(1)
        this.#MainControllerCounter = 0; //(2)
        this.#MainControllerTimer = window.setInterval(function(){this.#MainController();}.bind(this), 10); //(3)
    }

    /**
     * Internal function: set the generation interval (unit: millisecond) of a single bullet
     * @param value: Number; the interval in millisecond
     * @return void;
     */
    #SetGenInterval(value){
        if (value >0){
            // due to the MainController(), we need to make sure
            // #GenInterval is always a multiple of 10
            this.#GenInterval = Math.floor(value / 10) * 10;
            this.#UpdateMainController();
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
        /* Debug */
        // this.#BulletFireReqQue.enqueue(1);
        this.#IsFireEnabled = true;
        /* Debug */
    }

    /**
     * Let bomber cease fire.
     * No parameter required.
     * @return void;
     */
    CeaseFire(){
        /* Debug */
        // this.#BulletFireReqQue.dequeue();
        this.#IsFireEnabled = false;
        /* Debug */
    }

}

class GameAPI {
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
    /**
     * Create enemy in the given interval
     * @param Interval the interval used (in ms) to call MyGame.enemyCreate()
     * @return true if succeed
     */
    CreateEnemy = (Interval) => {MyGame.enemyCreate(Interval); return true}

    /* Main function */
    StartGame = () => {
        // 1.0 背景变动
        // Enable background sliding
        //MyGame.bgMove();

        //1.1 允许鼠标操控小飞机 
        // Enable cursor control on Bomber 
        //moved to GameAPI.AllowCursorControlOnBomber()
        

        // Generate enemy planes
        // MyGame.enemyCreate();

        //小飞机与敌机之间的碰撞检测
        // Check if Bomber crashes into an enemy plane
        var DetectBomberEnemyCrash = setInterval(() => {
            MyGame.planesCrash();
        },50);
        MyGame.TimerList.push(DetectBomberEnemyCrash);

        //Enemy and bullet collision detection
        // moved to GameAPI.BulletController.#MainController()
        
        //实时显示分数
        // Keep updating user grade on the top left corner of the game board 
	    MyGame.displayScore();

    }

}

const myAPI = new GameAPI();
export {myAPI as GameAPI};

