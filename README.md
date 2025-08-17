# 🎵 Lyrics Extractor Frontend

A modern React PWA (Progressive Web App) for lyrics extraction with beautiful UI and seamless user experience.

## 🌟 Features

- **⚛️ Modern React**: Built with React 18 and hooks
- **📱 PWA Ready**: Progressive Web App capabilities
- **🎨 Beautiful UI**: Modern, responsive design with animations
- **🔍 Smart Search**: Handles misspelled song names
- **📱 Responsive**: Mobile-first approach, works on all devices
- **🚀 Fast**: Optimized performance and loading states
- **🔐 Auth Ready**: Structure for authentication implementation

## 🏗️ Project Structure

```
frontend/
├── README.md                 # This file
├── package.json              # Dependencies and scripts
├── .gitignore               # Git ignore rules
├── public/                  # Static assets
│   ├── index.html           # Main HTML file
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons
├── src/                     # Source code
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── styles/              # CSS/SCSS files
│   ├── App.js               # Main App component
│   └── index.js             # Entry point
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd lyrics-extractor-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server:**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🌐 Backend Integration

The frontend connects to the Python backend API. You'll need to:

1. **Deploy the backend API** (see backend repository)
2. **Update the API URL** in your frontend configuration

```javascript
// Example API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const getLyrics = async (songName) => {
    const response = await fetch(`${API_BASE_URL}/api/lyrics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song_name: songName })
    });
    
    return response.json();
};
```

## 📱 PWA Features

- **Offline Support**: Service worker for offline functionality
- **Installable**: Can be installed on mobile devices
- **Push Notifications**: Ready for notification implementation
- **Background Sync**: Sync when connection is restored
- **App-like Experience**: Native app feel on mobile

## 🎨 UI Components

- **Search Interface**: Clean search input with examples
- **Results Display**: Beautiful lyrics presentation
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Responsive Layout**: Works on all device sizes
- **Dark/Light Mode**: Ready for theme switching

## 🔐 Authentication (Future)

The structure is ready for authentication features:
- User registration/login
- Favorite songs
- Search history
- User preferences
- Profile management

## 🚀 Deployment

### Netlify (Recommended - Free)
1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

### Vercel (Alternative - Free)
1. **Connect GitHub repository**
2. **Auto-deploy on push**
3. **Global CDN included**

### Other Options
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google's hosting solution
- **AWS S3 + CloudFront**: Enterprise solution

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_APP_NAME=Lyrics Extractor
REACT_APP_VERSION=1.0.0
```

## 📝 Development Notes

- Uses modern React patterns (hooks, functional components)
- Implements responsive design principles
- Follows PWA best practices
- Ready for TypeScript migration
- ESLint and Prettier configured
- Styled-components for styling
- Framer Motion for animations

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Frontend Problems**: Check React documentation
- **Backend Issues**: See backend repository

## 🔗 Related Repositories

- **Backend API**: [lyrics-extractor-api](https://github.com/yourusername/lyrics-extractor-api)

---

**🎵 Ready to build a beautiful lyrics extraction PWA? Start developing!** 