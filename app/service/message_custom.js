import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

let toast;
let confirm;

export const initializeMessaging = () => {
    toast = useToast();
    confirm = useConfirm();
};

export const MessageBox = (message, title, severity = 'secondary', life = 100000) => {
    if (toast) {
        toast.add({
            severity,
            summary: title,
            detail: message,
            group: 'headless',
            life: life,
            styleClass: 'backdrop-blur-lg rounded-2xl'
        });
    } else {
        console.warn('Toast não inicializado');
    }
};

export const MessageSuccess = (message, title = 'Êxito', life = 100000) => {
    MessageBox(message, title, 'success', life);
};
export const MessageWarn = (message, title = 'Atenção', life = 100000) => {
    MessageBox(message, title, 'warn', life);
};
export const MessageError = (message, title = 'Erro', life = 100000) => {
    MessageBox(message, title, 'error', life);
};
export const MessageInfo = (message, title = 'Informação', life = 100000) => {
    MessageBox(message, title, 'info', life);
};

export const ConfirmBox = ({ message, header = 'Atenção', icon = 'pi pi-lock', accept, reject }) => {
    if (confirm) {
        confirm.require({
            message,
            header,
            icon,
            accept,
            reject,
            group: 'headless'
        });
    } else {
        console.warn('Confirm não inicializado');
    }
};

export const ConfirmBoxCode = ({ message, header = 'Confirmação de exclusão', icon = 'pi pi-lock', accept, reject, acceptLabel = 'Excluir', rejectLabel = 'Cancelar' }) => {
    if (confirm) {
        const code = Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 62))).join('');

        confirm.require({
            group: 'headless-code',
            message,
            header,
            icon,
            accept,
            reject,
            acceptLabel,
            rejectLabel,
            code, // passa o código para o container
            userInput: '' // bind para o input
        });
    } else {
        console.warn('Confirm não inicializado');
    }
};
