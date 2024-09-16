import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import C64Startup from './pages/C64Startup';
import MainMenu from './pages/MainMenu';
import Resume from './components/Resume';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <Router basename="/shermanhuman.github.io"> 
      <div className="c64-container">
        {!booted ? ( 
          <C64Startup setBooted={setBooted} /> 
        ) : (
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
          </Routes>
        )} 
      </div>
    </Router>
  );
}