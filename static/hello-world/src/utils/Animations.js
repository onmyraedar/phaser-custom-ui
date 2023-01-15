export const createPlayerMovementAnims = (anims) => {
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
}

export const createStatusEffectAnims = (anims) => {
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

  // Knockback animation
  anims.create({
    key: "enemy-knockback",
    frames: anims.generateFrameNames("knockback-atlas", {
      prefix: "knockback.",
      start: 0,
      end: 12,
      zeroPad: 3,          
    }),
    frameRate: 15,
    repeat: -1,
  });

  // Stun animation
  anims.create({
    key: "enemy-stun",
    frames: anims.generateFrameNames("stun-atlas", {
      prefix: "stun.",
      start: 0,
      end: 7,
      zeroPad: 3,          
    }),
    frameRate: 15,
    repeat: -1,
  });

  // Slow animation
  anims.create({
    key: "enemy-slow",
    frames: anims.generateFrameNames("slow-atlas", {
      prefix: "slow.",
      start: 0,
      end: 9,
      zeroPad: 3,          
    }),
    frameRate: 15,
    repeat: -1,        
  });

  // Flame animation
  anims.create({
    key: "enemy-on-fire",
    frames: anims.generateFrameNames("flame-atlas", {
      prefix: "flame.",
      start: 0,
      end: 4,
      zeroPad: 3,          
    }),
    frameRate: 15,
    repeat: -1,    
  });

  // Healing animation
  anims.create({
    key: "heal",
    frames: anims.generateFrameNames("heal-atlas", {
      prefix: "heal.",
      start: 0,
      end: 5,
      zeroPad: 3,          
    }),
    frameRate: 24,
    repeat: 0,
  });
}

// Initializes the sprite that will play an animation when a
// character undergoes a status effect
// This function is called during character creation
export const initializeAnimationSprites = (scene, character) => {

  // Initialize the character with all status effects set to false
  character.isRooted = false;
  character.isInKnockback = false;
  character.isStunned = false;
  character.isSlowed = false;
  character.isOnFire = false;

  // Adds hidden status effect sprites
  character.rootAnim = scene.physics.add
    .sprite(character.x, character.y, "root-atlas", "root.000")
    .setActive(false)
    .setVisible(false);
  character.knockbackAnim = scene.physics.add
    .sprite(character.x, character.y, "knockback-atlas", "knockback.000")
    .setActive(false)
    .setVisible(false);
  character.stunAnim = scene.physics.add
    .sprite(character.x, character.y, "stun-atlas", "stun.000")
    .setActive(false)
    .setVisible(false);
  character.slowAnim = scene.physics.add
    .sprite(character.x, character.y, "slow-atlas", "slow.000")
    .setActive(false)
    .setVisible(false);
  character.onFireAnim = scene.physics.add
    .sprite(character.x, character.y, "flame-atlas", "flame.000")
    .setActive(false)
    .setVisible(false);

};

// Used to play status effect animations for both the player and the enemy
export const playStatusEffectAnims = (character) => {

  // Determines which animation to play
  if (character.isRooted) {
    character.rootAnim.x = character.x;
    character.rootAnim.y = character.y;
    character.rootAnim.anims.play("enemy-root", true);
  }
  if (character.isInKnockback) {
    character.knockbackAnim.x = character.x;
    character.knockbackAnim.y = character.y;
    character.knockbackAnim.anims.play("enemy-knockback", true);
  }
  if (character.isStunned) {
    character.stunAnim.x = character.x;
    character.stunAnim.y = character.y;
    character.stunAnim.anims.play("enemy-stun", true);
  }
  if (character.isSlowed) {
    character.slowAnim.x = character.x;
    character.slowAnim.y = character.y;
    character.slowAnim.anims.play("enemy-slow", true);
  }
  if (character.isOnFire) {
    character.onFireAnim.x = character.x;
    character.onFireAnim.y = character.y;
    character.onFireAnim.anims.play("enemy-on-fire", true);
  }

};