// Constants
const COOKIE_NAME = 'twitch_favorites';
const TOKEN_COOKIE_NAME = 'twitch_token';
const CREDENTIALS_COOKIE_NAME = 'twitch_credentials';
let favorites = [];
let streamersInfo = new Map();

// Load favorites from cookies on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    checkCredentials();
});

// Update timestamp display
function updateLastUpdateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    document.getElementById('lastUpdate').textContent = `Last updated: ${timeStr}`;
}

// Settings management
function checkCredentials() {
    const credentials = getCredentials();
    if (!credentials) {
        openSettings();
        return;
    }

    initializeTwitchAuth().then(() => {
        updateStreamers();
        // Update statuses every 2 minutes
        setInterval(() => {
            updateStreamers();
            updateLastUpdateTime();
        }, 120000);
        updateLastUpdateTime();
    });
}

function getCredentials() {
    const credentialsCookie = getCookie(CREDENTIALS_COOKIE_NAME);
    if (!credentialsCookie) return null;
    try {
        return JSON.parse(atob(credentialsCookie));
    } catch (e) {
        return null;
    }
}

function openSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.add('show');
    
    // Load existing credentials if any
    const credentials = getCredentials();
    if (credentials) {
        document.getElementById('clientId').value = credentials.clientId;
        document.getElementById('clientSecret').value = credentials.clientSecret;
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.remove('show');
}

function saveSettings() {
    const clientId = document.getElementById('clientId').value.trim();
    const clientSecret = document.getElementById('clientSecret').value.trim();
    
    if (!clientId || !clientSecret) {
        alert('Please enter both Client ID and Client Secret');
        return;
    }
    
    // Store credentials in base64 encoded format
    const credentials = btoa(JSON.stringify({ clientId, clientSecret }));
    setCookie(CREDENTIALS_COOKIE_NAME, credentials, 365);
    
    // Clear existing token to force new authentication
    setCookie(TOKEN_COOKIE_NAME, '', -1);
    
    closeSettings();
    checkCredentials();
}

// Cookie management
function loadFavorites() {
    const cookie = getCookie(COOKIE_NAME);
    favorites = cookie ? JSON.parse(cookie) : [];
    // Load cached streamer info
    const cachedInfo = getCookie('streamer_info');
    if (cachedInfo) {
        streamersInfo = new Map(JSON.parse(cachedInfo));
    }
    renderStreamers();
}

function saveFavorites() {
    setCookie(COOKIE_NAME, JSON.stringify(favorites), 365);
    // Save streamer info to cookies
    setCookie('streamer_info', JSON.stringify([...streamersInfo]), 365);
    renderStreamers();
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Streamer management
function addStreamer() {
    const input = document.getElementById('streamerInput');
    const streamer = input.value.trim().toLowerCase();
    
    if (streamer && !favorites.includes(streamer)) {
        favorites.push(streamer);
        saveFavorites();
        input.value = '';
        updateStreamers();
    }
}

function removeStreamer(streamer) {
    favorites = favorites.filter(s => s !== streamer);
    saveFavorites();
    updateStreamers();
}

// Twitch authentication
async function initializeTwitchAuth() {
    const token = getCookie(TOKEN_COOKIE_NAME);
    if (!token) {
        await getTwitchToken();
    }
}

async function getTwitchToken() {
    const credentials = getCredentials();
    if (!credentials) {
        throw new Error('No API credentials found');
    }

    try {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `client_id=${credentials.clientId}&client_secret=${credentials.clientSecret}&grant_type=client_credentials`
        });

        if (!response.ok) {
            throw new Error('Failed to get Twitch token');
        }
        
        const data = await response.json();
        setCookie(TOKEN_COOKIE_NAME, data.access_token, 1); // Store token for 1 day
        return data.access_token;
    } catch (error) {
        console.error('Error getting Twitch token:', error);
        openSettings(); // Open settings if authentication fails
        return null;
    }
}

// Update the updateStreamers function
async function updateStreamers() {
    if (!favorites.length) {
        updateLastUpdateTime();
        return;
    }
    
    try {
        const credentials = getCredentials();
        if (!credentials) {
            throw new Error('No API credentials found');
        }

        let token = getCookie(TOKEN_COOKIE_NAME);
        if (!token) {
            token = await getTwitchToken();
            if (!token) throw new Error('Failed to get authentication token');
        }

        // Only fetch user data for streamers we don't have info for
        const streamersToFetch = favorites.filter(f => !streamersInfo.has(f));
        if (streamersToFetch.length > 0) {
            const usersResponse = await fetch(`https://api.twitch.tv/helix/users?login=${streamersToFetch.join('&login=')}`, {
                headers: {
                    'Client-ID': credentials.clientId,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!usersResponse.ok) {
                if (usersResponse.status === 401) {
                    token = await getTwitchToken();
                    if (!token) throw new Error('Failed to refresh token');
                } else {
                    throw new Error('Failed to fetch user data');
                }
            }

            const userData = await usersResponse.json();
            userData.data.forEach(user => {
                streamersInfo.set(user.login, {
                    profileImage: user.profile_image_url,
                    displayName: user.display_name
                });
            });
            saveFavorites();
        }

        // Fetch stream data
        const streamsResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${favorites.join('&user_login=')}`, {
            headers: {
                'Client-ID': credentials.clientId,
                'Authorization': `Bearer ${token}`
            }
        });

        if (!streamsResponse.ok) {
            if (streamsResponse.status === 401) {
                token = await getTwitchToken();
                if (!token) throw new Error('Failed to refresh token');
            } else {
                throw new Error('Failed to fetch stream data');
            }
        }

        const streamData = await streamsResponse.json();
        updateLastUpdateTime();
        return handleStreamResponse(streamData);
        
    } catch (error) {
        console.error('Error updating streamers:', error);
        if (error.message.includes('API credentials')) {
            openSettings();
        }
    }
}

// Update the render function for table layout
function renderStreamers() {
    const streamersList = document.getElementById('streamers-list');
    const emptyState = document.getElementById('empty-state');
    const table = document.getElementById('streamers-table');

    // If no favorites, show empty state
    if (favorites.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';
    streamersList.innerHTML = '';
}

// Update the helper function to handle stream response with table rows
function handleStreamResponse(data) {
    const onlineStreamers = new Map(data.data.map(stream => [
        stream.user_login,
        {
            title: stream.title,
            game: stream.game_name,
            viewers: stream.viewer_count
        }
    ]));
    
    const streamersList = document.getElementById('streamers-list');
    streamersList.innerHTML = '';
    
    // Sort favorites: online first, then offline
    const sortedFavorites = favorites.sort((a, b) => {
        const aOnline = onlineStreamers.has(a);
        const bOnline = onlineStreamers.has(b);
        
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        return 0;
    });
    
    sortedFavorites.forEach(streamer => {
        const isOnline = onlineStreamers.has(streamer);
        const streamerInfo = streamersInfo.get(streamer) || {};
        const streamInfo = onlineStreamers.get(streamer) || {};
        
        const row = document.createElement('tr');
        const displayName = streamerInfo.displayName || streamer;
        
        const channelCell = document.createElement('td');
        if (isOnline) {
            channelCell.innerHTML = `<a href="https://twitch.tv/${streamer}" target="_blank">${displayName}</a>`;
        } else {
            channelCell.textContent = displayName;
        }
        
        const statusCell = document.createElement('td');
        statusCell.textContent = isOnline ? 'Live' : 'Offline';
        statusCell.className = isOnline ? 'status-online' : 'status-offline';
        
        const gameCell = document.createElement('td');
        gameCell.textContent = isOnline ? (streamInfo.game || '-') : '-';
        
        const viewersCell = document.createElement('td');
        viewersCell.textContent = isOnline ? streamInfo.viewers?.toLocaleString() || '0' : '-';
        
        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `<span class="remove-link" onclick="removeStreamer('${streamer}')">remove</span>`;
        
        row.appendChild(channelCell);
        row.appendChild(statusCell);
        row.appendChild(gameCell);
        row.appendChild(viewersCell);
        row.appendChild(actionsCell);
        
        streamersList.appendChild(row);
    });
}

// Share functionality
function generateShareCode() {
    const credentials = getCredentials();
    if (!credentials) {
        alert('Please save your API credentials first');
        return;
    }

    const settings = {
        credentials: credentials,
        favorites: favorites,
        streamersInfo: [...streamersInfo]
    };

    const shareCode = btoa(JSON.stringify(settings));
    document.getElementById('shareCode').value = shareCode;
}

function copyShareCode() {
    const shareInput = document.getElementById('shareCode');
    if (!shareInput.value) {
        alert('Generate a share code first');
        return;
    }

    shareInput.select();
    document.execCommand('copy');
    alert('Share code copied to clipboard!');
}

function importSettings() {
    const importCode = document.getElementById('importCode').value.trim();
    if (!importCode) {
        alert('Please enter a share code');
        return;
    }

    try {
        const settings = JSON.parse(atob(importCode));
        
        // Validate the imported data
        if (!settings.credentials || !settings.favorites || !settings.streamersInfo) {
            throw new Error('Invalid share code format');
        }

        // Store the credentials
        setCookie(CREDENTIALS_COOKIE_NAME, btoa(JSON.stringify(settings.credentials)), 365);
        
        // Update favorites and streamer info
        favorites = settings.favorites;
        streamersInfo = new Map(settings.streamersInfo);
        
        // Save to cookies
        saveFavorites();
        
        // Clear existing token to force new authentication
        setCookie(TOKEN_COOKIE_NAME, '', -1);
        
        alert('Settings imported successfully!');
        closeSettings();
        checkCredentials();
        
    } catch (error) {
        console.error('Import error:', error);
        alert('Invalid share code. Please check and try again.');
    }
}

// Tab functionality
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName)) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
} 