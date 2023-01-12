import Phaser from "phaser";

// HUD icons
import healthIconImg from "./assets/hud/HeartIcon.png";
import rootIconImg from "./assets/hud/ScrollPlant.png";

export default class HUDScene extends Phaser.Scene {

  constructor() {
    super({key: "HUDScene", active: true});
  }

  preload() {

    // Loading HUD icons
    this.load.image("health-icon", healthIconImg);
    this.load.image("root-icon", rootIconImg);

  }

  create() {

      // Rectangle parameters: x, y, width, height, fill, alpha
      const hudContainer = this.add.rectangle(5, 5, 790, 50, 0xffffff, 0.8)
        .setOrigin(0, 0);

      // Player health indicator
      const healthIcon = this.add.image(30, 25, "health-icon").setScale(2);
      const healthText = this.add.text(50, 25, "Health: 100",
        { font: "20px Courier", fill: "#000000" });

      // Root cooldown indicator
      const rootIcon = this.add.image(220, 25, "root-icon").setScale(2);
      const rootCDText = this.add.text(240, 25, "CD: 3",
        { font: "20px Courier", fill: "#000000" });

      // Event listener for MainScene changes
      const mainScene = this.scene.get("MainScene");
      mainScene.events.on("update-hud", (player) => {
        if (player.ability.plant.cooldownTimer) {
          const rootCD = player.ability.plant.cooldownTimer.getOverallRemainingSeconds();
          if (rootCD == 0) {
            rootCDText.setText(`Ready`);
          } else {
            const formattedRootCD = rootCD.toFixed(2);
            rootCDText.setText(`CD: ${formattedRootCD}`);
          }
        } else {
          rootCDText.setText(`Ready`);
        }
      })
  }

};