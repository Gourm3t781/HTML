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
});