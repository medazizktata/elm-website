(function ($) {
  function currentPageName() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function pageNameFromHref(href) {
    if (!href) return '';
    var path = href.split('#')[0].split('?')[0].trim();
    if (!path || path === '/') return 'index.html';
    return path.split('/').pop() || 'index.html';
  }

  function scrollToHash() {
    var hash = window.location.hash;
    if (!hash) return;
    var $target = $(hash);
    if (!$target.length) return;
    var offset = ($('.navbar').outerHeight() || 80) + 24;
    $('html, body').stop(true).animate({
      scrollTop: $target.offset().top - offset
    }, 600);
  }

  $(document).ready(function () {
    "use strict";


    // BACK BUTTON RELOAD
    window.onpageshow = function (event) {
      if (event.persisted) {
        window.location.reload()
      }
    };


    /* MENU TOGGLE */
    $('.side-widget .site-menu ul li i').on('click', function (e) {
      $(this).parent().children('.side-widget .site-menu ul li ul').toggle();
      return true;
    });


    // TAB
    $(".tab-nav li").on('click', function (e) {
      $(".tab-item").hide();
      $(".tab-nav li").removeClass('active');
      $(this).addClass("active");
      var selected_tab = $(this).find("a").attr("href");
      $(selected_tab).stop().show();
      return false;
    });


    // HAMBURGER MENU
    function setSideWidgetOpen(open) {
      $('.hamburger').toggleClass('open', open);
      $('.side-widget').toggleClass('active', open);
      $('body').toggleClass('overflow', open);
    }

    $('.hamburger').on('click', function (e) {
      setSideWidgetOpen(!$('.side-widget').hasClass('active'));
    });

    $('.side-widget-close').on('click', function (e) {
      e.preventDefault();
      setSideWidgetOpen(false);
    });


    // SCROLL TOP
    $('.scroll-top').on('click', function (e) {
      $("html, body").animate({
        scrollTop: 0
      }, 600);
      return false;
    });


    $('a[href*="#"]').on('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      var hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      var hash = href.slice(hashIndex);
      if (pageNameFromHref(href) !== currentPageName()) return;
      var $target = $(hash);
      if (!$target.length) return;
      e.preventDefault();
      if (typeof $(this).data('fancybox') !== 'undefined') return;
      history.pushState(null, '', hash);
      scrollToHash();
    });

    // PAGE TRANSITION
    $('body a').on('click', function (e) {
      if (typeof $(this).data('fancybox') != 'undefined') {
        return;
      }
      var url = this.getAttribute("href");
      if (!url || url.charAt(0) === '#') {
        return;
      }
      if (/^(mailto:|tel:|javascript:)/i.test(url)) {
        return;
      }
      if (/^https?:\/\//i.test(url)) {
        return;
      }
      if (pageNameFromHref(url) === currentPageName()) {
        e.preventDefault();
        var hashIndex = url.indexOf('#');
        var hash = hashIndex !== -1 ? url.slice(hashIndex) : '';
        if (hash.length > 1 && $(hash).length) {
          history.pushState(null, '', hash);
          scrollToHash();
        } else {
          $('html, body').stop(true).animate({ scrollTop: 0 }, 600);
          history.pushState(null, '', window.location.pathname);
        }
        if ($('.side-widget').hasClass('active')) {
          setSideWidgetOpen(false);
        }
        return;
      }
      e.preventDefault();
      $('.page-transition').toggleClass("active");
      setTimeout(function () {
        window.location = url;
      }, 450);
    });


    // LOGO HOVER
    $(".logo-item").hover(function () {
        $('.logo-item').not(this).css({
          "opacity": "0.3"
        });
      },
      function () {
        $('.logo-item').not(this).css({
          "opacity": "1"
        });
      });


  });
  // END DOCUMENT READY

  $(window).on('load', function () {
    if (window.location.hash) {
      setTimeout(scrollToHash, 350);
    }
  });


  // MASONRY
  $(window).load(function () {
    $('.projects').isotope({
      itemSelector: '.projects li',
      percentPosition: true
    });
  });


  // ISOTOPE FILTER
  var $container = $('.projects');
  $container.isotope({
    filter: '*',
    animationOptions: {
      duration: 750,
      easing: 'linear',
      queue: false
    }
  });


  // ISOTOPE FILTER
  $('.isotope-filter li').on('click', function (e) {
    $('.isotope-filter li.current').removeClass('current');
    $(this).addClass('current');

    var selector = $(this).attr('data-filter');
    $container.isotope({
      filter: selector,
      animationOptions: {
        duration: 750,
        easing: 'linear',
        queue: false
      }
    });
    return false;
  });


  // RANGE SLIDER
  var rangeSlider = function () {
    var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

    slider.each(function () {

      value.each(function () {
        var value = $(this).prev().attr('value');
        $(this).html(value);
      });

      range.on('input', function () {
        $(this).next(value).html(this.value);
      });
    });
  };

  rangeSlider();


  var SWIPER_SPEED = 220;

  // OUR HISTORY
  var swiper = new Swiper('.our-history', {
    speed: SWIPER_SPEED,
    slidesPerView: 5,
    spaceBetween: 0,
    pagination: {
      el: '.our-history .swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.our-history .button-next',
      prevEl: '.our-history .button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    }
  });


  // TESTIMONIALS SLIDER
  var swiper = new Swiper('.testimonials-slider', {
    speed: SWIPER_SPEED,
    slidesPerView: 2,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: '.testimonials-slider .swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.testimonials-slider .button-next',
      prevEl: '.testimonials-slider .button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
    }
  });


  // PROJECT SLIDER
  $(".project-slider").each(function () {
    var $slider = $(this);
    new Swiper(this, {
      speed: SWIPER_SPEED,
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 30,
      centeredSlides: true,
      navigation: {
        nextEl: $slider.find(".project-slider__arrow--next")[0],
        prevEl: $slider.find(".project-slider__arrow--prev")[0],
      },
      pagination: {
        el: $slider.find(".swiper-pagination")[0],
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
    });
  });


  // SLIDER
  var mainslider = new Swiper('.slider-main', {
    speed: SWIPER_SPEED,
    spaceBetween: 0,
    autoplay: {
      delay: 9500,
      disableOnInteraction: false,
    },
    loop: true,
    direction: 'vertical',
    loopedSlides: 1,
    touchRatio: 0,
    thumbs: {
      swiper: slidercontent
    }
  });


  // SLIDER CONTENT
  var slidercontent = new Swiper('.slider-content', {
    speed: SWIPER_SPEED,
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1,
    touchRatio: 0,
    slideToClickedSlide: true,
    loop: true,
  });

  if ($(".slider-main")[0]) {
    mainslider.controller.control = slidercontent;
    slidercontent.controller.control = mainslider;
  } else {}


  // DATA BACKGROUND (color or photo + overlay — hero slides stay clean)
  var bgOverlay = "linear-gradient(180deg, rgba(18,18,18,0.6) 0%, rgba(18,18,18,0.5) 100%)";
  $("[data-background]").each(function () {
    var bg = $(this).attr("data-background");
    if (!bg) return;
    var isColor = bg.charAt(0) === "#" || bg.indexOf("rgb") === 0;
    if (isColor) {
      if (/^#ecebe4$/i.test(bg)) return;
      $(this).css("background", bg);
    } else {
      var isHeroSlide = $(this).closest(".slider-main").length > 0;
      if (isHeroSlide) {
        $(this).css({
          backgroundImage: "url(" + bg + ")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      } else {
        $(this).addClass("bg-photo");
        $(this).css({
          backgroundColor: "#121212",
          backgroundImage: bgOverlay + ", url(" + bg + ")",
          backgroundSize: "cover",
          backgroundPosition: "center",
        });
      }
    }
  });


  // COUNTER
  $(document).scroll(function () {
    $('.odometer').each(function () {
      var parent_section_postion = $(this).closest('section').position();
      var parent_section_top = parent_section_postion.top;
      if ($(document).scrollTop() > parent_section_top - 300) {
        if ($(this).data('status') == 'yes') {
          $(this).html($(this).data('count'));
          $(this).data('status', 'no');
        }
      }
    });
  });


  // STICKY NAVBAR — transparent at top, solid bg on scroll
  function updateNavbar() {
    $('.navbar').toggleClass('sticky', $(document).scrollTop() > 20);
  }
  $(window).on('scroll touchmove', updateNavbar);
  updateNavbar();

  // FORM CALCULATOR (legacy Consto mortgage widget — skip if removed)
  $(".form.calculator-form").change(function () {
    var totalPrice = parseFloat($('#value1').val()) + parseFloat($('#value2').val()) + parseFloat($('#value3').val()) + parseFloat($('#value4').val()),
      values = [];

    $('input[type=checkbox], input[type=radio]').each(function () {
      if ($(this).is(':checked')) {
        values.push($(this).val());
        totalPrice += parseInt($(this).val());
      }
    });

    $("#result").text(totalPrice);


  });

  $(".form.calculator-form").change(function () {
    total = 0;
    totalPrice();
  }).trigger("change");


})(jQuery);
