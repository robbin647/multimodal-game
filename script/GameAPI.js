/*  
 * GameAPI by YANG Tianxia
 * Last update: Oct 5
 */

import PlaneGame from './index7.0.js';

const MyGame = new PlaneGame();

class Bomber{ 
    
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

class Bullet{
    constructor(){
        this.#GenInterval = 5; //Generation interval of single bullet, unit: millisecond 
        this.#IsFireEnabled = false;
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
            this.#SetGenInterval(Math.floor(BulletGenInterval));

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
        }
    }

}

export default class GameAPI {
    
    constructor(){
    /*
     * Initialize private attributes 
     * 
     */ 
        this.#Bomber = new Bomber();
        this.#Bullet = new Bullet();
    }
    
    
    StartGame = () => {MyGame.GameStart();}

    
}

