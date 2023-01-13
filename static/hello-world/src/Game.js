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
import plantSpikeAtlasJson from "./assets/projectiles/plant-spike-atlas.json";
import plantSpikeAtlasPng from "./assets/projectiles/plant-spike-atlas.png";
import rockAtlasJson from "./assets/projectiles/rock-atlas.json";
import rockAtlasPng from "./assets/projectiles/rock-atlas.png";
import lightningAtlasJson from "./assets/projectiles/lightning-atlas.json";
import lightningAtlasPng from "./assets/projectiles/lightning-atlas.png";
import iceSpikeAtlasJson from "./assets/projectiles/ice-spike-atlas.json";
import iceSpikeAtlasPng from "./assets/projectiles/ice-spike-atlas.png";
import fireballAtlasJson from "./assets/projectiles/fireball-atlas.json";
import fireballAtlasPng from "./assets/projectiles/fireball-atlas.png";

// Status effects
import rootAtlasJson from "./assets/status-effects/root-atlas.json";
import rootAtlasPng from "./assets/status-effects/root-atlas.png";
import knockbackAtlasJson from "./assets/status-effects/knockback-atlas.json";
import knockbackAtlasPng from "./assets/status-effects/knockback-atlas.png";
import stunAtlasJson from "./assets/status-effects/stun-atlas.json";
import stunAtlasPng from "./assets/status-effects/stun-atlas.png";
import slowAtlasJson from "./assets/status-effects/slow-atlas.json";
import slowAtlasPng from "./assets/status-effects/slow-atlas.png";
import flameAtlasJson from "./assets/status-effects/flame-atlas.json";
import flameAtlasPng from "./assets/status-effects/flame-atlas.png";
import healAtlasJson from "./assets/status-effects/heal-atlas.json";
import healAtlasPng from "./assets/status-effects/heal-atlas.png";

// HUD container
import HUDScene from "./HUDScene";

function Game() {

  // Scene
  class MainScene extends Phaser.Scene {

    constructor() {
      super("MainScene");
      this.cursors = {};
      this.wasd = {};
    }

    preload() {
      
      // Loading tileset images and map
      this.load.image("floor-tileset", floorTilesetImg);
      this.load.image("nature-tileset", natureTilesetImg);
      this.load.tilemapTiledJSON("dungeon-test-1-map", dungeonTest1Map);

      // Loading the texture atlas for the player's sprite
      // First parameter: PNG, second parameter: JSON
      this.load.atlas("player-atlas", ninjaAtlasPng, ninjaAtlasJson);

      // Loading the projectile texture atlases
      this.load.atlas("shuriken-atlas", shurikenAtlasPng, shurikenAtlasJson);
      this.load.atlas("plant-spike-atlas", plantSpikeAtlasPng, plantSpikeAtlasJson);
      this.load.atlas("rock-atlas", rockAtlasPng, rockAtlasJson);
      this.load.atlas("lightning-atlas", lightningAtlasPng, lightningAtlasJson);
      this.load.atlas("ice-spike-atlas", iceSpikeAtlasPng, iceSpikeAtlasJson);
      this.load.atlas("fireball-atlas", fireballAtlasPng, fireballAtlasJson);

      // Loading the status effect atlases
      this.load.atlas("root-atlas", rootAtlasPng, rootAtlasJson);
      this.load.atlas("knockback-atlas", knockbackAtlasPng, knockbackAtlasJson);
      this.load.atlas("stun-atlas", stunAtlasPng, stunAtlasJson);
      this.load.atlas("slow-atlas", slowAtlasPng, slowAtlasJson);
      this.load.atlas("flame-atlas", flameAtlasPng, flameAtlasJson);
      this.load.atlas("heal-atlas", healAtlasPng, healAtlasJson);
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

      // Sets the player's ability cooldowns
      this.player.ability = {
        plant: {
          isOnCooldown: false,
          cooldownTimer: null,
        },
        rock: {
          isOnCooldown: false,
          cooldownTimer: null,
        },
        thunder: {
          isOnCooldown: false,
          cooldownTimer: null,
        },
        ice: {
          isOnCooldown: false,
          cooldownTimer: null,
        },
        flame: {
          isOnCooldown: false,
          cooldownTimer: null,
        },
        heal: {
          isOnCooldown: false,
          cooldownTimer: null,
        },        
      };

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

      // Root animation
      anims.create({
        key: "enemy-root",
        frames: anims.generateFrameNames("root-atlas", {
          prefix: "root.",
          start: 0,
          end: 7,
          zeroPad: 3,          
        }),
        frameRate: 15,
        repeat: -1,
      });

      // Temporary test enemy
      this.enemy = this.physics.add
        .sprite(200, 200, "player-atlas", "ninja-idle-front")
        .setImmovable(true);

      this.enemy.maxHealth = 100;
      this.enemy.currentHealth = 100;

      this.enemy.healthIndicator = this.add.text(this.enemy.x, this.enemy.y + 20,
        this.enemy.currentHealth, { font: "12px Courier", fill: "#000000" })

      this.enemy.updateHealthIndicator = () => {
        this.enemy.healthIndicator.x = this.enemy.x;
        this.enemy.healthIndicator.y = this.enemy.y - 18;
        this.enemy.healthIndicator.setText(this.enemy.currentHealth);
      };

      this.enemy.takeDamage = (damage) => {
        this.enemy.currentHealth -= damage;

        // Implement death logic below

      };

      this.enemy.followPlayer = (speed) => {
        this.physics.moveToObject(this.enemy, this.player, speed);
      };

      // Enemies are initialized with no status effects
      this.enemy.isRooted = false;

      // Adds hidden status effect for enemy
      this.enemy.rootAnim = this.physics.add
        .sprite(this.enemy.x, this.enemy.y, "root-atlas", "root.000")
        .setActive(false)
        .setVisible(false);

      // Adds test enemy to the group of enemies
      this.enemies = this.add.group();
      this.enemies.add(this.enemy);

      // Projectile groups
      this.shurikens = new ProjectileGroup(this, "shuriken-atlas", "shuriken.000", 3);
      this.plantSpikes = new ProjectileGroup(this, "plant-spike-atlas", "plant-spike.002", 4);
      this.rocks = new ProjectileGroup(this, "rock-atlas", "rock.000", 7);
      this.lightningBolts = new ProjectileGroup(this, "lightning-atlas", "lightning.003", 3);
      this.iceSpikes = new ProjectileGroup(this, "ice-spike-atlas", "ice-spike.007", 5);
      this.fireballs = new ProjectileGroup(this, "fireball-atlas", "fireball.001", 4);

      const abilityProjectileGroups = [
        this.shurikens, this.plantSpikes, this.rocks,
        this.lightningBolts, this.iceSpikes, this.fireballs
      ];

      abilityProjectileGroups.forEach((group) => {
        this.physics.add.collider(group, worldLayer, (obj1, obj2) => {

          // The projectile object involved in the collision
          const projectile = [obj1, obj2].find((obj) => obj instanceof Projectile);
          projectile.setActive(false);
          projectile.setVisible(false);    
          projectile.damageOnImpact = 0;
  
        });
      });

      // Shuriken collision with enemies
      this.physics.add.collider(this.shurikens, this.enemies, (obj1, obj2) => {

        console.log("Collision detected");

        // The shuriken is the Projectile object involved in the collision
        const shuriken = [obj1, obj2].find((obj) => obj instanceof Projectile);
        const enemy = [obj1, obj2].find((obj) => obj !== shuriken);

        enemy.takeDamage(shuriken.damageOnImpact);

        // After the projectile makes its first collision, it should not do damage
        // Damage on impact is reset when the projectile is fired again
        shuriken.damageOnImpact = 0;

        shuriken.setActive(false);
        shuriken.setVisible(false);


      });

      // Plant spike collision with enemies
      this.physics.add.collider(this.plantSpikes, this.enemies, (obj1, obj2) => {

        const plantSpike = [obj1, obj2].find((obj) => obj instanceof Projectile);
        plantSpike.setActive(false);
        plantSpike.setVisible(false);  

        const enemy = [obj1, obj2].find((obj) => obj !== plantSpike)

        // Root the enemy
        enemy.isRooted = true;
        enemy.rootAnim.setActive(true).setVisible(true);

        // The root lasts for 2 seconds
        this.time.delayedCall(2000, () => {
          enemy.isRooted = false;
          enemy.rootAnim.setActive(false).setVisible(false);
        })

      });      
      
      // Adds the ability keys
      this.keys = this.input.keyboard.addKeys({
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        one: Phaser.Input.Keyboard.KeyCodes.ONE,
        two: Phaser.Input.Keyboard.KeyCodes.TWO,
        three: Phaser.Input.Keyboard.KeyCodes.THREE,
        four: Phaser.Input.Keyboard.KeyCodes.FOUR,
        five: Phaser.Input.Keyboard.KeyCodes.FIVE,
        z: Phaser.Input.Keyboard.KeyCodes.Z,
      });

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

      // Updates the enemy's movement and health indicator
      this.enemy.followPlayer(20);
      this.enemy.updateHealthIndicator();

      // Plays an animation to reflect enemy root
      if (this.enemy.isRooted) {
        this.enemy.rootAnim.anims.play("enemy-root", true);
      }

      // Pressing the space key throws a shuriken
      if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
        this.shurikens.fireProjectile(this.player.x, this.player.y,
          this.player);
      }
      // Pressing the 1 key fires the root ability
      if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {

        if (!this.player.ability.plant.isOnCooldown) {
          this.plantSpikes.fireProjectile(this.player.x, this.player.y, 
            this.player);

          // The player's plant ability is now on cooldown
          this.player.ability.plant.isOnCooldown = true;

          // The player's ability cooldown lasts for 3 seconds
          this.player.ability.plant.cooldownTimer = this.time.delayedCall(
            3000, () => {
            this.player.ability.plant.isOnCooldown = false;
          })
        }

      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
        this.rocks.fireProjectile(this.player.x, this.player.y,
          this.player);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.three)) {
        this.lightningBolts.fireProjectile(this.player.x, this.player.y,
          this.player);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.four)) {
        this.iceSpikes.fireProjectile(this.player.x, this.player.y,
          this.player);
      }
      if (Phaser.Input.Keyboard.JustDown(this.keys.five)) {
        this.fireballs.fireProjectile(this.player.x, this.player.y,
          this.player);
      }

      // Update the HUD with player details
      this.events.emit("update-hud", this.player);
    }

  }

  // Configuration
  const config = {
    type: Phaser.WEBGL,
    parent: "game-container",
    width: 800,
    height: 600,
    scene: [ MainScene, HUDScene ],
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