# Game of Bombers


## GameAPI (v.1)

Since there are quite a few bugs in the original game, Robbin tried hard to develop this API while fixing the bugs at the same time. And he decided to deliver the GameAPI in several releases.

Currently the GameAPI (1st release) offers the following functions:

+ ```GameAPI.StartGame(): void```  
 Start the bomber game.

+ ```GameAPI.StartFire(): void```  
  Let the bomber starts firing. The bomber initially does not fire.

+ ```GameAPI.CeaseFire(): void```  
  Let the bomber cease fire.

+ ```GameAPI.SetBulletSpeed(speed: Number): void```  
  Set the speed at which bullets are generated. The unit for speed is **(number of bullets)/second**. For good user experience, Robbin recommends you set a value larger than 33.

## Useful Information

+ This is a *multimodal* JavaScript game, built for fulfilling course requirement of CS3483 *Multimodal Interface Design* 

+ Credit: We would like to give thanks to [zds-d](https://github.com/zds-d/planeGame.git), upon whose project was this game built. 
