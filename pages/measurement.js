/* ========== IoT DATA PAGE ========== */
function renderIoTData(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Dữ liệu IoT</h1>
            <p class="page-desc">Dữ liệu cảm biến độ ẩm đất, pH thu thập qua LoRaWAN</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-broadcast-tower"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Thiết bị hoạt động</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-tint"></i></div>
                <div class="stat-value">-- %</div>
                <div class="stat-label">Độ ẩm TB</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-flask"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">pH TB</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow red"></div>
                <div class="stat-icon red"><i class="fas fa-clock"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Cập nhật cuối</div>
            </div>
        </div>
        <div class="grid-2">
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-tint"></i> Độ ẩm đất theo thời gian</div></div>
                <div class="chart-placeholder"><i class="fas fa-chart-area"></i><p>Dữ liệu cảm biến độ ẩm (realtime qua LoRaWAN)</p></div>
            </div>
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-flask"></i> pH đất theo thời gian</div></div>
                <div class="chart-placeholder"><i class="fas fa-chart-bar"></i><p>Dữ liệu cảm biến pH (realtime qua LoRaWAN)</p></div>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-table"></i> Bảng dữ liệu cảm biến</div>
                <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Xuất CSV</button>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Thời gian</th><th>Thiết bị</th><th>Nông hộ</th><th>Độ ẩm (%)</th><th>pH</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                        <tr><td colspan="6"><div class="empty-state"><i class="fas fa-satellite-dish"></i><p>Chưa có dữ liệu cảm biến. Dữ liệu sẽ tự động cập nhật khi thiết bị được kết nối.</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/* ========== DRONE / LIDAR DATA PAGE ========== */
function renderDroneData(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Dữ liệu Drone & LiDAR</h1>
            <p class="page-desc">Đo đạc diện tích vùng trồng và tính toán sinh khối bằng Drone LiDAR</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-helicopter"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Lần bay khảo sát</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-ruler-combined"></i></div>
                <div class="stat-value">-- ha</div>
                <div class="stat-label">Diện tích đã đo</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-tree"></i></div>
                <div class="stat-value">-- tấn</div>
                <div class="stat-label">Sinh khối ước tính</div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-upload"></i> Tải lên dữ liệu bay</div>
            </div>
            <div class="upload-area" id="drone-upload">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả hoặc nhấn để tải file LiDAR (.las, .laz, .tif)</p>
                <span style="font-size:11px;color:var(--text-muted);display:block;margin-top:8px;">Hỗ trợ: Point Cloud, GeoTIFF, Orthomosaic</span>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-table"></i> Lịch sử bay khảo sát</div>
            </div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Ngày bay</th><th>Nông hộ</th><th>Diện tích (ha)</th><th>Sinh khối (tấn)</th><th>File</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                        <tr><td colspan="6"><div class="empty-state"><i class="fas fa-helicopter"></i><p>Chưa có dữ liệu bay khảo sát</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/* ========== SOIL DATA (SOC) PAGE ========== */
function renderSoilData(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Phân tích đất (SOC)</h1>
            <p class="page-desc">Dữ liệu các-bon hữu cơ trong đất (Soil Organic Carbon) từ phòng Lab</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-vial"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Mẫu đã phân tích</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-percentage"></i></div>
                <div class="stat-value">-- %</div>
                <div class="stat-label">SOC trung bình</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-layer-group"></i></div>
                <div class="stat-value">-- tC/ha</div>
                <div class="stat-label">Trữ lượng C trong đất</div>
            </div>
        </div>
        <div class="filter-bar">
            <select><option value="">Tất cả nông hộ</option></select>
            <select><option value="">Tất cả lớp đất</option><option>0-15cm</option><option>15-30cm</option><option>30-50cm</option></select>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openSOCModal()"><i class="fas fa-plus"></i> Thêm mẫu phân tích</button>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Ngày lấy mẫu</th><th>Nông hộ</th><th>Lớp đất</th><th>SOC (%)</th><th>Dung trọng (g/cm³)</th><th>Trữ lượng C (tC/ha)</th><th>Phòng Lab</th><th>Ghi chú</th></tr></thead>
                    <tbody id="soc-table-body">
                        <tr><td colspan="8"><div class="empty-state"><i class="fas fa-vial"></i><p>Chưa có dữ liệu phân tích đất</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal-overlay" id="soc-modal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-vial" style="color:var(--primary-light);margin-right:8px;"></i> Thêm mẫu phân tích đất</h3>
                    <button class="modal-close" onclick="closeSOCModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="soc-form">
                        <div class="form-row">
                            <div class="form-group"><label>Ngày lấy mẫu</label><input type="date" id="soc-date" required></div>
                            <div class="form-group"><label>Nông hộ</label><select id="soc-farm"><option value="">Chọn nông hộ</option></select></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Lớp đất</label><select id="soc-layer"><option>0-15cm</option><option>15-30cm</option><option>30-50cm</option></select></div>
                            <div class="form-group"><label>SOC (%)</label><input type="number" id="soc-value" step="0.01" placeholder="0.00"></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Dung trọng (g/cm³)</label><input type="number" id="soc-density" step="0.01" placeholder="0.00"></div>
                            <div class="form-group"><label>Phòng Lab</label><input type="text" id="soc-lab" placeholder="Tên phòng phân tích"></div>
                        </div>
                        <div class="form-group"><label>Ghi chú</label><textarea id="soc-notes" placeholder="Ghi chú..."></textarea></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeSOCModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveSOC()"><i class="fas fa-save"></i> Lưu</button>
                </div>
            </div>
        </div>
    `;
}

let socEntries = JSON.parse(localStorage.getItem('mrv_soc') || '[]');
function openSOCModal() { document.getElementById('soc-modal').classList.add('show'); }
function closeSOCModal() { document.getElementById('soc-modal').classList.remove('show'); }
function saveSOC() {
    const entry = {
        id: Date.now(), date: document.getElementById('soc-date').value,
        farm: document.getElementById('soc-farm').value || '--',
        layer: document.getElementById('soc-layer').value,
        soc: document.getElementById('soc-value').value,
        density: document.getElementById('soc-density').value,
        carbonStock: '', // Công thức tính toán sẽ cập nhật sau
        lab: document.getElementById('soc-lab').value,
        notes: document.getElementById('soc-notes').value,
        recorder: currentUser.name
    };
    socEntries.push(entry);
    localStorage.setItem('mrv_soc', JSON.stringify(socEntries));
    closeSOCModal();
    loadSOCData();
    addAuditEntry('Thêm mẫu phân tích đất', `Nông hộ: ${entry.farm}, Lớp: ${entry.layer}`, 'blue');
}
function loadSOCData() {
    const tbody = document.getElementById('soc-table-body');
    if (!tbody || socEntries.length === 0) return;
    tbody.innerHTML = socEntries.map(e => `<tr><td>${e.date}</td><td>${e.farm}</td><td>${e.layer}</td><td>${e.soc||'--'}</td><td>${e.density||'--'}</td><td>${e.carbonStock||'(chờ công thức)'}</td><td>${e.lab||'--'}</td><td>${e.notes||'--'}</td></tr>`).join('');
}
