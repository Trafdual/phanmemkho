let intervalID;
let id;
function getloaisanpham() {
    const commentsTableBody = document.getElementById('loaiTableBody');
    document.getElementById('loaisanpham').style.display = 'block';
    document.getElementById('sanpham').style.display = 'none';
    return new Promise((resolve, reject) => {
        fetch(`/getloaisanphamweb`)
            .then(response => response.json())
            .then(data => {
                commentsTableBody.innerHTML = ''; // Clear the existing content
                let firstId;
                data.forEach(loaisanpham => {

                    firstId = loaisanpham._id
                    const newCommentDiv = document.createElement('tr');
                    newCommentDiv.innerHTML = `
                <td class="td-id" >
                    ${loaisanpham._id}
                    </td>
                    <td class="td-name">
                        ${loaisanpham.name}
                    </td>
                    <td>
                        <button
                            style="width: 100px; height: 30px; margin-top: 5px; background-color: #1E90FF; border: none; border-radius: 5px; color: white;"
                            type="button" onclick="test('${loaisanpham._id}')">Chi Tiết</button>
                    </td>
            `;
                    commentsTableBody.appendChild(newCommentDiv);
                });
                console.error(firstId);
                resolve(firstId);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách loại sản phẩm:', error);
                alert('Đã xảy ra lỗi khi lấy danh sách loại sản phẩm.');
            });
    });
}
intervalID = setInterval(getloaisanpham, 1000)
function test(id) {
    setInterval(() => getAndDisplay(id), 1000);
}
function getAndDisplay(id) {
    const commentsTableBody = document.getElementById('commentsTableBody');
    document.getElementById('loaisanpham').style.display = 'none';
    document.getElementById('sanpham').style.display = 'block';
    fetch(`/getsanpham/${id}`)
        .then(response => response.json())
        .then(data => {
            commentsTableBody.innerHTML = ''; // Clear the existing content

            data.forEach(sanpham => {
                const newCommentDiv = document.createElement('tr');
                newCommentDiv.innerHTML = `
                <td class="td-id">${sanpham._id}</td>
                <td class="td-name">${sanpham.name}</td>
                <td class="td-name">${sanpham.color}</td>
                <td class="td-name">${sanpham.imel}</td>
                <td class="td-name">${sanpham.capacity}</td>
                <td></td>
            `;
                commentsTableBody.appendChild(newCommentDiv);
            });
            clearInterval(intervalID);
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            alert('Đã xảy ra lỗi khi lấy danh sách sản phẩm.');
        });
}
function close(){
    document.getElementById('loaisanpham').style.display = 'block';
    document.getElementById('sanpham').style.display = 'none';
}