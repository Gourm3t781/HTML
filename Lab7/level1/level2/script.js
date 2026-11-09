document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ============================================================
  // ЗАДАНИЕ 6. Калькулятор стоимости услуги
  // Тип 1 «Диагностика» — без опций и свойств.
  // Тип 2 «Сборка ПК» — опция выбирается селектом.
  // Тип 3 «Выездная настройка» — свойство выбирается чекбоксом.
  // Цена пересчитывается динамически, без перезагрузки страницы.
  // ============================================================

  const SERVICE_BASE_PRICES = {
    diagnostics: 800,
    build: 5000,
    tuneup: 1500
  };
  const SERVICE_PROPERTY_PRICE = 1000;

  const serviceForm = document.getElementById('service-calc-form');
  const serviceQuantityInput = document.getElementById('service-quantity');
  const serviceOptionBlock = document.getElementById('service-option-block');
  const serviceOptionSelect = document.getElementById('service-option');
  const servicePropertyBlock = document.getElementById('service-property-block');
  const servicePropertyCheckbox = document.getElementById('service-property');
  const serviceResultDiv = document.getElementById('service-calc-result');
  const serviceErrorDiv = document.getElementById('service-calc-error');

  function getServiceType() {
    const checkedRadio = serviceForm.querySelector('input[name="service-type"]:checked');
    return checkedRadio ? checkedRadio.value : 'diagnostics';
  }

  // Показываем селект только у второго типа, чекбокс — только у третьего
  function updateServiceBlocks() {
    const serviceType = getServiceType();
    serviceOptionBlock.classList.toggle('d-none', serviceType !== 'build');
    servicePropertyBlock.classList.toggle('d-none', serviceType !== 'tuneup');
  }

  function calculateServiceCost() {
    serviceErrorDiv.textContent = '';

    const rawQuantity = serviceQuantityInput.value.trim();
    if (!/^\d+$/.test(rawQuantity)) {
      serviceErrorDiv.textContent = 'Ошибка: количество услуг — целое неотрицательное число.';
      serviceResultDiv.textContent = '';
      return;
    }

    const quantity = parseInt(rawQuantity, 10);
    if (quantity <= 0) {
      serviceErrorDiv.textContent = 'Ошибка: количество услуг должно быть больше нуля.';
      serviceResultDiv.textContent = '';
      return;
    }

    const serviceType = getServiceType();
    let optionPrice = 0;
    let propertyPrice = 0;

    if (serviceType === 'build') {
      optionPrice = parseInt(serviceOptionSelect.value, 10);
      if (Number.isNaN(optionPrice)) {
        optionPrice = 0;
      }
    }

    if (serviceType === 'tuneup' && servicePropertyCheckbox.checked) {
      propertyPrice = SERVICE_PROPERTY_PRICE;
    }

    const basePrice = SERVICE_BASE_PRICES[serviceType] || 0;
    const totalCost = basePrice * quantity + optionPrice + propertyPrice;
    serviceResultDiv.textContent = 'Стоимость услуги: ' + totalCost.toLocaleString('ru-RU') + ' руб.';
  }

  if (serviceForm && serviceQuantityInput && serviceOptionBlock && serviceOptionSelect
    && servicePropertyBlock && servicePropertyCheckbox && serviceResultDiv && serviceErrorDiv) {
    // Пересчет при смене любого элемента формы (радио, селект, чекбокс)
    serviceForm.addEventListener('change', function () {
      updateServiceBlocks();
      calculateServiceCost();
    });
    // Пересчет при изменении количества
    serviceQuantityInput.addEventListener('input', calculateServiceCost);
    updateServiceBlocks();
    calculateServiceCost();
  }

  // ============================================================
  // ЗАДАНИЕ 7. Галерея из 8 изображений — горизонтальный слайдер.
  // jQuery + плагин Slick Slider: на экране 3 изображения,
  // на смартфонах (до 768px) — одно. Стрелки прокрутки и пейджер.
  // Прокрутка циклическая: после последнего изображения снова первое.
  // ============================================================

  const gallerySlider = (typeof window.jQuery === 'function') ? window.jQuery('#gallery-slider') : null;
  const galleryPager = document.getElementById('gallery-pager');

  function updateGalleryPager() {
    if (!gallerySlider || !galleryPager) {
      return;
    }
    const slick = gallerySlider.slick('getSlick');
    const slideCount = slick.slideCount;
    // При циклической прокрутке каждая позиция слайдера — отдельная
    // «страница»: после последнего изображения снова первое.
    // Номер страницы циклически проходит значения 1..slideCount.
    let currentPage = slick.currentSlide + 1;
    if (currentPage > slideCount || currentPage < 1) {
      currentPage = 1;
    }
    galleryPager.textContent = 'Страница ' + currentPage + ' из ' + slideCount;
  }

  if (gallerySlider && galleryPager && gallerySlider.length > 0 && typeof gallerySlider.slick === 'function') {
    // ВАЖНО: подписка на afterChange/reInit, а не на init — событие init
    // срабатывает внутри конструктора Slick, когда экземпляр ещё не сохранён.
    gallerySlider.on('afterChange reInit', updateGalleryPager);
    gallerySlider.slick({
      slidesToShow: 3,
      // При slidesToScroll = 1 циклическая прокрутка работает корректно:
      // после последнего слайда листание продолжается с первого.
      slidesToScroll: 1,
      infinite: true,
      arrows: false,
      dots: false,
      responsive: [
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
    // Первичное обновление пейджера после инициализации слайдера
    updateGalleryPager();

    const galleryPrevButton = document.getElementById('gallery-prev');
    const galleryNextButton = document.getElementById('gallery-next');

    if (galleryPrevButton && galleryNextButton) {
      galleryPrevButton.addEventListener('click', function (event) {
        event.preventDefault();
        gallerySlider.slick('slickPrev');
      });
      galleryNextButton.addEventListener('click', function (event) {
        event.preventDefault();
        gallerySlider.slick('slickNext');
      });
    }
  }
});
