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