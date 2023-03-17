export default class Menu {
  constructor() {
    this.buttonHeart = document.getElementById("heart");
    this.buttonWeapon = document.getElementById("weapon");

    this.divAttaques = document.querySelector(".attaques");
    this.divPersonnages = document.querySelector(
      ".personnages"
    );

    this.sizeMobile = 700;

    this.addEventListenersOnButtons();
    this.checkIfMobile();
    this.addEventOnResize();
  }

  checkIfMobile() {
    if (window.innerWidth < this.sizeMobile) {
      this.onClickHeart();
    } else {
      this.showAll();
    }
  }

  addEventOnResize() {
    window.addEventListener("resize", this.checkIfMobile.bind(this))
  }

  showAll() {
    this.divAttaques.style.opacity = "1";
    this.divPersonnages.style.opacity = "1";
  }

  onClickHeart() {
    if (window.innerWidth < this.sizeMobile) {
      this.divAttaques.style.opacity = "0";
      this.divPersonnages.style.opacity = "1";
      this.buttonHeart.classList.add("button-active");
      this.buttonWeapon.classList.remove("button-active");
    } else {
      this.showAll();
    }
  }

  onClickWeapon() {
    if (window.innerWidth < this.sizeMobile) {
      this.divAttaques.style.opacity = "1";
      this.divPersonnages.style.opacity = "0";
      this.buttonWeapon.classList.add("button-active");
      this.buttonHeart.classList.remove("button-active");
    } else {
      this.showAll();
    }
  }

  addEventListenersOnButtons() {
    this.buttonHeart.addEventListener("click", this.onClickHeart.bind(this));
    this.buttonWeapon.addEventListener("click", this.onClickWeapon.bind(this));
  }
}