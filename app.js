let rub1 = document.querySelector(".rub1");
let usd1 = document.querySelector(".usd1");
let eur1 = document.querySelector(".eur1");
let gbp1 = document.querySelector(".gbp1");
let rub2 = document.querySelector(".rub2");
let usd2 = document.querySelector(".usd2");
let eur2 = document.querySelector(".eur2");
let gbp2 = document.querySelector(".gbp2");

let leftBtn = document.querySelectorAll(".left-btn");
let rightBtn = document.querySelectorAll(".right-btn");

let leftInput = document.querySelector(".left-side");
let rightInput = document.querySelector(".right-side");

let rate1 = document.querySelector(".rate1");
let rate2 = document.querySelector(".rate2");

let internetStatus = document.querySelector(".internet-status");

let menu = document.querySelector(".menu");
let burger = document.querySelector(".burger");

let fromCurrency = "RUB";
let toCurrency = "USD";
let activeInput = "amount";

let login = document.querySelector(".login");
let isGray = false;

login.addEventListener("click", () => {
  if (isGray) {
    login.style.backgroundColor = "white";
  } else {
    login.style.backgroundColor = "lightgray";
  }

  isGray = !isGray;
});

leftBtn.forEach(btn => {
  if (btn.innerText === "RUB") {
    btn.classList.add("active");
    fromCurrency = btn.innerText;
  }
});

rightBtn.forEach(btn => {
  if (btn.innerText === "USD") {
    btn.classList.add("active");
    toCurrency = btn.innerText;
  }
});

leftBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    leftBtn.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    fromCurrency = btn.innerText;
    fetchAndConvert();
  });
});

rightBtn.forEach(btn => {
  btn.addEventListener("click", () => {
    rightBtn.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    toCurrency = btn.innerText;
    fetchAndConvert();
  });
});

function sanitizeInput(value) {
  value = value.replace(/[^0-9.,]/g, "");
  value = value.replace(/,/g, ".");
  if (value.startsWith(".")) value = "0" + value;
  let [main, decimal] = value.split(".");
  main = main.replace(/^0+(?=\d)/, "");
  if (decimal) decimal = decimal.slice(0, 5);
  return decimal !== undefined ? `${main}.${decimal}` : main;
}

function fetchAndConvert() {
  if (fromCurrency === toCurrency) {
    rate1.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
    rate2.textContent = `1 ${toCurrency} = 1 ${fromCurrency}`;
    if (activeInput === "amount") {
      rightInput.value = leftInput.value;
    } else {
      leftInput.value = rightInput.value;
    }
    return;
  }

  if (activeInput === "amount") {
    fetch(`https://v6.exchangerate-api.com/v6/f8b9170359669b98025f951c/latest/${fromCurrency}`)
      .then(res => res.json())
      .then(response => {
        if (response.result === "success") {
          let rate = response.conversion_rates[toCurrency];
          rate1.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
          rate2.textContent = `1 ${toCurrency} = ${(1 / rate).toFixed(5)} ${fromCurrency}`;
          let amount = parseFloat(leftInput.value);
          rightInput.value = (!isNaN(amount) && leftInput.value !== "") ? (amount * rate).toFixed(5) : "";
        }
      })
      .catch(error => {
        console.error("Error fetching currency rates:", error);
        internetStatus.textContent = "İnternet bağlantısını yoxlayın.";
      });
  } else {
    fetch(`https://v6.exchangerate-api.com/v6/f8b9170359669b98025f951c/latest/${toCurrency}`)
      .then(res => res.json())
      .then(response => {
        if (response.result === "success") {
          let rate = response.conversion_rates[fromCurrency];
          rate1.textContent = `1 ${fromCurrency} = ${(1 / rate).toFixed(5)} ${toCurrency}`;
          rate2.textContent = `1 ${toCurrency} = ${rate} ${fromCurrency}`;
          let amount = parseFloat(rightInput.value);
          leftInput.value = (!isNaN(amount) && rightInput.value !== "") ? (amount * rate).toFixed(5) : "";
        }
      })
      .catch(error => {
        console.error("Error fetching currency rates:", error);
        internetStatus.textContent = "İnternet bağlantısını yoxlayın.";
      });
  }
}

leftInput.addEventListener("input", () => {
  activeInput = 'amount';
  leftInput.value = sanitizeInput(leftInput.value);
  fetchAndConvert();
});

rightInput.addEventListener("input", () => {
  activeInput = 'result';
  rightInput.value = sanitizeInput(rightInput.value);
  fetchAndConvert();
});

burger.addEventListener('click', () => {
  menu.classList.toggle('active');
});

window.addEventListener('online', () => {
  internetStatus.textContent = "İnternet yenidən qoşuldu";
  internetStatus.classList.add("show", "online");
  internetStatus.classList.remove("offline", "hide");
  setTimeout(() => {
    internetStatus.classList.add("hide");
    setTimeout(() => {
      internetStatus.classList.remove("show", "hide", "online");
    }, 500);
  }, 2000);
});

window.addEventListener('offline', () => {
  internetStatus.textContent = "İnternet bağlantısı kəsildi";
  internetStatus.classList.add("show", "offline");
  internetStatus.classList.remove("online", "hide");
});


window.addEventListener('online', () => {
  internetStatus.textContent = "İnternet yenidən qoşuldu";
  internetStatus.classList.add("show", "online");
  internetStatus.classList.remove("offline", "hide");

  setTimeout(() => {
    internetStatus.classList.add("hide");
    setTimeout(() => {
      internetStatus.classList.remove("show", "hide", "online");
    }, 500);
  }, 2000);

  if ((activeInput === 'amount' && leftInput.value !== '') ||
    (activeInput === 'result' && rightInput.value !== '')) {
    fetchAndConvert();
  }
});


window.addEventListener('offline', () => {
  internetStatus.textContent = "İnternet bağlantısı kəsildi";
  internetStatus.classList.add("show", "offline");
  internetStatus.classList.remove("online", "hide");

  if (activeInput === 'amount') {
    rightInput.value = '';
  } else if (activeInput === 'result') {
    leftInput.value = '';
  }
});
