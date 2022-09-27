export interface ICadastroProps {
    isDialog?: boolean;
    toggleOpen?: () => void;
    selectedId?: number;
    reloadDataTableIfDialog?: () => void;
}