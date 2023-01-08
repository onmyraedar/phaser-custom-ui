import Phaser from "phaser";
import { useEffect } from "react";

// Tileset images
import dungeonTilesetImage from "./assets/tilesets/dungeon-tiles.png";

// Maps
import dungeonMap from "./assets/tilemaps/dungeon.json";

function Game() {

  // Scene
  class MainScene extends Phaser.Scene {

    preload() {
      
      // Loading tileset image and map
      this.load.image("tileset", dungeonTilesetImage);
      this.load.tilemapTiledJSON("map", dungeonMap);

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