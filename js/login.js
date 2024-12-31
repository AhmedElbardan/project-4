// تعريف العناصر التي سيتم التفاعل معها في النموذج
let email = document.querySelector("#email"); // حقل البريد الإلكتروني
let password = document.querySelector("#password"); // حقل كلمة المرور

let loginBtn = document.querySelector("#sign_in"); // زر تسجيل الدخول
let cancelBtn = document.querySelector("#cancel"); // زر الإلغاء (تأكد من التهجئة الصحيحة)

let getUser = localStorage.getItem("email"); // الحصول على البريد الإلكتروني من LocalStorage
let getPassword = localStorage.getItem("password"); // الحصول على كلمة المرور من LocalStorage

// إضافة مستمع لحدث النقر على زر تسجيل الدخول
loginBtn.addEventListener("click", function(e) {
    e.preventDefault(); // منع السلوك الافتراضي للنموذج (الإرسال)
    
    // التحقق من ملء الحقول
    if (email.value === "" || password.value === "") {
        alert("please fill data"); // عرض تنبيه إذا كانت الحقول فارغة
    } else {
        // التحقق من صحة بيانات المستخدم
        if (getUser && getUser.trim() === email.value.trim() && getPassword && getPassword === password.value) {
            localStorage.setItem("loggedIn", "true"); // تسجيل الدخول بنجاح وتخزين حالة تسجيل الدخول
            // إعادة توجيه المستخدم إلى الصفحة الرئيسية بعد 1.5 ثانية
            setTimeout(() => {
                window.location = "index.html";
            }, 1500);
        } else {
            alert("username or password is wrong"); // عرض تنبيه إذا كانت البيانات غير صحيحة
        }
    }
});