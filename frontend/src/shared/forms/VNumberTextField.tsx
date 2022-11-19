import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { InputAttributes, NumberFormatBaseProps, NumericFormat, NumericFormatProps } from 'react-number-format';

type TVNumberInputProps = TextFieldProps & {
    name: string;
    inputProps?: React.ReactNode;
}

const CustomNumberFormat = React.forwardRef<NumericFormatProps<InputAttributes>, TVNumberInputProps>((props: any, ref) => {
    const { onChange, prefix, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: String(values.value)
                    },
                });
            }}
        />
    )
})

export const VNumberTextField: React.FC<TVNumberInputProps> = ({ name, inputProps, ...rest }) => {
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
        <TextField
            {...rest}

            InputLabelProps={{
                shrink: true,
            }}

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            InputProps={{
                endAdornment: (
                    inputProps
                ),
                inputComponent: CustomNumberFormat as any,
            }}

            value={value}
            onChange={e => { 
                rest.onChange?.(e); 
                setValue(String(e.target.value));
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};