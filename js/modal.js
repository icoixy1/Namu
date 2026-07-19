// Membuka modal
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// Menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Mencegah modal tertutup saat area form di dalam diklik
document.querySelectorAll('#modalBahan > div, #modalCost > div').forEach(modalContent => {
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Event handling submit form (Placeholder untuk logic backend/state Anda nantinya)
document.getElementById('form-cost').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Data Cost Berhasil Dicatat!');
    closeModal('modalCost');
});