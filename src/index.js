import idb from 'idb';

const ROOT_URL = 'https://free.currencyconverterapi.com/api/v5';

/**
 * open database
 */
const openDatabase = () => {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }
  return idb.open('cc-v1', 1, (upgradeDb) => {
    upgradeDb.createObjectStore('exchange-rates');
    upgradeDb.createObjectStore('currencies', { keyPath: 'id' });
  });
};

/**
 * registers service worker script if service worker is supported
 */
const registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(() => {
      // eslint-disable-next-line
      console.log('Service worker registered');
    })
    .catch((err) => {
      // eslint-disable-next-line
      console.log('Service worker registration failed', err);
    });
};

/**
 * Class that encapsulates all the app logic
 */
class CurrencyConverterApp {
  constructor() {
    this.initDOM();
    this.db = openDatabase();
    registerServiceWorker();
  }

  initDOM() {
    this.from = document.getElementById('currency_from');
    this.to = document.getElementById('currency_to');
    this.query = document.getElementById('query');
    this.resultLabel = document.getElementById('resultLabel');
    document.getElementById('convert_button').addEventListener('click', (e) => {
      this.convertHandler(e);
    });
    this.initCurrencies();
  }

  /**
   * process currency conversion
   * @param {object} event button click event
   */
  convertHandler(event) {
    event.preventDefault();
    const q = this.query.value;
    const f = this.from.value;
    const t = this.to.value;
    if (!q || !f || !t) return;
    const code = `${f}_${t}`;
    const path = `?q=${code}&compact=ultra`;
    fetch(`${ROOT_URL}/convert${path}`)
      .then(res => res.json())
      .then((result) => {
        const newRate = result[code];
        this.saveExchangeRate(code, newRate);
        this.calculateAndShowResult(newRate);
      })
      .catch(() => {
        this.useCachedRate(code);
      });
  }

  calculateAndShowResult(rate) {
    const q = this.query.value;
    if (isNaN(q)) return;
    const answer = rate * q;
    this.resultLabel.innerText = answer.toFixed(2);
  }

  /**
   *  renders currency from and currency to dropdown options
   * @param {Array} currencies
   */
  renderCurrencyDropdownOptions(currencies) {
    currencies.forEach((currency) => {
      const option = new Option(`${currency.id}`, currency.id);
      this.from.appendChild(option);
      this.to.appendChild(option.cloneNode(true));
    });
  }

  /**
   * Network FIRST approach
   */
  initCurrencies() {
    fetch(`${ROOT_URL}/currencies`)
      .then(res => res.json())
      .then((res) => {
        const currencies = Object.values(res.results);
        this.saveCurrencies(currencies);
        this.renderCurrencyDropdownOptions(currencies);
      })
      .catch(() => {
        this.showCachedCurrencies();
      });
  }
  useCachedRate(exchangeCode) {
    this.db.then((db) => {
      const tx = db.transaction('exchange-rates');
      const store = tx.objectStore('exchange-rates');
      return store.get(exchangeCode);
    })
      .then((rate) => {
        if (!rate) return;
        // todo show rate not cached message
        this.calculateAndShowResult(rate);
      });
  }
  showCachedCurrencies() {
    this.db.then((db) => {
      const tx = db.transaction('currencies');
      const store = tx.objectStore('currencies');
      return store.getAll();
    })
      .then((currencies) => {
        this.renderCurrencyDropdownOptions(currencies);
      });
  }

  saveExchangeRate(exchangeCode, value) {
    this.db.then((db) => {
      if (!db) return;
      const tx = db.transaction('exchange-rates', 'readwrite');
      const store = tx.objectStore('exchange-rates');
      store.put(value, exchangeCode);
    });
  }
  saveCurrencies(currencies) {
    this.db.then((db) => {
      if (!db) return;
      const tx = db.transaction('currencies', 'readwrite');
      const store = tx.objectStore('currencies');
      currencies.forEach((currency) => {
        store.put(currency);
      });
    });
  }
}

// init app
export default new CurrencyConverterApp();
