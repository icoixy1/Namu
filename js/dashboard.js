// Inisialisasi Chart saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Grafik Penjualan Per Kategori / Item Count (Pie Chart)
    const ctxKategori = document.getElementById('chartKategori').getContext('2d');
    const chartKategori = new Chart(ctxKategori, {
        type: 'pie',
        data: {
            labels: ['Data belum tersedia'],
            datasets: [{
                data: [1],
                backgroundColor: ['#0f172a']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 2. Grafik Total Penjualan per Nama (Bar Chart)
    const ctxItemsSold = document.getElementById('chartItemsSold').getContext('2d');
    const chartItemsSold = new Chart(ctxItemsSold, {
        type: 'bar',
        data: {
            labels: ['Data belum tersedia'],
            datasets: [{
                label: 'Total Penjualan per Nama',
                data: [0],
                backgroundColor: '#3b82f6',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: false } },
                y: { beginAtZero: true }
            }
        }
    });

    // 3. Grafik Penjualan 15 Hari Terakhir (Line Chart)
    const ctxPaymentMethod = document.getElementById('chartPaymentMethod').getContext('2d');
    const chartPaymentMethod = new Chart(ctxPaymentMethod, {
        type: 'line',
        data: {
            labels: ['Belum tersedia'],
            datasets: [{
                label: 'Penjualan 15 Hari Terakhir',
                data: [0],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139,92,246,0.25)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#8b5cf6'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 } },
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 4. Grafik Penjualan 12 Bulan Terakhir (Line Chart)
    const ctx12Month = document.getElementById('chart12MonthSales').getContext('2d');
    const chart12Month = new Chart(ctx12Month, {
        type: 'line',
        data: {
            labels: ['Belum tersedia'],
            datasets: [{
                label: 'Penjualan 12 Bulan Terakhir',
                data: [0],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245,158,11,0.2)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#f59e0b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 } },
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    window._dashboardCharts = { chartKategori, chartItemsSold, chartPaymentMethod, chart12Month };

    // Listener Filter Tanggal (start / end)
    const startEl = document.getElementById('filter-start');
    const endEl = document.getElementById('filter-end');
    if (startEl) startEl.addEventListener('change', () => applyFilters());
    if (endEl) endEl.addEventListener('change', () => applyFilters());

    // Manual import: tombol akan memicu impor Google Sheets
    const importBtn = document.getElementById('import-sheet-btn');
    const importInventoryBtn = document.getElementById('import-inventory-btn');
    const importBahanMasukBtn = document.getElementById('import-bahan-masuk-btn');
    const importCostHarianBtn = document.getElementById('import-cost-harian-btn');
    const refreshBahanOptionsBtn = document.getElementById('refresh-bahan-options-btn');
    const expandBtn = document.getElementById('dashboard-expand-btn');
    const importGajiBtn = document.getElementById('import-gaji-btn');
    if (importBtn) importBtn.addEventListener('click', () => {
        const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
        const itemKeluarGid = '158533079';
        console.log('Import button clicked', sheetId, itemKeluarGid);
        importFromGoogleSheet(sheetId, itemKeluarGid).catch(err => {
            console.error(err);
            showMenuKeluarMessage('Gagal mengimpor data: ' + err.message + '. Pastikan spreadsheet dipublikasikan dan dapat diakses publik.');
        });
    });
    if (importInventoryBtn) importInventoryBtn.addEventListener('click', () => {
        const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
        const inventoryGid = '1906451368';
        console.log('Import inventory button clicked', sheetId, inventoryGid);
        importInventoryFromGoogleSheet(sheetId, inventoryGid).catch(err => {
            console.error(err);
            showMenuInventoryMessage('Gagal mengimpor data inventory: ' + err.message + '. Pastikan spreadsheet dipublikasikan dan dapat diakses publik.');
        });
    });
    if (importBahanMasukBtn) importBahanMasukBtn.addEventListener('click', () => {
        const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
        const bahanMasukGid = '2035618503';
        console.log('Import bahan masuk button clicked', sheetId, bahanMasukGid);
        importBahanMasukFromGoogleSheet(sheetId, bahanMasukGid).catch(err => {
            console.error(err);
            showMenuBahanMasukMessage('Gagal mengimpor data bahan masuk: ' + err.message + '. Pastikan spreadsheet dipublikasikan dan dapat diakses publik.');
        });
    });
    if (importCostHarianBtn) importCostHarianBtn.addEventListener('click', () => {
        const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
        const costHarianGid = '1671061602';
        console.log('Import cost harian button clicked', sheetId, costHarianGid);
        importCostHarianFromGoogleSheet(sheetId, costHarianGid).catch(err => {
            console.error(err);
            showMenuCostHarianMessage('Gagal mengimpor data cost harian: ' + err.message + '. Pastikan spreadsheet dipublikasikan dan dapat diakses publik.');
        });
    });
    const cashflowSaldoBankBtn = document.getElementById('cashflow-saldo-bank-btn');
    const cashflowTunaiBtn = document.getElementById('cashflow-tunai-btn');
    const cashflowBankBtn = document.getElementById('cashflow-bank-btn');
    const omsetPerhariBtn = document.getElementById('import-omset-perhari-btn');

    if (cashflowSaldoBankBtn) cashflowSaldoBankBtn.addEventListener('click', () => {
        switchMenu('cashflow');
        activateCashflowSubmenu('cashflow-saldo-bank-btn');
        loadCashflowSheetData({
            title: 'Saldo Bank',
            sheetId: '16vZ1QYSVCnMH9AaXkMLb3qhUDJOrnEA73KH9yNmcVgo',
            gid: '1262046169',
            maxColumns: 14,
            containerId: 'cashflow-table',
            description: 'Menampilkan data SALDO BANK dari Google Sheets.',
            type: 'saldo-bank'
        });
    });
    if (cashflowTunaiBtn) cashflowTunaiBtn.addEventListener('click', () => {
        switchMenu('cashflow');
        activateCashflowSubmenu('cashflow-tunai-btn');
        loadCashflowSheetData({
            title: 'Cashflow Tunai',
            sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
            gid: '637620427',
            maxColumns: 7,
            containerId: 'cashflow-table',
            description: 'Menampilkan data CASHFLOW TUNAI dari Google Sheets.',
            type: 'cashflow-tunai'
        });
    });
    if (cashflowBankBtn) cashflowBankBtn.addEventListener('click', () => {
        switchMenu('cashflow');
        activateCashflowSubmenu('cashflow-bank-btn');
        loadCashflowSheetData({
            title: 'Cashflow Bank',
            sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
            gid: '1927567222',
            maxColumns: null,
            containerId: 'cashflow-table',
            description: 'Menampilkan data CASHFLOW BANK dari Google Sheets.',
            type: 'cashflow-bank'
        });
    });
    if (omsetPerhariBtn) omsetPerhariBtn.addEventListener('click', () => {
        switchMenu('omset-perhari');
        loadOmsetPerhariData({
            sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
            gid: '2031914011',
            maxColumns: 4,
            containerId: 'omset-perhari-table',
            description: 'Menampilkan data OMSET PERHARI dari Google Sheets.'
        });
    });
    if (refreshBahanOptionsBtn) refreshBahanOptionsBtn.addEventListener('click', () => {
        const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
        const bahanOptionsGid = '1128116488';
        console.log('Refresh bahan options clicked', sheetId, bahanOptionsGid);
        importNamaBahanOptionsFromGoogleSheet(sheetId, bahanOptionsGid).catch(err => {
            console.error(err);
            showMenuBahanMasukMessage('Gagal memuat nama bahan: ' + err.message + '.');
        });
    });
    if (expandBtn) expandBtn.addEventListener('click', () => {
        switchMenu('keluar');
    });

    // Siapkan GID untuk impor manual dan otomatis
    const sheetId = '1k7TwY9rlhQpohq1lQ7HqEBv7oL-6TJPH0ItqEl1gVCA';
    const bahanOptionsGid = '1128116488';
    const bahanMasukGid = '2035618503';
    const itemKeluarGid = '158533079';
    const inventoryGid = '1906451368';
    const costHarianGid = '1671061602';
    const costNameLookupGid = '1012379287';

    // Tombol refresh manual untuk memuat kedua sheet sekaligus (dengan spinner)
    const refreshBtn = document.getElementById('refresh-data-btn');
    const refreshSpinner = document.getElementById('refresh-spinner');
    const refreshText = document.getElementById('refresh-text');

    function setRefreshLoading(loading) {
        if (refreshBtn) refreshBtn.disabled = !!loading;
        if (refreshSpinner) refreshSpinner.classList.toggle('hidden', !loading);
        if (refreshText) refreshText.textContent = loading ? 'Memuat...' : 'Refresh Data';
        if (refreshBtn) {
            if (loading) refreshBtn.classList.add('opacity-80');
            else refreshBtn.classList.remove('opacity-80');
        }
    }

    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        setRefreshLoading(true);
        showMenuBahanMasukMessage('Memuat data bahan masuk...');
        showMenuKeluarMessage('Memuat data item keluar...');
        Promise.allSettled([
            importBahanMasukFromGoogleSheet(sheetId, bahanMasukGid),
            importFromGoogleSheet(sheetId, itemKeluarGid)
        ]).then(results => {
            const rejected = results.filter(r => r.status === 'rejected');
            if (rejected.length === 0) {
                showToast('Data berhasil dimuat', 'success');
            } else {
                showToast(`${rejected.length} impor gagal. Periksa console.`, 'error');
                results.forEach((r, i) => {
                    if (r.status === 'rejected') {
                        const reason = r.reason && r.reason.message ? r.reason.message : String(r.reason);
                        if (i === 0) showMenuBahanMasukMessage('Gagal memuat bahan masuk: ' + reason);
                        if (i === 1) showMenuKeluarMessage('Gagal memuat item keluar: ' + reason);
                    }
                });
            }
        }).catch(err => {
            console.error('Error saat refresh:', err);
            showToast('Terjadi kesalahan saat refresh', 'error');
        }).finally(() => {
            setRefreshLoading(false);
            console.log('Refresh data selesai');
        });
    });

    setupAdditionalChartSection();

    // Auto-import ketika pengguna masuk ke aplikasi (bisa dimatikan dengan mengubah AUTO_IMPORT_ON_ENTRY)
    const AUTO_IMPORT_ON_ENTRY = true;
    if (AUTO_IMPORT_ON_ENTRY) {
        if (typeof setRefreshLoading === 'function') setRefreshLoading(true);
        showMenuBahanMasukMessage('Memuat data bahan masuk (otomatis)...');
        showMenuKeluarMessage('Memuat data item keluar (otomatis)...');
        showMenuInventoryMessage('Memuat data inventory (otomatis)...');
        showMenuCostHarianMessage('Memuat data cost harian (otomatis)...');

        Promise.allSettled([
            importNamaBahanOptionsFromGoogleSheet(sheetId, bahanOptionsGid),
            importBahanMasukFromGoogleSheet(sheetId, bahanMasukGid),
            importFromGoogleSheet(sheetId, itemKeluarGid),
            importInventoryFromGoogleSheet(sheetId, inventoryGid),
            importCostHarianFromGoogleSheet(sheetId, costHarianGid),
            importCostNamaListFromGoogleSheet(sheetId, costNameLookupGid)
        ]).then(results => {
            const rejected = results.filter(r => r.status === 'rejected');
            if (rejected.length === 0) {
                showToast('Semua data berhasil dimuat otomatis', 'success');
            } else {
                showToast(`${rejected.length} impor otomatis gagal`, 'error');
                results.forEach((r, i) => {
                    if (r.status === 'rejected') {
                        const reason = r.reason && r.reason.message ? r.reason.message : String(r.reason);
                        if (i === 0) showMenuBahanMasukMessage('Gagal memuat nama bahan: ' + reason);
                        if (i === 1) showMenuBahanMasukMessage('Gagal memuat bahan masuk: ' + reason);
                        if (i === 2) showMenuKeluarMessage('Gagal memuat item keluar: ' + reason);
                        if (i === 3) showMenuInventoryMessage('Gagal memuat inventory: ' + reason);
                        if (i === 4) showMenuCostHarianMessage('Gagal memuat cost harian: ' + reason);
                        if (i === 5) showMenuCostHarianMessage('Gagal memuat daftar nama cost: ' + reason);
                    }
                });
            }
        }).finally(() => {
            if (typeof setRefreshLoading === 'function') setRefreshLoading(false);
            console.log('Auto import selesai');
        });
    }
});

function setupAdditionalChartSection() {
    const toggleBtn = document.getElementById('toggle-additional-charts');
    const section = document.getElementById('additional-chart-section');
    if (!toggleBtn || !section) return;

    toggleBtn.addEventListener('click', () => {
        const isHidden = section.classList.toggle('hidden');
        toggleBtn.textContent = isHidden ? 'Tampilkan Chart Tambahan' : 'Sembunyikan Chart Tambahan';
        if (!isHidden) {
            const charts = window._dashboardCharts || {};
            Object.values(charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }
    });
}

function showMenuKeluarMessage(msg) {
    const container = document.getElementById('menu-keluar-data');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${msg}</div>`;
}

function showMenuInventoryMessage(msg) {
    const container = document.getElementById('menu-inventory-data');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${msg}</div>`;
}

function showMenuGajiMessage(msg) {
    const container = document.getElementById('menu-gaji-table');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${escapeHtml(msg)}</div>`;
}

function showMenuCostHarianMessage(msg) {
    const container = document.getElementById('menu-cost-harian-data');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${escapeHtml(msg)}</div>`;
}

function parseDateInput(value) {
    if (!value) return null;
    const s = String(value).trim();
    if (!s) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const d = new Date(s + 'T00:00:00');
        return isNaN(d.getTime()) ? null : d;
    }
    const parts = s.split(/[\/\-]/);
    if (parts.length === 3) {
        const [a, b, c] = parts;
        const day = parseInt(a, 10);
        const month = parseInt(b, 10);
        const year = parseInt(c, 10);
        if (day > 0 && month > 0 && year > 0) {
            const d = new Date(year, month - 1, day);
            return isNaN(d.getTime()) ? null : d;
        }
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}

function formatCurrency(value) {
    const n = Number(value || 0);
    if (!isFinite(n)) return 'Rp 0';
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function parseCostTotalValue(v) {
    if (v == null) return 0;
    let s = String(v).trim();
    if (!s) return 0;
    s = s.replace(/[^0-9,\.\-]/g, '');
    if (s === '') return 0;
    const hasDot = s.includes('.');
    const hasComma = s.includes(',');
    if (hasDot && hasComma) {
        s = s.replace(/\./g, '').replace(/,/g, '.');
    } else if (hasDot && !hasComma) {
        const parts = s.split('.');
        if (parts.length > 2) {
            s = parts.join('');
        } else if (parts.length === 2) {
            const last = parts[parts.length - 1];
            if (last.length === 3) {
                s = parts.join('');
            } else {
                s = s.replace(/\./g, '');
            }
        }
    } else if (hasComma && !hasDot) {
        s = s.replace(/,/g, '.');
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
}

function getFilteredCostHarianRows() {
    if (!window._costHarianSheetData || window._costHarianSheetData.length < 2) return [];
    const headers = window._costHarianSheetData[0];
    const rows = window._costHarianSheetData.slice(1);
    const dateHeader = findHeader(headers, ['TANGGAL', 'Tanggal', 'tanggal', 'Date', 'date', 'tgl']);
    const startInput = document.getElementById('cost-filter-start');
    const endInput = document.getElementById('cost-filter-end');
    const start = startInput ? parseDateInput(startInput.value) : null;
    const end = endInput ? parseDateInput(endInput.value) : null;

    return rows.filter((row) => {
        if (!dateHeader) return true;
        const dateValue = row[headers.indexOf(dateHeader)] || '';
        const d = parseDateInput(dateValue);
        if (!d) return true;
        if (start && d < start) return false;
        if (end) {
            const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
            if (d > endOfDay) return false;
        }
        return true;
    });
}

function updateCostHarianSummary() {
    const totalEl = document.getElementById('cost-total-pengeluaran');
    const perItemEl = document.getElementById('cost-total-per-item');
    const rows = getFilteredCostHarianRows();
    const headers = window._costHarianSheetData ? window._costHarianSheetData[0] : [];
    const totalHeader = findHeader(headers, ['TOTAL', 'Total', 'total', 'Nominal', 'nominal']);
    const itemHeader = findHeader(headers, ['NAMA', 'Nama', 'nama', 'Item', 'item']);

    let total = 0;
    const perItem = {};

    rows.forEach((row) => {
        const val = totalHeader !== -1 ? parseCostTotalValue(row[headers.indexOf(totalHeader)] || '') : 0;
        total += isFinite(val) ? val : 0;
        if (itemHeader !== -1) {
            const name = String(row[headers.indexOf(itemHeader)] || '').trim();
            if (name) {
                const prev = perItem[name] || 0;
                perItem[name] = prev + (isFinite(val) ? val : 0);
            }
        }
    });

    if (totalEl) totalEl.textContent = formatCurrency(total);
    if (perItemEl) {
        const canvas = document.getElementById('cost-per-item-chart');
        const entries = Object.entries(perItem).sort((a, b) => b[1] - a[1]).slice(0, 6);
        const labels = entries.map(([name]) => name);
        const values = entries.map(([, amount]) => amount);

        if (canvas) {
            if (window._costHarianChart) {
                window._costHarianChart.destroy();
            }
            if (entries.length) {
                window._costHarianChart = new Chart(canvas.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Total per Item',
                            data: values,
                            backgroundColor: ['#f43f5e','#fb923c','#facc15','#34d399','#60a5fa','#a78bfa'],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { display: false } }
                    }
                });
            } else {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '14px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.fillText('Belum ada data', canvas.width / 2, canvas.height / 2);
            }
        }
    }
}

function renderCostHarianTable(data) {
    const container = document.getElementById('menu-cost-harian-data');
    if (!container) return;
    if (!data || data.length === 0) {
        showMenuCostHarianMessage('Spreadsheet cost harian kosong.');
        return;
    }

    const headers = data[0];
    const rows = data.slice(1);
    const filteredRows = getFilteredCostHarianRows();
    const total = filteredRows.length;
    const limit = 50;
    const displayRows = filteredRows.length <= limit ? filteredRows : filteredRows.slice(0, limit);
    const tableHeaders = [...headers, 'AKSI'];

    let html = '<div class="flex items-center justify-between mb-2">';
    html += `<div class="text-sm text-gray-600">Menampilkan ${displayRows.length} dari ${total} baris data cost harian</div>`;
    html += '</div>';
    html += '<div class="overflow-x-auto">';
    html += '<table class="w-full text-left border-collapse text-sm">';
    html += '<thead><tr class="bg-gray-100 text-gray-700">';
    tableHeaders.forEach(h => { html += `<th class="p-2 border">${escapeHtml(h)}</th>`; });
    html += '</tr></thead>';
    html += '<tbody class="divide-y">';
    displayRows.forEach((row, displayIndex) => {
        const absoluteIndex = rows.indexOf(row) + 1;
        html += '<tr>';
        row.forEach((_, i) => { html += `<td class="p-2 border">${escapeHtml(row[i] || '')}</td>`; });
        html += `<td class="p-2 border"><div class="flex gap-2"><button class="text-blue-600 hover:underline" data-action="edit" data-row-index="${absoluteIndex}">Edit</button><button class="text-rose-600 hover:underline" data-action="delete" data-row-index="${absoluteIndex}">Delete</button></div></td>`;
        html += '</tr>';
    });
    html += '</tbody></table></div>';

    if (filteredRows.length > limit) {
        html += '<div class="mt-3 text-sm text-gray-500">Hanya 50 baris pertama ditampilkan. Persempit rentang tanggal untuk melihat hasil yang lebih spesifik.</div>';
    }

    container.classList.remove('hidden');
    container.innerHTML = html;

    container.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-row-index'));
            openCostHarianEditModal(idx);
        });
    });
    container.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.getAttribute('data-row-index'));
            if (confirm('Hapus data cost harian ini?')) {
                if (window._costHarianSheetData && window._costHarianSheetData[idx]) {
                    window._costHarianSheetData.splice(idx, 1);
                    renderCostHarianTable(window._costHarianSheetData);
                    showToast('Data cost harian dihapus', 'success');
                }
            }
        });
    });

    updateCostHarianSummary();
}

function openCostHarianEditModal(index) {
    if (!window._costHarianSheetData || !window._costHarianSheetData[index]) return;
    const row = window._costHarianSheetData[index];
    const headers = window._costHarianSheetData[0];
    const getValue = (aliases) => {
        const header = headers.find(h => aliases.includes(String(h || '').trim()));
        const idx = header ? headers.indexOf(header) : -1;
        return idx !== -1 ? row[idx] || '' : '';
    };
    document.getElementById('input-cost-tanggal').value = getValue(['TANGGAL', 'Tanggal', 'tanggal', 'Date', 'date', 'tgl']) || '';
    document.getElementById('input-cost-id').value = getValue(['ID', 'Id', 'id']) || '';
    document.getElementById('input-cost-nama').value = getValue(['NAMA', 'Nama', 'nama', 'Item', 'item']) || '';
    document.getElementById('input-cost-qty').value = getValue(['QTY', 'Qty', 'qty', 'Jumlah', 'jumlah']) || '';
    document.getElementById('input-cost-total').value = getValue(['TOTAL', 'Total', 'total', 'Nominal', 'nominal']) || '';
    document.getElementById('input-cost-keperluan').value = getValue(['KEPERLUAN', 'Keperluan', 'Keterangan', 'keterangan', 'Catatan']) || '';
    syncCostNameId();
    window._editingCostHarianIndex = index;
    if (typeof openModal === 'function') openModal('modalCost');
}

function syncCostNameId() {
    const nameSelect = document.getElementById('input-cost-nama');
    const idInput = document.getElementById('input-cost-id');
    if (!nameSelect || !idInput) return;
    const name = String(nameSelect.value || '').trim().toLowerCase();
    if (!name) return;
    const id = window._costNameMap && window._costNameMap[name] ? window._costNameMap[name] : '';
    if (id) {
        idInput.value = id;
    }
}

async function importCostNamaListFromGoogleSheet(sheetId, gid) {
    const data = await fetchSheetCsv(sheetId, gid);
    if (!data || data.length < 2) return;
    const headers = data[0].map(h => String(h || '').trim());
    const nameHeader = findHeader(headers, ['NAMA', 'Nama', 'nama', 'Name', 'name', 'Item', 'item']);
    const idHeader = findHeader(headers, ['ID', 'Id', 'id']);
    const select = document.getElementById('input-cost-nama');
    if (!select) return;

    window._costNameMap = {};
    select.innerHTML = '<option value="">Pilih nama</option>';

    data.slice(1).forEach((row) => {
        const name = String(nameHeader !== null ? row[headers.indexOf(nameHeader)] || '' : '').trim();
        const id = String(idHeader !== null ? row[headers.indexOf(idHeader)] || '' : '').trim();
        if (!name) return;
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
        if (id) window._costNameMap[name.toLowerCase()] = id;
    });
}

async function importCostHarianFromGoogleSheet(sheetId, gid) {
    showMenuCostHarianMessage('Memuat data cost harian...');
    const data = await fetchSheetCsv(sheetId, gid);
    window._costHarianSheetData = data;
    window._costHarianSheetObjects = csvToObjects(data);
    renderCostHarianTable(data);
}

function showMenuBahanMasukMessage(msg) {
    let container = document.getElementById('menu-bahan-masuk-data');
    // fallback to riwayat table body if specific container removed
    if (!container) container = document.getElementById('riwayat-bahan-body');
    if (!container) return;
    // if target is tbody, wrap message in a full-row
    if (container.tagName.toLowerCase() === 'tbody') {
        container.innerHTML = `<tr><td class="p-4 text-sm text-gray-600" colspan="12">${msg}</td></tr>`;
    } else {
        container.classList.remove('hidden');
        container.innerHTML = `<div class="text-sm text-gray-600">${msg}</div>`;
    }
}

function showMenuCashflowMessage(msg) {
    const container = document.getElementById('cashflow-table');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${msg}</div>`;
}

function showMenuOmsetPerhariMessage(msg) {
    const container = document.getElementById('omset-perhari-table');
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="text-sm text-gray-600">${msg}</div>`;
}

function showToast(message, type = 'info', timeout = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-slate-700';
    el.className = `${bg} text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-3 max-w-sm transform transition-all duration-150 cursor-pointer`;
    el.innerHTML = `<div class="text-sm">${escapeHtml(message)}</div>`;
    el.addEventListener('click', () => { if (el.parentNode) el.parentNode.removeChild(el); });
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, timeout);
}

async function importFromGoogleSheet(sheetId, itemKeluarGid) {
    showMenuKeluarMessage('Memuat data...');

    const data = await fetchSheetCsv(sheetId, itemKeluarGid);

    // Simpan data mentah (array of arrays)
    window._lastSheetData = data;
    // Buat objek untuk filter dan perhitungan
    window._sheetObjects = csvToObjects(data);
    // Setelah load, lakukan apply filter default (tidak ada filter => semua)
    applyFilters();
}

async function importBahanMasukFromGoogleSheet(sheetId, bahanMasukGid) {
    showMenuBahanMasukMessage('Memuat data bahan masuk...');

    const data = await fetchSheetCsv(sheetId, bahanMasukGid);
    // Pastikan kolom penting tersedia dan hitung TOTAL BERAT & TOTAL jika kosong
    if (data && data.length >= 1) {
        let headers = data[0].map(h => String(h || '').trim());

        const qtyHeader = findHeader(headers, ['QTY', 'Qty', 'qty', 'Jumlah', 'jumlah']);
        const beratHeader = findHeader(headers, ['BERAT', 'Berat', 'berat']);
        const hargaHeader = findHeader(headers, ['HARGA', 'Harga', 'harga', 'Price', 'price']);
        const totalBeratHeader = findHeader(headers, ['TOTAL BERAT', 'Total Berat', 'total berat']);
        const totalHeader = findHeader(headers, ['TOTAL', 'Total', 'total', 'TOTAL HARGA', 'Total Harga']);

        let qtyIdx = qtyHeader ? headers.indexOf(qtyHeader) : -1;
        let beratIdx = beratHeader ? headers.indexOf(beratHeader) : -1;
        let hargaIdx = hargaHeader ? headers.indexOf(hargaHeader) : -1;
        let totalBeratIdx = totalBeratHeader ? headers.indexOf(totalBeratHeader) : -1;
        let totalIdx = totalHeader ? headers.indexOf(totalHeader) : -1;

        // Jika kolom TOTAL BERAT atau TOTAL tidak ada, tambahkan di akhir
        if (totalBeratIdx === -1) {
            headers.push('TOTAL BERAT');
            totalBeratIdx = headers.length - 1;
            data[0] = headers;
            // ensure each row has that column
            for (let r = 1; r < data.length; r++) {
                data[r].length = Math.max(data[r].length, headers.length);
            }
        }
        if (totalIdx === -1) {
            headers.push('TOTAL');
            totalIdx = headers.length - 1;
            data[0] = headers;
            for (let r = 1; r < data.length; r++) {
                data[r].length = Math.max(data[r].length, headers.length);
            }
        }

        // Hitung untuk setiap baris
        // Detect if harga values are shorthand in thousands (e.g. '70' means 70.000)
        let priceScale = 1;
        if (hargaIdx !== -1) {
            const priceSamples = [];
            for (let r = 1; r < data.length; r++) {
                const raw = String(data[r][hargaIdx] || '').trim();
                if (!raw) continue;
                const parsed = parseTotalValue(raw);
                if (parsed > 0) priceSamples.push(parsed);
            }
            if (priceSamples.length >= 3) {
                const sorted = priceSamples.slice().sort((a,b)=>a-b);
                const mid = Math.floor(sorted.length/2);
                const median = sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2;
                const proportionSmall = priceSamples.filter(v => v < 1000).length / priceSamples.length;
                // Heuristic: if most samples <1000 and median reasonably >10, assume shorthand thousands
                if (proportionSmall >= 0.8 && median >= 10) {
                    priceScale = 1000;
                    console.info('Detected harga shorthand; applying scale x1000 for imported prices');
                }
            }
        }

        for (let r = 1; r < data.length; r++) {
            const row = data[r];
            const qtyVal = qtyIdx !== -1 ? parseFloat(String(row[qtyIdx] || '').replace(/[^0-9,.-]/g, '').replace(/,/g, '.')) : 0;
            const beratVal = beratIdx !== -1 ? parseFloat(String(row[beratIdx] || '').replace(/[^0-9,.-]/g, '').replace(/,/g, '.')) : 0;
            const hargaRaw = hargaIdx !== -1 ? String(row[hargaIdx] || '') : '';
            const hargaParsed = hargaIdx !== -1 ? parseTotalValue(hargaRaw) : 0;
            const hargaVal = (!isNaN(hargaParsed) ? hargaParsed : 0) * priceScale;

            const totalBerat = (!isNaN(qtyVal) && !isNaN(beratVal)) ? (qtyVal * beratVal) : '';
            const totalHarga = (!isNaN(qtyVal) && !isNaN(hargaVal)) ? (qtyVal * hargaVal) : '';

            row[totalBeratIdx] = totalBerat === '' ? '' : String(totalBerat);
            row[totalIdx] = totalHarga === '' ? '' : String(totalHarga);
        }
    }

    window._bahanMasukSheetData = data;
    window._bahanMasukSheetObjects = csvToObjects(data);
    // Update nama bahan options (jika perlu) using the imported data
    try { populateBahanNamaOptions(data); } catch (e) { /* ignore */ }
    renderBahanMasukTable(data);
}

async function importNamaBahanOptionsFromGoogleSheet(sheetId, bahanOptionsGid) {
    const data = await fetchSheetCsv(sheetId, bahanOptionsGid);
    window._namaBahanOptionsData = data;
    populateBahanNamaOptions(data);
}

function renderBahanMasukTable(data) {
    const tbody = document.getElementById('riwayat-bahan-body');
    if (!tbody) return;
    if (!data || data.length < 2) {
        tbody.innerHTML = '<tr><td class="p-4 text-sm text-gray-500" colspan="12">Spreadsheet bahan masuk kosong.</td></tr>';
        return;
    }

    const rows = data.slice(1);
    let html = '';
    rows.forEach((row, idx) => {
        html += '<tr>';
        for (let c = 0; c < 11; c++) {
            const raw = row[c] || '';
            // Normalize TOTAL prefix to 'Rp ' without altering the rest of the cell
            let cell = '';
            if (c === 9 && String(raw).trim() !== '') {
                const withoutRp = String(raw).replace(/^\s*rp\.?\s*/i, '').trim();
                cell = 'Rp ' + escapeHtml(withoutRp);
            } else {
                cell = escapeHtml(raw);
            }
            html += `<td class="p-2 border">${cell}</td>`;
        }
        html += `<td class="p-2 border"><button class="text-sm text-blue-600 hover:underline" data-row-index="${idx+1}" onclick="openEditBahanModal(${idx+1})">Edit</button></td>`;
        html += '</tr>';
    });
    tbody.innerHTML = html;
}

function populateBahanNamaOptions(data) {
    const select = document.getElementById('select-bahan-nama');
    if (!select) return;
    select.innerHTML = '';
    if (!data || data.length < 2) {
        select.innerHTML = '<option value="">Tidak ada nama bahan tersedia</option>';
        return;
    }
    const headers = data[0].map(h => String(h || '').trim());
    const idField = findHeader(headers, ['ID BARANG', 'ID BAHAN', 'ID', 'id']);
    const bahanField = findHeader(headers, ['Nama Bahan', 'nama bahan', 'Bahan', 'bahan', 'Nama', 'nama', 'Name', 'name']);
    const satuanField = findHeader(headers, ['Satuan', 'satuan', 'Unit', 'unit']);
    const beratField = findHeader(headers, ['Berat', 'berat']);
    const hargaField = findHeader(headers, ['Harga', 'harga', 'Price', 'price']);

    const nameIdx = bahanField ? headers.indexOf(bahanField) : 0;
    const idIdx = idField ? headers.indexOf(idField) : -1;
    const satuanIdx = satuanField ? headers.indexOf(satuanField) : -1;
    const beratIdx = beratField ? headers.indexOf(beratField) : -1;
    const hargaIdx = hargaField ? headers.indexOf(hargaField) : -1;

    const values = data.slice(1).map(row => ({
        name: String(row[nameIdx] || '').trim(),
        id: idIdx !== -1 ? String(row[idIdx] || '').trim() : '',
        satuan: satuanIdx !== -1 ? String(row[satuanIdx] || '').trim() : '',
        berat: beratIdx !== -1 ? String(row[beratIdx] || '').trim() : '',
        harga: hargaIdx !== -1 ? String(row[hargaIdx] || '').trim() : ''
    })).filter(v => v.name);

    const uniqueByName = {};
    const satuanSet = new Set();
    values.forEach(v => {
        if (!uniqueByName[v.name]) uniqueByName[v.name] = v;
        if (v.satuan) satuanSet.add(v.satuan);
    });

    const uniqueValues = Object.values(uniqueByName).sort((a, b) => a.name.localeCompare(b.name, 'id-ID'));
    if (!uniqueValues.length) {
        select.innerHTML = '<option value="">Tidak ada nama bahan tersedia</option>';
        return;
    }

    // Simpan peta metadata untuk digunakan saat memilih bahan
    window._namaBahanOptionsMap = {};
    select.innerHTML = '<option value="">Pilih nama bahan</option>';
    uniqueValues.forEach(v => {
        const option = document.createElement('option');
        option.value = v.name;
        option.textContent = v.name;
        if (v.id) option.dataset.id = v.id;
        if (v.satuan) option.dataset.satuan = v.satuan;
        if (v.berat) option.dataset.berat = v.berat;
        if (v.harga) option.dataset.harga = v.harga;
        select.appendChild(option);
        window._namaBahanOptionsMap[v.name] = v;
    });

    // Populate satuan dropdown options
    const satuanSelect = document.getElementById('select-bahan-satuan');
    if (satuanSelect) {
        satuanSelect.innerHTML = '<option value="">Pilih satuan</option>';
        Array.from(satuanSet).sort().forEach(s => {
            const o = document.createElement('option'); o.value = s; o.textContent = s; satuanSelect.appendChild(o);
        });
    }
}

// Setup modal field listeners: autofill ID, compute totals, sync satuan
function setupBahanModalHandlers() {
    const select = document.getElementById('select-bahan-nama');
    const idInput = document.getElementById('input-bahan-id');
    const qtyInput = document.getElementById('input-bahan-jumlah');
    const beratInput = document.getElementById('input-bahan-berat');
    const satuanSelect = document.getElementById('select-bahan-satuan');
    const hargaInput = document.getElementById('input-bahan-harga');
    const totalBeratInput = document.getElementById('input-bahan-total-berat');
    const totalHargaInput = document.getElementById('input-bahan-total-harga');

    function computeTotals() {
        const qty = parseFloat(qtyInput.value) || 0;
        const berat = parseFloat(beratInput.value) || 0;
        const harga = parseTotalValue(hargaInput ? hargaInput.value : 0) || 0;
        const totalBerat = qty * berat;
        const totalHarga = qty * harga;
        if (totalBeratInput) totalBeratInput.value = isNaN(totalBerat) ? '' : String(totalBerat);
        if (totalHargaInput) {
            if (isNaN(totalHarga)) totalHargaInput.value = '';
            else totalHargaInput.value = formatRupiah(totalHarga);
        }
    }

    if (select) select.addEventListener('change', () => {
        const name = select.value;
        const meta = window._namaBahanOptionsMap ? window._namaBahanOptionsMap[name] : null;
        if (meta) {
            if (idInput) idInput.value = meta.id || '';
            if (beratInput && meta.berat) beratInput.value = meta.berat;
            if (hargaInput && meta.harga) formatInputRupiah(hargaInput, parseTotalValue(meta.harga));
            if (satuanSelect && meta.satuan) {
                const opt = Array.from(satuanSelect.options).find(o => o.value === meta.satuan);
                if (opt) satuanSelect.value = meta.satuan;
                else {
                    const newOpt = document.createElement('option'); newOpt.value = meta.satuan; newOpt.textContent = meta.satuan; satuanSelect.appendChild(newOpt); satuanSelect.value = meta.satuan;
                }
            }
        } else {
            if (idInput) idInput.value = '';
        }
        computeTotals();
    });

    // Helper: format input to rupiah display
    function formatInputRupiah(el, value) {
        if (!el) return;
        if (value == null || value === '') { el.value = ''; return; }
        const n = Math.round(Number(value) || 0);
        if (isNaN(n) || n === 0 && String(value).trim() === '') { el.value = ''; return; }
        el.value = formatRupiah(n);
    }

    // When focusing a rupiah field, show raw number for editing
    if (hargaInput) {
        hargaInput.addEventListener('focus', () => {
            const n = parseTotalValue(hargaInput.value);
            hargaInput.value = n === 0 && String(hargaInput.value).trim() === '' ? '' : String(n);
        });
        hargaInput.addEventListener('blur', () => {
            const n = parseTotalValue(hargaInput.value);
            formatInputRupiah(hargaInput, n);
            computeTotals();
        });
    }

    if (totalHargaInput) {
        totalHargaInput.addEventListener('focus', () => {
            const n = parseTotalValue(totalHargaInput.value);
            totalHargaInput.value = n === 0 && String(totalHargaInput.value).trim() === '' ? '' : String(n);
        });
        totalHargaInput.addEventListener('blur', () => {
            const n = parseTotalValue(totalHargaInput.value);
            formatInputRupiah(totalHargaInput, n);
        });
    }

    [qtyInput, beratInput, hargaInput].forEach(el => {
        if (!el) return;
        el.addEventListener('input', computeTotals);
    });

    // Handle modal form submit: append to riwayat table and close modal
    const form = document.getElementById('form-bahan');
    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = idInput ? idInput.value : '';
        const name = select ? select.value : '';
        const qty = qtyInput ? (qtyInput.value || '0') : '0';
        const berat = beratInput ? (beratInput.value || '0') : '0';
        const satuan = satuanSelect ? (satuanSelect.value || '') : '';
        const totalBerat = totalBeratInput ? totalBeratInput.value : '';
        const harga = hargaInput ? parseTotalValue(hargaInput.value) : 0;
        const totalHarga = totalHargaInput ? parseTotalValue(totalHargaInput.value) : 0;
        const keterangan = document.getElementById('input-bahan-keterangan') ? document.getElementById('input-bahan-keterangan').value : '';

        // Jika sedang edit, update row di window._bahanMasukSheetData
        if (window._editingBahanIndex) {
            const idx = window._editingBahanIndex; // 1-based index into data array
            if (window._bahanMasukSheetData && window._bahanMasukSheetData[idx]) {
                const row = window._bahanMasukSheetData[idx];
                // Map values back into expected positions: try to preserve original column order
                // We'll write to columns A-K positions (0..10)
                row[0] = row[0] || row[0]; // TX keep
                row[1] = row[1] || row[1]; // TANGGAL MASUK preserve if exists
                row[2] = id;
                row[3] = name;
                row[4] = qty;
                row[5] = berat;
                row[6] = satuan;
                row[7] = totalBerat;
                row[8] = String(harga);
                row[9] = String(totalHarga);
                row[10] = keterangan;
                // Re-render full table
                renderBahanMasukTable(window._bahanMasukSheetData);
                showToast('Data bahan berhasil diubah', 'success');
            }
            window._editingBahanIndex = null;
        } else {
            // Tambah sebagai baris baru di data dan re-render
            const newRow = [];
            newRow[0] = '';
            newRow[1] = new Date().toLocaleDateString('id-ID');
            newRow[2] = id;
            newRow[3] = name;
            newRow[4] = qty;
            newRow[5] = berat;
            newRow[6] = satuan;
            newRow[7] = totalBerat;
            newRow[8] = String(harga);
            newRow[9] = String(totalHarga);
            newRow[10] = keterangan;
            window._bahanMasukSheetData = window._bahanMasukSheetData || [ [] ];
            window._bahanMasukSheetData.push(newRow);
            renderBahanMasukTable(window._bahanMasukSheetData);
            showToast('Data bahan masuk tersimpan', 'success');
        }

        // Tutup modal
        if (typeof closeModal === 'function') closeModal('modalBahan');
        form.reset();
    });
}

function setupCostHarianHandlers() {
    const form = document.getElementById('form-cost');
    const filterBtn = document.getElementById('cost-filter-btn');
    const resetBtn = document.getElementById('cost-reset-filter-btn');
    const startInput = document.getElementById('cost-filter-start');
    const endInput = document.getElementById('cost-filter-end');
    const idInput = document.getElementById('input-cost-id');
    const nameInput = document.getElementById('input-cost-nama');

    if (filterBtn) filterBtn.addEventListener('click', () => renderCostHarianTable(window._costHarianSheetData));
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (startInput) startInput.value = '';
        if (endInput) endInput.value = '';
        renderCostHarianTable(window._costHarianSheetData);
    });
    [startInput, endInput].forEach(el => {
        if (el) el.addEventListener('change', () => renderCostHarianTable(window._costHarianSheetData));
    });

    if (nameInput) {
        nameInput.addEventListener('change', syncCostNameId);
    }

    if (idInput) {
        const nextId = () => {
            const rows = window._costHarianSheetData ? window._costHarianSheetData.slice(1) : [];
            const ids = rows.map((row) => {
                const header = window._costHarianSheetData[0].find(h => ['ID','Id','id'].includes(String(h || '').trim()));
                const idx = header ? window._costHarianSheetData[0].indexOf(header) : -1;
                const val = idx !== -1 ? String(row[idx] || '').trim() : '';
                return Number(val);
            }).filter(v => Number.isFinite(v) && v > 0);
            return ids.length ? Math.max(...ids) + 1 : 1;
        };
        idInput.value = nextId();
        if (typeof openModal === 'function') {
            const originalOpen = openModal;
            window.openModal = function(modalId) {
                originalOpen(modalId);
                if (modalId === 'modalCost' && idInput) {
                    idInput.value = nextId();
                }
            };
        }
    }

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tanggal = document.getElementById('input-cost-tanggal')?.value || '';
        const id = document.getElementById('input-cost-id')?.value || '';
        const nama = document.getElementById('input-cost-nama')?.value || '';
        const qty = document.getElementById('input-cost-qty')?.value || '';
        const total = document.getElementById('input-cost-total')?.value || '';
        const keperluan = document.getElementById('input-cost-keperluan')?.value || '';

        if (!window._costHarianSheetData) {
            window._costHarianSheetData = [['TANGGAL', 'ID', 'NAMA', 'QTY', 'TOTAL', 'KEPERLUAN']];
        }
        const headers = window._costHarianSheetData[0];
        const newRow = Array(headers.length).fill('');
        const dateIdx = headers.findIndex(h => ['TANGGAL', 'Tanggal', 'tanggal', 'Date', 'date', 'tgl'].includes(String(h || '').trim()));
        const idIdx = headers.findIndex(h => ['ID', 'Id', 'id'].includes(String(h || '').trim()));
        const namaIdx = headers.findIndex(h => ['NAMA', 'Nama', 'nama', 'Item', 'item'].includes(String(h || '').trim()));
        const qtyIdx = headers.findIndex(h => ['QTY', 'Qty', 'qty', 'Jumlah', 'jumlah'].includes(String(h || '').trim()));
        const totalIdx = headers.findIndex(h => ['TOTAL', 'Total', 'total', 'Nominal', 'nominal'].includes(String(h || '').trim()));
        const keperluanIdx = headers.findIndex(h => ['KEPERLUAN', 'Keperluan', 'Keterangan', 'keterangan', 'Catatan'].includes(String(h || '').trim()));

        if (dateIdx !== -1) newRow[dateIdx] = tanggal;
        if (idIdx !== -1) newRow[idIdx] = id;
        if (namaIdx !== -1) newRow[namaIdx] = nama;
        if (qtyIdx !== -1) newRow[qtyIdx] = qty;
        if (totalIdx !== -1) newRow[totalIdx] = total;
        if (keperluanIdx !== -1) newRow[keperluanIdx] = keperluan;

        if (window._editingCostHarianIndex != null) {
            window._costHarianSheetData[window._editingCostHarianIndex] = newRow;
            showToast('Data cost harian berhasil diubah', 'success');
            window._editingCostHarianIndex = null;
        } else {
            window._costHarianSheetData.push(newRow);
            showToast('Data cost harian berhasil ditambahkan', 'success');
        }

        renderCostHarianTable(window._costHarianSheetData);
        form.reset();
        if (typeof closeModal === 'function') closeModal('modalCost');
    });
}

// Initialize modal handlers after DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    setupBahanModalHandlers();
    setupCostHarianHandlers();
});

// Open modal for editing a specific imported row (index is 1-based relative to data array)
function openEditBahanModal(index) {
    if (!window._bahanMasukSheetData || !window._bahanMasukSheetData[index]) return;
    const row = window._bahanMasukSheetData[index];
    // Map columns A-K to modal fields
    const idInput = document.getElementById('input-bahan-id');
    const select = document.getElementById('select-bahan-nama');
    const qtyInput = document.getElementById('input-bahan-jumlah');
    const beratInput = document.getElementById('input-bahan-berat');
    const satuanSelect = document.getElementById('select-bahan-satuan');
    const hargaInput = document.getElementById('input-bahan-harga');
    const totalBeratInput = document.getElementById('input-bahan-total-berat');
    const totalHargaInput = document.getElementById('input-bahan-total-harga');
    const keteranganInput = document.getElementById('input-bahan-keterangan');

    if (idInput) idInput.value = row[2] || '';
    if (select) select.value = row[3] || '';
    if (qtyInput) qtyInput.value = row[4] || '';
    if (beratInput) beratInput.value = row[5] || '';
    if (satuanSelect) satuanSelect.value = row[6] || '';
    if (totalBeratInput) totalBeratInput.value = row[7] || '';
    if (hargaInput) formatInputRupiah(hargaInput, parseTotalValue(row[8] || ''));
    if (totalHargaInput) formatInputRupiah(totalHargaInput, parseTotalValue(row[9] || ''));
    if (keteranganInput) keteranganInput.value = row[10] || '';

    window._editingBahanIndex = index;
    if (typeof openModal === 'function') openModal('modalBahan');
}

async function importInventoryFromGoogleSheet(sheetId, inventoryGid) {
    showMenuInventoryMessage('Memuat data inventory...');

    const data = await fetchSheetCsv(sheetId, inventoryGid);
    window._inventorySheetData = data;
    window._inventorySheetObjects = csvToObjects(data);
    renderInventoryTable(data);
    // Bangun peta inventory untuk sinkronisasi ID/satuan/berat/harga
    try {
        buildInventoryMap(data);
    } catch (err) {
        console.warn('Gagal membangun inventory map:', err);
    }
}

function buildInventoryMap(data) {
    if (!data || data.length < 2) return;
    const headers = data[0].map(h => String(h || '').trim());
    const idField = findHeader(headers, ['ID BARANG', 'ID BAHAN', 'ID', 'id']);
    const nameField = findHeader(headers, ['Nama', 'NAMA', 'Nama Bahan', 'nama bahan', 'Name', 'name']);
    const satuanField = findHeader(headers, ['Satuan', 'satuan', 'Unit', 'unit']);
    const beratField = findHeader(headers, ['Berat', 'berat']);
    const hargaField = findHeader(headers, ['Harga', 'harga', 'Price', 'price']);

    const objs = csvToObjects(data);
    window._inventoryMap = window._inventoryMap || {};
    objs.forEach(o => {
        const name = nameField ? String(o[nameField] || '').trim() : '';
        if (!name) return;
        const key = name.toLowerCase();
        window._inventoryMap[key] = {
            id: idField ? String(o[idField] || '').trim() : '',
            satuan: satuanField ? String(o[satuanField] || '').trim() : '',
            berat: beratField ? String(o[beratField] || '').trim() : '',
            harga: hargaField ? String(o[hargaField] || '').trim() : ''
        };
    });

    // Jika sudah ada nama bahan options, merge inventory metadata
    const select = document.getElementById('select-bahan-nama');
    if (window._namaBahanOptionsMap) {
        Object.keys(window._namaBahanOptionsMap).forEach(name => {
            const key = name.toLowerCase();
            if (window._inventoryMap[key]) {
                const inv = window._inventoryMap[key];
                const meta = window._namaBahanOptionsMap[name];
                meta.id = meta.id || inv.id;
                meta.satuan = meta.satuan || inv.satuan;
                meta.berat = meta.berat || inv.berat;
                meta.harga = meta.harga || inv.harga;
            }
        });
        // update option dataset attributes
        if (select) {
            Array.from(select.options).forEach(opt => {
                const v = opt.value;
                if (v && window._namaBahanOptionsMap[v]) {
                    const m = window._namaBahanOptionsMap[v];
                    if (m.id) opt.dataset.id = m.id;
                    if (m.satuan) opt.dataset.satuan = m.satuan;
                    if (m.berat) opt.dataset.berat = m.berat;
                    if (m.harga) opt.dataset.harga = m.harga;
                }
            });
        }
    } else {
        // Jika belum ada nama bahan options, buat daftar dari inventory
        const names = Object.keys(window._inventoryMap).sort((a,b)=>a.localeCompare(b,'id-ID'));
        if (select) {
            select.innerHTML = '<option value="">Pilih nama bahan</option>';
            names.forEach(k => {
                const inv = window._inventoryMap[k];
                const option = document.createElement('option');
                option.value = inv && inv.id ? inv.id : k;
                option.textContent = k;
                if (inv && inv.id) option.dataset.id = inv.id;
                if (inv && inv.satuan) option.dataset.satuan = inv.satuan;
                if (inv && inv.berat) option.dataset.berat = inv.berat;
                if (inv && inv.harga) option.dataset.harga = inv.harga;
                select.appendChild(option);
            });
        }
    }
}

function renderInventoryTable(data) {
    const container = document.getElementById('menu-inventory-data');
    if (!container) return;
    if (!data || data.length === 0) {
        showMenuInventoryMessage('Spreadsheet inventory kosong.');
        return;
    }

    const headers = data[0];
    const rows = data.slice(1);
    const total = rows.length;
    const limit = 25;
    const displayRows = rows.length <= limit ? rows : rows.slice(0, limit);

    let html = '<div class="flex items-center justify-between mb-2">';
    html += `<div class="text-sm text-gray-600">Menampilkan ${displayRows.length} dari ${total} baris data inventory</div>`;
    html += '</div>';
    html += '<div class="overflow-x-auto">';
    html += '<table class="w-full text-left border-collapse text-sm">';
    html += '<thead><tr class="bg-gray-100 text-gray-700">';
    headers.forEach(h => { html += `<th class="p-2 border">${escapeHtml(h)}</th>`; });
    html += '</tr></thead>';
    html += '<tbody class="divide-y">';
    displayRows.forEach(row => {
        html += '<tr>';
        headers.forEach((_, i) => { html += `<td class="p-2 border">${escapeHtml(row[i] || '')}</td>`; });
        html += '</tr>';
    });
    html += '</tbody></table></div>';

    if (rows.length > limit) {
        html += '<div class="mt-3 text-sm text-gray-500">Hanya 25 baris pertama ditampilkan. Tambahkan filter atau gunakan sheet yang lebih kecil jika diperlukan.</div>';
    }

    container.classList.remove('hidden');
    container.innerHTML = html;
}

async function detectItemKeluarGid(sheetId, candidateGids) {
    for (const gid of candidateGids) {
        try {
            const data = await fetchSheetCsv(sheetId, gid);
            const headers = data[0].map(h => String(h || '').trim().toLowerCase());
            const hasCategory = headers.includes('kategori');
            const hasItem = headers.some(h => ['item', 'menu', 'nama', 'produk'].includes(h));
            if (hasCategory && hasItem) {
                return gid;
            }
        } catch (err) {
            // ignore invalid gids
        }
    }
    return null;
}

function parseCsv(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    return lines.map(line => {
        // Split di koma, hapus petik jika ada
        const cols = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.trim());
        return cols.map(c => {
            if (c.startsWith('"') && c.endsWith('"')) return c.slice(1, -1);
            return c;
        });
    });
}

function renderSheetTable(data, showAll = false) {
    const container = document.getElementById('menu-keluar-data');
    if (!container) return;
    if (!data || data.length === 0) {
        showMenuKeluarMessage('Spreadsheet kosong.');
        return;
    }
    // Simpan data global untuk toggle
    window._lastSheetData = data;
    window._sheetShowingAll = !!showAll;

    const headers = data[0];
    const rows = data.slice(1);
    const total = rows.length;
    const limit = 25;
    const displayRows = (showAll || rows.length <= limit) ? rows : rows.slice(Math.max(0, rows.length - limit));

    let html = '<div class="flex items-center justify-between mb-2">';
    html += `<div class="text-sm text-gray-600">Menampilkan ${displayRows.length} dari ${total} data item keluar</div>`;
    if (rows.length > limit) {
        html += `<button id="sheet-toggle-btn" class="text-sm text-blue-600 hover:underline">${showAll ? 'Tutup' : 'Tampilkan Semua'}</button>`;
    }
    html += '</div>';

    html += '<div class="overflow-x-auto">';
    html += '<table class="w-full text-left border-collapse text-sm">';
    html += '<thead><tr class="bg-gray-100 text-gray-700">';
    headers.forEach(h => { html += `<th class="p-2 border">${escapeHtml(h)}</th>`; });
    html += '</tr></thead>';
    html += '<tbody class="divide-y">';
    displayRows.forEach(r => {
        html += '<tr>';
        headers.forEach((_, i) => { html += `<td class="p-2 border">${escapeHtml(r[i] || '')}</td>`; });
        html += '</tr>';
    });
    html += '</tbody></table></div>';

    container.classList.remove('hidden');
    container.innerHTML = html;

    const toggle = document.getElementById('sheet-toggle-btn');
    if (toggle) toggle.addEventListener('click', () => {
        renderSheetTable(window._lastSheetData, !window._sheetShowingAll);
    });
}

function renderGenericSheetTable(data, containerId, title, description, maxColumns = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!data || data.length === 0) {
        container.innerHTML = `<div class="text-sm text-gray-600">Spreadsheet ${escapeHtml(title)} kosong.</div>`;
        return;
    }
    const headers = data[0].slice(0, maxColumns || data[0].length);
    const rows = data.slice(1).map(row => row.slice(0, maxColumns || row.length));
    const total = rows.length;
    const limit = 50;
    const displayRows = rows.length <= limit ? rows : rows.slice(0, limit);

    let html = `<div class="mb-2 text-sm text-gray-600">${escapeHtml(description)} Menampilkan ${displayRows.length} dari ${total} baris.</div>`;
    html += '<div class="overflow-x-auto">';
    html += '<table class="w-full text-left border-collapse text-sm">';
    html += '<thead><tr class="bg-gray-100 text-gray-700">';
    headers.forEach(h => { html += `<th class="p-2 border">${escapeHtml(h)}</th>`; });
    html += '</tr></thead>';
    html += '<tbody class="divide-y">';
    displayRows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => { html += `<td class="p-2 border">${escapeHtml(cell || '')}</td>`; });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    if (rows.length > limit) {
        html += '<div class="mt-3 text-sm text-gray-500">Hanya 50 baris pertama ditampilkan. Persempit filter di sheet untuk melihat lebih banyak.</div>';
    }
    container.classList.remove('hidden');
    container.innerHTML = html;
}

async function loadCashflowSheetData({ title, sheetId, gid, maxColumns, containerId, description, type }) {
    try {
        if (type) {
            window._selectedCashflowType = type;
        }
        showMenuCashflowMessage(`Memuat data ${escapeHtml(title)}...`);
        const data = await fetchSheetCsv(sheetId, gid);
        renderGenericSheetTable(data, containerId, title, description, maxColumns);
        if (type === 'saldo-bank' || type === 'cashflow-bank' || type === 'cashflow-tunai') {
            renderCashflowSummary(data, type);
        } else {
            clearCashflowSummary();
        }
    } catch (err) {
        console.error(err);
        showMenuCashflowMessage(`Gagal memuat ${escapeHtml(title)}: ${err.message}`);
        if (type === 'saldo-bank' || type === 'cashflow-bank' || type === 'cashflow-tunai') {
            clearCashflowSummary();
        }
    }
}

function loadCashflowType(type = 'saldo-bank') {
    const normalizedType = String(type || 'saldo-bank').toLowerCase();
    const buttonMap = {
        'saldo-bank': 'cashflow-saldo-bank-btn',
        'cashflow-tunai': 'cashflow-tunai-btn',
        'cashflow-bank': 'cashflow-bank-btn'
    };
    const buttonId = buttonMap[normalizedType] || buttonMap['saldo-bank'];
    if (buttonId) activateCashflowSubmenu(buttonId);

    const configMap = {
        'saldo-bank': {
            title: 'Saldo Bank',
            sheetId: '16vZ1QYSVCnMH9AaXkMLb3qhUDJOrnEA73KH9yNmcVgo',
            gid: '1262046169',
            maxColumns: 14,
            containerId: 'cashflow-table',
            description: 'Menampilkan data SALDO BANK dari Google Sheets.',
            type: 'saldo-bank'
        },
        'cashflow-tunai': {
            title: 'Cashflow Tunai',
            sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
            gid: '637620427',
            maxColumns: 7,
            containerId: 'cashflow-table',
            description: 'Menampilkan data CASHFLOW TUNAI dari Google Sheets.',
            type: 'cashflow-tunai'
        },
        'cashflow-bank': {
            title: 'Cashflow Bank',
            sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
            gid: '1927567222',
            maxColumns: null,
            containerId: 'cashflow-table',
            description: 'Menampilkan data CASHFLOW BANK dari Google Sheets.',
            type: 'cashflow-bank'
        }
    };

    const config = configMap[normalizedType] || configMap['saldo-bank'];
    if (config) {
        loadCashflowSheetData(config);
    }
}

function loadOmsetPerhariDefault() {
    const config = {
        sheetId: '10ENNBxmTes6MWqLGM2k4SKQAD9stU7oEymmnKV9FlbI',
        gid: '2031914011',
        maxColumns: 4,
        containerId: 'omset-perhari-table',
        description: 'Menampilkan data OMSET PERHARI dari Google Sheets.'
    };
    loadOmsetPerhariData(config);
}

async function loadOmsetPerhariData({ sheetId, gid, maxColumns, containerId, description }) {
    try {
        showMenuOmsetPerhariMessage('Memuat data Omset Perhari...');
        const data = await fetchSheetCsv(sheetId, gid);
        renderGenericSheetTable(data, containerId, 'Omset Perhari', description, maxColumns);
    } catch (err) {
        console.error(err);
        showMenuOmsetPerhariMessage(`Gagal memuat Omset Perhari: ${err.message}`);
    }
}

async function loadGajiData() {
    try {
        showMenuGajiMessage('Memuat data Gaji...');
        const sheetId = '16vZ1QYSVCnMH9AaXkMLb3qhUDJOrnEA73KH9yNmcVgo';
        const gid = '0';
        const data = await fetchSheetCsv(sheetId, gid);
        renderGenericSheetTable(data, 'menu-gaji-table', 'Gaji', 'Menampilkan data Gaji dari Google Sheets.', null);
    } catch (err) {
        console.error(err);
        showMenuGajiMessage(`Gagal memuat Gaji: ${err.message}`);
    }
}

function activateCashflowSubmenu(buttonId) {
    const buttons = document.querySelectorAll('.cashflow-submenu-btn');
    buttons.forEach(btn => {
        if (btn.id === buttonId) {
            btn.classList.remove('bg-slate-200', 'text-slate-700');
            btn.classList.add('bg-slate-700', 'text-white');
        } else {
            btn.classList.remove('bg-slate-700', 'text-white');
            btn.classList.add('bg-slate-200', 'text-slate-700');
        }
    });
}

function clearCashflowSummary() {
    const container = document.getElementById('cashflow-summary');
    if (!container) return;
    container.innerHTML = '';
}

function renderCashflowSummary(data, type) {
    const container = document.getElementById('cashflow-summary');
    if (!container) return;
    container.innerHTML = '';
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="sm:col-span-3 bg-white p-4 rounded-xl shadow-sm text-sm text-gray-500">Tidak ada data cashflow untuk ditampilkan.</div>';
        return;
    }

    const rows = getCashflowSummaryRows(data);
    const lowerType = String(type || '').toLowerCase();

    if (lowerType === 'saldo-bank') {
        const headers = data[0].map(h => String(h || '').trim());
        const totalSaldoKeseluruhanIndex = findHeaderIndex(headers, ['total Saldo Keseluruhan', 'saldo total', 'jumlah saldo', 'saldo']);
        const bankSaldoIndexes = findHeaderIndexes(headers, ['saldo bank', 'bank saldo', 'bank']);
        const tunaiSaldoIndexes = findHeaderIndexes(headers, ['saldo tunai', 'tunai', 'cash', 'cashflow']);

        const rowSaldoBank = findRowValue(rows, ['saldo bank', 'bank saldo', 'saldo bank']);
        const rowSaldoTunai = findRowValue(rows, ['saldo tunai', 'tunai', 'cash', 'saldo tunai']);
        const rowTotalSaldo = findRowValue(rows, ['total saldo', 'saldo total', 'jumlah saldo', 'jumlah total']);

        const saldoBank = rowSaldoBank != null ? parseTotalValue(rowSaldoBank) : (bankSaldoIndexes.length ? sumColumnIndexes(rows, bankSaldoIndexes) : 0);
        const saldoTunai = rowSaldoTunai != null ? parseTotalValue(rowSaldoTunai) : (tunaiSaldoIndexes.length ? sumColumnIndexes(rows, tunaiSaldoIndexes) : 0);
        const totalSaldo = rowTotalSaldo != null ? parseTotalValue(rowTotalSaldo)
            : (totalSaldoIndex !== -1 ? sumColumn(rows, totalSaldoIndex)
                : (saldoBank || saldoTunai ? saldoBank + saldoTunai : 0));

        const totalSaldoText = totalSaldo !== 0 ? formatRupiah(totalSaldo) : '-';
        const saldoBankText = saldoBank !== 0 ? formatRupiah(saldoBank) : '-';
        const saldoTunaiText = saldoTunai !== 0 ? formatRupiah(saldoTunai) : '-';

        container.innerHTML = `
            <div class="sm:col-span-3 bg-emerald-500 text-white p-5 rounded-xl shadow-md">
                <div class="text-sm uppercase tracking-wider opacity-80">Total Saldo Keseluruhan</div>
                <div class="mt-3 text-3xl font-bold">${totalSaldoText}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm">
                <div class="text-sm uppercase tracking-wider text-slate-500">Saldo Bank</div>
                <div class="mt-3 text-2xl font-semibold text-slate-800">${saldoBankText}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm">
                <div class="text-sm uppercase tracking-wider text-slate-500">Saldo Tunai</div>
                <div class="mt-3 text-2xl font-semibold text-slate-800">${saldoTunaiText}</div>
            </div>
        `;
        return;
    }

    const labelAlias = lowerType === 'cashflow-bank' ? ['saldo bank', 'bank saldo', 'saldo bank'] : ['saldo tunai', 'tunai', 'cash', 'saldo tunai'];
    const labelText = lowerType === 'cashflow-bank' ? 'Saldo Bank' : 'Saldo Tunai';
    const rowValue = findRowValue(rows, labelAlias);
    const amountText = rowValue != null ? formatRupiah(parseTotalValue(rowValue)) : '-';

    container.innerHTML = `
        <div class="sm:col-span-3 bg-slate-800 text-white p-5 rounded-xl shadow-md">
            <div class="text-sm uppercase tracking-wider opacity-80">${labelText}</div>
            <div class="mt-3 text-3xl font-bold">${amountText}</div>
        </div>
    `;
}

function getCashflowSummaryRows(data) {
    if (!Array.isArray(data) || data.length === 0) return [];
    const firstRow = (data[0] || []).map(c => normalizeCellText(c));
    const headerKeywords = ['tanggal', 'cash in', 'cash out', 'qris', 'keterangan', 'keterangan', 'saldo', 'jumlah'];
    const headerMatches = firstRow.reduce((count, cell) => {
        return count + (headerKeywords.some(k => cell.includes(k)) ? 1 : 0);
    }, 0);
    return headerMatches >= 2 ? data.slice(1) : data;
}

function findHeaderIndex(headers, aliases) {
    const lower = headers.map(h => String(h || '').toLowerCase());
    for (const alias of aliases) {
        const exact = lower.findIndex(h => h === alias.toLowerCase());
        if (exact !== -1) return exact;
    }
    for (const alias of aliases) {
        const partial = lower.findIndex(h => h.includes(alias.toLowerCase()));
        if (partial !== -1) return partial;
    }
    return -1;
}

function findHeaderIndexes(headers, aliases) {
    const lower = headers.map(h => String(h || '').toLowerCase());
    const indexes = new Set();
    for (const alias of aliases) {
        lower.forEach((h, idx) => {
            if (h === alias.toLowerCase() || h.includes(alias.toLowerCase())) {
                indexes.add(idx);
            }
        });
    }
    return Array.from(indexes);
}

function sumColumn(rows, index) {
    return rows.reduce((sum, row) => sum + parseTotalValue(row[index]), 0);
}

function sumColumnIndexes(rows, indexes) {
    return rows.reduce((sum, row) => {
        return sum + indexes.reduce((inner, idx) => inner + parseTotalValue(row[idx]), 0);
    }, 0);
}

function normalizeCellText(value) {
    return String(value || '')
        .replace(/\s+/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/[:\-–—]+/g, ' ')
        .trim()
        .toLowerCase();
}

function getFirstNumericCandidate(row, indexes) {
    for (const idx of indexes) {
        if (idx == null || idx < 0 || idx >= row.length) continue;
        const candidate = String(row[idx] || '').trim();
        if (parseTotalValue(candidate) !== 0) return candidate;
    }
    return null;
}

function findRowValue(rows, aliases) {
    const normalizedAliases = aliases.map(a => normalizeCellText(a));
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const normalizedRow = row.map(cell => normalizeCellText(cell));
        for (let colIndex = 0; colIndex < normalizedRow.length; colIndex++) {
            const cell = normalizedRow[colIndex];
            if (!cell) continue;
            if (normalizedAliases.some(alias => cell === alias || cell.includes(alias))) {
                const originalCell = String(row[colIndex] || '').trim();
                if (parseTotalValue(originalCell) !== 0) return originalCell;

                const candidateIndexes = [colIndex + 1, colIndex - 1, colIndex + 2, colIndex - 2];
                const candidate = getFirstNumericCandidate(row, candidateIndexes);
                if (candidate) return candidate;

                const below = rows[rowIndex + 1] || [];
                const above = rows[rowIndex - 1] || [];
                const verticalCandidate = getFirstNumericCandidate(below, [colIndex]) || getFirstNumericCandidate(above, [colIndex]);
                if (verticalCandidate) return verticalCandidate;

                const rowCandidate = getFirstNumericCandidate(row, row.map((_, idx) => idx));
                if (rowCandidate) return rowCandidate;

                for (let offset = 1; offset < rows.length; offset++) {
                    const belowRow = rows[rowIndex + offset];
                    if (belowRow) {
                        const candidateBelowRow = getFirstNumericCandidate(belowRow, [colIndex]);
                        if (candidateBelowRow) return candidateBelowRow;
                    }
                    const aboveRow = rows[rowIndex - offset];
                    if (aboveRow) {
                        const candidateAboveRow = getFirstNumericCandidate(aboveRow, [colIndex]);
                        if (candidateAboveRow) return candidateAboveRow;
                    }
                }
            }
        }
    }
    return null;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderDashboardPreview(filtered, headers) {
    const container = document.getElementById('dashboard-keluar-tabel');
    if (!container) return;
    if (!filtered || filtered.length === 0) {
        container.innerHTML = '<div class="text-sm text-gray-500">Tidak ada data item keluar untuk ditampilkan.</div>';
        return;
    }

    const headersToShow = headers.map(h => String(h || '').trim());
    const rows = filtered.slice(-25);
    let html = '<div class="overflow-x-auto">';
    html += '<table class="w-full text-left border-collapse text-sm">';
    html += '<thead><tr class="bg-gray-100 text-gray-700">';
    headersToShow.forEach(h => html += `<th class="p-2 border">${escapeHtml(h)}</th>`);
    html += '</tr></thead>';
    html += '<tbody class="divide-y">';
    rows.forEach(row => {
        html += '<tr>';
        headersToShow.forEach(h => html += `<td class="p-2 border">${escapeHtml(row[h] || '')}</td>`);
        html += '</tr>';
    });
    html += '</tbody></table></div>';

    container.innerHTML = html;
}

function updateDashboardCharts(filtered, headers, quantityField) {
    const charts = window._dashboardCharts || {};
    const categoryField = findHeader(headers, ['Kategori','kategori']);
    const itemNameField = findHeader(headers, ['Nama Item','Nama','Item','item','Menu','menu','Produk','produk']);
    const dateField = findHeader(headers, ['Tanggal','tanggal','Date','date','Tgl','tgl','waktu']);
    const totalField = findHeader(headers, ['Total','total','Jumlah','jumlah','Subtotal','subtotal','Nominal','nominal','Amount','amount','Total Harga','total harga','KEUNTUNGAN','Keuntungan']);

    const categoryCounts = {};
    const salesByName = {};
    const monthTotals = {};
    const last15Daily = {};

    filtered.forEach(o => {
        const category = categoryField ? String(o[categoryField] || 'Lainnya') : 'Lainnya';
        if (categoryField) {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }

        if (itemNameField && totalField) {
            const itemName = String(o[itemNameField] || 'Lainnya');
            const salesValue = parseTotalValue(o[totalField]);
            if (!isNaN(salesValue)) {
                salesByName[itemName] = (salesByName[itemName] || 0) + salesValue;
            }
        }

        if (dateField && totalField) {
            const d = parseDateFromCell(o[dateField]);
            const totalValue = parseTotalValue(o[totalField]);
            if (d && !isNaN(totalValue)) {
                const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                last15Daily[dayKey] = (last15Daily[dayKey] || 0) + totalValue;
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                monthTotals[monthKey] = (monthTotals[monthKey] || 0) + totalValue;
            }
        }
    });

    if (charts.chartKategori) {
        const labels = Object.keys(categoryCounts);
        const data = Object.values(categoryCounts);
        charts.chartKategori.data.labels = labels.length ? labels : ['Belum ada data'];
        charts.chartKategori.data.datasets = [{
            data: data.length ? data : [1],
            backgroundColor: labels.map((_, i) => ['#0f172a','#3b82f6','#f59e0b','#ec4899','#14b8a6'][i % 5])
        }];
        charts.chartKategori.update();
    }

    if (charts.chartItemsSold) {
        const sortedItems = Object.entries(salesByName).sort((a, b) => b[1] - a[1]).slice(0, 8);
        const labels = sortedItems.map(([name]) => name);
        const data = sortedItems.map(([, value]) => value);
        charts.chartItemsSold.data.labels = labels.length ? labels : ['Belum ada data'];
        charts.chartItemsSold.data.datasets = [{
            label: 'Total Penjualan per Nama',
            data: data.length ? data : [0],
            backgroundColor: labels.map((_, i) => ['#3b82f6','#6366f1','#8b5cf6','#c084fc','#f472b6','#fb7185','#f97316','#14b8a6'][i % 8])
        }];
        charts.chartItemsSold.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: false } },
                y: { beginAtZero: true }
            }
        };
        charts.chartItemsSold.update();
    }

    if (charts.chartPaymentMethod) {
        const now = new Date();
        const last15Date = new Date(now);
        last15Date.setDate(last15Date.getDate() - 14);
        const dayKeys = [];
        const dayLabels = [];
        for (let i = 0; i < 15; i += 1) {
            const dt = new Date(last15Date.getFullYear(), last15Date.getMonth(), last15Date.getDate() + i);
            const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
            dayKeys.push(key);
            dayLabels.push(`${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}`);
        }
        const data = dayKeys.map(k => last15Daily[k] || 0);
        charts.chartPaymentMethod.data.labels = dayLabels;
        charts.chartPaymentMethod.data.datasets = [{
            label: 'Penjualan 15 Hari Terakhir',
            data: data,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.25)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#8b5cf6'
        }];
        charts.chartPaymentMethod.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 } },
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        };
        charts.chartPaymentMethod.update();
    }

    if (charts.chart12Month) {
        const now = new Date();
        const monthKeys = [];
        const monthLabels = [];
        for (let i = 11; i >= 0; i -= 1) {
            const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
            monthKeys.push(key);
            monthLabels.push(dt.toLocaleString('id-ID', { month: 'short', year: 'numeric' }));
        }
        const monthData = monthKeys.map(k => monthTotals[k] || 0);
        charts.chart12Month.data.labels = monthLabels;
        charts.chart12Month.data.datasets = [{
            label: 'Total Penjualan 12 Bulan Terakhir',
            data: monthData,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b'
        }];
        charts.chart12Month.options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 } },
                y: { beginAtZero: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        };
        charts.chart12Month.update();
    }

}

// Convert CSV array to array of objects using header row
function csvToObjects(data) {
    if (!data || data.length < 1) return [];
    const headers = data[0].map(h => String(h || '').trim());
    const rows = data.slice(1);
    return rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = r[i] || ''; });
        return obj;
    });
}

async function fetchSheetCsv(sheetId, gid) {
    if (!gid) throw new Error('GID tidak diberikan untuk sheet Google Sheets');

    const urls = [
        `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/pub?output=csv&gid=${gid}`,
        `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`
    ];

    let lastError = null;
    for (const url of urls) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                lastError = new Error(`Fetch error ${res.status} for ${url}`);
                continue;
            }
            const text = await res.text();
            return parseCsv(text);
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError || new Error('Fetch gagal untuk semua endpoint Google Sheets CSV');
}

function mergeCategoryFromItemKeluar(mainData, itemKeluarData) {
    if (!mainData || mainData.length < 1 || !itemKeluarData || itemKeluarData.length < 1) return mainData;

    const mainHeaders = mainData[0].map(h => String(h || '').trim());
    const itemHeaders = itemKeluarData[0].map(h => String(h || '').trim());
    const mainCategoryHeader = findHeader(mainHeaders, ['Kategori', 'kategori']);
    const mainItemHeader = findHeader(mainHeaders, ['Item', 'item', 'Menu', 'Nama', 'name', 'Produk', 'produk']);
    const mainDateHeader = findHeader(mainHeaders, ['Tanggal', 'tanggal', 'Date', 'date', 'Tgl', 'tgl']);
    const itemLookupHeader = findHeader(itemHeaders, ['Item', 'item', 'Menu', 'Nama', 'name', 'Produk', 'produk']) || itemHeaders[0];
    const itemCategoryHeader = findHeader(itemHeaders, ['Kategori', 'kategori']) || (itemHeaders.length > 3 ? itemHeaders[3] : null);

    if (!itemLookupHeader || !itemCategoryHeader) return mainData;

    const itemLookupIndex = itemHeaders.indexOf(itemLookupHeader);
    const itemCategoryIndex = itemHeaders.indexOf(itemCategoryHeader);
    const categoryMap = {};

    itemKeluarData.slice(1).forEach(row => {
        const itemName = String(row[itemLookupIndex] || '').trim().toLowerCase();
        const category = String(row[itemCategoryIndex] || '').trim();
        if (itemName) categoryMap[itemName] = category || 'Lainnya';
    });

    const categoryHeaderName = 'kategori';
    const hasCategory = Boolean(mainCategoryHeader);
    const dateIndex = mainDateHeader ? mainHeaders.indexOf(mainDateHeader) : -1;
    const itemIndex = mainItemHeader ? mainHeaders.indexOf(mainItemHeader) : -1;
    const insertIndex = dateIndex !== -1 ? dateIndex + 1 : (itemIndex !== -1 ? itemIndex : mainHeaders.length);

    const mergedHeaders = hasCategory ? mainHeaders : [
        ...mainHeaders.slice(0, insertIndex),
        categoryHeaderName,
        ...mainHeaders.slice(insertIndex)
    ];

    const merged = [mergedHeaders];
    mainData.slice(1).forEach(row => {
        const newRow = [...row];
        const itemName = mainItemHeader ? String(row[itemIndex] || '').trim().toLowerCase() : '';
        const resolvedCategory = itemName && categoryMap[itemName] ? categoryMap[itemName] : 'Lainnya';

        if (hasCategory) {
            const categoryIdx = mainHeaders.indexOf(mainCategoryHeader);
            const existingCategory = String(row[categoryIdx] || '').trim();
            if (!existingCategory) {
                newRow[categoryIdx] = resolvedCategory;
            }
        } else {
            newRow.splice(insertIndex, 0, resolvedCategory);
        }

        merged.push(newRow);
    });

    return merged;
}

// Configuration: preferred header names for common fields.
// Jika Anda tahu nama kolom persis, tambahkan ke array di bawah atau set
// window.SHEET_HEADER_OVERRIDE = { date: 'Tanggal', total: 'Total' } di runtime.
const SHEET_HEADER_CONFIG = {
    date: ['Tanggal', 'tanggal', 'Date', 'date', 'Tgl', 'tgl', 'waktu', 'created_at', 'created', 'tanggal order', 'tanggal penjualan', 'tanggal transaksi', 'tanggal keluar', 'tanggal masuk'],
    total: ['Total', 'total', 'Jumlah', 'jumlah', 'Subtotal', 'subtotal', 'Nominal', 'nominal', 'Amount', 'amount', 'Total Harga', 'Grand Total']
};

// Find header name by candidates (case-insensitive). "candidates" bisa string kunci ('date'|'total') atau array.
function findHeader(headers, candidates) {
    let candidateList = [];
    if (typeof candidates === 'string') {
        // allow runtime override
        const override = (window.SHEET_HEADER_OVERRIDE && window.SHEET_HEADER_OVERRIDE[candidates]) ? [window.SHEET_HEADER_OVERRIDE[candidates]] : null;
        if (override) candidateList = override;
        else candidateList = SHEET_HEADER_CONFIG[candidates] || [];
    } else if (Array.isArray(candidates)) {
        candidateList = candidates;
    }

    const lower = headers.map(h => String(h || '').toLowerCase());
    // 1) exact match against candidates
    for (const c of candidateList) {
        const idx = lower.indexOf(c.toLowerCase());
        if (idx !== -1) return headers[idx];
    }
    // 2) try partial match (contains)
    for (const h of headers) {
        const lh = String(h || '').toLowerCase();
        for (const c of candidateList) if (lh.includes(c.toLowerCase())) return h;
    }
    // 3) fallback: if candidates was an array, try matching those values partially
    if (Array.isArray(candidates)) {
        for (const h of headers) {
            const lh = String(h || '').toLowerCase();
            for (const c of candidates) if (lh.includes(String(c||'').toLowerCase())) return h;
        }
    }
    return null;
}

function parseDateFromCell(v) {
    if (!v) return null;
    v = String(v).trim();
    // Try dd/mm/yyyy or dd-mm-yyyy first, before generic Date parsing.
    const m1 = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if (m1) {
        let dd = parseInt(m1[1],10);
        let mm = parseInt(m1[2],10) - 1;
        let yy = parseInt(m1[3],10);
        if (yy < 100) yy += 2000;
        return new Date(yy, mm, dd);
    }
    // Try ISO or other browser-safe formats
    let d = new Date(v);
    if (!isNaN(d)) return d;
    // Fallback null
    return null;
}

function parseTotalValue(v) {
    if (v == null) return 0;
    let s = String(v).trim();
    // remove currency letters and spaces
    s = s.replace(/[^0-9,\.\-]/g, '');
    if (s === '') return 0;
    // If contains both '.' and ',', assume '.' thousands and ',' decimal -> remove dots, replace comma
    if (s.indexOf('.') !== -1 && s.indexOf(',') !== -1) {
        s = s.replace(/\./g, '').replace(/,/g, '.');
    } else if (s.indexOf('.') !== -1 && s.indexOf(',') === -1) {
        // '.' could be thousands separator -> remove
        s = s.replace(/\./g, '');
    } else if (s.indexOf(',') !== -1 && s.indexOf('.') === -1) {
        // ',' as decimal
        s = s.replace(/,/g, '.');
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
}

function detectDateField(headers, objects) {
    const dateHeaders = headers.filter(h => String(h || '').toLowerCase().includes('tgl') || String(h || '').toLowerCase().includes('tanggal') || String(h || '').toLowerCase().includes('date') || String(h || '').toLowerCase().includes('waktu'));
    if (dateHeaders.length === 1) return dateHeaders[0];
    for (const h of headers) {
        const sample = objects.slice(0, 5).map(o => o[h]);
        if (sample.every(v => parseDateFromCell(v) !== null)) return h;
    }
    return null;
}

function detectTotalField(headers, objects) {
    const totalHeaders = headers.filter(h => String(h || '').toLowerCase().includes('total') || String(h || '').toLowerCase().includes('jumlah') || String(h || '').toLowerCase().includes('subtotal') || String(h || '').toLowerCase().includes('nominal') || String(h || '').toLowerCase().includes('amount'));
    if (totalHeaders.length === 1) return totalHeaders[0];
    for (const h of headers) {
        const sample = objects.slice(0, 5).map(o => o[h]);
        if (sample.every(v => parseTotalValue(v) !== 0)) return h;
    }
    return null;
}

function formatRupiah(v) {
    const n = Math.round(v);
    return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function applyFilters() {
    const data = window._lastSheetData;
    if (!data || data.length < 2) {
        showMenuKeluarMessage('Tidak ada data untuk difilter.');
        return;
    }
    const headers = data[0];
    const objects = window._sheetObjects || csvToObjects(data);

    // detect date and total fields
    let dateField = findHeader(headers, ['tanggal','date','tgl','waktu','created']);
    let totalField = findHeader(headers, ['total','jumlah','subtotal','nominal','amount']);
    if (!dateField) {
        dateField = detectDateField(headers, objects);
    }
    if (!totalField) {
        totalField = detectTotalField(headers, objects);
    }

    // read filters (only start/end date)
    const start = document.getElementById('filter-start').value; // yyyy-mm-dd
    const end = document.getElementById('filter-end').value;

    let startDate = null, endDate = null;
    if (start && !end) {
        startDate = new Date(start + 'T00:00:00');
        endDate = new Date(start + 'T23:59:59');
    } else if (start && end) {
        startDate = new Date(start + 'T00:00:00');
        endDate = new Date(end + 'T23:59:59');
    } else if (!start && end) {
        // if only end provided, filter that single end date
        startDate = new Date(end + 'T00:00:00');
        endDate = new Date(end + 'T23:59:59');
    }
    if (startDate && isNaN(startDate.getTime())) startDate = null;
    if (endDate && isNaN(endDate.getTime())) endDate = null;

    // filter rows
    let filtered = objects.filter(o => {
        if (!dateField) return true; // cannot filter if no date column
        const cell = o[dateField];
        const d = parseDateFromCell(cell);
        if (!d) return false;
        if (startDate && d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
    });

    if (!dateField) {
        showMenuKeluarMessage('Kolom tanggal tidak terdeteksi. Pastikan nama header tanggal ada di sheet.');
        return;
    }

    if ((start && !end) || (start && end) || (!start && end)) {
        if (filtered.length === 0) {
            showMenuKeluarMessage('Tidak ada data untuk tanggal yang dipilih. Pastikan format tanggal di sheet sesuai dd/mm/yyyy, yyyy-mm-dd, atau dd-mm-yyyy.');
            return;
        }
    }

    // compute total from filtered rows
    let totalSum = 0;
    if (totalField) {
        filtered.forEach(o => { totalSum += parseTotalValue(o[totalField]); });
    }

    // update total display
    const totalEl = document.getElementById('total-penjualan');
    if (totalEl) totalEl.innerText = formatRupiah(totalSum);

    // update item count summary
    const quantityField = findHeader(headers, ['Jumlah','jumlah','Qty','qty','Quantity','quantity']);
    let itemCount = 0;
    if (quantityField) {
        filtered.forEach(o => { itemCount += parseInt(String(o[quantityField] || '').replace(/[^0-9]/g, ''), 10) || 0; });
    }
    const itemEl = document.getElementById('total-item');
    if (itemEl) itemEl.innerText = itemCount;

    updateDashboardCharts(filtered, headers, quantityField);
    renderDashboardPreview(filtered, headers);

    // prepare data array for rendering (headers + rows)
    const headerRow = headers;
    const rowsArray = filtered.map(o => headerRow.map(h => o[h] || ''));
    const renderData = [headerRow].concat(rowsArray);

    const menuKeluar = document.getElementById('menu-keluar');
    const menuKeluarVisible = menuKeluar && !menuKeluar.classList.contains('hidden');
    const showAll = menuKeluarVisible;
    if (menuKeluarVisible) {
        renderSheetTable(renderData, showAll);
    }
}

// Hook filter inputs to re-apply filters (start/end only)
['filter-start','filter-end'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => applyFilters());
});