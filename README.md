# ttvfav - Twitch Favorites Tracker

A lightweight, cookie-based web application to track your favorite Twitch streamers. No account needed, all data stored locally.

## Features

### Core Features
- Track live status of Twitch streamers
- View stream titles, games, and viewer counts
- Click to open live streams directly
- Auto-updates every 2 minutes
- Responsive design for all devices

### Display Features
- Live/Offline sections with collapsible offline channels
- Profile images and display names
- Stream information (title, game, viewers)
- Clean, modern interface

### Themes
- Light theme (default)
- Dark theme
- Secret OLED theme (Shift + Click theme button 🌓)

### Privacy & Data
- All data stored locally in cookies
- No backend server required
- Secure credential storage
- No tracking or analytics

### Sharing
- Export settings and favorites
- Import settings from others
- Share your setup with a single code

## Setup

1. Get Twitch API credentials:
   - Go to [Twitch Developer Console](https://dev.twitch.tv/console)
   - Register a new application
   - Set OAuth Redirect URL to `http://localhost`
   - Get the Client ID
   - Generate a Client Secret

2. Configure the app:
   - Open the app in a browser
   - Click the settings icon (⚙️)
   - Enter your Client ID and Client Secret
   - Save settings

3. Start using:
   - Add streamers using the input field
   - Live channels will appear at the top
   - Offline channels are collapsed by default

## Usage Tips

### Theme Switching
- Click 🌓 to toggle between light/dark themes
- Shift + Click 🌓 for OLED theme (pure black)

### Managing Streamers
- Type username and click "Add Streamer"
- Hover over cards to show remove button
- Click on live channels to open stream

### Sharing Setup
1. Click settings (⚙️)
2. Go to "Share Settings" tab
3. Click "Generate Code"
4. Copy and share the code
5. Others can import using the "Import Settings" option

### Keyboard Shortcuts
- `Shift + Click` on theme button: Toggle OLED theme

## Technical Details

### Storage
- Credentials: Encrypted in cookies
- Favorites: JSON in cookies
- Theme preference: Cookie based
- Profile data: Cached in cookies

### Updates
- Stream status: Every 2 minutes
- Profile images: Cached after first load
- Offline channels: Collapsed by default

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- Local storage required

## Privacy Notice

This application:
- Stores all data locally in your browser
- Only communicates with Twitch API
- Never shares data with third parties
- Requires no account or login
- Uses cookies for local storage only 