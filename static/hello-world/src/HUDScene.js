import Phaser from "phaser";

// HUD icons
import healthIconImg from "./assets/hud/HeartIcon.png";
import rootIconImg from "./assets/hud/ScrollPlant.png";
import rockIconImg from "./assets/hud/ScrollRock.png";
import thunderIconImg from "./assets/hud/ScrollThunder.png";
import iceIconImg from "./assets/hud/ScrollIce.png";
import flameIconImg from "./assets/hud/ScrollFire.png";
import emptyScrollIconImg from "./assets/hud/ScrollEmpty.png";
import healIconImg from "./assets/hud/Medipack.png";

export default class HUDScene extends Phaser.Scene {

  constructor() {
    super("HUDScene");
  }

  preload() {

    // Loading HUD icons
    this.load.image("health-icon", healthIconImg);
    this.load.image("root-icon", rootIconImg);
    this.load.image("rock-icon", rockIconImg);
    this.load.image("thunder-icon", thunderIconImg);
    this.load.image("ice-icon", iceIconImg);
    this.load.image("flame-icon", flameIconImg);
    this.load.image("empty-scroll-icon", emptyScrollIconImg);
    this.load.image("heal-icon", healIconImg);

  }

  create() {

      // Rectangle parameters: x, y, width, height, fill, alpha
      const hudContainer = this.add.rectangle(0, 550, 800, 50, 0xffffff, 0.85)
        .setOrigin(0, 0);

      // Player health indicator
      const healthIcon = this.add.image(30, 575, "health-icon").setScale(2);
      const healthText = this.add.text(50, 575, "-",
        { font: "20px Courier", fill: "#000000" });

      // Root CD indicator
      const rootIcon = this.add.image(120, 575, "root-icon").setScale(2);
      const rootCDText = this.add.text(140, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Rock CD indicator
      const rockIcon = this.add.image(240, 575, "rock-icon").setScale(2);
      const rockCDText = this.add.text(260, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Thunder CD indicator
      const thunderIcon = this.add.image(360, 575, "thunder-icon").setScale(2);
      const thunderCDText = this.add.text(380, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Ice CD indicator
      const iceIcon = this.add.image(480, 575, "ice-icon").setScale(2);
      const iceCDText = this.add.text(500, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Fire CD indicator
      const fireIcon = this.add.image(600, 575, "flame-icon").setScale(2);
      const fireCDText = this.add.text(620, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Heal CD indicator
      const emptyScrollIcon = this.add.image(720, 575, "empty-scroll-icon").setScale(2);
      const healIcon = this.add.image(720, 575, "heal-icon").setScale(2);
      const healCDText = this.add.text(740, 575, "Ready",
        { font: "20px Courier", fill: "#000000" });

      // Event listener for MainScene changes
      const mainScene = this.scene.get("MainScene");

      mainScene.events.on("update-hud", (player) => {
        healthText.setText(player.currentHealth);
        if (player.ability.plant.isOnCooldown) {
          const rootCD = player.ability.plant.cooldownTimer.getOverallRemainingSeconds();
          const formattedRootCD = Math.round(rootCD);
          rootCDText.setText(`CD: ${formattedRootCD}`);
        } else {
          rootCDText.setText(`Ready`);
        }
        if (player.ability.rock.isOnCooldown) {
          const rockCD = player.ability.rock.cooldownTimer.getOverallRemainingSeconds();
          const formattedRockCD = Math.round(rockCD);
          rockCDText.setText(`CD: ${formattedRockCD}`);
        } else {
          rockCDText.setText(`Ready`);
        }
        if (player.ability.thunder.isOnCooldown) {
          const thunderCD = player.ability.thunder.cooldownTimer.getOverallRemainingSeconds();
          const formattedThunderCD = Math.round(thunderCD);
          thunderCDText.setText(`CD: ${formattedThunderCD}`);
        } else {
          thunderCDText.setText(`Ready`);
        }
        if (player.ability.ice.isOnCooldown) {
          const iceCD = player.ability.ice.cooldownTimer.getOverallRemainingSeconds();
          const formattedIceCD = Math.round(iceCD);
          iceCDText.setText(`CD: ${formattedIceCD}`);
        } else {
          iceCDText.setText(`Ready`);
        }
        if (player.ability.fire.isOnCooldown) {
          const fireCD = player.ability.fire.cooldownTimer.getOverallRemainingSeconds();
          const formattedFireCD = Math.round(fireCD);
          fireCDText.setText(`CD: ${formattedFireCD}`);
        } else {
          fireCDText.setText(`Ready`);
        }
        if (player.ability.heal.isOnCooldown) {
          const healCD = player.ability.heal.cooldownTimer.getOverallRemainingSeconds();
          const formattedHealCD = Math.round(healCD);
          healCDText.setText(`CD: ${formattedHealCD}`);
        } else {
          healCDText.setText(`Ready`);
        }

      });


  }

};