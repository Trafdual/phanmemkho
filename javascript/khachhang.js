let inter;

function getkhachhang() {
    const khachhangTableBody = document.getElementById('khachhangTableBody');

    fetch(`/getkhachhang`)
        .then(response => response.json())
        .then(data => {
            khachhangTableBody.innerHTML = ''; // Clear the existing content
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