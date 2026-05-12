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
            <p class="page-desc">Đo đạc diện tích vùng trồng bằng Drone & LiDAR</p>
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
                    <thead><tr><th>Ngày bay</th><th>Nông hộ</th><th>Diện tích (ha)</th><th>File</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                        <tr><td colspan="5"><div class="empty-state"><i class="fas fa-helicopter"></i><p>Chưa có dữ liệu bay khảo sát</p></div></td></tr>
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
        <!-- Modal -->
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
// M_sample: gam, D: mm, N: số lõi, OC: g/kg → kết quả: tC/ha
function calculateSOCMassVM0042(mSample, D, N, ocGperKg) {
    if (!mSample || !D || !N || !ocGperKg) return null;
    const tubeArea = Math.PI * Math.pow(parseFloat(D) / 2, 2); // mm²
    const result = (parseFloat(mSample) / (tubeArea * parseFloat(N))) * 10000 * parseFloat(ocGperKg);
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
