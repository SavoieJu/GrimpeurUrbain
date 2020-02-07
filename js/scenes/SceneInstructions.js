//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Classe representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneInstructions extends Phaser.Scene {

  constructor() {
    super("SceneInstructions");

    this.btnRetour = null;

  }

  create() {

    //Arriere-plan bleu
    this.add.rectangle(0,0, game.config.width, game.config.height, 0x3c93f6).setOrigin(0);

    //affichage de la grille
    this.grille = new GrilleMontage(this, 5, 5, 0x00ff00);
    // this.grille.afficherGrille();

    //Titre du jeu
    this.titreImg = this.add.image(game.config.width / 2, 0, "titre");
    this.titreImg.setOrigin(0.5, 0.3);
    GrilleMontage.mettreEchelleLargeurJeu(this.titreImg, 0.95);
    this.grille.placerIndexCellule(2, this.titreImg);

		this.instructions = this.add.image(game.config.width / 2, 0, "instructions");
		this.titreImg.setOrigin(0.5);
    GrilleMontage.mettreEchelleLargeurJeu(this.instructions, 1);
    this.grille.placerIndexCellule(12, this.instructions);

    //Bouton Retour
    this.btnRetour = this.add.image(game.config.width / 2, 0, "boutons", 6);
    this.grille.placerIndexCellule(22, this.btnRetour);
    GrilleMontage.mettreEchelleLargeurJeu(this.btnRetour, 0.80);
    this.btnRetour.setInteractive();
    this.btnRetour.on("pointerdown", this.allerEcranIntro, this);
    this.btnRetour.on('pointerover', () => {
      this.btnRetour.setFrame(7);
    });
    this.btnRetour.on('pointerout', () => {
      this.btnRetour.setFrame(6);
    });
  }


  allerEcranIntro() {
    //Aller à l'écran d'Intro
    this.scene.start("SceneIntro");
  }
}
