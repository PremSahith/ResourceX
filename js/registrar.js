document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-target');
        if (targetId) {
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
        }
    });
});
