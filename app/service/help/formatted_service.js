
export class FormattedService {
    static formattedLastAt(timestamp) {
        if (!timestamp) return '-';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);

        if (diffSecs < 60) return 'Agora';
        if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m atrás`;
        if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h atrás`;
        if (diffSecs < 604800) return `${Math.floor(diffSecs / 86400)}d atrás`;

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}