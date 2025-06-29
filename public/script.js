let jwtToken = null;
        const API_BASE = 'http://localhost:3000';

        // Login function
        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok && data.jwtToken) {
                    jwtToken = data.jwtToken;
                    document.getElementById('loginSection').classList.add('hidden');
                    document.getElementById('mainContent').classList.remove('hidden');
                    alert('Login successful!');
                } else {
                    alert('Login failed: ' + (data.message || 'Invalid credentials'));
                }
            } catch (error) {
                alert('Login error: ' + error.message);
            }
        }

        // Logout function
        function logout() {
            jwtToken = null;
            document.getElementById('loginSection').classList.remove('hidden');
            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            clearResults();
        }

        // Helper function to make authenticated requests
        async function makeAuthenticatedRequest(url, options = {}) {
            if (!jwtToken) {
                alert('Please login first');
                return null;
            }

            const headers = {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                ...options.headers
            };

            try {
                const response = await fetch(url, { ...options, headers });
                
                if (response.status === 401) {
                    alert('Session expired. Please login again.');
                    logout();
                    return null;
                }

                return response;
            } catch (error) {
                alert('Request error: ' + error.message);
                return null;
            }
        }

        // Fetch all states
        async function fetchAllStates() {
            const response = await makeAuthenticatedRequest(`${API_BASE}/states/`);
            if (!response) return;

            const data = await response.json();
            
            if (response.ok) {
                displayStatesTable(data);
            } else {
                alert('Error fetching states: ' + (data.message || 'Unknown error'));
            }
        }

        // Fetch state by ID
        async function fetchStateById() {
            const stateId = document.getElementById('stateId').value;
            if (!stateId) {
                alert('Please enter a state ID');
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/states/${stateId}/`);
            if (!response) return;

            const data = await response.json();
            
            if (response.ok) {
                displayStateDetails(data);
            } else {
                alert('Error fetching state: ' + (data.message || 'State not found'));
            }
        }

        // Fetch state stats
        async function fetchStateStats() {
            const stateId = document.getElementById('stateId').value;
            if (!stateId) {
                alert('Please enter a state ID');
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/states/${stateId}/stats/`);
            if (!response) return;

            const data = await response.json();
            
            if (response.ok) {
                displayStateStats(data);
            } else {
                alert('Error fetching state stats: ' + (data.message || 'Stats not found'));
            }
        }

        // Add new district
        async function addDistrict() {
            const districtData = {
                districtName: document.getElementById('districtName').value,
                stateId: parseInt(document.getElementById('districtStateId').value),
                cases: parseInt(document.getElementById('cases').value),
                cured: parseInt(document.getElementById('cured').value),
                active: parseInt(document.getElementById('active').value),
                deaths: parseInt(document.getElementById('deaths').value)
            };

            if (!districtData.districtName || !districtData.stateId) {
                alert('Please fill in district name and state ID');
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/districts/`, {
                method: 'POST',
                body: JSON.stringify(districtData)
            });

            if (!response) return;

            if (response.ok) {
                alert('District added successfully!');
                clearDistrictForm();
            } else {
                const data = await response.json();
                alert('Error adding district: ' + (data.message || 'Unknown error'));
            }
        }

        // Fetch district by ID
        async function fetchDistrictById() {
            const districtId = document.getElementById('manageDistrictId').value;
            if (!districtId) {
                alert('Please enter a district ID');
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/districts/${districtId}/`);
            if (!response) return;

            const data = await response.json();
            
            if (response.ok) {
                displayDistrictDetails(data);
            } else {
                alert('Error fetching district: ' + (data.message || 'District not found'));
            }
        }

        // Update district
        async function updateDistrict() {
            const districtId = document.getElementById('manageDistrictId').value;
            if (!districtId) {
                alert('Please enter a district ID first');
                return;
            }

            const districtData = {
                districtName: document.getElementById('districtName').value,
                stateId: parseInt(document.getElementById('districtStateId').value),
                cases: parseInt(document.getElementById('cases').value),
                cured: parseInt(document.getElementById('cured').value),
                active: parseInt(document.getElementById('active').value),
                deaths: parseInt(document.getElementById('deaths').value)
            };

            if (!districtData.districtName || !districtData.stateId) {
                alert('Please fill in district name and state ID');
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/districts/${districtId}/`, {
                method: 'PUT',
                body: JSON.stringify(districtData)
            });

            if (!response) return;

            if (response.ok) {
                alert('District updated successfully!');
            } else {
                const data = await response.json();
                alert('Error updating district: ' + (data.message || 'Unknown error'));
            }
        }

        // Delete district
        async function deleteDistrict() {
            const districtId = document.getElementById('manageDistrictId').value;
            if (!districtId) {
                alert('Please enter a district ID');
                return;
            }

            if (!confirm('Are you sure you want to delete this district?')) {
                return;
            }

            const response = await makeAuthenticatedRequest(`${API_BASE}/districts/${districtId}/`, {
                method: 'DELETE'
            });

            if (!response) return;

            if (response.ok) {
                alert('District deleted successfully!');
                document.getElementById('manageDistrictId').value = '';
                clearResults();
            } else {
                const data = await response.json();
                alert('Error deleting district: ' + (data.message || 'Unknown error'));
            }
        }

        // Display functions
        function displayStatesTable(states) {
            const resultDiv = document.getElementById('statesResult');
            
            if (!states || states.length === 0) {
                resultDiv.innerHTML = '<p>No states found.</p>';
                return;
            }

            let html = '<h3>All States</h3><table><thead><tr><th>ID</th><th>State Name</th></tr></thead><tbody>';
            
            states.forEach(state => {
                html += `<tr><td>${state.stateId || state.id}</td><td>${state.stateName || state.name}</td></tr>`;
            });
            
            html += '</tbody></table>';
            resultDiv.innerHTML = html;
        }

        function displayStateDetails(state) {
            const resultDiv = document.getElementById('statesResult');
            resultDiv.innerHTML = `
                <h3>State Details</h3>
                <p><strong>ID:</strong> ${state.stateId || state.id}</p>
                <p><strong>Name:</strong> ${state.stateName || state.name}</p>
                <p><strong>Population:</strong> ${state.population || 'N/A'}</p>
            `;
        }

        function displayStateStats(stats) {
            const resultDiv = document.getElementById('statesResult');
            resultDiv.innerHTML = `
                <h3>State Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${stats.totalCases || 0}</div>
                        <div class="stat-label">Total Cases</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.cured || 0}</div>
                        <div class="stat-label">Cured</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.active || 0}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${stats.deaths || 0}</div>
                        <div class="stat-label">Deaths</div>
                    </div>
                </div>
            `;
        }

        function displayDistrictDetails(district) {
            const resultDiv = document.getElementById('districtsResult');
            resultDiv.innerHTML = `
                <h3>District Details</h3>
                <p><strong>ID:</strong> ${district.districtId || district.id}</p>
                <p><strong>Name:</strong> ${district.districtName || district.name}</p>
                <p><strong>State ID:</strong> ${district.stateId}</p>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${district.cases || 0}</div>
                        <div class="stat-label">Cases</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${district.cured || 0}</div>
                        <div class="stat-label">Cured</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${district.active || 0}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${district.deaths || 0}</div>
                        <div class="stat-label">Deaths</div>
                    </div>
                </div>
            `;
        }

        // Helper functions
        function clearDistrictForm() {
            document.getElementById('districtName').value = '';
            document.getElementById('districtStateId').value = '';
            document.getElementById('cases').value = '';
            document.getElementById('cured').value = '';
            document.getElementById('active').value = '';
            document.getElementById('deaths').value = '';
        }

        function clearResults() {
            document.getElementById('statesResult').innerHTML = '';
            document.getElementById('districtsResult').innerHTML = '';
        }