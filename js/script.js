/* ==========================================
        KHATI SODAY
        script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
            Sticky Navbar
    ========================================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 80) {

                navbar.classList.add("shadow");

            } else {

                navbar.classList.remove("shadow");

            }

        });

    }

    /* ==========================================
            Back To Top Button
    ========================================== */

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 300) {

                backToTop.style.display = "block";

            } else {

                backToTop.style.display = "none";

            }

        });

        backToTop.addEventListener("click", () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        });

    }

    /* ==========================================
            Search Box
    ========================================== */

    const searchInput = document.querySelector(".search-box input");

    if (searchInput) {

        searchInput.addEventListener("focus", () => {

            searchInput.parentElement.style.boxShadow =
                "0 0 10px rgba(1,119,48,.25)";

        });

        searchInput.addEventListener("blur", () => {

            searchInput.parentElement.style.boxShadow = "none";

        });

    }

    /* ==========================================
            Product Card Hover
    ========================================== */

    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-8px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

    /* ==========================================
            Add To Cart Button
    ========================================== */

    const cartButtons = document.querySelectorAll(
        ".add-cart-btn, .product-btns .btn-green, .cart-btn"
    );

    cartButtons.forEach(button => {

        button.addEventListener("click", (e) => {

            e.preventDefault();

            const originalContent = button.innerHTML;

            button.innerHTML = "✓ Added";

            button.classList.add("btn-success");

            setTimeout(() => {

                button.innerHTML = originalContent;

                button.classList.remove("btn-success");

            }, 1500);

        });

    });
    

});
