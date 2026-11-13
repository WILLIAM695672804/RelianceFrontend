import { afterEach, describe, expect, it } from 'vitest';
import { protegerIcones } from './protegerIcones';

let obs: MutationObserver | undefined;
afterEach(() => { obs?.disconnect(); document.body.innerHTML = ''; });
const attendre = () => new Promise((r) => setTimeout(r, 0));

describe('protegerIcones', () => {
    it('marque les icônes déjà présentes comme non traduisibles', () => {
        document.body.innerHTML = '<span class="material-symbols-outlined">home</span><span class="autre">Texte</span>';

        obs = protegerIcones();

        const icone = document.querySelector('.material-symbols-outlined')!;
        expect(icone).toHaveAttribute('translate', 'no');
        expect(icone).toHaveClass('notranslate');
        expect(document.querySelector('.autre')).not.toHaveAttribute('translate');
    });

    it('marque aussi les icônes ajoutées ensuite, y compris imbriquées', async () => {
        obs = protegerIcones();

        const bloc = document.createElement('div');
        bloc.innerHTML = '<button><span class="material-symbols-outlined">edit</span></button><span class="material-icons">close</span>';
        document.body.appendChild(bloc);
        const direct = document.createElement('span');
        direct.className = 'material-symbols-outlined';
        direct.textContent = 'add';
        document.body.appendChild(direct);
        await attendre();

        document.querySelectorAll('.material-symbols-outlined, .material-icons').forEach((e) => expect(e).toHaveAttribute('translate', 'no'));
        expect(document.querySelectorAll('[translate="no"]')).toHaveLength(3);
    });

    it('est idempotente', () => {
        document.body.innerHTML = '<span class="material-symbols-outlined">home</span>';

        obs = protegerIcones();
        const second = protegerIcones();
        second.disconnect();

        expect(document.querySelector('.material-symbols-outlined')!.className.match(/notranslate/g)).toHaveLength(1);
    });
});
