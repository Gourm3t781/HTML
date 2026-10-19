document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- ЛОГИКА КАЛЬКУЛЯТОРА ИЗ ЛАБ 5 ---
  const calcButtonL5 = document.getElementById('calc-btn-l5');
  const quantityInputL5 = document.getElementById('calc-quantity-l5');
  const productSelectL5 = document.getElementById('product-select-l5');
  const resultDivL5 = document.getElementById('calc-result-output-l5');
  const errorDivL5 = document.getElementById('calc-error-output-l5');

  if (calcButtonL5 && quantityInputL5 && productSelectL5 && resultDivL5 && errorDivL5) {
    calcButtonL5.addEventListener('click', function (event) {
      event.preventDefault();
      resultDivL5.textContent = '';
      errorDivL5.textContent = '';

      const quantityValue = quantityInputL5.value.trim();
      const regex = /^\d+$/;

      if (!regex.test(quantityValue)) {
        errorDivL5.textContent = 'Ошибка: введите целое неотрицательное число для количества товара.';
        return;
      }

      const quantity = parseInt(quantityValue, 10);
      if (quantity <= 0) {
        errorDivL5.textContent = 'Ошибка: количество товара должно быть больше нуля.';
        return;
      }

      const price = parseFloat(productSelectL5.value);
      if (isNaN(price)) {
        errorDivL5.textContent = 'Ошибка: выбран некорректный товар.';
        return;
      }

      const totalCost = price * quantity;
      resultDivL5.textContent = 'Стоимость заказа: ' + totalCost.toLocaleString('ru-RU') + ' руб.';
    });
  }


  // --- ЛОГИКА ДИНАМИЧЕСКОГО КАЛЬКУЛЯТОРА ИЗ ЛАБ 6 ---
  const quantityInputL6 = document.getElementById('quantity-l6');
  const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
  const selectContainer = document.getElementById('select-container');
  const serviceSelectL6 = document.getElementById('service-select-l6');
  const checkboxContainer = document.getElementById('checkbox-container');
  const serviceCheckbox = document.getElementById('service-checkbox-l6');
  const resultDivL6 = document.getElementById('result-output-l6');
  const errorDivL6 = document.getElementById('error-output-l6');

  if (quantityInputL6 && serviceRadios.length && selectContainer && serviceSelectL6 && checkboxContainer && serviceCheckbox && resultDivL6 && errorDivL6) {
    function calculateTotalL6() {
      errorDivL6.textContent = '';
      const quantityValue = quantityInputL6.value.trim();

      const regex = /^\d+$/;
      if (!regex.test(quantityValue)) {
        errorDivL6.textContent = 'Ошибка: введите целое положительное число.';
        resultDivL6.textContent = 'Стоимость сборки: 0 руб.';
        return;
      }

      const quantity = parseInt(quantityValue, 10);
      if (quantity <= 0) {
        errorDivL6.textContent = 'Ошибка: количество должно быть больше нуля.';
        resultDivL6.textContent = 'Стоимость сборки: 0 руб.';
        return;
      }

      const checkedRadio = document.querySelector('input[name="serviceType"]:checked');
      if (!checkedRadio) {
        return;
      }

      const basePrice = parseFloat(checkedRadio.value);
      const checkedRadioId = checkedRadio.id;

      let additionalOptionPrice = 0;
      let propertyPrice = 0;

      if (checkedRadioId === 'type1') {
        selectContainer.style.display = 'none';
        checkboxContainer.style.display = 'none';
      } else if (checkedRadioId === 'type2') {
        selectContainer.style.display = 'block';
        checkboxContainer.style.display = 'none';
        additionalOptionPrice = parseFloat(serviceSelectL6.value) || 0;
      } else if (checkedRadioId === 'type3') {
        selectContainer.style.display = 'none';
        checkboxContainer.style.display = 'block';
        if (serviceCheckbox.checked) {
          propertyPrice = parseFloat(serviceCheckbox.value) || 0;
        }
      }

      const total = (basePrice + additionalOptionPrice + propertyPrice) * quantity;
      resultDivL6.textContent = 'Стоимость сборки: ' + total.toLocaleString('ru-RU') + ' руб.';
    }

    quantityInputL6.addEventListener('input', calculateTotalL6);
    serviceSelectL6.addEventListener('change', calculateTotalL6);
    serviceCheckbox.addEventListener('change', calculateTotalL6);

    serviceRadios.forEach(function (radio) {
      radio.addEventListener('change', calculateTotalL6);
    });

    calculateTotalL6();
  }


  // --- ЛОГИКА СЛАЙДЕРА / ГАЛЕРЕИ ИЗ ЛАБ 7 ---
  const sliderImg = document.getElementById('slider-img');
  const sliderCaption = document.getElementById('slider-caption');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');

  if (sliderImg && sliderCaption && btnPrev && btnNext) {
    const slides = [
      { src: 'image1.jpg', caption: 'Сборка системного блока ПК' },
      { src: 'image2.jpg', caption: 'Процессор AMD Ryzen 7, установленный в сокет AM4' },
      { src: 'image3.jpg', caption: 'Игровые комплектующие и процессор' },
      { src: 'image4.jpg', caption: 'Зеленая материнская плата и микросхема' }
    ];

    let currentIndex = 0;
    let autoSlideInterval = null;

    function updateSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      sliderImg.src = slides[currentIndex].src;
      sliderCaption.textContent = slides[currentIndex].caption;
    }

    btnPrev.addEventListener('click', function () {
      updateSlide(currentIndex - 1);
      resetAutoSlide();
    });

    btnNext.addEventListener('click', function () {
      updateSlide(currentIndex + 1);
      resetAutoSlide();
    });

    function startAutoSlide() {
      autoSlideInterval = setInterval(function () {
        updateSlide(currentIndex + 1);
      }, 4000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    startAutoSlide();
  }


  // --- ЛОГИКА ПОПАПА И ФОРМЫ ОБРАТНОЙ СВЯЗИ (ЛАБОРАТОРНАЯ 8 СО ВСЕМИ ПОЛЯМИ ИЗ ЛАБ 7) ---
  const openFormBtn = document.getElementById('open-form-btn');
  const formAnchorLink = document.getElementById('form-anchor-link');
  const closeFormBtn = document.getElementById('close-form-btn');
  const formPopupOverlay = document.getElementById('form-popup-overlay');
  const feedbackForm = document.getElementById('feedback-form');
  const formStatusMsg = document.getElementById('form-status-msg');

  const fieldFio = document.getElementById('field-fio');
  const fieldTel = document.getElementById('field-tel');
  const fieldEmail = document.getElementById('field-email');
  const fieldDate = document.getElementById('field-date');
  const fieldLanguages = document.getElementById('field-languages');
  const fieldBio = document.getElementById('field-bio');
  const checkContract = document.getElementById('check-contract');
  const genderRadios = document.querySelectorAll('input[name="radio-gender"]');

  // 1. Восстановление данных из localStorage при загрузке страницы
  if (localStorage.getItem('feedback_fio')) fieldFio.value = localStorage.getItem('feedback_fio');
  if (localStorage.getItem('feedback_tel')) fieldTel.value = localStorage.getItem('feedback_tel');
  if (localStorage.getItem('feedback_email')) fieldEmail.value = localStorage.getItem('feedback_email');
  if (localStorage.getItem('feedback_date')) fieldDate.value = localStorage.getItem('feedback_date');
  if (localStorage.getItem('feedback_bio')) fieldBio.value = localStorage.getItem('feedback_bio');
  if (localStorage.getItem('feedback_contract') === 'true') {
    checkContract.checked = true;
  }
  
  const savedGender = localStorage.getItem('feedback_gender');
  if (savedGender) {
    const radioToSet = document.getElementById('gender-' + savedGender);
    if (radioToSet) radioToSet.checked = true;
  }

  const savedLangs = JSON.parse(localStorage.getItem('feedback_languages') || '[]');
  if (savedLangs.length > 0 && fieldLanguages) {
    Array.from(fieldLanguages.options).forEach(opt => {
      opt.selected = savedLangs.includes(opt.value);
    });
  }

  // Функция сохранения в localStorage при вводе
  function saveToLocalStorage() {
    localStorage.setItem('feedback_fio', fieldFio.value);
    localStorage.setItem('feedback_tel', fieldTel.value);
    localStorage.setItem('feedback_email', fieldEmail.value);
    localStorage.setItem('feedback_date', fieldDate.value);
    localStorage.setItem('feedback_bio', fieldBio.value);
    localStorage.setItem('feedback_contract', checkContract.checked);

    const checkedGender = document.querySelector('input[name="radio-gender"]:checked');
    if (checkedGender) {
      localStorage.setItem('feedback_gender', checkedGender.value);
    }

    if (fieldLanguages) {
      const selectedLangs = Array.from(fieldLanguages.selectedOptions).map(opt => opt.value);
      localStorage.setItem('feedback_languages', JSON.stringify(selectedLangs));
    }
  }

  [fieldFio, fieldTel, fieldEmail, fieldDate, fieldBio, fieldLanguages].forEach(el => {
    if (el) el.addEventListener('input', saveToLocalStorage);
    if (el) el.addEventListener('change', saveToLocalStorage);
  });
  checkContract.addEventListener('change', saveToLocalStorage);
  genderRadios.forEach(r => r.addEventListener('change', saveToLocalStorage));

  // Функция открытия попапа с изменением History API
  function openPopup(pushHistory = true) {
    formPopupOverlay.style.display = 'flex';
    formStatusMsg.textContent = '';
    if (pushHistory) {
      history.pushState({ popupOpen: true }, '', '#form-popup');
    }
  }

  // Функция закрытия попапа
  function closePopup(popHistory = false) {
    formPopupOverlay.style.display = 'none';
    if (!popHistory && window.location.hash === '#form-popup') {
      history.back();
    }
  }

  if (openFormBtn) {
    openFormBtn.addEventListener('click', function () {
      openPopup(true);
    });
  }

  if (formAnchorLink) {
    formAnchorLink.addEventListener('click', function (e) {
      e.preventDefault();
      openPopup(true);
    });
  }

  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', function () {
      closePopup(false);
    });
  }

  formPopupOverlay.addEventListener('click', function (e) {
    if (e.target === formPopupOverlay) {
      closePopup(false);
    }
  });

  // Поддержка кнопки «Назад» в браузере (History API)
  window.addEventListener('popstate', function () {
    if (window.location.hash !== '#form-popup') {
      formPopupOverlay.style.display = 'none';
    } else {
      openPopup(false);
    }
  });

  if (window.location.hash === '#form-popup') {
    openPopup(false);
  }

  // 2. Отправка формы без перезагрузки через fetch
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatusMsg.textContent = 'Отправка данных...';
      formStatusMsg.className = 'mt-2 text-center small fw-medium text-info';

      const formData = new FormData(feedbackForm);

      fetch(feedbackForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          formStatusMsg.textContent = 'Сообщение успешно отправлено!';
          formStatusMsg.className = 'mt-2 text-center small fw-medium text-success';
          
          // Очистка полей формы и localStorage после успешной отправки
          feedbackForm.reset();
          localStorage.removeItem('feedback_fio');
          localStorage.removeItem('feedback_tel');
          localStorage.removeItem('feedback_email');
          localStorage.removeItem('feedback_date');
          localStorage.removeItem('feedback_bio');
          localStorage.removeItem('feedback_contract');
          localStorage.removeItem('feedback_languages');
          localStorage.removeItem('feedback_gender');

          setTimeout(() => {
            closePopup(false);
          }, 2000);
        } else {
          throw new Error('Ошибка сервера');
        }
      })
      .catch(error => {
        formStatusMsg.textContent = 'Ошибка при отправке. Попробуйте позже.';
        formStatusMsg.className = 'mt-2 text-center small fw-medium text-danger';
      });
    });
  }
});