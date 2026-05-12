/* ========== FARM DIARY (Nhật ký canh tác) ========== */
function renderFarmDiary(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Nhật ký canh tác</h1>
            <p class="page-desc">Ghi nhận hoạt động canh tác — nguồn dữ liệu cho tính toán phát thải CO₂/N₂O</p>
        </div>
        <div class="filter-bar">
            <div class="search-input">
                <i class="fas fa-search"></i>
                <input type="text" id="diary-search" placeholder="Tìm theo nông hộ...">
            </div>
            <select id="diary-filter-farm">
                <option value="">Tất cả nông hộ</option>
            </select>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openDiaryModal()">
                <i class="fas fa-plus"></i> Thêm nhật ký
            </button>
        </div>
        <div class="card">
            <div class="table-wrapper">
                <table class="data-table">
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
    `;
    const dateInput = document.getElementById('diary-date');
    if (dateInput) dateInput.valueAsDate = new Date();
    loadDiaryData();
}

let diaryEntries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');

function calcDiaryNKg() {
    const amount = parseFloat(document.getElementById('diary-fertilizer-amount')?.value) || 0;
    const nPct = parseFloat(document.getElementById('diary-n-percent')?.value) || 0;
    const nKg = (amount * nPct / 100).toFixed(3);
    const el = document.getElementById('diary-n-kg');
    if (el) el.value = nKg > 0 ? nKg + ' kg N' : '';
}

function openDiaryModal() {
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

    const entry = {
        id: Date.now(),
        date: document.getElementById('diary-date').value,
        farm: document.getElementById('diary-farm').value || 'Chưa chọn',
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

function loadDiaryData() {
    const tbody = document.getElementById('diary-table-body');
    if (!tbody) return;
    if (diaryEntries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12"><div class="empty-state"><i class="fas fa-book-open"></i><p>Chưa có nhật ký canh tác</p></div></td></tr>';
        return;
    }
    tbody.innerHTML = diaryEntries.map(e => {
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
