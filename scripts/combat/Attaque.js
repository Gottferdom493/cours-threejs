export default class Attaque {
  constructor(
    nom,
    energieNecessaire,
    degat,
    jeu
  ) {
    this.nom = nom;
    this.energieNecessaire = energieNecessaire;
    this.degat = degat;
    this.jeu = jeu;
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
      () => this.onClickOnButton()
    )
  }

  onClickOnButton() {
    this.jeu.personnage.attaquerPersonnage(
      "animation-attaque-left-right",
      this
    );
    this.desactiverTousLesBoutons();
    setTimeout(() => {
      this.jeu.ennemi.attaquerPersonnage(
        "animation-attaque-right-left",
        this.activerTousLesBoutons.bind(this)
      );
    }, 1000);
  }

  desactiverTousLesBoutons() {
    for (let attaque of this.jeu.personnage.attaques) {
      attaque.button.classList.add("disabled-but-visible");
    }
  }

  activerTousLesBoutons() {
    for (let attaque of this.jeu.personnage.attaques) {
      attaque.button.classList.remove("disabled-but-visible");
    }
  }
}


