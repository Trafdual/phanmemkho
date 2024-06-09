
function getkhachhang() {
    const commentsTableBody = document.getElementById('loaiTableBody');
    return new Promise((resolve, reject) => {
        fetch(`/getkhachhang`)
            .then(response => response.json())
            .then(data => {
                commentsTableBody.innerHTML = ''; // Clear the existing content
                data.forEach(khachhang => {
                    const newCommentDiv = document.createElement('tr');
                    newCommentDiv.innerHTML = `
        <td class="td-id" >
            ${khachhang._id}
            </td>
            <td class="td-name">
                ${khachhang.name}
            </td>
                                <td class="td-name">
                ${khachhang.email}
            </td>
                                <td class="td-name">
                ${khachhang.phone}
            </td>
                                <td class="td-name">
                ${khachhang.date}
            </td>
    `;
                    commentsTableBody.appendChild(newCommentDiv);
                });
                resolve();
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách khách hàng:', error);
                alert('Đã xảy ra lỗi khi lấy danh sách khách hàng.');
            });
    });
}
setInterval(getkhachhang,1000);
function openkhach(){
    document.getElementById('khachhang').style.display = 'block';
}