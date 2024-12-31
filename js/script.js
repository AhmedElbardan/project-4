// REGISTER & LOGIN ----------------------------------------------------------------------------------------------------------
function checkLogin(event, redirectUrl) {
    if (!localStorage.getItem("loggedIn") || localStorage.getItem("loggedIn") !== "true") {
        event.preventDefault();
        window.location = redirectUrl;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // تطبيق التحقق على إضافة المنتج إلى العربة
    document.querySelectorAll(".add_to_cart").forEach(button => {
        button.addEventListener("click", function(event) {
            checkLogin(event, "login.html"); // تعديل الرابط إلى صفحة التسجيل أو تسجيل الدخول
        });
    });

    // تطبيق التحقق على أيقونة القلب
    document.querySelectorAll(".fa-heart").forEach(icon => {
        icon.addEventListener("click", function(event) {
            checkLogin(event, "login.html"); // تعديل الرابط إلى صفحة التسجيل أو تسجيل الدخول
        });
    });

    // تحقق من تسجيل الدخول عند التحميل
    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("user_info").style.display = "flex";
        document.addEventListener("DOMContentLoaded", function() {
            let linksElement = document.getElementById("links");
            if (linksElement) {
                linksElement.style.display = "none";
            }
        });
    } else {
        document.getElementById("user_info").style.display = "none";
        document.getElementById("links").style.display = "block";
    }
});

// USERNAME ----------------------------------------------------------------------------------------------------------
// التحقق من حالة تسجيل الدخول وعرض معلومات المستخدم أو روابط التسجيل/تسجيل الدخول
let userInfo = document.querySelector("#user_info");
let userD = document.querySelector("#user");
let links = document.querySelector("#links");

if (localStorage.getItem("username") && localStorage.getItem("loggedIn") === "true") {
    links.remove();
    userInfo.style.display = "flex";
    const firstName = localStorage.getItem("first").split(" ")[0];
    userD.innerHTML = `Welcome ${firstName}`;
} else {
    userInfo.style.display = "none";
    links.style.display = "block";
}

// LOGOUT ----------------------------------------------------------------------------------------------------------
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

    // نقل المستخدم إلى صفحة تسجيل الدخول أولاً
    window.location = "login.html";

    // ضبط الوضع الافتراضي بعد فترة قصيرة
    setTimeout(() => {
        resetToDefault(); // ضبط الوضع الافتراضي عند عدم تسجيل الدخول
    }, 500);
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

// PRODUCTS ----------------------------------------------------------------------------------------------------------
// تعريف عناصر المنتجات ومصدر البيانات
let allProducts = document.querySelector(".products");
let products = productData;

// DRAW PRODUCTS ----------------------------------------------------------------------------------------------------------
// دالة لعرض المنتجات على الصفحة
function drawItems() {
    let y = products.map((item) => {
        return `
            <div class="card" data-id="${item.id}">
                <img class="product_item_img" src="${item.imageUrl}" alt="product image">
                <div class="card-body">
                    <h4 class="product">Product: ${item.title}</h4>
                    <span class="price">Price: ${item.price} $</span>
                    <p class="category">Category: ${item.category}</p>
                    <div class="product_item_action">
                    <button class="add_to_cart" data-id="${item.id}" onclick="addToCart(${item.id})">Add to Cart</button>
                    <i class="fa-solid fa-heart fav-icon" data-id="${item.id}"></i>
                    </div>
                </div>
            </div>
                `;
    }).join('');
    allProducts.innerHTML = y;
    initializeFavIcons();
}
drawItems();

// HEART ICON ----------------------------------------------------------------------------------------------------------
// دالة لتفعيل أيقونات الإعجاب وإدارة حالة المنتجات المفضلة
function initializeFavIcons() {
    let favIcons = document.querySelectorAll(".fav-icon");

    favIcons.forEach(favIcon => {
        let productId = favIcon.getAttribute('data-id');
        if (localStorage.getItem(`isFavourite-${productId}`) === "true") {
            favIcon.classList.add("clicked");
        }

        favIcon.addEventListener("click", function() {
            if (!localStorage.getItem("username") || localStorage.getItem("loggedIn") !== "true") {
                window.location = "register.html";
            } else {
                favIcon.classList.toggle("clicked");
                let isFavourite = favIcon.classList.contains("clicked");
                localStorage.setItem(`isFavourite-${productId}`, isFavourite);
            }
        });
    });

    let logOutBtn = document.querySelector("#logout");
    if (logOutBtn) {
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

            // نقل المستخدم إلى صفحة تسجيل الدخول
            setTimeout(() => {
                window.location = "login.html";
            }, 1500);
        });
    }
}

// دالة لإضافة المنتجات إلى السلة
function addToCart(id) {
    if (!localStorage.getItem("username") || localStorage.getItem("loggedIn") !== "true") {
        window.location = "register.html";
    } else {
        let choosenItem = products.find((item) => item.id === id);
    }
}
// SEARCH ----------------------------------------------------------------------------------------------------------
function searchProducts() {
    const searchInput = document.getElementById("search").value.toLowerCase(); // الحصول على قيمة البحث وتحويلها إلى أحرف صغيرة
    const searchType = document.getElementById("category").value; // الحصول على نوع البحث المحدد من القائمة المنسدلة
    const productCards = document.querySelectorAll(".card"); // الحصول على جميع بطاقات المنتجات

    productCards.forEach(card => {
        const productTitle = card.querySelector(".product").textContent.replace('Product: ', '').toLowerCase(); // الحصول على اسم المنتج وتحويله إلى أحرف صغيرة
        const productCategory = card.querySelector(".category").textContent.replace('Category: ', '').toLowerCase(); // الحصول على فئة المنتج وتحويلها إلى أحرف صغيرة

        let shouldDisplay = false; // متغير لتحديد ما إذا كانت البطاقة يجب عرضها أم لا
        if (searchType === "Search by Name") {
            shouldDisplay = productTitle.includes(searchInput); // التحقق مما إذا كان اسم المنتج يحتوي على نص البحث
        } else if (searchType === "Categories") {
            shouldDisplay = productCategory.includes(searchInput); // التحقق مما إذا كانت فئة المنتج تحتوي على نص البحث
        }

        card.style.display = shouldDisplay ? "block" : "none"; // عرض أو إخفاء البطاقة بناءً على نتيجة التحقق
    });
}

// إضافة مستمعي حدث لتفعيل البحث عند إدخال النص أو تغيير نوع البحث
document.getElementById("search").addEventListener("input", searchProducts);
document.getElementById("category").addEventListener("change", searchProducts);
// CART PRODUCT ----------------------------------------------------------------------------------------------------------
// تعريف عناصر السلة والبادج لإظهار عدد المنتجات
let cartProductDiv = document.querySelector(".carts_products div");
let badge = document.querySelector(".badge");

let addedItem = localStorage.getItem("ProductsInCart") ? JSON.parse(localStorage.getItem("ProductsInCart")) : [];

// دالة لتحديث عرض المنتجات في السلة
function updateCartDisplay() {
    cartProductDiv.innerHTML = "";
    addedItem.forEach(item => {
        cartProductDiv.innerHTML += `
            <p>${item.title} 
            <i class="fa-solid fa-minus h-minus" onclick="decreaseCount(${item.id})"></i>
            <i class="fa-regular fa-plus h-plus" onclick="increaseCount(${item.id})"></i>
            <span class="quantity">${item.count}</span></p>`;
        updateButtonState(item.id, true); // تحديث حالة الزر عند تحميل الصفحة
    });
    badge.style.display = addedItem.length ? "block" : "none";
    badge.innerHTML = addedItem.length;
}

// دالة لتحديث حالة أزرار الإضافة والإزالة
function updateButtonState(id, added) {
    let button = document.querySelector(`button[data-id='${id}']`);
    if (button) {
        button.innerText = added ? "Remove from Cart" : "Add to Cart";
        button.classList.toggle("remove-from-cart", added); // استخدام فئة CSS لتغيير اللون

        button.onclick = added ? function() { removeFromCart(id) } : function() { addToCart(id) };
    }
}

// دالة لإزالة المنتجات من السلة وتحديث العرض
function removeFromCart(id) {
    addedItem = addedItem.filter(item => item.id !== id);
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    updateCartDisplay();
    updateButtonState(id, false); // تأكد من تحديث الزر مباشرةً بعد إزالة المنتج
}

// دالة لإضافة المنتجات إلى السلة وتحديث العرض
function addToCart(id) {
    if (localStorage.getItem("username") && localStorage.getItem("loggedIn") === "true") {
        let choosenItem = products.find((item) => item.id === id);
        let existingItem = addedItem.find(item => item.id === id);

        if (existingItem) {
            existingItem.count++;
        } else {
            addedItem.push({...choosenItem, count: 1});
        }

        localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
        updateCartDisplay();
        updateButtonState(id, true);
    } else {
        window.location = "register.html";
    }
}

// تحديث العرض عند التحميل
updateCartDisplay();

// دالة لزيادة عدد منتجات في السلة
function increaseCount(id) {
    let item = addedItem.find(item => item.id === id);
    if (item) {
        item.count++;
        localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
        updateCartDisplay();
    }
}

// دالة لتقليل عدد منتجات في السلة أو إزالتها إذا كان العدد واحدًا
function decreaseCount(id) {
    let item = addedItem.find(item => item.id === id);
    if (item && item.count > 1) {
        item.count--;
    } else {
        addedItem = addedItem.filter(item => item.id !== id);
        updateButtonState(id, false); // تأكد من تحديث الزر مباشرةً بعد إزالة المنتج
    }
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    updateCartDisplay();
}

// تحديث العرض عند التحميل
updateCartDisplay();
// CART ICON ----------------------------------------------------------------------------------------------------------
// تفعيل عرض وإخفاء السلة عند النقر على أيقونة السلة
let shoppingCart = document.querySelector(".fa-shopping-cart");
let cartsProducts = document.querySelector(".carts_products");

shoppingCart.addEventListener("click", function(event) {
    toggleCartDisplay(event);
});

// دالة لعرض أو إخفاء السلة بناءً على حالتها الحالية
function toggleCartDisplay(event) {
    event.stopPropagation();
    const cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || [];

    if (cartItems.length === 0 && cartsProducts.querySelectorAll('p').length === 0) {
        cartsProducts.style.display = "none"; // لا تفتح السلة إذا كانت فارغة
    } else {
        if (cartsProducts.style.display === "block") {
            cartsProducts.style.display = "none";
        } else {
            cartsProducts.style.display = "block";
            checkCartContents(); // التحقق من محتويات السلة بعد الفتح
        }
    }
}

// دالة للتحقق من محتويات السلة وإغلاقها إذا كانت فارغة
function checkCartContents() {
    const observer = new MutationObserver(() => {
        const cartItems = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
        if (cartItems.length === 0 && cartsProducts.querySelectorAll('p').length === 0) {
            cartsProducts.style.display = "none";
            observer.disconnect(); // قطع الاتصال بعد إغلاق السلة
        }
    });

    observer.observe(cartProductDiv, { childList: true, subtree: true });
}