/* ========== REPORTS (Báo cáo VM0042) - Admin only ========== */
function renderReports(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Báo cáo VM0042</h1>
            <p class="page-desc">Xuất báo cáo định kỳ theo chuẩn phương pháp luận VM0042 của Verra</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-file-alt"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Báo cáo đã tạo</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-check-circle"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Đã xác minh</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-hourglass-half"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Đang chờ</div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-file-export"></i> Tạo báo cáo mới</div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Loại báo cáo</label>
                    <select id="report-type">
                        <option>Báo cáo giám sát định kỳ (Monitoring Report)</option>
                        <option>Báo cáo xác minh (Verification Report)</option>
                        <option>Mô tả dự án (Project Description)</option>
                    </select>
                </div>
                <div class="form-group"><label>Kỳ báo cáo</label>
                    <select id="report-period"><option>Quý 1/2025</option><option>Quý 2/2025</option><option>Quý 3/2025</option><option>Quý 4/2025</option><option>Năm 2025</option></select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Định dạng xuất</label>
                    <select id="report-format"><option>PDF</option><option>Word (.docx)</option><option>CSV</option></select>
                </div>
                <div class="form-group" style="display:flex;align-items:flex-end;">
                    <button class="btn btn-primary" onclick="generateReport()"><i class="fas fa-cogs"></i> Tạo báo cáo</button>
                </div>
            </div>
        </div>
        <div class="card" style="margin-top:20px;">
            <div class="card-header"><div class="card-title"><i class="fas fa-history"></i> Lịch sử báo cáo</div></div>
            <div class="table-wrapper">
                <table class="data-table">
                    <thead><tr><th>Ngày tạo</th><th>Loại</th><th>Kỳ</th><th>Định dạng</th><th>Trạng thái</th><th></th></tr></thead>
                    <tbody>
                        <tr><td colspan="6"><div class="empty-state"><i class="fas fa-file-alt"></i><p>Chưa có báo cáo</p></div></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
function generateReport() { alert('Chức năng tạo báo cáo sẽ được tích hợp khi có mẫu VM0042.'); }

/* ========== EMISSION CALC (Tính toán phát thải) - Admin only ========== */
function renderEmissionCalc(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Tính toán phát thải</h1>
            <p class="page-desc">Công thức VM0042 — Dữ liệu tự động từ Nhật ký canh tác</p>
        </div>

        <!-- Bộ lọc -->
        <div class="card" style="margin-bottom:20px;">
            <div style="padding:16px;display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;">
                <div>
                    <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">Nông hộ</label>
                    <select id="ec-farm-filter" style="padding:8px 12px;border:1px solid var(--border);border-radius:4px;min-width:180px;">
                        <option value="">Tất cả nông hộ</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">Từ ngày</label>
                    <input type="date" id="ec-date-from" style="padding:8px;border:1px solid var(--border);border-radius:4px;">
                </div>
                <div>
                    <label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px;">Đến ngày</label>
                    <input type="date" id="ec-date-to" style="padding:8px;border:1px solid var(--border);border-radius:4px;">
                </div>
                <button class="btn btn-primary" onclick="runEmissionCalc()"><i class="fas fa-sync-alt"></i> Tải dữ liệu & Tính</button>
            </div>
        </div>

        <!-- CÔNG THỨC 1: Nhiên liệu hóa thạch -->
        <div class="card" style="margin-bottom:20px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-gas-pump" style="color:var(--danger);"></i> Phát thải CO₂ từ đốt nhiên liệu hóa thạch</div>
                <span style="font-size:11px;color:var(--text-muted);">Máy móc, máy kéo</span>
            </div>
            <div style="padding:20px;">
                <div style="background:var(--bg-light);padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;color:var(--text-primary);font-style:italic;">
                    EFF<sub>wp,j,i,t</sub> = FFC<sub>wp,j,i,t</sub> × EF<sub>CO₂,j</sub>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;">
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">FFC Diesel (lít) — nhật ký</label>
                        <input type="text" id="ec-ffc-diesel" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">FFC Xăng (lít) — nhật ký</label>
                        <input type="text" id="ec-ffc-petrol" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">FFC LPG (lít) — nhật ký</label>
                        <input type="text" id="ec-ffc-lpg" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>CO₂</sub> Diesel (tCO₂/lít) — IPCC</label>
                        <input type="number" id="ec-ef-diesel" value="0.00268" step="0.00001" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>CO₂</sub> Xăng (tCO₂/lít) — IPCC</label>
                        <input type="number" id="ec-ef-petrol" value="0.00231" step="0.00001" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>CO₂</sub> LPG (tCO₂/lít) — IPCC</label>
                        <input type="number" id="ec-ef-lpg" value="0.00163" step="0.00001" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                </div>
                <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-left:4px solid var(--danger);display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:11px;color:var(--text-muted);">EFF — Tổng phát thải nhiên liệu hóa thạch</div>
                        <div style="font-size:26px;font-weight:bold;color:var(--danger);" id="ec-eff-result">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="calcEFF()"><i class="fas fa-calculator"></i> Tính EFF</button>
                </div>
            </div>
        </div>

        <!-- CÔNG THỨC 2: Vôi / Dolomite -->
        <div class="card" style="margin-bottom:20px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-mountain" style="color:var(--info);"></i> Phát thải CO₂ từ bón vôi cải tạo đất</div>
            </div>
            <div style="padding:20px;">
                <div style="background:var(--bg-light);padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;color:var(--text-primary);font-style:italic;">
                    EL<sub>wp,i,t</sub> = ((M<sub>Limestone,wp,i</sub> × EF<sub>Limestone</sub>) + (M<sub>Dolomite,wp,i</sub> × EF<sub>Dolomite</sub>)) × 44/12
                </div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">M Vôi/Limestone (tấn) — nhật ký</label>
                        <input type="text" id="ec-m-limestone" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>Limestone</sub> (tC/tấn) — IPCC</label>
                        <input type="number" id="ec-ef-limestone" value="0.12" step="0.01" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">M Dolomite (tấn) — nhật ký</label>
                        <input type="text" id="ec-m-dolomite" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>Dolomite</sub> (tC/tấn) — IPCC</label>
                        <input type="number" id="ec-ef-dolomite" value="0.13" step="0.01" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                </div>
                <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-left:4px solid var(--info);display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:11px;color:var(--text-muted);">EL — Phát thải CO₂ từ vôi & dolomite (× 44/12)</div>
                        <div style="font-size:26px;font-weight:bold;color:var(--info);" id="ec-el-result">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="calcEL()"><i class="fas fa-calculator"></i> Tính EL</button>
                </div>
            </div>
        </div>

        <!-- CÔNG THỨC 3: N2O từ phân bón -->
        <div class="card" style="margin-bottom:20px;">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-leaf" style="color:var(--warning);"></i> Phát thải N₂O trực tiếp từ sử dụng phân bón</div>
            </div>
            <div style="padding:20px;">
                <div style="background:var(--bg-light);padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;color:var(--text-primary);font-style:italic;">
                    N2O_fert<sub>wp,direct,i,t</sub> = (FSN<sub>wp,i,t</sub> + FON<sub>wp,i,t</sub>) × EF<sub>Ndirect</sub> × (44/28) × GWP<sub>N₂O</sub> / A<sub>i</sub>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;">
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">FSN — Phân tổng hợp (kg N) — nhật ký</label>
                        <input type="text" id="ec-fsn" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">FON — Phân hữu cơ (kg N) — nhật ký</label>
                        <input type="text" id="ec-fon" readonly style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;background:var(--surface);">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">Diện tích A<sub>i</sub> (ha)</label>
                        <input type="number" id="ec-area" step="0.01" placeholder="ha" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">EF<sub>Ndirect</sub> (kg N₂O-N / kg N) — IPCC Tier 1</label>
                        <input type="number" id="ec-ef-ndirect" value="0.01" step="0.001" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                    <div>
                        <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px;">GWP<sub>N₂O</sub> — AR5 IPCC (kg CO₂e / kg N₂O)</label>
                        <input type="number" id="ec-gwp-n2o" value="265" step="1" style="width:100%;padding:8px;border:1px solid var(--border);border-radius:4px;">
                    </div>
                </div>
                <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-left:4px solid var(--warning);display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:11px;color:var(--text-muted);">N₂O_fert — Phát thải N₂O quy đổi CO₂e / đơn vị diện tích</div>
                        <div style="font-size:26px;font-weight:bold;color:var(--warning);" id="ec-n2o-result">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e / ha</div>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="calcN2O()"><i class="fas fa-calculator"></i> Tính N₂O</button>
                </div>
            </div>
        </div>

        <!-- Tổng hợp -->
        <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-sigma"></i> Tổng hợp phát thải dự án</div></div>
            <div style="padding:20px;">
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px;">
                    <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-top:3px solid var(--danger);text-align:center;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">EFF — Nhiên liệu</div>
                        <div style="font-size:20px;font-weight:bold;color:var(--danger);" id="sum-eff">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e</div>
                    </div>
                    <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-top:3px solid var(--info);text-align:center;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">EL — Vôi / Dolomite</div>
                        <div style="font-size:20px;font-weight:bold;color:var(--info);" id="sum-el">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e</div>
                    </div>
                    <div style="background:var(--bg-light);padding:16px;border-radius:8px;border-top:3px solid var(--warning);text-align:center;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">N₂O_fert — Phân bón</div>
                        <div style="font-size:20px;font-weight:bold;color:var(--warning);" id="sum-n2o">--</div>
                        <div style="font-size:10px;color:var(--text-muted);">t CO₂e/ha</div>
                    </div>
                    <div style="background:var(--primary);padding:16px;border-radius:8px;text-align:center;">
                        <div style="font-size:11px;color:rgba(255,255,255,0.7);margin-bottom:6px;">Tổng phát thải (EFF + EL)</div>
                        <div style="font-size:22px;font-weight:bold;color:white;" id="sum-total">--</div>
                        <div style="font-size:10px;color:rgba(255,255,255,0.7);">t CO₂e</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        populateEmissionFarmFilter();
        const now = new Date();
        const fromEl = document.getElementById('ec-date-from');
        const toEl = document.getElementById('ec-date-to');
        if (fromEl) fromEl.value = `${now.getFullYear()}-01-01`;
        if (toEl) toEl.value = now.toISOString().slice(0, 10);
        runEmissionCalc();
    }, 100);
}

function populateEmissionFarmFilter() {
    const diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const farms = [...new Set(diaries.map(e => e.farm))].filter(Boolean);
    const select = document.getElementById('ec-farm-filter');
    if (!select) return;
    select.innerHTML = '<option value="">Tất cả nông hộ</option>' +
        farms.map(f => `<option value="${f}">${f}</option>`).join('');
}

function getFilteredDiaries() {
    const diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const farm = document.getElementById('ec-farm-filter')?.value || '';
    const dateFrom = document.getElementById('ec-date-from')?.value || '';
    const dateTo = document.getElementById('ec-date-to')?.value || '';
    return diaries.filter(e => {
        if (farm && e.farm !== farm) return false;
        if (dateFrom && e.date < dateFrom) return false;
        if (dateTo && e.date > dateTo) return false;
        return true;
    });
}

function runEmissionCalc() {
    const diaries = getFilteredDiaries();

    let fuelDiesel = 0, fuelPetrol = 0, fuelLpg = 0;
    let limestone = 0, dolomite = 0;
    let fsn = 0, fon = 0;
    let maxArea = 0;

    diaries.forEach(e => {
        if (e.fuelType === 'diesel') fuelDiesel += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'petrol') fuelPetrol += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'lpg') fuelLpg += parseFloat(e.fuel) || 0;
        limestone += parseFloat(e.limestone) || 0;
        dolomite += parseFloat(e.dolomite) || 0;
        if (e.nCategory === 'FSN') fsn += parseFloat(e.nKg) || 0;
        if (e.nCategory === 'FON') fon += parseFloat(e.nKg) || 0;
        if ((parseFloat(e.area) || 0) > maxArea) maxArea = parseFloat(e.area);
    });

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('ec-ffc-diesel', fuelDiesel.toFixed(2) + ' lít');
    set('ec-ffc-petrol', fuelPetrol.toFixed(2) + ' lít');
    set('ec-ffc-lpg', fuelLpg.toFixed(2) + ' lít');
    set('ec-m-limestone', limestone.toFixed(3) + ' tấn');
    set('ec-m-dolomite', dolomite.toFixed(3) + ' tấn');
    set('ec-fsn', fsn.toFixed(3) + ' kg N');
    set('ec-fon', fon.toFixed(3) + ' kg N');

    const areaEl = document.getElementById('ec-area');
    if (areaEl && !areaEl.value && maxArea > 0) areaEl.value = maxArea;

    calcEFF();
    calcEL();
    calcN2O();
}

// EFF_{wp,j,i,t} = FFC_{wp,j,i,t} × EF_{CO2,j}
function calcEFF() {
    const diaries = getFilteredDiaries();
    let fuelDiesel = 0, fuelPetrol = 0, fuelLpg = 0;
    diaries.forEach(e => {
        if (e.fuelType === 'diesel') fuelDiesel += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'petrol') fuelPetrol += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'lpg') fuelLpg += parseFloat(e.fuel) || 0;
    });

    const efDiesel = parseFloat(document.getElementById('ec-ef-diesel')?.value) || 0.00268;
    const efPetrol = parseFloat(document.getElementById('ec-ef-petrol')?.value) || 0.00231;
    const efLpg = parseFloat(document.getElementById('ec-ef-lpg')?.value) || 0.00163;

    const eff = (fuelDiesel * efDiesel) + (fuelPetrol * efPetrol) + (fuelLpg * efLpg);
    const resultEl = document.getElementById('ec-eff-result');
    if (resultEl) resultEl.textContent = eff.toFixed(5) + ' tCO₂e';
    const sumEl = document.getElementById('sum-eff');
    if (sumEl) sumEl.textContent = eff.toFixed(4);
    updateEmissionTotal();
    return eff;
}

// EL_{wp,i,t} = ((M_Limestone × EF_Limestone) + (M_Dolomite × EF_Dolomite)) × 44/12
function calcEL() {
    const diaries = getFilteredDiaries();
    let limestone = 0, dolomite = 0;
    diaries.forEach(e => {
        limestone += parseFloat(e.limestone) || 0;
        dolomite += parseFloat(e.dolomite) || 0;
    });

    const efLimestone = parseFloat(document.getElementById('ec-ef-limestone')?.value) || 0.12;
    const efDolomite = parseFloat(document.getElementById('ec-ef-dolomite')?.value) || 0.13;

    const el = ((limestone * efLimestone) + (dolomite * efDolomite)) * (44 / 12);
    const resultEl = document.getElementById('ec-el-result');
    if (resultEl) resultEl.textContent = el.toFixed(5) + ' tCO₂e';
    const sumEl = document.getElementById('sum-el');
    if (sumEl) sumEl.textContent = el.toFixed(4);
    updateEmissionTotal();
    return el;
}

// N2O_fert_{wp,direct,i,t} = (FSN + FON) × EF_Ndirect × (44/28) × GWP_N2O / A_i
// Đơn vị: kg N đầu vào → kết quả t CO₂e/ha (có quy đổi /1000 từ kg → t)
function calcN2O() {
    const diaries = getFilteredDiaries();
    let fsn = 0, fon = 0;
    diaries.forEach(e => {
        if (e.nCategory === 'FSN') fsn += parseFloat(e.nKg) || 0;
        if (e.nCategory === 'FON') fon += parseFloat(e.nKg) || 0;
    });

    const efNdirect = parseFloat(document.getElementById('ec-ef-ndirect')?.value) || 0.01;
    const gwpN2o = parseFloat(document.getElementById('ec-gwp-n2o')?.value) || 265;
    const area = parseFloat(document.getElementById('ec-area')?.value) || 1;

    // (kg N) × (kg N₂O-N/kg N) × (44/28 N₂O/N₂O-N) × GWP × (1t/1000kg) / ha
    const n2o = (fsn + fon) * efNdirect * (44 / 28) * gwpN2o / 1000 / area;
    const resultEl = document.getElementById('ec-n2o-result');
    if (resultEl) resultEl.textContent = n2o.toFixed(5) + ' tCO₂e/ha';
    const sumN2o = document.getElementById('sum-n2o');
    if (sumN2o) sumN2o.textContent = n2o.toFixed(4);
    updateEmissionTotal();
    return n2o;
}

function updateEmissionTotal() {
    const eff = parseFloat(document.getElementById('sum-eff')?.textContent) || 0;
    const el = parseFloat(document.getElementById('sum-el')?.textContent) || 0;
    const total = eff + el;
    const totalEl = document.getElementById('sum-total');
    if (totalEl && total >= 0) totalEl.textContent = total.toFixed(4);
}
