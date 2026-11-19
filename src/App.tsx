import { lazy, Suspense } from 'react';
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

// Public Layout
import PublicLayout from './layouts/PublicLayout';

// Client Space

// Technician Space

// Client Operations Pages

// Common Pages (shared between client & technician)

// Admin Space

// Agency Space

// Auth Guard
import ProtectedRoute from './components/auth/ProtectedRoute';
import LogoutConfirmModal from './components/auth/LogoutConfirmModal';
import RouteTracker from './components/analytics/RouteTracker';

// Espaces authentifiés chargés à la demande : le visiteur d'une page publique ne télécharge ni la
// carte (MapLibre) ni les écrans client, technicien, agence et administrateur.
const VerifyEmail = lazy(() => import('./pages/client/VerifyEmail'));
const ClientModernLayout = lazy(() => import('./layouts/ClientModernLayout'));
const ClientDashboardModern = lazy(() => import('./pages/client/ClientDashboardModern'));
const Auth2FA = lazy(() => import('./pages/client/Auth2FA'));
const RequestWizard = lazy(() => import('./pages/client/RequestWizard/RequestWizard'));
const MatchingResults = lazy(() => import('./pages/client/MatchingResults'));
const ClientAppointments = lazy(() => import('./pages/client/ClientAppointments'));
const MissionTracking = lazy(() => import('./pages/client/MissionTracking'));
const ClientWallet = lazy(() => import('./pages/client/ClientWallet'));
const ProfileSettings = lazy(() => import('./pages/client/ProfileSettings'));
const TechnicianLayout = lazy(() => import('./layouts/TechnicianLayout'));
const ZoneIntervention = lazy(() => import('./pages/technician/ZoneIntervention'));
const KYCStatus = lazy(() => import('./pages/technician/KYCStatus'));
const Dashboard = lazy(() => import('./pages/technician/Dashboard'));
const Planning = lazy(() => import('./pages/technician/Planning'));
const LiveRadar = lazy(() => import('./pages/technician/LiveRadar'));
const Cockpit = lazy(() => import('./pages/technician/Cockpit'));
const MissionDetail = lazy(() => import('./pages/technician/MissionDetail'));
const QuoteEditor = lazy(() => import('./pages/technician/QuoteEditor'));
const MissionCompletion = lazy(() => import('./pages/technician/MissionCompletion'));
const Wallet = lazy(() => import('./pages/technician/Wallet'));
const TransactionHistory = lazy(() => import('./pages/technician/TransactionHistory'));
const IdentityHub = lazy(() => import('./pages/technician/IdentityHub'));
const ReviewsList = lazy(() => import('./pages/technician/ReviewsList'));
const SocialWall = lazy(() => import('./pages/technician/SocialWall'));
const Trophies = lazy(() => import('./pages/technician/Trophies'));
const SlaAuditLog = lazy(() => import('./pages/technician/SlaAuditLog'));
const Invoices = lazy(() => import('./pages/client/Invoices'));
const JobTracking = lazy(() => import('./pages/client/JobTracking'));
const Notifications = lazy(() => import('./pages/common/Notifications'));
const Disputes = lazy(() => import('./pages/common/Disputes'));
const DisputeDetail = lazy(() => import('./pages/common/DisputeDetail'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminTechnicians = lazy(() => import('./pages/admin/AdminTechnicians'));
const AdminKyc = lazy(() => import('./pages/admin/AdminKyc'));
const AdminDisputes = lazy(() => import('./pages/admin/AdminDisputes'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));
const AdminUpgradeRequests = lazy(() => import('./pages/admin/AdminUpgradeRequests'));
const AdminFees = lazy(() => import('./pages/admin/AdminFees'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminRequests = lazy(() => import('./pages/admin/AdminRequests'));
const AdminConversations = lazy(() => import('./pages/admin/AdminConversations'));
const AdminMap = lazy(() => import('./pages/admin/AdminMap'));
const AgencyLayout = lazy(() => import('./layouts/AgencyLayout'));
const AgencyDashboard = lazy(() => import('./pages/agency/AgencyDashboard'));
const AgencyMembers = lazy(() => import('./pages/agency/AgencyMembers'));
const AgencyProfile = lazy(() => import('./pages/agency/AgencyProfile'));

const ChargementPage = () => <div className="page-loading" role="status" aria-live="polite">Chargement…</div>;

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Suspense fallback={<ChargementPage />}>
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
        </Suspense>
        <AuthModal />
        <LogoutConfirmModal />
        <RouteTracker />
      </AuthProvider>
    </Router>
  );
}

export default App;
