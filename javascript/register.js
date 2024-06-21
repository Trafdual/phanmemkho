var userId;

function registerUser() {
    var registerButton = document.getElementById('registerButton');
    var loadingSpinner = document.getElementById('loadingSpinner');

    // Disable the button and show the loading spinner
    registerButton.disabled = true;
    loadingSpinner.style.display = 'inline-block';

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
        success: function(response) {
            if (response.data && response.data.user && response.data.user.length > 0) {
                userId = response.data.user[0]._id;
                document.getElementById('otp-container').style.display = 'block';
                document.getElementById('register-container').style.display = 'none';
            } else {
                var errorContainer = document.getElementById('error-container');
                errorContainer.innerHTML = `<p class="alert alert-danger">${response.message}</p>`;
            }
        },
        error: function(error) {
            var errorResponse;
            try {
                errorResponse = JSON.parse(error.responseText);
            } catch (e) {
                errorResponse = { message: 'Lỗi không xác định' };
            }

            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = `<p class="alert alert-danger">${errorResponse.message}</p>`;
        },
        complete: function() {
            // Re-enable the button and hide the loading spinner
            setTimeout(function() {
                registerButton.disabled = false;
                loadingSpinner.style.display = 'none';
            }, 5000);
        }
    });
}

function sendEmail() {
    // Code để gửi email OTP, ví dụ gọi API

    // Hiển thị thẻ p và bắt đầu đếm ngược
    const countdownElement = document.getElementById('countdown');
    const sendemail = document.getElementById('sendemail');
    const clicknut = document.getElementById('clicknut');
    const nhapma = document.getElementById('nhapma');
    const codeverifyButton = document.getElementById('codeverifyButton');
    const timeElement = document.getElementById('time');
    countdownElement.style.display = 'none';
    let timeLeft = 60;
    $.ajax({
        url: '/sendemail/' + userId,
        type: 'POST',
        success: function(response) {
            countdownElement.style.display = 'block';
            sendemail.style.display = 'none'
            clicknut.style.display = 'none'
            nhapma.style.display = 'block'
            codeverifyButton.style.display = 'block'
            countdownElement.style.display = 'block';
            timeElement.textContent = 'Mã OTP sẽ hết hạn sau ' + timeLeft + ' giây'; // Đặt lại thời gian ban đầu
            const countdownInterval = setInterval(() => {
                timeLeft--;
                timeElement.textContent = 'Mã OTP sẽ hết hạn sau ' + timeLeft + ' giây';

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    timeElement.textContent = 'Mã OTP đã hết hạn';
                    sendemail.style.display = 'block'
                    codeverifyButton.style.display = 'none'

                }
            }, 1000);

        },
        error: function(error) {
            var errorResponse = JSON.parse(error.responseText);
            console.log(errorResponse.error);
        }
    }).catch(function() {
        document.getElementsByClassName('no')[0].style.display = 'block';
    })
}

function codeverify() {
    var codeverifyButton = document.getElementById('codeverifyButton');
    var loadingSpinner1 = document.getElementById('loadingSpinner1');
    var errorContainer = document.getElementById('error-container1');
    errorContainer.style.display = 'none';
    // Disable the button and show the loading spinner
    codeverifyButton.disabled = true;
    loadingSpinner1.style.display = 'inline-block';

    var otp = document.getElementById('otp').value;
    $.ajax({
        url: '/register/' + userId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            otp: otp
        }),
        success: function(response) {
            if (response.message === 'Bạn đã nhập sai mã OTP.') {
                errorContainer.innerHTML = `<p class="alert alert-danger">${response.message}</p>`;
                errorContainer.style.display = 'block';
            }
            if (response.message === 'thành công.') {
                document.getElementById('otp-container').style.display = 'none';
                document.getElementById('kho-container').style.display = 'block';
            }
        },
        error: function(error) {
            var errorResponse = JSON.parse(error.responseText);
            console.log(errorResponse.error);
        },
        complete: function() {
            // Re-enable the button and hide the loading spinner
            setTimeout(function() {
                codeverifyButton.disabled = false;
                loadingSpinner1.style.display = 'none';
            }, 5000);
        }
    }).catch(function() {
        document.getElementsByClassName('no')[0].style.display = 'block';
    })
}

function postdepot() {

    var postdepotButton = document.getElementById('postdepotButton');
    var loadingSpinner2 = document.getElementById('loadingSpinner2');

    // Disable the button and show the loading spinner
    postdepotButton.disabled = true;
    loadingSpinner2.style.display = 'inline-block';

    var name = document.getElementById('namekho').value;
    var address = document.getElementById('address').value;

    $.ajax({
        url: '/postdepot/' + userId,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            address: address
        }),
        success: function(response) {
            document.getElementById('dialogsuccess').style.display = 'block';
            document.getElementById('kho-container').style.display = 'none';
            setTimeout(function() {
                window.location.href = '/';
            }, 5000);
        },
        error: function(error) {
            var errorResponse = JSON.parse(error.responseText);
            console.log(errorResponse.error);
        },
        complete: function() {
            // Re-enable the button and hide the loading spinner
            setTimeout(function() {
                postdepotButton.disabled = false;
                loadingSpinner2.style.display = 'none';
            }, 5000);
        }
    }).catch(function() {
        document.getElementsByClassName('no')[0].style.display = 'block';
    })
}