'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector("#section--1");
const navlinks = document.querySelector(".nav__links");
const allSections = document.querySelectorAll(".section");
const imageTarget = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const maxSlides = slides.length;
const btnRight = document.querySelector(".slider__btn--right");
const btnLeft = document.querySelector(".slider__btn--left");
const dotsContainer = document.querySelector(".dots");

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', openModal);
})

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
    'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);
document.querySelector(".btn--close-cookie").addEventListener("click", () => {message.remove();});


// nav
btnScrollTo.addEventListener('click', (e) => {
    // const s1coords = section1.getBoundingClientRect();
    // window.scrollTo({left: s1coords.left + window.pageXOffset, top: s1coords.top + window.pageYOffset, behavior: "smooth"});
    section1.scrollIntoView({behavior: "smooth"});
})
navlinks.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: "smooth"});

    }
})

// tab component
tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest(".operations__tab");
    if (!clicked) return;
    tabs.forEach((t) => t.classList.remove("operations__tab--active"));
    tabsContent.forEach((t) => t.classList.remove("operations__content--active"));
    clicked.classList.add("operations__tab--active");
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
})


// mouse fade animation
const handleHover = function (e, opacity) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const sibling = link.closest(".nav").querySelectorAll('.nav__link')
        const logo = link.closest('.nav').querySelector('img');
        sibling.forEach(function (el) {
            if (el !== link) el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
}
nav.addEventListener('mouseover', e => handleHover(e, 0.5));
nav.addEventListener('mouseout', e => handleHover(e, 1));


// sticky nav
// bad implementation
// const initCoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//     if (window.scrollY > initCoordinates.top) nav.classList.add("sticky"); else nav.classList.remove("sticky");
// })
const navHeight = nav.getBoundingClientRect().height;
const observerOpts = {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
};
const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, observerOpts);
headerObserver.observe(header);

// revealing element on scroll
const revealSection = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add("section--hidden");
});

// lazy loading images 
const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove("lazy-img");
    });

    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null, threshold: 0,

});
imageTarget.forEach(function (img) {imgObserver.observe(img);});


// slider
let curSlide = 0;
const createDots = function () {
    slides.forEach(function (_, i) {
        dotsContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide=${i}></button>`);
    });
}
const activateDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
        dot.classList.remove('dots__dot--active');
    });
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
};
const gotoSlide = function (slide) {
    slides.forEach(function (s, i) {s.style.transform = `translateX(${100 * (i - slide)}%)`});
};
const nextSlide = function () {
    if (curSlide >= maxSlides - 1) curSlide = 0; else curSlide++;
    gotoSlide(curSlide);
    activateDot(curSlide);
};
const prevSlide = function () {
    if (curSlide <= 0) curSlide = maxSlides - 1; else curSlide--;
    gotoSlide(curSlide);
    activateDot(curSlide);
};

gotoSlide(0);
createDots();
activateDot(0);

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
});

dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
        const slide = e.target.dataset.slide;
        gotoSlide(slide);
        activateDot(slide);
    }
});

