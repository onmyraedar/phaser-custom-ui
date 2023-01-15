import Phaser from "phaser";
import ProjectileGroup, { Projectile } from "./ProjectileGroup";

const configurePlantAbility = (scene, enemy) => {

  const plantAbility = enemy.ability.plant;
  plantAbility.unlocked = true;

    // Set up necessary projectile group
    plantAbility.projectiles = new ProjectileGroup(scene, "plant-spike-atlas", "plant-spike.002", 4);

    // Set up collider with player
    scene.physics.add.collider(plantAbility.projectiles, scene.player, (obj1, obj2) => {
  
      const plantSpike = [obj1, obj2].find((obj) => obj instanceof Projectile);
      const player = [obj1, obj2].find((obj) => obj !== plantSpike);
  
      if (plantSpike.damageOnImpact > 0) {
        player.takeDamage(plantSpike.damageOnImpact);
        
        // Root the player
        scene.player.isRooted = true;
        scene.player.rootAnim.setActive(true).setVisible(true);
  
        // The root lasts for 3 seconds
        scene.time.delayedCall(3000, () => {
          scene.player.isRooted = false;
          scene.player.rootAnim.setActive(false).setVisible(false);
        });
        
        // No damage after first hit
        plantSpike.damageOnImpact = 0;
  
        plantSpike.setActive(false);
        plantSpike.setVisible(false); 
      } 
  
    }); 

}

const configureRockAbility = (scene, enemy) => {

  const rockAbility = enemy.ability.rock;
  rockAbility.unlocked = true;

}

const configureThunderAbility = (scene, enemy) => {

  const thunderAbility = enemy.ability.thunder;
  thunderAbility.unlocked = true;

    // Set up necessary projectile group
    thunderAbility.projectiles = new ProjectileGroup(scene, "lightning-atlas", "lightning.003", 4);

    // Set up collider with player
    scene.physics.add.collider(thunderAbility.projectiles, scene.player, (obj1, obj2) => {
  
      const lightningBolt = [obj1, obj2].find((obj) => obj instanceof Projectile);
      const player = [obj1, obj2].find((obj) => obj !== lightningBolt);
  
      if (lightningBolt.damageOnImpact > 0) {
        player.takeDamage(lightningBolt.damageOnImpact);
        
        // Stun the player
        scene.player.isStunned = true;
        scene.player.stunAnim.setActive(true).setVisible(true);
  
        // The stun lasts for 2 seconds
        scene.time.delayedCall(2000, () => {
          scene.player.isStunned = false;
          scene.player.stunAnim.setActive(false).setVisible(false);
        });
        
        // No damage after first hit
        lightningBolt.damageOnImpact = 0;
  
        lightningBolt.setActive(false);
        lightningBolt.setVisible(false); 
      } 
  
    }); 

}

const configureIceAbility = (scene, enemy) => {

  const iceAbility = enemy.ability.ice;
  iceAbility.unlocked = true;

  // Set up necessary projectile group
  iceAbility.projectiles = new ProjectileGroup(scene, "ice-spike-atlas", "ice-spike.007", 5);

  // Set up collider with player
  scene.physics.add.collider(iceAbility.projectiles, scene.player, (obj1, obj2) => {

    const iceSpike = [obj1, obj2].find((obj) => obj instanceof Projectile);
    const player = [obj1, obj2].find((obj) => obj !== iceSpike);

    if (iceSpike.damageOnImpact > 0) {
      player.takeDamage(iceSpike.damageOnImpact);
      
      // Slow the player
      scene.player.isSlowed = true;
      scene.player.slowAnim.setActive(true).setVisible(true);

      // The slow lasts for 4 seconds
      scene.time.delayedCall(4000, () => {
        scene.player.isSlowed = false;
        scene.player.slowAnim.setActive(false).setVisible(false);
      });
      
      // No damage after first hit
      iceSpike.damageOnImpact = 0;

      iceSpike.setActive(false);
      iceSpike.setVisible(false); 
    } 

  }); 

}

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
      scene.player.isOnFire = true;
      scene.player.onFireAnim.setActive(true).setVisible(true);

      // After initial damage, 1 damage per second for 3 seconds
      scene.time.delayedCall(1000, () => {
        player.takeDamage(1);
      });
      scene.time.delayedCall(2000, () => {
        player.takeDamage(1);
      });
      scene.time.delayedCall(3000, () => {
        player.takeDamage(1);
        scene.player.isOnFire = false;
        scene.player.onFireAnim.setActive(false).setVisible(false);
      });
      
      // No damage after first hit
      fireball.damageOnImpact = 0;

      fireball.setActive(false);
      fireball.setVisible(false); 
    } 

  }); 

}

const configureHealAbility = (scene, enemy) => {

  const healAbility = enemy.ability.heal;
  healAbility.unlocked = true;

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
      configurePlantAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.plant.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.plant);

    } else if (ability === "rock") {
      configureRockAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.rock.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.rock);

    } else if (ability === "thunder") {
      configureThunderAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.thunder.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.thunder);

    } else if (ability === "ice") {
      configureIceAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.ice.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.ice);

    } else if (ability === "fire") {
      configureFireAbility(scene, enemy);
      abilityProjectileGroups.push(enemy.ability.fire.projectiles);
      enemy.unlockedAbilityList.push(enemy.ability.fire);

    // No enemies have healing abilities for now 
    } else if (ability === "heal") {
      configureHealAbility(scene, enemy);
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

  // First, check if there are any available abilities
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