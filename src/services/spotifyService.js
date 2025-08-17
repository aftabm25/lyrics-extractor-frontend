// Spotify API configuration
const SPOTIFY_CLIENT_ID = '957aa328bc7b4e06a53da49f15834b63';
const REDIRECT_URI = 'https://lyrics-extractor-frontend.vercel.app/';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Scopes needed for the application
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-read-private'
].join(' ');

/**
 * Generate Spotify authorization URL
 * @returns {string} Authorization URL
 */
export const getSpotifyAuthURL = () => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: false
  });
  
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from Spotify
 * @returns {Promise<Object>} Token response
 */
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch('https://web-production-176d5.up.railway.app/api/spotify/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, redirect_uri: REDIRECT_URI })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const responseData = await response.json();
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Token exchange failed');
    }

    return responseData.data;
  } catch (error) {
    console.error('Token exchange error:', error);
    throw new Error('Failed to authenticate with Spotify');
  }
};

/**
 * Get currently playing track from Spotify
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object|null>} Currently playing track or null
 */
export const getCurrentlyPlayingTrack = async (accessToken) => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 204) {
        // No content - user is not playing anything
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching currently playing track:', error);
    throw new Error('Failed to fetch currently playing track');
  }
};

/**
 * Get user's profile information
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object>} User profile
 */
export const getUserProfile = async (accessToken) => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

/**
 * Get user's recently played tracks
 * @param {string} accessToken - Spotify access token
 * @param {number} limit - Number of tracks to fetch (max 50)
 * @returns {Promise<Object>} Recently played tracks
 */
export const getRecentlyPlayedTracks = async (accessToken, limit = 10) => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/recently-played?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recently played tracks:', error);
    throw new Error('Failed to fetch recently played tracks');
  }
};

/**
 * Check if user has valid Spotify session
 * @returns {boolean} True if user has valid session
 */
export const hasValidSpotifySession = () => {
  const token = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_expires_at');
  
  if (!token || !expiresAt) {
    return false;
  }
  
  // Check if token is expired (with 5 minute buffer)
  const now = Date.now();
  const expiresAtTime = parseInt(expiresAt);
  
  return now < (expiresAtTime - 300000); // 5 minutes buffer
};

/**
 * Get stored Spotify access token
 * @returns {string|null} Access token or null
 */
export const getStoredAccessToken = () => {
  if (!hasValidSpotifySession()) {
    return null;
  }
  
  return localStorage.getItem('spotify_access_token');
};

/**
 * Store Spotify tokens in localStorage
 * @param {Object} tokenData - Token response from Spotify
 */
export const storeSpotifyTokens = (tokenData) => {
  const expiresAt = Date.now() + (tokenData.expires_in * 1000);
  
  localStorage.setItem('spotify_access_token', tokenData.access_token);
  localStorage.setItem('spotify_expires_at', expiresAt.toString());
  
  if (tokenData.refresh_token) {
    localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
  }
};

/**
 * Clear Spotify session data
 */
export const clearSpotifySession = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_expires_at');
  localStorage.removeItem('spotify_refresh_token');
};

/**
 * Extract track information from Spotify track object
 * @param {Object} track - Spotify track object
 * @returns {Object} Simplified track information
 */
export const extractTrackInfo = (track) => {
  if (!track || !track.item) {
    return null;
  }

  const item = track.item;
  
  return {
    id: item.id,
    name: item.name,
    artist: item.artists?.[0]?.name || 'Unknown Artist',
    album: item.album?.name || 'Unknown Album',
    duration: item.duration_ms,
    progress: track.progress_ms || 0,
    isPlaying: track.is_playing || false,
    albumArt: item.album?.images?.[0]?.url || null,
    spotifyUrl: item.external_urls?.spotify || null,
    uri: item.uri
  };
};
