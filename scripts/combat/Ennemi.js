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
    // let rand = Math.random() * (this.attaques.length - 1);
    // rand = Math.round(rand);
    // return this.attaques[rand];

    this.attaques.sort((a, b) => {
      if (a.degat > b.degat) {
        return -1;
      } else if (a.degat < b.degat) {
        return 1;
      } else {
        return 0;
      }
    });

    let attaqueSelectionnee = this.attaques[this.attaques.length - 1];

    for (let attaque of this.attaques) {
      if (attaque.energieNecessaire <= this.energie) {
        attaqueSelectionnee = attaque;
        break;
      }
    }

    return attaqueSelectionnee;
  }

  attaquerPersonnage(animationName, callback) {
    const attaqueSelectionnee = this.selectionnerUneAttaque();
    if (
      this.pointDeVie > 0 &&
      this.energie >= attaqueSelectionnee.energieNecessaire
    ) {
      this.ajouteAnimationAttaque(
        animationName
      );
      this.jeu.personnage.enleverDesPV(
        attaqueSelectionnee.degat
      );
      this.diminuerEnergie(
        attaqueSelectionnee.energieNecessaire
      );
      this.creerInfoBox(attaqueSelectionnee);
      setTimeout(() => {
        this.removeTextAttaque();
        if (
          this.jeu.personnage.pointDeVie > 0 &&
          this.jeu.personnage.energie >= this.jeu.personnage.energieMinimum
        ) {
          callback();
        } else if (
          this.jeu.personnage.pointDeVie > 0 &&
          this.energie >= attaqueSelectionnee.energieNecessaire
        ) {
          this.attaquerPersonnage(animationName, callback);
        } else if (
          this.jeu.personnage.getPointDeViePourcentage() > this.getPointDeViePourcentage()
        ) {
          this.jeu.personnage.gagne();
        } else {
          this.gagne();
        }
      }, 2000)
    } else if (
      this.pointDeVie > 0 &&
      this.energie >= this.energieMinimum
    ) {
      this.attaquerPersonnage(animationName, callback);
    } else if (this.pointDeVie > 0) {
      this.createMessage("N'a pas assez d'énergie pour jouer.");
      setTimeout(
        () => {
          this.removeMessage();
          callback();
        },
        2000
      )
    } else {
      this.jeu.personnage.gagne();
    }
  }

  removeTextAttaque() {
    this.divPersonnage.removeChild(this.pNomAttaque);
  }

  removeMessage() {
    this.divPersonnage.removeChild(this.message);
  }

  creerInfoBox(attaque) {
    this.pNomAttaque = document.createElement("p");
    this.pNomAttaque.textContent = `${capitalize(this.jeu.ennemi.nom)} attaque ${capitalize(this.jeu.personnage.nom)} avec ${attaque.nom}`;
    this.divPersonnage.appendChild(this.pNomAttaque);
  }

  createMessage(message) {
    this.message = document.createElement("p");
    this.message.textContent = message;
    this.divPersonnage.appendChild(this.message);
  }
}