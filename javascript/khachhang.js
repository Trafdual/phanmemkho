let inter;
let customerDataMap = {};

function getkhachhang() {
    const khachhangTableBody = document.getElementById('khachhangTableBody');

    fetch(`/getkhachhang`)
        .then(response => response.json())
        .then(data => {

            khachhangTableBody.innerHTML = ''; // Clear the existing content
            data.forEach(khachhang => {
                    customerDataMap[khachhang._id] = khachhang;
                    const newCommentDiv = document.createElement('tr');
                    newCommentDiv.innerHTML = `
        <td class="td-id" style="margin-right:5px; padding:10px" >
            ${khachhang._id}
            </td>
            <td class="td-name" style="margin-right:5px; padding:10px">
                ${khachhang.name}
            </td>
                                <td class="td-email" style="margin-right:5px; padding:10px">
                ${khachhang.email}
            </td>
                                <td class="td-phone" style="margin-right:5px; padding:10px">
                ${khachhang.phone}
            </td>
                                <td class="td-date" style="margin-right:5px; padding:10px">
                ${khachhang.date}
            </td>
            <td style="margin-right:5px; padding:10px">
                        <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #F89007; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="editCustomer('${khachhang._id}')">Cập Nhật</button>
                            <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #FA0303; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="ngunghoatdong('${khachhang._id}')">Ngừng hoạt động</button>
                    </td>
    `;
                    khachhangTableBody.appendChild(newCommentDiv);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy danh sách khách hàng:', error);
                    alert('Đã xảy ra lỗi khi lấy danh sách khách hàng.');
                });
        });
}
inter = setInterval(getkhachhang, 1000);

function openkhach() {
    document.getElementById('khachhang').style.display = 'block';
}

function openaddmodal() {
    var modal = new bootstrap.Modal(document.getElementById('addkhachmodal'));
    modal.show();
}

function openputmodal() {
    var modal = new bootstrap.Modal(document.getElementById('putkhachmodal'));
    modal.show();
}

function closeaddmodal() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('addkhachmodal'));
    if (modal) {
        modal.hide();
    }
}

function closeputmodal() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('putkhachmodal'));
    if (modal) {
        modal.hide();
    }
}

function clearInputFields() {
    document.getElementById('namekhach').value = '';
    document.getElementById('phonekhach').value = '';
    document.getElementById('emailkhach').value = '';
    document.getElementById('datekhach').value = '';
    document.getElementById('addresskhach').value = '';
    document.getElementById('cancuockhach').value = '';
}



function addkhachhang() {
    var namekhach = document.getElementById('namekhach').value;
    var phonekhach = document.getElementById('phonekhach').value;
    var emailkhach = document.getElementById('emailkhach').value;
    var datekhach = document.getElementById('datekhach').value;
    var addresskhach = document.getElementById('addresskhach').value;
    var cancuockhach = document.getElementById('cancuockhach').value;


    fetch('/postkhachhang', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: namekhach,
                phone: phonekhach,
                email: emailkhach,
                date: datekhach,
                address: addresskhach,
                cancuoc: cancuockhach
            })
        })
        .then(response => response.json())
        .then(data => {
            clearInputFields();
            closeaddmodal();

        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = `<p class="alert alert-danger">${error.message}</p>`;
        });

}

function formatDateForInput(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

function fillInputFields(customerData) {
    document.getElementById('namekhach1').value = customerData.name;
    document.getElementById('phonekhach1').value = customerData.phone;
    document.getElementById('emailkhach1').value = customerData.email;
    document.getElementById('datekhach1').value = formatDateForInput(customerData.date);
    document.getElementById('addresskhach1').value = customerData.address;
    document.getElementById('cancuockhach1').value = customerData.cancuoc;
}

function editCustomer(customerId) {
    const customer = customerDataMap[customerId];

    if (!customer) {
        console.error('Không tìm thấy khách hàng với ID:', customerId);
        alert('Đã xảy ra lỗi khi tìm khách hàng.');
        return;
    }

    const customerData = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        date: customer.date,
        address: customer.address,
        cancuoc: customer.cancuoc
    };

    // Điền dữ liệu vào các input
    fillInputFields(customerData);

    // Mở modal để chỉnh sửa
    openputmodal();

    // Gọi putkhachhang khi người dùng nhấn nút lưu (có thể thay đổi theo nhu cầu của bạn)
    document.getElementById('putkhachButton').onclick = function() {
        putkhachhang(customerId);
    };
}

function putkhachhang(id) {
    var namekhach = document.getElementById('namekhach1').value;
    var phonekhach = document.getElementById('phonekhach1').value;
    var emailkhach = document.getElementById('emailkhach1').value;
    var datekhach = document.getElementById('datekhach1').value;
    var addresskhach = document.getElementById('addresskhach1').value;
    var cancuockhach = document.getElementById('cancuockhach1').value;

    fetch(`/putkhachhang/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: namekhach,
                phone: phonekhach,
                email: emailkhach,
                date: datekhach,
                address: addresskhach,
                cancuoc: cancuockhach
            })
        })
        .then(response => response.json())
        .then(data => {
            closeputmodal();

        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}

function ngunghoatdong(id) {
    fetch(`/ngunghdkhachhang/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}