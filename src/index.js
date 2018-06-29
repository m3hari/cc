/* eslint-disable */
const ROOT_URL = "https://free.currencyconverterapi.com/api/v5";

export default class CurrencyConverterApp {
  constructor() {
    this.from = document.getElementById("currency_from");
    this.to = document.getElementById("currency_to");
    this.query = document.getElementById("query");
    this.resultLabel = document.getElementById("resultLabel");
    this.convertButton = document.getElementById("convert_button");
    this.convertButton.addEventListener("click", (e) => { this.convertHandler(e)});
    this.initCurrencies();
    this.registerServiceWorker();
  }

  convertHandler(event) {
    event.preventDefault();
    const q = this.query.value;
    const f = this.from.value;
    const t = this.to.value;
    if (!q || !f || !t) return;
    const question = `?q=${f}_${t}&compact=ultra`;
    fetch(`${ROOT_URL}/convert${question}`)
      .then(res => res.json())
      .then(result => {
        const rate = result[`${f}_${t}`];
        const answer = rate * q;
        this.resultLabel.innerText = answer.toFixed(2);
      });
  }
  initCurrencies() {
    fetch(`${ROOT_URL}/currencies`)
      .then(res => res.json())
      .then(currencies => {
        const { results } = currencies;
        for (const code in results) {
          if (code) {
            const currency = results[code];
            const option = new Option(`${currency.id}`, currency.id);
            this.from.appendChild(option);
            this.to.appendChild(option.cloneNode(true));
          }
        }
      })
      .catch(err => {
        console.log("err::", err);
      });
  }

  registerServiceWorker() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(res => {
        console.log("service worker registered");
      })
      .catch(err => {
        console.log("Service worker registration failed::", err);
      });
  }
}

// init app
new CurrencyConverterApp()