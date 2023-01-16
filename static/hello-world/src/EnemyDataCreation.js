import Phaser from "phaser";

export const parseIssueData = (issueData, emptyTiles) => {

  console.log(emptyTiles);

  const possibleAbilities = ["plant", "rock", "thunder", "ice", "fire"];
  const enemiesData = [];

  issueData.forEach((issue) => {
    const randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);

    const randIndex = Math.floor(Math.random() * possibleAbilities.length);
    const selectedAbility = possibleAbilities[randIndex];

    enemiesData.push({
        startingX: randomTile.pixelX, 
        startingY: randomTile.pixelY,
        texture: "player-atlas",
        frame: "ninja-idle-front",
        abilities: [selectedAbility],
      });
  })
  return enemiesData;
}