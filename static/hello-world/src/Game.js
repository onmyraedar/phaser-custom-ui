import Phaser, { Input } from "phaser";
import { useEffect } from "react";

// Tileset images
import dungeonTilesetImage from "./assets/tilesets/dungeon-tiles.png";

// Maps
import dungeonMap from "./assets/tilemaps/dungeon.json";

// Atlases
import misaAtlasJSON from "./assets/atlases/misa-atlas.json";
import misaAtlasPNG from "./assets/atlases/misa-atlas.png";

function Game() {

  // Scene
  class MainScene extends Phaser.Scene {

    cursors = {};
    wasd = {};

    preload() {
      
      // Loading tileset image and map
      this.load.image("tileset", dungeonTilesetImage);
      this.load.tilemapTiledJSON("map", dungeonMap);

      // Loading the texture atlas for the player's sprite
      // First parameter: PNG, second parameter: JSON
      this.load.atlas("player-atlas", misaAtlasPNG, misaAtlasJSON);

    }

    create() {
      
      const map = this.make.tilemap({ key: "map" });

      // First parameter: the tileset name from the map's JSON file
      // Second parameter: the key from preload()
      const tileset = map.addTilesetImage("dungeon-tiles", "tileset");

      // First parameter: Layer name from Tiled
      const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
      const worldLayer = map.createLayer("World", tileset, 0, 0);

      // Sets collision on the tiles within a layer
      worldLayer.setCollisionByProperty({ collides: true });

      // We haven't defined a spawn point as a Tiled object. For now, we'll 
      // set the player's spawn point using manual coordinates
      this.player = this.physics.add
        .sprite(80, 80, "player-atlas", "misa-front")
        .setSize(30, 40)
        .setOffset(0, 25);

      // Sets the collision between the player and the dungeon walls
      this.physics.add.collider(this.player, worldLayer);

      // Camera
      const camera = this.cameras.main;
      camera.startFollow(this.player);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      camera.setZoom(3);

      // Keys
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        left: Input.Keyboard.KeyCodes.A,
        right: Input.Keyboard.KeyCodes.D,
        up: Input.Keyboard.KeyCodes.W,
        down: Input.Keyboard.KeyCodes.S,
      });

    }

    update() {

      const speed = 200;

      // Stop previous movement from the last frame
      this.player.body.setVelocity(0);

      // Player movement
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        this.player.body.setVelocityX(-speed);
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        this.player.body.setVelocityX(speed);
      } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
        this.player.body.setVelocityY(-speed);
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        this.player.body.setVelocityY(speed);
      }

    }

  }

  // Configuration
  const config = {
    type: Phaser.WEBGL,
    parent: "game-container",
    width: 800,
    height: 600,
    scene: MainScene,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
      },
    },
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