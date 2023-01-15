import Phaser from "phaser";

import titleBackgroundImg from "./assets/title/TitleBackground.png";
import startHoverImg from "./assets/title/StartHover.png";
import startNeutralImg from "./assets/title/StartNeutral.png";
import buttonImg from "./assets/title/DialogueBoxSimple.png";

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("title-background", titleBackgroundImg);
    this.load.image("start-hover", startHoverImg);
    this.load.image("start-neutral", startNeutralImg);
    this.load.image("button", buttonImg);
  }

  create() {
    const titleBackground = this.add.image(0, 0, "title-background")
      .setOrigin(0, 0);
    const startHover = this.add.image(300, 350, "start-hover")
      .setInteractive()
      .on("pointermove", () => {
        startHover.setActive(false).setVisible(false);
        startNeutral.setActive(true).setVisible(true);
      })
      .on("pointerdown", () => {
        this.scene.start("MainScene").launch("HUDScene");
      })
      .setActive(false).setVisible(false);
    const startNeutral = this.add.image(300, 350, "start-neutral")
      .setInteractive()
      .on("pointerover", () => {
        startNeutral.setActive(false).setVisible(false);
        startHover.setActive(true).setVisible(true);
      })
    /*
    const startButton = this.add.image(300, 300, "button")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainScene").launch("HUDScene");
      });
    const startText = this.add.text(
      300, 300, "Start", { font: "20px Courier", fill: "#000000" });
    */
  }

}