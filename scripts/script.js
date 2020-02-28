'use strict';

const DAY_STRING = ['день', 'дня', 'дней'];

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [
        [2, 7],
        [3, 10],
        [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
    mainForm = document.querySelector('.main-form'),
    total = document.querySelector('.total'),
    firstScreen = document.querySelector('.first-screen'),
    endButton = document.querySelector('.end-button'),
    formCalculate = document.querySelector('.form-calculate'),
    fastRange = document.querySelector('.fast-range'),
    totalPrice = document.querySelector('.total_price__sum'),
    mobileTemplates = document.getElementById('mobileTemplates'),
    desktopTemplates = document.getElementById('desktopTemplates'),
    editable = document.getElementById('editable'),
    adapt = document.getElementById('adapt'),
    mobileTemplatesValue = document.querySelector('.mobileTemplates_value'),
    desktopTemplatesValue = document.querySelector('.desktopTemplates_value'),
    editableValue = document.querySelector('.editable_value'),
    adaptValue = document.querySelector('.adapt_value'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    rangeDeadline = document.querySelector('.range-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    calcDescription = document.querySelector('.calc-description'),
    metrikaYandex = document.getElementById('metrikaYandex'),
    analyticsGoogle = document.getElementById('analyticsGoogle'),
    sendOrder = document.getElementById('sendOrder'),
    cardHead = document.querySelector('.card-head'),
    totalPriceElem = document.querySelector('.total_price'),
    firstFieldset = document.querySelector('.first-fieldset');


const declOfNum = (n, titles) => n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
const hideElem = elem => elem.style.display = 'none';
const showElem = elem => elem.style.display = 'block';

const dopOptionsString = (yandex, google, order) => {
    let str = '';

    if (yandex || google || order) {
        str += 'Подключим';

        if (yandex) {
            str += ' Яндекс Метрику';

            if (google && order) {
                str += ', Гугл Аналитику и отправку заявок на почту или в телеграм.';
                return str;
            }

            if (google || order) {
                str += ' и';
            }
        }

        if (google) {
            str += ' Гугл Аналитику';

            if (order) {
                str += ' и';
            }
        }

        if (order) {
            str += ' отправку заявок на почту или в телеграм';
        }
        str += '.';
    }
    return str;
};

const renderTextContent = (total, site, maxdays, mindays) => {
    typeSite.textContent = site;
    totalPrice.textContent = total;
    maxDeadline.textContent = declOfNum(maxdays, DAY_STRING);
    rangeDeadline.max = maxdays;
    rangeDeadline.min = mindays;
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);

    adaptValue.textContent = adapt.checked ? 'Да' : 'Нет';
    mobileTemplatesValue.textContent = mobileTemplates.checked ? 'Да' : 'Нет';
    desktopTemplatesValue.textContent = desktopTemplates.checked ? 'Да' : 'Нет';
    editableValue.textContent = editable.checked ? 'Да' : 'Нет';

    calcDescription.textContent = `
    Сделаем ${site}${adapt.checked ? ', адаптированный под мобильные устройства и планшеты' : ''}.
    ${editable.checked ? 'Установим панель админстратора, чтобы вы могли самостоятельно менять содержание на сайте без разработчика.' : ''}
    ${dopOptionsString(metrikaYandex.checked, analyticsGoogle.checked, sendOrder.checked)}`;
};

const disabledMobileTemplates = () => {
    if (adapt.checked) {
        mobileTemplates.disabled = false;
    } else {
        mobileTemplates.disabled = true;
        mobileTemplates.checked = false;
    }
};

const priceCalculation = (elem = {}) => {

    const {
        whichSite,
        price,
        deadlineDay,
        deadlinePercent
    } = DATA;

    let result = 0,
        index = 0,
        options = [],
        site = '',
        maxDeadlineDays = deadlineDay[index][1],
        minDeadlineDays = deadlineDay[index][0],
        overPercent = 0;

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }

    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = whichSite.indexOf(item.value);
            maxDeadlineDays = deadlineDay[index][1];
            minDeadlineDays = deadlineDay[index][0];
            site = item.dataset.site;
        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        } else if (item.classList.contains('want-faster') && item.checked) {
            const overDay = maxDeadlineDays - rangeDeadline.value;
            overPercent = overDay * deadlinePercent[index] / 100;
        }
    };

    result += price[index];

    options.forEach(function (key) {
        if (typeof DATA[key] === 'number') {
            key === 'sendOrder' ? result += DATA[key] : result += DATA.price[index] * DATA[key] / 100;
        } else {
            if (key === 'desktopTemplates') {
                result += price[index] * DATA[key][index] / 100;
            } else {
                result += DATA[key][index];
            }
        }
    });

    result += result * overPercent;

    renderTextContent(result, site, maxDeadlineDays, minDeadlineDays);
};

const callBackForm = event => {
    const target = event.target;

    disabledMobileTemplates();

    if (target.classList.contains('want-faster')) {
        (target.checked) ? showElem(fastRange): hideElem(fastRange);
        priceCalculation(target);
    }

    if (target.classList.contains('calc-handler')) {
        priceCalculation(target);
    }
};

const moveBackTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom > document.documentElement.clientHeight + 200) {
        totalPriceElem.classList.remove('totalPriceBottom');
        firstFieldset.after(totalPriceElem);
        window.removeEventListener('scroll', moveBackTotal);
        window.addEventListener('scroll', moveTotal);
    }
};

const moveTotal = () => {
    if (document.documentElement.getBoundingClientRect().bottom < document.documentElement.clientHeight + 200) {
        totalPriceElem.classList.add('totalPriceBottom');
        endButton.before(totalPriceElem);
        window.removeEventListener('scroll', moveTotal);
        window.addEventListener('scroll', moveBackTotal);
    }
};

const pageToTop = () => {
    document.documentElement.scrollTop = 30;
};

startButton.addEventListener('click', () => {
    hideElem(firstScreen);
    showElem(mainForm);

    window.addEventListener('scroll', moveTotal);
});

endButton.addEventListener('click', () => {
    for (const elem of formCalculate.elements) {
        (elem.tagName === 'FIELDSET') ? hideElem(elem): showElem(elem);
    };

    cardHead.textContent = 'Заявка на разработку сайта';
    hideElem(totalPriceElem);
    showElem(total);
    pageToTop();
});

formCalculate.addEventListener('change', callBackForm);

priceCalculation();