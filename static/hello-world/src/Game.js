import Phaser from "phaser";
import { useEffect } from "react";
import bird from "./assets/bird-blue-sky-16x16.png";

function Game() {

  // Scene
  class MainScene extends Phaser.Scene {

    preload() {
      
      this.load.image("background", bird)

    }

    create() {

      const { width, height } = this.sys.game.config;

      // Creating a repeating background sprite
      const bg = this.add.tileSprite(0, 0, width, height, "background");
      bg.setOrigin(0, 0);

      this.add
        .text(width/2, height/2, "Hello world \n It's Rae", {
          font: "120px monospace",
          color: "white",
        })
        .setOrigin(0.5, 0.5)
        .setShadow(5, 5, "#5588EE", 0, true, true);

    }
    
  }

  // Configuration
  const config = {
    type: Phaser.WEBGL,
    parent: "game-container",
    width: 800,
    height: 600,
    scene: MainScene,
    backgroundColor: "#FF7575",
  }

  // Initialize the game
  useEffect(() => {
    const game = new Phaser.Game(config);
  }, []);

  // Container where the game will be rendered
  return(
    <div id="game-container"></div>
  );
}

export default Game;