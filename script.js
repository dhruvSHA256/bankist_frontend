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
