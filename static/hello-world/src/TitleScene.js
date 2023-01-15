import Phaser from "phaser";

import buttonImg from "./assets/title/DialogueBoxSimple.png";

export default class TitleScene extends Phaser.Scene {

  preload() {
    this.load.image("button", buttonImg);
  }

  create() {
    const startButton = this.add.image(300, 300, "button")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainScene").launch("HUDScene");
      });
    const startText = this.add.text(
      300, 300, "Start", { font: "20px Courier", fill: "#000000" });
  }

}