//Importation des fichiers classes ou fichiers nécessaires
import {
    GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Classe representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneIntro extends Phaser.Scene {

  constructor() {
    super("SceneIntro");

    this.imgFond = null;
    this.titreImg = null;
    this.btnInstructions = null;
    this.btnJouer = null;
    this.nuage = null;


  }

  create() {
    //Arriere-plan bleu
    this.add.rectangle(0,0, game.config.width, game.config.height, 0x3c93f6).setOrigin(0);

    //affichage de la grille
    this.grille = new GrilleMontage(this, 5, 8, 0x00ff00);
    // this.grille.afficherGrille();

    //Image de fond
    this.imgFond = this.add.image(game.config.width / 2, 0, "background")
    GrilleMontage.alignerCoinInferieurGauche(this.imgFond);
    GrilleMontage.mettreEchelleLargeurJeu(this.imgFond);

    //Nuages
    this.creerNuage();

    //Titre du jeu
    this.titreImg = this.add.image(game.config.width / 2, 0, "titre");
    this.titreImg.setOrigin(0.5, 0.5);
    GrilleMontage.mettreEchelleLargeurJeu(this.titreImg, 0.95);
    this.grille.placerIndexCellule(7, this.titreImg);

    //Boutons
    this.btnInstructions = this.add.image(game.config.width / 2, 0, "boutons", 0);
    this.grille.placerIndexCellule(22, this.btnInstructions);
    GrilleMontage.mettreEchelleLargeurJeu(this.btnInstructions, 0.80);
    this.btnInstructions.setInteractive();
    this.btnInstructions.on("pointerdown", this.allerEcranInstructions, this);
    this.btnInstructions.on('pointerover', () => {
      this.btnInstructions.setFrame(1);
    });
    this.btnInstructions.on('pointerout', () => {
      this.btnInstructions.setFrame(0);
    });

    this.btnJouer = this.add.image(game.config.width / 2, 0, "boutons", 2);
    this.grille.placerIndexCellule(32, this.btnJouer);
    GrilleMontage.mettreEchelleLargeurJeu(this.btnJouer, 0.80);
    this.btnJouer.setInteractive();
    this.btnJouer.on("pointerdown", this.allerEcranJeu, this);
    this.btnJouer.on('pointerover', () => {
      this.btnJouer.setFrame(3);
    });
    this.btnJouer.on('pointerout', () => {
      this.btnJouer.setFrame(2);
    });

    //Style de base pour le texte de consigne
		let style = {
				font: `bold ${Math.round(128 * GrilleMontage.ajusterRatioX())}px Arial`,
				color: "#000000",
				align: "center",
				wordWrap: {
						width: game.config.width * 0.9
				}
		}

		//Texte pour la consigne pour l'orientation de l'écran
		this.consigneTxt = this.add.text(game.config.width / 2, game.config.height, "", style);
		this.consigneTxt.setOrigin(0.5, 1);
		this.consigneTxt.setFontSize(Math.round(64 * GrilleMontage.ajusterRatioX()));
		this.consigneTxt.setFontFamily('Sigmar One');

    if (this.sys.game.device.os.desktop != true) { //Ordinateur de bureau
      //On gère l'orientation de l'écran
      //Vérification immédiate
      this.verifierOrientation(this.scale.orientation);
      //Vérification pendant le jeu selon les manipulations du joueur
      this.scale.on('orientationchange', this.verifierOrientation, this);
    }

  }

  update() {
    this.deplacerNuage();
  }

  /**
  * Creer un nuage
  */
  creerNuage() {
    this.nuage = this.add.image(game.config.width / 2, 0, "nuages", this.frameAleatoire())
    this.nuage.setOrigin(1, 0.5);
    this.grille.placerIndexCellule(this.indexCelluleAleatoire(), this.nuage);
    this.nuage.x -= this.nuage.width;
  }

  /**
  * Deplace les nuage creer, les détruit et creer un nouveau nuage lorsque
  * le nuage dépace la largeur du canvas
  */
  deplacerNuage() {
    let vitesse = 2;
    this.nuage.x += vitesse;
    if (this.nuage.x > game.config.width+this.nuage.width) {
      this.nuage.destroy();
      this.creerNuage();
    }
  }

  /**
  * Retourne soit 0, 5 ou 10
  * Ici les chiffre représente un indexCellule aléatoire
  * @return integer
  */
  indexCelluleAleatoire() {
    return Phaser.Math.RND.between(0,2)*5
  }

  /**
  * Retourne un chiffre entre 0 et 4
  * Ici les chiffre représente un frame aléatoire lors de la création d'un nuage
  * @return integer
  */
  frameAleatoire() {
    return Phaser.Math.RND.between(0,4);
  }

  allerEcranJeu() {
    //Aller à l'écran de jeu
    this.scene.start("SceneJeu");
  }

  allerEcranInstructions() {
    //Aller à l'écran de jeu
    this.scene.start("SceneInstructions");
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
