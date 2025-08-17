// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://web-production-176d5.up.railway.app';

/**
 * Extract lyrics for a given song name
 * @param {string} songName - The name of the song to search for
 * @returns {Promise<Object>} - Promise that resolves to lyrics data
 */
export const extractLyrics = async (songName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lyrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        song_name: songName
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to extract lyrics');
    }

    return data.data;
  } catch (error) {
    console.error('Lyrics extraction error:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    }
    
    // Handle other errors
    throw new Error(error.message || 'An unexpected error occurred while extracting lyrics');
  }
};

/**
 * Check the health status of the API
 * @returns {Promise<Object>} - Promise that resolves to health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API health check error:', error);
    throw new Error('Unable to connect to the API server');
  }
};

/**
 * Get API information
 * @returns {Promise<Object>} - Promise that resolves to API information
 */
export const getApiInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API info error:', error);
    throw new Error('Unable to get API information');
  }
};
