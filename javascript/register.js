const firebaseConfig = {
    apiKey: "AIzaSyAL6cp7X3vnIttif7XjWVZqnwomHdoxrRw",
    authDomain: "appgiapha.firebaseapp.com",
    projectId: "appgiapha",
    storageBucket: "appgiapha.appspot.com",
    messagingSenderId: "832803929271",
    appId: "1:832803929271:web:1453609f2cb23819c8e132",
    measurementId: "G-GLKHZPBEBY"
};
firebase.initializeApp(firebaseConfig);
render();
function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recapcha')
    recaptchaVerifier.render()
}
function phoneAuth() {
    var number = document.getElementById('phone').value;
    if (number.startsWith('0')) {
        number = '+84' + number.slice(1);
    }
    firebase.auth().signInWithPhoneNumber(number,
        window.recaptchaVerifier).then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            coderesult = confirmationResult;
            document.getElementById('otp-container').style.display = 'block';
            document.getElementById('register-container').style.display = 'none';
        }).catch(function (error) {
            alert(error.message)
        })

}
var userId;
function registerUser() {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            password: password
        }),
        success: function (response) {
            userId = response.data.user[0]._id;
            phoneAuth();
        },
        error: function (error) {
            var errorResponse = JSON.parse(error.responseText);
            console.log(errorResponse.error);
        }
    });
}
function codeverify() {
    var code = document.getElementById('otp').value;
    coderesult.confirm(code).then(function () {
        $.ajax({
            url: '/register/' + userId,
            type: 'POST',
            success: function (response) {
                document.getElementById('otp-container').style.display = 'none';
                document.getElementById('kho-container').style.display = 'block';
            },
            error: function (error) {
                var errorResponse = JSON.parse(error.responseText);
                console.log(errorResponse.error);
            }
        });

    }).catch(function () {
        document.getElementsByClassName('no')[0].style.display = 'block';
    })
}
function postdepot() {
    var name = document.getElementById('namekho').value;
    var address = document.getElementById('address').value;

        $.ajax({
            url: '/postdepot/' + userId,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
            name: name,
            address:address
        }),
            success: function (response) {
                document.getElementById('dialogsuccess').style.display = 'block';
                document.getElementById('kho-container').style.display = 'none';
                setTimeout(function () {
                    window.location.href = '/';
                }, 5000);
            },
            error: function (error) {
                var errorResponse = JSON.parse(error.responseText);
                console.log(errorResponse.error);
            }
        }).catch(function () {
        document.getElementsByClassName('no')[0].style.display = 'block';
    })
}