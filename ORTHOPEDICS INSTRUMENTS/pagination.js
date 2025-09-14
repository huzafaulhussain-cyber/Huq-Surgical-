document.addEventListener('DOMContentLoaded', function () {
    const productsGrid = document.querySelector('.products-grid');
    const paginationContainer = document.getElementById('pagination-container');

    // If there's no grid or pagination container, don't run the script
    if (!productsGrid || !paginationContainer) {
        return;
    }

    const allProducts = Array.from(productsGrid.querySelectorAll('.product-card'));
    const productsPerPage = 9;
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    let currentPage = 1;

    // Only show pagination if there is more than one page
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    function displayProducts(page) {
        // Clear current products
        productsGrid.innerHTML = '';

        const startIndex = (page - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = allProducts.slice(startIndex, endIndex);

        productsToShow.forEach((product, index) => {
            // Reset opacity for fadeIn animation
            product.style.opacity = '0';
            productsGrid.appendChild(product);
            // Apply animation with a delay
            product.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s forwards`;
        });
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';

        let prevLink = `<a href="#" class="prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">&laquo; Previous</a>`;
        paginationContainer.innerHTML += prevLink;

        for (let i = 1; i <= totalPages; i++) {
            let pageLink = `<a href="#" class="page-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
            paginationContainer.innerHTML += pageLink;
        }

        let nextLink = `<a href="#" class="next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">Next &raquo;</a>`;
        paginationContainer.innerHTML += nextLink;
    }

    paginationContainer.addEventListener('click', function (e) {
        e.preventDefault();
        const target = e.target.closest('a'); // Ensure we get the 'a' tag even if an inner element is clicked

        if (target && !target.classList.contains('disabled')) {
            const page = parseInt(target.getAttribute('data-page'));
            if (page) {
                currentPage = page;
                displayProducts(currentPage);
                setupPagination();
                window.scrollTo(0, 0); // Scroll to top on page change
            }
        }
    });

    // Initial setup
    displayProducts(currentPage);
    setupPagination();
});