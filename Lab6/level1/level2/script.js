document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const quantityInput = document.getElementById('quantity');
  const serviceRadios = document.querySelectorAll('input[name="serviceType"]');
  const selectContainer = document.getElementById('select-container');
  const serviceSelect = document.getElementById('service-select');
  const checkboxContainer = document.getElementById('checkbox-container');
  const serviceCheckbox = document.getElementById('service-checkbox');
  const resultDiv = document.getElementById('result-output');
  const errorDiv = document.getElementById('error-output');

  function calculateTotal() {
    errorDiv.textContent = '';
    const quantityValue = quantityInput.value.trim();

    // Проверка регулярным выражением (целое положительное число)
    const regex = /^\d+$/;
    if (!regex.test(quantityValue)) {
      errorDiv.textContent = 'Ошибка: введите целое положительное число.';
      resultDiv.textContent = 'Стоимость сборки: 0 руб.';
      return;
    }

    const quantity = parseInt(quantityValue, 10);
    if (quantity <= 0) {
      errorDiv.textContent = 'Ошибка: количество должно быть больше нуля.';
      resultDiv.textContent = 'Стоимость сборки: 0 руб.';
      return;
    }

    // Определение базовoй стоимости и отображение/скрытие блоков
    const checkedRadio = document.querySelector('input[name="serviceType"]:checked');
    const basePrice = parseFloat(checkedRadio.value);
    const checkedRadioId = checkedRadio.id;

    let additionalOptionPrice = 0;
    let propertyPrice = 0;

    if (checkedRadioId === 'type1') {
      // Тип 1: Офисный ПК (без опций и свойств)
      selectContainer.style.display = 'none';
      checkboxContainer.style.display = 'none';
    } else if (checkedRadioId === 'type2') {
      // Тип 2: Игровой ПК (селект отображается)
      selectContainer.style.display = 'block';
      checkboxContainer.style.display = 'none';
      additionalOptionPrice = parseFloat(serviceSelect.value);
    } else if (checkedRadioId === 'type3') {
      // Тип 3: Кастомная станция (чекбокс отображается)
      selectContainer.style.display = 'none';
      checkboxContainer.style.display = 'block';
      if (serviceCheckbox.checked) {
        propertyPrice = parseFloat(serviceCheckbox.value);
      }
    }

    // Итоговый расчет
    const total = (basePrice + additionalOptionPrice + propertyPrice) * quantity;
    resultDiv.textContent = 'Стоимость сборки: ' + total.toLocaleString('ru-RU') + ' руб.';
  }

  // Навешивание обработчиков событий
  quantityInput.addEventListener('input', calculateTotal);
  serviceSelect.addEventListener('change', calculateTotal);
  serviceCheckbox.addEventListener('change', calculateTotal);

  serviceRadios.forEach(function (radio) {
    radio.addEventListener('change', calculateTotal);
  });

  // Первичный расчет при загрузке
  calculateTotal();
});