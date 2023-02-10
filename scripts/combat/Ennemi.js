import Personnage from "./Personnage.js";
import { capitalize } from "../utils.js";

export default class Ennemi extends Personnage {
  constructor(
    pointDeVie,
    energie,
    nom,
    imageSource,
    estDuCoteObscure,
    jeu,
    attaques,
    estChoisi
  ) {
    super(
      pointDeVie,
      energie,
      nom,
      imageSource,
      estDuCoteObscure,
      jeu,
      attaques,
      estChoisi
    );
  }

  selectionnerUneAttaque() {
    let rand = Math.random() * (this.attaques.length - 1);
    rand = Math.round(rand);
    return this.attaques[rand];
  }

  attaquerPersonnage(animationName, callback) {
    if (this.pointDeVie > 0) {
      const attaqueSelectionnee = this.selectionnerUneAttaque();
      this.ajouteAnimationAttaque(
        animationName
      );
      this.jeu.personnage.enleverDesPV(
        attaqueSelectionnee.degat
      );
      this.creerInfoBox(attaqueSelectionnee);
      setTimeout(() => {
        this.finDelAttaque();
        if (this.jeu.personnage.pointDeVie > 0) {
          callback();
        } else {
          this.gagne();
        }
      }, 2000)
    } else {
      this.jeu.personnage.gagne();
    }
  }

  finDelAttaque() {
    this.divPersonnage.removeChild(this.pNomAttaque);
  }

  creerInfoBox(attaque) {
    this.pNomAttaque = document.createElement("p");
    this.pNomAttaque.textContent = `${capitalize(this.jeu.ennemi.nom)} attaque ${capitalize(this.jeu.personnage.nom)} avec ${attaque.nom}`;
    this.divPersonnage.appendChild(this.pNomAttaque);
  }
}