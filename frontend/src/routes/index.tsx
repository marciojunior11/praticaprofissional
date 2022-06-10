import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useDrawerContext } from "../shared/contexts";
import { 
    Dashboard,
    ConsultaClientes, 
    ConsultaPaises,
} from "../pages";

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Página inicial',
                icon: 'home',
                path: '/home',
            },
            {
                label: 'Clientes',
                icon: 'people',
                path: '/clientes',
            },
            {
                label: 'Paises',
                icon: 'location_city',
                path: '/paises',
            },
        ]);
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Dashboard/>}/>
            
            <Route path="/clientes" element={<ConsultaClientes/>}/>
            {/*<Route path="/cidades/detalhe/:id" element={<Dashboard/>}/>*/}

            <Route path="/paises" element={<ConsultaPaises/>}/>
            <Route path="/paises/detalhe/:id" element={<p>DETALHE</p>}/>

            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
    );
}