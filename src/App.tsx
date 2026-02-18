import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/variables.css';
import Home from './pages/Home';
import Entreprises from './pages/Entreprises';
import Candidats from './pages/Candidats';
import Contact from './pages/Contact';
import QuiSommesNous from './pages/QuiSommesNous';
import Equipe from './pages/Equipe';
import DepannageMaintenance from './pages/DepannageMaintenance';
import InstallationSecurite from './pages/InstallationSecurite';
import DevenirMembre from './pages/DevenirMembre';
import Connexion from './pages/Connexion';
import InscriptionClient from './pages/inscription/InscriptionClient';
import InscriptionTechnicien from './pages/inscription/InscriptionTechnicien';
import InscriptionAgence from './pages/inscription/InscriptionAgence';
import InscriptionEntreprise from './pages/inscription/InscriptionEntreprise';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entreprises" element={<Entreprises />} />
        <Route path="/candidats" element={<Candidats />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/depannage-maintenance" element={<DepannageMaintenance />} />
        <Route path="/installation-securite" element={<InstallationSecurite />} />
        <Route path="/devenir-membre" element={<DevenirMembre />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription/client" element={<InscriptionClient />} />
        <Route path="/inscription/technicien" element={<InscriptionTechnicien />} />
        <Route path="/inscription/agence" element={<InscriptionAgence />} />
        <Route path="/inscription/entreprise" element={<InscriptionEntreprise />} />
      </Routes>
    </Router>
  );
}

export default App;
