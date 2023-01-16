import Phaser from "phaser";

import gameOverBackgroundImg from "./assets/game-over/GameOverBackground.png";
import restartHoverImg from "./assets/game-over/RestartHover.png";
import restartNeutralImg from "./assets/game-over/RestartNeutral.png";

export default class GameOverScene extends Phaser.Scene {

  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.image("game-over-background", gameOverBackgroundImg);
    this.load.image("restart-hover", restartHoverImg);
    this.load.image("restart-neutral", restartNeutralImg);
  }

  create() {
    const gameOverBackground = this.add.image(0, 0, "game-over-background")
      .setOrigin(0, 0);
      
      const restartHover = this.add.image(300, 350, "restart-hover")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerout", () => {
        restartHover.setActive(false).setVisible(false);
        restartNeutral.setActive(true).setVisible(true);
      })
      .on("pointerdown", () => {
        this.scene.start("TitleScene");
      })
      .setActive(false).setVisible(false);

    const restartNeutral = this.add.image(300, 350, "restart-neutral")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerover", () => {
        restartNeutral.setActive(false).setVisible(false);
        restartHover.setActive(true).setVisible(true);
      });
  }

}