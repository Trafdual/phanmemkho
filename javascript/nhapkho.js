let intervalID;
let loaiDataMap = {};


function getloaisanpham() {
    const commentsTableBody = document.getElementById('loaiTableBody');
    document.getElementById('loaisanpham').style.display = 'block'
    fetch(`/getloaisanphamweb`)
        .then(response => response.json())
        .then(data => {
            commentsTableBody.innerHTML = ''; // Clear the existing content
            data.forEach(loaisanpham => {
                loaiDataMap[loaisanpham._id] = loaisanpham;
                const newCommentDiv = document.createElement('tr');
                newCommentDiv.innerHTML = `
                <td class="td-id" style="margin-right:5px; padding:10px" >
                    ${loaisanpham._id}
                    </td>
                    <td class="td-name" style="margin-right:5px; padding:10px">
                        ${loaisanpham.name}
                    </td>
                    <td style="margin-right:5px; padding:10px">
                      <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #F89007; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="editloai('${loaisanpham._id}')">Cập nhật</button>
                            <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #FA0303; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="openchitietloaimodal('${loaisanpham._id}')">Chi tiết</button>
                    </td>
            `;
                commentsTableBody.appendChild(newCommentDiv);
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách loại sản phẩm:', error);
            alert('Đã xảy ra lỗi khi lấy danh sách loại sản phẩm.');
        });

}
intervalID = setInterval(getloaisanpham, 1000)

function openchitietloaimodal(id) {
    const modalElement = document.getElementById('chitietloaispmodal');
    modalElement.id = `chitietloaispmodal${id}`;
    var modal = new bootstrap.Modal(modalElement);
    modal.show();
    setInterval(() => getAndDisplay(id), 1000)
    document.getElementById('closeModalchitiet').onclick = function() {
        modalElement.id = 'chitietloaispmodal'
    };
}

function getAndDisplay(id) {
    const modalElement = document.getElementById(`chitietloaispmodal${id}`);
    const sanphamTableBody = modalElement.querySelector('#sanphamTableBody');

    fetch(`/getsanpham/${id}`)
        .then(response => response.json())
        .then(data => {
            sanphamTableBody.innerHTML = ''; // Clear the existing content

            data.forEach(sanpham => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="td-id">${sanpham._id}</td>
                    <td class="td-namesp">${sanpham.name}</td>
                    <td class="td-color">${sanpham.color}</td>
                    <td class="td-imel">${sanpham.imel}</td>
                    <td class="td-capacity">${sanpham.capacity}</td>
                    <td></td>
                `;
                sanphamTableBody.appendChild(newRow);
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            alert('Đã xảy ra lỗi khi lấy danh sách sản phẩm.');
        });
}


function openaddloaimodal() {
    var modal = new bootstrap.Modal(document.getElementById('addloaispmodal'));
    modal.show();
}

function openputloaimodal() {
    var modal = new bootstrap.Modal(document.getElementById('putloaispmodal'));
    modal.show();
}

function closeaddloaimodal() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('addloaispmodal'));
    if (modal) {
        modal.hide();
    }
}

function closeputloaimodal() {
    var modal = bootstrap.Modal.getInstance(document.getElementById('putloaispmodal'));
    if (modal) {
        modal.hide();
    }
}

function clearInputFieldsloai() {
    document.getElementById('nameloai').value = '';
}



function addloaisp() {
    var nameloai = document.getElementById('nameloai').value;


    fetch('/postloaisanpham', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameloai,
            })
        })
        .then(response => response.json())
        .then(data => {
            clearInputFieldsloai();
            closeaddloaimodal();

        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}

function fillInputFieldsloai(customerData) {
    document.getElementById('nameloai1').value = customerData.name;
}

function editloai(customerId) {
    const loai = loaiDataMap[customerId];
    if (!loai) {
        console.error('Không tìm thấy loại sản phẩm với ID:', customerId);
        alert('Đã xảy ra lỗi khi tìm loại sản phẩm.');
        return;
    }

    const customerData = {
        name: loai.name,
    };

    // Điền dữ liệu vào các input
    fillInputFieldsloai(customerData);

    // Mở modal để chỉnh sửa
    openputloaimodal();

    // Gọi putkhachhang khi người dùng nhấn nút lưu (có thể thay đổi theo nhu cầu của bạn)
    document.getElementById('saveloaispButton').onclick = function() {
        putloai(customerId);
    };
}

function putloai(id) {
    var nameloai1 = document.getElementById('nameloai1').value;

    fetch(`/putloaisanpham/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameloai1
            })
        })
        .then(response => response.json())
        .then(data => {
            closeputloaimodal();

        })
        .catch(error => {
            // Lấy container để hiển thị lỗi
            var errorContainer = document.getElementById('error-container');
            // Chèn thông báo lỗi vào container
            errorContainer.innerHTML = ` < p class = "alert alert-danger" > $ { error.message } < /p>`;
        });

}