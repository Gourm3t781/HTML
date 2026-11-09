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
  // ============================================================

  const gallerySlider = (typeof window.jQuery === 'function') ? window.jQuery('#gallery-slider') : null;
  const galleryPager = document.getElementById('gallery-pager');

  function updateGalleryPager() {
    if (!gallerySlider || !galleryPager) {
      return;
    }
    const slick = gallerySlider.slick('getSlick');
    const slideCount = slick.slideCount;
    const slidesToShow = slick.options.slidesToShow;
    const slidesToScroll = slick.options.slidesToScroll;
    // Количество страниц: сколько раз можно прокрутить по slidesToScroll
    const totalPages = Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1;
    let currentPage = Math.floor(slick.currentSlide / slidesToScroll) + 1;
    // На последней странице слайды «прижаты» к правому краю
    if (slick.currentSlide >= slideCount - slidesToShow) {
      currentPage = totalPages;
    }
    galleryPager.textContent = 'Страница ' + currentPage + ' из ' + totalPages;
  }

  if (gallerySlider && galleryPager && gallerySlider.length > 0 && typeof gallerySlider.slick === 'function') {
    // ВАЖНО: подписка на afterChange/reInit, а не на init — событие init
    // срабатывает внутри конструктора Slick, когда экземпляр ещё не сохранён.
    gallerySlider.on('afterChange reInit', updateGalleryPager);
    gallerySlider.slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: false,
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

  // ============================================================
  // ЗАДАНИЕ 8. Попап с формой обратной связи.
  // History API (смена URL + закрытие кнопкой «Назад»),
  // LocalStorage (сохранение черновика), fetch (отправка на сервер).
  // ============================================================

  // TODO: зарегистрируйся на https://formcarry.com, создай форму
  // и замени XXXXXXXX на ID своей формы из личного кабинета.
  const FEEDBACK_ENDPOINT = 'https://formcarry.com/s/XXXXXXXX';
  const FEEDBACK_STORAGE_KEY = 'feedbackFormData';

  const feedbackOverlay = document.getElementById('feedback-overlay');
  const feedbackModal = document.getElementById('feedback-modal');
  const feedbackCloseButton = document.getElementById('feedback-close-btn');
  const feedbackOpenButton = document.getElementById('feedback-open-btn');
  const feedbackForm = document.getElementById('feedback-form');
  const feedbackStatus = document.getElementById('feedback-status');
  const feedbackFioInput = document.getElementById('feedback-fio');
  const feedbackEmailInput = document.getElementById('feedback-email');
  const feedbackPhoneInput = document.getElementById('feedback-phone');
  const feedbackOrganizationInput = document.getElementById('feedback-organization');
  const feedbackMessageInput = document.getElementById('feedback-message');
  const feedbackAgreementCheckbox = document.getElementById('feedback-agreement');

  function isFeedbackOpen() {
    return !feedbackOverlay.classList.contains('d-none');
  }

  function openFeedbackModal(pushState) {
    feedbackOverlay.classList.remove('d-none');
    document.body.classList.add('feedback-no-scroll');
    if (pushState) {
      // Меняем URL страницы через History API
      history.pushState({ feedbackOpen: true }, '', '#feedback');
    }
    feedbackFioInput.focus();
  }

  function closeFeedbackModal(fromPopstate) {
    if (!isFeedbackOpen()) {
      return;
    }
    feedbackOverlay.classList.add('d-none');
    document.body.classList.remove('feedback-no-scroll');
    if (!fromPopstate) {
      // Закрытие через крестик/Esc/фон — убираем запись истории
      history.back();
    }
  }

  function collectFeedbackData() {
    return {
      fio: feedbackFioInput.value.trim(),
      email: feedbackEmailInput.value.trim(),
      phone: feedbackPhoneInput.value.trim(),
      organization: feedbackOrganizationInput.value.trim(),
      message: feedbackMessageInput.value.trim(),
      agreement: feedbackAgreementCheckbox.checked
    };
  }

  // Сохраняем последние введенные значения в LocalStorage
  function saveFeedbackDraft() {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(collectFeedbackData()));
  }

  // Восстанавливаем значения при повторном открытии страницы
  function restoreFeedbackDraft() {
    const savedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!savedData) {
      return;
    }
    const draft = JSON.parse(savedData);
    if (draft && typeof draft === 'object') {
      feedbackFioInput.value = draft.fio || '';
      feedbackEmailInput.value = draft.email || '';
      feedbackPhoneInput.value = draft.phone || '';
      feedbackOrganizationInput.value = draft.organization || '';
      feedbackMessageInput.value = draft.message || '';
      feedbackAgreementCheckbox.checked = draft.agreement === true;
    }
  }

  function showFeedbackStatus(text, styleClass) {
    feedbackStatus.textContent = text;
    feedbackStatus.className = 'feedback-status mt-3 fw-medium ' + styleClass;
  }

  // Отправка данных на сервер без перезагрузки страницы (fetch)
  function submitFeedback() {
    showFeedbackStatus('Отправка...', 'feedback-status-info');
    fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(collectFeedbackData())
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP-ошибка: ' + response.status);
        }
        return response.json();
      })
      .then(function (result) {
        if (result && result.status === 'success') {
          // При успешной отправке очищаем данные формы и LocalStorage
          localStorage.removeItem(FEEDBACK_STORAGE_KEY);
          feedbackForm.reset();
          showFeedbackStatus('Сообщение успешно отправлено! Мы свяжемся с вами.', 'feedback-status-success');
        } else {
          throw new Error((result && result.message) ? result.message : 'Сервер вернул ошибку.');
        }
      })
      .catch(function (error) {
        showFeedbackStatus('Ошибка отправки: ' + error.message, 'feedback-status-error');
      });
  }

  if (feedbackOverlay && feedbackModal && feedbackCloseButton && feedbackOpenButton && feedbackForm
    && feedbackStatus && feedbackFioInput && feedbackEmailInput && feedbackPhoneInput
    && feedbackOrganizationInput && feedbackMessageInput && feedbackAgreementCheckbox) {
    feedbackOpenButton.addEventListener('click', function (event) {
      event.preventDefault();
      openFeedbackModal(true);
    });

    feedbackCloseButton.addEventListener('click', function () {
      closeFeedbackModal(false);
    });

    // Закрытие по клику на затемненный фон
    feedbackOverlay.addEventListener('click', function (event) {
      if (event.target === feedbackOverlay) {
        closeFeedbackModal(false);
      }
    });

    // Закрытие по клавише Esc
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isFeedbackOpen()) {
        closeFeedbackModal(false);
      }
    });

    // Кнопка «Назад» в браузере закрывает форму
    window.addEventListener('popstate', function (event) {
      const shouldOpen = Boolean(event.state && event.state.feedbackOpen);
      if (shouldOpen && !isFeedbackOpen()) {
        openFeedbackModal(false);
      } else if (!shouldOpen && isFeedbackOpen()) {
        closeFeedbackModal(true);
      }
    });

    feedbackForm.addEventListener('input', saveFeedbackDraft);
    feedbackForm.addEventListener('submit', function (event) {
      event.preventDefault();
      submitFeedback();
    });

    restoreFeedbackDraft();
  }
});
