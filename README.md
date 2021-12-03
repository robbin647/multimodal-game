# Game of Bombers


## GameAPI (v.5)

The GameAPI v.5 is released.

> __IMPORTANT__ Start from V5 you should use the following to call GameAPI:
  ```javascript
     // In start.html or other top-level files
     import {GameAPI} from './script/GameAPI.js'; 
     GameAPI.StartFire(); //Syntax: GameAPI.<method name>
    // In JS files that is within the same folder as GameAPI.js
     import {GameAPI} from './GameAPI.js'
     GameAPI.StartFire();
  ```

The v.5 gives you these functions:

+ ```GameAPI.StartGame(): void```  
 Start the bomber game.

+ ```GameAPI.StartFire(): void```  
  Let the bomber starts firing. The bomber initially does not fire.

+ ```GameAPI.CeaseFire(): void```  
  Let the bomber cease fire.

+ ```GameAPI.SetBulletSpeed(speed: Number): void```  
  Set the speed at which bullets are generated. The unit for speed is **(number of bullets)/second**. For good user experience, Robbin recommends you set a value larger than 33.

+ ```GameAPI.AllowCursorControlOnBomber(IsAllow: Boolean): void```
  This controls whether the bomber can be controlled by mouse cursor (the original game feature).

+ ```GameAPI.BomberMovesUpBy(distance: Number): void```  
  Makes the bomber move up by a certain ```distance``` (unit: pixel).

+ ```GameAPI.BomberMovesDownBy(distance: Number): void```  
  Similar to ```GameAPI.BomberMovesUpBy()```.

+ ```GameAPI.BomberMovesLeftBy(distance: Number): void```  
  Similar to ```GameAPI.BomberMovesUpBy()```.

+ ```GameAPI.BomberMovesRightBy(distance: Number): void```  
  Similar to ```GameAPI.BomberMovesUpBy()```.

+ ```GameAPI.SetBomberPosition(XPercent: Number, YPercent: Number): void```  
  Use the two percentage values to set the bomber's position on the game board. ```XPercent``` is the proportion of the distance between bomber's **left** boarder and the game board's **left** boarder, with respect to the full horizontal range of the bomber (=260px). ```YPercent``` is the proportion of the distance between bomber's **top** boarder and the game board's **top** boarder, with respect to the full vertical range of the bomber (=480px). 

<img alt="Sketch explaining the bomber position by percentage" src="./images/doc/BomberPos_Explained.gif" width="500px" height="500px">  

+ ```GameAPI.BomberFiresLaser(IsFireLaser: Boolean): void```  
  This method controls the bomber to start or stop firing laser beam. For example, by passing the parameter ```IsFireLaser``` as ```true```, you enable the bomber to fire laser.

+ ```GameAPI.CreateEnemy(Interavl: Number): void```  
  This will set the speed (the unit for Interval: ms) of enemy plane's creation and movement. If you do not call it, the game will use a default value 5400 millisecond.

## Extra Note: 
  > **Q: How to import JavaScript modules from external javascript file into ```<script>``` tag of HTML file?**
 
  > Ans: add ```type="module"``` to script tag. it will work. See [StackOverflow](https://stackoverflow.com/questions/62783429/how-to-import-javascript-module-from-external-javascript-file-into-script-tag).
  
  e.g.
  ```js
  <script type="module">    
     import JSZip from '../node_modules/jszip/dist/jszip.min.js';
  </script>
  ```

  > **Q: I have a ```.js``` file. How do I import an external JavaScript module in this file?**
 
  > Ans: First you need to transform your ```.js``` file into a JavaScrpit module. Check out [this MDN link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for JS module syntax. Then after you turn your ```.js``` file into a JS module, you can use the import statement ```import {...} from <path to your JavaScript module file>```, where inside ```{...}``` you should list out all functions, classes, etc., that you would like to import and use in your own ```.js``` file. For your quick understanding, you make also check out [this YouTube video](https://www.youtube.com/watch?v=s9kNndJLOjg). 
 
  > **Q: I download a copy from this repo. But the browser reports an error loading JS modules saying "Access to script ... from origin 'null' has been blocked by CORS policy...". What's wrong?**  
  
  > Ans: Loading JS module files from local file system is currently banned due to security concerns. You may try to put the whole repo on a Web Server so that all files come from the same origin. 
 
  > **Q: How will we combine our JS code together?**

  > Ans: We will use [Webpack](https://webpack.js.org/guides/getting-started/).
 

## Useful Information

+ This is a *multimodal* JavaScript game, built for fulfilling course requirement of CS3483 *Multimodal Interface Design* 

+ Credit: We would like to give thanks to [zds-d](https://github.com/zds-d/planeGame.git), upon whose project was this game built. 
