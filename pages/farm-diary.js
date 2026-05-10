/* ========== FARM DIARY (Nhật ký canh tác) ========== */
function renderFarmDiary(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Nhật ký canh tác</h1>
            <p class="page-desc">Ghi nhận thông tin hoạt động canh tác theo từng nông hộ</p>
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
                            <th>Loại phân bón</th>
                            <th>Lượng phân (kg)</th>
                            <th>Lượng nước tưới (m³)</th>
                            <th>Nhiên liệu (lít)</th>
                            <th>Ghi chú</th>
                            <th>Người ghi</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="diary-table-body">
                        <tr><td colspan="10"><div class="empty-state"><i class="fas fa-book-open"></i><p>Chưa có nhật ký canh tác</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal thêm nhật ký -->
        <div class="modal-overlay" id="diary-modal">
            <div class="modal">
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
                                <label>Loại phân bón</label>
                                <input type="text" id="diary-fertilizer-type" placeholder="VD: Phân hữu cơ, NPK...">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Lượng phân bón (kg)</label>
                                <input type="number" id="diary-fertilizer-amount" step="0.1" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label>Lượng nước tưới (m³)</label>
                                <input type="number" id="diary-water" step="0.1" placeholder="0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Nhiên liệu tiêu thụ (lít)</label>
                                <input type="number" id="diary-fuel" step="0.1" placeholder="0">
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
                            <textarea id="diary-notes" placeholder="Ghi chú thêm về hoạt động canh tác..."></textarea>
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
    // Set default date
    const dateInput = document.getElementById('diary-date');
    if (dateInput) dateInput.valueAsDate = new Date();
    loadDiaryData();
}

// Data store
let diaryEntries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');

function openDiaryModal() { document.getElementById('diary-modal').classList.add('show'); }
function closeDiaryModal() { document.getElementById('diary-modal').classList.remove('show'); document.getElementById('diary-form')?.reset(); }

function saveDiary() {
    const entry = {
        id: Date.now(),
        date: document.getElementById('diary-date').value,
        farm: document.getElementById('diary-farm').value || 'Chưa chọn',
        crop: document.getElementById('diary-crop').value,
        fertilizerType: document.getElementById('diary-fertilizer-type').value,
        fertilizerAmount: document.getElementById('diary-fertilizer-amount').value,
        water: document.getElementById('diary-water').value,
        fuel: document.getElementById('diary-fuel').value,
        waste: document.getElementById('diary-waste').value,
        notes: document.getElementById('diary-notes').value,
        recorder: currentUser.name,
        createdAt: new Date().toISOString()
    };
    diaryEntries.push(entry);
    localStorage.setItem('mrv_diaries', JSON.stringify(diaryEntries));
    closeDiaryModal();
    loadDiaryData();
    addAuditEntry('Thêm nhật ký canh tác', `Nông hộ: ${entry.farm}`, 'green');
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
        tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><i class="fas fa-book-open"></i><p>Chưa có nhật ký canh tác</p></div></td></tr>';
        return;
    }
    tbody.innerHTML = diaryEntries.map(e => `
        <tr>
            <td>${e.date}</td>
            <td>${e.farm}</td>
            <td>${e.crop || '--'}</td>
            <td>${e.fertilizerType || '--'}</td>
            <td>${e.fertilizerAmount || '--'}</td>
            <td>${e.water || '--'}</td>
            <td>${e.fuel || '--'}</td>
            <td>${e.notes || '--'}</td>
            <td><span class="badge badge-blue">${e.recorder}</span></td>
            <td><button class="btn-icon" onclick="deleteDiary(${e.id})" title="Xóa"><i class="fas fa-trash"></i></button></td>
        </tr>
    `).join('');
}
