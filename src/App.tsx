import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
// Header is now handled by PublicLayout
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/common/AuthModal';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Legal from './pages/Legal';
import InscriptionClient from './pages/inscription/InscriptionClient';
import InscriptionTechnicien from './pages/inscription/InscriptionTechnicien';
import InscriptionAgence from './pages/inscription/InscriptionAgence';
import InscriptionEntreprise from './pages/inscription/InscriptionEntreprise';
import VerifyEmail from './pages/client/VerifyEmail';

// Public Layout
import PublicLayout from './layouts/PublicLayout';

// Client Space
import ClientModernLayout from './layouts/ClientModernLayout';
import ClientDashboardModern from './pages/client/ClientDashboardModern';
import Auth2FA from './pages/client/Auth2FA';
import RequestWizard from './pages/client/RequestWizard/RequestWizard';
import MatchingResults from './pages/client/MatchingResults';
import ClientAppointments from './pages/client/ClientAppointments';
import MissionTracking from './pages/client/MissionTracking';
import ClientWallet from './pages/client/ClientWallet';
import ProfileSettings from './pages/client/ProfileSettings';

// Technician Space
import TechnicianLayout from './layouts/TechnicianLayout';
import ZoneIntervention from './pages/technician/ZoneIntervention';
import KYCStatus from './pages/technician/KYCStatus';
import Dashboard from './pages/technician/Dashboard';
import Planning from './pages/technician/Planning';
import LiveRadar from './pages/technician/LiveRadar';
import Cockpit from './pages/technician/Cockpit';
import MissionDetail from './pages/technician/MissionDetail';
import QuoteEditor from './pages/technician/QuoteEditor';
import MissionCompletion from './pages/technician/MissionCompletion';
import Wallet from './pages/technician/Wallet';
import TransactionHistory from './pages/technician/TransactionHistory';
import IdentityHub from './pages/technician/IdentityHub';
import ReviewsList from './pages/technician/ReviewsList';
import SocialWall from './pages/technician/SocialWall';
import Trophies from './pages/technician/Trophies';
import SlaAuditLog from './pages/technician/SlaAuditLog';
import Subscriptions from './pages/technician/Subscriptions';

// Client Operations Pages
import Invoices from './pages/client/Invoices';
import JobTracking from './pages/client/JobTracking';

// Common Pages (shared between client & technician)
import Notifications from './pages/common/Notifications';
import Disputes from './pages/common/Disputes';
import DisputeDetail from './pages/common/DisputeDetail';

// Admin Space
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTechnicians from './pages/admin/AdminTechnicians';
import AdminKyc from './pages/admin/AdminKyc';
import AdminDisputes from './pages/admin/AdminDisputes';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminUpgradeRequests from './pages/admin/AdminUpgradeRequests';
import AdminFees from './pages/admin/AdminFees';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminRequests from './pages/admin/AdminRequests';
import AdminConversations from './pages/admin/AdminConversations';
import AdminMap from './pages/admin/AdminMap';

// Agency Space
import AgencyLayout from './layouts/AgencyLayout';
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AgencyMembers from './pages/agency/AgencyMembers';
import AgencyProfile from './pages/agency/AgencyProfile';

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';

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
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cgu" element={<Legal type="cgu" />} />
            <Route path="/confidentialite" element={<Legal type="privacy" />} />
            <Route path="/inscription/client" element={<InscriptionClient />} />
            <Route path="/inscription/technicien" element={<InscriptionTechnicien />} />
            <Route path="/inscription/agence" element={<InscriptionAgence />} />
            <Route path="/inscription/entreprise" element={<InscriptionEntreprise />} />
            <Route path="/auth/2fa" element={<Auth2FA />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />

            <Route path="/artisan/:id" element={<PublicTechProfile />} />
          </Route>

          {/* Espace Client — Protégé par rôle */}
          <Route path="/espace-client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientModernLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboardModern />} />
            <Route path="demande" element={<RequestWizard />} />
            <Route path="matching" element={<MatchingResults />} />
            <Route path="rendez-vous" element={<ClientAppointments />} />
            <Route path="suivi" element={<MissionTracking />} />
            <Route path="factures" element={<Invoices />} />
            <Route path="suivi-job/:jobId" element={<JobTracking />} />
            <Route path="wallet" element={<ClientWallet />} />
            <Route path="profil" element={<ProfileSettings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="litiges" element={<Disputes />} />
            <Route path="litiges/:id" element={<DisputeDetail />} />
          </Route>

          {/* Espace Technicien — Protégé par rôle */}
          <Route path="/technicien" element={
            <ProtectedRoute allowedRoles={['technicien']}>
              <TechnicianLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="verification" element={<KYCStatus />} />
            <Route path="zone" element={<ZoneIntervention />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cockpit" element={<Cockpit />} />
            <Route path="radar" element={<LiveRadar />} />
            <Route path="planning" element={<Planning />} />
            <Route path="mission/:id" element={<MissionDetail />} />
            <Route path="mission/:id/devis" element={<QuoteEditor />} />
            <Route path="mission/:id/travaux" element={<MissionCompletion />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="wallet/historique" element={<TransactionHistory />} />
            <Route path="identite" element={<IdentityHub />} />
            <Route path="avis" element={<ReviewsList />} />
            <Route path="audit-sla" element={<SlaAuditLog />} />
            <Route path="abonnements" element={<Subscriptions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="litiges" element={<Disputes />} />
            <Route path="litiges/:id" element={<DisputeDetail />} />
            <Route path="social" element={<SocialWall />} />
            <Route path="trophees" element={<Trophies />} />
          </Route>
          {/* Espace Admin — Protege par role */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="litiges" element={<AdminDisputes />} />
            <Route path="abonnements" element={<AdminSubscriptions />} />
            <Route path="promotions" element={<AdminUpgradeRequests />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="demandes" element={<AdminRequests />} />
            <Route path="messagerie" element={<AdminConversations />} />
            <Route path="carte" element={<AdminMap />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Espace Agence — Protégé par rôle */}
          <Route path="/agence" element={
            <ProtectedRoute allowedRoles={['agence']}>
              <AgencyLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AgencyDashboard />} />
            <Route path="membres" element={<AgencyMembers />} />
            <Route path="profil" element={<AgencyProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
        <AuthModal />
        <LogoutConfirmModal />
      </AuthProvider>
    </Router>
  );
}

export default App;
