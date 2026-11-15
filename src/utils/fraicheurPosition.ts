/** Âge de la position du technicien : un point figé ne doit pas passer pour une position en direct. */
export function fraicheurPosition(updatedAt: string | undefined, maintenant: number): string {
    const instant = updatedAt ? Date.parse(updatedAt) : NaN;
    if (Number.isNaN(instant)) return 'Position reçue';
    const minutes = Math.floor((maintenant - instant) / 60_000);
    if (minutes < 1) return 'Position en direct';
    if (minutes < 60) return `Dernière position il y a ${minutes} min`;
    return `Dernière position à ${new Date(instant).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}
