import Phaser from "phaser";
import ProjectileGroup, { Projectile } from "./ProjectileGroup";

const configureFireAbility = (scene, enemy) => {

  const fireAbility = enemy.ability.fire;

  // Unlock the ability 
  fireAbility.unlocked = true;

  // Set up necessary projectile group
  fireAbility.projectiles = new ProjectileGroup(scene, "fireball-atlas", "fireball.001", 4)

  // Set up collider with player
  scene.physics.add.collider(fireAbility.projectiles, scene.player, (obj1, obj2) => {

    const fireball = [obj1, obj2].find((obj) => obj instanceof Projectile);
    const player = [obj1, obj2].find((obj) => obj !== fireball);

    if (fireball.damageOnImpact > 0) {
      player.takeDamage(fireball.damageOnImpact);
      
      // Set the player on fire
      // enemy.isOnFire = true;
      // enemy.onFireAnim.setActive(true).setVisible(true);

      // After initial damage, 1 damage per second for 3 seconds
      scene.time.delayedCall(1000, () => {
        player.takeDamage(1);
      });
      scene.time.delayedCall(2000, () => {
        player.takeDamage(1);
      });
      scene.time.delayedCall(3000, () => {
        player.takeDamage(1);
        // enemy.isOnFire = false;
        // enemy.onFireAnim.setActive(false).setVisible(false);
      });
      
      // No damage after first hit
      fireball.damageOnImpact = 0;

      fireball.setActive(false);
      fireball.setVisible(false); 
    } 

  }); 

}

export const configureAbilities = (scene, enemy, unlockedAbilities) => {

  // Initializes a JS object to hold ability data 
  // By default, no enemy abilities are unlocked
  enemy.ability = {
    plant: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 5000,
      projectiles: null,
    },
    rock: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 5000, 
      projectiles: null,
    },
    thunder: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 6000,
      projectiles: null,
    },
    ice: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 6000,
      projectiles: null,
    },
    fire: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 8000,
      projectiles: null,
    },
    heal: {
      unlocked: false,
      isOnCooldown: false,
      cooldownTimer: null,
      cooldown: 4000,
      projectiles: null,
    },        
  };

  // Initializes an array of unlocked abilities
  // We will need this to iterate through enemy abilities to determine 
  // which ones to fire
  enemy.unlockedAbilityList = [];

  // Initializes an empty array for projectile groups
  const abilityProjectileGroups = [];

  // Allow the enemy to use the abilities in the unlocked array
  unlockedAbilities.forEach((ability) => {
    if (ability === "plant") {
      enemy.ability.plant.unlocked = true;

    } else if (ability === "rock") {
      enemy.ability.rock.unlocked = true;

    } else if (ability === "thunder") {
      enemy.ability.thunder.unlocked = true;

    } else if (ability === "ice") {
      enemy.ability.ice.unlocked = true;

    } else if (ability === "fire") {
      configureFireAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.fire.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.fire);

    } else if (ability === "heal") {
      enemy.ability.heal.unlocked = true;
    }
  });

  // Set up group projectile collider with world layer
  abilityProjectileGroups.forEach((group) => {
    scene.physics.add.collider(group, scene.worldLayer, (obj1, obj2) => {

      // The projectile object involved in the collision
      const projectile = [obj1, obj2].find((obj) => obj instanceof Projectile);
      projectile.setActive(false);
      projectile.setVisible(false);    
      projectile.damageOnImpact = 0;

    });
  });
}

export const fireIfAvailable = (scene, enemy) => {

  // Only abilities that are not on cooldown are available
  const availableAbilities = enemy.unlockedAbilityList.filter((ability) => {
    return !ability.isOnCooldown;
  });

  // If there are any available abilities
  if (availableAbilities.length > 0) {

    // Randomly select an available ability
    const randIndex = Math.floor(Math.random() * availableAbilities.length);
    const selectedAbility = availableAbilities[randIndex];

    selectedAbility.projectiles.fireProjectile(enemy.x, enemy.y, 
      enemy);

    console.log("Fire triggered");  

    // Set the used ability on CD
    selectedAbility.isOnCooldown = true;

    // After cooldown is over, reactivate the ability
    selectedAbility.cooldownTimer = scene.time.delayedCall(
      selectedAbility.cooldown, () => {
        selectedAbility.isOnCooldown = false;
    });

  }

}