import { capitalize } from "../utils.js";
import PopUp from "./PopUp.js";

import crie1Sound from "../../assets/sounds/crie1.mp3";
import crie2Sound from "../../assets/sounds/crie2.mp3";
import crie3Sound from "../../assets/sounds/crie3.mp3";
import applauseSound from "../../assets/sounds/applause.mp3";

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
    let attaquesDiv;
    let classList;
    if (this.estChoisi) {
      attaquesDiv = document.createElement("div");
      attaquesDiv.classList.add("attaques");
      document.querySelector(".jeu").appendChild(attaquesDiv);

      this.creerParagraphe(attaquesDiv, "Mes attaques :");

      if (this.estDuCoteObscure) {
        classList = ["red-illumination"];
      } else {
        classList = ["green-illumination"];
      }

      this.divPersonnage.classList.add("first");
    }

    for (let attaque of this.attaques) {
      if (this.estChoisi) {
        attaque.creerHtmlElmt(
          attaquesDiv,
          classList
        );
      }
      if (
        !this.energieMinimum ||
        this.energieMinimum > attaque.energieNecessaire
      ) {
        this.energieMinimum = attaque.energieNecessaire
      }
    }
  }

  // chance = 1 / 10 ou 1 / 2 par exemple
  echecCritique(chance) {
    return Math.random() < chance;
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
        if (
          this.echecCritique(
            this.jeu.chanceEchecCritique
          )
        ) {
          this.creerInfo("Echec critique : -10 PV");
          this.enleverDesPV(10);
          this.diminuerEnergie(attaqueChoisie.energieNecessaire);
          await this.estBlesse(animationName);
          await this.removeInfo(1000);
        } else {
          attaqueChoisie.lancerSonAttaque();
          await this.jeu.globalScene.personnages3D[
            this.jeu.personnage.nom
          ].playAnimation(attaqueChoisie.animationName);
          this.jeu.ennemi.enleverDesPV(
            attaqueChoisie.degat
          );
          this.diminuerEnergie(attaqueChoisie.energieNecessaire);
          await this.jeu.ennemi.estBlesse(animationName);
        }
        
        if (this.pointDeVie > 0) {
          resolve(true);
        } else {
          this.jeu.ennemi.gagne();
          resolve(false);
        }
      } else if (
        this.pointDeVie > 0 &&
        this.energie >= this.energieMinimum
      ) {
        new PopUp(
          "Tu n'as plus assez d'énergie pour effectuer cette attaque. Choisis-en une autre !",
          () => {}
        );
        this.activerTousLesBoutons();
        resolve(false);
      } else if (this.pointDeVie > 0) {
        resolve(true);
      } else {
        this.jeu.ennemi.gagne();
        resolve(false);
      }
    });
  }

  async estBlesse(animationName) {
    const sounds = [crie1Sound, crie2Sound, crie3Sound];
    const index = Math.floor(Math.random() * sounds.length);
    const sound = new Audio(sounds[index]);
    sound.volume = 0.5;
    sound.play();
    this.ajouteAnimationAttaque(
      animationName
    );
    await this.jeu.globalScene.personnages3D[
      this.nom
    ].playAnimation("punch");
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

  creerInfo(text) {
    this.info = document.createElement("p");
    this.info.textContent = text;
    document.querySelector(".info").appendChild(this.info);
  }

  removeInfo(miliseconds = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        document.querySelector(".info").removeChild(this.info);
        resolve();
      }, miliseconds)
    });
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
    const results = document.querySelector(".results");

    const p = document.createElement("p");
    p.textContent = `${ capitalize(this.nom) } a gagné !`;

    results.appendChild(p);

    if (this.estChoisi) {
      const sound = new Audio(applauseSound);
      sound.volume = 0.6;
      sound.play();
      this.jeu.lancerConfetti();
    }
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