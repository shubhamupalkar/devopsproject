// Simple client logic to show website and database connectivity

const backendDot = document.getElementById('backendDot');
const backendStatus = document.getElementById('backendStatus');
const dbDot = document.getElementById('dbDot');
const dbStatus = document.getElementById('dbStatus');
const dbLatency = document.getElementById('dbLatency');
const dbTime = document.getElementById('dbTime');
const testBtn = document.getElementById('testBtn');

const itemsList = document.getElementById('itemsList');
const addForm = document.getElementById('addForm');
const itemInput = document.getElementById('itemInput');

// Check connectivity with backend and PostgreSQL
async function checkHealth() {
    backendDot.className = 'dot yellow';
    dbDot.className = 'dot yellow';
    backendStatus.textContent = 'Checking...';
    dbStatus.textContent = 'Checking...';

    try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();

        // Backend is up
        backendDot.className = 'dot green';
        backendStatus.textContent = 'Connected';

        // Check DB
        if (data.database && data.database.status === 'Connected') {
            dbDot.className = 'dot green';
            dbStatus.textContent = 'Connected';
            dbLatency.textContent = data.database.latency || '<1ms';
            dbTime.textContent = new Date(data.database.dbTime).toLocaleTimeString();
        } else {
            dbDot.className = 'dot red';
            dbStatus.textContent = 'Disconnected';
            dbLatency.textContent = 'Error';
            dbTime.textContent = 'Unavailable';
        }
    } catch (err) {
        backendDot.className = 'dot red';
        backendStatus.textContent = 'Failed';
        dbDot.className = 'dot red';
        dbStatus.textContent = 'Failed';
        dbLatency.textContent = 'N/A';
        dbTime.textContent = 'N/A';
    }
}

// Fetch items from database
async function loadItems() {
    try {
        const res = await fetch('/api/items');
        const json = await res.json();

        if (!json.success || !json.data || json.data.length === 0) {
            itemsList.innerHTML = '<li>No items in database yet. Add one below!</li>';
            return;
        }

        itemsList.innerHTML = json.data.map(item => `
            <li>
                <span>${escapeHtml(item.title)}</span>
                <button class="delete-btn" onclick="removeItem(${item.id})">Delete</button>
            </li>
        `).join('');
    } catch (err) {
        itemsList.innerHTML = '<li>Could not load database items.</li>';
    }
}

// Add item to database
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = itemInput.value.trim();
    if (!title) return;

    try {
        const res = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (res.ok) {
            itemInput.value = '';
            await loadItems();
        }
    } catch (err) {
        alert('Failed to insert into database');
    }
});

// Remove item from database
window.removeItem = async function(id) {
    try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await loadItems();
        }
    } catch (err) {
        alert('Failed to delete item');
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

testBtn.addEventListener('click', async () => {
    await checkHealth();
    await loadItems();
});

// Initial load
checkHealth();
loadItems();
