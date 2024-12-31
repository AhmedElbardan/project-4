// تعريف العناصر التي سيتم التفاعل معها في النموذج
let first = document.querySelector("#first"); // حقل الاسم الأول
let last = document.querySelector("#last"); // حقل اسم العائلة
let email = document.querySelector("#email"); // حقل البريد الإلكتروني
let password = document.querySelector("#password"); // حقل كلمة المرور

let register_btn = document.querySelector("#sign_up"); // زر التسجيل

// إضافة مستمع لحدث تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
    let registerBtn = document.getElementById("sign_up"); // الحصول على زر التسجيل (ملاحظة: كان اسم المتغير غير متطابق في الكود السابق)
    
    if (registerBtn) { // التحقق من وجود الزر
        registerBtn.addEventListener("click", function(e) { // إضافة مستمع حدث النقر على زر التسجيل
            e.preventDefault(); // منع السلوك الافتراضي للنموذج (الإرسال)
            
            // التحقق من ملء جميع الحقول
            if (first.value === "" || last.value === "" || email.value === "" || password.value === "") {
                alert("please fill data"); // عرض تنبيه إذا كانت الحقول فارغة
            } else {
                // تخزين البيانات في localStorage
                localStorage.setItem("first", first.value);
                localStorage.setItem("last", last.value);
                localStorage.setItem("email", email.value);
                localStorage.setItem("password", password.value);
                localStorage.setItem("username", `${first.value} ${last.value}`);
                
                // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد 1.5 ثانية
                setTimeout(() => {
                    window.location = "login.html";
                }, 1500);
            }
        });
    }
});