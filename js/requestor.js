// Global State Simulation
const app = {
    data: {
        departments: {
            "IT Services": ["High-Cap Battery", "Server Blades v2", "Laptop Bundles"],
            "Logistics Ops": ["Field Tablets", "Safety Gear Kit"],
            "HR Dept": ["Projector", "Printer"]
        },
        requests: [
            { id: "#REQ-88219", dept: "Logistics Ops", type: "High-Cap Battery", qty: 12, date: "Oct 24, 2023", status: "Allocated" },
            { id: "#REQ-88220", dept: "IT Services", type: "Server Blades v2", qty: 4, date: "Oct 25, 2023", status: "Pending" },
            { id: "#REQ-88215", dept: "HR Dept", type: "Laptop Bundles", qty: 15, date: "Oct 22, 2023", status: "Approved" },
            { id: "#REQ-88210", dept: "Logistics Ops", type: "Field Tablets", qty: 8, date: "Oct 19, 2023", status: "Rejected" }
        ],
        resources: [
            { code: "RES-1049", type: "Laptop - Dell XPS", dept: "IT Services", date: "Jan 12, 2023", status: "Allocated" },
            { code: "RES-2933", type: "Projector X1", dept: "HR Dept", date: "Feb 05, 2023", status: "Maintenance Requested" }
        ]
    },

    init: function() {
        this.bindNav();
        this.renderRequests();
        this.renderResources();
    },

    bindNav: function() {
        const items = document.querySelectorAll('.nav-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                if (targetId) {
                    this.switchView(targetId);
                    
                    // Update active class
                    items.forEach(i => i.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                }
            });
        });
    },

    switchView: function(viewId) {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const targetSection = document.getElementById(viewId);
        if(targetSection) {
            targetSection.classList.add('active');
        }
    },

    // --- Request Form Logic ---
    updateResourceDropdown: function() {
        const dept = document.getElementById('req-dept').value;
        const typeSelect = document.getElementById('req-type');
        typeSelect.innerHTML = '<option value="" disabled selected>Select Resource Type</option>';
        
        if (this.data.departments[dept]) {
            this.data.departments[dept].forEach(res => {
                const opt = document.createElement('option');
                opt.value = res;
                opt.textContent = res;
                typeSelect.appendChild(opt);
            });
        }
    },

    toggleNewResourceForm: function(e) {
        e.preventDefault();
        const newFields = document.getElementById('new-resource-fields');
        newFields.style.display = newFields.style.display === 'none' ? 'block' : 'none';
        if (newFields.style.display === 'block') {
            document.getElementById('req-type').required = false;
        } else {
            document.getElementById('req-type').required = true;
        }
    },

    submitRequest: function(e) {
        e.preventDefault();
        const dept = document.getElementById('req-dept').value;
        let type = document.getElementById('req-type').value;
        
        if (document.getElementById('new-resource-fields').style.display === 'block') {
            type = document.getElementById('req-new-name').value;
        }

        const qty = document.getElementById('req-qty').value;
        const reason = document.getElementById('req-reason').value;

        // Add to requests
        const newId = `#REQ-88${Math.floor(100 + Math.random() * 900)}`;
        const dateStr = new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year:'numeric'});

        this.data.requests.unshift({
            id: newId,
            dept: dept,
            type: type,
            qty: qty,
            date: dateStr,
            status: "Pending"
        });

        alert("Request Submitted Successfully! ID: " + newId);
        document.getElementById('requestForm').reset();
        this.renderRequests();
        this.switchView('my-requests-view');
        
        // Sync nav highlighting
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector('.nav-item[data-target="my-requests-view"]').classList.add('active');
    },

    // --- My Requests Render ---
    renderRequests: function() {
        const tbody = document.getElementById('requests-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';

        let pending = 0, approved = 0, allocated = 0;

        this.data.requests.forEach(req => {
            if(req.status === 'Pending') pending++;
            if(req.status === 'Approved') approved++;
            if(req.status === 'Allocated') allocated++;

            let statusBadge = `<span class="badge ${req.status.toLowerCase()}">${req.status}</span>`;
            let actions = `<button class="icon-btn">⋮</button>`;
            
            if(req.status === "Allocated") {
                actions = `<button class="btn-primary" style="font-size:0.75rem; padding: 0.4rem 0.8rem;" onclick="app.confirmReceipt('${req.id}')">I RECEIVED</button>`;
            } else if (req.status === "Rejected") {
                actions = `<span title="View Reason">ℹ️</span>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${req.id}</td>
                <td>${req.dept}</td>
                <td>${req.type}</td>
                <td>${String(req.qty).padStart(2, '0')}</td>
                <td>${req.date}</td>
                <td>${statusBadge}</td>
                <td style="text-align:right">${actions}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('stat-pending').textContent = pending.toString().padStart(2, '0');
        document.getElementById('stat-approved').textContent = approved.toString().padStart(2, '0');
        document.getElementById('stat-allocated').textContent = allocated.toString().padStart(2, '0');
    },

    confirmReceipt: function(reqId) {
        // Find request
        const reqIdx = this.data.requests.findIndex(r => r.id === reqId);
        if(reqIdx > -1) {
            const req = this.data.requests[reqIdx];
            // Move to history conceptually, add to resources
            this.data.resources.push({
                code: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
                type: req.type,
                dept: req.dept,
                date: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year:'numeric'}),
                status: "Allocated"
            });
            // Remove request
            this.data.requests.splice(reqIdx, 1);
            
            alert('Item successfully received and added to your resources.');
            this.renderRequests();
            this.renderResources();
            
            this.switchView('my-resources-view');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            document.querySelector('.nav-item[data-target="my-resources-view"]').classList.add('active');
        }
    },

    // --- My Resources Render ---
    renderResources: function() {
        const tbody = document.getElementById('resources-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';

        this.data.resources.forEach((res, index) => {
            let statusBadge = "";
            let actions = "";
            
            if(res.status === 'Allocated') {
                statusBadge = `<span class="badge allocated">${res.status}</span>`;
                actions = `
                    <button class="btn-secondary" style="font-size:0.75rem" onclick="app.requestMaintenance(${index})">🛠️ Maintenance</button>
                    <button class="btn-danger" style="font-size:0.75rem; margin-left:0.5rem" onclick="app.returnResource(${index})">⮌ Return</button>
                `;
            } else if (res.status === 'Maintenance Requested' || res.status === 'Under Maintenance') {
                statusBadge = `<span class="badge maintenance">${res.status}</span>`;
                actions = `<span class="text-muted" style="font-size:0.75rem">Under Review</span>`;
            } else if (res.status === 'Repaired') {
                statusBadge = `<span class="badge allocated" style="background:#dcfce7; color:#166534">Repaired</span>`;
                actions = `<button class="btn-primary" style="font-size:0.75rem" onclick="app.confirmRepairedAllocation(${index})">Confirm Allocation</button>`;
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${res.code}</td>
                <td>${res.type}</td>
                <td>${res.dept}</td>
                <td>${res.date}</td>
                <td>${statusBadge}</td>
                <td style="text-align:right">${actions}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    requestMaintenance: function(idx) {
        if(confirm("Submit maintenance request for this resource?")) {
            this.data.resources[idx].status = "Maintenance Requested";
            this.renderResources();
        }
    },

    returnResource: function(idx) {
        if(confirm("Are you sure you want to return this resource? It will be sent to Staff for Verification.")) {
            // Remove from active resources conceptually
            this.data.resources.splice(idx, 1);
            alert("Resource returned successfully. Status moved to Returned.");
            this.renderResources();
        }
    },
    
    confirmRepairedAllocation: function(idx) {
        this.data.resources[idx].status = "Allocated";
        this.renderResources();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
