import Phaser from "phaser";

// HUD icons
import healthIconImg from "./assets/hud/HeartIcon.png";


export default class HUDScene extends Phaser.Scene {

  constructor() {
    super({key: "HUDScene", active: true});
  }

  preload() {

    // Loading HUD icons
    this.load.image("health-icon", healthIconImg);

  }

  create() {

      // Rectangle parameters: x, y, width, height, fill, alpha
      const hudContainer = this.add.rectangle(5, 5, 795, 50, 0xffffff, 0.8);

      // Player health indicator
      const healthIcon = this.add.image(10, 10, "health-icon");
      const healthText = this.add.text(30, 10, "Health: 100",
        { font: "16px Courier", fill: "#000000" });

  }

};