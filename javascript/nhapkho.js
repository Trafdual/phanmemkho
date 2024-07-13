let intervalID;
let intersp;
let loaiDataMap = {};

function quaylai() {
    intervalID = setInterval(getloaisanpham, 500);
    setTimeout(() => {
        clearInterval(intervalID);
        console.error('Interval cleared');
    }, 1000)
}

function getloaisanpham() {
    const commentsTableBody = document.getElementById('loaiTableBody');
    document.getElementById('loaisanpham').style.display = 'block'
    document.getElementById('addloaisp').style.display = 'block'
    document.getElementById('form-input').style.display = 'block';
    document.getElementById('sanpham').style.display = 'none';
    document.getElementById('quaylai').style.display = 'none'
    document.getElementById('form-input1').style.display = 'none';
    document.getElementById('addsp').style.display = 'none';


    fetch(`/getloaisanphamweb`)
        .then(response => response.json())
        .then(data => {
            commentsTableBody.innerHTML = ''; // Clear the existing content
            data.forEach(loaisanpham => {
                loaiDataMap[loaisanpham._id] = loaisanpham;
                const newCommentDiv = document.createElement('tr');
                newCommentDiv.innerHTML = `
                                    <td class="td-name" style="margin-right:5px; padding:10px">
                        ${loaisanpham._id}
                    </td>
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
    const modalElement = document.getElementById('sanpham');
    const sanpham = document.getElementById('sanphamTableBody');
    modalElement.id = `sanpham${id}`;
    sanpham.id = `sanphamTableBody${id}`
    document.getElementById('loaisanpham').style.display = 'none'
    document.getElementById('addloaisp').style.display = 'none'
    document.getElementById('form-input').style.display = 'none';
    document.getElementById('quaylai').style.display = 'block'
    document.getElementById('form-input1').style.display = 'block';
    document.getElementById('addsp').style.display = 'block';
    getAndDisplay(id);
    intersp = setInterval(() => getAndDisplay(id), 5000)
    modalElement.style.display = 'none'
    var loadingSpinner = document.getElementById('loadingspinnercontainer');
    loadingSpinner.style.display = 'block';
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        modalElement.style.display = 'block'
    }, 5000);

    document.getElementById('quaylai').onclick = function() {
        clearInterval(intersp);
        modalOpen = false;
        modalElement.id = 'sanpham'
        sanpham.id = 'sanphamTableBody'
        document.getElementById('loaisanpham').style.display = 'block'
        document.getElementById('addloaisp').style.display = 'block'
        document.getElementById('form-input').style.display = 'block';
        document.getElementById('sanpham').style.display = 'none';
        document.getElementById('quaylai').style.display = 'none'
        document.getElementById('form-input1').style.display = 'none';
        document.getElementById('addsp').style.display = 'none';


    };
    document.getElementById('addsp').onclick = function() {
        addsanpham(id)
    };

}

function getAndDisplay(id) {
    const modalElement = document.getElementById(`sanpham${id}`);
    const sanphamTableBody = modalElement.querySelector(`#sanphamTableBody${id}`);
    fetch(`/getsanpham/${id}`)
        .then(response => response.json())
        .then(data => {
            sanphamTableBody.innerHTML = ''; // Clear the existing content
            data.forEach(sanpham => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td class="td-id" style="text-align:center;">${sanpham._id}</td>
                    <td class="td-namesp" style="text-align:center">${sanpham.name}</td>
                    <td class="td-color" style="text-align:center">${sanpham.color}</td>
                    <td class="td-imel" style="text-align:center">${sanpham.imel}</td>
                    <td class="td-capacity" style="text-align:center">${sanpham.capacity}</td>
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

function addsanpham(id) {
    document.getElementById('reader').style.display = 'block';
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {

        console.log(`Code matched = ${decodedText}`, decodedResult);
        fetch(`/postsp/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imel: decodedText
                })
            })
            .then(response => response.json())
            .then(data => {
                intersp = setInterval(() => getAndDisplay(id), 5000)
                setTimeout(() => {
                    clearInterval(intersp);
                    console.error('Interval cleared');
                }, 1000)
                document.getElementById('reader').style.display = 'none';

            })
            .catch(error => {
                console.error(error.message)

            });


    };

    const qrCodeFailureCallback = (error) => {
        // Xử lý khi quét thất bại
        console.warn(`Code scan error = ${error}`);
    };

    const html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: {
            width: 300,
            height: 100
        }
    };

    html5QrCode.start({
            facingMode: "environment"
        }, config, (text, result) => qrCodeSuccessCallback(text, result))
        .catch(err => {
            // Start failed, handle it.
            console.error("Failed to start scanning: ", err);
        });

    html5QrCode.onScanFailure = qrCodeFailureCallback;

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