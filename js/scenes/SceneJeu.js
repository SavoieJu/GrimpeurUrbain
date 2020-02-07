//Importation des fichiers classes ou fichiers nécessaires
import {
	GrilleMontage
} from "../utils/GrilleMontage.js";



/**
 * Class representant la scène du jeu comme tel
 */

export class SceneJeu extends Phaser.Scene {

	constructor() {
		super("SceneJeu");

		this.blockBatimentRB = null; //Batiment Droite en bas
		this.blockBatimentRT = null; //Batiment Droite en haut
		this.blockBatimentLT = null; //Batiment Gauche en haut
		this.blockBatimentLB = null; //Batiment Gauche en bas

		this.score = 0;	//Le score

		this.bonhomme = null;	//Le bonhomme

		this.obstacle = null; //L'obstacle

		this.batiments = [this.blockBatimentLB, this.blockBatimentRB, this.blockBatimentRT, this.blockBatimentLT]; //Liste des batiment (Gauche en bas, Gauche en haut, Droite en bas, Droite en haut)

		this.scoreTxt; //Le texte du score

		this.coter = "droite"; //Le coter actuelle du joueur
		this.enAir = false;	//Si le joueur est en train de sauter d'un coter à l'autre
		this.prochainCoter = "droite"; //Le coter ou se dirige le bonhomme
		this.coterObstacle = null; //Le coter ou l'obstacle est présentement
		this.vitesse = 10; //Vitesse de déplacement horizontale du joueur

		this.bonhommeFrame = 1; //Le frame présentement utilisé par le bonhomme
		this.jeuGrimpeurAnimBonhommeInterval = null; //Contient setInterval pour pouvoir controler l'animation de course du bonhomme

		this.boutonPleinEcran = null; //Le bouton plein écran

		//Vérification d'un meilleur score antérieur enregistré
		game.jeuGrimpeur.meilleurScore = localStorage.getItem(game.jeuGrimpeur.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(game.jeuGrimpeur.NOM_LOCAL_STORAGE); //Prends les meilleurs score si il y en a.

	}

	/**
	*	Fonction create(), creer la grille de montage, appelle les fonction pour crer: les batiments, le bonhomme et l'obstacle
	*/
	create() {

		//Arriere-plan bleu
    this.add.rectangle(0,0, game.config.width, game.config.height, 0x3c93f6).setOrigin(0);

		this.grille = new GrilleMontage(this, 4, 1, 0x00ff00);
		//affichage de la grille
		// this.grille.afficherGrille();

		game.jeuGrimpeur.score = 0;
		this.coter = 'droite';
		this.prochainCoter = "droite";

		//affichage du batiment
		this.placerBatiment();
		this.placerObstacle();
		this.placerBonhomme();

		//Affichage du score
		let tailleTexte = Math.round(72 * GrilleMontage.ajusterRatioX());
		let leStyle = {
				font: `bold ${tailleTexte}px Arial`,
				fill: "#FFFFFF",
				align: "center"
		};

		this.scoreTxt = this.add.text(game.config.width/2, 60, game.jeuGrimpeur.score.toString(), leStyle);
		this.scoreTxt.setFontFamily('Sigmar One');
		this.scoreTxt.setOrigin(0.5);

		//Style de base pour le texte de consigne
		let style = {
				font: `bold ${Math.round(128 * GrilleMontage.ajusterRatioX())}px Arial`,
				color: "#FFFFFF",
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

		if (this.sys.game.device.os.desktop === true) { //Ordinateur de bureau

				//On peut gérer le mode FullScreen alors on affiche le bouton
				this.boutonPleinEcran = this.add.image(game.config.width, 0, "iconePleinEcran", 0);
				this.boutonPleinEcran.setOrigin(1.5, -0.5).setInteractive({
						useHandCursor: true
				});

				//Gestionnaire d'événement sur le bouton
				this.boutonPleinEcran.on("pointerup", this.mettreOuEnleverPleinEcran, this);

		} else { //Mobile
				//On gère l'orientation de l'écran
				//Vérification immédiate
				this.verifierOrientation(this.scale.orientation);
				//Vérification pendant le jeu selon les manipulations du joueur
				this.scale.on('orientationchange', this.verifierOrientation, this);
		}

	}

	/**
	*	Fonction placerBonhomme(), creer le bonhomme et le place dans la scene
	*/
	placerBonhomme() {
		this.bonhomme = this.add.image(1,1, "bonhomme");
		this.grille.placerIndexCellule(2, this.bonhomme);
		this.grille.mettreEchelleDimensionMaximale(this.bonhomme, 0.4);
		this.bonhomme.setOrigin(0.5, 1);
		this.bonhomme.x += this.grille.largeurColonne/2;
		this.bonhomme.y += 100;
		this.bonhomme.setInteractive();
		this.input.on('pointerdown', this.changerCoter, this);

		//Animé le bonhomme pour le faire courir
		this.jeuGrimpeurAnimBonhommeInterval = setInterval(()=> {
			if (this.bonhommeFrame == 1) {
				this.bonhomme.setFrame(0);
			} else {
				this.bonhomme.setFrame(1);
			}
			this.bonhommeFrame *= -1;
		}, 200);
	}

	/**
	*	Fonction placerObstacle(), creer l'obstacle et le place dans la scene
	*/
	placerObstacle() {
		let coterAleatoire = Math.floor(Math.random()*2)+1;
		this.obstacle = this.add.image(1, 1, "obstacle");

		//Si coterAleatoire est 1, on creer l'obstacle a gauche sinon a droite
		if (coterAleatoire === 1) {
			this.coterObstacle = "gauche";
			this.grille.placerIndexCellule(coterAleatoire, this.obstacle);
			this.grille.mettreEchelleDimensionMaximale(this.obstacle, 0.4);
			this.obstacle.setOrigin(0, 1);
			this.obstacle.x -= this.grille.largeurColonne/2;
		} else {
			this.coterObstacle = "droite";
			this.grille.placerIndexCellule(coterAleatoire, this.obstacle);
			this.grille.mettreEchelleDimensionMaximale(this.obstacle, 0.4);
			this.obstacle.x += this.grille.largeurColonne/2;
			this.obstacle.setOrigin(1, 1);
		}
		this.obstacle.y = 0;
	}

	/**
	*	Fonction placerBatiment(), creer les batiments et les places dans la scene
	*/
	placerBatiment() {
		//On place 4 batiment: 1 a gauche en bas, un a droite en bas, un en haut a gauche et un en haut a droit
		for (let i = 0; i < this.batiments.length; i++) {
			this.batiments[i] = this.add.image(1, 1, "batiment");
			if (i == 0) {
				this.grille.placerIndexCellule(0, this.batiments[i]);
				this.batiments[i].y += game.config.height*2;

			}
			if (i == 1) {
				this.grille.placerIndexCellule(3, this.batiments[i]);
				this.batiments[i].y += game.config.height*2;
				this.batiments[i].setFlipX(true);
			}
			if (i == 2) {
				this.grille.placerIndexCellule(0, this.batiments[i]);
				this.batiments[i].y += game.config.height/2;

			}
			if (i == 3) {
				this.grille.placerIndexCellule(3, this.batiments[i]);
				this.batiments[i].y += game.config.height/2;
				this.batiments[i].setFlipX(true);
			}
			this.grille.mettreEchelleDimensionMaximale(this.batiments[i], 1);
			GrilleMontage.mettreEchelleHauteurJeu(this.batiments[i]);
			this.batiments[i].setOrigin(0.5, 1);
		}
	}

	/**
	*	Fonction update(), s'apelle a chaque frame, gère la vitesse de deplacement verticales des objets dans la scene, gère aussi le coter et déplacement du bonhomme.
	*/
	update() {
		let vitesse = 3;
		this.obstacle.y += vitesse*4;

		// Pour chaque batiment, a chaque frame, on ajoute vitesse à leurs valeur y, pour les deplacers
		for (let i = 0; i < this.batiments.length; i++) {
			this.batiments[i].y += vitesse;
			//Si leur valeur y dépasse les limites de l'écran verticalement, on réinitialise sa valeur y a 0
			if (this.batiments[i].y > game.config.height*2) {
				this.batiments[i].y = 0;
			}
		}

		//Si le prochain coter est différent du cauter actuelle, on doit bouger le bonhomme vers le prochain coter
		if (this.prochainCoter != this.coter) {
			this.bonhomme.x += this.vitesse;
			//Si le bonhomme est a la position voulue (1 cellule de large) on change son coter actulle, sa vitesse son origin et il n'est plus en l'air
			if (this.bonhomme.x <= this.grille.largeurColonne) {
				this.coter = "gauche";
				// this.bonhomme.setOrigin(0, 1);
				this.vitesse = 0;
				this.enAir = false;
			}
			//Si le bonhomme est a la position voulue (3 cellule de large) on change son coter actulle, sa vitesse son origin et il n'est plus en l'air
			if (this.bonhomme.x == this.grille.largeurColonne*3) {
				this.coter = "droite";
				// this.bonhomme.setOrigin(1, 1);
				this.vitesse = 0;
				this.enAir = false;
			}
		}

		// si le bonhomme change de coter, pendant qu'il est dans les airs, on change sont frame pour celui ou il saute, et on flip le bonhomme pour
		//qu'il pointe du bon coter
		if (this.enAir == true) {
			this.bonhomme.setFrame(2);
			if (this.prochainCoter == "gauche") {
				this.bonhomme.setFlipX(true);
			} else {
				this.bonhomme.setFlipX(false);
			}
		} else {
			this.jeuGrimpeurAnimBonhommeInterval;
		}

		//Si l'obstacle sort des limites de l'écran verticalement, on reset sa position verticale
		if (this.obstacle.y > game.config.height+50) {
			this.resetPositionObstacle();
		}

		this.checkCollision();
	}

	/**
	*	Fonction resetPositionObstacle(), réinitialise, ajoute 1 au score et détruit l'objet lorsqu'il dépasse les limites de l'écran verticalement, ensuite, il appelle la fonction pour creer un nouveau obstacle
	*/
	resetPositionObstacle() {
		this.obstacle.destroy()
		this.obstacle = null;
		game.jeuGrimpeur.score++;
		this.scoreTxt.text = game.jeuGrimpeur.score.toString();
		this.placerObstacle();
	}

	/**
	*	Fonction checkCollision(), lorsqu'il y a une "collision" entre le bonhomme et l'obstacle, on reset le jeu.
	*/
	checkCollision() {
		//Si l'obstacle est a la meme heuteur et coter que le bonhomme, il y a une collision, donc on fini le jeu, et
		if ((this.coterObstacle == this.coter && (this.obstacle.y <= (this.bonhomme.y+this.bonhomme.height/2) && this.obstacle.y >= (this.bonhomme.y-this.bonhomme.height/2))) && this.enAir == false) {
			console.log("Il y a eu une collision, donc on envoie le joueur à la scene de fin de jeu");
			// this.score = 0; // Lorsque on envoyerais le joueur a la scene findejeu, on ne mettra pas le score a 0, sinon on perdrait son score...
			clearInterval(this.jeuGrimpeurAnimBonhommeInterval);
			this.scene.start("SceneFinJeu");
		}
	}

	/**
	*	Fonction changerCoter(), lorsque l'utilisateur clique sur le bonhomme, on change la valeur du prochain coter, et change la vitesse horizontale du bonhomme en fonction de la direction
	*/
	changerCoter() {
		//Si son coter est droite, on mais son prochain coter a gauche et vitesse négative pour aller a gauche, il est en l'air sinon, son prochain coter est a droite, et sa vitesse positive pour aller a droite
		if (this.coter === "droite") {
			this.prochainCoter = "gauche";
			this.vitesse = -10;
			this.enAir = true;
			this.bonhomme.setFlipX(true);
		} else {
			this.prochainCoter = "droite";
			this.vitesse = 10;
			this.enAir = true;
			this.bonhomme.setFlipX(false);
		}
	}




/**
* Gère le mode plein-écran
* @param {Phaser.Pointer} pointeur pointeur
*/
mettreOuEnleverPleinEcran(pointeur) {
	//Si on n'est pas en mode plein écran on le met, sinon on l'enlève
	//tout en gérant l'aspect du bouton
	if (!this.scale.isFullscreen) {
			this.scale.startFullscreen();
			this.boutonPleinEcran.setFrame(1);
	} else {
			this.scale.stopFullscreen();
			this.boutonPleinEcran.setFrame(0);
	}
}

/**
* gère l'orientation et pause le jeu
* @param {String} orientation orientation
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
