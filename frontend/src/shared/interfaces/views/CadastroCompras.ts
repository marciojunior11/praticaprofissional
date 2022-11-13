import { IValidator } from "../entities/Compras";

export interface ICadastroComprasProps {
    isDialog?: boolean;
    toggleOpen?: () => void;
    selectedRow?: IValidator;
    reloadDataTableIfDialog?: () => void;
}