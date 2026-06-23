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

  function resolveNavPage(current) {
    if (current.indexOf('project-') === 0 || current === 'project-single.html') {
      return 'projects.html';
    }
    if (current.indexOf('solution-') === 0) {
      return 'solutions.html';
    }
    if (current.indexOf('technology-') === 0) {
      return 'technologies.html';
    }
    if (
      current === 'our-story.html' ||
      current === 'why-elm.html' ||
      current === 'uae-compliance.html' ||
      current === 'leadership.html'
    ) {
      return 'who-we-are.html';
    }
    return current;
  }

  function setActiveNav() {
    var current = currentPageName();
    var resolved = resolveNavPage(current);

    $('.site-menu').each(function () {
      var $menu = $(this);
      $menu.find('a.is-active').removeClass('is-active');
      $menu.find('li.is-active-parent').removeClass('is-active-parent');

      var $matches = $menu.find('a[href]').filter(function () {
        return pageNameFromHref(this.getAttribute('href')) === current;
      });

      if (!$matches.length && resolved !== current) {
        $matches = $menu.find('a[href]').filter(function () {
          return pageNameFromHref(this.getAttribute('href')) === resolved;
        });
      }

      $matches.each(function () {
        var $link = $(this);
        $link.addClass('is-active');
        var $parentLi = $link.closest('ul').parent('li');
        if ($parentLi.length) {
          $parentLi.addClass('is-active-parent');
          $parentLi.children('a').first().addClass('is-active');
        }
      });
    });
  }

  $(document).ready(function () {
    "use strict";

    setActiveNav();


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
      if ($('.side-widget').hasClass('active')) {
        setSideWidgetOpen(false);
      }
      window.location = url;
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


  var SWIPER_SPEED = 220;

  // HERO BACKGROUND SLIDESHOW (no controls)
  (function initHeroSlideshow() {
    var $slides = $(".hero__slideshow .hero__slide");
    if ($slides.length < 2) return;

    var index = 0;
    var delay = 7000;

    setInterval(function () {
      $slides.eq(index).removeClass("is-active");
      index = (index + 1) % $slides.length;
      $slides.eq(index).addClass("is-active");
    }, delay);
  })();

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
  var $testimonials = $(".engagement-section .testimonials-slider");
  if ($testimonials.length) {
    new Swiper($testimonials[0], {
      speed: SWIPER_SPEED,
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      centeredSlides: true,
      watchOverflow: true,
      grabCursor: true,
      navigation: {
        nextEl: $testimonials.find(".button-next")[0],
        prevEl: $testimonials.find(".button-prev")[0],
      },
      breakpoints: {
        768: {
          slidesPerView: 1.12,
          spaceBetween: 20,
        },
        1100: {
          slidesPerView: 1.18,
          spaceBetween: 24,
        },
      },
    });
  }

  // PROJECT SLIDER
  $(".project-slider").each(function () {
    var $slider = $(this);
    new Swiper(this, {
      speed: SWIPER_SPEED,
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 24,
      centeredSlides: true,
      slideToClickedSlide: true,
      watchSlidesProgress: true,
      navigation: {
        nextEl: $slider.find(".project-slider__arrow--next")[0],
        prevEl: $slider.find(".project-slider__arrow--prev")[0],
      },
      pagination: {
        el: $slider.find(".swiper-pagination")[0],
        clickable: true,
      },
      breakpoints: {
        768: {
          spaceBetween: 30,
        },
        1024: {
          spaceBetween: 36,
        },
      },
    });
  });


  // DATA BACKGROUND (color or photo + overlay)
  var bgOverlay = "linear-gradient(180deg, rgba(18,18,18,0.6) 0%, rgba(18,18,18,0.5) 100%)";
  $("[data-background]").each(function () {
    var bg = $(this).attr("data-background");
    if (!bg) return;
    var isColor = bg.charAt(0) === "#" || bg.indexOf("rgb") === 0;
    if (isColor) {
      if (/^#ecebe4$/i.test(bg)) return;
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


})(jQuery);
