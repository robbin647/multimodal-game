
import {GameAPI} from './GameAPI.js'

function GameInit(){
        //让GameAPI启动游戏
		GameAPI.StartGame();

		//允许鼠标操控小飞机
		GameAPI.AllowCursorControlOnBomber(true);

		//设置导弹的产生速率，单位：每秒多少个导弹
		GameAPI.SetBulletSpeed(33);

		// Set the default enemy genaration speed
		GameAPI.CreateEnemy(5400);

        document.addEventListener("keydown", (e) => {
			// compatible with IE
			var event = e || window.event;
			if (e) {
				if (event.key === "W" || event.key === "w"){
					GameAPI.StartFire();
				}
			}
		});

		document.addEventListener("keyup", (e) => {
			// compatible with IE
			var event = e || window.event;
			if (e) {
				if (event.key === "W" || event.key === "w"){
					GameAPI.CeaseFire();
				}
			}
		})

		document.addEventListener("keydown", (e) => {
			// compatible with IE
			var event = e || window.event;
			if (e) {
				if (event.key === "L" || event.key === "l"){
					GameAPI.BomberFiresLaser(true);
				}
			}
		});

		document.addEventListener("keyup", (e) => {
			// compatible with IE
			var event = e || window.event;
			if (e) {
				if (event.key === "L" || event.key === "l"){
					GameAPI.BomberFiresLaser(false);
				}
			}
		})

		// slider bar for setting bomber speed
		var speedchoice = document.getElementById("SpeedSlider");
		speedchoice.addEventListener("change", (e) => {
			console.log("Bullet speed set: " + e.target.value);
			GameAPI.SetBulletSpeed(e.target.value);
		})
		// slider bar for setting enemy generation speed
        var enemyRateChoice = document.getElementById("EnemySpeed");
		enemyRateChoice.addEventListener("change", (e) => {
			console.log("Enemy speed set: " + e.target.value);
			GameAPI.CreateEnemy(e.target.value);
		})
}

export default GameInit;
