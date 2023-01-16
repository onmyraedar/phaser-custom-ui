import Phaser from "phaser";

import { invoke } from "@forge/bridge";

import titleBackgroundImg from "./assets/title/TitleBackground.png";
import startHoverImg from "./assets/title/StartHover.png";
import startNeutralImg from "./assets/title/StartNeutral.png";

export default class TitleScene extends Phaser.Scene {

  constructor() {
    super("TitleScene");
    this.projects = [];
  }

  async loadRecentJiraProjects() {
    invoke("getRecentProjects", { expand: "urls" }).then(({ data }) => {
      console.log("Project data received!");
      data.values.forEach((project) => {
        this.projects[project.key] = {
          name: project.name,
          id: project.id,
        };
      });
      console.log(this.projects);
    });
  }

  async loadProjectIssues() {
    invoke("getIssuesByProject", { project: "DU2" }).then(({ data }) => {
      console.log("Issue data received!");
      console.log(data);
    });
  }

  preload() {
    this.load.image("title-background", titleBackgroundImg);
    this.load.image("start-hover", startHoverImg);
    this.load.image("start-neutral", startNeutralImg);
  }

  create() {
    const titleBackground = this.add.image(0, 0, "title-background")
      .setOrigin(0, 0);
    
    const startHover = this.add.image(300, 350, "start-hover")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerout", () => {
        startHover.setActive(false).setVisible(false);
        startNeutral.setActive(true).setVisible(true);
      })
      .on("pointerdown", () => {
        this.scene.start("MainScene").launch("HUDScene");
      })
      .setActive(false).setVisible(false);

    const startNeutral = this.add.image(300, 350, "start-neutral")
      .setOrigin(0, 0)
      .setInteractive()
      .on("pointerover", () => {
        startNeutral.setActive(false).setVisible(false);
        startHover.setActive(true).setVisible(true);
      });

    // Loading Jira projects via Forge API
    this.loadRecentJiraProjects();

    this.loadProjectIssues();
  }

}