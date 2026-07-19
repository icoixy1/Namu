function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const logo = document.getElementById('sidebar-logo');
    const footer = document.getElementById('sidebar-footer');
    const navTexts = document.querySelectorAll('.nav-text');

    if (sidebar.classList.contains('w-64')) {
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-20');
        logo.classList.add('hidden');
        footer.classList.add('hidden');
        navTexts.forEach(text => text.classList.add('hidden'));
    } else {
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-64');
        logo.classList.remove('hidden');
        footer.classList.remove('hidden');
        navTexts.forEach(text => text.classList.remove('hidden'));
    }
}

function parseRoleLabel(role) {
    if (role === 'owner_admin') return 'Owner + Administrator';
    if (role === 'owner') return 'Owner';
    return 'Staff';
}

const SESSION_TIMEOUT_MS = 20 * 60 * 1000;

const firebaseConfig = {
  apiKey: "AIzaSyCrLEE8sWhawry7YN2kLwXC89e-nsEww5U",
  authDomain: "namu-7ed6f.firebaseapp.com",
  databaseURL: "https://namu-7ed6f-default-rtdb.firebaseio.com",
  projectId: "namu-7ed6f",
  storageBucket: "namu-7ed6f.firebasestorage.app",
  messagingSenderId: "652382598946",
  appId: "1:652382598946:web:a434c2c9d201914d77177b",
  measurementId: "G-MJ0W51M7DQ"
};

let firebaseDb = null;
let firebaseEnabled = false;
let accountsUnsubscribe = null;

function initFirebase() {
    try {
        if (!window.firebase) {
            console.warn('Firebase SDK tidak ditemukan. Pastikan script Firebase dimuat di index.html');
            return false;
        }
        if (!firebaseConfig || !firebaseConfig.projectId) {
            console.warn('firebaseConfig belum diisi di js/app.js');
            return false;
        }
        if (!window.firebase.apps || window.firebase.apps.length === 0) {
            window.firebase.initializeApp(firebaseConfig);
        }
        firebaseDb = window.firebase.firestore();
        firebaseEnabled = true;
        console.log('Firebase inisialisasi berhasil. Firestore siap.');
        return true;
    } catch (err) {
        console.error('Gagal inisialisasi Firebase:', err);
        firebaseEnabled = false;
        return false;
    }
}

async function fetchRemoteAccounts() {
    if (!firebaseEnabled || !firebaseDb) return null;
    try {
        const snapshot = await firebaseDb.collection('accounts').get();
        const accounts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            accounts.push({
                username: doc.id,
                password: String(data.password || '').trim(),
                role: data.role || 'staff',
                displayName: data.displayName || doc.id,
                online: Boolean(data.online),
                lastSeen: data.lastSeen || null
            });
        });
        return accounts;
    } catch (err) {
        console.warn('Gagal mengambil akun dari Firebase:', err);
        return null;
    }
}

async function saveAccountsToFirestore(accounts) {
    if (!firebaseEnabled || !firebaseDb) return;
    try {
        const batch = firebaseDb.batch();
        const accountsCollection = firebaseDb.collection('accounts');
        accounts.forEach(account => {
            const docRef = accountsCollection.doc(account.username);
            batch.set(docRef, {
                password: String(account.password || '').trim(),
                role: account.role,
                displayName: account.displayName,
                online: Boolean(account.online),
                lastSeen: account.lastSeen || null
            });
        });
        await batch.commit();
    } catch (err) {
        console.warn('Gagal menyimpan akun ke Firebase:', err);
    }
}

function subscribeAccountsRealtime() {
    if (!firebaseEnabled || !firebaseDb) return;
    try {
        if (accountsUnsubscribe) accountsUnsubscribe();
        accountsUnsubscribe = firebaseDb.collection('accounts')
            .onSnapshot(snap => {
                const accounts = [];
                snap.forEach(doc => {
                    const data = doc.data() || {};
                    accounts.push({
                        username: doc.id,
                        password: String(data.password || '').trim(),
                        role: data.role || 'staff',
                        displayName: data.displayName || doc.id,
                        online: Boolean(data.online),
                        lastSeen: data.lastSeen || null
                    });
                });
                localStorage.setItem('pos_accounts', JSON.stringify(accounts));
                try { renderAccounts(); } catch (e) { }
                console.log('Accounts synced from Firestore (snapshot).');
            }, err => {
                console.error('Firestore snapshot error:', err);
            });
    } catch (err) {
        console.error('Gagal mensubscribe accounts realtime:', err);
    }
}

// Helper: push semua akun lokal ke Firestore (panggil dari console di browser)
async function pushLocalAccountsToFirestore() {
    if (!firebaseEnabled) {
        console.warn('Firebase belum terinisialisasi. Panggil initFirebase() atau muat ulang halaman.');
        return;
    }
    const stored = localStorage.getItem('pos_accounts');
    if (!stored) {
        console.warn('Tidak ada data pos_accounts di localStorage.');
        return;
    }
    try {
        const accounts = JSON.parse(stored);
        if (!Array.isArray(accounts) || accounts.length === 0) {
            console.warn('pos_accounts kosong atau bukan array.');
            return;
        }
        await saveAccountsToFirestore(accounts);
        console.log('Akun lokal berhasil dipush ke Firestore.');
    } catch (err) {
        console.error('Gagal mempush akun lokal ke Firestore:', err);
    }
}

// Expose helpers for quick testing in console
window.initFirebaseApp = initFirebase;
window.pushLocalAccountsToFirestore = pushLocalAccountsToFirestore;
window.checkFirebaseStatus = function() {
    let localAccounts = null;
    try {
        localAccounts = JSON.parse(localStorage.getItem('pos_accounts') || '[]');
    } catch (e) {
        localAccounts = null;
    }
    return {
        firebaseEnabled,
        projectId: firebaseConfig?.projectId || null,
        hasFirestore: !!firebaseDb,
        localAccountsCount: Array.isArray(localAccounts) ? localAccounts.length : 0,
        localAccounts
    };
};
window.forceSyncAccounts = async function() {
    initFirebase();
    await syncRemoteAccountsToLocal();
    await pushLocalAccountsToFirestore();
    return window.checkFirebaseStatus();
};

function saveAccounts(accounts) {
    localStorage.setItem('pos_accounts', JSON.stringify(accounts));
    if (!firebaseEnabled) {
        console.log('Akun disimpan ke localStorage; Firebase belum aktif, jadi belum disinkronkan ke Firestore.');
        return;
    }
    saveAccountsToFirestore(accounts);
}

const LEGACY_ACCOUNT_ALIASES = {
    staff: 'staff1',
    owner: 'owner1',
    admin: 'admin1'
};

function migrateLegacyAccounts(accounts) {
    let migrated = false;
    Object.entries(LEGACY_ACCOUNT_ALIASES).forEach(([newUsername, oldUsername]) => {
        const newAccount = accounts.find(acc => acc.username === newUsername);
        const oldAccount = accounts.find(acc => acc.username === oldUsername);
        if (oldAccount && !newAccount) {
            oldAccount.username = newUsername;
            migrated = true;
        }
    });
    if (migrated) {
        saveAccounts(accounts);
    }
    return accounts;
}

function loadAccounts() {
    const stored = localStorage.getItem('pos_accounts');
    if (stored) {
        try {
            const accounts = JSON.parse(stored);
            if (Array.isArray(accounts)) {
                return migrateLegacyAccounts(accounts);
            }
        } catch (e) {
            console.warn('Gagal membaca akun lokal:', e);
        }
    }
    const defaultAccounts = [
        { username: 'staff', password: 'staff123', role: 'staff', displayName: 'Staff' },
        { username: 'owner', password: 'owner123', role: 'owner', displayName: 'Owner' },
        { username: 'admin', password: 'admin123', role: 'owner_admin', displayName: 'Admin' }
    ];
    saveAccounts(defaultAccounts);
    return defaultAccounts;
}

async function syncRemoteAccountsToLocal() {
    if (!firebaseEnabled) return;
    const remoteAccounts = await fetchRemoteAccounts();
    if (Array.isArray(remoteAccounts) && remoteAccounts.length > 0) {
        saveAccounts(remoteAccounts);
    }
}

function getCurrentUser() {
    const user = localStorage.getItem('pos_current_user');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('pos_current_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('pos_current_user');
}

function updateSessionActivity() {
    const user = getCurrentUser();
    if (!user) return;
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === user.username);
    if (account) {
        account.lastSeen = Date.now();
        saveAccounts(accounts);
    }
}

function markUserOnline(user) {
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === user.username);
    if (!account) return;
    account.online = true;
    account.lastSeen = Date.now();
    saveAccounts(accounts);
}

function markUserOffline(user) {
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === user.username);
    if (!account) return;
    account.online = false;
    account.lastSeen = Date.now();
    saveAccounts(accounts);
}

function checkSessionTimeout() {
    const user = getCurrentUser();
    if (!user) return;
    const accounts = loadAccounts();
    const account = accounts.find(acc => acc.username === user.username);
    if (!account) {
        logout();
        return;
    }
    const now = Date.now();
    const idle = now - (account.lastSeen || 0);
    if (idle >= SESSION_TIMEOUT_MS) {
        markUserOffline(account);
        logout();
        alert('Sesi Anda telah habis karena tidak aktif selama 20 menit. Silakan login kembali.');
    }
}

function canEditData(role) {
    return role === 'owner' || role === 'owner_admin';
}

function canViewCashflowOmset(role) {
    return role === 'owner' || role === 'owner_admin';
}

function canViewGaji(role) {
    return role === 'owner_admin';
}

function canManageAccounts(role) {
    return role === 'owner_admin';
}

function applyAccessPermissions() {
    const role = getCurrentUser()?.role || 'guest';
    const editControls = document.querySelectorAll('.auth-edit-control');
    const manageBtn = document.getElementById('manage-accounts-btn');
    const adminPanel = document.getElementById('admin-panel');
    const cashflowBtn = document.getElementById('nav-cashflow');
    const omsetBtn = document.getElementById('nav-omset-perhari');
    const gajiBtn = document.getElementById('nav-gaji');

    editControls.forEach(el => {
        if (canEditData(role)) {
            el.classList.remove('opacity-50', 'pointer-events-none');
        } else {
            el.classList.add('opacity-50', 'pointer-events-none');
        }
    });

    if (manageBtn) {
        manageBtn.classList.toggle('hidden', !canManageAccounts(role));
    }

    if (adminPanel) {
        adminPanel.classList.toggle('hidden', !canManageAccounts(role));
    }

    if (cashflowBtn) {
        cashflowBtn.classList.toggle('hidden', !canViewCashflowOmset(role));
        cashflowBtn.classList.toggle('inline-flex', canViewCashflowOmset(role));
    }
    if (omsetBtn) {
        omsetBtn.classList.toggle('hidden', !canViewCashflowOmset(role));
        omsetBtn.classList.toggle('inline-flex', canViewCashflowOmset(role));
    }
    if (gajiBtn) {
        gajiBtn.classList.toggle('hidden', !canViewGaji(role));
        gajiBtn.classList.toggle('inline-flex', canViewGaji(role));
    }

    const userBadge = document.getElementById('user-badge');
    const statusBadge = document.getElementById('status-badge');
    if (userBadge) {
        const user = getCurrentUser();
        const accounts = loadAccounts();
        const account = user ? accounts.find(acc => acc.username === user.username) : null;
        const displayName = account?.displayName || user?.displayName || user?.username || 'Pengguna';
        userBadge.textContent = user ? `Halo, ${displayName}` : 'Halo, Pengguna';
    }
    if (statusBadge) {
        const user = getCurrentUser();
        const accounts = loadAccounts();
        const account = user ? accounts.find(acc => acc.username === user.username) : null;
        const isOnline = Boolean(account?.online);
        statusBadge.textContent = isOnline ? 'Online' : 'Offline';
        statusBadge.className = `px-2 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`;
    }
}

function showLoginScreen() {
    document.getElementById('login-screen')?.classList.remove('hidden');
    document.getElementById('app-shell')?.classList.add('hidden');
}

function showAppShell() {
    document.getElementById('login-screen')?.classList.add('hidden');
    document.getElementById('app-shell')?.classList.remove('hidden');
    applyAccessPermissions();
}

function logout() {
    const user = getCurrentUser();
    if (user) {
        markUserOffline(user);
    }
    clearCurrentUser();
    showLoginScreen();
}

function findAccount(username, accounts) {
    const normalizedUsername = String(username || '').trim().toLowerCase();
    if (!normalizedUsername) return null;
    const match = accounts.find(acc => String(acc.username || '').trim().toLowerCase() === normalizedUsername);
    if (match) return match;
    const legacyAlias = LEGACY_ACCOUNT_ALIASES[normalizedUsername];
    return accounts.find(acc => String(acc.username || '').trim().toLowerCase() === String(legacyAlias || '').trim().toLowerCase()) || null;
}

function setLoginMessage(message, type = 'error') {
    const element = document.getElementById('login-message');
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('hidden', !message);
    element.classList.toggle('text-red-500', type === 'error');
    element.classList.toggle('text-emerald-600', type === 'success');
}

function handleLogin(username, password) {
    const accounts = loadAccounts();
    const matched = findAccount(username, accounts);
    const normalizedPassword = String(password || '').trim();
    if (!matched || String(matched.password || '').trim() !== normalizedPassword) {
        setLoginMessage('Username atau password salah.', 'error');
        return false;
    }
    const sessionUser = { username: matched.username, role: matched.role, displayName: matched.displayName || matched.username };
    setCurrentUser(sessionUser);
    markUserOnline(sessionUser);
    updateSessionActivity();
    setLoginMessage('Login berhasil. Anda sedang diarahkan ke dashboard.', 'success');
    showAppShell();
    switchMenu('dashboard');
    return true;
}

function renderAccounts() {
    const container = document.getElementById('account-list');
    if (!container) return;
    const accounts = loadAccounts();
    container.innerHTML = '';
    accounts.forEach(account => {
        const row = document.createElement('div');
        row.className = 'flex flex-wrap items-center justify-between gap-2 border rounded-lg px-3 py-2 text-sm';
        const statusLabel = account.online ? 'Online' : 'Offline';
        const statusClass = account.online ? 'text-emerald-600' : 'text-slate-500';
        row.innerHTML = `
            <div>
                <div class="font-semibold text-slate-700">${account.username}</div>
                <div class="text-slate-500">Nama panggilan: ${account.displayName || account.username}</div>
                <div class="text-slate-500">${parseRoleLabel(account.role)}</div>
                <div class="${statusClass}">${statusLabel}</div>
            </div>
            <div class="flex gap-2">
                <button type="button" data-action="edit-account" data-username="${account.username}" class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">Edit</button>
                <button type="button" data-action="force-logout" data-username="${account.username}" class="bg-slate-700 hover:bg-slate-800 text-white px-2 py-1 rounded">Force Logout</button>
                <button type="button" data-action="reset" data-username="${account.username}" class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded">Reset Password</button>
                <button type="button" data-action="delete" data-username="${account.username}" class="bg-rose-500 hover:bg-rose-600 text-white px-2 py-1 rounded">Hapus</button>
            </div>`;
        container.appendChild(row);
    });
}

function manageAccounts() {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.classList.toggle('hidden');
    if (!panel?.classList.contains('hidden')) {
        renderAccounts();
    }
}

function setupAuthHandlers() {
    const loginForm = document.getElementById('login-form');
    const accountForm = document.getElementById('account-form');
    const manageBtn = document.getElementById('manage-accounts-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username')?.value.trim();
            const password = document.getElementById('login-password')?.value;
            handleLogin(username, password);
        });
    }

    if (manageBtn) {
        manageBtn.addEventListener('click', manageAccounts);
    }

    const syncBtn = document.getElementById('sync-accounts-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            if (!firebaseEnabled) {
                alert('Firebase belum terinisialisasi. Pastikan `firebaseConfig` terpasang.');
                return;
            }
            try {
                await pushLocalAccountsToFirestore();
                alert('Sinkronisasi akun dipicu. Cek Firebase Console untuk hasil.');
            } catch (err) {
                console.error(err);
                alert('Gagal melakukan sinkronisasi. Lihat console untuk detail.');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    const toggleLoginPasswordBtn = document.getElementById('toggle-login-password-btn');
    if (toggleLoginPasswordBtn) {
        toggleLoginPasswordBtn.addEventListener('click', () => {
            const loginPasswordInput = document.getElementById('login-password');
            if (!loginPasswordInput) return;
            const isHidden = loginPasswordInput.type === 'password';
            loginPasswordInput.type = isHidden ? 'text' : 'password';
            toggleLoginPasswordBtn.textContent = isHidden ? '🙈' : '👁';
            toggleLoginPasswordBtn.setAttribute('aria-label', isHidden ? 'Sembunyikan password' : 'Tampilkan password');
        });
    }

    if (accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!canManageAccounts(getCurrentUser()?.role)) {
                alert('Hanya administrator yang bisa mengelola akun.');
                return;
            }
            const originalUsername = document.getElementById('account-original-username')?.value;
            const username = String(document.getElementById('account-username')?.value || '').trim();
            const password = String(document.getElementById('account-password')?.value || '').trim();
            const displayName = String(document.getElementById('account-display-name')?.value || '').trim() || username;
            const role = document.getElementById('account-role')?.value;
            if (!username || !password || !role) return;
            const accounts = loadAccounts();
            const target = originalUsername ? accounts.find(acc => acc.username === originalUsername) : null;
            const duplicate = accounts.find(acc => acc.username === username);

            if (originalUsername && originalUsername !== username && duplicate && duplicate !== target) {
                alert('Username baru sudah digunakan. Silakan pilih username lain.');
                return;
            }

            if (target) {
                target.username = username;
                target.password = password;
                target.role = role;
                target.displayName = displayName;
            } else if (duplicate) {
                duplicate.password = password;
                duplicate.role = role;
                duplicate.displayName = displayName;
            } else {
                accounts.push({ username, password, role, displayName });
            }
            saveAccounts(accounts);
            renderAccounts();
            accountForm.reset();
            alert('Akun berhasil disimpan.');
        });
    }

    const togglePasswordBtn = document.getElementById('toggle-account-password-btn');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('account-password');
            if (!passwordInput) return;
            const isPasswordHidden = passwordInput.type === 'password';
            passwordInput.type = isPasswordHidden ? 'text' : 'password';
            togglePasswordBtn.textContent = isPasswordHidden ? 'Sembunyikan' : 'Tampilkan';
        });
    }

    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-action="edit-account"]');
        if (editBtn) {
            const username = editBtn.getAttribute('data-username');
            const accounts = loadAccounts();
            const target = accounts.find(acc => acc.username === username);
            if (target) {
                const originalInput = document.getElementById('account-original-username');
                const usernameInput = document.getElementById('account-username');
                const passwordInput = document.getElementById('account-password');
                const displayInput = document.getElementById('account-display-name');
                const roleInput = document.getElementById('account-role');
                if (originalInput) originalInput.value = target.username;
                if (usernameInput) usernameInput.value = target.username;
                if (passwordInput) passwordInput.value = target.password || '';
                if (displayInput) displayInput.value = target.displayName || target.username || '';
                if (roleInput) roleInput.value = target.role || 'staff';
                document.getElementById('account-username').focus();
                alert('Silakan ubah data akun lalu klik Simpan Akun. Jika Anda mengubah username, akun lama akan digantikan.');
            }
            return;
        }

        const forceBtn = e.target.closest('[data-action="force-logout"]');
        if (forceBtn) {
            const username = forceBtn.getAttribute('data-username');
            const accounts = loadAccounts();
            const target = accounts.find(acc => acc.username === username);
            if (target) {
                target.online = false;
                target.lastSeen = Date.now();
                saveAccounts(accounts);
                if (getCurrentUser()?.username === username) {
                    logout();
                }
                renderAccounts();
                alert(`Akun ${username} dipaksa logout.`);
            }
            return;
        }

        const btn = e.target.closest('[data-action="reset"]');
        if (btn) {
            const username = btn.getAttribute('data-username');
            const accounts = loadAccounts();
            const target = accounts.find(acc => acc.username === username);
            if (target) {
                const newPassword = prompt(`Masukkan password baru untuk ${username}:`);
                if (newPassword && newPassword.trim()) {
                    target.password = newPassword.trim();
                    saveAccounts(accounts);
                    renderAccounts();
                    alert('Password akun berhasil diubah.');
                }
            }
            return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
            const username = deleteBtn.getAttribute('data-username');
            if (username === 'admin') {
                alert('Akun administrator utama tidak bisa dihapus.');
                return;
            }
            if (confirm(`Hapus akun ${username}?`)) {
                const accounts = loadAccounts().filter(acc => acc.username !== username);
                saveAccounts(accounts);
                renderAccounts();
            }
        }
    });
}

// Pastikan fungsi switchMenu mempertahankan class susunan flex & gap agar ikon tidak bergeser berantakan
function switchMenu(menuId) {
    const normalize = s => String(s || '').replace(/\s+/g, '-');

    const sections = ['dashboard', 'keluar', 'inventory', 'bahan-masuk', 'cost-harian', 'cashflow', 'omset-perhari', 'gaji'];
    sections.forEach(id => {
        const el = document.getElementById(`menu-${id}`);
        if (el) el.classList.add('hidden');
    });

    const targetId = `menu-${normalize(menuId)}`;
    const targetEl = document.getElementById(targetId);
    if (targetEl) targetEl.classList.remove('hidden');

    if (targetId === 'menu-keluar' && window._lastSheetData && typeof renderSheetTable === 'function') {
        renderSheetTable(window._lastSheetData, true);
    }

    const titleMap = {
        'dashboard': 'Dashboard Penjualan',
        'keluar': 'Menu Keluar',
        'inventory': 'Inventory Stock',
        'bahan-masuk': 'Bahan Masuk',
        'cost-harian': 'Cost Harian',
        'cashflow': 'Cashflow',
        'omset-perhari': 'Omset Perhari',
        'gaji': 'Gaji'
    };
    const titleKey = normalize(menuId);
    if (titleMap[titleKey]) document.getElementById('menu-title').innerText = titleMap[titleKey];

    if (titleKey === 'cashflow' && typeof loadCashflowType === 'function') {
        loadCashflowType(window._selectedCashflowType || 'saldo-bank');
    }

    if (titleKey === 'omset-perhari' && typeof loadOmsetPerhariDefault === 'function') {
        loadOmsetPerhariDefault();
    }
    if (titleKey === 'gaji' && typeof loadGajiData === 'function') {
        loadGajiData();
    }

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        const isActive = onclick.includes(menuId) || onclick.includes(titleKey);

        btn.classList.toggle('bg-slate-700', isActive);
        btn.classList.toggle('font-semibold', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('text-gray-400', !isActive);
        btn.classList.toggle('hover:bg-slate-700', !isActive);
        btn.classList.toggle('hover:text-white', !isActive);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Init Firebase and realtime sync if available
    initFirebase();
    if (firebaseEnabled) {
        await syncRemoteAccountsToLocal();
        subscribeAccountsRealtime();
    }

    setupAuthHandlers();
    const currentUser = getCurrentUser();
    if (currentUser) {
        const accounts = loadAccounts();
        const account = accounts.find(acc => acc.username === currentUser.username);
        if (account && account.online) {
            updateSessionActivity();
            showAppShell();
        } else {
            clearCurrentUser();
            showLoginScreen();
        }
    } else {
        showLoginScreen();
    }
    applyAccessPermissions();

    window.addEventListener('mousemove', updateSessionActivity);
    window.addEventListener('keydown', updateSessionActivity);
    window.addEventListener('click', updateSessionActivity);
    setInterval(checkSessionTimeout, 30000);
});