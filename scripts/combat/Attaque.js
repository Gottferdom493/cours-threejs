import clickSound from "../../assets/sounds/click.mp3";

export default class Attaque {
  constructor(
    nom,
    energieNecessaire,
    degat,
    jeu,
    animationName,
    sound
  ) {
    this.nom = nom;
    this.energieNecessaire = energieNecessaire;
    this.degat = degat;
    this.jeu = jeu;
    this.animationName = animationName;
    this.sound = sound;
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
      () => {
        const audio = new Audio(clickSound);
        audio.volume = 0.1;
        audio.play();
        
        this.jeu.lancerAttaquePersonnage(this);
      }
    )
  }

  lancerSonAttaque() {
    if (this.sound) {
      const audioAttaique = new Audio(this.sound);
      audioAttaique.play();
    }
  }
}


