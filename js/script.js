const dropList = document.querySelectorAll('.drop-list select');
fromCurrency = document.querySelector('.from select');
toCurrency = document.querySelector('.to select');
getButton = document.querySelector('form button');


for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_list) {

        // selecting USD by default as FROM currency and EGP as TO currency
        let selected;
        if (i == 0) {
            selected = currency_code == 'USD' ? 'selected' : '';
        } else if (i == 1) {
            selected = currency_code == 'EGP' ? 'selected' : '';
        }

        // creating option tag with passing currency code as a text and value
        let optionTag = `<option value=${currency_code} ${selected}>${currency_code}</option>`

        // inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }

    dropList[i].addEventListener('change', e => {
        loadFlag(e.target); // calling loadFlag with passing target element as an argument
    })
}

function loadFlag(element) {
    for (code in country_list) {
        // if currency code of country list is equal to option value
        if (code == element.value) {
            // selecting img tag of particular drop list
            let imgTag = element.parentElement.querySelector('img')
            // passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`
        }
    }
}

window.addEventListener('load', () => {
    getExchangeRate();

})

getButton.addEventListener('click', e => {
    e.preventDefault(); // prevent form from submitting
    getExchangeRate();

})

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
})

function getExchangeRate() {
    const amount = document.querySelector('.amount input');
    const exchangeRateTxt = document.querySelector('.exchange-rate');
    let amountValue = amount.value;

    //  if user don't enter any value or enter 0 then we will put 1 value by default in the input field
    if (amountValue == '' || amountValue == '0') {
        amount.value = '1';
        amountValue = 1;
    }

    let url = `https://v6.exchangerate-api.com/v6/88626cd6a76e0b3afda39304/latest/${fromCurrency.value}`
    // fetch api response and returning it with parsing into js object and in another then method receiving that object
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value]
        let totalExchangeRate = (amountValue * exchangeRate).toFixed(2);
        exchangeRateTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`
    }).catch(()=>{
        exchangeRateTxt.innerText = 'Something went wrong'
    })
}