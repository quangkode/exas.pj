/* ========== FARM DIARY (Nhật ký canh tác) ========== */
function renderFarmDiary(container) {
    container.innerHTML = `
        <div class="page-header">
            <div class="page-header-text">
                <h1 class="page-title">Nhật ký canh tác</h1>
                <p class="page-desc">Ghi nhận hoạt động canh tác — nguồn dữ liệu cho tính toán phát thải CO₂/N₂O</p>
            </div>
            <div class="page-actions">
                <button class="btn btn-secondary" onclick="downloadDiaryTemplate()" style="border-color:var(--text-muted);color:var(--text-muted);">
                    <i class="fas fa-download"></i> Template
                </button>
                <button class="btn btn-secondary" onclick="openDiaryImportModal()" style="border-color:var(--info);color:var(--info);">
                    <i class="fas fa-file-upload"></i> Nhập từ file
                </button>
                <button class="btn btn-primary" onclick="openDiaryModal()">
                    <i class="fas fa-plus"></i> Thêm nhật ký
                </button>
            </div>
        </div>
        <div class="filter-bar">
            <div class="search-input">
                <i class="fas fa-search"></i>
                <input type="text" id="diary-search" placeholder="Tìm theo nông hộ, loại phân..." oninput="loadDiaryData()">
            </div>
            <select id="diary-filter-farm" onchange="loadDiaryData()">
                <option value="">Tất cả nông hộ</option>
            </select>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table" style="width:max-content;min-width:900px;">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Nông hộ</th>
                            <th>Loại cây</th>
                            <th>Phân bón / Loại N</th>
                            <th>Lượng phân (kg)</th>
                            <th>Khối lượng N (kg N)</th>
                            <th>Vôi (tấn)</th>
                            <th>Dolomite (tấn)</th>
                            <th>Loại NL / Lượng (lít)</th>
                            <th>Diện tích (ha)</th>
                            <th>Ghi chú</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="diary-table-body">
                        <tr><td colspan="12"><div class="empty-state"><i class="fas fa-book-open"></i><p>Chưa có nhật ký canh tác</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal-overlay" id="diary-modal">
            <div class="modal" style="max-width:680px;">
                <div class="modal-header">
                    <h3><i class="fas fa-book" style="color:var(--primary-light);margin-right:8px;"></i> Thêm nhật ký canh tác</h3>
                    <button class="modal-close" onclick="closeDiaryModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <!-- File upload shortcut -->
                    <div style="background:var(--bg-secondary);border-radius:8px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:10px;cursor:pointer;border:1px dashed var(--border);"
                         onclick="document.getElementById('diary-modal-file').click()">
                        <i class="fas fa-file-excel" style="color:#1d7a45;font-size:18px;"></i>
                        <div style="flex:1;">
                            <div style="font-size:13px;font-weight:600;">Đọc từ file Excel / CSV</div>
                            <div style="font-size:11px;color:var(--text-muted);">1 dòng → tự điền form | nhiều dòng → nhập thẳng tất cả</div>
                        </div>
                        <span style="font-size:11px;color:var(--info);font-weight:600;">Chọn file</span>
                        <input type="file" id="diary-modal-file" accept=".csv,.xlsx,.xls" style="display:none"
                               onchange="loadDiaryFromFile(this.files[0]);this.value=''">
                    </div>
                    <form id="diary-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Ngày ghi nhận</label>
                                <input type="date" id="diary-date" required>
                            </div>
                            <div class="form-group">
                                <label>Nông hộ</label>
                                <select id="diary-farm" required>
                                    <option value="">Chọn nông hộ</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Loại cây trồng</label>
                                <input type="text" id="diary-crop" placeholder="VD: Dừa xiêm xanh">
                            </div>
                            <div class="form-group">
                                <label>Diện tích canh tác A<sub>i</sub> (ha)</label>
                                <input type="number" id="diary-area" step="0.01" placeholder="0.00">
                            </div>
                        </div>

                        <!-- PHÂN BÓN -->
                        <div style="border-left:3px solid var(--warning);padding-left:12px;margin-bottom:16px;padding-top:4px;">
                            <div style="font-size:12px;font-weight:600;color:var(--warning);margin-bottom:10px;">
                                <i class="fas fa-seedling"></i> Phân bón — nguồn N₂O
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Loại phân bón</label>
                                    <input type="text" id="diary-fertilizer-type" placeholder="VD: Urê, NPK, phân hữu cơ...">
                                </div>
                                <div class="form-group">
                                    <label>Phân loại Nitơ (VM0042)</label>
                                    <select id="diary-n-category">
                                        <option value="">-- Chọn loại --</option>
                                        <option value="FSN">FSN — Phân tổng hợp (Synthetic N)</option>
                                        <option value="FON">FON — Phân hữu cơ (Organic N)</option>
                                        <option value="none">Không chứa N</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Lượng phân bón (kg)</label>
                                    <input type="number" id="diary-fertilizer-amount" step="0.1" placeholder="0" oninput="calcDiaryNKg();">
                                </div>
                                <div class="form-group">
                                    <label>Hàm lượng N (%) — từ nhãn bao bì</label>
                                    <input type="number" id="diary-n-percent" step="0.1" placeholder="VD: Urê≈46, NPK≈14" oninput="calcDiaryNKg();">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label style="color:var(--warning);">Khối lượng N (kg N) — tự động</label>
                                    <input type="text" id="diary-n-kg" readonly placeholder="= lượng phân × N% / 100" style="font-weight:bold;border-color:var(--warning);">
                                </div>
                            </div>
                        </div>

                        <!-- VÔI / DOLOMITE -->
                        <div style="border-left:3px solid var(--info);padding-left:12px;margin-bottom:16px;padding-top:4px;">
                            <div style="font-size:12px;font-weight:600;color:var(--info);margin-bottom:10px;">
                                <i class="fas fa-mountain"></i> Vôi / Dolomite — nguồn CO₂ cải tạo đất
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Vôi — Limestone (tấn)</label>
                                    <input type="number" id="diary-limestone" step="0.001" placeholder="0.000">
                                </div>
                                <div class="form-group">
                                    <label>Dolomite (tấn)</label>
                                    <input type="number" id="diary-dolomite" step="0.001" placeholder="0.000">
                                </div>
                            </div>
                        </div>

                        <!-- NHIÊN LIỆU -->
                        <div style="border-left:3px solid var(--danger);padding-left:12px;margin-bottom:16px;padding-top:4px;">
                            <div style="font-size:12px;font-weight:600;color:var(--danger);margin-bottom:10px;">
                                <i class="fas fa-gas-pump"></i> Nhiên liệu hóa thạch — nguồn CO₂ đốt cháy
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Loại nhiên liệu</label>
                                    <select id="diary-fuel-type">
                                        <option value="">-- Chọn loại --</option>
                                        <option value="diesel">Diesel (Dầu diesel)</option>
                                        <option value="petrol">Xăng (Gasoline)</option>
                                        <option value="lpg">LPG (Khí hoá lỏng)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Nhiên liệu tiêu thụ (lít)</label>
                                    <input type="number" id="diary-fuel" step="0.1" placeholder="0">
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Lượng nước tưới (m³)</label>
                                <input type="number" id="diary-water" step="0.1" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label>Quản lý chất thải</label>
                                <select id="diary-waste">
                                    <option value="">Chọn phương pháp</option>
                                    <option value="composting">Ủ phân compost</option>
                                    <option value="burning">Đốt</option>
                                    <option value="mulching">Phủ mặt đất</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Ghi chú</label>
                            <textarea id="diary-notes" placeholder="Ghi chú thêm..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeDiaryModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveDiary()"><i class="fas fa-save"></i> Lưu nhật ký</button>
                </div>
            </div>
        </div>

        <!-- Import Modal -->
        <div class="modal-overlay" id="diary-import-modal">
            <div class="modal" style="max-width:820px;">
                <div class="modal-header">
                    <h3><i class="fas fa-file-upload" style="color:var(--info);margin-right:8px;"></i> Nhập nhật ký từ file</h3>
                    <button class="modal-close" onclick="closeDiaryImportModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div style="background:var(--bg-secondary);border-radius:8px;padding:12px;margin-bottom:16px;font-size:12px;">
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text-secondary);"><i class="fas fa-info-circle"></i> Cột hỗ trợ (CSV / Excel .xlsx) — nhận diện tự động theo tiêu đề</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Ngày</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Mã NH</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Tên NH</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Loại cây</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Diện tích (ha)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Loại phân</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Loại N (FSN/FON)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Lượng phân (kg)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Hàm lượng N (%)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Vôi (tấn)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Dolomite (tấn)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Loại nhiên liệu</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Nhiên liệu (lít)</span>
                            <span style="background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">Ghi chú</span>
                        </div>
                    </div>
                    <div id="diary-drop-zone" style="border:2px dashed var(--info);border-radius:10px;padding:32px;text-align:center;cursor:pointer;transition:background .2s;"
                         onclick="document.getElementById('diary-file-input').click()"
                         ondragover="event.preventDefault();this.style.background='var(--bg-secondary)'"
                         ondragleave="this.style.background=''"
                         ondrop="event.preventDefault();this.style.background='';handleDiaryFileUpload(event.dataTransfer.files[0])">
                        <i class="fas fa-cloud-upload-alt" style="font-size:32px;color:var(--info);margin-bottom:8px;display:block;"></i>
                        <p style="margin:0;color:var(--text-secondary);">Kéo thả file CSV / Excel vào đây hoặc <strong style="color:var(--info);">chọn file</strong></p>
                        <p style="margin:4px 0 0;font-size:11px;color:var(--text-muted);">Hỗ trợ .csv, .xlsx, .xls</p>
                        <input type="file" id="diary-file-input" accept=".csv,.xlsx,.xls" style="display:none" onchange="handleDiaryFileUpload(this.files[0])">
                    </div>
                    <div id="diary-import-preview" style="margin-top:16px;display:none;">
                        <div style="font-weight:600;margin-bottom:8px;color:var(--text-secondary);font-size:13px;">
                            <i class="fas fa-table"></i> Xem trước — <span id="diary-import-count">0</span> dòng hợp lệ
                        </div>
                        <div class="table-wrapper" style="max-height:280px;overflow-y:auto;">
                            <table class="data-table" style="font-size:12px;">
                                <thead><tr>
                                    <th>Ngày</th><th>Nông hộ</th><th>Loại cây</th>
                                    <th>Loại phân / N</th><th>Lượng (kg)</th><th>N (kg)</th>
                                    <th>Vôi</th><th>Dolomite</th><th>Nhiên liệu</th><th>Ha</th><th>Ghi chú</th>
                                </tr></thead>
                                <tbody id="diary-import-preview-body"></tbody>
                            </table>
                        </div>
                        <div id="diary-import-errors" style="margin-top:8px;font-size:12px;color:var(--danger);"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="downloadDiaryTemplate()"><i class="fas fa-download"></i> Template</button>
                    <div style="flex:1;"></div>
                    <button class="btn btn-secondary" onclick="closeDiaryImportModal()">Hủy</button>
                    <button class="btn btn-primary" id="diary-import-confirm-btn" onclick="confirmDiaryImport()" style="display:none;"><i class="fas fa-check"></i> Nhập dữ liệu</button>
                </div>
            </div>
        </div>
    `;
    const dateInput = document.getElementById('diary-date');
    if (dateInput) dateInput.valueAsDate = new Date();
    loadDiaryData();
}

// Seed 5 lần canh tác cho Trần Minh Quang — kỳ đo 20/03/2023 – 20/04/2024
// NPK 16-8-16: 134 kg/ha/lần × 4.6 ha = 616.4 kg | Vôi: 0.5 t/ha/năm chia 2 lần
const DIARY_SEED_VERSION = 'v3';
function initDefaultDiaries() {
    if (localStorage.getItem('mrv_diaries_seed') === DIARY_SEED_VERSION) return;
    // version mới → xóa seed cũ, nạp lại (chỉ xóa nếu toàn bộ là seed data)
    const existing = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const isSeedOnly = existing.every(e => String(e.id).startsWith('17000000020'));
    if (existing.length === 0 || isSeedOnly) {
        localStorage.removeItem('mrv_diaries');
    } else {
        localStorage.setItem('mrv_diaries_seed', DIARY_SEED_VERSION);
        return; // có data thật → không ghi đè
    }
    const area = 4.6;
    const fertAmt = parseFloat((134 * area).toFixed(1));   // 616.4 kg NPK/lần
    const nPct = 16;
    const nKg  = parseFloat((fertAmt * nPct / 100).toFixed(3)); // 98.624 kg N
    // Vôi tổng 0.5 t/ha/năm → 2.3 t/năm, bón 2 lần (lần 1 + lần 3)
    // Dolomite ~0.25 t/ha/năm → 1.15 t/năm, bón 1 lần (lần 2)
    // Diesel: bơm nước + phun thuốc ~18-24 lít/lần tuỳ mùa
    const rounds = [
        { date: '2023-04-05', limestone: 1.15, dolomite: 0,    fuelType: 'diesel', fuel: 20, notes: 'Bón lần 1 — đầu mùa khô, bón vôi chỉnh pH, kích thích ra hoa' },
        { date: '2023-06-18', limestone: 0,    dolomite: 1.15, fuelType: 'diesel', fuel: 18, notes: 'Bón lần 2 — đầu mùa mưa, bổ sung Mg-Ca (dolomite), hỗ trợ đậu trái' },
        { date: '2023-08-30', limestone: 1.15, dolomite: 0,    fuelType: 'diesel', fuel: 24, notes: 'Bón lần 3 — giữa mùa mưa, bón vôi lần 2, nuôi trái' },
        { date: '2023-11-12', limestone: 0,    dolomite: 0,    fuelType: 'diesel', fuel: 20, notes: 'Bón lần 4 — cuối mùa mưa, chuẩn bị ra hoa vụ mới' },
        { date: '2024-02-20', limestone: 0,    dolomite: 0,    fuelType: 'diesel', fuel: 16, notes: 'Bón lần 5 — đầu năm, kích thích sinh trưởng (gần cuối kỳ đo T2)' },
    ];
    const defaults = rounds.map((r, i) => ({
        id: 1700000002000 + i,
        date: r.date,
        farm: 'Trần Minh Quang',
        crop: 'Dừa Lùn (PB121)',
        area,
        fertilizerType: 'Phân NPK (16-8-16)',
        nCategory: 'FSN',
        fertilizerAmount: fertAmt,
        nPercent: nPct,
        nKg,
        limestone: r.limestone,
        dolomite:  r.dolomite,
        fuelType:  r.fuelType,
        fuel:      r.fuel,
        water: 0,
        waste: '',
        notes: r.notes,
        recorder: 'Admin',
        createdAt: r.date + 'T08:00:00.000Z'
    }));
    localStorage.setItem('mrv_diaries', JSON.stringify(defaults));
    localStorage.setItem('mrv_diaries_seed', DIARY_SEED_VERSION);
}

function forceLoadSampleDiaries() {
    localStorage.removeItem('mrv_diaries');
    initDefaultDiaries();
    diaryEntries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    loadDiaryData();
}

initDefaultDiaries();
let diaryEntries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');

function calcDiaryNKg() {
    const amount = parseFloat(document.getElementById('diary-fertilizer-amount')?.value) || 0;
    const nPct = parseFloat(document.getElementById('diary-n-percent')?.value) || 0;
    const nKg = (amount * nPct / 100).toFixed(3);
    const el = document.getElementById('diary-n-kg');
    if (el) el.value = nKg > 0 ? nKg + ' kg N' : '';
}

function openDiaryModal() {
    const farmSel = document.getElementById('diary-farm');
    if (farmSel) {
        const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
        farmSel.innerHTML = '<option value="">Chọn nông hộ</option>' +
            farms.map(f => `<option value="${f.name}">[${f.code}] ${f.name}</option>`).join('');
    }
    document.getElementById('diary-modal').classList.add('show');
}

function closeDiaryModal() {
    document.getElementById('diary-modal').classList.remove('show');
    document.getElementById('diary-form')?.reset();
    const nKgEl = document.getElementById('diary-n-kg');
    if (nKgEl) nKgEl.value = '';
}

function saveDiary() {
    const fertAmount = parseFloat(document.getElementById('diary-fertilizer-amount').value) || 0;
    const nPct = parseFloat(document.getElementById('diary-n-percent').value) || 0;
    const nKg = parseFloat((fertAmount * nPct / 100).toFixed(3));

    const farmName = document.getElementById('diary-farm').value || 'Chưa chọn';
    const farmsData = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const selectedFarm = farmsData.find(f => f.name === farmName);

    const entry = {
        id: Date.now(),
        date: document.getElementById('diary-date').value,
        farm: farmName,
        farmCode: selectedFarm ? selectedFarm.code : '',
        crop: document.getElementById('diary-crop').value,
        area: parseFloat(document.getElementById('diary-area').value) || 0,
        // Phân bón (N₂O source)
        fertilizerType: document.getElementById('diary-fertilizer-type').value,
        nCategory: document.getElementById('diary-n-category').value,
        fertilizerAmount: fertAmount,
        nPercent: nPct,
        nKg,
        // Vôi/Dolomite (CO₂ liming source)
        limestone: parseFloat(document.getElementById('diary-limestone').value) || 0,
        dolomite: parseFloat(document.getElementById('diary-dolomite').value) || 0,
        // Nhiên liệu (CO₂ fossil fuel source)
        fuelType: document.getElementById('diary-fuel-type').value,
        fuel: parseFloat(document.getElementById('diary-fuel').value) || 0,
        // Khác
        water: parseFloat(document.getElementById('diary-water').value) || 0,
        waste: document.getElementById('diary-waste').value,
        notes: document.getElementById('diary-notes').value,
        recorder: currentUser.name,
        createdAt: new Date().toISOString()
    };
    diaryEntries.push(entry);
    localStorage.setItem('mrv_diaries', JSON.stringify(diaryEntries));
    closeDiaryModal();
    loadDiaryData();
    addAuditEntry(
        'Thêm nhật ký canh tác',
        `NH: ${entry.farm} | NL: ${entry.fuelType || '--'} ${entry.fuel}L | Vôi: ${entry.limestone}t | Dolomite: ${entry.dolomite}t | N: ${entry.nKg} kg (${entry.nCategory || '--'})`,
        'green'
    );
}

function deleteDiary(id) {
    if (!confirm('Xác nhận xóa nhật ký này?')) return;
    diaryEntries = diaryEntries.filter(e => e.id !== id);
    localStorage.setItem('mrv_diaries', JSON.stringify(diaryEntries));
    loadDiaryData();
    addAuditEntry('Xóa nhật ký canh tác', `ID: ${id}`, 'red');
}

// ===== DIARY IMPORT =====
let _diaryImportRows = [];

function openDiaryImportModal() {
    _diaryImportRows = [];
    const preview = document.getElementById('diary-import-preview');
    if (preview) preview.style.display = 'none';
    const btn = document.getElementById('diary-import-confirm-btn');
    if (btn) btn.style.display = 'none';
    const fi = document.getElementById('diary-file-input');
    if (fi) fi.value = '';
    document.getElementById('diary-import-modal').classList.add('show');
}

function closeDiaryImportModal() {
    document.getElementById('diary-import-modal').classList.remove('show');
}

function downloadDiaryTemplate() {
    const rows = [
        ['Ngay', 'Ma NH', 'Ten NH', 'Loai cay', 'Dien tich (ha)', 'Loai phan', 'Loai N (FSN/FON)', 'Luong phan (kg)', 'Ham luong N (%)', 'Voi (tan)', 'Dolomite (tan)', 'Loai nhien lieu', 'Nhien lieu (lit)', 'Ghi chu'],
        ['2024-03-15', 'NH001', 'Tran Minh Quang', 'Dua Lun PB121', '4.6', 'Phan NPK 16-8-16', 'FSN', '616.4', '16', '1.15', '0', 'diesel', '20', 'Bon lan 1 dau mua'],
        ['2024-06-20', 'NH001', 'Tran Minh Quang', 'Dua Lun PB121', '4.6', 'Phan huu co', 'FON', '200', '3', '0', '1.15', 'diesel', '18', 'Bon lan 2 mua mua'],
    ];
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'template_nhat_ky_canh_tac.csv';
    a.click();
}

function normalizeDiaryHeader(h) {
    return String(h).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/[^a-z0-9]/g, ' ').trim().replace(/\s+/g, ' ');
}

function mapDiaryHeader(headers) {
    const map = {};
    headers.forEach((h, i) => {
        const n = normalizeDiaryHeader(h);
        if (n.match(/^ngay/) || n === 'date') { map.date = i; return; }
        if ((n.includes('ma') && (n.includes('nh') || n.includes('nong'))) || n === 'ma nh' || n === 'farm code') { map.code = i; return; }
        if ((n.includes('ten') || n.startsWith('nong ho')) && !n.includes('loai')) { map.name = i; return; }
        if (n.includes('loai cay') || n.includes('cay trong') || n === 'crop') { map.crop = i; return; }
        if (n.includes('dien tich') || n === 'ha' || n === 'area') { map.area = i; return; }
        if (n.includes('loai phan') || n.includes('phan bon') || n === 'fertilizer') { map.fertilizerType = i; return; }
        if (n.includes('loai n') || n.includes('n category') || n === 'fsn fon') { map.nCategory = i; return; }
        if (n.includes('luong phan') || n.includes('fert amount')) { map.fertilizerAmount = i; return; }
        if (n.includes('ham luong n') || n.includes('n %') || n === 'n percent' || n.match(/^n\b.*phan tram/)) { map.nPercent = i; return; }
        if (n.includes('voi') || n.includes('limestone')) { map.limestone = i; return; }
        if (n.includes('dolomite')) { map.dolomite = i; return; }
        if (n.includes('loai nhien lieu') || n.includes('loai nl') || n.includes('loai nang luong') || n === 'fuel type') { map.fuelType = i; return; }
        if ((n.includes('nhien lieu') || n.includes('so luong') || n === 'fuel') && !n.includes('loai')) { map.fuel = i; return; }
        if (n.includes('khoi luong n') || n.includes('kg n')) { map.nKgDirect = i; return; }
        if (n.includes('ghi chu') || n.includes('note') || n.includes('comment')) { map.notes = i; return; }
    });
    return map;
}

function resolveFarmFromDiary(s, farms) {
    if (!s) return null;
    const str = String(s).trim();
    if (!str) return null;
    let f = farms.find(x => x.code && x.code.trim().toUpperCase() === str.toUpperCase());
    if (f) return f;
    f = farms.find(x => x.name && x.name.trim().toLowerCase() === str.toLowerCase());
    if (f) return f;
    f = farms.find(x => x.code && str.toUpperCase().includes(x.code.toUpperCase()));
    return f || null;
}

function parseRowToDiary(row, map, farms, defaultFarm) {
    const pf = k => map[k] !== undefined ? String(row[map[k]] ?? '').trim() : '';
    const pn = k => parseFloat(String(row[map[k]] ?? '').replace(',', '.')) || 0;

    const dateRaw = pf('date');
    if (!dateRaw) return null;

    // Resolve farm by code then name from row, fallback to defaultFarm extracted from file header
    const resolved = resolveFarmFromDiary(pf('code'), farms) || resolveFarmFromDiary(pf('name'), farms) || defaultFarm;
    const farmName = resolved ? resolved.name : (pf('name') || pf('code') || 'Chưa xác định');

    // Parse date: YYYY-MM-DD, DD/MM/YYYY, or Excel serial
    let date = dateRaw;
    if (dateRaw.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
        const p = dateRaw.split('/');
        date = `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
    } else if (map.date !== undefined && typeof row[map.date] === 'number' && row[map.date] > 10000) {
        const d = new Date((row[map.date] - 25569) * 86400000);
        date = d.toISOString().slice(0, 10);
    }

    const fertAmount = pn('fertilizerAmount');
    const nPct = pn('nPercent');
    const nKg = map.nKgDirect !== undefined ? pn('nKgDirect') : parseFloat((fertAmount * nPct / 100).toFixed(3));

    const nCatRaw = pf('nCategory').toUpperCase();
    const nCategory = nCatRaw.includes('FSN') ? 'FSN' : nCatRaw.includes('FON') ? 'FON' : nCatRaw.includes('NONE') || nCatRaw.includes('KHONG') ? 'none' : '';

    const fuelRaw = pf('fuelType').toLowerCase();
    const fuelType = fuelRaw.includes('diesel') ? 'diesel'
        : (fuelRaw.includes('xang') || fuelRaw.includes('petrol') || fuelRaw.includes('gasoline')) ? 'petrol'
        : fuelRaw.includes('lpg') ? 'lpg' : '';

    const area = pn('area') || (resolved && resolved.area ? resolved.area : 0);

    return {
        date, farm: farmName, farmCode: resolved ? resolved.code : '', crop: pf('crop'), area,
        fertilizerType: pf('fertilizerType'),
        nCategory, fertilizerAmount: fertAmount, nPercent: nPct, nKg,
        limestone: pn('limestone'), dolomite: pn('dolomite'),
        fuelType, fuel: pn('fuel'),
        water: 0, waste: '',
        notes: pf('notes'),
        recorder: currentUser.name,
        createdAt: new Date().toISOString()
    };
}

function parseDiaryCSV(text) {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n').map(line => {
        const cells = [];
        let cur = '', inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
                else inQuote = !inQuote;
            } else if (ch === ',' && !inQuote) {
                cells.push(cur.trim()); cur = '';
            } else { cur += ch; }
        }
        cells.push(cur.trim());
        return cells;
    });
}

function processDiaryRows(aoa) {
    if (!aoa || aoa.length < 2) { alert('File không có dữ liệu hoặc thiếu dòng tiêu đề.'); return; }
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    let headerIdx = 0;
    for (let i = 0; i < Math.min(10, aoa.length); i++) {
        const m = mapDiaryHeader(aoa[i]);
        if (m.date !== undefined) { headerIdx = i; break; }
    }
    const map = mapDiaryHeader(aoa[headerIdx]);

    // Extract farm from title rows (rows before the header)
    let defaultFarm = null;
    if (headerIdx > 0) {
        const titleText = aoa.slice(0, headerIdx).map(r => (r || []).join(' ')).join(' ');
        // Try to match known farm codes first
        for (const f of farms) {
            if (f.code && titleText.toUpperCase().includes(f.code.toUpperCase())) {
                defaultFarm = f; break;
            }
        }
        // Fallback: try to match farm names
        if (!defaultFarm) {
            for (const f of farms) {
                if (f.name && titleText.toLowerCase().includes(f.name.toLowerCase())) {
                    defaultFarm = f; break;
                }
            }
        }
    }

    _diaryImportRows = [];
    const errors = [];
    for (let i = headerIdx + 1; i < aoa.length; i++) {
        const row = aoa[i];
        if (!row || row.every(c => !c)) continue;
        try {
            const entry = parseRowToDiary(row, map, farms, defaultFarm);
            if (entry) _diaryImportRows.push(entry);
            else errors.push(`Dòng ${i + 1}: Thiếu ngày`);
        } catch (err) {
            errors.push(`Dòng ${i + 1}: ${err.message}`);
        }
    }

    const countEl = document.getElementById('diary-import-count');
    const tbody = document.getElementById('diary-import-preview-body');
    const errEl = document.getElementById('diary-import-errors');
    const preview = document.getElementById('diary-import-preview');
    const btn = document.getElementById('diary-import-confirm-btn');

    if (countEl) countEl.textContent = _diaryImportRows.length;
    if (tbody) tbody.innerHTML = _diaryImportRows.map(e => {
        const nBadge = e.nCategory === 'FSN' ? '<span class="badge badge-orange">FSN</span>'
            : e.nCategory === 'FON' ? '<span class="badge badge-green">FON</span>' : '';
        const fl = { diesel: 'Diesel', petrol: 'Xăng', lpg: 'LPG' }[e.fuelType] || '--';
        return `<tr>
            <td>${e.date}</td><td>${e.farm}</td><td>${e.crop || '--'}</td>
            <td>${e.fertilizerType || '--'} ${nBadge}</td>
            <td>${e.fertilizerAmount > 0 ? e.fertilizerAmount : '--'}</td>
            <td>${e.nKg > 0 ? e.nKg + ' kg' : '--'}</td>
            <td>${e.limestone > 0 ? e.limestone : '--'}</td>
            <td>${e.dolomite > 0 ? e.dolomite : '--'}</td>
            <td>${e.fuel > 0 ? fl + ' ' + e.fuel + 'L' : '--'}</td>
            <td>${e.area > 0 ? e.area : '--'}</td>
            <td>${e.notes || '--'}</td>
        </tr>`;
    }).join('');
    if (errEl) errEl.innerHTML = errors.length
        ? `<i class="fas fa-exclamation-triangle"></i> ${errors.length} dòng lỗi: ${errors.slice(0, 3).join(' | ')}${errors.length > 3 ? '...' : ''}`
        : '';
    if (preview) preview.style.display = 'block';
    if (btn) btn.style.display = _diaryImportRows.length > 0 ? '' : 'none';
}

function handleDiaryFileUpload(file) {
    if (!file) return;
    const name = file.name.toLowerCase();
    const reader = new FileReader();
    if (name.endsWith('.csv')) {
        reader.onload = e => processDiaryRows(parseDiaryCSV(e.target.result));
        reader.readAsText(file, 'UTF-8');
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        reader.onload = e => {
            if (typeof XLSX === 'undefined') { alert('Thư viện XLSX chưa được tải. Vui lòng dùng file CSV.'); return; }
            const wb = XLSX.read(e.target.result, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            processDiaryRows(XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }));
        };
        reader.readAsBinaryString(file);
    } else {
        alert('Chỉ hỗ trợ file CSV hoặc Excel (.xlsx, .xls)');
    }
}

function confirmDiaryImport() {
    if (!_diaryImportRows.length) return;
    const existing = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const ts = Date.now();
    const newRows = _diaryImportRows.map((r, i) => ({ ...r, id: ts + i }));
    const merged = [...existing, ...newRows];
    localStorage.setItem('mrv_diaries', JSON.stringify(merged));
    diaryEntries = merged;
    closeDiaryImportModal();
    loadDiaryData();
    addAuditEntry(
        'Nhập nhật ký từ file',
        `${newRows.length} dòng — nông hộ: ${[...new Set(newRows.map(r => r.farm))].join(', ')}`,
        'blue'
    );
    _diaryImportRows = [];
}

function loadDiaryFromFile(file) {
    if (!file) return;
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const process = aoa => {
        if (!aoa || aoa.length < 2) { alert('File trống hoặc thiếu tiêu đề.'); return; }
        const map = mapDiaryHeader(aoa[0]);
        const dataRows = aoa.slice(1).filter(r => r && r.some(c => c));
        if (dataRows.length === 0) { alert('Không có dữ liệu trong file.'); return; }

        if (dataRows.length === 1) {
            // Auto-fill form
            const entry = parseRowToDiary(dataRows[0], map, farms);
            if (!entry) { alert('Không đọc được dữ liệu từ dòng đầu tiên.'); return; }
            const farmSel = document.getElementById('diary-farm');
            if (farmSel) {
                farmSel.innerHTML = '<option value="">Chọn nông hộ</option>' +
                    farms.map(f => `<option value="${f.name}">[${f.code}] ${f.name}</option>`).join('');
                farmSel.value = entry.farm;
                if (!farmSel.value) {
                    const opt = document.createElement('option');
                    opt.value = entry.farm; opt.textContent = entry.farm; opt.selected = true;
                    farmSel.appendChild(opt);
                }
            }
            const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined && val !== null) el.value = val; };
            set('diary-date', entry.date);
            set('diary-crop', entry.crop);
            set('diary-area', entry.area || '');
            set('diary-fertilizer-type', entry.fertilizerType);
            set('diary-n-category', entry.nCategory);
            set('diary-fertilizer-amount', entry.fertilizerAmount || '');
            set('diary-n-percent', entry.nPercent || '');
            set('diary-limestone', entry.limestone || '');
            set('diary-dolomite', entry.dolomite || '');
            set('diary-fuel-type', entry.fuelType);
            set('diary-fuel', entry.fuel || '');
            set('diary-notes', entry.notes);
            calcDiaryNKg();
        } else {
            // Multiple rows → bulk import directly
            if (!confirm(`File có ${dataRows.length} dòng. Nhập tất cả vào nhật ký?`)) return;
            const ts = Date.now();
            const newRows = dataRows.map((r, i) => {
                const e = parseRowToDiary(r, map, farms);
                return e ? { ...e, id: ts + i } : null;
            }).filter(Boolean);
            if (!newRows.length) { alert('Không có dòng hợp lệ để nhập.'); return; }
            const existing = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
            const merged = [...existing, ...newRows];
            localStorage.setItem('mrv_diaries', JSON.stringify(merged));
            diaryEntries = merged;
            closeDiaryModal();
            loadDiaryData();
            addAuditEntry('Nhập nhật ký từ file', `${newRows.length} dòng — ${[...new Set(newRows.map(r => r.farm))].join(', ')}`, 'blue');
            alert(`Đã nhập ${newRows.length} dòng thành công.`);
        }
    };
    const name = file.name.toLowerCase();
    const reader = new FileReader();
    if (name.endsWith('.csv')) {
        reader.onload = e => process(parseDiaryCSV(e.target.result));
        reader.readAsText(file, 'UTF-8');
    } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        reader.onload = e => {
            if (typeof XLSX === 'undefined') { alert('Thư viện XLSX chưa tải. Dùng file CSV.'); return; }
            const wb = XLSX.read(e.target.result, { type: 'binary' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            process(XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }));
        };
        reader.readAsBinaryString(file);
    } else {
        alert('Chỉ hỗ trợ .csv, .xlsx, .xls');
    }
}

function loadDiaryData() {
    // Populate farm filter dropdown
    const farmFilter = document.getElementById('diary-filter-farm');
    if (farmFilter) {
        const farmsReg = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
        const farmNames = [...new Set(diaryEntries.map(e => e.farm))].sort();
        const cur = farmFilter.value;
        farmFilter.innerHTML = '<option value="">Tất cả nông hộ</option>' +
            farmNames.map(f => {
                const fo = farmsReg.find(x => x.name === f);
                const label = fo ? `[${fo.code}] ${f}` : f;
                return `<option value="${f}" ${f === cur ? 'selected' : ''}>${label}</option>`;
            }).join('');
    }

    const tbody = document.getElementById('diary-table-body');
    if (!tbody) return;

    if (diaryEntries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state">
            <i class="fas fa-book-open"></i>
            <p>Chưa có nhật ký canh tác</p>
            <button class="btn btn-secondary" style="margin-top:12px;" onclick="forceLoadSampleDiaries()">
                <i class="fas fa-database"></i> Nạp dữ liệu mẫu
            </button>
        </div></td></tr>`;
        return;
    }

    const search = (document.getElementById('diary-search')?.value || '').toLowerCase();
    const filterFarm = document.getElementById('diary-filter-farm')?.value || '';
    let entries = diaryEntries.slice().sort((a, b) => b.date.localeCompare(a.date));
    if (filterFarm) entries = entries.filter(e => e.farm === filterFarm);
    if (search) entries = entries.filter(e =>
        (e.farm || '').toLowerCase().includes(search) ||
        (e.fertilizerType || '').toLowerCase().includes(search) ||
        (e.crop || '').toLowerCase().includes(search) ||
        (e.notes || '').toLowerCase().includes(search)
    );

    if (entries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><i class="fas fa-search"></i><p>Không tìm thấy kết quả</p></div></td></tr>`;
        return;
    }

    tbody.innerHTML = entries.map(e => {
        const nBadge = e.nCategory === 'FSN'
            ? '<span class="badge badge-orange">FSN</span>'
            : e.nCategory === 'FON'
                ? '<span class="badge badge-green">FON</span>'
                : '';
        const fuelLabel = e.fuelType === 'diesel' ? 'Diesel' : e.fuelType === 'petrol' ? 'Xăng' : e.fuelType === 'lpg' ? 'LPG' : '--';
        const fuelDisplay = e.fuel > 0 ? `<span class="badge badge-red">${fuelLabel}</span> ${e.fuel} L` : '--';
        return `<tr>
            <td>${e.date}</td>
            <td>${e.farm}</td>
            <td>${e.crop || '--'}</td>
            <td>${e.fertilizerType || '--'} ${nBadge}</td>
            <td>${e.fertilizerAmount > 0 ? e.fertilizerAmount : '--'}</td>
            <td>${e.nKg > 0 ? '<strong>' + e.nKg + '</strong> kg N' : '--'}</td>
            <td>${e.limestone > 0 ? e.limestone : '--'}</td>
            <td>${e.dolomite > 0 ? e.dolomite : '--'}</td>
            <td>${fuelDisplay}</td>
            <td>${e.area > 0 ? e.area : '--'}</td>
            <td>${e.notes || '--'}</td>
            <td><button class="btn-icon" onclick="deleteDiary(${e.id})" title="Xóa"><i class="fas fa-trash"></i></button></td>
        </tr>`;
    }).join('');
}
