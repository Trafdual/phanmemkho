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
                            type="button" onclick="">Cập Nhật</button>
                            <button
                            style="width: 120px; height: 50px; margin-top: 5px; background-color: #FA0303; border: none; border-radius: 5px; color: white;font-size:13px"
                            type="button" onclick="">Ngừng hoạt động</button>
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