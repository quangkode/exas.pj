/* ========== USER MANAGEMENT - Admin only ========== */
function renderUserMgmt(container) {
    const users = JSON.parse(localStorage.getItem('mrv_users_list') || JSON.stringify([
        { id: 1, username: 'giamsat', name: 'Nguyễn Văn An', role: 'supervisor', status: 'active' },
        { id: 2, username: 'giamsat2', name: 'Trần Thị Bình', role: 'supervisor', status: 'active' },
        { id: 3, username: 'admin', name: 'Lê Quang Minh', role: 'admin', status: 'active' }
    ]));

    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Quản lý người dùng</h1>
            <p class="page-desc">Phân quyền truy cập hệ thống (Role-based Access Control)</p>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" placeholder="Tìm người dùng..."></div>
            <select><option value="">Tất cả vai trò</option><option>Giám sát viên</option><option>Quản trị viên</option></select>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openAddUserModal()"><i class="fas fa-user-plus"></i> Thêm người dùng</button>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Tài khoản</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody>
                        ${users.map(u => `<tr>
                            <td><code style="background:var(--surface);padding:2px 8px;border-radius:4px;">${u.username}</code></td>
                            <td>${u.name}</td>
                            <td><span class="badge ${u.role==='admin'?'badge-red':'badge-blue'}">${u.role==='admin'?'Quản trị viên':'Giám sát viên'}</span></td>
                            <td><span class="badge badge-green"><i class="fas fa-circle" style="font-size:6px;"></i> Hoạt động</span></td>
                            <td><button class="btn-icon" title="Chỉnh sửa"><i class="fas fa-edit"></i></button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-key"></i> Phân quyền theo vai trò</div></div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Chức năng</th><th>Giám sát viên</th><th>Quản trị viên</th></tr></thead>
                    <tbody>
                        <tr><td>Xem Dashboard</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Nhật ký canh tác (Thêm/Sửa)</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Dữ liệu IoT (Xem)</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Dữ liệu Drone/LiDAR</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Phân tích đất SOC</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Bằng chứng số</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Bản đồ nông hộ</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Báo cáo VM0042</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Tính toán phát thải</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Audit Log</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Cổng VVB</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Quản lý người dùng</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Quản lý nông hộ</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Cài đặt hệ thống</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openAddUserModal() { alert('Chức năng thêm người dùng mới (tạo tài khoản giám sát viên/quản trị viên).'); }

/* ========== FARM MANAGEMENT - Admin only ========== */
function renderFarmMgmt(container) {
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Quản lý nông hộ</h1>
            <p class="page-desc">Thông tin nông hộ, chủ vườn và vùng trồng</p>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" placeholder="Tìm nông hộ..."></div>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openFarmModal()"><i class="fas fa-plus"></i> Thêm nông hộ</button>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Mã</th><th>Tên chủ hộ</th><th>Địa chỉ</th><th>Diện tích (ha)</th><th>Loại cây</th><th>Số cây</th><th>Vĩ độ</th><th>Kinh độ</th><th></th></tr></thead>
                    <tbody id="farm-mgmt-table">
                        ${farms.length === 0 ? '<tr><td colspan="9"><div class="empty-state"><i class="fas fa-seedling"></i><p>Chưa có nông hộ nào</p></div></td></tr>' :
                        farms.map(f => `<tr>
                            <td>${f.code}</td><td>${f.name}</td><td>${f.address}</td><td>${f.area}</td>
                            <td>${f.crop}</td><td>${f.treeCount||'--'}</td><td>${f.lat||'--'}</td><td>${f.lng||'--'}</td>
                            <td><button class="btn-icon" onclick="deleteFarm(${f.id})" title="Xóa"><i class="fas fa-trash"></i></button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal-overlay" id="farm-modal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-seedling" style="color:var(--primary-light);margin-right:8px;"></i> Thêm nông hộ</h3>
                    <button class="modal-close" onclick="closeFarmModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="farm-form">
                        <div class="form-row">
                            <div class="form-group"><label>Mã nông hộ</label><input type="text" id="farm-code" placeholder="VD: NH001" required></div>
                            <div class="form-group"><label>Tên chủ hộ</label><input type="text" id="farm-name" placeholder="Họ tên chủ vườn" required></div>
                        </div>
                        <div class="form-group"><label>Địa chỉ</label><input type="text" id="farm-address" placeholder="Xã, huyện, tỉnh"></div>
                        <div class="form-row">
                            <div class="form-group"><label>Diện tích (ha)</label><input type="number" id="farm-area" step="0.01" placeholder="0"></div>
                            <div class="form-group"><label>Loại cây</label><input type="text" id="farm-crop" value="Dừa" placeholder="VD: Dừa"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Số cây</label><input type="number" id="farm-tree-count" placeholder="0"></div>
                            <div class="form-group"><label>Vĩ độ (Lat)</label><input type="number" id="farm-lat" step="0.0001" placeholder="VD: 10.25"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Kinh độ (Lng)</label><input type="number" id="farm-lng" step="0.0001" placeholder="VD: 106.37"></div>
                            <div class="form-group"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeFarmModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveFarm()"><i class="fas fa-save"></i> Lưu</button>
                </div>
            </div>
        </div>
    `;
}

function openFarmModal() { document.getElementById('farm-modal').classList.add('show'); }
function closeFarmModal() { document.getElementById('farm-modal').classList.remove('show'); }
function saveFarm() {
    let farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const farm = {
        id: Date.now(),
        code: document.getElementById('farm-code').value,
        name: document.getElementById('farm-name').value,
        address: document.getElementById('farm-address').value,
        area: document.getElementById('farm-area').value,
        crop: document.getElementById('farm-crop').value,
        treeCount: document.getElementById('farm-tree-count').value,
        lat: parseFloat(document.getElementById('farm-lat').value) || null,
        lng: parseFloat(document.getElementById('farm-lng').value) || null
    };
    farms.push(farm);
    localStorage.setItem('mrv_farms', JSON.stringify(farms));
    closeFarmModal();
    renderFarmMgmt(document.getElementById('page-content'));
    addAuditEntry('Thêm nông hộ', `${farm.code} - ${farm.name}`, 'green');
}
function deleteFarm(id) {
    if (!confirm('Xác nhận xóa nông hộ này?')) return;
    let farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    farms = farms.filter(f => f.id !== id);
    localStorage.setItem('mrv_farms', JSON.stringify(farms));
    renderFarmMgmt(document.getElementById('page-content'));
    addAuditEntry('Xóa nông hộ', `ID: ${id}`, 'red');
}

/* ========== SETTINGS - Admin only ========== */
function renderSettings(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Cài đặt hệ thống</h1>
            <p class="page-desc">Cấu hình chung cho hệ thống MRV</p>
        </div>
        <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-info-circle"></i> Thông tin dự án</div></div>
            <div class="form-row">
                <div class="form-group"><label>Tên dự án</label><input type="text" value="ExAS - Coconut Carbon Credit" readonly></div>
                <div class="form-group"><label>Phương pháp luận</label><input type="text" value="VM0042 - Verra" readonly></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Vùng dự án</label><input type="text" placeholder="VD: Bến Tre, Trà Vinh, Vĩnh Long"></div>
                <div class="form-group"><label>Ngày bắt đầu</label><input type="date"></div>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-satellite-dish"></i> Cấu hình IoT / LoRaWAN</div></div>
            <div class="form-row">
                <div class="form-group"><label>LoRaWAN Gateway</label><input type="text" placeholder="Địa chỉ gateway"></div>
                <div class="form-group"><label>Tần suất gửi dữ liệu</label>
                    <select><option>Mỗi 15 phút</option><option>Mỗi 30 phút</option><option>Mỗi 1 giờ</option><option>Mỗi 6 giờ</option></select>
                </div>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-key"></i> API</div></div>
            <div class="form-group"><label>API Endpoint</label><input type="text" placeholder="https://api.exas-mrv.vn/v1" readonly></div>
            <div class="form-group"><label>API Key</label>
                <div class="password-wrapper">
                    <input type="password" value="sk-mrv-xxxxxxxxxxxx" readonly>
                    <button type="button" class="toggle-password" onclick="this.previousElementSibling.type=this.previousElementSibling.type==='password'?'text':'password'"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-top:8px;"><i class="fas fa-info-circle" style="margin-right:4px;"></i> API cho phép tích hợp và đồng bộ dữ liệu canh tác - sinh khối giữa các nền tảng.</p>
        </div>
        <div style="margin-top:20px;display:flex;gap:12px;">
            <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu cài đặt</button>
            <button class="btn btn-danger"><i class="fas fa-undo"></i> Khôi phục mặc định</button>
        </div>
    `;
}
