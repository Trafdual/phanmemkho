let intervalID;
let intersp;
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
                    <td class="td-name" style="margin-right:5px; padding:10px">
                        ${loaisanpham.name}
                    </td>
                    <td class="td-soluong" style="margin-right:5px; padding:10px">
                        ${loaisanpham.soluong}
                    </td>
                    <td class="td-date" style="margin-right:5px; padding:10px">
                        ${loaisanpham.date}
                    </td>
                    <td class="td-tongtien" style="margin-right:5px; padding:10px">
                        ${loaisanpham.tongtien} VNĐ
                    </td>
                    <td class="td-average" style="margin-right:5px; padding:10px">
                        ${loaisanpham.average} VNĐ
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
getloaisanpham();

function openchitietloaimodal(id) {
    const modalElement = document.getElementById('chitietloaispmodal');
    modalElement.id = `chitietloaispmodal${id}`;
    var modal = new bootstrap.Modal(modalElement);
    modal.show();
    intersp = setInterval(() => getAndDisplay(id), 1000)
    document.getElementById('closeModalchitiet').onclick = function() {
        clearInterval(intersp);
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



function clearInputFieldsloai() {
    document.getElementById('nameloai').value = '';
    document.getElementById('soluong').value = '';
    document.getElementById('tienlo').value = '';
    document.getElementById('dateloai').value = '';
}



function addloaisp() {
    var nameloai = document.getElementById('nameloai').value;
    var soluong = document.getElementById('soluong').value;
    var tienlo = document.getElementById('tienlo').value;
    var date = document.getElementById('dateloai').value;

    fetch('/postloaisanpham', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameloai,
                soluong: soluong,
                tongtien: tienlo,
                date: date
            })
        })
        .then(response => response.json())
        .then(data => {
            clearInputFieldsloai();
            intervalID = setInterval(getloaisanpham, 500);
            setTimeout(() => {
                clearInterval(intervalID);
                console.error('Interval cleared');
            }, 1000)
        })
        .catch(error => {
            console.error(error.message)

        });

}

function formatDateForInputloai(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

function fillInputFieldsloai(customerData) {
    document.getElementById('nameloai1').value = customerData.name;
    document.getElementById('soluong1').value = customerData.soluong;
    document.getElementById('tienlo1').value = customerData.tongtien;
    document.getElementById('dateloai1').value = formatDateForInputloai(customerData.date);
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
        date: loai.date,
        soluong: loai.soluong,
        tongtien: loai.tongtien
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
    var soluong1 = document.getElementById('soluong1').value;
    var tienlo1 = document.getElementById('tienlo1').value;
    var date1 = document.getElementById('dateloai1').value;

    fetch(`/putloaisanpham/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameloai1,
                soluong: soluong1,
                tongtien: tienlo1,
                date: date1
            })
        })
        .then(response => response.json())
        .then(data => {
            intervalID = setInterval(getloaisanpham, 500);
            setTimeout(() => {
                clearInterval(intervalID);
                console.error('Interval cleared');
            }, 1000)

        })
        .catch(error => {
            console.error(error.message)
        });

}