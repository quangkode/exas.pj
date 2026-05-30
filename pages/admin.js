/* ========== USER MANAGEMENT - Admin only ========== */
const DEFAULT_USERS_LIST = [
    { id: 1, username: 'giamsat',  name: 'Nguyễn Văn An',   role: 'supervisor', status: 'active', builtin: true },
    { id: 2, username: 'giamsat2', name: 'Trần Thị Bình',   role: 'supervisor', status: 'active', builtin: true },
    { id: 3, username: 'admin',    name: 'Trần Minh Quang',  role: 'admin',      status: 'active', builtin: true }
];

function getUserList() {
    return JSON.parse(localStorage.getItem('mrv_users_list') || JSON.stringify(DEFAULT_USERS_LIST));
}

function renderUserMgmt(container) {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-header-text">
                <h1 class="page-title">Quản lý người dùng</h1>
                <p class="page-desc">Phân quyền truy cập hệ thống (Role-based Access Control)</p>
            </div>
            <div class="page-actions">
                <button class="btn btn-primary" onclick="openAddUserModal()"><i class="fas fa-user-plus"></i> Thêm người dùng</button>
            </div>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" id="user-search" placeholder="Tìm người dùng..." oninput="filterUserTable()"></div>
            <select id="user-role-filter" onchange="filterUserTable()">
                <option value="">Tất cả vai trò</option>
                <option value="supervisor">Giám sát viên</option>
                <option value="admin">Quản trị viên</option>
            </select>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table" style="width:max-content;min-width:560px;">
                    <thead><tr><th>Tài khoản</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody id="user-table-body"></tbody>
                </table>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-key"></i> Phân quyền theo vai trò</div></div>
            <div class="table-wrapper">
                <table class="data-table" style="width:max-content;min-width:400px;">
                    <thead><tr><th>Chức năng</th><th>Giám sát viên</th><th>Quản trị viên</th></tr></thead>
                    <tbody>
                        <tr><td>Xem Dashboard</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Nhật ký canh tác (Thêm/Sửa)</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Dữ liệu IoT / Drone / SOC</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Bằng chứng số / Bản đồ</td><td><i class="fas fa-check" style="color:var(--success);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Báo cáo VM0042 / Tính toán</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Audit Log / Cổng VVB</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Quản lý người dùng / Nông hộ</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                        <tr><td>Cài đặt hệ thống</td><td><i class="fas fa-times" style="color:var(--danger);"></i></td><td><i class="fas fa-check" style="color:var(--success);"></i></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal thêm/sửa người dùng -->
        <div class="modal-overlay" id="user-modal">
            <div class="modal" style="max-width:500px;">
                <div class="modal-header">
                    <h3 id="user-modal-title"><i class="fas fa-user-plus" style="color:var(--primary-light);margin-right:8px;"></i> Thêm người dùng</h3>
                    <button class="modal-close" onclick="closeUserModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="user-edit-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tên đăng nhập <span style="color:var(--danger)">*</span></label>
                            <input type="text" id="user-username" placeholder="VD: giamsat3" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label>Họ và tên <span style="color:var(--danger)">*</span></label>
                            <input type="text" id="user-fullname" placeholder="Họ tên đầy đủ">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Vai trò <span style="color:var(--danger)">*</span></label>
                        <select id="user-role">
                            <option value="supervisor">Giám sát viên</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label id="user-pwd-label">Mật khẩu <span style="color:var(--danger)">*</span></label>
                            <input type="password" id="user-password" placeholder="Tối thiểu 6 ký tự" autocomplete="new-password">
                        </div>
                        <div class="form-group">
                            <label>Xác nhận mật khẩu</label>
                            <input type="password" id="user-password2" placeholder="Nhập lại mật khẩu">
                        </div>
                    </div>
                    <div id="user-pwd-note" style="font-size:11px;color:var(--text-muted);margin-top:-8px;display:none;">
                        Để trống nếu không muốn thay đổi mật khẩu
                    </div>
                    <div id="user-modal-error" style="color:var(--danger);font-size:12px;margin-top:8px;display:none;"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeUserModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveUser()"><i class="fas fa-save"></i> Lưu</button>
                </div>
            </div>
        </div>
    `;
    loadUserTable();
}

function loadUserTable() {
    const users = getUserList();
    const search = document.getElementById('user-search')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('user-role-filter')?.value || '';
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;

    const filtered = users.filter(u => {
        const matchSearch = !search || u.username.toLowerCase().includes(search) || u.name.toLowerCase().includes(search);
        const matchRole = !roleFilter || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    tbody.innerHTML = filtered.length === 0
        ? `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-user-slash"></i><p>Không tìm thấy người dùng</p></div></td></tr>`
        : filtered.map(u => `<tr>
            <td><code style="background:var(--surface);padding:2px 8px;border-radius:4px;">${u.username}</code></td>
            <td><strong>${u.name}</strong></td>
            <td><span class="badge ${u.role === 'admin' ? 'badge-red' : 'badge-blue'}">${u.role === 'admin' ? 'Quản trị viên' : 'Giám sát viên'}</span></td>
            <td><span class="badge badge-green"><i class="fas fa-circle" style="font-size:6px;"></i> Hoạt động</span></td>
            <td style="display:flex;gap:6px;">
                <button class="btn-icon" onclick="openEditUserModal(${u.id})" title="Sửa"><i class="fas fa-edit"></i></button>
                ${u.builtin ? '' : `<button class="btn-icon" onclick="deleteUser(${u.id})" title="Xóa" style="color:var(--danger);"><i class="fas fa-trash"></i></button>`}
            </td>
        </tr>`).join('');
}

function filterUserTable() { loadUserTable(); }

function openAddUserModal() {
    document.getElementById('user-modal-title').innerHTML = '<i class="fas fa-user-plus" style="color:var(--primary-light);margin-right:8px;"></i> Thêm người dùng';
    document.getElementById('user-edit-id').value = '';
    document.getElementById('user-username').value = '';
    document.getElementById('user-username').removeAttribute('readonly');
    document.getElementById('user-fullname').value = '';
    document.getElementById('user-role').value = 'supervisor';
    document.getElementById('user-password').value = '';
    document.getElementById('user-password2').value = '';
    document.getElementById('user-pwd-label').innerHTML = 'Mật khẩu <span style="color:var(--danger)">*</span>';
    document.getElementById('user-pwd-note').style.display = 'none';
    document.getElementById('user-modal-error').style.display = 'none';
    document.getElementById('user-modal').classList.add('show');
}

function openEditUserModal(id) {
    const users = getUserList();
    const u = users.find(x => x.id === id);
    if (!u) return;
    document.getElementById('user-modal-title').innerHTML = '<i class="fas fa-user-edit" style="color:var(--primary-light);margin-right:8px;"></i> Sửa người dùng';
    document.getElementById('user-edit-id').value = id;
    document.getElementById('user-username').value = u.username;
    document.getElementById('user-username').setAttribute('readonly', true);
    document.getElementById('user-fullname').value = u.name;
    document.getElementById('user-role').value = u.role;
    document.getElementById('user-password').value = '';
    document.getElementById('user-password2').value = '';
    document.getElementById('user-pwd-label').textContent = 'Mật khẩu mới';
    document.getElementById('user-pwd-note').style.display = 'block';
    document.getElementById('user-modal-error').style.display = 'none';
    document.getElementById('user-modal').classList.add('show');
}

function closeUserModal() { document.getElementById('user-modal').classList.remove('show'); }

function showUserError(msg) {
    const el = document.getElementById('user-modal-error');
    el.textContent = msg;
    el.style.display = 'block';
}

function saveUser() {
    const editId = document.getElementById('user-edit-id').value;
    const username = document.getElementById('user-username').value.trim().toLowerCase();
    const name = document.getElementById('user-fullname').value.trim();
    const role = document.getElementById('user-role').value;
    const pwd = document.getElementById('user-password').value;
    const pwd2 = document.getElementById('user-password2').value;

    document.getElementById('user-modal-error').style.display = 'none';

    if (!username || !name) return showUserError('Vui lòng điền tên đăng nhập và họ tên.');
    if (!/^[a-z0-9_]+$/.test(username)) return showUserError('Tên đăng nhập chỉ dùng chữ thường, số và dấu _');

    const users = getUserList();

    if (!editId) {
        // Thêm mới — bắt buộc có mật khẩu
        if (!pwd) return showUserError('Vui lòng nhập mật khẩu.');
        if (pwd.length < 6) return showUserError('Mật khẩu tối thiểu 6 ký tự.');
        if (pwd !== pwd2) return showUserError('Mật khẩu xác nhận không khớp.');
        const exists = users.some(u => u.username === username) || !!USERS[username];
        if (exists) return showUserError(`Tên đăng nhập "${username}" đã tồn tại.`);

        const newUser = { id: Date.now(), username, name, role, status: 'active', builtin: false };
        users.push(newUser);
        localStorage.setItem('mrv_users_list', JSON.stringify(users));
        // Cập nhật USERS in-memory để login ngay được
        USERS[username] = { password: pwd, name, role, displayRole: role === 'admin' ? 'Quản trị viên' : 'Giám sát viên' };
        // Lưu auth riêng cho reload
        const auth = JSON.parse(localStorage.getItem('mrv_users_auth') || '{}');
        auth[username] = { password: pwd, role, name };
        localStorage.setItem('mrv_users_auth', JSON.stringify(auth));
        addAuditEntry('Thêm người dùng', `${username} — ${name} (${role === 'admin' ? 'Quản trị viên' : 'Giám sát viên'})`, 'green');
    } else {
        // Sửa
        if (pwd && pwd.length < 6) return showUserError('Mật khẩu tối thiểu 6 ký tự.');
        if (pwd && pwd !== pwd2) return showUserError('Mật khẩu xác nhận không khớp.');

        const idx = users.findIndex(u => u.id === parseInt(editId));
        if (idx < 0) return;
        users[idx] = { ...users[idx], name, role };
        localStorage.setItem('mrv_users_list', JSON.stringify(users));
        // Cập nhật in-memory
        if (USERS[username]) {
            USERS[username].name = name;
            USERS[username].role = role;
            USERS[username].displayRole = role === 'admin' ? 'Quản trị viên' : 'Giám sát viên';
            if (pwd) USERS[username].password = pwd;
        }
        // Cập nhật auth
        const auth = JSON.parse(localStorage.getItem('mrv_users_auth') || '{}');
        if (auth[username] || !users[idx].builtin) {
            auth[username] = { ...auth[username], name, role };
            if (pwd) auth[username].password = pwd;
            localStorage.setItem('mrv_users_auth', JSON.stringify(auth));
        }
        addAuditEntry('Sửa người dùng', `${username} — ${name}`, 'blue');
    }

    closeUserModal();
    loadUserTable();
}

function deleteUser(id) {
    const users = getUserList();
    const u = users.find(x => x.id === id);
    if (!u) return;
    if (u.builtin) return alert('Không thể xóa tài khoản hệ thống mặc định.');
    if (!confirm(`Xác nhận xóa tài khoản "${u.username}" — ${u.name}?`)) return;

    const updated = users.filter(x => x.id !== id);
    localStorage.setItem('mrv_users_list', JSON.stringify(updated));
    delete USERS[u.username];
    const auth = JSON.parse(localStorage.getItem('mrv_users_auth') || '{}');
    delete auth[u.username];
    localStorage.setItem('mrv_users_auth', JSON.stringify(auth));
    addAuditEntry('Xóa người dùng', `${u.username} — ${u.name}`, 'red');
    loadUserTable();
}

/* ========== FARM MANAGEMENT - Admin only ========== */

// Dữ liệu nông hộ mặc định — nạp 1 lần nếu chưa có
function initDefaultFarms() {
    const existing = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    if (existing.length > 0) return;
    const defaults = [
        {
            id: 1700000001000,
            code: 'NH001',
            name: 'Trần Minh Quang',
            address: 'Ấp Phú Hưng, Xã Tiên Long, Huyện Châu Thành, Tỉnh Bến Tre',
            phone: '0777858039',
            area: '4.6',
            crop: 'Dừa Lùn (PB121)',
            treeCount: '1003',
            treeAge: '12',
            harvestsPerYear: '10',
            harvestMethod: 'Thủ công (dùng sào có lưỡi liềm)',
            bunchesPerTree: '12',
            fruitsPerBunch: '11',
            yieldPerTree: '132',
            lat: 10.2518,
            lng: 106.4021
        }
    ];
    localStorage.setItem('mrv_farms', JSON.stringify(defaults));
}

function renderFarmMgmt(container) {
    initDefaultFarms();
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Quản lý nông hộ</h1>
            <p class="page-desc">Thông tin nông hộ, chủ vườn và vùng trồng dừa</p>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" placeholder="Tìm nông hộ..."></div>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openFarmModal()"><i class="fas fa-plus"></i> Thêm nông hộ</button>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table" style="width:max-content;min-width:1000px;">
                    <thead><tr>
                        <th>Mã</th><th>Họ tên chủ hộ</th><th>Địa chỉ</th><th>SĐT</th>
                        <th>Diện tích (ha)</th><th>Loại cây</th><th>Số cây</th>
                        <th>Tuổi cây (năm)</th><th>Thu hoạch/năm</th><th>Cách thu hoạch</th>
                        <th>Buồng/cây/năm</th><th>Quả/buồng</th><th>Năng suất (quả/cây/năm)</th>
                        <th></th>
                    </tr></thead>
                    <tbody id="farm-mgmt-table">
                        ${farms.length === 0 ? '<tr><td colspan="14"><div class="empty-state"><i class="fas fa-seedling"></i><p>Chưa có nông hộ nào</p></div></td></tr>' :
                        farms.map(f => `<tr>
                            <td>${f.code}</td>
                            <td><strong>${f.name}</strong></td>
                            <td style="max-width:180px;white-space:normal;">${f.address||'--'}</td>
                            <td>${f.phone||'--'}</td>
                            <td>${f.area||'--'}</td>
                            <td>${f.crop||'--'}</td>
                            <td>${f.treeCount||'--'}</td>
                            <td>${f.treeAge||'--'}</td>
                            <td>${f.harvestsPerYear||'--'}</td>
                            <td>${f.harvestMethod||'--'}</td>
                            <td>${f.bunchesPerTree||'--'}</td>
                            <td>${f.fruitsPerBunch||'--'}</td>
                            <td><strong style="color:var(--primary-light);">${f.yieldPerTree||'--'}</strong></td>
                            <td>
                                <button class="btn-icon" onclick="openEditFarmModal(${f.id})" title="Sửa"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon" onclick="deleteFarm(${f.id})" title="Xóa" style="color:var(--danger);"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal thêm/sửa nông hộ -->
        <div class="modal-overlay" id="farm-modal">
            <div class="modal" style="max-width:680px;">
                <div class="modal-header">
                    <h3 id="farm-modal-title"><i class="fas fa-seedling" style="color:var(--primary-light);margin-right:8px;"></i> Thêm nông hộ</h3>
                    <button class="modal-close" onclick="closeFarmModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="farm-edit-id">
                    <div style="font-size:12px;font-weight:600;color:var(--primary-light);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px;">Thông tin cơ bản</div>
                    <div class="form-row">
                        <div class="form-group"><label>Mã nông hộ <span style="color:var(--danger)">*</span></label><input type="text" id="farm-code" placeholder="VD: NH002" required></div>
                        <div class="form-group"><label>Họ và tên chủ hộ <span style="color:var(--danger)">*</span></label><input type="text" id="farm-name" placeholder="Họ và tên đầy đủ" required></div>
                    </div>
                    <div class="form-group"><label>Địa chỉ nông hộ</label><input type="text" id="farm-address" placeholder="Ấp, xã, huyện, tỉnh"></div>
                    <div class="form-row">
                        <div class="form-group"><label>SĐT liên hệ</label><input type="tel" id="farm-phone" placeholder="VD: 0912 345 678"></div>
                        <div class="form-group"><label>Loại cây</label><input type="text" id="farm-crop" value="Dừa" placeholder="VD: Dừa Lùn"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>Diện tích vườn (ha) <span style="color:var(--danger)">*</span></label><input type="number" id="farm-area" step="0.01" placeholder="0.0" required></div>
                        <div class="form-group"><label>Số cây</label><input type="number" id="farm-tree-count" placeholder="0"></div>
                    </div>

                    <div style="font-size:12px;font-weight:600;color:var(--primary-light);margin:16px 0 10px;text-transform:uppercase;letter-spacing:.5px;">Thông tin canh tác</div>
                    <div class="form-row">
                        <div class="form-group"><label>Trung bình tuổi cây dừa (năm)</label><input type="number" id="farm-tree-age" placeholder="VD: 14" min="1"></div>
                        <div class="form-group"><label>Số lần thu hoạch/năm</label><input type="number" id="farm-harvests-per-year" placeholder="VD: 8" min="1"></div>
                    </div>
                    <div class="form-group"><label>Cách thức thu hoạch</label><input type="text" id="farm-harvest-method" placeholder="VD: Thủ công (sào có lưỡi dao)"></div>
                    <div class="form-row">
                        <div class="form-group"><label>Số buồng (buồng/cây/năm)</label><input type="number" id="farm-bunches" placeholder="VD: 12" min="0" oninput="calcFarmYield()"></div>
                        <div class="form-group"><label>Số quả (quả/buồng)</label><input type="number" id="farm-fruits-per-bunch" placeholder="VD: 12" min="0" oninput="calcFarmYield()"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Năng suất TB (quả/cây/năm) <span style="font-size:11px;color:var(--text-muted);">tự tính</span></label>
                            <input type="number" id="farm-yield" placeholder="= buồng × quả/buồng" readonly style="background:var(--bg-light);cursor:default;">
                        </div>
                        <div class="form-group"></div>
                    </div>

                    <div style="font-size:12px;font-weight:600;color:var(--primary-light);margin:16px 0 10px;text-transform:uppercase;letter-spacing:.5px;">Toạ độ (tuỳ chọn)</div>
                    <div class="form-row">
                        <div class="form-group"><label>Vĩ độ (Lat)</label><input type="number" id="farm-lat" step="0.0001" placeholder="VD: 10.2518"></div>
                        <div class="form-group"><label>Kinh độ (Lng)</label><input type="number" id="farm-lng" step="0.0001" placeholder="VD: 106.4021"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeFarmModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveFarm()"><i class="fas fa-save"></i> Lưu nông hộ</button>
                </div>
            </div>
        </div>
    `;
}

function calcFarmYield() {
    const b = parseFloat(document.getElementById('farm-bunches').value) || 0;
    const f = parseFloat(document.getElementById('farm-fruits-per-bunch').value) || 0;
    document.getElementById('farm-yield').value = b && f ? b * f : '';
}

function openFarmModal() {
    document.getElementById('farm-modal-title').innerHTML = '<i class="fas fa-seedling" style="color:var(--primary-light);margin-right:8px;"></i> Thêm nông hộ';
    document.getElementById('farm-edit-id').value = '';
    document.getElementById('farm-form' in document ? 'farm-form' : 'farm-code')?.closest('form')?.reset?.();
    ['farm-code','farm-name','farm-address','farm-phone','farm-crop','farm-area','farm-tree-count',
     'farm-tree-age','farm-harvests-per-year','farm-harvest-method','farm-bunches','farm-fruits-per-bunch',
     'farm-yield','farm-lat','farm-lng'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = id === 'farm-crop' ? 'Dừa' : '';
    });
    document.getElementById('farm-modal').classList.add('show');
}

function openEditFarmModal(id) {
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const f = farms.find(x => x.id === id);
    if (!f) return;
    document.getElementById('farm-modal-title').innerHTML = '<i class="fas fa-edit" style="color:var(--primary-light);margin-right:8px;"></i> Sửa nông hộ';
    document.getElementById('farm-edit-id').value = id;
    document.getElementById('farm-code').value            = f.code || '';
    document.getElementById('farm-name').value            = f.name || '';
    document.getElementById('farm-address').value         = f.address || '';
    document.getElementById('farm-phone').value           = f.phone || '';
    document.getElementById('farm-crop').value            = f.crop || 'Dừa';
    document.getElementById('farm-area').value            = f.area || '';
    document.getElementById('farm-tree-count').value      = f.treeCount || '';
    document.getElementById('farm-tree-age').value        = f.treeAge || '';
    document.getElementById('farm-harvests-per-year').value = f.harvestsPerYear || '';
    document.getElementById('farm-harvest-method').value  = f.harvestMethod || '';
    document.getElementById('farm-bunches').value         = f.bunchesPerTree || '';
    document.getElementById('farm-fruits-per-bunch').value = f.fruitsPerBunch || '';
    document.getElementById('farm-yield').value           = f.yieldPerTree || '';
    document.getElementById('farm-lat').value             = f.lat || '';
    document.getElementById('farm-lng').value             = f.lng || '';
    document.getElementById('farm-modal').classList.add('show');
}

function closeFarmModal() { document.getElementById('farm-modal').classList.remove('show'); }

function saveFarm() {
    const code = document.getElementById('farm-code').value.trim();
    const name = document.getElementById('farm-name').value.trim();
    const area = document.getElementById('farm-area').value.trim();
    if (!code || !name || !area) { alert('Vui lòng điền đầy đủ: Mã nông hộ, Họ tên, Diện tích.'); return; }

    let farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const editId = document.getElementById('farm-edit-id').value;
    const bunches = parseFloat(document.getElementById('farm-bunches').value) || 0;
    const fruitsPerBunch = parseFloat(document.getElementById('farm-fruits-per-bunch').value) || 0;

    const farmData = {
        code,
        name,
        address:          document.getElementById('farm-address').value,
        phone:            document.getElementById('farm-phone').value,
        area,
        crop:             document.getElementById('farm-crop').value || 'Dừa',
        treeCount:        document.getElementById('farm-tree-count').value,
        treeAge:          document.getElementById('farm-tree-age').value,
        harvestsPerYear:  document.getElementById('farm-harvests-per-year').value,
        harvestMethod:    document.getElementById('farm-harvest-method').value,
        bunchesPerTree:   bunches || '',
        fruitsPerBunch:   fruitsPerBunch || '',
        yieldPerTree:     bunches && fruitsPerBunch ? bunches * fruitsPerBunch : '',
        lat:              parseFloat(document.getElementById('farm-lat').value) || null,
        lng:              parseFloat(document.getElementById('farm-lng').value) || null
    };

    if (editId) {
        const idx = farms.findIndex(f => f.id === parseInt(editId));
        if (idx >= 0) { farms[idx] = { ...farms[idx], ...farmData }; }
        addAuditEntry('Sửa nông hộ', `${farmData.code} - ${farmData.name}`, 'blue');
    } else {
        farmData.id = Date.now();
        farms.push(farmData);
        addAuditEntry('Thêm nông hộ', `${farmData.code} - ${farmData.name}`, 'green');
    }

    localStorage.setItem('mrv_farms', JSON.stringify(farms));
    closeFarmModal();
    renderFarmMgmt(document.getElementById('page-content'));
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
        <div style="margin-top:20px;display:flex;gap:12px;">
            <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu cài đặt</button>
        </div>
        <div class="card" style="margin-top:20px;border-color:var(--danger);">
            <div class="card-header"><div class="card-title" style="color:var(--danger);"><i class="fas fa-exclamation-triangle"></i> Vùng nguy hiểm</div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                <div>
                    <div style="font-weight:600;font-size:13px;">Xóa dữ liệu nông hộ khác</div>
                    <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Chỉ giữ lại dữ liệu của <strong>Trần Minh Quang</strong>. Xóa vĩnh viễn nhật ký, SOC, drone của tất cả nông hộ còn lại.</div>
                </div>
                <button class="btn btn-danger" onclick="confirmCleanFarmData()" style="white-space:nowrap;flex-shrink:0;">
                    <i class="fas fa-broom"></i> Dọn dữ liệu
                </button>
            </div>
        </div>
    `;
}

function confirmCleanFarmData() {
    if (!confirm('Xác nhận xóa toàn bộ dữ liệu của các nông hộ KHÁC Trần Minh Quang?\n\nHành động này không thể hoàn tác.')) return;
    cleanFarmData('Trần Minh Quang');
}
