/**
 * Classe representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {

	constructor() {
		super("SceneChargement");
	}

	preload() {
		//Charger l'image du jeu
		//URL de base
		this.load.setPath("medias/img/");

		//Chargement d'images
		this.load.image("batiment");
		this.load.image("obstacle");
		this.load.image("titre");
		this.load.image("background");
		this.load.image("instructions");

		//La feuille de sprite du bonhomme
		this.load.spritesheet("bonhomme", "bonhomme.png", { frameWidth:128, frameHeight: 128 });
		this.load.spritesheet("boutons", "boutons-sprite.png", { frameWidth:512, frameHeight: 128 });
		this.load.spritesheet("nuages", "nuages-sprite.png", { frameWidth:128, frameHeight: 128 });
		this.load.spritesheet("iconePleinEcran", "iconePleinEcran.png", {frameWidth: 64, frameHeight: 64});
	}

	create() {
		this.scene.start("SceneIntro");
	}
}
