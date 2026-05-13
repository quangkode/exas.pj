/* ========== ExAS MRV - Core Application ========== */

// ===== USER ACCOUNTS =====
const USERS = {
    'giamsat': { password: 'gs@2025', name: 'Nguyễn Văn An', role: 'supervisor', displayRole: 'Giám sát viên' },
    'giamsat2': { password: 'gs2@2025', name: 'Trần Thị Bình', role: 'supervisor', displayRole: 'Giám sát viên' },
    'admin': { password: 'admin@2025', name: 'Lê Quang Minh', role: 'admin', displayRole: 'Quản trị viên' }
};

// ===== NAV CONFIG =====
const NAV_CONFIG = {
    supervisor: [
        { section: 'Đo lường' },
        { id: 'dashboard', icon: 'fa-chart-line', label: 'Tổng quan' },
        { id: 'farm-diary', icon: 'fa-book', label: 'Nhật ký canh tác' },
        { id: 'iot-data', icon: 'fa-microchip', label: 'Dữ liệu IoT' },
        { id: 'drone-data', icon: 'fa-helicopter', label: 'Dữ liệu Drone/LiDAR' },
        { id: 'soil-data', icon: 'fa-vial', label: 'Phân tích đất (SOC)' },
        { section: 'Xác minh' },
        { id: 'evidence', icon: 'fa-camera', label: 'Bằng chứng số' },
        { id: 'farm-map', icon: 'fa-map-marked-alt', label: 'Bản đồ nông hộ' },
    ],
    admin: [
        { section: 'Tổng quan' },
        { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'farm-map', icon: 'fa-map-marked-alt', label: 'Bản đồ nông hộ' },
        { section: 'Đo lường' },
        { id: 'farm-diary', icon: 'fa-book', label: 'Nhật ký canh tác' },
        { id: 'iot-data', icon: 'fa-microchip', label: 'Dữ liệu IoT' },
        { id: 'drone-data', icon: 'fa-helicopter', label: 'Dữ liệu Drone/LiDAR' },
        { id: 'soil-data', icon: 'fa-vial', label: 'Phân tích đất (SOC)' },
        { section: 'Báo cáo' },
        { id: 'reports', icon: 'fa-file-alt', label: 'Báo cáo VM0042' },
        { id: 'farm-recommend', icon: 'fa-clipboard-list', label: 'Đề xuất canh tác' },
        { id: 'emission-calc', icon: 'fa-calculator', label: 'Tính toán phát thải' },
        { section: 'Xác minh' },
        { id: 'evidence', icon: 'fa-camera', label: 'Bằng chứng số' },
        { id: 'audit-log', icon: 'fa-history', label: 'Audit Log' },
        { id: 'vvb-portal', icon: 'fa-shield-alt', label: 'Cổng VVB' },
        { section: 'Quản trị' },
        { id: 'user-mgmt', icon: 'fa-users-cog', label: 'Quản lý người dùng' },
        { id: 'farm-mgmt', icon: 'fa-seedling', label: 'Quản lý nông hộ' },
        { id: 'settings', icon: 'fa-cog', label: 'Cài đặt hệ thống' },
    ]
};

// ===== APP STATE =====
let currentUser = null;
let currentPage = 'dashboard';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initLogin();
    initDate();
    const saved = sessionStorage.getItem('mrv_user');
    if (saved) {
        currentUser = JSON.parse(saved);
        showApp();
    }
});

// ===== LOGIN PARTICLES =====
function initParticles() {
    const container = document.getElementById('login-particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
        container.appendChild(p);
    }
}

// ===== DATE =====
function initDate() {
    const el = document.getElementById('topbar-date');
    if (!el) return;
    const update = () => {
        const d = new Date();
        el.textContent = d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    };
    update();
    setInterval(update, 60000);
}

// ===== LOGIN =====
function initLogin() {
    const form = document.getElementById('login-form');
    const toggle = document.getElementById('toggle-password');
    const passInput = document.getElementById('login-password');

    toggle?.addEventListener('click', () => {
        const type = passInput.type === 'password' ? 'text' : 'password';
        passInput.type = type;
        toggle.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        if (USERS[username] && USERS[username].password === password) {
            currentUser = { username, ...USERS[username] };
            sessionStorage.setItem('mrv_user', JSON.stringify(currentUser));
            errorEl.style.display = 'none';
            showApp();
        } else {
            errorEl.style.display = 'flex';
        }
    });
}

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    document.getElementById('user-display-name').textContent = currentUser.name;
    document.getElementById('user-display-role').textContent = currentUser.displayRole;
    if (typeof initDefaultFarms === 'function') initDefaultFarms();
    buildNav();
    navigateTo('dashboard');
    initSidebar();
}

function logout() {
    sessionStorage.removeItem('mrv_user');
    currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
}

// ===== SIDEBAR =====
function buildNav() {
    const menu = document.getElementById('nav-menu');
    const items = NAV_CONFIG[currentUser.role] || [];
    menu.innerHTML = '';
    items.forEach(item => {
        if (item.section) {
            const li = document.createElement('li');
            li.className = 'nav-section';
            li.textContent = item.section;
            menu.appendChild(li);
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-page="${item.id}" id="nav-${item.id}"><i class="fas ${item.icon}"></i><span>${item.label}</span></a>`;
            li.querySelector('a').addEventListener('click', (e) => { e.preventDefault(); navigateTo(item.id); });
            menu.appendChild(li);
        }
    });
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
    document.getElementById('logout-btn')?.addEventListener('click', logout);
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target.id !== 'mobile-menu-btn') {
            sidebar.classList.remove('mobile-open');
        }
    });
}

// ===== ROUTING =====
function navigateTo(page) {
    currentPage = page;
    // Update active nav
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(`nav-${page}`)?.classList.add('active');
    // Update breadcrumb
    const navItem = [...NAV_CONFIG[currentUser.role]].find(i => i.id === page);
    document.getElementById('breadcrumb').innerHTML = `<span>${navItem?.label || page}</span>`;
    // Close mobile sidebar
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    // Render page
    renderPage(page);
}

function renderPage(page) {
    const content = document.getElementById('page-content');
    const renderers = {
        'dashboard': renderDashboard,
        'farm-diary': renderFarmDiary,
        'iot-data': renderIoTData,
        'drone-data': renderDroneData,
        'soil-data': renderSoilData,
        'evidence': renderEvidence,
        'farm-map': renderFarmMap,
        'reports': renderReports,
        'farm-recommend': renderFarmRecommend,
        'emission-calc': renderEmissionCalc,
        'audit-log': renderAuditLog,
        'vvb-portal': renderVVBPortal,
        'user-mgmt': renderUserMgmt,
        'farm-mgmt': renderFarmMgmt,
        'settings': renderSettings,
    };
    const fn = renderers[page];
    if (fn) {
        fn(content);
    } else {
        content.innerHTML = `<div class="empty-state"><i class="fas fa-tools"></i><p>Trang đang phát triển</p></div>`;
    }
}
