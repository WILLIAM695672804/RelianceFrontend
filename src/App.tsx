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
import TechnicianLayout from './layouts/TechnicianLayout';
import SkillMatrix from './pages/technician/SkillMatrix';
import ZoneIntervention from './pages/technician/ZoneIntervention';
import KYCStatus from './pages/technician/KYCStatus';
import Abonnement from './pages/technician/Abonnement';
import Dashboard from './pages/technician/Dashboard';
import Planning from './pages/technician/Planning';
import MissionDetail from './pages/technician/MissionDetail';
import QuoteEditor from './pages/technician/QuoteEditor';
import MissionRoute from './pages/technician/MissionRoute';
import MissionCompletion from './pages/technician/MissionCompletion';
import Wallet from './pages/technician/Wallet';
import Withdrawal from './pages/technician/Withdrawal';
import TransactionHistory from './pages/technician/TransactionHistory';
import Profile from './pages/technician/Profile';
import Reviews from './pages/technician/Reviews';
import SocialWall from './pages/technician/SocialWall';
import Trophies from './pages/technician/Trophies';

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

        {/* Espace Technicien (Unsecured for testing) */}
        <Route path="/technicien" element={<TechnicianLayout />}>
          <Route path="competences" element={<SkillMatrix />} />
          <Route path="zone" element={<ZoneIntervention />} />
          <Route path="verification" element={<KYCStatus />} />
          <Route path="abonnement" element={<Abonnement />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="planning" element={<Planning />} />
          <Route path="mission/:id" element={<MissionDetail />} />
          <Route path="mission/:id/devis" element={<QuoteEditor />} />
          <Route path="mission/:id/route" element={<MissionRoute />} />
          <Route path="mission/:id/travaux" element={<MissionCompletion />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="wallet/retrait" element={<Withdrawal />} />
          <Route path="wallet/historique" element={<TransactionHistory />} />
          <Route path="profil" element={<Profile />} />
          <Route path="avis" element={<Reviews />} />
          <Route path="social" element={<SocialWall />} />
          <Route path="trophees" element={<Trophies />} />
          {/* Add other routes here as we build them */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
