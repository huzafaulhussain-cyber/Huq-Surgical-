const preloader = document.getElementById('preloader');

const loadComponent = async (url, containerId, scriptSrc = null) => {
    const response = await fetch(url);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
    if (scriptSrc) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    }
};

const loadAllComponents = async () => {
    try {
        await Promise.all([
            loadComponent('/components/navbar.html', 'navbar-container', '/components/navbar.js'),
            loadComponent('/components/footer.html', 'footer-container')
        ]);
    } catch (error) {
        console.error("Error loading components:", error);
    } finally {
        // Hide preloader
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => preloader.remove(), 1000); // Remove from DOM after fade out
            }, 1000); // Wait for 1 second before starting fade out
        }
    }
};

loadAllComponents();

// carousel banner

document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const container = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const navContainer = document.querySelector('.carousel-nav');
    const totalSlides = slides.length;
    const slideDuration = 7000;
    let autoPlayInterval;

    const prevBtn = document.querySelector('.arrow-prev');
    const nextBtn = document.querySelector('.arrow-next');

    for (let i = 0; i < totalSlides; i++) {
        const navItem = document.createElement('div');
        navItem.classList.add('nav-item');
        navItem.innerHTML = '<div class="nav-progress"></div>';
        navItem.addEventListener('click', () => {
            if (i !== currentSlide) goToSlide(i);
        });
        navContainer.appendChild(navItem);
    }

    const navItems = document.querySelectorAll('.nav-item');

    function goToSlide(slideIndex) {
        if (slideIndex === currentSlide && slides[slideIndex]?.classList.contains('active')) return;

        slides[currentSlide].classList.remove('active');
        navItems[currentSlide].classList.remove('active');

        const oldProgress = navItems[currentSlide].querySelector('.nav-progress');
        oldProgress.style.transition = 'none';
        oldProgress.style.width = '0';

        currentSlide = slideIndex;

        slides[currentSlide].classList.add('active');
        navItems[currentSlide].classList.add('active');

        setTimeout(() => {
            const newProgress = navItems[currentSlide].querySelector('.nav-progress');
            newProgress.style.transition = `width ${slideDuration / 1000}s linear`;
            newProgress.style.width = '100%';
        }, 50);

        startAutoPlay();
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prevIndex);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);


    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, slideDuration);
    }

    function init() {
        goToSlide(0);
    }

    init();
});

// <!--info text gsap ki animation ha ya  -->

gsap.utils.toArray(".split-text").forEach(text => {
    let split = text.innerText.split("");
    text.innerHTML = split.map(letter => `<span class="letter">${letter}</span>`).join("");

    gsap.from(text.querySelectorAll(".letter"), {
        opacity: 0,
        y: 80,
        filter: "blur(8px)",
        duration: 1.2,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: {
            trigger: text,
            start: "top 80%"
        }
    });
});

// INFO CARDS (luxury stagger reveal)

gsap.from(".info-card", {
    opacity: 0,
    y: 120,
    scale: 0.9,
    filter: "blur(15px)",
    duration: 1.4,
    stagger: 0.3,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".info-section",
        start: "top 80%",
    }
});



// < !--products slider-- >

const slider = document.getElementById('slider-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators-container');
const slides = slider.querySelectorAll('.card-wrapper');
const indicators = indicatorsContainer.querySelectorAll('.scroll-indicator');

let isDown = false;
let startX, scrollLeft;

const updateSliderState = () => {
    if (!slides.length) return;
    const slideWidth = slides[0].offsetWidth;
    const gap = 32;
    const currentSlideIndex = Math.round(slider.scrollLeft / (slideWidth + gap));

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });

    prevBtn.style.display = slider.scrollLeft > 0 ? 'flex' : 'none';
    nextBtn.style.display = slider.scrollLeft < (slider.scrollWidth - slider.clientWidth - 1) ? 'flex' : 'none';
};

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

const stopDragging = () => {
    isDown = false;
    slider.classList.remove('dragging');
};

slider.addEventListener('mouseleave', stopDragging);
slider.addEventListener('mouseup', stopDragging);

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
});

const scrollSlider = (direction) => {
    if (!slides.length) return;
    const slideWidth = slides[0].offsetWidth;
    const gap = 32;
    slider.scrollBy({
        left: direction * (slideWidth + gap),
        behavior: 'smooth'
    });
};

nextBtn.addEventListener('click', () => scrollSlider(1));
prevBtn.addEventListener('click', () => scrollSlider(-1));

slider.addEventListener('scroll', updateSliderState);
window.addEventListener('load', updateSliderState);
window.addEventListener('resize', updateSliderState);

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        const gap = 32;
        slider.scroll({
            left: index * (slideWidth + gap),
            behavior: 'smooth'
        });
    });
});


// IMAGES (clip-path cinematic reveal)
gsap.from(".image-container img", {
    opacity: 0,
    clipPath: "inset(0 100% 0 0)",
    duration: 1.8,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".image-container",
        start: "top 75%",
    }
});

gsap.from(".image-container2 img", {
    opacity: 0,
    clipPath: "inset(0 0 0 100%)",
    duration: 1.8,
    ease: "power4.out",
    scrollTrigger: {
        trigger: ".image-container2",
        start: "top 75%",
    }
});

// FORM (fade + zoom reveal)
gsap.from(".form-container", {
    opacity: 0,
    y: 100,
    scale: 0.95,
    filter: "blur(10px)",
    duration: 1.6,
    ease: "expo.out",
    scrollTrigger: {
        trigger: ".form-container",
        start: "top 70%",
    }
});
