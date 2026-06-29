/* ==========================================
        KHATI SODAY
        script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "khatiSodayCart";
    const DELIVERY_CHARGE = 80;

    const readCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadges(cart);
    };

    const parsePrice = (value) => {
        const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
        return match ? Number(match[0]) : 0;
    };

    const formatPrice = (amount) => `Tk. ${Number(amount || 0).toLocaleString("en-US")}`;

    const cleanText = (element) => element ? element.textContent.replace(/\s+/g, " ").trim() : "";

    const productId = (product) => [
        product.name,
        product.price,
        product.image
    ].join("|").toLowerCase();

    const updateCartBadges = (cart = readCart()) => {
        const count = cart.reduce((total, item) => total + item.quantity, 0);

        document.querySelectorAll(".header-right small").forEach((badge) => {
            if (/cart/i.test(badge.textContent)) {
                badge.textContent = `Cart (${count})`;
            }
        });
    };

    const getProductFromButton = (button) => {
        const card = button.closest(".product-card");
        const details = button.closest(".product-info");
        const scope = card || details;

        if (!scope) {
            return null;
        }

        const name = cleanText(
            scope.querySelector("h4") ||
            scope.querySelector("h5") ||
            scope.querySelector("h6") ||
            scope.querySelector("h2")
        );

        const description = cleanText(scope.querySelector("p"));
        const price = parsePrice(cleanText(scope.querySelector(".new-price")));
        const imageElement = card
            ? card.querySelector(".product-img img, .product-image, img")
            : document.querySelector(".product-gallery img");
        const quantity = parseInt(cleanText(scope.querySelector(".quantity span")), 10) || 1;

        if (!name || !price) {
            return null;
        }

        return {
            id: productId({ name, price, image: imageElement ? imageElement.getAttribute("src") : "" }),
            name,
            description,
            price,
            image: imageElement ? imageElement.getAttribute("src") : "",
            quantity
        };
    };

    const addToCart = (product) => {
        const cart = readCart();
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        saveCart(cart);
    };

    const setButtonAddedState = (button) => {
        const originalContent = button.innerHTML;

        button.innerHTML = '<i class="bi bi-check2"></i> Added';
        button.classList.add("btn-success");

        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove("btn-success");
        }, 1500);
    };

    const renderCartPage = () => {
        const tbody = document.querySelector(".cart-table tbody");

        if (!tbody) {
            return;
        }

        const cart = readCart();

        if (!cart.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        Your cart is empty.
                        <a href="products.html" class="text-green fw-semibold ms-1">Continue shopping</a>
                    </td>
                </tr>
            `;
            updateCartTotals();
            return;
        }

        tbody.innerHTML = cart.map((item) => `
            <tr data-id="${item.id}">
                <td>
                    <div class="cart-product">
                        <img src="${item.image}" alt="${item.name}">
                        <div>
                            <h5>${item.name}</h5>
                            <small>${item.description || "Khati Soday organic product"}</small>
                        </div>
                    </div>
                </td>
                <td data-price="${item.price}">${formatPrice(item.price)}</td>
                <td>
                    <div class="quantity-box">
                        <button class="qty-btn" type="button" data-action="decrease">-</button>
                        <input type="number" min="1" value="${item.quantity}">
                        <button class="qty-btn" type="button" data-action="increase">+</button>
                    </div>
                </td>
                <td class="item-total">${formatPrice(item.price * item.quantity)}</td>
                <td>
                    <button class="remove-btn" type="button" aria-label="Remove ${item.name}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        updateCartTotals();
    };

    const updateCartTotals = () => {
        const rows = document.querySelectorAll(".cart-table tbody tr[data-id]");
        let subtotal = 0;
        const cart = [];

        rows.forEach((row) => {
            const price = parsePrice(row.children[1].dataset.price || row.children[1].textContent);
            const input = row.querySelector("input");
            const quantity = Math.max(1, parseInt(input.value, 10) || 1);
            const total = price * quantity;

            input.value = quantity;
            row.querySelector(".item-total").textContent = formatPrice(total);
            subtotal += total;

            cart.push({
                id: row.dataset.id,
                name: cleanText(row.querySelector(".cart-product h5")),
                description: cleanText(row.querySelector(".cart-product small")),
                image: row.querySelector(".cart-product img").getAttribute("src"),
                price,
                quantity
            });
        });

        const delivery = subtotal > 0 ? DELIVERY_CHARGE : 0;
        const grandTotal = subtotal + delivery;

        const subtotalElement = document.getElementById("subtotal");
        const grandTotalElement = document.getElementById("grand-total") || document.getElementById("grandtotal");

        if (subtotalElement) {
            subtotalElement.textContent = formatPrice(subtotal);
        }

        if (grandTotalElement) {
            grandTotalElement.textContent = formatPrice(grandTotal);
        }

        saveCart(cart);
    };

    const setupMobileHeader = () => {
        const header = document.querySelector(".main-header .container");
        const desktopLogo = document.querySelector(".main-header .logo");

        if (!header || header.querySelector(".mobile-top")) {
            return;
        }

        const mobileTop = document.createElement("div");
        mobileTop.className = "mobile-top d-lg-none";
        mobileTop.innerHTML = `
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a href="index.html">
                <img src="${desktopLogo ? desktopLogo.getAttribute("src") : "images/logo.png"}" class="logo" alt="Khati Soday">
            </a>
        `;

        header.insertBefore(mobileTop, header.firstElementChild);
    };

    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("shadow", window.scrollY > 80);
        });
    }

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.style.display = window.scrollY > 300 ? "block" : "none";
        });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const searchInput = document.querySelector(".search-box input");

    if (searchInput) {
        searchInput.addEventListener("focus", () => {
            searchInput.parentElement.style.boxShadow = "0 0 10px rgba(1,119,48,.25)";
        });

        searchInput.addEventListener("blur", () => {
            searchInput.parentElement.style.boxShadow = "none";
        });
    }

    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-8px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
        });
    });

    document.addEventListener("click", (event) => {
        const addButton = event.target.closest(".add-cart-btn, .product-btns .btn-green, .cart-btn");

        if (addButton) {
            event.preventDefault();
            const product = getProductFromButton(addButton);

            if (product) {
                addToCart(product);
                setButtonAddedState(addButton);
            }
        }

        const quantityButton = event.target.closest(".quantity-box .qty-btn");

        if (quantityButton) {
            const input = quantityButton.parentElement.querySelector("input");
            const currentValue = parseInt(input.value, 10) || 1;
            input.value = quantityButton.dataset.action === "decrease"
                ? Math.max(1, currentValue - 1)
                : currentValue + 1;
            updateCartTotals();
        }

        const removeButton = event.target.closest(".remove-btn");

        if (removeButton) {
            removeButton.closest("tr").remove();
            updateCartTotals();
            renderCartPage();
        }
    });

    document.addEventListener("change", (event) => {
        if (event.target.matches(".quantity-box input")) {
            updateCartTotals();
        }
    });

    document.querySelectorAll(".quantity:not(.quantity-box)").forEach((quantity) => {
        const buttons = quantity.querySelectorAll("button");
        const value = quantity.querySelector("span");

        if (buttons.length === 2 && value) {
            buttons[0].addEventListener("click", () => {
                value.textContent = Math.max(1, (parseInt(value.textContent, 10) || 1) - 1);
            });

            buttons[1].addEventListener("click", () => {
                value.textContent = (parseInt(value.textContent, 10) || 1) + 1;
            });
        }
    });

    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    if (togglePassword && password) {
        togglePassword.addEventListener("click", function () {
            const type = password.getAttribute("type") === "password" ? "text" : "password";
            password.setAttribute("type", type);
            this.innerHTML = type === "password"
                ? '<i class="bi bi-eye"></i>'
                : '<i class="bi bi-eye-slash"></i>';
        });
    }

    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    if (toggleConfirmPassword && confirmPassword) {
        toggleConfirmPassword.addEventListener("click", function () {
            const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
            confirmPassword.setAttribute("type", type);
            this.innerHTML = type === "password"
                ? '<i class="bi bi-eye"></i>'
                : '<i class="bi bi-eye-slash"></i>';
        });
    }

    setupMobileHeader();
    renderCartPage();
    updateCartBadges();
});
