import Phaser from "phaser";

import gameOverBackgroundImg from "./assets/game-over/GameOverBackground.png";
import buttonImg from "./assets/title/DialogueBoxSimple.png";

export default class GameOverScene extends Phaser.Scene {

  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.image("game-over-background", gameOverBackgroundImg);
    this.load.image("button", buttonImg);
  }

  create() {
    const gameOverBackground = this.add.image(0, 0, "game-over-background")
      .setOrigin(0, 0);
    const gameOverText = this.add.text(
      300, 120, "Game Over", { font: "20px Courier", fill: "#000000" });
    const restartButton = this.add.image(300, 300, "button")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        const hudScene = this.scene.get("HUDScene");
        hudScene.scene.restart();
        const mainScene = this.scene.get("MainScene");
        mainScene.scene.restart();
        });
    const restartText = this.add.text(
      300, 300, "Restart", { font: "20px Courier", fill: "#000000" });
  }

}