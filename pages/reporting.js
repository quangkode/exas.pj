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
            <div style="margin-top:12px;padding:16px;background:var(--surface);border-radius:var(--radius-sm);border:1px dashed var(--border);">
                <p style="color:var(--text-muted);font-size:13px;"><i class="fas fa-info-circle" style="color:var(--info);margin-right:6px;"></i>
                Mẫu báo cáo chuẩn VM0042 sẽ được cập nhật sau. Hệ thống sẽ tự động tổng hợp dữ liệu từ các nguồn đo lường và áp dụng hệ số phát thải theo phương pháp luận.</p>
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
            <p class="page-desc">Áp dụng hệ số phát thải theo phương pháp luận VM0042</p>
        </div>
        <div class="card">
            <div class="card-header"><div class="card-title"><i class="fas fa-calculator"></i> Bảng tính phát thải / hấp thụ</div></div>
            <div style="padding:20px;background:var(--surface);border-radius:var(--radius-sm);border:1px dashed var(--border);text-align:center;">
                <i class="fas fa-flask" style="font-size:48px;color:var(--primary-light);opacity:0.3;margin-bottom:16px;display:block;"></i>
                <p style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">Khu vực công thức tính toán</p>
                <p style="color:var(--text-muted);font-size:13px;">Các công thức phát thải/hấp thụ CO₂ theo VM0042 sẽ được điền vào đây sau.<br>
                Bao gồm: Baseline emissions, Project emissions, Leakage, Net GHG removals</p>
            </div>
        </div>
        <div class="grid-2" style="margin-top:20px;">
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-arrow-down"></i> Nguồn phát thải (Sources)</div></div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>Nguồn</th><th>Hệ số</th><th>Giá trị</th><th>Đơn vị</th></tr></thead>
                        <tbody>
                            <tr><td>Phân bón</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                            <tr><td>Nhiên liệu</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                            <tr><td>Nước tưới</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><div class="card-title"><i class="fas fa-arrow-up"></i> Nguồn hấp thụ (Sinks)</div></div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>Nguồn</th><th>Phương pháp</th><th>Giá trị</th><th>Đơn vị</th></tr></thead>
                        <tbody>
                            <tr><td>Sinh khối trên mặt đất</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                            <tr><td>Sinh khối dưới mặt đất</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                            <tr><td>SOC</td><td>(chờ cập nhật)</td><td>--</td><td>tCO₂e</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
