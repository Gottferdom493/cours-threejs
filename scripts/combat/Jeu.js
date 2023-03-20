import Attaque from "./Attaque.js";
import Ennemi from "./Ennemi.js";
import Personnage from "./Personnage.js";
import GlobalScene from "../three/GlobalScene.js";
import Menu from "./Menu.js";

import lukeGltf from "../../assets/gltf/luke_v05.glb";
import vadorGltf from "../../assets/gltf/vador_v06.glb";

import piouFriouSound from "../../assets/sounds/piou-friou.mp3";
import friouSound from "../../assets/sounds/friou.mp3";
import lightSaberSound from "../../assets/sounds/light-saber.mp3";
import piouSound from "../../assets/sounds/piou-piou.mp3";

export default class Jeu {
  constructor() {
    this.chanceEchecCritique = 1 / 5;

    const nomPersonnageChoisi =
      localStorage.getItem("jediChoisi");

    const estLuke = nomPersonnageChoisi == "luke";
    const estVador = nomPersonnageChoisi == "vador";

    this.create3DElmts(estLuke, estVador);

    if (estVador) {
      this.ennemi = this.createLuke(estLuke);
      this.personnage = this.createVador(estVador);
    } else {
      this.ennemi = this.createVador(estVador);
      this.personnage = this.createLuke(estLuke);
    }

    this.personnage.desactiverTousLesBoutons();
    this.menu = new Menu();
  }

  create3DElmts(estLuke, estVador) {
    this.globalScene = new GlobalScene({
      jeu: this,
      idCanvas: "canvas",
      divCanvasCssSelector: ".canvas",
      cameraCoordonnees: {
        x: 0,
        y: 2.5,
        z: 8
      },
      cameraCoordonneesMobile: {
        x: 0,
        y: 2.5,
        z: 9
      },
      gltfPersonnages: [
        {
          name: "vador",
          gltf: vadorGltf,
          coordonnees: {
            x: estVador ? -3 : 3,
            y: 0,
            z: 0
          },
          coordonneesMobile: {
            x: estVador ? -2 : 2,
            y: 0,
            z: 0
          },
          rotation: {
            x: 0,
            y: estVador ? 60 : -60,
            z: 0
          },
          initAnimation: "idle",
          needChangeColorSaber: estVador
        },
        {
          name: "luke",
          gltf: lukeGltf,
          coordonnees: {
            x: estLuke ? -3 : 3,
            y: 0,
            z: 0
          },
          coordonneesMobile: {
            x: estLuke ? -2 : 2,
            y: 0,
            z: 0
          },
          rotation: {
            x: 0,
            y: estLuke ? 60 : -60,
            z: 0
          },
          initAnimation: "Idle",
          needChangeColorSaber: estLuke
        }
      ],
      colorLights: 0xff0000
    });
  }

  createLuke(estLePersonnageChoisi) {
    let typePersonnage = estLePersonnageChoisi
      ? Personnage : Ennemi;
    const luke = new typePersonnage({
      pointDeVie: 100,
      energie: 200,
      nom: "luke",
      estDuCoteObscure: false,
      jeu: this,
      attaques: [
        new Attaque("salto", 70, 40, this, "salto", piouFriouSound),
        new Attaque("tourni", 20, 30, this, "tourni", friouSound),
        new Attaque("pointe", 10, 10, this, "pointe", lightSaberSound)
      ],
      estChoisi: estLePersonnageChoisi
    });
    return luke;
  }

  createVador(estLePersonnageChoisi) {
    let typePersonnage = estLePersonnageChoisi
      ? Personnage : Ennemi;
    const vador = new typePersonnage({
      pointDeVie: 150,
      energie: 150,
      nom: "vador",
      jeu: this,
      attaques: [
        new Attaque("force", 55, 25, this, "force", piouSound),
        new Attaque("envoyer son sabre", 15, 20, this, "launchsaber", lightSaberSound),
        new Attaque("regard perçant", 10, 10, this, "regard", friouSound)
      ],
      estChoisi: estLePersonnageChoisi
    });
    return vador;
  }

  async lancerAttaquePersonnage(attaque) {
    this.personnage.desactiverTousLesBoutons();
    this.menu.onClickHeart();
    const lancerEnnemiAttaque =
      await this.personnage.attaquerPersonnage(
        "animation-attaque-left-right",
        attaque
      );
    if (lancerEnnemiAttaque) {
      this.apresAttaquePersonnage();
    }
  }

  async apresAttaquePersonnage() {
    const activerLesBoutons =
      await this.ennemi.attaquerPersonnage(
      "animation-attaque-right-left",
    );
    if (activerLesBoutons) {
      this.personnage.activerTousLesBoutons();
      this.menu.onClickWeapon();
    }
  }

  lancerConfetti() {
    const videoConfetti = document.querySelector(".confetti");
    videoConfetti.classList.remove("confetti-hidden");
    videoConfetti.play();
  }
}