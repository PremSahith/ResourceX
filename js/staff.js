const staffApp = {
    data: {
        allocations: [
            { reqId: "REQ-88215", dept: "HR Dept", type: "Laptop Bundles", qty: 15 },
            { reqId: "REQ-88219", dept: "Logistics", type: "High-Cap Battery", qty: 2 }
        ],
        inventory: [
            { code: "RES-1011", type: "Laptop - Dell", status: "Available", loc: "HQ-Store-A" },
            { code: "RES-2092", type: "Projector X1", status: "Available", loc: "HQ-Store-B" },
            { code: "RES-2234", type: "Wireless Mouse", status: "Allocated", loc: "User: Bob" },
            { code: "RES-1049", type: "Laptop - Dell XPS", status: "Under Maintenance", loc: "Repair Shop" }
        ],
        maintenance: [
            { code: "RES-1049", type: "Laptop - Dell XPS", status: "Under Maintenance" },
            { code: "RES-2933", type: "Projector X1", status: "Maintenance Requested" }
        ],
        returns: [
            { code: "RES-8712", type: "Safety Gear Kit", user: "John D." }
        ]
    },

    init: function() {
        this.bindNav();
        this.renderAllocations();
        this.renderInventory();
        this.renderMaintReturns();
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

    renderAllocations: function() {
        const tbody = document.getElementById('allocation-tbody');
        tbody.innerHTML = '';
        this.data.allocations.forEach((alloc, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${alloc.reqId}</td>
                <td>${alloc.dept}</td>
                <td>${alloc.type}</td>
                <td>${alloc.qty}</td>
                <td>
                    <select class="form-control" style="font-size:0.75rem" multiple size="2">
                        <option>RES-${Math.floor(1000 + Math.random()*9000)} (Available)</option>
                        <option>RES-${Math.floor(1000 + Math.random()*9000)} (Available)</option>
                    </select>
                </td>
                <td style="text-align:right">
                    <button class="btn-primary" style="font-size:0.75rem" onclick="staffApp.allocateAsset(${idx})">Allocate</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    allocateAsset: function(idx) {
        alert("Assets allocated successfully. Request status updated.");
        this.data.allocations.splice(idx, 1);
        this.renderAllocations();
    },

    addRegistrationRow: function() {
        const tbody = document.getElementById('registration-tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="form-control" value="RES-Auto${Math.floor(Math.random()*100)}" readonly></td>
            <td><input type="text" class="form-control" placeholder="Type/Model"></td>
            <td><input type="text" class="form-control" placeholder="Manufacturer"></td>
            <td><input type="text" class="form-control" placeholder="Current Location"></td>
            <td><input type="text" class="form-control" placeholder="Serial No"></td>
        `;
        tbody.appendChild(tr);
    },

    submitRegistration: function() {
        alert("Resources cleanly registered into Active Inventory.");
        document.getElementById('registration-tbody').innerHTML = `
            <tr>
                <td><input type="text" class="form-control" value="RES-Auto1" readonly></td>
                <td><input type="text" class="form-control" placeholder="e.g. MacBook Pro"></td>
                <td><input type="text" class="form-control" placeholder="Apple"></td>
                <td><input type="text" class="form-control" placeholder="HQ-Floor 2"></td>
                <td><input type="text" class="form-control" placeholder="Serial No"></td>
            </tr>
        `;
        this.switchView('manage-view');
        this.renderInventory();
        document.querySelector('.nav-item[data-target="manage-view"]').click();
    },

    renderInventory: function() {
        const tbody = document.getElementById('inventory-tbody');
        tbody.innerHTML = '';
        this.data.inventory.forEach(item => {
            let bclass = item.status === 'Available' ? 'approved' : (item.status === 'Allocated' ? 'allocated' : 'maintenance');
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="td-id">${item.code}</td>
                <td style="font-weight:600">${item.type}</td>
                <td><span class="badge ${bclass}">${item.status}</span></td>
                <td>${item.loc}</td>
                <td style="text-align:right"><button class="btn-secondary" style="font-size:0.75rem">Edit</button></td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderMaintReturns: function() {
        const mTbody = document.getElementById('maint-tbody');
        mTbody.innerHTML = '';
        this.data.maintenance.forEach((m, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem 0">
                    <div style="font-weight:600; color:var(--primary-color)">${m.code}</div>
                    <div style="font-size:0.75rem">${m.type}</div>
                    <div style="font-size:0.75rem; color:#d97706; margin-top:0.25rem">Status: ${m.status}</div>
                    <div style="margin-top:0.5rem">
                        ${m.status === 'Maintenance Requested' 
                            ? `<button class="btn-secondary" style="font-size:0.7rem" onclick="staffApp.maintAction(${idx}, 'Accept')">Accept ticket</button>`
                            : `<button class="btn-primary" style="font-size:0.7rem; background:#16a34a" onclick="staffApp.maintAction(${idx}, 'Repaired')">Mark Repaired</button>
                               <button class="btn-danger" style="font-size:0.7rem" onclick="staffApp.maintAction(${idx}, 'Scrap')">Mark Scrap</button>`
                        }
                    </div>
                </td>
            `;
            mTbody.appendChild(tr);
        });

        const rTbody = document.getElementById('return-tbody');
        rTbody.innerHTML = '';
        this.data.returns.forEach((r, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem 0">
                    <div style="font-weight:600; color:var(--primary-color)">${r.code}</div>
                    <div style="font-size:0.75rem">From: ${r.user}</div>
                    <div style="margin-top:0.5rem; display:flex; gap:0.5rem">
                        <select class="form-control" style="font-size:0.7rem; padding:0.25rem" id="cond-${idx}">
                            <option>Condition: Good</option>
                            <option>Condition: Average</option>
                            <option>Condition: Bad (Scrap)</option>
                        </select>
                        <button class="btn-primary" style="font-size:0.7rem" onclick="staffApp.returnAction(${idx})">Process</button>
                    </div>
                </td>
            `;
            rTbody.appendChild(tr);
        });
    },

    maintAction: function(idx, act) {
        if(act === 'Accept') {
            this.data.maintenance[idx].status = 'Under Maintenance';
        } else {
            alert(`Asset marked as ${act}. History updated.`);
            this.data.maintenance.splice(idx, 1);
        }
        this.renderMaintReturns();
    },

    returnAction: function(idx) {
        alert("Return processed and conditions logged.");
        this.data.returns.splice(idx, 1);
        this.renderMaintReturns();
    }
};

document.addEventListener('DOMContentLoaded', () => staffApp.init());
