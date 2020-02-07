//Importation des scripts et classes nécessaires
import {
	SceneChargement
} from './scenes/SceneChargement.js';

import {
	SceneIntro
} from './scenes/SceneIntro.js';

import {
	SceneJeu
} from './scenes/SceneJeu.js';

import {
	SceneInstructions
} from './scenes/SceneInstructions.js';

import {
	SceneFinJeu
} from './scenes/SceneFinJeu.js';



//On crééra le jeu quand la page HTML sera chargée
window.addEventListener("load", function () {
	//On définit avec des variables les dimensions du jeu sur desktop
	let largeur = 640,
		hauteur = 960;

	//On vérifie ensuite si le jeu est lu  sur mobile pour ajuster s'il y a lieu les dimensions
	if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
		largeur = Math.min(window.innerWidth, window.innerHeight);
		hauteur = Math.max(window.innerWidth, window.innerHeight);
	}

	// Object pour la configuration du jeu - qui sera passé en paramètre au constructeur
	let config = {
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: largeur,
			height: hauteur,
		},
		scene: [SceneChargement, SceneIntro , SceneInstructions, SceneJeu, SceneFinJeu],
		input: {
				activePointers: 1,
		}

	}

	// Création du jeu comme tel - comme objet global pour qu'il soit accessible à toutes les scènes du jeu
	// window.game = new Phaser.Game(config);



	//Objet de configuration pour le chargement des fontes
	let webFontConfig = {
			active: function () {
					console.log("Les polices de caractères sont chargées");
					window.game = new Phaser.Game(config);

					window.game.jeuGrimpeur = {
							NOM_LOCAL_STORAGE: "savoieJ_Score", //Sauvegarde et enregistrement du meilleur score
							score: 0, // Le score du jeu
							meilleurScore: 0, //Le meilleur score antérieur enregistré
					}
			},

			google: {
				families: ["Sigmar One"]
			}

	};

	//Chargement des polices de caractères - À  mettre uniquement après le fichier de configuration
	WebFont.load(webFontConfig);


}, false);
