export interface IConsultaProps {
    isDialog?: boolean;
    toggleDialogOpen?: () => void;
    onSelectItem?: (row: any) => void;
}