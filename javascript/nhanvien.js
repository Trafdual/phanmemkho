let nhanviendatamap = {}
let intervalnhanvien;

function getnhanvien() {
    const nhanvienTableBody = document.getElementById('nhanvienTableBody');

    fetch(`/getnhanvienjson`)
        .then(response => response.json())
        .then(data => {

            nhanvienTableBody.innerHTML = ''; // Clear the existing content
            data.forEach(nhanvien => {
                    nhanviendatamap[nhanvien._id] = nhanvien;
                    const newCommentDiv = document.createElement('tr');
                    newCommentDiv.innerHTML = `
            <td class="td-name" style="margin-right:5px; padding:10px">
                ${nhanvien.name}
            </td>
                                <td class="td-email" style="margin-right:5px; padding:10px">
                ${nhanvien.email}
            </td>
                                <td class="td-phone" style="margin-right:5px; padding:10px">
                ${nhanvien.phone}
            </td>
                                 <td class="td-pass" style="margin-right:5px; padding:10px">
                ${nhanvien.password}
            </td>
                                <td class="td-birth" style="margin-right:5px; padding:10px">
                ${nhanvien.birthday}
            </td>
                                <td class="td-date" style="margin-right:5px; padding:10px">
                ${nhanvien.date}
            </td>
            <td style="margin-right:5px; padding:10px">
                        <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #F89007; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="editnv('${nhanvien._id}')">Cập Nhật</button>
                            <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #FA0303; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="ngungnv('${nhanvien._id}')">Ngừng hoạt động</button>
                    </td>
    `;
                    nhanvienTableBody.appendChild(newCommentDiv);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy danh sách khách hàng:', error);
                    alert('Đã xảy ra lỗi khi lấy danh sách khách hàng.');
                });
        });
}

getnhanvien();

function openaddnvmodal() {
    var modal = new bootstrap.Modal(document.getElementById('addnhanvienmodal'));
    modal.show();
}

function openputnvmodal() {
    var modal = new bootstrap.Modal(document.getElementById('putnhanvienmodal'));
    modal.show();
}

function openngunghoatdongnvmodal() {
    var modal = new bootstrap.Modal(document.getElementById('ngunghdnhanvienmodal'));
    modal.show();
}

function clearInputFieldsnhanvien() {
    document.getElementById('namenv').value = '';
    document.getElementById('phonenv').value = '';
    document.getElementById('emailnv').value = '';
    document.getElementById('birthdaynv').value = '';
    document.getElementById('passwordnv').value = '';
}



function addnhanvien() {
    var namenv = document.getElementById('namenv').value;
    var phonenv = document.getElementById('phonenv').value;
    var emailnv = document.getElementById('emailnv').value;
    var birthdaynv = document.getElementById('birthdaynv').value;
    var passwordnv = document.getElementById('passwordnv').value;

    fetch('/postnhanvien', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: namenv,
                phone: phonenv,
                email: emailnv,
                birthday: birthdaynv,
                password: passwordnv,
            })
        })
        .then(response => response.json())
        .then(data => {
            clearInputFieldsnhanvien();
            intervalnhanvien = setInterval(getnhanvien, 500);
            setTimeout(() => {
                clearInterval(intervalnhanvien);
                console.error('Interval cleared');
            }, 1000)

        })
        .catch(error => {
            console.error(error.message)

        });

}

function formatDateForInputnhanvien(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

function fillInputFieldsnhanvien(customerData) {
    document.getElementById('namenv1').value = customerData.name;
    document.getElementById('phonenv1').value = customerData.phone;
    document.getElementById('emailnv1').value = customerData.email
    document.getElementById('birthdaynv1').value = formatDateForInputnhanvien(customerData.birthday);
    document.getElementById('passwordnv1').value = customerData.password
    document.getElementById('datenv1').value = formatDateForInputnhanvien(customerData.date);

}

function editnv(customerId) {
    const nhanvien = nhanviendatamap[customerId];

    if (!nhanvien) {
        console.error('Không tìm thấy nhân viên với ID:', customerId);
        alert('Đã xảy ra lỗi khi tìm nhân viên.');
        return;
    }

    const customerData = {
        name: nhanvien.name,
        phone: nhanvien.phone,
        email: nhanvien.email,
        birthday: nhanvien.birthday,
        password: nhanvien.password,
        date: nhanvien.date,
    };

    // Điền dữ liệu vào các input
    fillInputFieldsnhanvien(customerData);

    // Mở modal để chỉnh sửa
    openputnvmodal();

    // Gọi putkhachhang khi người dùng nhấn nút lưu (có thể thay đổi theo nhu cầu của bạn)
    document.getElementById('putnhanvienButton').onclick = function() {
        putnhanvien(customerId);
    };
}

function putnhanvien(id) {
    var namenv = document.getElementById('namenv1').value;
    var phonenv = document.getElementById('phonenv1').value;
    var emailnv = document.getElementById('emailnv1').value;
    var birthdaynv = document.getElementById('birthdaynv1').value;
    var passwordnv = document.getElementById('passwordnv1').value;
    var datenv = document.getElementById('datenv1').value;



    fetch(`/putnhanvien/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: namenv,
                phone: phonenv,
                email: emailnv,
                birthday: birthdaynv,
                password: passwordnv,
                date: datenv
            })
        })
        .then(response => response.json())
        .then(data => {
            intervalnhanvien = setInterval(getnhanvien, 500);
            setTimeout(() => {
                clearInterval(intervalnhanvien);
                console.error('Interval cleared');
            }, 1000)

        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}

function ngungnv(customerId) {
    openngunghoatdongnvmodal()

    document.getElementById('ngunghdnhanvienButton').onclick = function() {
        ngunghoatdongnv(customerId);
    };
}

function ngunghoatdongnv(id) {
    fetch(`/ngunghoatdongnhanvien/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            intervalnhanvien = setInterval(getnhanvien, 500);
            setTimeout(() => {
                clearInterval(intervalnhanvien);
                console.error('Interval cleared');
            }, 1000)
        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}