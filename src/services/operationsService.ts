import api from './api';

// ── Types ────────────────────────────────────────────────

export interface QuoteBreakdownItem {
    label: string;
    amount: number;
}

export interface Quote {
    id: string;
    request_id: string;
    issuer_id: string;
    issuer?: { id: string; name: string };
    total_amount: number;
    breakdown: QuoteBreakdownItem[] | null;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    valid_until: string | null;
    created_at: string;
    updated_at: string;
}

export interface Invoice {
    id: string;
    quote_id: string | null;
    client_id: string;
    issuer_id: string;
    client?: { id: string; name: string };
    issuer?: { id: string; name: string };
    amount: number;
    tax_amount: number;
    /** Frais d'intervention (commission de plateforme) et net reversé au prestataire. */
    platform_fee?: number;
    net_to_issuer?: number;
    reference: string;
    external_pdf_ref: string | null;
    status: 'unpaid' | 'paid' | 'cancelled' | 'refunded';
    created_at: string;
    updated_at: string;
}

export interface Appointment {
    id: string;
    request_id: string;
    technician_id: string;
    request?: { id: string; title: string; status: string };
    technician?: { id: string; name: string };
    location?: { id: string; address: string; city: string } | null;
    scheduled_start: string;
    scheduled_end: string | null;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    notes: string | null;
    assigned_at: string;
    created_at: string;
}

export interface JobPhase {
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    notes?: string;
}

export interface TechnicianJob {
    id: string;
    request_id: string;
    technician_id: string;
    appointment_id: string | null;
    request?: { id: string; title: string; status: string };
    technician?: { id: string; name: string };
    status: 'pending' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
    phases: JobPhase[] | null;
    route: any | null;
    estimated_travel_seconds: number | null;
    completion_notes: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
}

// ── Quotes (Devis) ───────────────────────────────────────

export const getQuotesForRequest = async (requestId: string): Promise<Quote[]> => {
    const response = await api.get(`/requests/${requestId}/quotes`);
    return response.data.data;
};

export const createQuote = async (data: {
    request_id: string;
    total_amount: number;
    breakdown?: QuoteBreakdownItem[];
    valid_until?: string;
}): Promise<Quote> => {
    const response = await api.post('/quotes', data);
    return response.data.data;
};

export const getQuote = async (id: string): Promise<Quote> => {
    const response = await api.get(`/quotes/${id}`);
    return response.data.data;
};

export const sendQuote = async (id: string): Promise<Quote> => {
    const response = await api.post(`/quotes/${id}/send`);
    return response.data.data;
};

export const acceptQuote = async (id: string) => {
    const response = await api.post(`/quotes/${id}/accept`);
    return response.data;
};

export const rejectQuote = async (id: string): Promise<Quote> => {
    const response = await api.post(`/quotes/${id}/reject`);
    return response.data.data;
};

// ── Invoices (Factures) ──────────────────────────────────

export const getInvoices = async (page = 1): Promise<{ data: Invoice[]; meta: any }> => {
    const response = await api.get('/invoices', { params: { page } });
    return response.data;
};

export const getInvoice = async (id: string): Promise<Invoice> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data.data;
};

/** Télécharge la facture au format PDF (octets) ; le nom de fichier est dérivé de la référence. */
export const downloadInvoicePdf = async (id: string): Promise<Blob> => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
};

export const payInvoice = async (id: string): Promise<Invoice> => {
    const response = await api.post(`/invoices/${id}/pay`);
    return response.data.data;
};

// ── Appointments (Rendez-vous) ───────────────────────────

export const getAppointments = async (page = 1): Promise<{ data: Appointment[]; meta: any }> => {
    const response = await api.get('/appointments', { params: { page } });
    return response.data;
};

export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/upcoming');
    return response.data.data;
};

export const createAppointment = async (data: {
    request_id: string;
    technician_id: string;
    scheduled_start: string;
    scheduled_end?: string;
    location_id?: string;
    notes?: string;
}): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data.data;
};

export const getAppointment = async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data;
};

export const updateAppointmentStatus = async (id: string, status: string): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data.data;
};

// ── Jobs (Interventions) ─────────────────────────────────

export const getJobs = async (status?: string, page = 1): Promise<{ data: TechnicianJob[]; meta: any }> => {
    const params: any = { page };
    if (status) params.status = status;
    const response = await api.get('/jobs', { params });
    return response.data;
};

export const createJob = async (data: {
    request_id: string;
    appointment_id?: string;
}): Promise<TechnicianJob> => {
    const response = await api.post('/jobs', data);
    return response.data.data;
};

export const getJob = async (id: string): Promise<TechnicianJob> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data;
};

export const updateJobStatus = async (id: string, data: {
    status: string;
    completion_notes?: string;
    phases?: JobPhase[];
}): Promise<TechnicianJob> => {
    const response = await api.patch(`/jobs/${id}/status`, data);
    return response.data.data;
};

export const updateJobPhases = async (id: string, phases: JobPhase[]): Promise<TechnicianJob> => {
    const response = await api.put(`/jobs/${id}/phases`, { phases });
    return response.data.data;
};

export const getJobTracking = async (id: string) => {
    const response = await api.get(`/jobs/${id}/tracking`);
    return response.data.data;
};
