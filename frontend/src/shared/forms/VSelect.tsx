import { useEffect, useState } from "react";
import { Select, SelectProps } from "@mui/material";
import { useField } from "@unform/core";
import { format } from "path";

type TVSelectProps = SelectProps & {
    name: string;
    children: React.ReactNode;
}

export const VSelect: React.FC<TVSelectProps> = ({ children, name, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);

    return (
        <Select
            {...rest}

            error={!!error}
            defaultValue={defaultValue}

            
            value={value}
            onChange={e => { 
                setValue(e.target.value.toUpperCase());
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        >
            {children}
        </Select>
    );
};