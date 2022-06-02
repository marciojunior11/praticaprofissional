import { ListTools, DetailTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";


export const Dashboard = () => {
    return (
        <LayoutBase
            titulo='Página inicial'
            barraDeFerramentas={(
                <DetailTools mostrarBotaoSalvarFechar/>
            )}
        >
            Testando
        </LayoutBase>
    );
};