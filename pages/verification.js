/* ========== EVIDENCE (Bằng chứng số) ========== */
function renderEvidence(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Bằng chứng số</h1>
            <p class="page-desc">Lưu trữ hình ảnh, video và dữ liệu thô phục vụ thẩm định</p>
        </div>
        <div class="filter-bar">
            <div class="search-input"><i class="fas fa-search"></i><input type="text" placeholder="Tìm kiếm..."></div>
            <select><option value="">Tất cả loại</option><option>Hình ảnh</option><option>Video</option><option>Tài liệu</option></select>
            <select><option value="">Tất cả nông hộ</option></select>
            <div style="flex:1;"></div>
            <button class="btn btn-primary" onclick="openEvidenceModal()"><i class="fas fa-upload"></i> Tải lên</button>
        </div>
        <div class="card">
            <div class="upload-area" id="evidence-upload-area">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả file hoặc nhấn để tải lên bằng chứng</p>
                <span style="font-size:11px;color:var(--text-muted);display:block;margin-top:8px;">Hỗ trợ: JPG, PNG, MP4, PDF (Tối đa 50MB/file)</span>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-folder-open"></i> Danh sách bằng chứng</div></div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Ngày</th><th>Loại</th><th>Nông hộ</th><th>Mô tả</th><th>File</th><th>Người tải</th><th></th></tr></thead>
                    <tbody id="evidence-table">
                        <tr><td colspan="7"><div class="empty-state"><i class="fas fa-camera"></i><p>Chưa có bằng chứng số</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Modal -->
        <div class="modal-overlay" id="evidence-modal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-upload" style="color:var(--primary-light);margin-right:8px;"></i> Tải lên bằng chứng</h3>
                    <button class="modal-close" onclick="closeEvidenceModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        <div class="form-group"><label>Loại bằng chứng</label><select id="ev-type"><option>Hình ảnh</option><option>Video</option><option>Tài liệu</option></select></div>
                        <div class="form-group"><label>Nông hộ</label><select id="ev-farm"><option value="">Chọn nông hộ</option></select></div>
                    </div>
                    <div class="form-group"><label>Mô tả</label><textarea id="ev-desc" placeholder="Mô tả bằng chứng..."></textarea></div>
                    <div class="form-group"><label>Chọn file</label><input type="file" id="ev-file" multiple accept="image/*,video/*,.pdf"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeEvidenceModal()">Hủy</button>
                    <button class="btn btn-primary" onclick="saveEvidence()"><i class="fas fa-save"></i> Lưu</button>
                </div>
            </div>
        </div>
    `;
}
function openEvidenceModal() { document.getElementById('evidence-modal').classList.add('show'); }
function closeEvidenceModal() { document.getElementById('evidence-modal').classList.remove('show'); }
function saveEvidence() {
    addAuditEntry('Tải lên bằng chứng số', `Loại: ${document.getElementById('ev-type').value}`, 'blue');
    closeEvidenceModal();
    alert('Đã lưu bằng chứng (chức năng lưu trữ file sẽ tích hợp server sau)');
}

/* ========== FARM MAP (Bản đồ nông hộ) ========== */
function renderFarmMap(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Bản đồ nông hộ</h1>
            <p class="page-desc">Vị trí các nông hộ và vùng trồng dừa</p>
        </div>
        <div class="card">
            <div class="map-container" id="farm-map-view"></div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Danh sách nông hộ</div></div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Mã</th><th>Tên chủ hộ</th><th>Địa chỉ</th><th>Diện tích (ha)</th><th>Loại cây</th><th>Tọa độ</th></tr></thead>
                    <tbody id="farmmap-table">
                        <tr><td colspan="6"><div class="empty-state"><i class="fas fa-map"></i><p>Chưa có dữ liệu nông hộ</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    // Init map
    setTimeout(() => {
        try {
            const map = L.map('farm-map-view').setView([10.25, 106.37], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            // Load farm markers from localStorage
            const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
            farms.forEach(f => {
                if (f.lat && f.lng) {
                    L.marker([f.lat, f.lng]).addTo(map).bindPopup(`<b>${f.name}</b><br>${f.address}<br>${f.area} ha`);
                }
            });
        } catch(e) { console.log('Map init error:', e); }
    }, 200);
}
