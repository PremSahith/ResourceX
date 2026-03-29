const deptApp = {
    data: {
        incoming: [
            { id: "REQ-8821", name: "Yaswanth K.", type: "Server Blades v2", qty: 4, reason: "New project environment setup" },
            { id: "REQ-8834", name: "Alice M.", type: "MacBook Pro M3", qty: 1, reason: "Hardware refresh" },
            { id: "REQ-8840", name: "Bob T.", type: "Wireless Mouse", qty: 2, reason: "Broken old items" },
        ],
        inventory: [
            { type: "Server Blades v2", total: 20, allocated: 15, maint: 2, threshold: 5 },
            { type: "MacBook Pro M3", total: 100, allocated: 95, maint: 3, threshold: 10 },
            { type: "Wireless Mouse", total: 50, allocated: 40, maint: 1, threshold: 5 }
        ],
        procurements: [
            { id: "PROC-001", type: "MacBook Pro M3", qty: 20, status: "Accepted" },
            { id: "PROC-002", type: "Server Blades v2", qty: 10, status: "Pending" }
        ]
    },

    init: function() {
        this.bindNav();
        this.renderIncoming();
        this.renderInventory();
        this.renderProcurement();
    },

    bindNav: function() {
        const items = document.querySelectorAll('.nav-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                if (targetId) {
                    this.switchView(targetId);
                    items.forEach(i => i.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                }
            });
        });
    },

    switchView: function(viewId) {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(viewId);
        if(targetSection) targetSection.classList.add('active');
    },

    renderIncoming: function() {
        const tbody = document.getElementById('incoming-requests-tbody');
        tbody.innerHTML = '';
        if(this.data.incoming.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#64748b; padding:2rem">No pending requests</td></tr>';
            return;
        }

        this.data.incoming.forEach((req, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${req.id}</td>
                <td>${req.name}</td>
                <td>${req.type}</td>
                <td>${req.qty}</td>
                <td style="color:#64748b; font-size:0.75rem">${req.reason}</td>
                <td style="text-align:right">
                    <button class="btn-primary" style="font-size:0.75rem; background:#16a34a" onclick="deptApp.handleAction(${idx}, 'Accept')">✓ Accept</button>
                    <button class="btn-danger" style="font-size:0.75rem; margin-left:0.5rem" onclick="deptApp.handleAction(${idx}, 'Reject')">✗ Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    handleAction: function(idx, action) {
        if(confirm(`Are you sure you want to ${action} this request?`)) {
            // Forward to staff or reject
            this.data.incoming.splice(idx, 1);
            this.renderIncoming();
        }
    },

    renderInventory: function() {
        const tbody = document.getElementById('dept-resources-tbody');
        tbody.innerHTML = '';
        
        this.data.inventory.forEach(item => {
            const available = item.total - item.allocated - item.maint;
            const isLow = available < item.threshold;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600">${item.type}</td>
                <td>${item.total}</td>
                <td>${item.allocated}</td>
                <td>${item.maint}</td>
                <td style="font-weight:bold; color:${isLow ? '#b91c1c' : '#16a34a'}">${available}</td>
                <td>${item.threshold} <span style="font-size:0.6rem; cursor:pointer">✏️</span></td>
                <td style="text-align:right">
                    ${isLow ? '<span class="badge rejected">Low Stock</span>' : '<span class="badge allocated">Healthy</span>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderProcurement: function() {
        const tbody = document.getElementById('procurement-tbody');
        tbody.innerHTML = '';
        this.data.procurements.forEach(proc => {
            let color = proc.status === 'Accepted' ? 'var(--status-allocated-text)' : 'var(--status-pending-text)';
            let bg = proc.status === 'Accepted' ? 'var(--status-allocated)' : 'var(--status-pending)';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${proc.id}</td>
                <td>${proc.type}</td>
                <td>${proc.qty}</td>
                <td><span class="badge" style="background:${bg}; color:${color}">${proc.status}</span></td>
            `;
            tbody.appendChild(tr);
        });
    },

    submitProcurement: function(e) {
        e.preventDefault();
        const type = document.getElementById('proc-type').value;
        const qty = document.getElementById('proc-qty').value;
        const id = `PROC-${Math.floor(100 + Math.random() * 900)}`;

        this.data.procurements.unshift({ id, type, qty, status: 'Pending' });
        alert('Procurement request sent to Registrar.');
        e.target.reset();
        this.renderProcurement();
    }
};

document.addEventListener('DOMContentLoaded', () => deptApp.init());
