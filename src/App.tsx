import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
// Header is now handled by PublicLayout
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/common/AuthModal';
// BottomNav is now handled by PublicLayout
import SocialFeed from './pages/public/SocialFeed';
import PublicTechProfile from './pages/public/TechProfile';
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

// Public Layout
import PublicLayout from './layouts/PublicLayout';

// Client Space
import ClientLayout from './layouts/ClientLayout';
import ClientModernLayout from './layouts/ClientModernLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientDashboardModern from './pages/client/ClientDashboardModern';
import Auth2FA from './pages/client/Auth2FA';
import RequestWizard from './pages/client/RequestWizard/RequestWizard';
import MatchingResults from './pages/client/MatchingResults';
import MissionTracking from './pages/client/MissionTracking';
import ClientWallet from './pages/client/ClientWallet';

// Technician Space
import TechnicianLayout from './layouts/TechnicianLayout';
import SkillMatrix from './pages/technician/SkillMatrix';
// import ZoneIntervention from './pages/technician/ZoneIntervention';
// import KYCStatus from './pages/technician/KYCStatus';
import Dashboard from './pages/technician/Dashboard';
import Planning from './pages/technician/Planning';
import LiveRadar from './pages/technician/LiveRadar';
import Cockpit from './pages/technician/Cockpit';
// import MissionDetail from './pages/technician/MissionDetail';
// import QuoteEditor from './pages/technician/QuoteEditor';
// import MissionRoute from './pages/technician/MissionRoute';
// import MissionCompletion from './pages/technician/MissionCompletion';
import Wallet from './pages/technician/Wallet';
import Withdrawal from './pages/technician/Withdrawal';
// import TransactionHistory from './pages/technician/TransactionHistory';
import IdentityHub from './pages/technician/IdentityHub';
// import Reviews from './pages/technician/Reviews';
// import SocialWall from './pages/technician/SocialWall';
// import Trophies from './pages/technician/Trophies';
import SlaAuditLog from './pages/technician/SlaAuditLog';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Routes Publiques avec le Header global */}
          <Route element={<PublicLayout />}>
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
            <Route path="/auth/2fa" element={<Auth2FA />} />

            {/* Social Feed (Hybrid Base) */}
            <Route path="/actualites" element={<SocialFeed />} />
            <Route path="/artisan/:id" element={<PublicTechProfile />} />
          </Route>

          {/* Espace Client (Unsecured for testing) */}
          <Route path="/client" element={<ClientLayout />}>
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="demande" element={<RequestWizard />} />
            <Route path="suivi" element={<MissionTracking />} />
            <Route path="wallet" element={<ClientWallet />} />
            {/* Placeholders for upcoming sprints */}
            <Route path="profil" element={<div style={{padding: '30px'}}>Profil client en construction...</div>} />
          </Route>

          {/* NOUVEL Espace Client (Modern Aesthetic - Route Séparée) */}
          <Route path="/espace-client" element={<ClientModernLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboardModern />} />
            <Route path="demande" element={<RequestWizard />} />
            <Route path="matching" element={<MatchingResults />} />
            {/* Using old components temporarily until they are modernized */}
            <Route path="suivi" element={<MissionTracking />} />
            <Route path="wallet" element={<ClientWallet />} />
          </Route>

          {/* Espace Technicien (Unsecured for testing) */}
          <Route path="/technicien" element={<TechnicianLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="competences" element={<SkillMatrix />} />
            {/* <Route path="zone" element={<ZoneIntervention />} />
            <Route path="verification" element={<KYCStatus />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cockpit" element={<Cockpit />} />
            <Route path="radar" element={<LiveRadar />} />
            <Route path="planning" element={<Planning />} />
            {/* <Route path="mission/:id" element={<MissionDetail />} />
            <Route path="mission/:id/devis" element={<QuoteEditor />} />
            <Route path="mission/:id/route" element={<MissionRoute />} />
            <Route path="mission/:id/travaux" element={<MissionCompletion />} /> */}
            <Route path="wallet" element={<Wallet />} />
            <Route path="wallet/retrait" element={<Withdrawal />} />
            {/* <Route path="wallet/historique" element={<TransactionHistory />} /> */}
            <Route path="identite" element={<IdentityHub />} />
            {/* <Route path="avis" element={<Reviews />} /> */}
            <Route path="audit-sla" element={<SlaAuditLog />} />
            {/* <Route path="social" element={<SocialWall />} />
            <Route path="trophees" element={<Trophies />} /> */}
            {/* Add other routes here as we build them */}
          </Route>
        </Routes>
        <AuthModal />
      </AuthProvider>
    </Router>
  );
}

export default App;
