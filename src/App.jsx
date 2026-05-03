import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GlobalChat from './pages/GlobalChat';
import Discover from './pages/Discover';
import TitleDetails from './pages/TitleDetails';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Community from './pages/Community';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages — NO layout wrapper (full screen) */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App pages — inside Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/discover" element={<Layout><Discover /></Layout>} />
        <Route path="/manhwa/:id" element={<Layout><TitleDetails /></Layout>} />
        <Route path="/library"   element={<Layout><Library /></Layout>} />
        <Route path="/chat"      element={<Layout><GlobalChat /></Layout>} />
        <Route path="/profile"   element={<Layout><Profile /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/settings"  element={<Layout><Settings /></Layout>} />

        {/* 404 */}
        <Route path="*" element={
          <Layout>
            <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text-muted)' }}>
              <h1 style={{ fontSize: '4rem', fontFamily: 'Space Grotesk', color: 'var(--blue-bright)' }}>404</h1>
              <p>Page not found.</p>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
