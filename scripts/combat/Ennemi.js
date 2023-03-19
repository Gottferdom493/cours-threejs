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

  // resolve boolean activer tous les boutons
  // pour permettre à l'utilisateur de jouer si true
  attaquerPersonnage(animationName) {
    return new Promise (async (resolve) => {
      const attaqueSelectionnee = this.selectionnerUneAttaque();
      if (
        this.pointDeVie > 0 &&
        this.energie >= attaqueSelectionnee.energieNecessaire
      ) {
        if (
          this.echecCritique(
            this.jeu.chanceEchecCritique
          )
        ) {
          this.creerInfo(
            `${capitalize(this.nom)} fait un echec critique : - 10 PV`
          );
          this.enleverDesPV(10);
          this.diminuerEnergie(attaqueSelectionnee.energieNecessaire);
          this.estBlesse();
        } else {
          this.creerInfo(`${capitalize(this.jeu.ennemi.nom)} attaque ${capitalize(this.jeu.personnage.nom)} avec ${attaqueSelectionnee.nom}`);

          await attaqueSelectionnee.jeu.globalScene.personnages3D[
            attaqueSelectionnee.jeu.ennemi.nom
          ].playAnimation(attaqueSelectionnee.animationName);
  
          this.jeu.personnage.enleverDesPV(
            attaqueSelectionnee.degat
          );
          this.diminuerEnergie(
            attaqueSelectionnee.energieNecessaire
          );
  
          await this.jeu.personnage.estBlesse(animationName);
        }

        setTimeout(async () => {
          await this.removeInfo();
          if (
            this.jeu.personnage.pointDeVie > 0 &&
            this.jeu.personnage.energie >= this.jeu.personnage.energieMinimum
          ) {
            resolve(true);
          } else if (
            this.jeu.personnage.pointDeVie > 0 &&
            this.energie >= this.energieMinimum
          ) {
            this.attaquerPersonnage(animationName);
            resolve(false);
          } else {
            this.checkWhoWin(resolve);
          }
        }, 1500)
      } else if (
        this.pointDeVie > 0 &&
        this.energie >= this.energieMinimum
      ) {
        this.attaquerPersonnage(animationName);
        resolve(false);
      } else if (this.pointDeVie > 0) {
        this.creerInfo(
          `${capitalize(this.nom)} n'a pas assez d'énergie pour jouer.`
        );
        setTimeout(
          async () => {
            await this.removeInfo();
            if (
              this.jeu.personnage.pointDeVie > 0 &&
              this.jeu.personnage.energie >= this.jeu.personnage.energieMinimum
            ) {
              resolve(true);
            } else {
              this.checkWhoWin(resolve);
            }
          },
          2000
        )
      } else {
        this.jeu.personnage.gagne();
        resolve(false);
      }
    });
  }

  checkWhoWin(resolve) {
    if (
      this.jeu.personnage.getPointDeViePourcentage() > this.getPointDeViePourcentage()
    ) {
      this.jeu.personnage.gagne();
      resolve(false);
    } else {
      this.gagne();
      resolve(false);
    }
  }
}