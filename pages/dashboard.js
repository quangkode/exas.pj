/* ========== DASHBOARD PAGE ========== */
function renderDashboard(container) {
    const farms = JSON.parse(localStorage.getItem('mrv_farms') || '[]');
    const farmOptions = '<option value="">Tất cả nông hộ</option>' +
        farms.map(f => `<option value="${f.name}">${f.name}</option>`).join('');

    const auditLog = JSON.parse(localStorage.getItem('mrv_audit') || '[]');
    const recentHtml = auditLog.length === 0
        ? `<div class="empty-state" style="padding:24px;"><i class="fas fa-clock" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.3;"></i>Chưa có hoạt động</div>`
        : [...auditLog].reverse().slice(0, 8).map(a => {
            const colors = { green: 'var(--success)', blue: 'var(--info)', red: 'var(--danger)', orange: 'var(--warning)' };
            const c = colors[a.color] || 'var(--text-muted)';
            return `<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
                <div style="width:8px;height:8px;min-width:8px;background:${c};border-radius:50%;margin-top:5px;"></div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:500;">${a.action}</div>
                    <div style="font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.detail || ''}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${a.time || ''}</div>
                </div>
            </div>`;
        }).join('');

    container.innerHTML = `
        <div class="page-header">
            <div class="page-header-text">
                <h1 class="page-title">Tổng quan hệ thống MRV</h1>
                <p class="page-desc">Theo dõi dữ liệu đo lường, báo cáo và xác minh tín chỉ các-bon</p>
            </div>
            <div class="page-actions">
                <select id="dash-farm-filter" onchange="loadDashboardStats()" style="min-width:180px;">
                    ${farmOptions}
                </select>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-bottom:16px;" id="dash-info-grid"></div>

        <div class="stats-grid" id="dash-stats-grid"></div>

        <div class="grid-2" style="margin-top:20px;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-vial"></i> Trữ lượng SOC theo nông hộ</div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table" style="width:max-content;min-width:580px;">
                        <thead><tr>
                            <th>Nông hộ</th>
                            <th>Diện tích</th>
                            <th>SOC đầu vụ (tC/ha)</th>
                            <th>SOC cuối vụ (tC/ha)</th>
                            <th>ΔSOC (tC/ha)</th>
                        </tr></thead>
                        <tbody id="dash-soc-table"></tbody>
                    </table>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-history"></i> Hoạt động gần đây</div>
                </div>
                <div style="padding:0 16px 8px;max-height:280px;overflow-y:auto;">
                    ${recentHtml}
                </div>
            </div>
        </div>
    `;

    loadDashboardStats();
}

function loadDashboardStats() {
    const farmFilter = document.getElementById('dash-farm-filter')?.value || '';
    const allFarms   = JSON.parse(localStorage.getItem('mrv_farms')   || '[]');
    const allDiaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const allSoc     = JSON.parse(localStorage.getItem('mrv_soc')     || '[]');

    const diaries  = farmFilter ? allDiaries.filter(e => matchesFarm(e, farmFilter, allFarms)) : allDiaries;
    const socData  = farmFilter ? allSoc.filter(e => matchesFarm(e, farmFilter, allFarms)) : allSoc;
    const activeFarms = farmFilter ? allFarms.filter(f => f.name === farmFilter || f.code === farmFilter) : allFarms;
    const totalArea = activeFarms.reduce((s, f) => s + (parseFloat(f.area) || 0), 0) || 1;
    const selectedFarm = activeFarms.length === 1 ? activeFarms[0] : null;

    // ── 2 info cards ──
    const infoGrid = document.getElementById('dash-info-grid');
    if (infoGrid) {
        if (selectedFarm) {
            infoGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-glow green"></div>
                    <div class="stat-icon green"><i class="fas fa-seedling"></i></div>
                    <div class="stat-value" style="font-size:17px;font-weight:700;line-height:1.3;">${selectedFarm.name}</div>
                    <div class="stat-label">Nông hộ được chọn · Mã: ${selectedFarm.code || '--'}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-glow blue"></div>
                    <div class="stat-icon blue"><i class="fas fa-ruler-combined"></i></div>
                    <div class="stat-value" style="font-size:22px;">${selectedFarm.area || '--'} <span style="font-size:14px;font-weight:400;">ha</span></div>
                    <div class="stat-label">Diện tích canh tác</div>
                </div>`;
        } else {
            infoGrid.innerHTML = `
                <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('farm-mgmt')">
                    <div class="stat-glow green"></div>
                    <div class="stat-icon green"><i class="fas fa-users"></i></div>
                    <div class="stat-value">${allFarms.length || '--'}</div>
                    <div class="stat-label">Tổng số nông hộ giám sát</div>
                </div>
                <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('farm-map')">
                    <div class="stat-glow blue"></div>
                    <div class="stat-icon blue"><i class="fas fa-map-marked-alt"></i></div>
                    <div class="stat-value">${totalArea.toFixed(1)} <span style="font-size:14px;font-weight:400;">ha</span></div>
                    <div class="stat-label">Tổng diện tích dự án</div>
                </div>`;
        }
    }

    // ── Emission calculations (same formulas as reporting.js) ──
    let fuelDiesel = 0, fuelPetrol = 0, fuelLpg = 0;
    let limestone = 0, dolomite = 0, fsn = 0, fon = 0;
    diaries.forEach(e => {
        if      (e.fuelType === 'diesel') fuelDiesel += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'petrol') fuelPetrol += parseFloat(e.fuel) || 0;
        else if (e.fuelType === 'lpg')    fuelLpg    += parseFloat(e.fuel) || 0;
        limestone += parseFloat(e.limestone) || 0;
        dolomite  += parseFloat(e.dolomite)  || 0;
        if (e.nCategory === 'FSN') fsn += parseFloat(e.nKg) || 0;
        if (e.nCategory === 'FON') fon += parseFloat(e.nKg) || 0;
    });
    const eff      = (fuelDiesel * 0.00268) + (fuelPetrol * 0.00231) + (fuelLpg * 0.00163);
    const el       = ((limestone * 0.12) + (dolomite * 0.13)) * (44 / 12);
    const n2oTotal = (fsn + fon) * 0.01 * (44 / 28) * 265 / 1000;

    // ── SOC Change → tCO₂ ──
    const beginSOC = socData.filter(e => e.isBeginning && e.socMassVM0042 != null);
    const endSOC   = socData.filter(e => !e.isBeginning && e.socMassVM0042 != null);
    let socDeltaCO2 = null, socBadge = '';
    if (beginSOC.length && endSOC.length) {
        const avgBegin = beginSOC.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / beginSOC.length;
        const avgEnd   = endSOC.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / endSOC.length;
        socDeltaCO2 = ((avgEnd - avgBegin) / 1.09) * totalArea * (44 / 12);
        socBadge = socDeltaCO2 >= 0
            ? `<span style="font-size:10px;background:rgba(16,185,129,0.15);color:var(--success);padding:2px 6px;border-radius:10px;">+Hấp thụ</span>`
            : `<span style="font-size:10px;background:rgba(239,68,68,0.15);color:var(--danger);padding:2px 6px;border-radius:10px;">Phát thải</span>`;
    }

    const fmt = (v, d) => v > 0 ? v.toFixed(d) : (v !== null ? v.toFixed(d) : '--');

    const statsGrid = document.getElementById('dash-stats-grid');
    if (statsGrid) statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-glow green"></div>
            <div class="stat-icon green"><i class="fas fa-leaf"></i></div>
            <div class="stat-value" style="font-size:19px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;line-height:1.3;">
                ${socDeltaCO2 !== null ? Math.abs(socDeltaCO2).toFixed(3) : '--'}
                <span style="font-size:12px;font-weight:400;">tCO₂</span>
                ${socBadge}
            </div>
            <div class="stat-label">Thay đổi trữ lượng SOC dự án</div>
        </div>
        <div class="stat-card">
            <div class="stat-glow orange"></div>
            <div class="stat-icon orange"><i class="fas fa-fire-alt"></i></div>
            <div class="stat-value" style="font-size:19px;display:flex;align-items:center;gap:6px;line-height:1.3;">
                ${eff > 0 ? eff.toFixed(4) : (diaries.length ? '0.0000' : '--')}
                <span style="font-size:12px;font-weight:400;">tCO₂</span>
            </div>
            <div class="stat-label">Phát thải từ nhiên liệu hóa thạch (EFF)</div>
        </div>
        <div class="stat-card">
            <div class="stat-glow blue"></div>
            <div class="stat-icon blue"><i class="fas fa-mountain"></i></div>
            <div class="stat-value" style="font-size:19px;display:flex;align-items:center;gap:6px;line-height:1.3;">
                ${el > 0 ? el.toFixed(4) : (diaries.length ? '0.0000' : '--')}
                <span style="font-size:12px;font-weight:400;">tCO₂</span>
            </div>
            <div class="stat-label">Phát thải từ bón vôi cải tạo đất (EL)</div>
        </div>
        <div class="stat-card">
            <div class="stat-glow red"></div>
            <div class="stat-icon red"><i class="fas fa-seedling"></i></div>
            <div class="stat-value" style="font-size:19px;display:flex;align-items:center;gap:6px;line-height:1.3;">
                ${n2oTotal > 0 ? n2oTotal.toFixed(4) : (diaries.length ? '0.0000' : '--')}
                <span style="font-size:12px;font-weight:400;">tCO₂e</span>
            </div>
            <div class="stat-label">Phát thải N₂O trực tiếp từ phân bón</div>
        </div>
    `;

    // ── SOC table per farm ──
    const socTableBody = document.getElementById('dash-soc-table');
    if (socTableBody) {
        const farmsToShow = farmFilter
            ? allFarms.filter(f => f.name === farmFilter || f.code === farmFilter)
            : allFarms;
        socTableBody.innerHTML = farmsToShow.length === 0
            ? `<tr><td colspan="5"><div class="empty-state" style="padding:20px;"><i class="fas fa-seedling"></i><p>Chưa có nông hộ</p></div></td></tr>`
            : farmsToShow.map(f => {
                const fBegin = allSoc.filter(e => e.farm === f.name && e.isBeginning && e.socMassVM0042 != null);
                const fEnd   = allSoc.filter(e => e.farm === f.name && !e.isBeginning && e.socMassVM0042 != null);
                const avgB = fBegin.length ? fBegin.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / fBegin.length : null;
                const avgE = fEnd.length   ? fEnd.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / fEnd.length   : null;
                const delta = avgB !== null && avgE !== null ? avgE - avgB : null;
                const dc = delta !== null ? (delta >= 0 ? 'var(--success)' : 'var(--danger)') : '';
                return `<tr>
                    <td><strong>${f.name}</strong><div style="font-size:11px;color:var(--text-muted);">${f.code}</div></td>
                    <td>${f.area} ha</td>
                    <td>${avgB !== null ? `<span style="color:var(--primary-light);">${avgB.toFixed(4)}</span>` : '<span style="color:var(--text-muted);">--</span>'}</td>
                    <td>${avgE !== null ? `<span style="color:var(--success);">${avgE.toFixed(4)}</span>` : '<span style="color:var(--text-muted);">--</span>'}</td>
                    <td>${delta !== null ? `<span style="color:${dc};font-weight:600;">${delta >= 0 ? '+' : ''}${delta.toFixed(4)}</span>` : '<span style="color:var(--text-muted);">--</span>'}</td>
                </tr>`;
            }).join('');
    }
}
