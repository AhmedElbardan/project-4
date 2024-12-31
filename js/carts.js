// LOGOUT ----------------------------------------------------------------------------------------------------------
// تفعيل عملية تسجيل الخروج وإعادة توجيه المستخدم إلى صفحة تسجيل الدخول
let logOutBtn = document.querySelector("#logout");

logOutBtn.addEventListener("click", function() {
    // الحصول على البيانات المسجلة بعد التسجيل
    let registrationData = {
        username: localStorage.getItem("username"),
        first: localStorage.getItem("first"),
        last: localStorage.getItem("last"),
        email: localStorage.getItem("email")
    };
    // مسح بيانات تسجيل الدخول فقط
    localStorage.removeItem("loggedIn");

    // إعادة تخزين البيانات المسجلة بعد التسجيل
    localStorage.setItem("username", registrationData.username);
    localStorage.setItem("first", registrationData.first);
    localStorage.setItem("last", registrationData.last);
    localStorage.setItem("email", registrationData.email);

    // ضبط الوضع الافتراضي عند عدم تسجيل الدخول
    resetToDefault();
    // نقل المستخدم إلى صفحة تسجيل الدخول
    setTimeout(() => {
        window.location = "login.html";
    }, 1500);
});

function resetToDefault() {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("loggedIn") !== "true") {
        // إعادة تعيين أيقونات الإعجاب
        let favIcons = document.querySelectorAll(".fav-icon");
        favIcons.forEach(favIcon => {
            favIcon.classList.remove("clicked");
        });
        // إعادة تعيين أزرار "إضافة إلى السلة"
        let addToCartButtons = document.querySelectorAll(".add_to_cart");
        addToCartButtons.forEach(button => {
            button.innerText = "Add to Cart";
            button.classList.remove("remove-from-cart");
            button.onclick = function() {
                addToCart(button.getAttribute('data-id'));
            };
        });
        // ضبط وضع الموقع الافتراضي
        document.getElementById("user_info").style.display = "none";
        document.getElementById("links").style.display = "block";
    }
}
document.addEventListener("DOMContentLoaded", function() {
    resetToDefault(); // ضبط الوضع الافتراضي عند عدم تسجيل الدخول
});
// PRICE ----------------------------------------------------------------------------------------------------------
// تحميل العناصر من LocalStorage
let ProductsInCart = localStorage.getItem("ProductsInCart");
let addedItem = ProductsInCart ? JSON.parse(ProductsInCart) : [];
let productContainer = document.querySelector(".products"); // عنصر يحتوي على المنتجات
let priceDisplayElement = document.getElementById("totalPrice"); // عنصر لعرض إجمالي السعر
let overallPrice = 0; // متغير لحفظ إجمالي السعر

// دالة لرسم المنتجات في العربة
function drawCartProducts(products) {
    let y = products.map((item) => {
        return `
            <div class="product-body" data-id="${item.id}">
                <img class="product-img" src="${item.imageUrl}" alt="product image" draggable="false" onerror="handleImageError(this)">
                <div class="product-con">
                    <h4 class="product2">Product: ${item.title}</h4>
                    <p class="category2">Category: ${item.category}</p>
                    <span class="price2">Price: ${item.price} $</span>
                    <div class="product_item_action2">
                        <span class="c-quantity" data-id="${item.id}">${item.count}</span>
                        <i class="fa-regular fa-plus c-plus" onclick="increaseCount(${item.id})"></i>
                        <i class="fa-solid fa-minus c-minus" onclick="decreaseCount(${item.id})"></i>
                        <button class="Remove bg-danger" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    productContainer.innerHTML = y; // تحديث المنتجات في الصفحة
}

// دالة تضبط الابعاد في حالة عدم تواجد الصور
function handleImageError(image) {
    const productCon = image.nextElementSibling;
    productCon.style.margin = "-70px 240px"; // تطبيق الأنماط المطلوبة عند عدم توفر الصورة
    
    const favoTitle = image.parentElement.querySelector('.favo-title');
    favoTitle.style.margin = "190px 20px"; // تطبيق الأنماط المطلوبة للعنصر .favo-title عند عدم توفر الصورة

    const favoCategory = image.parentElement.querySelector('.favo-category');
    favoCategory.style.marginTop = "-170px"; // تطبيق الأنماط المطلوبة للعنصر .favo-category عند عدم توفر الصورة
}

// دالة لتحديث إجمالي السعر
function updateTotalPrice() {
    let totalPriceElement = document.getElementById("totalPrice");
    let priceSection = document.querySelector(".price");
    let hrElement = document.querySelector(".hr3");
    let cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || []; // الحصول على المنتجات من العربة
    let totalPrice = cartItems.reduce((total, item) => total + item.price * item.count, 0); // حساب إجمالي السعر

    // تحديث العنصر بإجمالي السعر
    totalPriceElement.textContent = totalPrice.toFixed(2) + " $"; // عرض إجمالي السعر

    // إظهار أو إخفاء القسم بناءً على وجود المنتجات في السلة
    if (cartItems.length === 0) {
        priceSection.style.display = "none";
        hrElement.style.display = "none";
        // تحويل المستخدم إلى الصفحة الرئيسية إذا كانت السلة فارغة
        window.location.href = "index.html";
    } else {
        priceSection.style.display = "block";
        hrElement.style.display = "block";
    }
}

// استدعاء دالة تحديث إجمالي السعر عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    updateTotalPrice(); // تحديث إجمالي السعر عند تحميل الصفحة
});

// دالة لزيادة كمية المنتج
function increaseCount(id) {
    let cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || []; // الحصول على المنتجات من العربة
    let item = cartItems.find(item => item.id === id); // العثور على المنتج بناءً على المعرف

    if (item) {
        item.count++; // زيادة الكمية
        localStorage.setItem("ProductsInCart", JSON.stringify(cartItems)); // تحديث LocalStorage بالكمية الجديدة
        updateTotalPrice(); // تحديث إجمالي السعر
        updateItemCountDisplay(id, item.count); // تحديث عرض الكمية
    }
}

// دالة لنقصان كمية المنتج
function decreaseCount(id) {
    let cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || []; // الحصول على المنتجات من العربة
    let item = cartItems.find(item => item.id === id); // العثور على المنتج بناءً على المعرف

    if (item) {
        if (item.count > 1) {
            item.count--; // تقليل الكمية
            updateItemCountDisplay(id, item.count); // تحديث عرض الكمية
        } else {
            cartItems = cartItems.filter(item => item.id !== id); // إزالة المنتج إذا كانت الكمية صفر
            // إخفاء المنتج إذا كانت الكمية صفر
            let productCard = document.querySelector(`.product-body[data-id='${id}']`);
            if (productCard) {
                productCard.style.display = "none";
            }
        }
        localStorage.setItem("ProductsInCart", JSON.stringify(cartItems)); // تحديث LocalStorage بالكمية الجديدة
        updateTotalPrice(); // تحديث إجمالي السعر
    }
}

// دالة لتحديث عرض الكمية
function updateItemCountDisplay(id, count) {
    let countElement = document.querySelector(`.c-quantity[data-id='${id}']`); // العثور على عنصر الكمية
    if (countElement) {
        countElement.textContent = count; // تحديث الكمية المعروضة
    } else {
        console.error(`Element with .c-quantity[data-id='${id}'] not found.`);
    }
}
// دالة لإزالة المنتج من العربة
function removeFromCart(id) {
    addedItem = addedItem.filter(item => item.id !== id);
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    drawCartProducts(addedItem);
    updateTotalPrice(); // تحديث إجمالي السعر بعد الإزالة
}
// تحديث العرض عند التحميل
if (ProductsInCart) {
    let item = JSON.parse(ProductsInCart);
    drawCartProducts(item);
}
// إضافة مستمع لحدث تحميل الصفحة لتحديث إجمالي السعر
document.addEventListener("DOMContentLoaded", function() {
    updateTotalPrice(); // تحديث إجمالي السعر عند تحميل الصفحة
});
// FAVOURITE ----------------------------------------------------------------------------------------------------------
function initSwiper() {
    if (window.mySwiper) {
        window.mySwiper.destroy(true, true); // تدمير السلايدر القديم
    }
    window.mySwiper = new Swiper('.card-wrapper', {
        loop: false,
        spaceBetween: 30,
        // pagination bullets
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        // responsive breakpoints
        breakpoints: {
            0: {
                slidesPerView: 1 // منتج واحد عند عرض الشاشة الصغير
            },
            768: {
                slidesPerView: 2 // منتجان عند عرض الشاشة المتوسط
            },
            1024: {
                slidesPerView: 3 // ثلاثة منتجات عند عرض الشاشة الكبير
            },
        }
    });
}

function drawFavoriteProducts(products) {
    let favoriteContainer = document.querySelector(".card-list");
    let sectionHeader = document.querySelector(".section-header");
    let hrElement = document.querySelector(".hr4");

    if (window.innerWidth >= 1000 && products.length <= 2) {
        favoriteContainer.classList.add('centered');
    } else {
        favoriteContainer.classList.remove('centered');
    }

    let y = products.map((item) => {
        return `
            <li class="card-item swiper-slide" data-id="${item.id}">
                <a class="card-link">
                    <img src="${item.imageUrl}" class="card-image" alt="Product Image" draggable="false" onerror="handleImageError(this)">
                    <h3 class="card-Product">Product: ${item.title}</h3>
                    <h3 class="card-category">Category: ${item.category}</h3>
                    <i class="fa-solid fa-heart fav-icon favo-icon ${localStorage.getItem(`isFavourite-${item.id}`) === "true" ? "clicked" : ""}" data-id="${item.id}" onclick="toggleFavorite(${item.id})"></i>
                </a>
            </li>`;
    }).join('');
    favoriteContainer.innerHTML = y;
    // إظهار أو إخفاء القسم بناءً على عدد المنتجات المفضلة
    if (products.length === 0) {
        if (sectionHeader) sectionHeader.style.display = "none";
        if (hrElement) hrElement.style.display = "none";
    } else {
        if (sectionHeader) sectionHeader.style.display = "block";
        if (hrElement) hrElement.style.display = "block";
    }
    initSwiper(); // إعادة تهيئة السلايدر بعد تحديث المنتجات المفضلة
}

function updateFavoriteDisplay() {
    let favorites = productData.filter(item => localStorage.getItem(`isFavourite-${item.id}`) === "true");
    drawFavoriteProducts(favorites);

    // إعادة حساب عدد الكرات بناءً على عدد المنتجات المعروضة
    let slidesPerView;
    if (window.innerWidth >= 1024) {
        slidesPerView = 3;
    } else if (window.innerWidth >= 768) {
        slidesPerView = 2;
    } else {
        slidesPerView = 1;
    }

    let totalSlides = Math.ceil(favorites.length / slidesPerView);
    // تحديث السلايدر
    initSwiper();
    // تحديث عدد الكرات (الشرائح)
    if (window.mySwiper.pagination && window.mySwiper.pagination.bullets) {
        let bullets = window.mySwiper.pagination.bullets;
        bullets.forEach((bullet, index) => {
            if (index < totalSlides) {
                bullet.style.display = '';
            } else {
                bullet.style.display = 'none';
            }
        });
    }
}

function toggleFavorite(id) {
    let favIcon = document.querySelector(`.fav-icon[data-id='${id}']`);
    let isFavourite = favIcon.classList.toggle("clicked");
    localStorage.setItem(`isFavourite-${id}`, isFavourite);

    const productElement = document.querySelector(`.card-item[data-id="${id}"]`);

    if (productElement) {
        productElement.classList.add("removing");

        // انتظر انتهاء تأثير الانتقال قبل إزالة العنصر نهائيًا
        setTimeout(() => {
            updateFavoriteDisplay(); // تحديث العرض بعد إزالة المنتج
        }, 500); // يتطابق مع مدة الانتقال في CSS
    }
}
document.addEventListener("DOMContentLoaded", function() {
    updateFavoriteDisplay(); // تحديث عرض المنتجات المفضلة عند تحميل الصفحة
    setTimeout(() => {
        initSwiper(); // تأجيل إعادة تهيئة السلايدر للتأكد من تحميل العناصر
        // moveToSlide(0); // عرض الشريحة الأولى عند التحميل
    }, 0);
});