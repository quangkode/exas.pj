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
let _farmMap = null;
let _farmMapTileLayer = null;

function saveMapboxToken() {
    const val = document.getElementById('mapbox-key-input')?.value.trim();
    if (!val) return;
    localStorage.setItem('mapbox_token', val);
    renderFarmMap(document.getElementById('main-content'));
}

function switchMapStyle(btn, style) {
    document.querySelectorAll('.map-style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const token = localStorage.getItem('mapbox_token');
    if (!_farmMap || !token) return;
    if (_farmMapTileLayer) _farmMap.removeLayer(_farmMapTileLayer);
    _farmMapTileLayer = L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/256/{z}/{x}/{y}?access_token=${token}`,
        { attribution: '© <a href="https://mapbox.com">Mapbox</a> © <a href="https://openstreetmap.org">OSM</a>', tileSize: 256, maxZoom: 20 }
    ).addTo(_farmMap);
}

function renderFarmMap(container) {
    const token = localStorage.getItem('mapbox_token') || '';
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const farmsWithCoords = farms.filter(f => f.lat && f.lng);

    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Bản đồ nông hộ</h1>
            <p class="page-desc">Vị trí các nông hộ và vùng trồng dừa</p>
        </div>
        ${!token ? `
        <div class="card" style="margin-bottom:16px;border-left:3px solid #f39c12;">
            <div style="display:flex;align-items:flex-start;gap:14px;">
                <i class="fas fa-key" style="color:#f39c12;margin-top:2px;"></i>
                <div style="flex:1;">
                    <div style="font-weight:600;margin-bottom:6px;">Cấu hình Mapbox API Key</div>
                    <div style="display:flex;gap:8px;">
                        <input type="text" id="mapbox-key-input" placeholder="pk.eyJ1IjoiLi4uIiwiYSI6Ii4uLiJ9..."
                            style="flex:1;padding:7px 10px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text);font-size:13px;">
                        <button onclick="saveMapboxToken()" class="btn btn-primary">Lưu & Tải</button>
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);margin-top:5px;">
                        Lấy miễn phí tại <a href="https://account.mapbox.com/access-tokens/" target="_blank" style="color:var(--primary);">account.mapbox.com</a> → Create a token
                    </div>
                </div>
            </div>
        </div>` : ''}
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div style="font-weight:600;font-size:14px;"><i class="fas fa-map-marked-alt" style="color:var(--primary);margin-right:6px;"></i>Bản đồ vùng dự án (${farmsWithCoords.length} nông hộ có tọa độ)</div>
                ${token ? `<div style="display:flex;gap:6px;">
                    <button class="btn btn-sm map-style-btn active" onclick="switchMapStyle(this,'streets-v12')">Đường phố</button>
                    <button class="btn btn-sm map-style-btn" onclick="switchMapStyle(this,'satellite-streets-v12')">Vệ tinh</button>
                    <button class="btn btn-sm map-style-btn" onclick="switchMapStyle(this,'dark-v11')">Tối</button>
                    <button class="btn btn-sm" onclick="localStorage.removeItem('mapbox_token');renderFarmMap(document.getElementById('main-content'));" style="color:var(--text-muted);" title="Đổi token"><i class="fas fa-key"></i></button>
                </div>` : ''}
            </div>
            <div id="farm-map-view" style="height:520px;border-radius:8px;overflow:hidden;border:1px solid var(--border);"></div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-list"></i> Danh sách nông hộ</div></div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Mã</th><th>Tên chủ hộ</th><th>Địa chỉ</th><th>Diện tích (ha)</th><th>Loại cây</th><th>Tọa độ</th></tr></thead>
                    <tbody id="farmmap-table">
                        ${farms.length === 0
                            ? '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-map"></i><p>Chưa có dữ liệu nông hộ</p></div></td></tr>'
                            : farms.map(f => `<tr style="cursor:${f.lat&&f.lng?'pointer':'default'}" onclick="${f.lat&&f.lng?`flyToFarm(${f.lat},${f.lng})`:''}">
                                <td><code style="background:var(--surface);padding:2px 6px;border-radius:4px;">${f.code||'--'}</code></td>
                                <td><b>${f.name}</b></td>
                                <td style="color:var(--text-muted);font-size:12px;">${f.address||'--'}</td>
                                <td>${f.area||'--'}</td>
                                <td>${f.crop||'--'}</td>
                                <td style="font-size:11px;color:var(--text-muted);">${f.lat&&f.lng?`${parseFloat(f.lat).toFixed(5)}, ${parseFloat(f.lng).toFixed(5)}`:'<span style="color:#e74c3c;">Chưa có</span>'}</td>
                            </tr>`).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        try {
            _farmMap = L.map('farm-map-view').setView([10.25, 106.37], 10);

            if (token) {
                _farmMapTileLayer = L.tileLayer(
                    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${token}`,
                    { attribution: '© <a href="https://mapbox.com">Mapbox</a> © <a href="https://openstreetmap.org">OSM</a>', tileSize: 256, maxZoom: 20 }
                ).addTo(_farmMap);
            } else {
                _farmMapTileLayer = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                    { attribution: '© <a href="https://carto.com">CARTO</a> © <a href="https://openstreetmap.org">OSM</a>', maxZoom: 20 }
                ).addTo(_farmMap);
            }

            const bounds = [];
            farmsWithCoords.forEach(f => {
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="background:#1a5276;color:#fff;border-radius:50% 50% 50% 0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
                        <span style="transform:rotate(45deg);">${(f.code||'?').slice(-2)}</span></div>`,
                    iconSize: [28, 28], iconAnchor: [14, 28]
                });
                L.marker([f.lat, f.lng], { icon })
                    .addTo(_farmMap)
                    .bindPopup(`<div style="min-width:160px;"><b style="font-size:13px;">${f.name}</b><br>
                        <span style="color:#666;font-size:11px;">${f.code}</span><br>
                        <hr style="margin:6px 0;border-color:#eee;">
                        <span style="font-size:12px;">📍 ${f.address||'--'}</span><br>
                        <span style="font-size:12px;">🌿 ${f.crop||'--'} — ${f.area||'--'} ha</span></div>`);
                bounds.push([f.lat, f.lng]);
            });

            if (bounds.length > 0) _farmMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        } catch(e) { console.error('Map init error:', e); }
    }, 200);
}

function flyToFarm(lat, lng) {
    if (_farmMap) _farmMap.flyTo([lat, lng], 15, { duration: 1.2 });
    document.getElementById('farm-map-view')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
