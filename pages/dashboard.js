/* ========== DASHBOARD PAGE ========== */
function renderDashboard(container) {
    const isAdmin = currentUser.role === 'admin';
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Tổng quan hệ thống MRV</h1>
            <p class="page-desc">Theo dõi dữ liệu đo lường, báo cáo và xác minh tín chỉ các-bon</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-glow green"></div>
                <div class="stat-icon green"><i class="fas fa-seedling"></i></div>
                <div class="stat-value" id="stat-farms">--</div>
                <div class="stat-label">Nông hộ đang giám sát</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow blue"></div>
                <div class="stat-icon blue"><i class="fas fa-tree"></i></div>
                <div class="stat-value" id="stat-area">-- ha</div>
                <div class="stat-label">Tổng diện tích</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow orange"></div>
                <div class="stat-icon orange"><i class="fas fa-cloud"></i></div>
                <div class="stat-value" id="stat-co2">-- tCO₂</div>
                <div class="stat-label">CO₂ hấp thụ ước tính</div>
            </div>
            <div class="stat-card">
                <div class="stat-glow red"></div>
                <div class="stat-icon red"><i class="fas fa-file-signature"></i></div>
                <div class="stat-value" id="stat-logs">--</div>
                <div class="stat-label">Nhật ký canh tác</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-chart-area"></i> Xu hướng hấp thụ CO₂</div>
                </div>
                <div class="chart-placeholder">
                    <i class="fas fa-chart-line"></i>
                    <p>Biểu đồ sẽ hiển thị khi có dữ liệu</p>
                    <span style="font-size:11px;color:var(--text-muted);">Công thức tính toán sẽ được cập nhật sau</span>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-broadcast-tower"></i> Trạng thái thiết bị IoT</div>
                </div>
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead><tr><th>Thiết bị</th><th>Nông hộ</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead>
                        <tbody id="iot-status-table">
                            <tr><td colspan="4" class="empty-state" style="padding:24px;"><i class="fas fa-inbox" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.3;"></i>Chưa có dữ liệu thiết bị</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        ${isAdmin ? `
        <div class="grid-2" style="margin-top:20px;">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-tasks"></i> Tiến độ xác minh</div>
                </div>
                <div class="chart-placeholder">
                    <i class="fas fa-chart-pie"></i>
                    <p>Biểu đồ tiến độ xác minh</p>
                </div>
            </div>
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-history"></i> Hoạt động gần đây</div>
                </div>
                <div id="recent-activity">
                    <div class="empty-state" style="padding:24px;">
                        <i class="fas fa-clock" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.3;"></i>
                        Chưa có hoạt động
                    </div>
                </div>
            </div>
        </div>` : ''}
    `;
}
