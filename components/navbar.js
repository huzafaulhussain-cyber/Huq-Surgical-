const els = {
    toggleBtn: document.getElementById('toggleMegaMenu'),
    megaMenu: document.getElementById('megaMenu'),
    dropdown: document.querySelector('.dropdown'), // Added for mobile dropdown
    mainMenu: document.getElementById('mainMenu'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    searchToggle: document.getElementById('searchToggle'),
    searchOverlay: document.getElementById('searchOverlay'),
};

const setDynamicOffset = () => {
    let offset = 0;
    if (els.mainMenu.classList.contains('active')) {
        offset = els.mainMenu.offsetHeight;
    } else if (els.searchOverlay.classList.contains('active')) {
        offset = els.searchOverlay.offsetHeight;
    }
    document.documentElement.style.setProperty('--dynamic-offset', `${offset}px`);
};

const toggleMegaMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // This function will now handle both desktop hover (via CSS) and mobile click
    if (window.innerWidth <= 1024) {
        const isOpen = els.megaMenu.classList.toggle('active');
        els.toggleBtn.classList.toggle('active', isOpen);
        els.toggleBtn.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            // No need to close other menus as they are separate in mobile view
            // closeMenu(els.mainMenu, els.mobileMenuToggle);
        }
    }
};

const toggleMobileMenu = () => {
    const isMenuOpen = els.mainMenu.classList.toggle('active');
    els.mobileMenuToggle.querySelector('i').classList.toggle('fa-bars', !isMenuOpen);
    els.mobileMenuToggle.querySelector('i').classList.toggle('fa-times', isMenuOpen);

    if (isMenuOpen) {
        // Don't close mega menu when opening mobile menu, they are independent now
        closeSearchOverlay();
    }
};

const toggleSearchOverlay = () => {
    const isSearchOpen = els.searchOverlay.classList.toggle('active');
    els.searchToggle.querySelector('i').classList.toggle('fa-search', !isSearchOpen);
    els.searchToggle.querySelector('i').classList.toggle('fa-times', isSearchOpen);

    if (isSearchOpen) {
        els.searchOverlay.querySelector('input').focus();
        closeMenu(els.mainMenu, els.mobileMenuToggle);
        // Also close the product dropdown if it's open
        if (els.megaMenu.classList.contains('active')) closeMenu(els.megaMenu, els.toggleBtn);
    } else {
        els.searchToggle.focus();
    }
};

const closeMenu = (menuElement, toggleElement) => {
    if (menuElement.classList.contains('active')) {
        menuElement.classList.remove('active');
        if (menuElement === els.megaMenu) {
            toggleElement.classList.remove('active');
            toggleElement.setAttribute('aria-expanded', 'false');
        } else if (menuElement === els.mainMenu) {
            toggleElement.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    }
};

const closeSearchOverlay = () => {
    if (els.searchOverlay.classList.contains('active')) {
        els.searchOverlay.classList.remove('active');
        els.searchToggle.querySelector('i').classList.replace('fa-times', 'fa-search');
    }
};

const closeAllOpenElements = (e) => {
    // Close product dropdown if clicking outside
    if (window.innerWidth <= 1024 && els.megaMenu.classList.contains('active') && !els.dropdown.contains(e.target)) {
        closeMenu(els.megaMenu, els.toggleBtn);
    } else if (window.innerWidth > 1024 && !els.dropdown.contains(e.target)) {
        // This part is mostly handled by CSS hover, but good for consistency
    }
    if (els.mainMenu.classList.contains('active') && !els.mainMenu.contains(e.target) && !els.mobileMenuToggle.contains(e.target) && !els.megaMenu.contains(e.target)) {
        closeMenu(els.mainMenu, els.mobileMenuToggle);
    }
    if (window.innerWidth <= 1024 && els.searchOverlay.classList.contains('active') && !els.searchOverlay.contains(e.target) && !els.searchToggle.contains(e.target)) {
        closeSearchOverlay();
    }
};

const handleKeyboardNavigation = (e) => {
    if (e.key === 'Escape') {
        if (els.megaMenu.classList.contains('active')) {
            closeMenu(els.megaMenu, els.toggleBtn);
            els.toggleBtn.focus();
        } else if (els.searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
            els.searchToggle.focus();
        } else if (els.mainMenu.classList.contains('active')) {
            closeMenu(els.mainMenu, els.mobileMenuToggle);
            els.mobileMenuToggle.focus();
        }
    } else if (e.key === 'Tab' && els.megaMenu.classList.contains('active')) {
        const focusable = Array.from(els.megaMenu.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), input:not([disabled])'))
            .filter(el => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const [first, last] = [focusable[0], focusable[focusable.length - 1]];

        if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === els.megaMenu) {
                last.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    } else if (e.key === 'Tab' && els.searchOverlay.classList.contains('active')) {
        const searchInput = els.searchOverlay.querySelector('input');
        const searchButton = els.searchOverlay.querySelector('button');

        if (e.shiftKey) {
            if (document.activeElement === searchInput) {
                searchButton.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === searchButton) {
                searchInput.focus();
                e.preventDefault();
            }
        }
    }
};

// Event Listeners
els.toggleBtn.addEventListener('click', toggleMegaMenu);
els.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
els.searchToggle.addEventListener('click', toggleSearchOverlay);
document.addEventListener('click', closeAllOpenElements);
document.addEventListener('keydown', handleKeyboardNavigation);
window.addEventListener('load', setDynamicOffset); // Keep for mobile menu offset
window.addEventListener('resize', setDynamicOffset); // Keep for mobile menu offset