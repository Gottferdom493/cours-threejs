export default class Attaque {
  constructor(
    nom,
    energieNecessaire,
    degat,
    jeu,
    animationName
  ) {
    this.nom = nom;
    this.energieNecessaire = energieNecessaire;
    this.degat = degat;
    this.jeu = jeu;
    this.animationName = animationName;
  }

  creerHtmlElmt(htmlParent, classList) {
    this.button = document.createElement("button");
    this.button.textContent = `${this.nom} (${this.energieNecessaire} energie requise) (${this.degat} PV enlevé)`;
    htmlParent.appendChild(this.button);
    this.button.classList = classList;

    this.addEventOnButton();
  }

  addEventOnButton() {
    this.button.addEventListener(
      "click",
      () => this.jeu.lancerAttaquePersonnage(this)
    )
  }
}


