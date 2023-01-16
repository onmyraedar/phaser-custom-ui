import Phaser from "phaser";

import { invoke } from "@forge/bridge";

import adventureSelectBackgroundImg from "./assets/adventure-selection/AdventureSelectionBackground.png";
import startHoverImg from "./assets/title/StartHover.png";
import startNeutralImg from "./assets/title/StartNeutral.png";

export default class AdventureSelectionScene extends Phaser.Scene {

  constructor() {
    super("AdventureSelectionScene");
    this.issues = [];
  }

  init(data) {
    console.log("init data");
    console.log(data);
    this.projects = data.projects;
  }

  async loadProjectIssues(projectKey) {
    invoke("getIssuesByProject", { project: projectKey }).then(({ data }) => {
      console.log("Issue data received!");
      console.log(data);
      data.issues.forEach((issue) => {
        this.issues.push({
          hierarchyLevel: issue.fields.issuetype.hierarchyLevel,
          typeName: issue.fields.issuetype.name,
          created: issue.fields.created,
        });
      });
      this.load.start();
    });

    this.load.on("complete", () => {
      
      const startHover = this.add.image(300, 350, "start-hover")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerout", () => {
        startHover.setActive(false).setVisible(false);
        startNeutral.setActive(true).setVisible(true);
      })
      .on("pointerdown", () => {
        this.scene.start("MainScene", { issueData: this.issues }).launch("HUDScene");
      })
      .setActive(false).setVisible(false);

      const startNeutral = this.add.image(300, 350, "start-neutral")
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerover", () => {
          startNeutral.setActive(false).setVisible(false);
          startHover.setActive(true).setVisible(true);
        });
    });
  }

  preload() {
    this.load.image("adventure-selection-background", adventureSelectBackgroundImg);
    this.load.image("start-hover", startHoverImg);
    this.load.image("start-neutral", startNeutralImg);
  }

  create() {
    const adventureSelectionBackground = this.add.image(0, 0, "adventure-selection-background")
      .setOrigin(0, 0);

    const instructionsText = this.add.text(300, 150, "Select your adventure: ",
      { font: "30px Courier", fill: "#FFFFFF" });

    this.projects.forEach((project) => {
      const projectText = this.add.text(300, 250, project.name,
      { font: "30px Courier", fill: "#FFFFFF" })
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerdown", () => {
          projectText.setColor("#ed4ce8");
          this.loadProjectIssues(project.key);
        });
    })
  }

}