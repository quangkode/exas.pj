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

const DRONE_SEED_VERSION = 'v1';
function initDefaultDroneData() {
    if (localStorage.getItem('mrv_drone_seed') === DRONE_SEED_VERSION) return;
    const existing = JSON.parse(localStorage.getItem('mrv_drone') || '[]');
    const isSeedOnly = existing.every(e => String(e.id).startsWith('17000000030'));
    if (existing.length > 0 && !isSeedOnly) {
        localStorage.setItem('mrv_drone_seed', DRONE_SEED_VERSION);
        return;
    }
    const defaults = [
        {
            id: 1700000003001,
            date: '2023-03-22',
            farm: 'Trần Minh Quang',
            area: 4.61,
            pilot: 'Kỹ thuật viên Nguyễn Văn Tài',
            drone: 'DJI Phantom 4 RTK',
            gsd: '3.2 cm/px',
            altitude: '80m AGL',
            overlap: '80/75%',
            fileNames: 'orthomosaic_20230322_NH001.tif, pointcloud_20230322_NH001.laz',
            fileSize: '2.14 GB',
            notes: 'Bay đầu kỳ đo — xác định ranh giới vườn, diện tích thực 4.61 ha',
            status: 'processed',
            createdAt: '2023-03-22T07:30:00.000Z'
        },
        {
            id: 1700000003002,
            date: '2024-04-12',
            farm: 'Trần Minh Quang',
            area: 4.60,
            pilot: 'Kỹ thuật viên Nguyễn Văn Tài',
            drone: 'DJI Phantom 4 RTK',
            gsd: '3.1 cm/px',
            altitude: '80m AGL',
            overlap: '80/75%',
            fileNames: 'orthomosaic_20240412_NH001.tif, pointcloud_20240412_NH001.laz',
            fileSize: '2.08 GB',
            notes: 'Bay cuối kỳ đo — kiểm tra biến động diện tích, không thay đổi đáng kể',
            status: 'processed',
            createdAt: '2024-04-12T07:15:00.000Z'
        }
    ];
    localStorage.setItem('mrv_drone', JSON.stringify(defaults));
    localStorage.setItem('mrv_drone_seed', DRONE_SEED_VERSION);
}

function renderDroneData(container) {
    initDefaultDroneData();
    const entries = JSON.parse(localStorage.getItem('mrv_drone') || '[]');
    const totalArea = entries.length ? Math.max(...entries.map(e => e.area)) : 0;

    const statusBadge = s => s === 'processed'
        ? '<span class="badge badge-green">Đã xử lý</span>'
        : '<span class="badge badge-orange">Đang xử lý</span>';

    const rows = entries.length === 0
        ? '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-helicopter"></i><p>Chưa có dữ liệu bay khảo sát</p></div></td></tr>'
        : entries.map(e => `<tr>
            <td>${e.date}</td>
            <td><strong>${e.farm}</strong></td>
            <td><strong style="color:var(--primary-light);">${e.area} ha</strong></td>
            <td style="font-size:11px;">
                <div>${e.drone}</div>
                <div style="color:var(--text-muted);">GSD: ${e.gsd} | ${e.altitude} | Overlap: ${e.overlap}</div>
            </td>
            <td style="font-size:11px;">
                <div style="color:var(--text-secondary);">${e.fileNames}</div>
                <div style="color:var(--text-muted);">${e.fileSize}</div>
            </td>
            <td>${statusBadge(e.status)}</td>
            <td><button class="btn-icon" onclick="deleteDroneEntry(${e.id})" title="Xóa" style="color:var(--danger);"><i class="fas fa-trash"></i></button></td>
        </tr>`).join('');

    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Dữ liệu Drone & LiDAR</h1>
            <p class="page-desc">Đo đạc diện tích vùng trồng bằng Drone & LiDAR</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-helicopter"></i></div>
                <div class="stat-value">${entries.length}</div>
                <div class="stat-label">Lần bay khảo sát</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-ruler-combined"></i></div>
                <div class="stat-value">${totalArea > 0 ? totalArea.toFixed(2) + ' ha' : '-- ha'}</div>
                <div class="stat-label">Diện tích đã đo</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-check-circle"></i></div>
                <div class="stat-value">${entries.filter(e => e.status === 'processed').length}</div>
                <div class="stat-label">Đã xử lý</div>
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
                    <thead><tr>
                        <th>Ngày bay</th><th>Nông hộ</th><th>Diện tích (ha)</th>
                        <th>Thông số bay</th><th>File</th><th>Trạng thái</th><th></th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function deleteDroneEntry(id) {
    if (!confirm('Xác nhận xóa bản ghi bay này?')) return;
    let entries = JSON.parse(localStorage.getItem('mrv_drone') || '[]');
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem('mrv_drone', JSON.stringify(entries));
    renderDroneData(document.getElementById('page-content'));
}

/* ========== SOIL DATA (SOC) PAGE ========== */
function renderSoilData(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Phân tích đất (SOC)</h1>
            <p class="page-desc">Dữ liệu các-bon hữu cơ trong đất (Soil Organic Carbon) từ phòng Lab — theo VM0042</p>
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
                <div class="stat-value">-- g/kg</div>
                <div class="stat-label">OC trung bình</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-layer-group"></i></div>
                <div class="stat-value">-- tC/ha</div>
                <div class="stat-label">M<sub>SOC</sub> TB (VM0042)</div>
            </div>
        </div>
        <div class="filter-bar">
            <select id="soc-farm-filter"><option value="">Tất cả nông hộ</option></select>
            <select><option value="">Tất cả lớp đất</option><option>0-15cm</option><option>15-30cm</option><option>30-50cm</option></select>
            <div style="flex:1;"></div>
            <button class="btn btn-secondary" onclick="downloadSOCTemplate()" title="Tải file CSV mẫu" style="border-color:var(--text-muted);color:var(--text-muted);">
                <i class="fas fa-download"></i> Template
            </button>
            <button class="btn btn-secondary" onclick="openSOCImportModal()" style="border-color:var(--info);color:var(--info);">
                <i class="fas fa-file-upload"></i> Nhập từ file
            </button>
            <button class="btn btn-primary" onclick="openSOCModal()"><i class="fas fa-plus"></i> Thêm mẫu phân tích</button>
        </div>
        <div class="grid-2" style="margin-top:20px;">
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-chart-line"></i> Trữ lượng SOC theo vụ (VM0042)</div></div>
                <div style="padding:20px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                        <div style="background:var(--bg-light);padding:15px;border-radius:8px;border-left:3px solid var(--primary-light);">
                            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📊 SOC<sub>wp,i,t-x</sub> — Đầu vụ</div>
                            <div style="font-size:20px;font-weight:bold;color:var(--primary-light);" id="soc-begin-value">--</div>
                            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">tC/ha (TB M<sub>n,dl,SOC</sub>)</div>
                        </div>
                        <div style="background:var(--bg-light);padding:15px;border-radius:8px;border-left:3px solid var(--success);">
                            <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">✓ SOC<sub>wp,i,t</sub> — Cuối vụ</div>
                            <div style="font-size:20px;font-weight:bold;color:var(--success);" id="soc-end-value">--</div>
                            <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">tC/ha (TB M<sub>n,dl,SOC</sub>)</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;padding:15px;background:var(--bg-light);border-radius:8px;border-left:3px solid var(--warning);">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">⚡ ΔSOC (SOC₁ − SOC₀)</div>
                        <div style="font-size:20px;font-weight:bold;color:var(--warning);" id="soc-change-value">--</div>
                        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">tC/ha</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-calculator"></i> ΔCO₂_soil — VM0042</div></div>
                <div style="padding:20px;">
                    <div style="background:var(--bg-light);padding:15px;border-radius:8px;border-left:3px solid var(--info);margin-bottom:12px;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📈 ΔCO₂_soil (t CO₂e/năm)</div>
                        <div style="font-size:22px;font-weight:bold;color:var(--info);" id="delta-co2-soil-value">--</div>
                        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Σ((SOC<sub>wp,t</sub> − SOC<sub>wp,t−x</sub>) × 1/x) × A<sub>i</sub></div>
                    </div>
                    <div style="background:var(--bg-light);padding:15px;border-radius:8px;border-left:3px solid var(--secondary);margin-bottom:12px;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📊 ΔStockC cũ (tC) — phương pháp Bd</div>
                        <div style="font-size:18px;font-weight:bold;color:var(--secondary);" id="carbon-stock-change-value">--</div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">Diện tích A<sub>i</sub> (ha)</label>
                            <input type="number" id="farm-area-input" step="0.01" value="1" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:white;">
                        </div>
                        <div>
                            <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">Khoảng thời gian x (năm)</label>
                            <input type="number" id="soc-x-years" step="1" value="1" min="1" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:white;">
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="calculateSOCStats()" style="margin-top:10px;width:100%;"><i class="fas fa-redo"></i> Tính toán lại</button>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Ngày lấy mẫu</th><th>Nông hộ</th><th>Lớp đất</th><th>OC (g/kg)</th><th>SOC (%)</th><th>M<sub>n,dl</sub> (g)</th><th>D (mm) / N</th><th>M<sub>n,dl,SOC</sub> (tC/ha)</th><th>Phòng Lab</th><th>Ghi chú</th></tr></thead>
                    <tbody id="soc-table-body">
                        <tr><td colspan="10"><div class="empty-state"><i class="fas fa-vial"></i><p>Chưa có dữ liệu phân tích đất</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal Import -->
        <div class="modal-overlay" id="soc-import-modal">
            <div class="modal" style="max-width:860px;">
                <div class="modal-header">
                    <h3><i class="fas fa-file-upload" style="color:var(--info);margin-right:8px;"></i> Nhập dữ liệu SOC từ file CSV / Excel</h3>
                    <button class="modal-close" onclick="closeSOCImportModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <!-- Hướng dẫn cột -->
                    <div style="background:var(--bg-light);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:12px;">
                        <div style="font-weight:600;color:var(--info);margin-bottom:6px;">Cột cần có trong file (tên cột linh hoạt, không phân biệt hoa thường):</div>
                        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
                            <span><code>Ngày</code> — ngày lấy mẫu</span>
                            <span><code>Nông hộ</code> — tên nông hộ</span>
                            <span><code>Thời kỳ</code> — Đầu vụ / Cuối vụ</span>
                            <span><code>Lớp đất</code> — 0-15cm…</span>
                            <span><code>OC (g/kg)</code> — hàm lượng OC</span>
                            <span><code>M_sample (g)</code> — khối lượng mẫu</span>
                            <span><code>D (mm)</code> — đường kính ống</span>
                            <span><code>N</code> — số lõi</span>
                            <span><code>Phòng lab</code> — tuỳ chọn</span>
                            <span><code>Ghi chú</code> — tuỳ chọn</span>
                        </div>
                    </div>
                    <!-- Upload area -->
                    <label for="soc-file-input" id="soc-import-dropzone"
                        style="border:2px dashed var(--info);border-radius:10px;padding:32px;text-align:center;cursor:pointer;transition:.2s;display:block;">
                        <i class="fas fa-cloud-upload-alt" style="font-size:32px;color:var(--info);margin-bottom:10px;display:block;"></i>
                        <div style="font-weight:600;margin-bottom:4px;">Kéo thả file vào đây hoặc nhấn để chọn</div>
                        <div style="font-size:12px;color:var(--text-muted);">Hỗ trợ: CSV (.csv) và Excel (.xlsx, .xls)</div>
                        <input type="file" id="soc-file-input" accept=".csv,.xlsx,.xls" style="display:none;" onchange="handleSOCFileUpload(this.files[0])">
                    </label>
                    <!-- Preview table -->
                    <div id="soc-import-preview" style="display:none;margin-top:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <div id="soc-import-summary" style="font-size:13px;font-weight:600;color:var(--success);"></div>
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('soc-file-input').click()"><i class="fas fa-redo"></i> Đổi file</button>
                        </div>
                        <div class="table-wrapper" style="max-height:320px;overflow-y:auto;">
                            <table class="data-table" style="font-size:12px;">
                                <thead>
                                    <tr style="background:var(--info);">
                                        <th style="color:white;">Ngày</th>
                                        <th style="color:white;">Nông hộ</th>
                                        <th style="color:white;">Thời kỳ</th>
                                        <th style="color:white;">Lớp đất</th>
                                        <th style="color:white;">OC (g/kg)</th>
                                        <th style="color:white;">M_sample (g)</th>
                                        <th style="color:white;">D (mm)</th>
                                        <th style="color:white;">N</th>
                                        <th style="color:white;background:#1a7a8a;">M_n,dl,SOC (tC/ha)</th>
                                        <th style="color:white;">Lab</th>
                                        <th style="color:white;">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody id="soc-import-preview-body"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeSOCImportModal()">Hủy</button>
                    <button class="btn btn-primary" id="soc-import-confirm-btn" style="display:none;" onclick="confirmSOCImport()">
                        <i class="fas fa-database"></i> <span id="soc-import-confirm-label">Nhập dữ liệu</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal thêm từng mẫu -->
        <div class="modal-overlay" id="soc-modal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-vial" style="color:var(--primary-light);margin-right:8px;"></i> Thêm mẫu phân tích đất (VM0042)</h3>
                    <button class="modal-close" onclick="closeSOCModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="soc-form">
                        <div class="form-row">
                            <div class="form-group"><label>Ngày lấy mẫu</label><input type="date" id="soc-date" required></div>
                            <div class="form-group"><label>Nông hộ</label><select id="soc-farm"><option value="">Chọn nông hộ</option></select></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group"><label>Thời kỳ lấy mẫu</label>
                                <select id="soc-period">
                                    <option value="beginning">Đầu vụ (t−x)</option>
                                    <option value="ending" selected>Cuối vụ (t)</option>
                                </select>
                            </div>
                            <div class="form-group"><label>Lớp đất</label><select id="soc-layer"><option>0-15cm</option><option>15-30cm</option><option>30-50cm</option></select></div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>OC hữu cơ — OC<sub>n,dl</sub> (g/kg)</label>
                                <input type="number" id="soc-oc-gkg" step="0.01" placeholder="0.00" required oninput="syncSOCPercent();updateSOCMassDisplay();">
                            </div>
                            <div class="form-group">
                                <label>SOC (%) — tự động (= OC ÷ 10)</label>
                                <input type="number" id="soc-value" step="0.001" placeholder="hoặc nhập trực tiếp" oninput="syncOCGperKg();updateSOCMassDisplay();">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Khối lượng mẫu — M<sub>n,dl</sub> (g)</label>
                                <input type="number" id="soc-msample" step="0.1" placeholder="gram" required oninput="updateSOCMassDisplay();">
                            </div>
                            <div class="form-group">
                                <label>Đường kính ống — D (mm)</label>
                                <input type="number" id="soc-tube-d" step="0.1" value="52" oninput="updateSOCMassDisplay();">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Số lõi đất — N</label>
                                <input type="number" id="soc-n-cores" step="1" value="1" min="1" oninput="updateSOCMassDisplay();">
                            </div>
                            <div class="form-group">
                                <label>Dung trọng (g/cm³) — tuỳ chọn</label>
                                <input type="number" id="soc-density" step="0.01" placeholder="0.00" oninput="updateCarbonStockDisplay();">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label style="color:var(--primary-light);font-weight:600;">M<sub>n,dl,SOC</sub> — VM0042 (tC/ha)</label>
                                <input type="text" id="soc-mass-vm0042" readonly placeholder="Tính tự động" style="font-weight:bold;border-color:var(--primary-light);">
                            </div>
                            <div class="form-group">
                                <label>Trữ lượng C cũ — Bd (tC/ha)</label>
                                <input type="text" id="soc-carbon-stock" readonly placeholder="Cần dung trọng">
                            </div>
                        </div>
                        <div class="form-row">
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

    setTimeout(() => {
        loadSOCData();
        const farmFilter = document.getElementById('soc-farm-filter');
        if (farmFilter) farmFilter.addEventListener('change', () => calculateSOCStats());

        const totalSamples = socEntries.length;
        const avgOC = socEntries.length > 0
            ? (socEntries.reduce((sum, e) => sum + parseFloat(e.ocGperKg || (e.soc ? e.soc * 10 : 0)), 0) / socEntries.length).toFixed(2)
            : '--';
        const avgSOCMass = socEntries.filter(e => e.socMassVM0042).length > 0
            ? (socEntries.filter(e => e.socMassVM0042).reduce((sum, e) => sum + parseFloat(e.socMassVM0042), 0) / socEntries.filter(e => e.socMassVM0042).length).toFixed(4)
            : '--';

        document.querySelectorAll('.stat-card')[0].querySelector('.stat-value').textContent = totalSamples;
        document.querySelectorAll('.stat-card')[1].querySelector('.stat-value').textContent = avgOC + ' g/kg';
        document.querySelectorAll('.stat-card')[2].querySelector('.stat-value').textContent = avgSOCMass + ' tC/ha';
    }, 100);
}

let socEntries = JSON.parse(localStorage.getItem('mrv_soc') || '[]');

// ===== SOC CALCULATION FORMULAS =====

function getSoilDepth(layer) {
    const depths = { '0-15cm': 15, '15-30cm': 15, '30-50cm': 20 };
    return depths[layer] || 15;
}

// Phương pháp cũ: SOC(%) × Bd(g/cm³) × Depth(cm) / 10 = tC/ha
function calculateCarbonStock(socPercent, bulkDensity, layer) {
    if (!socPercent || !bulkDensity) return null;
    const depth = getSoilDepth(layer);
    return ((parseFloat(socPercent) * parseFloat(bulkDensity) * depth) / 10).toFixed(2);
}

// VM0042: M_{n,dl,SOC} = (M_{n,dl,sample} / (π(D/2)² × N)) × 10000 × OC_{n,dl}
// OC_{n,dl} trong VM0042 là phân số g/g; input từ lab là g/kg → chia 1000 trước khi nhân
function calculateSOCMassVM0042(mSample, D, N, ocGperKg) {
    if (!mSample || !D || !N || !ocGperKg) return null;
    const tubeArea = Math.PI * Math.pow(parseFloat(D) / 2, 2); // mm²
    const ocFraction = parseFloat(ocGperKg) / 1000;            // g/kg → g/g
    const result = (parseFloat(mSample) / (tubeArea * parseFloat(N))) * 10000 * ocFraction;
    return result.toFixed(4);
}

// Trung bình M_{n,dl,SOC} của một nông hộ theo thời kỳ (SOC_{wp,i,t} hoặc SOC_{wp,i,t-x})
function getAvgSOCMassVM0042(farmId, isBeginning) {
    const samples = socEntries.filter(e => e.farm === farmId && e.isBeginning === isBeginning && e.socMassVM0042 != null);
    if (samples.length === 0) return 0;
    return samples.reduce((sum, s) => sum + parseFloat(s.socMassVM0042 || 0), 0) / samples.length;
}

// VM0042: ΔCO₂_soil_{ep,t} = Σ((SOC_{wp,i,t} − SOC_{wp,i,t−x}) × 1/x) × A_i
function calculateDeltaCO2Soil(farmId, areaHa, x) {
    const socT = getAvgSOCMassVM0042(farmId, false);    // cuối vụ
    const socTx = getAvgSOCMassVM0042(farmId, true);    // đầu vụ
    const result = ((socT - socTx) * (1 / parseFloat(x))) * parseFloat(areaHa);
    return result.toFixed(4);
}

// SOC trung bình % đầu/cuối vụ (phương pháp cũ)
function calculateSOCBeginning(farmId) {
    const samples = socEntries.filter(e => e.farm === farmId && e.isBeginning);
    if (samples.length === 0) return 0;
    return (samples.reduce((sum, s) => sum + parseFloat(s.soc || 0), 0) / samples.length).toFixed(2);
}

function calculateSOCEnding(farmId) {
    const samples = socEntries.filter(e => e.farm === farmId && !e.isBeginning);
    if (samples.length === 0) return 0;
    return (samples.reduce((sum, s) => sum + parseFloat(s.soc || 0), 0) / samples.length).toFixed(2);
}

// ΔStockC = Σ((Stockt+1 − Stockt) × A) — phương pháp cũ
function calculateTotalCarbonStockChange(farmId, areaHa) {
    const beginSamples = socEntries.filter(e => e.farm === farmId && e.isBeginning);
    const endSamples = socEntries.filter(e => e.farm === farmId && !e.isBeginning);
    const avgBegin = beginSamples.length > 0
        ? beginSamples.reduce((sum, s) => sum + (parseFloat(calculateCarbonStock(s.soc, s.density, s.layer)) || 0), 0) / beginSamples.length
        : 0;
    const avgEnd = endSamples.length > 0
        ? endSamples.reduce((sum, s) => sum + (parseFloat(calculateCarbonStock(s.soc, s.density, s.layer)) || 0), 0) / endSamples.length
        : 0;
    return ((avgEnd - avgBegin) * (parseFloat(areaHa) || 1)).toFixed(2);
}

// ===== FORM SYNC HELPERS =====

function syncSOCPercent() {
    const oc = document.getElementById('soc-oc-gkg')?.value;
    const socField = document.getElementById('soc-value');
    if (socField && oc) socField.value = (parseFloat(oc) / 10).toFixed(3);
}

function syncOCGperKg() {
    const soc = document.getElementById('soc-value')?.value;
    const ocField = document.getElementById('soc-oc-gkg');
    if (ocField && soc) ocField.value = (parseFloat(soc) * 10).toFixed(2);
}

function updateSOCMassDisplay() {
    const mSample = document.getElementById('soc-msample')?.value;
    const D = document.getElementById('soc-tube-d')?.value;
    const N = document.getElementById('soc-n-cores')?.value;
    const oc = document.getElementById('soc-oc-gkg')?.value;
    const mass = calculateSOCMassVM0042(mSample, D, N, oc);
    const el = document.getElementById('soc-mass-vm0042');
    if (el) el.value = mass ? mass + ' tC/ha' : '';
}

function updateCarbonStockDisplay() {
    const socPercent = document.getElementById('soc-value')?.value;
    const bulkDensity = document.getElementById('soc-density')?.value;
    const layer = document.getElementById('soc-layer')?.value;
    const carbonStock = calculateCarbonStock(socPercent, bulkDensity, layer);
    const el = document.getElementById('soc-carbon-stock');
    if (el) el.value = carbonStock ? carbonStock + ' tC/ha' : '';
}

// ===== MODAL OPEN / CLOSE =====

function openSOCModal() {
    document.getElementById('soc-modal').classList.add('show');
    document.getElementById('soc-form').reset();
    document.getElementById('soc-mass-vm0042').value = '';
    document.getElementById('soc-carbon-stock').value = '';
    // Default tube diameter
    const dField = document.getElementById('soc-tube-d');
    if (dField && !dField.value) dField.value = 52;
}

function closeSOCModal() {
    document.getElementById('soc-modal').classList.remove('show');
}

// ===== SAVE =====

function saveSOC() {
    const ocGperKg = document.getElementById('soc-oc-gkg').value;
    const socPercent = document.getElementById('soc-value').value || (ocGperKg ? (parseFloat(ocGperKg) / 10).toFixed(3) : '');
    const mSample = document.getElementById('soc-msample').value;
    const D = document.getElementById('soc-tube-d').value;
    const N = document.getElementById('soc-n-cores').value;
    const bulkDensity = document.getElementById('soc-density').value;
    const layer = document.getElementById('soc-layer').value;
    const period = document.getElementById('soc-period').value;

    const socMassVM0042 = calculateSOCMassVM0042(mSample, D, N, ocGperKg);
    const carbonStock = calculateCarbonStock(socPercent, bulkDensity, layer);

    const entry = {
        id: Date.now(),
        date: document.getElementById('soc-date').value,
        farm: document.getElementById('soc-farm').value || '--',
        layer,
        ocGperKg: parseFloat(ocGperKg) || 0,
        soc: parseFloat(socPercent) || 0,
        mSample: parseFloat(mSample) || 0,
        tubeDiameter: parseFloat(D) || 52,
        numCores: parseInt(N) || 1,
        density: parseFloat(bulkDensity) || 0,
        socMassVM0042: socMassVM0042 ? parseFloat(socMassVM0042) : null,
        carbonStock: carbonStock || 0,
        lab: document.getElementById('soc-lab').value,
        notes: document.getElementById('soc-notes').value,
        recorder: currentUser.name,
        isBeginning: period === 'beginning'
    };
    socEntries.push(entry);
    localStorage.setItem('mrv_soc', JSON.stringify(socEntries));
    closeSOCModal();
    loadSOCData();
    const periodLabel = period === 'beginning' ? 'Đầu vụ' : 'Cuối vụ';
    addAuditEntry('Thêm mẫu phân tích đất', `${periodLabel} | Nông hộ: ${entry.farm}, Lớp: ${entry.layer}, M_SOC: ${entry.socMassVM0042 ?? '--'} tC/ha`, 'blue');
}

// ===== CALCULATE & DISPLAY STATS =====

function calculateSOCStats() {
    const farmId = document.getElementById('soc-farm-filter')?.value || '';
    if (!farmId) { alert('Vui lòng chọn nông hộ trước'); return; }

    const areaHa = parseFloat(document.getElementById('farm-area-input')?.value) || 1;
    const x = parseFloat(document.getElementById('soc-x-years')?.value) || 1;

    // VM0042 averages
    const socWpBegin = getAvgSOCMassVM0042(farmId, true);
    const socWpEnd = getAvgSOCMassVM0042(farmId, false);
    const deltaCO2 = calculateDeltaCO2Soil(farmId, areaHa, x);

    // Phương pháp cũ
    const carbonStockChange = calculateTotalCarbonStockChange(farmId, areaHa);

    const beginEl = document.getElementById('soc-begin-value');
    const endEl = document.getElementById('soc-end-value');
    const changeEl = document.getElementById('soc-change-value');
    const deltaCO2El = document.getElementById('delta-co2-soil-value');
    const carbonChangeEl = document.getElementById('carbon-stock-change-value');

    if (beginEl) beginEl.textContent = socWpBegin > 0 ? socWpBegin.toFixed(4) : '--';
    if (endEl) endEl.textContent = socWpEnd > 0 ? socWpEnd.toFixed(4) : '--';
    if (changeEl) changeEl.textContent = (socWpEnd - socWpBegin).toFixed(4);
    if (deltaCO2El) deltaCO2El.textContent = deltaCO2 + ' t CO₂e';
    if (carbonChangeEl) carbonChangeEl.textContent = carbonStockChange + ' tC';
}

// ===== LOAD TABLE =====

function loadSOCData() {
    const tbody = document.getElementById('soc-table-body');
    if (!tbody) return;
    if (socEntries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><i class="fas fa-vial"></i><p>Chưa có dữ liệu phân tích đất</p></div></td></tr>';
        return;
    }
    tbody.innerHTML = socEntries.map(e => {
        const period = e.isBeginning ? '📊 Đầu vụ' : '✓ Cuối vụ';
        const ocDisplay = e.ocGperKg || (e.soc ? (e.soc * 10).toFixed(1) : '--');
        const socMassDisplay = e.socMassVM0042 != null ? `<strong style="color:var(--primary-light);">${parseFloat(e.socMassVM0042).toFixed(4)}</strong>` : '--';
        return `<tr>
            <td>${e.date}</td>
            <td>${e.farm}</td>
            <td>${e.layer}</td>
            <td>${ocDisplay}</td>
            <td>${e.soc || '--'}</td>
            <td>${e.mSample || '--'}</td>
            <td>${e.tubeDiameter || '--'} / ${e.numCores || '--'}</td>
            <td>${socMassDisplay} tC/ha</td>
            <td>${e.lab || '--'}</td>
            <td>${period}${e.notes ? ' | ' + e.notes : ''}</td>
        </tr>`;
    }).join('');

    const farms = [...new Set(socEntries.map(e => e.farm))].filter(f => f !== '--');
    const farmFilter = document.getElementById('soc-farm-filter');
    if (farmFilter) {
        const currentValue = farmFilter.value;
        farmFilter.innerHTML = '<option value="">Tất cả nông hộ</option>' +
            farms.map(f => `<option value="${f}">${f}</option>`).join('');
        farmFilter.value = currentValue;
    }
}

/* ===== SOC FILE IMPORT ===== */

let socImportRows = [];

function openSOCImportModal() {
    document.getElementById('soc-import-modal').classList.add('show');
    socImportRows = [];
    document.getElementById('soc-import-preview').style.display = 'none';
    document.getElementById('soc-import-confirm-btn').style.display = 'none';
    document.getElementById('soc-file-input').value = '';

    const zone = document.getElementById('soc-import-dropzone');
    if (zone._dragBound) return;
    zone._dragBound = true;

    zone.addEventListener('dragenter', e => { e.preventDefault(); e.stopPropagation(); zone.style.background = 'var(--bg-light)'; zone.style.borderColor = 'var(--success)'; });
    zone.addEventListener('dragover',  e => { e.preventDefault(); e.stopPropagation(); zone.style.background = 'var(--bg-light)'; zone.style.borderColor = 'var(--success)'; });
    zone.addEventListener('dragleave', e => { e.preventDefault(); e.stopPropagation(); zone.style.background = ''; zone.style.borderColor = 'var(--info)'; });
    zone.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        zone.style.background = '';
        zone.style.borderColor = 'var(--info)';
        const file = e.dataTransfer.files[0];
        if (file) handleSOCFileUpload(file);
    });
}

function closeSOCImportModal() {
    document.getElementById('soc-import-modal').classList.remove('show');
}

// Chuẩn hoá tên cột
function normalizeHeader(h) {
    return (h || '').toLowerCase().trim()
        .replace(/[–—]/g, '-')   // em dash / en dash → hyphen
        .replace(/\s+/g, ' ')
        .replace(/[()]/g, '')
        .replace('nông hộ', 'farm')
        .replace('ngày lấy mẫu', 'date')
        .replace('ngày', 'date')
        .replace('thời kỳ kỳ đo', 'period')
        .replace('thời kỳ', 'period')
        .replace('lớp đất dl cm', 'layer')
        .replace('lớp đất dl', 'layer')
        .replace('lớp đất', 'layer')
        .replace('oc g/kg', 'oc')
        .replace('m_sample g', 'msample')
        .replace('m sample g', 'msample')
        .replace('khối lượng mẫu', 'msample')
        .replace('msample g', 'msample')
        .replace('đường kính', 'd')
        .replace('d mm', 'd')
        .replace('n lõi', 'n')
        .replace('số lõi', 'n')
        .replace('phòng lab', 'lab')
        .replace('ghi chú', 'notes');
}

function mapHeader(headers) {
    const map = {};
    headers.forEach((h, i) => {
        const n = normalizeHeader(h);
        if (n.includes('date') || n.includes('ngày')) map.date = i;
        else if (n.includes('farm') || n.includes('nông hộ') || n === 'nong ho') map.farm = i;
        else if (n.includes('period') || n.includes('thời kỳ') || n.includes('thoi ky')) map.period = i;
        else if (n.includes('layer') || n.includes('lớp') || n.includes('lop')) map.layer = i;
        else if (n.includes('oc') || n.includes('organic carbon')) map.oc = i;
        else if (n.includes('msample') || n.includes('m_sample') || n.includes('mẫu') || n.includes('m sample')) map.msample = i;
        else if ((n === 'd' || n.includes('d mm') || n.includes('diameter') || n.includes('đường kính') || n.includes('duong kinh')) && !map.d) map.d = i;
        else if (n === 'n' || n.includes('cores') || n.includes('lõi') || n.includes('loi')) map.n = i;
        else if (n.includes('lab') || n.includes('phòng')) map.lab = i;
        else if (n.includes('notes') || n.includes('ghi chú') || n.includes('ghi chu')) map.notes = i;
    });
    return map;
}

function parseVNDate(raw) {
    const s = (raw + '').trim();
    // DD/MM/YYYY hoặc DD-MM-YYYY
    const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    // YYYY-MM-DD giữ nguyên
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    return s || new Date().toISOString().slice(0,10);
}

function parseRowToSOC(row, map) {
    const get = (key, def = '') => {
        const idx = map[key];
        return idx !== undefined ? (row[idx] ?? def) : def;
    };

    const date = parseVNDate(get('date') || '');
    const farm = (get('farm', 'Chưa xác định') + '').trim() || 'Chưa xác định';
    const periodRaw = (get('period', '') + '').toLowerCase();
    // Nhận diện: "Kỳ 1 (Đầu vụ)", "Đầu vụ", "beginning", "ky 1", "t-x"
    const isBeginning = periodRaw.includes('đầu') || periodRaw.includes('dau') ||
        periodRaw.includes('begin') || periodRaw.includes('start') ||
        periodRaw === 't-x' || /kỳ\s*1/.test(periodRaw) || /ky\s*1/.test(periodRaw);
    const layer = (get('layer', '0-20') + '').trim() || '0-20';
    const ocGperKg = parseLocaleFloat(get('oc', 0));
    const mSample  = parseLocaleFloat(get('msample', 0));
    const D        = parseLocaleFloat(get('d', 52)) || 52;
    const N        = parseInt(get('n', 1)) || 1;
    const lab      = get('lab', '');
    const notes    = get('notes', '');

    const socMassVM0042 = calculateSOCMassVM0042(mSample, D, N, ocGperKg);
    const soc = ocGperKg ? (ocGperKg / 10) : 0;

    return { date, farm, layer, ocGperKg, soc, mSample, tubeDiameter: D, numCores: N,
             lab, notes, isBeginning,
             socMassVM0042: socMassVM0042 ? parseFloat(socMassVM0042) : null,
             ok: !!(ocGperKg && mSample) };
}

function handleSOCFileUpload(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = e => parseSOCCSV(e.target.result);
        reader.readAsText(file, 'UTF-8');
    } else if (ext === 'xlsx' || ext === 'xls') {
        if (typeof XLSX === 'undefined') { alert('Thư viện XLSX chưa tải. Vui lòng dùng file CSV.'); return; }
        const reader = new FileReader();
        reader.onload = e => {
            const wb = XLSX.read(e.target.result, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
            processSOCRows(aoa);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Chỉ hỗ trợ file .csv, .xlsx, .xls');
    }
}

function parseSOCCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const aoa = lines.map(line => {
        const cols = [];
        let cur = '', inQ = false;
        for (let c of line) {
            if (c === '"') { inQ = !inQ; }
            else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ''; }
            else cur += c;
        }
        cols.push(cur.trim());
        return cols;
    });
    processSOCRows(aoa);
}

// Tìm dòng header thực sự — ưu tiên dòng có OC + M_sample, fallback dòng nhiều hits nhất
function findHeaderRowIndex(aoa) {
    let bestIdx = 0;
    let bestHits = 0;
    for (let i = 0; i < Math.min(aoa.length, 15); i++) {
        const row = aoa[i];
        if (!row || row.every(c => !c)) continue;
        const normalized = row.map(h => normalizeHeader(h + ''));
        const hasOC = normalized.some(n => n === 'oc' || n.includes('oc g') || n.includes('organic'));
        const hasMsample = normalized.some(n => n.includes('msample') || n.includes('m_sample') || n.includes('m sample'));
        // Dòng có cả OC lẫn M_sample → đây chắc chắn là header
        if (hasOC && hasMsample) return i;
        const hits = normalized.filter(n =>
            n.includes('date') || n.includes('farm') ||
            n === 'oc' || n.includes('msample') ||
            n.includes('period') || n.includes('layer')
        ).length;
        if (hits > bestHits) { bestHits = hits; bestIdx = i; }
    }
    return bestIdx;
}

// Xử lý số dùng dấu phẩy thập phân kiểu Việt Nam / châu Âu: "18,4" → 18.4
function parseLocaleFloat(v) {
    const s = (v + '').trim().replace(/\s/g, '');
    if (!s) return 0;
    if (s.includes('.') && s.includes(',')) return parseFloat(s.replace(/\./g, '').replace(',', '.')) || 0;
    if (s.includes(',')) return parseFloat(s.replace(',', '.')) || 0;
    return parseFloat(s) || 0;
}

function processSOCRows(aoa) {
    if (aoa.length < 2) { alert('File không có dữ liệu hợp lệ.'); return; }

    const headerIdx = findHeaderRowIndex(aoa);
    const headers = aoa[headerIdx];
    const map = mapHeader(headers);

    // Kiểm tra cột bắt buộc
    const missing = [];
    if (map.farm === undefined) missing.push('Nông hộ');
    if (map.oc === undefined) missing.push('OC (g/kg)');
    if (map.msample === undefined) missing.push('M_sample (g)');
    if (missing.length > 0) {
        const allCols = headers.filter(h => (h + '').trim()).join(', ');
        alert(`File thiếu cột bắt buộc: ${missing.join(', ')}\n\nCác cột tìm thấy (dòng ${headerIdx + 1}): ${allCols}\n\nHãy tải template để xem định dạng đúng.\n\nNếu file có tên cột khác (VD: "Hàm lượng OC", "Chất hữu cơ"...), hãy đổi tiêu đề cột theo mẫu.`);
        return;
    }

    socImportRows = [];
    const tbodyRows = [];

    for (let i = headerIdx + 1; i < aoa.length; i++) {
        const row = aoa[i];
        if (!row || row.every(c => !c)) continue;
        const parsed = parseRowToSOC(row, map);
        socImportRows.push(parsed);

        const statusBadge = parsed.ok
            ? '<span class="badge badge-green">OK</span>'
            : '<span class="badge badge-orange">Thiếu số liệu</span>';
        const socMassDisplay = parsed.socMassVM0042 != null
            ? `<strong style="color:var(--primary-light);">${parsed.socMassVM0042.toFixed(4)}</strong> tC/ha`
            : '<span style="color:var(--text-muted);">--</span>';

        tbodyRows.push(`<tr>
            <td>${parsed.date}</td>
            <td>${parsed.farm}</td>
            <td>${parsed.isBeginning ? '<span class="badge badge-blue">Đầu vụ</span>' : '<span class="badge badge-green">Cuối vụ</span>'}</td>
            <td>${parsed.layer}</td>
            <td>${parsed.ocGperKg || '--'}</td>
            <td>${parsed.mSample || '--'}</td>
            <td>${parsed.tubeDiameter}</td>
            <td>${parsed.numCores}</td>
            <td>${socMassDisplay}</td>
            <td>${parsed.lab || '--'}</td>
            <td>${statusBadge}</td>
        </tr>`);
    }

    const okCount = socImportRows.filter(r => r.ok).length;
    document.getElementById('soc-import-preview-body').innerHTML = tbodyRows.join('');
    document.getElementById('soc-import-summary').innerHTML =
        `<i class="fas fa-check-circle" style="color:var(--success);"></i> Đọc được <strong>${socImportRows.length}</strong> dòng — <strong>${okCount}</strong> dòng hợp lệ (có đủ OC và M_sample để tính M<sub>n,dl,SOC</sub>)`;
    document.getElementById('soc-import-preview').style.display = 'block';
    document.getElementById('soc-import-confirm-btn').style.display = 'inline-flex';
    document.getElementById('soc-import-confirm-label').textContent = `Nhập ${socImportRows.length} mẫu vào hệ thống`;
}

function confirmSOCImport() {
    if (socImportRows.length === 0) return;
    const now = new Date().toISOString();
    const newEntries = socImportRows.map(r => ({
        id: Date.now() + Math.random(),
        date: r.date,
        farm: r.farm,
        layer: r.layer,
        ocGperKg: r.ocGperKg,
        soc: r.soc,
        mSample: r.mSample,
        tubeDiameter: r.tubeDiameter,
        numCores: r.numCores,
        density: 0,
        socMassVM0042: r.socMassVM0042,
        carbonStock: 0,
        lab: r.lab,
        notes: r.notes,
        isBeginning: r.isBeginning,
        recorder: currentUser?.name || 'Import',
        createdAt: now
    }));

    socEntries.push(...newEntries);
    localStorage.setItem('mrv_soc', JSON.stringify(socEntries));
    closeSOCImportModal();
    loadSOCData();
    addAuditEntry('Import dữ liệu SOC từ file', `${newEntries.length} mẫu — ${[...new Set(newEntries.map(e => e.farm))].join(', ')}`, 'blue');
}

function downloadSOCTemplate() {
    if (typeof XLSX === 'undefined') { alert('Thư viện Excel chưa tải, vui lòng thử lại.'); return; }

    const data = [
        // Dòng tiêu đề
        ['Ngày lấy mẫu', 'Nông hộ', 'Thời kỳ (Kỳ đo)', 'Lớp đất dl (cm)', 'OC (g/kg)', 'M_sample (g)', 'D (mm)', 'N (lõi)', 'Ghi chú'],
        // Dữ liệu mẫu — Kỳ 1 (Đầu vụ)
        ['15/03/2023', 'Trần Minh Quang', 'Kỳ 1 (Đầu vụ)', '0-20',  18.4, 312.5, 70, 5, 'Lấy mẫu đại diện 5 điểm trên 1 ha'],
        ['15/03/2023', 'Trần Minh Quang', 'Kỳ 1 (Đầu vụ)', '20-40', 12.1, 298.7, 70, 5, 'Mẫu tổ hợp, sấy khô 105°C/24h'],
        ['15/03/2023', 'Trần Minh Quang', 'Kỳ 1 (Đầu vụ)', '40-60',  7.8, 285.3, 70, 5, 'Phương pháp Walkley-Black'],
        // Dữ liệu mẫu — Kỳ 2 (Cuối vụ)
        ['20/03/2024', 'Trần Minh Quang', 'Kỳ 2 (Cuối vụ)', '0-20',  21.6, 318.2, 70, 5, 'Lấy mẫu đại diện 5 điểm trên 1 ha'],
        ['20/03/2024', 'Trần Minh Quang', 'Kỳ 2 (Cuối vụ)', '20-40', 13.9, 301.4, 70, 5, 'Mẫu tổ hợp, sấy khô 105°C/24h'],
        ['20/03/2024', 'Trần Minh Quang', 'Kỳ 2 (Cuối vụ)', '40-60',  8.5, 289.1, 70, 5, 'Phương pháp Walkley-Black'],
        // Dòng trống + hướng dẫn
        [],
        ['--- HƯỚNG DẪN ---', '', '', '', '', '', '', '', ''],
        ['Ngày lấy mẫu', 'Định dạng DD/MM/YYYY hoặc YYYY-MM-DD'],
        ['Thời kỳ (Kỳ đo)', 'Kỳ 1 (Đầu vụ) = mẫu đầu kỳ  |  Kỳ 2 (Cuối vụ) = mẫu cuối kỳ'],
        ['Lớp đất dl (cm)', 'VD: 0-20, 20-40, 40-60'],
        ['OC (g/kg)', 'Hàm lượng carbon hữu cơ từ kết quả phòng lab (g/kg)'],
        ['M_sample (g)', 'Khối lượng mẫu đất trong ống lấy mẫu (gram)'],
        ['D (mm)', 'Đường kính trong ống lấy mẫu (mm) — thường 52 hoặc 70'],
        ['N (lõi)', 'Số lõi đất lấy mẫu trên mỗi điểm'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Độ rộng cột
    ws['!cols'] = [
        { wch: 16 }, // Ngày
        { wch: 22 }, // Nông hộ
        { wch: 20 }, // Thời kỳ
        { wch: 16 }, // Lớp đất
        { wch: 12 }, // OC
        { wch: 14 }, // M_sample
        { wch: 10 }, // D
        { wch: 10 }, // N
        { wch: 45 }, // Ghi chú
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DuLieu_SOC_VM0042');
    XLSX.writeFile(wb, 'SOC_DuLieuXetNghiemDat_Template.xlsx');
}
