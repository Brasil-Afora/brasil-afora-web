import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Homepage from './components/Homepage';
import OpportunitiesMain from './components/OpportunitiesMain';
import Dictionary from './components/Dictionary';
import CollegeListMain from './components/CollegeListMain';
import OpportunitiesInfo from './components/OpportunitiesInfo';
import WorldMapPage from './components/WorldMapPage';
import ProfileMain from './components/ProfileMain';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-900 min-h-screen text-slate-200">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/oportunidades" element={<OpportunitiesMain />} />
          <Route path="/oportunidades/:id" element={<OpportunitiesInfo />} />
          <Route path="/dicionario" element={<Dictionary />} />
          <Route path="/college-list" element={<CollegeListMain />} />
          <Route path="/perfil" element={<ProfileMain />} />
          <Route path="/mapa" element={<WorldMapPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


export default App;