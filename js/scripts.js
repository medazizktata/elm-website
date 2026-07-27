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

 function setPageLoader(active) {
 $('.page-loader').toggleClass('is-active', active);
 }

 var pageLoaderShownAt = Date.now();
 var PAGE_LOADER_NAV_DELAY_MS = 520;
 var PAGE_LOADER_MIN_VISIBLE_MS = 450;
 var PAGE_LOADER_HOME_MIN_MS = 1200;
 var PAGE_LOADER_HOME_TIMEOUT_MS = 4500;
 var PAGE_LOADER_MOBILE_MIN_MS = 0;
 var pageLoaderHidden = false;
 var PAGE_TRANSITION_KEY = 'elm-page-transition';

 function markPageTransition() {
 try {
 sessionStorage.setItem(PAGE_TRANSITION_KEY, '1');
 } catch (e) {}
 }

 function clearPageTransition() {
 try {
 sessionStorage.removeItem(PAGE_TRANSITION_KEY);
 } catch (e) {}
 document.documentElement.classList.remove('is-page-loading');
 }

 function isContinuingPageTransition() {
 return document.documentElement.classList.contains('is-page-loading');
 }

 function isMobileViewport() {
 return window.matchMedia('(max-width: 1023px)').matches;
 }

 function homeLoaderMinMs() {
 if (isMobileViewport()) return PAGE_LOADER_MOBILE_MIN_MS;
 return PAGE_LOADER_HOME_MIN_MS;
 }

 function pageLoaderMinMs() {
 if (isMobileViewport()) return PAGE_LOADER_MOBILE_MIN_MS;
 return PAGE_LOADER_MIN_VISIBLE_MS;
 }

 function hidePageLoader(minMs) {
 if (pageLoaderHidden) return;
 pageLoaderHidden = true;
 var elapsed = Date.now() - pageLoaderShownAt;
 var resolvedMin = minMs == null ? pageLoaderMinMs() : minMs;
 var hideDelay = Math.max(0, resolvedMin - elapsed);
 setTimeout(function () {
 clearPageTransition();
 setPageLoader(false);
 }, hideDelay);
 }

 function waitForHomeHero3dThenHide() {
 if (window.__elmHero3dReady) {
 hidePageLoader(homeLoaderMinMs());
 return;
 }
 var settled = false;
 function finish() {
 if (settled) return;
 settled = true;
 window.removeEventListener('elm:hero3dready', onReady);
 hidePageLoader(homeLoaderMinMs());
 }
 function onReady() {
 finish();
 }
 window.addEventListener('elm:hero3dready', onReady);
 setTimeout(finish, PAGE_LOADER_HOME_TIMEOUT_MS);
 }

 function shouldWaitForHero3d() {
 if (!window.matchMedia('(min-width: 1024px)').matches) return false;
 var mount = document.querySelector('.hero__logo3d');
 return !!(mount && mount.clientWidth && mount.clientHeight);
 }

 function hideLoaderWhenHeroReady() {
 var heroImg = document.querySelector('.hero__media-img');
 if (!heroImg) {
 hidePageLoader(homeLoaderMinMs());
 return;
 }
 function done() {
 hidePageLoader(homeLoaderMinMs());
 }
 if (heroImg.complete && heroImg.naturalWidth) {
 done();
 return;
 }
 heroImg.addEventListener('load', done, { once: true });
 heroImg.addEventListener('error', done, { once: true });
 }

 function deferVideoPosters() {
 if (!('IntersectionObserver' in window)) return;
 document.querySelectorAll('video[data-deferred-poster]').forEach(function (video) {
 var narrow = window.matchMedia('(max-width: 767px)').matches;
 var poster = narrow
 ? video.getAttribute('data-deferred-poster')
 : (video.getAttribute('data-deferred-poster-wide') || video.getAttribute('data-deferred-poster'));
 if (!poster) return;
 var io = new IntersectionObserver(function (entries) {
 if (!entries[0].isIntersecting) return;
 video.setAttribute('poster', poster);
 io.disconnect();
 }, { rootMargin: '240px' });
 io.observe(video);
 });
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
 current === 'uae-compliance.html'
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

 // Cold load: fade loader in. Mid-nav: already covered via html.is-page-loading
 setPageLoader(true);
 if (isContinuingPageTransition()) {
 // Restore fade-out transition after first paint
 requestAnimationFrame(function () {
 requestAnimationFrame(clearPageTransition);
 });
 }
 pageLoaderShownAt = Date.now();
 setActiveNav();
 deferVideoPosters();

 if (document.querySelector('.hero__media-img') && !shouldWaitForHero3d()) {
 hideLoaderWhenHeroReady();
 }


 // BACK BUTTON RELOAD
 window.onpageshow = function (event) {
 if (event.persisted) {
 window.location.reload()
 }
 };


 /* MENU TOGGLE - smooth accordion for mobile drawer subpages */
 $('.side-widget .site-menu__subtoggle').on('click', function (e) {
 e.preventDefault();
 e.stopPropagation();
 var $btn = $(this);
 var $li = $btn.closest('li');
 var $sub = $li.children('ul').first();
 var open = $btn.attr('aria-expanded') === 'true';
 var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var duration = reduce ? 0 : 320;

 if (open) {
 $btn.attr('aria-expanded', 'false');
 $sub.stop(true, true).slideUp(duration);
 } else {
 $btn.attr('aria-expanded', 'true');
 $sub.stop(true, true).slideDown(duration);
 }
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
 $('.side-widget-backdrop').toggleClass('is-active', open).attr('aria-hidden', open ? 'false' : 'true');
 $('body').toggleClass('overflow', open);
 }

 $('.hamburger').on('click', function (e) {
 setSideWidgetOpen(!$('.side-widget').hasClass('active'));
 });

 $('.side-widget-close, .side-widget-backdrop').on('click', function (e) {
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
 markPageTransition();
 setPageLoader(true);
 pageLoaderShownAt = Date.now();
 setTimeout(function () {
 window.location = url;
 }, PAGE_LOADER_NAV_DELAY_MS);
 });

 });
 // END DOCUMENT READY

 $(window).on('load', function () {
 if (pageLoaderHidden) {
 if (window.location.hash) {
 setTimeout(scrollToHash, 350);
 }
 return;
 }
 if (shouldWaitForHero3d()) {
 waitForHomeHero3dThenHide();
 } else {
 hidePageLoader(pageLoaderMinMs());
 }
 if (window.location.hash) {
 setTimeout(scrollToHash, 350);
 }
 });

 $(window).on('pageshow', function (event) {
 if (event.originalEvent && event.originalEvent.persisted) {
 pageLoaderHidden = false;
 setPageLoader(true);
 pageLoaderShownAt = Date.now();
 if (shouldWaitForHero3d()) {
 waitForHomeHero3dThenHide();
 } else {
 hidePageLoader(pageLoaderMinMs());
 }
 }
 });


 // MASONRY / ISOTOPE
 function elmIsRtl() {
 return document.documentElement.getAttribute('dir') === 'rtl';
 }

 function elmIsotopeOpts(extra) {
 return $.extend({
 itemSelector: '.projects li',
 percentPosition: true,
 originLeft: !elmIsRtl(),
 animationOptions: {
 duration: 750,
 easing: 'linear',
 queue: false
 }
 }, extra || {});
 }

 var $container = $('.projects');

 $(window).on('load', function () {
 if (!$container.length || typeof $.fn.isotope !== 'function') return;
 $container.isotope(elmIsotopeOpts());
 });

 if ($container.length && typeof $.fn.isotope === 'function') {
 $container.isotope(elmIsotopeOpts({ filter: '*' }));

 $('.isotope-filter li').on('click', function () {
 $('.isotope-filter li.current').removeClass('current');
 $(this).addClass('current');
 $container.isotope(elmIsotopeOpts({ filter: $(this).attr('data-filter') }));
 return false;
 });

 document.addEventListener('elm:localechange', function () {
 if (!$container.length || !$container.data('isotope')) return;
 $container.isotope('option', { originLeft: !elmIsRtl() });
 $container.isotope('layout');
 });
 }


 var SWIPER_SPEED = 220;

 // OUR STORY scroll timeline
 (function initStoryTimeline() {
 var root = document.querySelector("[data-story-timeline]");
 if (!root) return;

 var scroller = root.querySelector(".story-timeline__scroller");
 var frame = root.querySelector(".story-timeline__frame");
 var cards = Array.prototype.slice.call(root.querySelectorAll(".story-timeline__card"));
 var years = Array.prototype.slice.call(root.querySelectorAll(".story-timeline__years li"));
 var prevBtn = root.querySelector(".story-timeline__prev");
 var nextBtn = root.querySelector(".story-timeline__next");
 var n = cards.length;
 var index = 0;
 var reduced =
 window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

 root.style.setProperty("--story-n", String(n));

 function setIndex(i, scrollTo) {
 index = Math.max(0, Math.min(n - 1, i));
 root.style.setProperty("--story-i", String(index));

 cards.forEach(function (card, ci) {
 card.classList.toggle("is-active", ci === index);
 });
 years.forEach(function (year, yi) {
 year.classList.toggle("is-active", yi === index);
 year.classList.toggle("is-passed", yi < index);
 });

 if (prevBtn) prevBtn.disabled = index <= 0;
 if (nextBtn) nextBtn.disabled = index >= n - 1;

 if (scrollTo && scroller && !reduced) {
 var start = scroller.offsetTop;
 var range = Math.max(1, scroller.offsetHeight - window.innerHeight);
 var y = start + (index / Math.max(1, n - 1)) * range;
 window.scrollTo({ top: y, behavior: "smooth" });
 }
 }

 function syncFromScroll() {
 if (reduced || !scroller) return;
 var start = scroller.offsetTop;
 var range = Math.max(1, scroller.offsetHeight - window.innerHeight);
 var scrolled = Math.min(Math.max(window.scrollY - start, 0), range);
 var progress = scrolled / range;
 var next = Math.round(progress * (n - 1));
 if (next !== index) setIndex(next, false);
 }

 setIndex(0, false);

 if (!reduced) {
 window.addEventListener("scroll", syncFromScroll, { passive: true });
 window.addEventListener("resize", syncFromScroll);
 }

 if (prevBtn) {
 prevBtn.addEventListener("click", function () {
 setIndex(index - 1, !reduced);
 });
 }
 if (nextBtn) {
 nextBtn.addEventListener("click", function () {
 setIndex(index + 1, !reduced);
 });
 }

 years.forEach(function (year, yi) {
 year.style.cursor = "pointer";
 year.addEventListener("click", function () {
 setIndex(yi, !reduced);
 });
 });

 if (frame) {
 frame.setAttribute("tabindex", "0");
 frame.addEventListener("keydown", function (e) {
 if (e.key === "ArrowRight" || e.key === "ArrowDown") {
 e.preventDefault();
 setIndex(index + 1, !reduced);
 } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
 e.preventDefault();
 setIndex(index - 1, !reduced);
 }
 });
 }
 })();


 // TESTIMONIALS SLIDER
 var $engagement = $(".engagement-section");
 var $testimonials = $engagement.find(".testimonials-slider");
 if ($testimonials.length && typeof Swiper !== 'undefined') {
 new Swiper($testimonials[0], {
 speed: SWIPER_SPEED,
 slidesPerView: 1,
 spaceBetween: 0,
 loop: true,
 autoHeight: true,
 watchOverflow: true,
 grabCursor: true,
 navigation: {
 nextEl: $engagement.find(".button-next")[0],
 prevEl: $engagement.find(".button-prev")[0],
 },
 });
 }

 // METRIC PROJECT STAGE
 $(".metric-showcase").each(function () {
 var $section = $(this);
 var $tabs = $section.find(".metric-index__item");
 var $slides = $section.find(".metric-stage__slide");
 if (!$tabs.length || !$slides.length) return;

 var total = $tabs.length;

 function activate(index) {
 index = ((index % total) + total) % total;
 $tabs.removeClass("is-active").attr("aria-selected", "false");
 $tabs.eq(index).addClass("is-active").attr("aria-selected", "true");
 $slides.removeClass("is-active is-entering").attr("hidden", true);
 var $next = $slides.eq(index);
 $next.addClass("is-active is-entering").removeAttr("hidden");
 window.setTimeout(function () {
 $next.removeClass("is-entering");
 }, 1100);
 }

 $tabs.on("click", function () {
 activate($(this).index());
 });

 $section.on("keydown", function (e) {
 var current = $tabs.filter(".is-active").index();
 if (e.key === "ArrowDown" || e.key === "ArrowRight") {
 e.preventDefault();
 activate(current + 1);
 } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
 e.preventDefault();
 activate(current - 1);
 }
 });

 activate(0);
 });

 // PROJECT SLIDER
 if (typeof Swiper !== 'undefined') {
 $(".project-slider").each(function () {
 var $slider = $(this);
 var isHero = $slider.hasClass("project-slider--hero");
 new Swiper(this, isHero
 ? {
 speed: Math.max(SWIPER_SPEED, 900),
 loop: true,
 effect: "fade",
 fadeEffect: { crossFade: true },
 autoplay: {
 delay: 4200,
 disableOnInteraction: false,
 },
 slidesPerView: 1,
 spaceBetween: 0,
 }
 : {
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
 }


 // DATA BACKGROUND (color or photo + brand gradient overlay - text sits on photo)
 var bgOverlay =
  "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.78) 100%)," +
  "linear-gradient(135deg, rgba(189,31,113,0.42) 0%, rgba(89,44,123,0.22) 48%, rgba(10,118,181,0.38) 100%)";
 $("[data-background]").each(function () {
 var bg = $(this).attr("data-background");
 if (!bg) return;
 var isColor = bg.charAt(0) === "#" || bg.indexOf("rgb") === 0;
 if (isColor) {
 if (/^#(ecebe4|c2c2be)$/i.test(bg)) return;
 $(this).css("background", bg);
 } else {
 var pos = $(this).attr("data-background-position") || "center";
 $(this).addClass("bg-photo");
 $(this).css({
 backgroundColor: "#121212",
 backgroundImage: bgOverlay + ", url(" + bg + ")",
 backgroundSize: "cover",
 backgroundPosition: pos,
 });
 }
 });


 // COUNTER, animate when stats enter viewport
 function runCounters() {
  if (!$('.odometer').length) return;
  var scrollY = $(window).scrollTop();
  var triggerAt = scrollY + $(window).height() * 0.85;
  $('.odometer').each(function () {
   var $el = $(this);
   if ($el.data('status') !== 'yes') return;
   var $section = $el.closest('section');
   if (!$section.length) return;
   var top = $section.offset().top;
   if (triggerAt >= top) {
    $el.html(String($el.data('count')));
    $el.data('status', 'no');
   }
  });
 }
 $(window).on('scroll resize', runCounters);
 runCounters();


 // STICKY NAVBAR transparent at top, solid bg on scroll
 function updateNavbar() {
 $('.navbar').toggleClass('sticky', $(document).scrollTop() > 20);
 }
 $(window).on('scroll touchmove', updateNavbar);
 updateNavbar();

 function initSiteFaqAccordion() {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.site-faq__item');
  if (!items.length) return;

  items.forEach(function (details) {
   var summary = details.querySelector('summary');
   var panel = details.querySelector('.site-faq__panel');
   if (!summary || !panel) return;

   if (details.hasAttribute('open')) {
    panel.style.height = 'auto';
   }

   if (reduced) return;

   summary.addEventListener('click', function (e) {
    e.preventDefault();
    if (details.classList.contains('site-faq__item--animating')) return;

    if (details.hasAttribute('open')) {
     closeSiteFaqItem(details, panel);
    } else {
     openSiteFaqItem(details, panel);
    }
   });
  });
 }

 function openSiteFaqItem(details, panel) {
  details.classList.add('site-faq__item--animating');
  panel.style.height = '0px';
  details.setAttribute('open', '');
  requestAnimationFrame(function () {
   panel.style.height = panel.scrollHeight + 'px';
  });

  panel.addEventListener('transitionend', function onEnd(ev) {
   if (ev.propertyName !== 'height') return;
   panel.removeEventListener('transitionend', onEnd);
   details.classList.remove('site-faq__item--animating');
   panel.style.height = 'auto';
  });
 }

 function closeSiteFaqItem(details, panel) {
  details.classList.add('site-faq__item--animating');
  panel.style.height = panel.scrollHeight + 'px';
  panel.offsetHeight;
  panel.style.height = '0px';

  panel.addEventListener('transitionend', function onEnd(ev) {
   if (ev.propertyName !== 'height') return;
   panel.removeEventListener('transitionend', onEnd);
   details.removeAttribute('open');
   details.classList.remove('site-faq__item--animating');
   panel.style.height = '';
  });
 }

 initSiteFaqAccordion();


})(jQuery);
