document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const calcButton = document.getElementById('calc-btn');
  const quantityInput = document.getElementById('quantity');
  const productSelect = document.getElementById('product-select');
  const resultDiv = document.getElementById('result-output');
  const errorDiv = document.getElementById('error-output');

  if (!calcButton || !quantityInput || !productSelect || !resultDiv || !errorDiv) {
    return;
  }

  calcButton.addEventListener('click', function (event) {
    event.preventDefault();

    resultDiv.textContent = '';
    errorDiv.textContent = '';

    const quantityValue = quantityInput.value.trim();
    const regex = /^\d+$/;

    if (!regex.test(quantityValue)) {
      errorDiv.textContent = 'Ошибка: введите целое неотрицательное число для количества товара.';
      return;
    }

    const quantity = parseInt(quantityValue, 10);
    if (quantity <= 0) {
      errorDiv.textContent = 'Ошибка: количество товара должно быть больше нуля.';
      return;
    }

    const price = parseFloat(productSelect.value);
    if (isNaN(price)) {
      errorDiv.textContent = 'Ошибка: выбран некорректный товар.';
      return;
    }

    const totalCost = price * quantity;
    resultDiv.textContent = 'Стоимость заказа: ' + totalCost.toLocaleString('ru-RU') + ' руб.';
  });
});