/**
 * Formatage centralisé. XAF (FCFA) est une devise SANS décimales :
 * on arrondit toujours à l'entier et on n'affiche aucune fraction.
 */
export function formatXAF(amount: number | string | null | undefined): string {
    const n = Number(amount ?? 0);
    if (!Number.isFinite(n)) return '0 XAF';
    return (
        new Intl.NumberFormat('fr-FR', {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
        }).format(Math.round(n)) + ' XAF'
    );
}

/** Variante sans suffixe (quand l'UI affiche déjà « XAF » à côté). */
export function formatNumber(amount: number | string | null | undefined): string {
    const n = Number(amount ?? 0);
    if (!Number.isFinite(n)) return '0';
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n));
}

export function formatDate(value: string | number | Date | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(d);
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
}
