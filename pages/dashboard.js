/* ========== DASHBOARD PAGE ========== */
function renderDashboard(container) {
    const isAdmin = currentUser.role === 'admin';

    // ── Load all data ──
    const farms    = JSON.parse(localStorage.getItem('mrv_farms')   || '[]');
    const diaries  = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const socData  = JSON.parse(localStorage.getItem('mrv_soc')     || '[]');
    const droneData= JSON.parse(localStorage.getItem('mrv_drone')   || '[]');
    const auditLog = JSON.parse(localStorage.getItem('mrv_audit')   || '[]');

    // ── Stats ──
    const farmCount = farms.length;
    const totalArea = farms.reduce((s, f) => s + (parseFloat(f.area) || 0), 0);
    const diaryCount = diaries.length;
    const totalN = diaries.reduce((s, d) => s + (parseFloat(d.nKg) || 0), 0);

    // ΔCO₂_soil từ SOC (nếu có)
    let co2Str = '--';
    let co2Badge = '';
    const beginSOC = socData.filter(e => e.isBeginning && e.socMassVM0042 != null);
    const endSOC   = socData.filter(e => !e.isBeginning && e.socMassVM0042 != null);
    if (beginSOC.length && endSOC.length) {
        const avgBegin = beginSOC.reduce((s,e) => s + parseFloat(e.socMassVM0042), 0) / beginSOC.length;
        const avgEnd   = endSOC.reduce((s,e) => s + parseFloat(e.socMassVM0042), 0) / endSOC.length;
        const x = 1.09; // kỳ đo 20/03/2023 → 20/04/2024
        const deltaCO2 = ((avgEnd - avgBegin) / x) * totalArea * (44 / 12);
        co2Str = Math.abs(deltaCO2).toFixed(2);
        co2Badge = deltaCO2 >= 0
            ? '<span style="font-size:10px;background:rgba(16,185,129,0.15);color:var(--success);padding:2px 6px;border-radius:10px;margin-left:6px;">+Hấp thụ</span>'
            : '<span style="font-size:10px;background:rgba(239,68,68,0.15);color:var(--danger);padding:2px 6px;border-radius:10px;margin-left:6px;">Phát thải</span>';
    }

    // ── Biểu đồ N theo đợt bón ──
    const chartBars = diaries.map((d, i) => {
        const maxN = Math.max(...diaries.map(x => x.nKg || 0), 1);
        const pct  = Math.round(((d.nKg || 0) / maxN) * 100);
        const label = d.date ? d.date.slice(5) : `Lần ${i+1}`; // MM-DD
        return `
        <div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:0;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">${(d.nKg||0).toFixed(1)}</div>
            <div style="flex:1;width:100%;display:flex;align-items:flex-end;">
                <div style="width:100%;height:${Math.max(pct,4)}%;background:linear-gradient(to top,var(--primary),var(--primary-light));border-radius:4px 4px 0 0;transition:.4s;"></div>
            </div>
            <div style="font-size:9px;color:var(--text-muted);margin-top:6px;white-space:nowrap;">${label}</div>
        </div>`;
    }).join('');

    // ── SOC summary per farm ──
    const farmSOCRows = farms.map(f => {
        const fBegin = socData.filter(e => e.farm === f.name && e.isBeginning && e.socMassVM0042 != null);
        const fEnd   = socData.filter(e => e.farm === f.name && !e.isBeginning && e.socMassVM0042 != null);
        const avgB = fBegin.length ? (fBegin.reduce((s,e) => s+parseFloat(e.socMassVM0042),0)/fBegin.length).toFixed(4) : '--';
        const avgE = fEnd.length   ? (fEnd.reduce((s,e)   => s+parseFloat(e.socMassVM0042),0)/fEnd.length  ).toFixed(4) : '--';
        const hasDiary = diaries.some(d => d.farm === f.name);
        const hasDrone = droneData.some(d => d.farm === f.name);
        const pct = [fBegin.length > 0, fEnd.length > 0, hasDiary, hasDrone].filter(Boolean).length;
        const bar = `<div style="background:var(--border);border-radius:4px;height:6px;overflow:hidden;">
            <div style="width:${pct*25}%;height:100%;background:var(--primary-light);transition:.4s;"></div></div>`;
        return `<tr>
            <td><strong>${f.name}</strong><div style="font-size:11px;color:var(--text-muted);">${f.code}</div></td>
            <td>${f.area} ha</td>
            <td>${avgB === '--' ? '<span style="color:var(--text-muted);">--</span>' : `<span style="color:var(--primary-light);">${avgB}</span>`}</td>
            <td>${avgE === '--' ? '<span style="color:var(--text-muted);">--</span>' : `<span style="color:var(--success);">${avgE}</span>`}</td>
            <td style="min-width:80px;">${bar}<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${pct}/4 chỉ tiêu</div></td>
        </tr>`;
    }).join('') || `<tr><td colspan="5"><div class="empty-state" style="padding:20px;"><i class="fas fa-seedling"></i><p>Chưa có nông hộ</p></div></td></tr>`;

    // ── Recent activity ──
    const recentHtml = auditLog.length === 0
        ? `<div class="empty-state" style="padding:24px;"><i class="fas fa-clock" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.3;"></i>Chưa có hoạt động</div>`
        : [...auditLog].reverse().slice(0, 8).map(a => {
            const colors = { green:'var(--success)', blue:'var(--info)', red:'var(--danger)', orange:'var(--warning)' };
            const c = colors[a.color] || 'var(--text-muted)';
            return `<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
                <div style="width:8px;height:8px;min-width:8px;background:${c};border-radius:50%;margin-top:5px;"></div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:13px;font-weight:500;">${a.action}</div>
                    <div style="font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.detail || ''}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${a.time || ''}</div>
                </div>
            </div>`;
        }).join('');

    // ── Tiến độ ──
    const steps = [
        { label: 'Đăng ký nông hộ',    done: farmCount > 0,          icon: 'fa-seedling' },
        { label: 'Khảo sát Drone',      done: droneData.length > 0,   icon: 'fa-helicopter' },
        { label: 'Lấy mẫu đất SOC',     done: socData.length > 0,     icon: 'fa-vial' },
        { label: 'Nhật ký canh tác',    done: diaryCount > 0,         icon: 'fa-book' },
        { label: 'Tính toán phát thải', done: beginSOC.length > 0 && endSOC.length > 0, icon: 'fa-calculator' },
    ];
    const progressPct = Math.round(steps.filter(s => s.done).length / steps.length * 100);
    const stepsHtml = steps.map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;">
            <div style="width:28px;height:28px;min-width:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;
                background:${s.done ? 'var(--primary)' : 'var(--surface)'};
                color:${s.done ? '#fff' : 'var(--text-muted)'};
                border:1px solid ${s.done ? 'var(--primary)' : 'var(--border)'};">
                <i class="fas ${s.done ? 'fa-check' : s.icon}"></i>
            </div>
            <span style="font-size:13px;color:${s.done ? 'var(--text)' : 'var(--text-muted)'};">${s.label}</span>
        </div>`).join('');

    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Tổng quan hệ thống MRV</h1>
            <p class="page-desc">Theo dõi dữ liệu đo lường, báo cáo và xác minh tín chỉ các-bon</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('farm-mgmt')">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-seedling"></i></div>
                <div class="stat-value">${farmCount || '--'}</div>
                <div class="stat-label">Nông hộ đang giám sát</div>
            </div>
            <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('farm-map')">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-map-marked-alt"></i></div>
                <div class="stat-value">${totalArea > 0 ? totalArea.toFixed(1) + ' ha' : '-- ha'}</div>
                <div class="stat-label">Tổng diện tích</div>
            </div>
            <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('soil-data')">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-leaf"></i></div>
                <div class="stat-value" style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                    ${co2Str} <span style="font-size:14px;">tCO₂</span>${co2Badge}
                </div>
                <div class="stat-label">ΔCO₂_soil ước tính (VM0042)</div>
            </div>
            <div class="stat-card" style="cursor:pointer;" onclick="navigateTo('farm-diary')">
                <div class="stat-glow red"></div>
                <div class="stat-icon red"><i class="fas fa-book"></i></div>
                <div class="stat-value">${diaryCount || '--'}</div>
                <div class="stat-label">Nhật ký canh tác</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-chart-bar"></i> Lượng N bón theo đợt (kg N)</div>
                </div>
                <div style="padding:16px;">
                    ${diaries.length === 0
                        ? `<div class="chart-placeholder"><i class="fas fa-chart-bar"></i><p>Chưa có dữ liệu nhật ký</p></div>`
                        : `<div style="display:flex;align-items:flex-end;gap:6px;height:140px;padding:0 4px;">${chartBars}</div>
                           <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11px;color:var(--text-muted);">
                               <span>Tổng N: <strong style="color:var(--text);">${totalN.toFixed(1)} kg N/năm</strong></span>
                               <span>${diaries.length} lần bón</span>
                           </div>`
                    }
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-tasks"></i> Tiến độ MRV (${progressPct}%)</div>
                </div>
                <div style="padding:16px;">
                    <div style="background:var(--border);border-radius:6px;height:8px;overflow:hidden;margin-bottom:16px;">
                        <div style="width:${progressPct}%;height:100%;background:linear-gradient(90deg,var(--primary),var(--primary-light));transition:.6s;border-radius:6px;"></div>
                    </div>
                    ${stepsHtml}
                </div>
            </div>
        </div>

        <div class="grid-2" style="margin-top:20px;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-vial"></i> Trữ lượng SOC theo nông hộ</div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr>
                            <th>Nông hộ</th><th>Diện tích</th>
                            <th>SOC đầu vụ (tC/ha)</th><th>SOC cuối vụ (tC/ha)</th>
                            <th>Tiến độ</th>
                        </tr></thead>
                        <tbody>${farmSOCRows}</tbody>
                    </table>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-history"></i> Hoạt động gần đây</div>
                </div>
                <div style="padding:0 16px 8px;max-height:280px;overflow-y:auto;" id="recent-activity">
                    ${recentHtml}
                </div>
            </div>
        </div>
    `;
}
