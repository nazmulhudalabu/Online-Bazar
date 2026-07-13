/* ==========================================
        KHATI SODAY
        script.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "khatiSodayCart";
    const CART_TOUCHED_KEY = "khatiSodayCartTouched";
    const ORDER_KEY = "khatiSodayLastOrder";
    const DELIVERY_CHARGE = 80;
    const productCatalog = [
        {
            name: "Pure Mustard Oil",
            localName: "Cold Pressed Mustard Oil",
            category: "Mustard Oil",
            description: "Cold pressed in small batches with the sharp aroma families expect from real mustard oil.",
            unit: "1 Liter",
            price: 420,
            oldPrice: 480,
            rating: 4.8,
            reviews: 124,
            badge: "Best Seller",
            image: "images/products/oil.png"
        },
        {
            name: "Sundarbans Honey",
            localName: "Sundarbans Natural Honey",
            category: "Honey",
            description: "Naturally collected honey, filtered and sealed without added sugar or artificial flavor.",
            unit: "500g",
            price: 650,
            oldPrice: 760,
            rating: 4.9,
            reviews: 98,
            badge: "Pure",
            image: "images/products/honey.png"
        },
        {
            name: "Turmeric Powder",
            localName: "Single Origin Turmeric Powder",
            category: "Turmeric",
            description: "Bright turmeric powder made from selected roots, dried and ground for everyday cooking.",
            unit: "200g",
            price: 180,
            oldPrice: 220,
            rating: 4.7,
            reviews: 76,
            badge: "Fresh",
            image: "images/products/turmeric.png"
        },
        {
            name: "Ajwa Dates",
            localName: "Premium Ajwa Dates",
            category: "Dates",
            description: "Soft premium dates packed hygienically for gifting, iftar tables, and family snacking.",
            unit: "1kg",
            price: 1250,
            oldPrice: 1380,
            rating: 4.9,
            reviews: 67,
            badge: "Premium",
            image: "images/products/dates.png"
        },
        {
            name: "Mixed Spice Blend",
            localName: "Homestyle Mixed Spice Blend",
            category: "Masala",
            description: "Aromatic small-batch spice blend prepared for rich Bangladeshi home cooking.",
            unit: "250g",
            price: 240,
            oldPrice: 290,
            rating: 4.6,
            reviews: 52,
            badge: "New",
            image: "images/products/masala.png"
        },
        {
            name: "Premium Nuts Mix",
            localName: "Premium Nuts Mix",
            category: "Nuts",
            description: "Balanced nuts mix for healthy snacking, breakfast bowls, and thoughtful food gifts.",
            unit: "500g",
            price: 780,
            oldPrice: 890,
            rating: 4.8,
            reviews: 43,
            badge: "Healthy",
            image: "images/products/dates.png"
        }
    ];

    const readCart = () => {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (error) {
            return [];
        }
    };

    const saveCart = (cart) => {
        localStorage.setItem(CART_TOUCHED_KEY, "true");
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartBadges(cart);
    };

    const parsePrice = (value) => {
        const match = String(value || "").replace(/,/g, "").match(/\d+(\.\d+)?/);
        return match ? Number(match[0]) : 0;
    };

    const formatPrice = (amount) => `Tk. ${Number(amount || 0).toLocaleString("en-US")}`;

    const starMarkup = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        let markup = "";

        for (let index = 0; index < fullStars; index += 1) {
            markup += '<i class="bi bi-star-fill"></i>';
        }

        if (hasHalf) {
            markup += '<i class="bi bi-star-half"></i>';
        }

        return markup;
    };

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

    const catalogProductCard = (product) => `
        <div class="col-lg-4 col-md-6 product-result" data-category="${product.category}" data-price="${product.price}">
            <div class="product-card catalog-card">
                <div class="product-img">
                    <span class="discount">${product.badge}</span>
                    <button class="wishlist-btn" type="button" aria-label="Save ${product.name}">
                        <i class="bi bi-heart"></i>
                    </button>
                    <a href="product-details.html">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                </div>
                <div class="product-content">
                    <div class="product-rating">
                        ${starMarkup(product.rating)}
                        <span>(${product.rating}) ${product.reviews} reviews</span>
                    </div>
                    <h4>${product.localName}</h4>
                    <p>${product.description}</p>
                    <div class="product-meta">
                        <span><i class="bi bi-box-seam"></i> ${product.unit}</span>
                        <span><i class="bi bi-check-circle"></i> In stock</span>
                    </div>
                    <div class="price">
                        <span class="new-price">${formatPrice(product.price)}</span>
                        <span class="old-price">${formatPrice(product.oldPrice)}</span>
                    </div>
                    <div class="product-btns">
                        <a href="product-details.html" class="btn btn-outline-success">Details</a>
                        <button class="btn btn-green" type="button">
                            <i class="bi bi-cart-plus"></i>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderProductCatalog = () => {
        const grid = document.getElementById("productGrid");

        if (!grid) {
            return;
        }

        const searchInput = document.getElementById("productSearch");
        const priceInput = document.getElementById("priceRange");
        const sortSelect = document.getElementById("productSort");
        const activeCategory = document.querySelector(".category-list a.active");
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const maxPrice = priceInput ? Number(priceInput.value) : 1500;
        const category = activeCategory ? activeCategory.dataset.category : "All";

        let products = productCatalog.filter((product) => {
            const matchesSearch = [
                product.name,
                product.localName,
                product.category,
                product.description
            ].join(" ").toLowerCase().includes(query);
            const matchesCategory = category === "All" || product.category === category;
            const matchesPrice = product.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });

        if (sortSelect) {
            const sortValue = sortSelect.value.toLowerCase();
            products = products.sort((first, second) => {
                if (sortValue === "price-low" || sortValue.includes("low")) {
                    return first.price - second.price;
                }

                if (sortValue === "price-high" || sortValue.includes("high")) {
                    return second.price - first.price;
                }

                if (sortValue === "rating" || sortValue.includes("rated")) {
                    return second.rating - first.rating;
                }

                return productCatalog.indexOf(first) - productCatalog.indexOf(second);
            });
        }

        grid.innerHTML = products.length
            ? products.map(catalogProductCard).join("")
            : `
                <div class="col-12">
                    <div class="empty-state">
                        <i class="bi bi-search"></i>
                        <h4>No products found</h4>
                        <p>Try a different keyword, category, or price range.</p>
                    </div>
                </div>
            `;

        const resultCount = document.getElementById("resultCount");

        if (resultCount) {
            resultCount.textContent = `${products.length} products found`;
        }
    };

    const setupProductFilters = () => {
        const productSearch = document.getElementById("productSearch");
        const priceRange = document.getElementById("priceRange");
        const priceValue = document.getElementById("priceValue");
        const sortSelect = document.getElementById("productSort");
        const applyButton = document.getElementById("applyFilter");

        if (priceRange && priceValue) {
            priceValue.textContent = formatPrice(priceRange.value);
            priceRange.addEventListener("input", () => {
                priceValue.textContent = formatPrice(priceRange.value);
                renderProductCatalog();
            });
        }

        if (productSearch) {
            productSearch.addEventListener("input", renderProductCatalog);
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", renderProductCatalog);
        }

        if (applyButton) {
            applyButton.addEventListener("click", renderProductCatalog);
        }

        document.querySelectorAll(".category-list a").forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                document.querySelectorAll(".category-list a").forEach((item) => item.classList.remove("active"));
                link.classList.add("active");
                renderProductCatalog();
            });
        });
    };

    const cartSubtotal = (cart = readCart()) => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const cartDelivery = (subtotal) => subtotal > 0 ? DELIVERY_CHARGE : 0;

    const seedCartFromStaticRows = () => {
        const tbody = document.querySelector(".cart-table tbody");

        if (!tbody || localStorage.getItem(CART_KEY) || localStorage.getItem(CART_TOUCHED_KEY)) {
            return;
        }

        const cart = Array.from(tbody.querySelectorAll("tr")).map((row) => {
            const cells = row.children;
            const imageElement = row.querySelector(".cart-product img");
            const input = row.querySelector(".quantity-box input");
            const name = cleanText(row.querySelector(".cart-product h5"));
            const price = parsePrice(cells[1] ? cells[1].textContent : "");
            const image = imageElement ? imageElement.getAttribute("src") : "";

            if (!name || !price) {
                return null;
            }

            return {
                id: productId({ name, price, image }),
                name,
                description: cleanText(row.querySelector(".cart-product small")),
                image,
                price,
                quantity: Math.max(1, parseInt(input ? input.value : "1", 10) || 1)
            };
        }).filter(Boolean);

        if (cart.length) {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        }
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

    const renderCheckoutSummary = () => {
        const summary = document.querySelector(".checkout-summary");

        if (!summary) {
            return;
        }

        const cart = readCart();
        const subtotal = cartSubtotal(cart);
        const delivery = cartDelivery(subtotal);
        const grandTotal = subtotal + delivery;

        const productsMarkup = cart.length
            ? cart.map((item) => `
                <div class="summary-product">
                    <span>${item.name} x ${item.quantity}</span>
                    <strong>${formatPrice(item.price * item.quantity)}</strong>
                </div>
            `).join("")
            : `
                <div class="summary-product">
                    <span>Your cart is empty</span>
                    <strong>${formatPrice(0)}</strong>
                </div>
            `;

        summary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="checkout-products">
                ${productsMarkup}
            </div>
            <hr>
            <div class="summary-product">
                <span>Subtotal</span>
                <strong>${formatPrice(subtotal)}</strong>
            </div>
            <div class="summary-product">
                <span>Delivery</span>
                <strong>${formatPrice(delivery)}</strong>
            </div>
            <div class="summary-product">
                <span>Discount</span>
                <strong>${formatPrice(0)}</strong>
            </div>
            <hr>
            <div class="summary-product total">
                <span>Total</span>
                <strong>${formatPrice(grandTotal)}</strong>
            </div>
            <button class="btn btn-green w-100 mt-4" id="placeOrder" type="button">
                <i class="bi bi-check-circle"></i>
                Place Order
            </button>
            <a href="cart.html" class="btn btn-outline-success w-100 mt-3">
                <i class="bi bi-arrow-left"></i>
                Back to Cart
            </a>
        `;
    };

    const setupCheckoutForm = () => {
        const checkoutForm = document.getElementById("checkoutForm");

        if (!checkoutForm) {
            return;
        }

        checkoutForm.addEventListener("submit", (event) => {
            event.preventDefault();
        });
    };

    const placeOrder = () => {
        const checkoutForm = document.getElementById("checkoutForm");
        const cart = readCart();

        if (checkoutForm && !checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        if (!cart.length) {
            alert("Your cart is empty. Please add products before checkout.");
            window.location.href = "products.html";
            return;
        }

        const subtotal = cartSubtotal(cart);
        const total = subtotal + cartDelivery(subtotal);
        const payment = document.querySelector('input[name="payment"]:checked');
        const paymentLabel = payment ? cleanText(document.querySelector(`label[for="${payment.id}"]`)) : "Cash on Delivery";
        const order = {
            id: `#KS${Date.now().toString().slice(-8)}`,
            date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }),
            paymentMethod: paymentLabel,
            total,
            items: cart
        };

        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
        saveCart([]);
        window.location.href = "order-success.html";
    };

    const renderOrderSuccess = () => {
        const details = document.querySelector(".order-details");

        if (!details) {
            return;
        }

        let order = null;

        try {
            order = JSON.parse(localStorage.getItem(ORDER_KEY));
        } catch (error) {
            order = null;
        }

        if (!order) {
            details.innerHTML = `
                <div>
                    <span>Order Status</span>
                    <strong>No recent order found</strong>
                </div>
            `;
            return;
        }

        details.innerHTML = `
            <div>
                <span>Order ID</span>
                <strong>${order.id}</strong>
            </div>
            <div>
                <span>Order Date</span>
                <strong>${order.date}</strong>
            </div>
            <div>
                <span>Payment Method</span>
                <strong>${order.paymentMethod}</strong>
            </div>
            <div>
                <span>Total Amount</span>
                <strong>${formatPrice(order.total)}</strong>
            </div>
        `;
    };

    const productByImage = (image) => productCatalog.find((product) => image && image.includes(product.image.split("/").pop()));

    const normalizeStorefrontCopy = () => {
        document.querySelectorAll(".top-header p").forEach((item) => {
            item.innerHTML = 'Order authentic groceries by phone or WhatsApp: <span><i class="bi bi-telephone"></i> +880 1800 000 000</span>';
        });

        document.querySelectorAll(".navbar-nav").forEach((nav) => {
            nav.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="products.html">Products</a></li>
                <li class="nav-item"><a class="nav-link" href="products.html#mustard-oil">Mustard Oil</a></li>
                <li class="nav-item"><a class="nav-link" href="products.html#honey">Honey</a></li>
                <li class="nav-item"><a class="nav-link" href="products.html#masala">Masala</a></li>
                <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
            `;
        });

        const page = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(`.navbar-nav a[href="${page}"]`).forEach((link) => link.classList.add("active"));

        document.querySelectorAll(".search-box input").forEach((input) => {
            input.setAttribute("placeholder", "Search oil, honey, turmeric, dates...");
            input.setAttribute("aria-label", "Search products");
        });
    };

    const enhanceStaticProducts = () => {
        const fallbackProducts = [...productCatalog, ...productCatalog];

        document.querySelectorAll(".product-card").forEach((card, index) => {
            const image = card.querySelector("img");
            const product = productByImage(image ? image.getAttribute("src") : "") || fallbackProducts[index % fallbackProducts.length];

            if (!product) {
                return;
            }

            const title = card.querySelector("h4, h5, h6");
            const description = card.querySelector(".product-content p, h6 + p");
            const newPrice = card.querySelector(".new-price");
            const oldPrice = card.querySelector(".old-price");
            const rating = card.querySelector(".product-rating span");

            if (title) {
                title.textContent = product.localName;
            }

            if (description) {
                description.textContent = `${product.unit} - ${product.description}`;
            }

            if (newPrice) {
                newPrice.textContent = formatPrice(product.price);
            }

            if (oldPrice) {
                oldPrice.textContent = formatPrice(product.oldPrice);
            }

            if (rating) {
                rating.textContent = `(${product.rating}) ${product.reviews} reviews`;
            }
        });

        document.querySelectorAll(".category-card h5").forEach((title, index) => {
            const labels = ["Mustard Oil", "Honey", "Masala", "Dates", "Turmeric", "Nuts", "Gift Packs"];
            title.textContent = labels[index % labels.length];
        });
    };

    const renderHomeProductRows = () => {
        const home = document.querySelector(".hero");

        if (!home || document.querySelector(".store-assurance")) {
            return;
        }

        home.insertAdjacentHTML("afterend", `
            <section class="store-assurance">
                <div class="container">
                    <div class="assurance-grid">
                        <div><i class="bi bi-shield-check"></i><strong>Purity checked</strong><span>Verified suppliers and hygienic packing.</span></div>
                        <div><i class="bi bi-truck"></i><strong>Nationwide delivery</strong><span>Dhaka next day, outside Dhaka 2-4 days.</span></div>
                        <div><i class="bi bi-cash-coin"></i><strong>COD available</strong><span>Pay by cash, bKash, Nagad, or Rocket.</span></div>
                        <div><i class="bi bi-arrow-repeat"></i><strong>Easy support</strong><span>Fast replacement for damaged parcels.</span></div>
                    </div>
                </div>
            </section>
        `);

        const heroTitle = document.querySelector(".hero-content h1");
        const heroSubtitle = document.querySelector(".hero-content h2");
        const heroButton = document.querySelector(".hero-btn");

        if (heroTitle) {
            heroTitle.textContent = "Pure groceries for serious home cooking";
        }

        if (heroSubtitle) {
            heroSubtitle.textContent = "Shop mustard oil, honey, turmeric, spices, dates, and pantry staples sourced with care across Bangladesh.";
        }

        if (heroButton) {
            heroButton.textContent = "Shop Products";
        }
    };

    const enhanceDetailPage = () => {
        const info = document.querySelector(".product-info");

        if (!info || info.querySelector(".detail-trust-list")) {
            return;
        }

        info.insertAdjacentHTML("beforeend", `
            <div class="detail-trust-list">
                <span><i class="bi bi-check-circle"></i> No artificial color or fragrance</span>
                <span><i class="bi bi-box-seam"></i> Sealed food-grade packaging</span>
                <span><i class="bi bi-truck"></i> Delivery charge from ${formatPrice(DELIVERY_CHARGE)}</span>
            </div>
        `);
    };

    const enhanceForms = () => {
        document.querySelectorAll(".login-card form, .contact-form, #checkoutForm").forEach((form) => {
            form.addEventListener("submit", (event) => {
                if (!form.checkValidity()) {
                    return;
                }

                if (!form.id || form.id !== "checkoutForm") {
                    event.preventDefault();
                    const button = form.querySelector("button[type='submit'], .btn-green");
                    if (button) {
                        button.innerHTML = '<i class="bi bi-check2-circle"></i> Submitted';
                    }
                }
            });
        });
    };

    const ensureStoreFooter = () => {
        const footerMarkup = `
            <footer class="store-footer">
                <div class="container">
                    <div class="row g-4 align-items-start">
                        <div class="col-lg-4">
                            <img src="images/logo.png" class="footer-logo" alt="Khati Soday">
                            <p class="footer-description">Everyday grocery essentials sourced with care, hygienically packed, and delivered across Bangladesh.</p>
                            <div class="footer-trust" aria-label="Store promises">
                                <span><i class="bi bi-patch-check"></i> Quality checked</span>
                                <span><i class="bi bi-truck"></i> Nationwide delivery</span>
                            </div>
                            <div class="footer-social" aria-label="Social media">
                                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                                <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                                <a href="#" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
                            </div>
                        </div>
                        <div class="col-6 col-lg-2">
                            <h5>Shop</h5>
                            <ul>
                                <li><a href="products.html">All Products</a></li>
                                <li><a href="products.html#mustard-oil">Mustard Oil</a></li>
                                <li><a href="products.html#honey">Honey</a></li>
                                <li><a href="products.html#masala">Masala</a></li>
                            </ul>
                        </div>
                        <div class="col-6 col-lg-2">
                            <h5>Customer Care</h5>
                            <ul>
                                <li><a href="profile.html">My Account</a></li>
                                <li><a href="my-orders.html">Track Order</a></li>
                                <li><a href="contact.html">Contact</a></li>
                                <li><a href="products.html#offers">Offers</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-4">
                            <h5>Contact</h5>
                            <ul class="footer-contact">
                                <li><i class="bi bi-telephone"></i><a href="tel:+8801800000000">+880 1800 000 000</a></li>
                                <li><i class="bi bi-envelope"></i><a href="mailto:info@khatisoday.com">info@khatisoday.com</a></li>
                                <li><i class="bi bi-geo-alt"></i><span>Dhaka, Bangladesh</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="store-footer-bottom">
                        <span>© 2026 Khati Soday. All rights reserved.</span>
                        <span><i class="bi bi-shield-check"></i> Safe &amp; secure checkout</span>
                    </div>
                </div>
            </footer>
        `;
        const existingFooter = document.querySelector("footer");

        if (existingFooter) {
            existingFooter.outerHTML = footerMarkup;
        } else {
            document.body.insertAdjacentHTML("beforeend", footerMarkup);
        }
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

    const setupStoreNavigation = () => {
        const header = document.querySelector(".main-header .container");
        const headerRow = header?.querySelector(".row.align-items-center");
        const logoColumn = headerRow?.querySelector(":scope > .col-lg-2");
        const navList = document.querySelector(".navbar .navbar-nav");

        if (headerRow) {
            headerRow.classList.add("desktop-header");

            if (!headerRow.querySelector(".desktop-primary-nav")) {
                const primaryNav = document.createElement("nav");
                primaryNav.className = "desktop-primary-nav d-none d-lg-flex";
                primaryNav.setAttribute("aria-label", "Primary navigation");
                primaryNav.innerHTML = `
                    <a href="index.html">Home</a>
                    <a href="products.html">Products</a>
                    <a href="products.html#offers">Offers</a>
                    <a href="contact.html">Contact</a>
                `;

                if (logoColumn) {
                    logoColumn.after(primaryNav);
                } else {
                    headerRow.prepend(primaryNav);
                }
            }
        }

        if (!navList || navList.dataset.storeNavigationReady) {
            return;
        }

        navList.dataset.storeNavigationReady = "true";
        navList.classList.add("category-nav-links");
        navList.innerHTML = `
            <li class="nav-item mobile-primary-link d-lg-none"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item mobile-primary-link d-lg-none"><a class="nav-link" href="products.html">Products</a></li>
            <li class="nav-item mobile-primary-link d-lg-none"><a class="nav-link" href="products.html#offers">Offers</a></li>
            <li class="nav-item mobile-primary-link d-lg-none"><a class="nav-link" href="profile.html"><i class="bi bi-person-circle"></i> My Account</a></li>
            <li class="nav-item mobile-primary-link d-lg-none"><a class="nav-link" href="cart.html"><i class="bi bi-cart3"></i> Cart</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#mustard-oil">Mustard Oil</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#honey">Honey</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#dates">Dates</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#masala">Masala</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#nuts">Nuts</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#pickles">Pickles</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html#tea">Tea</a></li>
        `;
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

        const placeOrderButton = event.target.closest("#placeOrder");

        if (placeOrderButton) {
            placeOrder();
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

    document.querySelectorAll(".thumbnail-gallery .thumb").forEach((thumb) => {
        thumb.addEventListener("click", () => {
            const mainImage = document.querySelector(".main-product-image");

            if (!mainImage) {
                return;
            }

            mainImage.setAttribute("src", thumb.dataset.image);
            document.querySelectorAll(".thumbnail-gallery .thumb").forEach((item) => {
                item.classList.remove("active");
            });
            thumb.classList.add("active");
        });
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

    if (password && confirmPassword) {
        const validatePasswordMatch = () => {
            confirmPassword.setCustomValidity(
                password.value && confirmPassword.value && password.value !== confirmPassword.value
                    ? "Passwords do not match."
                    : ""
            );
        };

        password.addEventListener("input", validatePasswordMatch);
        confirmPassword.addEventListener("input", validatePasswordMatch);
    }

    normalizeStorefrontCopy();
    renderHomeProductRows();
    enhanceStaticProducts();
    enhanceDetailPage();
    enhanceForms();
    ensureStoreFooter();
    seedCartFromStaticRows();
    setupStoreNavigation();
    setupMobileHeader();
    setupProductFilters();
    renderProductCatalog();
    setupCheckoutForm();
    renderCartPage();
    renderCheckoutSummary();
    renderOrderSuccess();
    updateCartBadges();
});
