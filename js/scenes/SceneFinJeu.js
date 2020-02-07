//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";

import {
	AnimScore
} from "../utils/AnimScore.js";


/**
 * Classe representant la scène de la fin du jeu comme tel
 * @extends Phaser.Scene
 */

export class SceneFinJeu extends Phaser.Scene {
    constructor() {
        super("SceneFinJeu");

      this.btnRejouer = null;
    }

    create() {
      //Arriere-plan bleu
      this.add.rectangle(0,0, game.config.width, game.config.height, 0x3c93f6).setOrigin(0);

      //affichage de la grille
      this.grille = new GrilleMontage(this, 5, 8, 0x00ff00);
      // this.grille.afficherGrille();





      //Vérification et enregistrement du meilleur score
      game.jeuGrimpeur.meilleurScore = Math.max(game.jeuGrimpeur.score, game.jeuGrimpeur.meilleurScore);
      localStorage.setItem(game.jeuGrimpeur.NOM_LOCAL_STORAGE, game.jeuGrimpeur.meilleurScore);

      //Mettre les textes des score/meilleurScore  - idéalement avec la fonte Rondalo...
      let tailleTexte = Math.round(64 * GrilleMontage.ajusterRatioX()),
          leStyle = {
              font: `bold ${tailleTexte}px Arial`,
              color: "#FFFFFF",
              align: "center"
          };

      // let leScoreTexteTexte = this.add.text(0, 0, "Votre score:", leStyle);
      let leScoreTexteTexte = new AnimScore(this, 123, 123, "Votre score:", leStyle);
      this.grille.placerIndexCellule(7, leScoreTexteTexte);
      leScoreTexteTexte.setFontFamily('Sigmar One');


      let leScoreTexte = this.add.text(0, 0, game.jeuGrimpeur.score.toString(), leStyle).setOrigin(0.5);
      this.grille.placerIndexCellule(12, leScoreTexte);
      leScoreTexte.setFontFamily('Sigmar One');

      let leStyleMeilleurScore = {
            font: `bold ${tailleTexte/1.5}px Arial`,
            color: "#FFFFFF",
            align: "center"
      };

      let leMeilleureScoreTexteTexte = this.add.text(0, 0, "Votre meilleur Score:", leStyleMeilleurScore).setOrigin(0.5);
      this.grille.placerIndexCellule(17, leMeilleureScoreTexteTexte);
      leMeilleureScoreTexteTexte.setFontFamily('Sigmar One');

      let leMeilleureScoreTexteScore = this.add.text(0, 0, game.jeuGrimpeur.meilleurScore.toString(), leStyle).setOrigin(0.5);
      this.grille.placerIndexCellule(22, leMeilleureScoreTexteScore);
      leMeilleureScoreTexteScore.setFontFamily('Sigmar One');

      //Bouton
      this.btnRejouer = this.add.image(game.config.width / 2, 0, "boutons", 4);
      this.grille.placerIndexCellule(32, this.btnRejouer);
      GrilleMontage.mettreEchelleLargeurJeu(this.btnRejouer, 0.80);
      this.btnRejouer.setInteractive();
      this.btnRejouer.on("pointerdown", this.rejouer, this);
      this.btnRejouer.on('pointerover', () => {
        this.btnRejouer.setFrame(5);
      });
      this.btnRejouer.on('pointerout', () => {
        this.btnRejouer.setFrame(4);
      });
    }

    rejouer() {
        //Recommencer le jeu.
        this.scene.start("SceneJeu");
    }

    /**
    * Vérifie l'orientation de l'écran et gère la pause ou non du jeu
    * @param {String} orientation Chaîne indiquant l'orientation actuelle de l'écran
    */
    verifierOrientation(orientation) {

    	if (orientation === Phaser.Scale.LANDSCAPE) {
    			//On ajuste le texte et on met le jeu en pause
    			this.consigneTxt.text = "S.V.P Mettre votre téléphone en mode portrait";
    			this.scene.pause(this);

    	} else if (orientation === Phaser.Scale.PORTRAIT) {
    			//On enlève le texte et on repart le jeu
    			this.consigneTxt.text = "";
    			this.scene.resume(this);
    	}
    }
}
