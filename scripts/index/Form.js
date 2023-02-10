export default class Form {
  constructor() {
    this.buttons = document.querySelectorAll(
      ".personnages button"
    );
    this.form = document.querySelector("form");
    this.submitButton = document.querySelector("form button");
    this.vador = document.querySelector(".vador");
    this.luke = document.querySelector(".luke");
    this.inputs = document.getElementsByTagName("input");
    this.validatedInputs = [];

    this.showForm();
    this.checkInputsWithEvent();
    this.goToFightPage();
  }

  showForm() {
    for (let button of this.buttons) {
      button.addEventListener(
        "click",
        () => this.onClickButton(button)
      );
    }
  }
  
  onClickButton(button) {
    this.enabledHtmlElmt(this.form);
    this.form.classList.add("translate-null");
  
    if (button.value == "luke") {
      this.disabledHtmlElmt(this.vador);
      this.submitButton.classList.add("green-illumination");
    } else {
      this.disabledHtmlElmt(this.luke);
      this.submitButton.classList.add("red-illumination");
    }
  
    localStorage.setItem("jediChoisi", button.value);

    this.checkInputs();
  }
  
  goToFightPage() {
    this.submitButton.addEventListener(
      "click",
      this.onClickSubmitButton.bind(this)
    )
  }
  
  onClickSubmitButton(event) {
    event.preventDefault();
    localStorage.setItem("pseudo", this.inputs[0].value);
    window.location.href = "/combat.html";
  }
  
  checkInputsWithEvent() {
    for (let input of this.inputs) {
      input.addEventListener(
        "input",
        () => this.onDetectChangeInInput(input)
      )
    }
  }

  checkInputs() {
    for (let input of this.inputs) {
      this.onDetectChangeInInput(input);
    }
  }
  
  onDetectChangeInInput(input) {
    if (
      input.value != "" &&
      !this.validatedInputs.includes(input)
    ) {
      this.validatedInputs.push(input);
    } else if (
      input.value == "" &&
      this.validatedInputs.includes(input)
    ) {
      this.validatedInputs = this.validatedInputs.filter(
        elmt => input != elmt
      );
    }
  
    if (this.validatedInputs.length == this.inputs.length) {
      this.enabledHtmlElmtVisble(this.submitButton);
    }
  }
  
  enabledHtmlElmtVisble(htmlElmt) {
    htmlElmt.classList.remove("disabled-but-visible");
  }
  
  disabledHtmlElmt(htmlElmt) {
    htmlElmt.classList.add("disabled");
  }
  
  enabledHtmlElmt(htmlElmt) {
    htmlElmt.classList.remove("disabled");
  }
}