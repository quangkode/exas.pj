/* ========== AUDIT LOG - Admin only ========== */
let auditEntries = JSON.parse(localStorage.getItem('mrv_audit') || '[]');

function addAuditEntry(action, detail, color) {
    const entry = { id: Date.now(), action, detail, color: color || 'blue', user: currentUser?.name || 'System', time: new Date().toISOString() };
    auditEntries.unshift(entry);
    if (auditEntries.length > 200) auditEntries = auditEntries.slice(0, 200);
    localStorage.setItem('mrv_audit', JSON.stringify(auditEntries));
}

function renderAuditLog(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Audit Log</h1>
            <p class="page-desc">Nhật ký thay đổi dữ liệu - đảm bảo truy xuất nguồn gốc</p>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" placeholder="Tìm kiếm..."></div>
            <div style="flex:1;"></div>
            <button class="btn btn-secondary btn-sm" onclick="clearAuditLog()"><i class="fas fa-trash"></i> Xóa log</button>
        </div>
        <div class="card">
            <div id="audit-list">${auditEntries.length === 0 ? '<div class="empty-state"><i class="fas fa-history"></i><p>Chưa có hoạt động nào được ghi nhận</p></div>' :
            auditEntries.map(e => `
                <div class="audit-item">
                    <div class="audit-dot ${e.color}"></div>
                    <div class="audit-content">
                        <div class="audit-title">${e.action} <span style="color:var(--text-muted);">— ${e.detail}</span></div>
                        <div class="audit-time"><i class="fas fa-user" style="margin-right:4px;"></i>${e.user} · ${new Date(e.time).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            `).join('')}</div>
        </div>
    `;
}

function clearAuditLog() {
    if (!confirm('Xác nhận xóa toàn bộ audit log?')) return;
    auditEntries = [];
    localStorage.setItem('mrv_audit', JSON.stringify(auditEntries));
    renderAuditLog(document.getElementById('page-content'));
}

/* ========== VVB PORTAL - Admin only ========== */
function renderVVBPortal(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Cổng VVB (Validation/Verification Body)</h1>
            <p class="page-desc">Cổng thông tin chuẩn hóa cho bên thứ ba kiểm định</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-shield-alt"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Đợt kiểm định</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-file-contract"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Tài liệu chia sẻ</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-comments"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Phản hồi VVB</div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-share-alt"></i> Quản lý chia sẻ dữ liệu</div></div>
            <div style="padding:20px;text-align:center;color:var(--text-muted);">
                <i class="fas fa-lock" style="font-size:48px;opacity:0.2;margin-bottom:16px;display:block;"></i>
                <p>Cổng VVB cho phép bên kiểm định truy cập dữ liệu đã chuẩn hóa.</p>
                <p style="font-size:12px;margin-top:8px;">Chức năng tạo phiên kiểm định và chia sẻ dữ liệu sẽ được tích hợp.</p>
            </div>
        </div>
    `;
}
