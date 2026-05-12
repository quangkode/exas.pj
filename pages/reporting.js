/* ========== REPORTS (Báo cáo VM0042) - Admin only ========== */
function renderReports(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Báo cáo VM0042</h1>
            <p class="page-desc">Xuất báo cáo định kỳ theo chuẩn VCS+CCB Verification Report — VM0042 Verra</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-file-alt"></i></div>
                <div class="stat-value" id="rpt-total-diaries">--</div>
                <div class="stat-label">Nhật ký canh tác</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-vial"></i></div>
                <div class="stat-value" id="rpt-total-soc">--</div>
                <div class="stat-label">Mẫu đất SOC</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-calculator"></i></div>
                <div class="stat-value" id="rpt-total-emission">-- tCO₂e</div>
                <div class="stat-label">Phát thải dự án</div>
            </div>
        </div>

        <div class="grid-2" style="margin-bottom:20px;">
            <!-- PDF Export -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-file-pdf" style="color:#e74c3c;"></i> Xuất PDF — VCS+CCB Report</div>
                </div>
                <div style="padding:20px;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Loại báo cáo</label>
                            <select id="report-type">
                                <option value="verification">Báo cáo xác minh (Verification Report)</option>
                                <option value="monitoring">Báo cáo giám sát (Monitoring Report)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Kỳ báo cáo</label>
                            <select id="report-period">
                                <option>Quý 1/2025</option><option>Quý 2/2025</option>
                                <option>Quý 3/2025</option><option>Quý 4/2025</option>
                                <option>Năm 2025</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tên dự án</label>
                            <input type="text" id="rpt-project-name" placeholder="VD: Dự án Carbon Dừa Bến Tre" value="Dự án Carbon Nông nghiệp VM0042">
                        </div>
                        <div class="form-group">
                            <label>Đơn vị chuẩn bị</label>
                            <input type="text" id="rpt-prepared-by" placeholder="Tổ chức / cá nhân" value="ExAS MRV System">
                        </div>
                    </div>
                    <button class="btn btn-primary" style="width:100%;" onclick="generateReport()">
                        <i class="fas fa-print"></i> Xuất PDF / In báo cáo
                    </button>
                </div>
            </div>

            <!-- CSV Export -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-file-csv" style="color:#27ae60;"></i> Xuất CSV / Excel</div>
                </div>
                <div style="padding:20px;">
                    <div style="background:var(--bg-light);border-radius:8px;padding:14px;margin-bottom:16px;">
                        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">File CSV sẽ bao gồm:</div>
                        <ul style="font-size:12px;color:var(--text-secondary);margin:0;padding-left:16px;line-height:1.8;">
                            <li>Nhật ký canh tác (toàn bộ)</li>
                            <li>Dữ liệu SOC / M<sub>n,dl,SOC</sub></li>
                            <li>Tính toán phát thải EFF, EL, N₂O</li>
                            <li>Tổng hợp GHG theo VM0042</li>
                        </ul>
                    </div>
                    <div class="form-group" style="margin-bottom:12px;">
                        <label>Lọc theo nông hộ (tuỳ chọn)</label>
                        <select id="rpt-csv-farm">
                            <option value="">Tất cả nông hộ</option>
                        </select>
                    </div>
                    <button class="btn btn-secondary" style="width:100%;border-color:var(--success);color:var(--success);" onclick="exportCSV()">
                        <i class="fas fa-download"></i> Tải xuống CSV
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-table"></i> Xem trước số liệu GHG</div></div>
            <div style="padding:20px;">
                <table class="data-table" style="width:100%;">
                    <thead>
                        <tr style="background:#1a5276;color:white;">
                            <th style="color:white;">GHG Emission Reductions or Removals</th>
                            <th style="color:white;text-align:right;">tCO₂e</th>
                            <th style="color:white;">Nguồn dữ liệu</th>
                        </tr>
                    </thead>
                    <tbody id="rpt-ghg-preview">
                        <tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:20px;">Đang tải dữ liệu...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setTimeout(loadReportStats, 100);
}

/* ===== DATA HELPERS ===== */

function getReportEmissionData() {
    const diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');

    let fuelDiesel = 0, fuelPetrol = 0, fuelLpg = 0;
    let limestone = 0, dolomite = 0, fsn = 0, fon = 0, maxArea = 1;

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

    const eff = (fuelDiesel * 0.00268) + (fuelPetrol * 0.00231) + (fuelLpg * 0.00163);
    const el = ((limestone * 0.12) + (dolomite * 0.13)) * (44 / 12);
    const n2o = (fsn + fon) * 0.01 * (44 / 28) * 265 / 1000 / maxArea;
    const totalProject = eff + el;

    return { eff, el, n2o, totalProject, fuelDiesel, fuelPetrol, fuelLpg, limestone, dolomite, fsn, fon, maxArea };
}

function getSOCChangeSummary() {
    const socData = JSON.parse(localStorage.getItem('mrv_soc') || '[]');
    const endSamples = socData.filter(e => !e.isBeginning && e.socMassVM0042);
    const beginSamples = socData.filter(e => e.isBeginning && e.socMassVM0042);
    const avgEnd = endSamples.length > 0 ? endSamples.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / endSamples.length : 0;
    const avgBegin = beginSamples.length > 0 ? beginSamples.reduce((s, e) => s + parseFloat(e.socMassVM0042), 0) / beginSamples.length : 0;
    return { avgBegin, avgEnd, delta: avgEnd - avgBegin, totalSamples: socData.length };
}

function loadReportStats() {
    const diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const soc = JSON.parse(localStorage.getItem('mrv_soc') || '[]');
    const em = getReportEmissionData();

    const el1 = document.getElementById('rpt-total-diaries');
    const el2 = document.getElementById('rpt-total-soc');
    const el3 = document.getElementById('rpt-total-emission');
    if (el1) el1.textContent = diaries.length;
    if (el2) el2.textContent = soc.length;
    if (el3) el3.textContent = em.totalProject.toFixed(4) + ' tCO₂e';

    // Populate farm filter for CSV
    const farms = [...new Set(diaries.map(e => e.farm))].filter(Boolean);
    const sel = document.getElementById('rpt-csv-farm');
    if (sel) sel.innerHTML = '<option value="">Tất cả nông hộ</option>' + farms.map(f => `<option value="${f}">${f}</option>`).join('');

    // GHG preview table
    const socSum = getSOCChangeSummary();
    const tbody = document.getElementById('rpt-ghg-preview');
    if (tbody) {
        tbody.innerHTML = `
            <tr><td>Baseline Emissions</td><td style="text-align:right;">--</td><td style="color:var(--text-muted);font-size:12px;">Chưa thiết lập đường cơ sở</td></tr>
            <tr style="background:var(--bg-light);">
                <td><strong>Project Emissions (EFF + EL)</strong></td>
                <td style="text-align:right;font-weight:bold;color:var(--danger);">${em.totalProject.toFixed(4)}</td>
                <td style="font-size:12px;">EFF=${em.eff.toFixed(4)} + EL=${em.el.toFixed(4)}</td>
            </tr>
            <tr>
                <td style="padding-left:24px;color:var(--text-muted);">→ EFF (Nhiên liệu hóa thạch)</td>
                <td style="text-align:right;">${em.eff.toFixed(4)}</td>
                <td style="font-size:12px;">FFC × EF_CO₂</td>
            </tr>
            <tr>
                <td style="padding-left:24px;color:var(--text-muted);">→ EL (Vôi/Dolomite)</td>
                <td style="text-align:right;">${em.el.toFixed(4)}</td>
                <td style="font-size:12px;">(M_lime × EF) × 44/12</td>
            </tr>
            <tr>
                <td style="padding-left:24px;color:var(--text-muted);">→ N₂O_fert (Phân bón)</td>
                <td style="text-align:right;">${em.n2o.toFixed(4)} /ha</td>
                <td style="font-size:12px;">(FSN+FON) × EF × 44/28 × GWP/1000/A</td>
            </tr>
            <tr><td>Leakage</td><td style="text-align:right;">--</td><td style="font-size:12px;color:var(--text-muted);">Chưa tính</td></tr>
            <tr style="background:#1a5276;">
                <td style="color:white;font-weight:bold;">ΔCO₂_soil — SOC Change (VM0042)</td>
                <td style="text-align:right;color:#2ecc71;font-weight:bold;">${socSum.delta.toFixed(4)}</td>
                <td style="color:rgba(255,255,255,0.7);font-size:12px;">tC/ha (${socSum.totalSamples} mẫu)</td>
            </tr>
        `;
    }
}

/* ===== PDF EXPORT ===== */

function generateReport() {
    const projectName = document.getElementById('rpt-project-name')?.value || 'Dự án Carbon VM0042';
    const preparedBy = document.getElementById('rpt-prepared-by')?.value || 'ExAS MRV System';
    const reportPeriod = document.getElementById('report-period')?.value || 'Năm 2025';
    const reportType = document.getElementById('report-type')?.value || 'verification';
    const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
    const todayShort = new Date().toISOString().slice(0, 10);

    const em = getReportEmissionData();
    const soc = getSOCChangeSummary();
    const diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    const socData = JSON.parse(localStorage.getItem('mrv_soc') || '[]');

    const reportTitle = reportType === 'verification' ? 'VERIFICATION REPORT' : 'MONITORING REPORT';
    const reportSubtitle = 'VCS Version 4, VM0042 Methodology';

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${reportTitle} - ${projectName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size:10pt; color:#000; background:#fff; }
  .page { max-width:210mm; margin:0 auto; padding:20mm 18mm; }

  /* Header */
  .report-header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #1a5276; padding-bottom:12px; margin-bottom:20px; }
  .logo-area { display:flex; gap:12px; align-items:center; }
  .logo-box { background:#1a5276; color:white; padding:6px 12px; font-weight:bold; font-size:11pt; border-radius:4px; }
  .logo-box.green { background:#1e8449; }
  .header-title { text-align:right; }
  .header-title h1 { color:#1a5276; font-size:18pt; font-weight:bold; }
  .header-title p { color:#555; font-style:italic; font-size:9pt; }

  /* Title page */
  .title-center { text-align:center; margin:40px 0; }
  .title-center h1 { font-size:28pt; font-weight:bold; color:#1a5276; margin-bottom:12px; }
  .title-center p { font-size:11pt; color:#555; }

  /* Metadata table */
  .meta-table { width:100%; border-collapse:collapse; margin:20px 0; }
  .meta-table td { padding:8px 12px; border:1px solid #ddd; font-size:10pt; }
  .meta-table td:first-child { background:#1a5276; color:white; font-weight:bold; width:30%; text-align:right; white-space:nowrap; }
  .meta-table td:last-child { font-style:italic; color:#333; }

  /* Section headers */
  h2.section { color:#1a5276; font-size:13pt; margin:24px 0 8px; border-bottom:1px solid #1a5276; padding-bottom:4px; }
  h3.subsection { color:#1a5276; font-size:11pt; margin:16px 0 6px; }

  /* Summary box */
  .summary-box { background:#f0f4f8; border-left:4px solid #1a5276; padding:14px 16px; margin:12px 0; border-radius:0 4px 4px 0; }

  /* GHG Table */
  .ghg-table { width:100%; border-collapse:collapse; margin:14px 0; }
  .ghg-table th { background:#1a5276; color:white; padding:10px 14px; text-align:left; font-size:10pt; }
  .ghg-table th:last-child { text-align:right; }
  .ghg-table td { padding:8px 14px; border-bottom:1px solid #e0e0e0; font-size:10pt; }
  .ghg-table td:last-child { text-align:right; font-weight:bold; }
  .ghg-table tr.net { background:#1a5276; }
  .ghg-table tr.net td { color:white; font-weight:bold; }
  .ghg-table tr.sub td:first-child { padding-left:28px; color:#555; font-style:italic; }
  .ghg-table tr:nth-child(even) { background:#f8f8f8; }

  /* Checklist */
  .checklist-table { width:100%; border-collapse:collapse; margin:10px 0; }
  .checklist-table th { background:#1e8449; color:white; padding:8px 12px; font-size:10pt; }
  .checklist-table td { padding:7px 12px; border-bottom:1px solid #e0e0e0; font-size:10pt; }
  .checklist-table td.section-head { background:#1a5276; color:white; font-weight:bold; padding:6px 12px; }
  .check-yes { color:#1e8449; font-weight:bold; }
  .check-no { color:#e74c3c; font-weight:bold; }

  /* Data table */
  .data-table { width:100%; border-collapse:collapse; margin:10px 0; font-size:9pt; }
  .data-table th { background:#2c3e50; color:white; padding:7px 10px; }
  .data-table td { padding:6px 10px; border-bottom:1px solid #eee; }
  .data-table tr:nth-child(even) { background:#f9f9f9; }

  /* Page break */
  .page-break { page-break-after:always; }

  /* Footer */
  .footer { border-top:1px solid #ccc; margin-top:30px; padding-top:8px; display:flex; justify-content:space-between; font-size:8pt; color:#888; }

  @media print {
    .page { padding:15mm; }
    body { font-size:9pt; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="report-header">
    <div class="logo-area">
      <div class="logo-box">VCS</div>
      <div class="logo-box green">CCB</div>
    </div>
    <div class="header-title">
      <h1>${reportTitle}</h1>
      <p>${reportSubtitle}</p>
    </div>
  </div>

  <!-- TITLE PAGE -->
  <div class="title-center">
    <h1>${projectName}</h1>
    <p>ExAS MRV System — Hệ thống Đo lường, Báo cáo & Xác minh</p>
    <p style="margin-top:8px;color:#888;font-size:9pt;">Phương pháp luận VM0042 — Verra Verified Carbon Standard</p>
  </div>

  <table class="meta-table">
    <tr><td>Project Title</td><td>${projectName}</td></tr>
    <tr><td>Report Title</td><td>${reportTitle} — ${reportPeriod}</td></tr>
    <tr><td>Version</td><td>v1.0</td></tr>
    <tr><td>Report ID</td><td>EXAS-${todayShort.replace(/-/g,'')}-001</td></tr>
    <tr><td>Date of Issue</td><td>${today}</td></tr>
    <tr><td>Prepared By</td><td>${preparedBy}</td></tr>
    <tr><td>Reporting Period</td><td>${reportPeriod}</td></tr>
    <tr><td>Methodology</td><td>VM0042 — Verra VCS Version 4</td></tr>
    <tr><td>Pages</td><td>Auto-generated</td></tr>
  </table>

  <!-- SUMMARY -->
  <h2 class="section">Summary</h2>
  <div class="summary-box">
    <strong>Mô tả dự án:</strong> ${projectName} áp dụng phương pháp luận VM0042 của Verra để đo lường và giám sát sự thay đổi trữ lượng carbon hữu cơ trong đất (SOC) và phát thải khí nhà kính từ hoạt động canh tác nông nghiệp.<br><br>
    <strong>Kỳ giám sát:</strong> ${reportPeriod}<br>
    <strong>Số nhật ký canh tác:</strong> ${diaries.length} bản ghi<br>
    <strong>Số mẫu đất SOC:</strong> ${socData.length} mẫu (${soc.totalSamples} tổng)<br>
    <strong>Phương pháp xác minh:</strong> Thu thập dữ liệu thực địa, phân tích phòng lab, áp dụng hệ số phát thải IPCC Tier 1
  </div>

  <div class="page-break"></div>

  <!-- ===== SECTION 8: GHG QUANTIFICATION ===== -->
  <div class="report-header">
    <div class="logo-area"><div class="logo-box">VCS</div><div class="logo-box green">CCB</div></div>
    <div class="header-title"><h1>${reportTitle}</h1><p>${reportSubtitle}</p></div>
  </div>

  <h2 class="section">8 — Quantification of GHG Emission Reductions and Removals</h2>

  <p style="color:#555;font-style:italic;margin-bottom:12px;">
    Reporting period: ${reportPeriod} &nbsp;|&nbsp; Date: ${today}
  </p>

  <p style="margin-bottom:8px;font-weight:bold;">Verified GHG emission reductions or removals in the above reporting period:</p>

  <table class="ghg-table">
    <thead>
      <tr><th>GHG Emission Reductions or Removals</th><th style="text-align:right;">tCO₂e</th><th>Ghi chú</th></tr>
    </thead>
    <tbody>
      <tr><td>Baseline Emissions</td><td>—</td><td style="font-size:9pt;color:#888;">Chưa thiết lập đường cơ sở</td></tr>
      <tr><td><strong>Project Emissions (tổng)</strong></td><td>${em.totalProject.toFixed(4)}</td><td style="font-size:9pt;">EFF + EL</td></tr>
      <tr class="sub"><td>→ EFF — Nhiên liệu hóa thạch</td><td>${em.eff.toFixed(4)}</td><td style="font-size:9pt;">FFC × EF_CO₂ (IPCC)</td></tr>
      <tr class="sub"><td>→ EL — Bón vôi/Dolomite</td><td>${em.el.toFixed(4)}</td><td style="font-size:9pt;">((M_lime×0.12)+(M_dolo×0.13))×44/12</td></tr>
      <tr class="sub"><td>→ N₂O_fert — Phân bón</td><td>${em.n2o.toFixed(4)} /ha</td><td style="font-size:9pt;">(FSN+FON)×EF×44/28×GWP/1000/A</td></tr>
      <tr><td>Leakage</td><td>—</td><td style="font-size:9pt;color:#888;">Chưa tính</td></tr>
      <tr><td><strong>ΔCO₂_soil — SOC Change (VM0042)</strong></td><td style="color:${soc.delta >= 0 ? '#1e8449' : '#e74c3c'};">${soc.delta.toFixed(4)}</td><td style="font-size:9pt;">tC/ha (${soc.totalSamples} mẫu)</td></tr>
      <tr class="net"><td>Net GHG emission reductions or removals</td><td>—</td><td style="color:rgba(255,255,255,0.7);font-size:9pt;">Cần baseline để tính net</td></tr>
    </tbody>
  </table>

  <!-- Fuel detail -->
  <h3 class="subsection">8.1 Chi tiết — EFF (Nhiên liệu hóa thạch)</h3>
  <table class="data-table">
    <thead><tr><th>Loại nhiên liệu (j)</th><th>FFC (lít)</th><th>EF_CO₂ (tCO₂/lít)</th><th>EFF_j (tCO₂e)</th></tr></thead>
    <tbody>
      <tr><td>Diesel</td><td>${em.fuelDiesel.toFixed(2)}</td><td>0.00268</td><td>${(em.fuelDiesel*0.00268).toFixed(4)}</td></tr>
      <tr><td>Xăng (Petrol)</td><td>${em.fuelPetrol.toFixed(2)}</td><td>0.00231</td><td>${(em.fuelPetrol*0.00231).toFixed(4)}</td></tr>
      <tr><td>LPG</td><td>${em.fuelLpg.toFixed(2)}</td><td>0.00163</td><td>${(em.fuelLpg*0.00163).toFixed(4)}</td></tr>
      <tr style="background:#eaf2ff;font-weight:bold;"><td colspan="3">Tổng EFF</td><td>${em.eff.toFixed(4)}</td></tr>
    </tbody>
  </table>

  <!-- Liming detail -->
  <h3 class="subsection">8.2 Chi tiết — EL (Vôi/Dolomite)</h3>
  <table class="data-table">
    <thead><tr><th>Loại</th><th>Khối lượng (tấn)</th><th>EF (tC/tấn)</th><th>Trước × 44/12</th></tr></thead>
    <tbody>
      <tr><td>Vôi (Limestone)</td><td>${em.limestone.toFixed(3)}</td><td>0.12</td><td>${(em.limestone*0.12).toFixed(4)}</td></tr>
      <tr><td>Dolomite</td><td>${em.dolomite.toFixed(3)}</td><td>0.13</td><td>${(em.dolomite*0.13).toFixed(4)}</td></tr>
      <tr style="background:#eaf2ff;font-weight:bold;"><td colspan="3">EL = (tổng trên) × 44/12</td><td>${em.el.toFixed(4)}</td></tr>
    </tbody>
  </table>

  <!-- N2O detail -->
  <h3 class="subsection">8.3 Chi tiết — N₂O_fert (Phân bón)</h3>
  <table class="data-table">
    <thead><tr><th>Thông số</th><th>Giá trị</th><th>Đơn vị</th></tr></thead>
    <tbody>
      <tr><td>FSN (Phân tổng hợp)</td><td>${em.fsn.toFixed(3)}</td><td>kg N</td></tr>
      <tr><td>FON (Phân hữu cơ)</td><td>${em.fon.toFixed(3)}</td><td>kg N</td></tr>
      <tr><td>FSN + FON</td><td>${(em.fsn+em.fon).toFixed(3)}</td><td>kg N</td></tr>
      <tr><td>EF_Ndirect (IPCC Tier 1)</td><td>0.01</td><td>kg N₂O-N / kg N</td></tr>
      <tr><td>GWP_N₂O (AR5)</td><td>265</td><td>kg CO₂e / kg N₂O</td></tr>
      <tr><td>Diện tích A_i</td><td>${em.maxArea.toFixed(2)}</td><td>ha</td></tr>
      <tr style="background:#eaf2ff;font-weight:bold;"><td>N₂O_fert</td><td>${em.n2o.toFixed(4)}</td><td>t CO₂e/ha</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ===== SOC DATA ===== -->
  <div class="report-header">
    <div class="logo-area"><div class="logo-box">VCS</div><div class="logo-box green">CCB</div></div>
    <div class="header-title"><h1>${reportTitle}</h1><p>${reportSubtitle}</p></div>
  </div>

  <h2 class="section">SOC Monitoring Data — VM0042</h2>
  <table class="data-table">
    <thead><tr><th>Ngày</th><th>Nông hộ</th><th>Lớp đất</th><th>OC (g/kg)</th><th>M_sample (g)</th><th>D (mm)</th><th>N</th><th>M_n,dl,SOC (tC/ha)</th><th>Thời kỳ</th></tr></thead>
    <tbody>
      ${socData.length === 0
        ? '<tr><td colspan="9" style="text-align:center;color:#888;">Chưa có dữ liệu</td></tr>'
        : socData.map(e => `<tr>
          <td>${e.date}</td><td>${e.farm}</td><td>${e.layer}</td>
          <td>${e.ocGperKg || (e.soc ? (e.soc*10).toFixed(1) : '--')}</td>
          <td>${e.mSample || '--'}</td><td>${e.tubeDiameter || '--'}</td><td>${e.numCores || '--'}</td>
          <td style="font-weight:bold;color:#1a5276;">${e.socMassVM0042 != null ? parseFloat(e.socMassVM0042).toFixed(4) : '--'}</td>
          <td>${e.isBeginning ? 'Đầu vụ' : 'Cuối vụ'}</td>
        </tr>`).join('')
      }
    </tbody>
  </table>

  <h3 class="subsection">SOC Summary</h3>
  <table class="data-table">
    <thead><tr><th>Chỉ số</th><th>Giá trị</th><th>Đơn vị</th></tr></thead>
    <tbody>
      <tr><td>SOC_wp,i,t-x (Đầu vụ TB)</td><td>${soc.avgBegin.toFixed(4)}</td><td>tC/ha</td></tr>
      <tr><td>SOC_wp,i,t (Cuối vụ TB)</td><td>${soc.avgEnd.toFixed(4)}</td><td>tC/ha</td></tr>
      <tr style="font-weight:bold;background:#eaf2ff;"><td>ΔCO₂_soil (thay đổi SOC)</td><td style="color:${soc.delta>=0?'#1e8449':'#e74c3c'};">${soc.delta.toFixed(4)}</td><td>tC/ha</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ===== FARM DIARY ===== -->
  <div class="report-header">
    <div class="logo-area"><div class="logo-box">VCS</div><div class="logo-box green">CCB</div></div>
    <div class="header-title"><h1>${reportTitle}</h1><p>${reportSubtitle}</p></div>
  </div>

  <h2 class="section">Monitoring Data — Farm Diary (Nhật ký canh tác)</h2>
  <table class="data-table">
    <thead><tr><th>Ngày</th><th>Nông hộ</th><th>Loại phân / N</th><th>N (kg)</th><th>Vôi (t)</th><th>Dolomite (t)</th><th>Nhiên liệu</th><th>Lít</th><th>Diện tích (ha)</th></tr></thead>
    <tbody>
      ${diaries.length === 0
        ? '<tr><td colspan="9" style="text-align:center;color:#888;">Chưa có dữ liệu</td></tr>'
        : diaries.map(e => `<tr>
          <td>${e.date}</td><td>${e.farm}</td>
          <td>${e.fertilizerType || '--'} ${e.nCategory ? '['+e.nCategory+']' : ''}</td>
          <td>${e.nKg > 0 ? e.nKg : '--'}</td>
          <td>${e.limestone > 0 ? e.limestone : '--'}</td>
          <td>${e.dolomite > 0 ? e.dolomite : '--'}</td>
          <td>${e.fuelType || '--'}</td><td>${e.fuel > 0 ? e.fuel : '--'}</td>
          <td>${e.area > 0 ? e.area : '--'}</td>
        </tr>`).join('')
      }
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- ===== CCB CHECKLIST ===== -->
  <div class="report-header">
    <div class="logo-area"><div class="logo-box">VCS</div><div class="logo-box green">CCB</div></div>
    <div class="header-title"><h1>${reportTitle}</h1><p>${reportSubtitle}</p></div>
  </div>

  <h2 class="section">CCB Standards Criteria Checklist</h2>
  <table class="checklist-table">
    <thead><tr><th>Criteria</th><th style="text-align:center;">Conformance</th></tr></thead>
    <tbody>
      <tr><td class="section-head" colspan="2">GENERAL SECTION</td></tr>
      <tr><td>G1. Original Conditions in the Project Area (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>G2. Baseline Projections (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>G3. Project Design and Goals (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>G4. Management Capacity and Best Practices (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>G5. Legal Status and Property Rights (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td class="section-head" colspan="2">CLIMATE SECTION</td></tr>
      <tr><td>CL1. Net Positive Climate Impacts (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>CL2. Offsite Climate Impacts / Leakage (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>CL3. Climate Impact Monitoring (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td class="section-head" colspan="2">COMMUNITY SECTION</td></tr>
      <tr><td>CM1. Net Positive Community Impacts (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>CM2. Offsite Community Impacts (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>CM3. Community Impact Monitoring (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td class="section-head" colspan="2">BIODIVERSITY SECTION</td></tr>
      <tr><td>B1. Net Positive Biodiversity Impacts (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>B2. Offsite Biodiversity Impacts (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>B3. Biodiversity Impact Monitoring (Required)</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td class="section-head" colspan="2">GOLD SECTION (Optional)</td></tr>
      <tr><td>GL1. Climate Change Adaptation Benefits</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>GL2. Exceptional Community Benefits</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
      <tr><td>GL3. Exceptional Biodiversity Benefits</td><td style="text-align:center;">YES __&nbsp;&nbsp; NO __</td></tr>
    </tbody>
  </table>

  <div class="footer">
    <span>ExAS MRV System — VM0042 Verra</span>
    <span>EXAS-${todayShort.replace(/-/g,'')}-001</span>
    <span>${today}</span>
  </div>

</div>
<script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
}

/* ===== CSV EXPORT ===== */

function exportCSV() {
    const farmFilter = document.getElementById('rpt-csv-farm')?.value || '';
    const today = new Date().toISOString().slice(0, 10);
    const em = getReportEmissionData();
    const soc = getSOCChangeSummary();

    let diaries = JSON.parse(localStorage.getItem('mrv_diaries') || '[]');
    let socData = JSON.parse(localStorage.getItem('mrv_soc') || '[]');
    if (farmFilter) {
        diaries = diaries.filter(e => e.farm === farmFilter);
        socData = socData.filter(e => e.farm === farmFilter);
    }

    const q = v => `"${(v ?? '').toString().replace(/"/g, '""')}"`;
    const rows = [];

    // === HEADER ===
    rows.push([q('ExAS MRV System — Báo cáo giám sát VM0042')]);
    rows.push([q('Xuất ngày'), q(today)]);
    rows.push([q('Nông hộ'), q(farmFilter || 'Tất cả')]);
    rows.push([]);

    // === SECTION 1: EMISSION SUMMARY ===
    rows.push([q('=== TỔNG HỢP PHÁT THẢI DỰ ÁN ===')]);
    rows.push([q('Chỉ số'), q('Giá trị'), q('Đơn vị'), q('Công thức'), q('Hệ số EF (IPCC)')]);
    rows.push([q('EFF — Nhiên liệu hóa thạch'), q(em.eff.toFixed(5)), q('tCO₂e'), q('FFC × EF_CO₂'), q('Diesel=0.00268, Xăng=0.00231, LPG=0.00163')]);
    rows.push([q('  → FFC Diesel'), q(em.fuelDiesel.toFixed(2)), q('lít'), q(''), q('')]);
    rows.push([q('  → FFC Xăng'), q(em.fuelPetrol.toFixed(2)), q('lít'), q(''), q('')]);
    rows.push([q('  → FFC LPG'), q(em.fuelLpg.toFixed(2)), q('lít'), q(''), q('')]);
    rows.push([q('EL — Vôi/Dolomite'), q(em.el.toFixed(5)), q('tCO₂e'), q('((M_lime×EF)+(M_dolo×EF))×44/12'), q('EF_Lime=0.12, EF_Dolo=0.13')]);
    rows.push([q('  → Vôi (Limestone)'), q(em.limestone.toFixed(3)), q('tấn'), q(''), q('')]);
    rows.push([q('  → Dolomite'), q(em.dolomite.toFixed(3)), q('tấn'), q(''), q('')]);
    rows.push([q('N₂O_fert — Phân bón'), q(em.n2o.toFixed(5)), q('tCO₂e/ha'), q('(FSN+FON)×EF_Ndirect×(44/28)×GWP/1000/A'), q('EF=0.01, GWP=265')]);
    rows.push([q('  → FSN (Phân tổng hợp)'), q(em.fsn.toFixed(3)), q('kg N'), q(''), q('')]);
    rows.push([q('  → FON (Phân hữu cơ)'), q(em.fon.toFixed(3)), q('kg N'), q(''), q('')]);
    rows.push([q('  → Diện tích A_i'), q(em.maxArea.toFixed(2)), q('ha'), q(''), q('')]);
    rows.push([q('Tổng phát thải dự án (EFF+EL)'), q(em.totalProject.toFixed(5)), q('tCO₂e'), q(''), q('')]);
    rows.push([]);

    // === SECTION 2: SOC SUMMARY ===
    rows.push([q('=== TỔNG HỢP SOC (VM0042) ===')]);
    rows.push([q('SOC_wp,i,t-x (Đầu vụ TB)'), q(soc.avgBegin.toFixed(4)), q('tC/ha'), q('TB M_n,dl,SOC đầu vụ'), q('')]);
    rows.push([q('SOC_wp,i,t (Cuối vụ TB)'), q(soc.avgEnd.toFixed(4)), q('tC/ha'), q('TB M_n,dl,SOC cuối vụ'), q('')]);
    rows.push([q('ΔCO₂_soil'), q(soc.delta.toFixed(4)), q('tC/ha'), q('SOC_t - SOC_t-x'), q('')]);
    rows.push([q('Tổng số mẫu'), q(soc.totalSamples), q('mẫu'), q(''), q('')]);
    rows.push([]);

    // === SECTION 3: SOC RAW DATA ===
    rows.push([q('=== DỮ LIỆU MẪU ĐẤT SOC ===')]);
    rows.push([q('Ngày'), q('Nông hộ'), q('Lớp đất'), q('OC (g/kg)'), q('SOC (%)'), q('M_sample (g)'), q('D (mm)'), q('N'), q('M_n,dl,SOC (tC/ha)'), q('Thời kỳ'), q('Phòng lab'), q('Ghi chú')]);
    socData.forEach(e => {
        rows.push([
            q(e.date), q(e.farm), q(e.layer),
            q(e.ocGperKg || (e.soc ? (e.soc*10).toFixed(1) : '')),
            q(e.soc || ''), q(e.mSample || ''), q(e.tubeDiameter || ''), q(e.numCores || ''),
            q(e.socMassVM0042 != null ? parseFloat(e.socMassVM0042).toFixed(4) : ''),
            q(e.isBeginning ? 'Đầu vụ' : 'Cuối vụ'),
            q(e.lab || ''), q(e.notes || '')
        ]);
    });
    rows.push([]);

    // === SECTION 4: FARM DIARY ===
    rows.push([q('=== NHẬT KÝ CANH TÁC ===')]);
    rows.push([q('Ngày'), q('Nông hộ'), q('Loại cây'), q('Loại phân'), q('Phân loại N'), q('Lượng phân (kg)'), q('% N'), q('kg N'), q('Vôi (tấn)'), q('Dolomite (tấn)'), q('Loại NL'), q('Lít NL'), q('Diện tích (ha)'), q('Ghi chú')]);
    diaries.forEach(e => {
        rows.push([
            q(e.date), q(e.farm), q(e.crop || ''),
            q(e.fertilizerType || ''), q(e.nCategory || ''),
            q(e.fertilizerAmount || 0), q(e.nPercent || 0), q(e.nKg || 0),
            q(e.limestone || 0), q(e.dolomite || 0),
            q(e.fuelType || ''), q(e.fuel || 0), q(e.area || 0),
            q(e.notes || '')
        ]);
    });

    const csvContent = '﻿' + rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExAS-MRV-VM0042-${today}${farmFilter ? '-' + farmFilter : ''}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

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
