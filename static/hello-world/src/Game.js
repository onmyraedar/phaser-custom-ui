import Phaser, { Input } from "phaser";
import { useEffect } from "react";

// Tileset images
import floorTilesetImg from "./assets/tilesets/TilesetFloor.png";
import natureTilesetImg from "./assets/tilesets/TilesetNature.png";

// Maps
import dungeonTest1Map from "./assets/tilemaps/dungeon-test-01.json";

// Atlases
import ninjaAtlasJson from "./assets/atlases/ninja-atlas.json";
import ninjaAtlasPng from "./assets/atlases/ninja-atlas.png";


// Projectiles
import ProjectileGroup, { Projectile } from "./ProjectileGroup";
import shurikenAtlasJson from "./assets/projectiles/shuriken-atlas.json";
import shurikenAtlasPng from "./assets/projectiles/shuriken-atlas.png";

function Game() {

  // Scene
  class MainScene extends Phaser.Scene {

    cursors = {};
    wasd = {};

    preload() {
      
      // Loading tileset images and map
      this.load.image("floor-tileset", floorTilesetImg);
      this.load.image("nature-tileset", natureTilesetImg);
      this.load.tilemapTiledJSON("dungeon-test-1-map", dungeonTest1Map);

      // Loading the texture atlas for the player's sprite
      // First parameter: PNG, second parameter: JSON
      this.load.atlas("player-atlas", ninjaAtlasPng, ninjaAtlasJson);

      // Loading the shuriken texture atlas
      this.load.atlas("shuriken-atlas", shurikenAtlasPng, shurikenAtlasJson);

    }

    create() {
      
      const map = this.make.tilemap({ key: "dungeon-test-1-map" });

      // First parameter: the tileset name from the map's JSON file
      // Second parameter: the key from preload()
      const floorTileset = map.addTilesetImage("TilesetFloor", "floor-tileset");
      const natureTileset = map.addTilesetImage("TilesetNature", "nature-tileset");

      // First parameter: Layer name from Tiled
      const belowLayer = map.createLayer("Below Player", floorTileset, 0, 0);
      const worldLayer = map.createLayer("World", natureTileset, 0, 0);

      // Sets collision on the tiles within a layer
      worldLayer.setCollisionByProperty({ collides: true });

      // We haven't defined a spawn point as a Tiled object. For now, we'll 
      // set the player's spawn point using manual coordinates
      this.player = this.physics.add
        .sprite(120, 120, "player-atlas", "ninja-idle-front");

      // Add the player's last idle direction
      this.player.lastIdleDirection = "front";

      // Sets the collision between the player and the dungeon walls
      this.physics.add.collider(this.player, worldLayer);

      // Camera
      const camera = this.cameras.main;
      camera.startFollow(this.player);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      camera.setZoom(2);

      // Keys
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        left: Input.Keyboard.KeyCodes.A,
        right: Input.Keyboard.KeyCodes.D,
        up: Input.Keyboard.KeyCodes.W,
        down: Input.Keyboard.KeyCodes.S,
      });

      // Creates the player's movement animations
      const anims = this.anims;

      anims.create({
        key: "player-walk-front",
        frames: anims.generateFrameNames("player-atlas", {
          prefix: "ninja-walk-front.",
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 7,
        repeat: -1,   // -1 repeats the animation infinitely many times
      });

      anims.create({
        key: "player-walk-back",
        frames: anims.generateFrameNames("player-atlas", {
          prefix: "ninja-walk-back.",
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 7,
        repeat: -1,
      });    

      anims.create({
        key: "player-walk-left",
        frames: anims.generateFrameNames("player-atlas", {
          prefix: "ninja-walk-left.",
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 7,
        repeat: -1,
      });  

      anims.create({
        key: "player-walk-right",
        frames: anims.generateFrameNames("player-atlas", {
          prefix: "ninja-walk-right.",
          start: 0,
          end: 3,
          zeroPad: 3,
        }),
        frameRate: 7,
        repeat: -1,
      });  

      // Temporary test enemy
      this.enemy = this.physics.add
        .sprite(200, 200, "player-atlas", "ninja-idle-front")
        .setImmovable(true);

      // Adds test enemy to the group of enemies
      this.enemies = this.add.group();
      this.enemies.add(this.enemy);

      // Projectile; final parameter is the wielder
      this.shurikens = new ProjectileGroup(this, "shuriken-atlas", "shuriken.000");

      // Each shuriken should disappear after colliding with the world
      this.physics.add.collider(this.shurikens, worldLayer, (obj1, obj2) => {

        // The shuriken is the Projectile object involved in the collision
        const shuriken = [obj1, obj2].find((obj) => obj instanceof Projectile);
        shuriken.setActive(false);
        shuriken.setVisible(false);    

      })

      // Shuriken collision with enemies
      this.physics.add.collider(this.shurikens, this.enemies, (obj1, obj2) => {

        // The shuriken is the Projectile object involved in the collision
        const shuriken = [obj1, obj2].find((obj) => obj instanceof Projectile);
        shuriken.setActive(false);
        shuriken.setVisible(false);  

      })
      
      // Adds the space key
      this.spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );

    }

    update() {

      const speed = 100;
      const previousVelocity = this.player.body.velocity.clone();

      // Stop previous movement from the last frame
      // Sets velocity to zero in both the X and Y directions
      this.player.body.setVelocity(0);

      // Horizontal movement
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        this.player.body.setVelocityX(-speed);
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        this.player.body.setVelocityX(speed);
      }

      // Vertical movement
      if (this.cursors.up.isDown || this.wasd.up.isDown) {
        this.player.body.setVelocityY(-speed);
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        this.player.body.setVelocityY(speed);
      }

      // Normalize and scale the velocity
      // This prevents the player from moving faster along a diagonal
      this.player.body.velocity.normalize().scale(speed);

      // Update player movement animations
      // Horizontal animations have preference over vertical animations
      if (this.cursors.left.isDown) {
        this.player.anims.play("player-walk-left", true);
      } else if (this.cursors.right.isDown) {
        this.player.anims.play("player-walk-right", true);
      } else if (this.cursors.up.isDown) {
        this.player.anims.play("player-walk-back", true);
      } else if (this.cursors.down.isDown) {
        this.player.anims.play("player-walk-front", true);
      } else {

        // If no movement key is pressed, stop the animation
        this.player.anims.stop();

        // Set idle frame based on previous movement
        // Update the player's last idle direction
        if (previousVelocity.x < 0) {
          this.player.setTexture("player-atlas", "ninja-idle-left");
          this.player.lastIdleDirection = "left"; 
        } else if (previousVelocity.x > 0) {
          this.player.setTexture("player-atlas", "ninja-idle-right");
          this.player.lastIdleDirection = "right"; 
        } else if (previousVelocity.y < 0) {
          this.player.setTexture("player-atlas", "ninja-idle-back");
          this.player.lastIdleDirection = "back";
        } else if (previousVelocity.y > 0) {
          this.player.setTexture("player-atlas", "ninja-idle-front");
          this.player.lastIdleDirection = "front";
        }

      }

      // Pressing the space key throws a shuriken
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.shurikens.fireProjectile(this.player.x, this.player.y,
          this.player);
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
    pixelArt: true,
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