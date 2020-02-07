/**
 * Classe  AnimScore
 * pour le cours 582-448-MA
 * @author Julien Savoie
 * @version 2019-05-30
 */

export class AnimScore extends Phaser.GameObjects.Text {


	/**
	 * @constructor
	 * @param {object Phaser.Scene} scene Scène où l'on fait de la mise en page
	 */
	constructor(scene, posX, posY, texte = "", style = null) {
		if ((scene instanceof Phaser.Scene) != true) {
			console.log("Attention - il n'y a pas de scène! Le texte ne peut pas être instanciée...");
			//On sort donc du constructeur
			return;
		}

		//Passer les infos aux constructeur de la classe-mère
		super(scene, posX, posY, texte, style);

		//Enregistrer la référence à la scène
		this.scene = scene;

		//Ajouter le texte dans la scène
		this.scene.add.existing(this);

		//Ajuster le point d'ancrage
		this.setOrigin(0.5);

		//Partir l'animation
		this.animerScore();
	}

	animerScore() {

		//Échelle initiale du texte
		this.setScale(1);


		//Animation de l'échelle
		this.scene.tweens.add({
			targets: this,
			duration: 1000,
			props: {
				scaleX: 1.2,
				scaleY: 1.2
			},
      repeat: -1,
      yoyo: true,
			callbackScope: this,
		});

	}

}
