import { capitalize } from "../utils.js";
import PopUp from "./PopUp.js";

export default class Personnage {
  constructor({
    pointDeVie,
    energie,
    nom,
    estDuCoteObscure,
    jeu,
    attaques,
    estChoisi
  }) {
    this.pointDeVie = pointDeVie;
    this.pointDeVieInitial = pointDeVie;
    this.energie = energie;
    this.energieInitiale = energie;
    this.estDuCoteObscure = estDuCoteObscure;
    this.jeu = jeu;
    this.attaques = attaques;
    this.estChoisi = estChoisi;
    this.nom = nom;
    this.energieMinimum;

    this.divPersonnages = document.querySelector(".personnages");

    this.creerHtmlBase(nom)
    this.creerHtmlVie();
    this.creerHtmlEnergie();
    this.createAttaques();
  }

  creerHtmlBase(nom) {
    this.divPersonnage = document.createElement("div");
    this.divPersonnage.classList.add("personnage");
    this.divPersonnage.classList.add(nom);

    
    this.divPersonnages.appendChild(this.divPersonnage);

    if (this.estChoisi) {
      this.createPseudo(localStorage.getItem("pseudo"));
    } else {
      this.createPseudo(this.nom);
    }
  }

  createPseudo(text) {
    const pseudo = document.createElement("p");
    pseudo.textContent = text;
    pseudo.classList.add("pseudo");
    this.divPersonnage.appendChild(pseudo);
  }

  creerHtmlVie() {
    this.creerParagrapheVie();
    const vieTotal = document.createElement("div");
    vieTotal.classList.add("total-bar");
    this.divVie = document.createElement("div");
    this.divVie.classList.add("vie");
    this.divVie.classList.add("niveau-bar");
    this.divPersonnage.appendChild(vieTotal);
    vieTotal.appendChild(this.divVie);
  }

  creerHtmlEnergie() {
    this.creerParagrapheEnergie();
    const energieTotal = document.createElement("div");
    energieTotal.classList.add("total-bar");
    this.divEnergie = document.createElement("div");
    this.divEnergie.classList.add("energie");
    this.divEnergie.classList.add("niveau-bar");
    this.divPersonnage.appendChild(energieTotal);
    energieTotal.appendChild(this.divEnergie);
  }

  createAttaques() {
    if (this.estChoisi) {

      const attaquesDiv = document.createElement("div");
      attaquesDiv.classList.add("attaques");
      document.querySelector(".jeu").appendChild(attaquesDiv);

      this.creerParagraphe(attaquesDiv, "Mes attaques :");

      let classList;
      if (this.estDuCoteObscure) {
        classList = ["red-illumination"];
      } else {
        classList = ["green-illumination"];
      }

      for (let attaque of this.attaques) {
        attaque.creerHtmlElmt(
          attaquesDiv,
          classList
        );

        if (
          !this.energieMinimum ||
          this.energieMinimum > attaque.energieNecessaire
        ) {
          this.energieMinimum = attaque.energieNecessaire
        }
      }
      this.divPersonnage.classList.add("first");
    }
  }

  // resolve boolean : permet de lancer animation ennemi
  // si true
  attaquerPersonnage(
    animationName,
    attaqueChoisie
  ) {
    return new Promise(async (resolve) => {
      if (
        this.pointDeVie > 0 &&
        this.energie >= attaqueChoisie.energieNecessaire
      ) {
        this.ajouteAnimationAttaque(
          animationName
        );
        await attaqueChoisie.jeu.globalScene.personnages3D[
          attaqueChoisie.jeu.personnage.nom
        ].playAnimation(attaqueChoisie.animationName);
        this.jeu.ennemi.enleverDesPV(
          attaqueChoisie.degat
        );
        this.diminuerEnergie(attaqueChoisie.energieNecessaire);
        resolve(true);
      } else if (
        this.pointDeVie > 0 &&
        this.energie >= this.energieMinimum
      ) {
        new PopUp(
          "Tu n'as plus assez d'énergie pour effectuer cette attaque. Choisis-en une autre !",
          () => {}
        );
        resolve(false);
      } else if (this.pointDeVie > 0) {
        resolve(true);
      } else {
        this.jeu.ennemi.gagne();
        resolve(false);
      }
    });
  }

  diminuerEnergie(energieAttaque) {
    const factor = 100 / this.energieInitiale;
    this.energie = this.energie - energieAttaque;
    this.divEnergie.style.width = `calc(${this.energie * factor}% - var(--padding-vie))`;
    this.modifierTextContentEnergie();
  }

  enleverDesPV(pointDeVie) {
    const factor = 100 / this.pointDeVieInitial;
    this.pointDeVie = this.pointDeVie - pointDeVie;
    this.divVie.style.width = `calc(${this.pointDeVie * factor}% - var(--padding-vie))`;
    this.modifierTextContentVie();
  }

  creerParagraphe(htmlParent, text) {
    const paragraphe = document.createElement("p");
    paragraphe.textContent = text;
    htmlParent.appendChild(paragraphe);
  }

  creerParagrapheVie() {
    this.paragrapheVie = document.createElement("p");
    this.modifierTextContentVie();
    this.divPersonnage.appendChild(this.paragrapheVie);
  }

  modifierTextContentVie() {
    this.paragrapheVie.textContent = `Vie restante : ${this.pointDeVie} / ${this.pointDeVieInitial}`;
  }

  creerParagrapheEnergie() {
    this.paragrapheEnergie = document.createElement("p");
    this.modifierTextContentEnergie();
    this.divPersonnage.appendChild(this.paragrapheEnergie);
  }

  modifierTextContentEnergie() {
    this.paragrapheEnergie.textContent = `Energie restante : ${this.energie} / ${this.energieInitiale}`;
  }

  ajouteAnimationAttaque(animationName) {
    this.divPersonnage.classList.add(
      animationName
    );

    let duration = getComputedStyle(
      document.body
    ).getPropertyValue(
      "--duration-animation-attaque"
    );

    duration = duration.replace("ms", "");
    duration = parseInt(duration);

    setTimeout(() => {
      this.enleveAnimationAttaque(animationName);
    }, duration);
  }

  enleveAnimationAttaque(animationName) {
    this.divPersonnage.classList.remove(animationName);
  }

  gagne() {
    const section = document.getElementsByTagName("section")[0];

    const p = document.createElement("p");
    p.textContent = `${ capitalize(this.nom) } a gagné !`;

    section.appendChild(p);
  }

  getPointDeViePourcentage() {
    return this.pointDeVie / this.pointDeVieInitial;
  }

  desactiverTousLesBoutons() {
    for (let attaque of this.attaques) {
      attaque.button.classList.add("disabled-but-visible");
    }
  }

  activerTousLesBoutons() {
    for (let attaque of this.attaques) {
      attaque.button.classList.remove("disabled-but-visible");
    }
  }
}