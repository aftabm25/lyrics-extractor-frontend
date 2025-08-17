# Spotify Integration for Lyrics Extractor

## Overview
This frontend now includes a complete Spotify integration that allows users to:
1. Connect their Spotify account
2. See their currently playing track in real-time
3. Automatically fetch lyrics for the currently playing song
4. View track information including album art, artist, and album name

## Features

### 🎵 Spotify Connect Button
- **Location**: Top of the main lyrics extractor interface
- **Function**: Authenticates user with Spotify and displays current track info
- **Scopes**: Only requests minimal permissions (currently playing, playback state, recently played)

### 📱 Current Track Display
- **Album Art**: Shows the current track's album artwork
- **Track Info**: Displays song name, artist, and album
- **Playback Status**: Shows if music is currently playing or paused
- **Real-time Updates**: Can manually refresh to get latest track info

### 🔗 Action Buttons
- **Get Lyrics**: Automatically searches for lyrics using the current track name and artist
- **Open in Spotify**: Opens the current track directly in Spotify
- **Refresh Track**: Manually updates the current track information

## How It Works

### 1. Authentication Flow
1. User clicks "Connect Spotify" button
2. Redirected to Spotify authorization page
3. User grants permissions
4. Spotify redirects back with authorization code
5. Frontend exchanges code for access token via backend
6. Token stored securely in localStorage

### 2. Track Fetching
1. Frontend uses Spotify Web API to get currently playing track
2. Calls `/me/player/currently-playing` endpoint
3. Displays track information in a beautiful card format
4. Handles cases where no music is playing

### 3. Lyrics Integration
1. When "Get Lyrics" is clicked, combines track name + artist
2. Sends search query to your Railway backend
3. Backend processes the request using the working lyrics extractor
4. Returns lyrics data to frontend
5. Displays lyrics in the main lyrics display component

## Technical Implementation

### Frontend Components
- `SpotifyConnect.js` - Main Spotify integration component
- `spotifyService.js` - Spotify API service functions
- `LyricsExtractor.js` - Updated to include Spotify integration

### Backend Endpoints
- `POST /api/spotify/token` - Exchanges Spotify auth code for access token
- `POST /api/lyrics` - Existing lyrics extraction endpoint

### Spotify API Endpoints Used
- `GET /me/player/currently-playing` - Get currently playing track
- `GET /me/player/recently-played` - Get recently played tracks (future use)

## Configuration

### Spotify App Settings
- **Client ID**: `957aa328bc7b4e06a53da49f15834b63`
- **Client Secret**: `200c8c94bbbd408c92c419e131e7e844`
- **Redirect URI**: `http://localhost:3000/`
- **App Name**: `MeaningLyricsProd`

### Required Scopes
- `user-read-currently-playing` - Read currently playing track
- `user-read-playback-state` - Read playback state
- `user-read-recently-played` - Read recently played tracks

## Security Features

### Token Management
- Access tokens stored in localStorage with expiration tracking
- Automatic token validation before API calls
- Secure token exchange handled by backend
- No client secrets exposed in frontend

### Error Handling
- Graceful handling of expired tokens
- Network error handling
- User-friendly error messages
- Automatic disconnection on authentication failures

## Usage Instructions

### For Users
1. **Connect**: Click "Connect Spotify" button
2. **Authorize**: Grant permissions on Spotify's authorization page
3. **View Track**: See your currently playing music
4. **Get Lyrics**: Click "Get Lyrics" to automatically find lyrics
5. **Refresh**: Use "Refresh Track" to update track info
6. **Disconnect**: Click "Disconnect" to remove Spotify access

### For Developers
1. **Frontend**: All Spotify logic is in `src/components/SpotifyConnect.js`
2. **Services**: API calls handled by `src/services/spotifyService.js`
3. **Backend**: Token exchange endpoint in `backend/api.py`
4. **Testing**: Test with real Spotify account and playing music

## Future Enhancements

### Planned Features
- **Auto-refresh**: Periodic automatic track updates
- **Recently Played**: Display list of recently played tracks
- **Playlist Integration**: Get lyrics for entire playlists
- **Offline Support**: Cache track information locally
- **Multiple Accounts**: Support for multiple Spotify accounts

### Technical Improvements
- **Token Refresh**: Implement refresh token logic
- **WebSocket**: Real-time track updates
- **Caching**: Better local storage management
- **Analytics**: Track usage patterns

## Troubleshooting

### Common Issues
1. **"Failed to connect to Spotify"**
   - Check if Spotify app is running
   - Verify internet connection
   - Check browser console for errors

2. **"No track currently playing"**
   - Start playing music on Spotify
   - Use "Refresh Track" button
   - Check if Spotify is active on any device

3. **"Token expired"**
   - Click "Connect Spotify" again
   - Re-authorize with Spotify
   - Check backend logs for token exchange errors

### Debug Information
- Check browser console for detailed error logs
- Verify backend endpoint is accessible
- Confirm Spotify app credentials are correct
- Test with different browsers/devices

## Support

For technical issues or questions about the Spotify integration:
1. Check browser console for error messages
2. Verify Spotify app configuration
3. Test backend endpoints independently
4. Review this documentation for common solutions
