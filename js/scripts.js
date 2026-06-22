(function ($) {
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


    // SEARCH BOX
    $('.navbar .search').on('click', function (e) {
      $(this).toggleClass('open');
      $(".search-box").toggleClass('active');
      $("body").toggleClass("overflow");
    });


    // HAMBURGER MENU
    $('.hamburger').on('click', function (e) {
      $(this).toggleClass('open');
      $(".side-widget").toggleClass('active');
      $("body").toggleClass("overflow");
    });


    // SCROLL TOP
    $('.scroll-top').on('click', function (e) {
      $("html, body").animate({
        scrollTop: 0
      }, 600);
      return false;
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
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
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
    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
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
  var swiper = new Swiper('.project-slider', {
    speed: SWIPER_SPEED,
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    centeredSlides: true,
    pagination: {
      el: '.swiper-pagination',
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
    }
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
    navigation: {
      nextEl: '.button-next',
      prevEl: '.button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
  });

  if ($(".slider-main")[0]) {
    mainslider.controller.control = slidercontent;
    slidercontent.controller.control = mainslider;
  } else {}


  // DATA BACKGROUND (color or photo + black overlay min 50%)
  var bgOverlay = "linear-gradient(180deg, rgba(18,18,18,0.6) 0%, rgba(18,18,18,0.5) 100%)";
  $("[data-background]").each(function () {
    var bg = $(this).attr("data-background");
    if (!bg) return;
    var isColor = bg.charAt(0) === "#" || bg.indexOf("rgb") === 0;
    if (isColor) {
      $(this).css("background", bg);
    } else {
      $(this).addClass("bg-photo");
      $(this).css({
        backgroundColor: "#121212",
        backgroundImage: bgOverlay + ", url(" + bg + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
      });
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
