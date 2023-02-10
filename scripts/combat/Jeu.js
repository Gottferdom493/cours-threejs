import Attaque from "./Attaque.js";
import Ennemi from "./Ennemi.js";
import Personnage from "./Personnage.js";

export default class Jeu {
  constructor() {
    const nomPersonnageChoisi =
      localStorage.getItem("jediChoisi");

    const estLuke = nomPersonnageChoisi == "luke";
    const estVador = nomPersonnageChoisi == "vador";
    if (estVador) {
      this.ennemi = this.createLuke(estLuke);
      this.personnage = this.createVador(estVador);
    } else {
      this.ennemi = this.createVador(estVador);
      this.personnage = this.createLuke(estLuke);
    }
  }

  createLuke(estLePersonnageChoisi) {
    let typePersonnage = estLePersonnageChoisi
      ? Personnage : Ennemi;
    const luke = new typePersonnage(
      100,
      200,
      "luke",
      "assets/luke.jpg",
      false,
      this,
      [
        new Attaque("salto", 50, 50, this),
        new Attaque("tourni", 20, 30, this),
        new Attaque("pointe", 10, 10, this)
      ],
      estLePersonnageChoisi
    );
    return luke;
  }

  createVador(estLePersonnageChoisi) {
    let typePersonnage = estLePersonnageChoisi
      ? Personnage : Ennemi;
    const vador = new typePersonnage(
      150,
      150,
      "vador",
      "assets/dark_vador.jpg",
      true,
      this,
      [
        new Attaque("force", 40, 35, this),
        new Attaque("envoyer son sabre", 30, 25, this),
        new Attaque("regard perçant", 10, 10, this)
      ],
      estLePersonnageChoisi
    );
    return vador;
  }
}