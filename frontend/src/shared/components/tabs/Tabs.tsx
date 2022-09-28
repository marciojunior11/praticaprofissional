import { Box, Tabs, Tab, Typography } from "@mui/material";
import React, { useState } from "react";
import { string } from "yup";
import { ITabProps } from "../../interfaces/components/Tabs";

interface ITabsProps { 
    children: React.ReactNode;
    tabList: ITabProps[]; 
}

export const CustomTabs: React.FC<ITabsProps> = ({ children, tabList }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={handleChangeTab}>
                    {tabList.map(item => {
                        return (
                            <Tab label={item.label}/>
                        )
                    })}
                </Tabs>
            </Box>
        </Box>
    )
}