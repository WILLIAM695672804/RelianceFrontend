const SELECTEUR = '.material-symbols-outlined, .material-icons';

function marquer(el: Element): void {
    if (el.getAttribute('translate') !== 'no') el.setAttribute('translate', 'no');
    el.classList.add('notranslate'); // reconnu par Google Traduction et d'autres outils
}

function baliser(racine: ParentNode): void {
    racine.querySelectorAll(SELECTEUR).forEach(marquer);
}

/**
 * Empêche la traduction automatique des icônes (ligatures de police : le texte « home » est un pictogramme).
 * Marque les icônes présentes puis celles ajoutées dynamiquement par React.
 */
export function protegerIcones(doc: Document = document): MutationObserver {
    baliser(doc);
    const observateur = new MutationObserver((mutations) => {
        for (const m of mutations) {
            m.addedNodes.forEach((n) => {
                if (!(n instanceof Element)) return;
                if (n.matches(SELECTEUR)) marquer(n);
                baliser(n);
            });
        }
    });
    observateur.observe(doc.documentElement, { childList: true, subtree: true });
    return observateur;
}
