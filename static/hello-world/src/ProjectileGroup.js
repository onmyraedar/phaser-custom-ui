import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, "shuriken-atlas", "shuriken.000");
    this.defaultDamage = 0;
    this.damageOnImpact = 0;
  }

  fire (x, y, wielder, scene) {

    // Resets the projectile damage
    this.damageOnImpact = this.defaultDamage;

    // Places the projectile at a specific x, y position
    this.body.reset(x, y);

    this.setActive(true);

    // Invisible objects skip rendering, but update logic is still processed
    this.setVisible(true);

    const speed = 250;

    // This clause controls player firing
    if (wielder.hasOwnProperty('lastIdleDirection')) {

      const wielderVelocity = wielder.body.velocity;
      const wielderLastIdleDirection = wielder.lastIdleDirection;
  
      // If the wielder is not moving, get their last idle direction
      // and make the projectile move in the same direction
      if (wielderVelocity.x == 0 && wielderVelocity.y == 0) {
        switch (wielderLastIdleDirection) {
          case "left":
            this.setVelocity(-speed, 0);
            break;
          case "right":
            this.setVelocity(speed, 0);
            break;
          case "back":
            this.setVelocity(0, -speed);
            break;
          case "front":
            this.setVelocity(0, speed);
            break;
        }
  
      // If the wielder is moving, we can make the projectile move 
      // in the same direction as the wielder
      } else {
        if (wielderVelocity.x > 0) {
          this.setVelocityX(speed);
        } else if (wielderVelocity.x < 0) {
          this.setVelocityX(-speed);
        } else {
          this.setVelocityX(0);
        }
  
        if (wielderVelocity.y > 0) {
          this.setVelocityY(speed);
        } else if (wielderVelocity.y < 0) {
          this.setVelocityY(-speed);
        } else {
          this.setVelocityY(0);
        }
  
      }
  
      this.body.velocity.normalize().scale(speed);

    // This clause controls enemy firing 
    } else {

      // Compute the angle between enemy and player
      const firingAngleRad = Phaser.Math.Angle.Between(wielder.x, wielder.y,
        scene.player.x, scene.player.y);

      const firingAngleDeg = Phaser.Math.RadToDeg(firingAngleRad);
      
      // Compute the velocity of the projectile given its firing angle and speed
      const projectileVelocity = scene.physics.velocityFromAngle(firingAngleDeg, speed);

      console.log(projectileVelocity);

      // Set the velocity of the projectile
      this.setVelocityX(projectileVelocity.x);
      this.setVelocityY(projectileVelocity.y);

    }

  }

}

export default class ProjectileGroup extends Phaser.Physics.Arcade.Group {
  
  constructor(scene, projectileTexture, projectileFrame, defaultDamage) {
    super(scene.physics.world, scene);

    this.createMultiple({
      classType: Projectile,
      frameQuantity: 10,
      active: false,
      visible: false,
      key: projectileTexture,   // texture key of each new Game Object
      frame: projectileFrame,   // texture frame of each new Game Object
    });

    this.getChildren().forEach((projectile) => {
      projectile.setTexture(projectileTexture, projectileFrame);
      projectile.defaultDamage = defaultDamage;
    }, this);

    this.scene = scene;

  }

  fireProjectile(x, y, wielder) {

    // Gets the first projectile that is ready to be fired
    const projectile = this.getFirstDead(false);
    if (projectile) {
      projectile.fire(x, y, wielder, this.scene);
    }
    
  }

}