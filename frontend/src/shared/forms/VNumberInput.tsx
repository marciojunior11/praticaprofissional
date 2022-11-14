import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { InputAttributes, NumberFormatBaseProps, NumericFormat, NumericFormatProps } from 'react-number-format';

type TVNumberInputProps = TextFieldProps & {
    name: string;
    prefix?: string;
}

const CustomNumberFormat = React.forwardRef<NumericFormatProps<InputAttributes>, TVNumberInputProps>((props: any, ref) => {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: parseFloat(Number(values.value).toFixed(2))
                    },
                });
            }}
            thousandSeparator="."
            decimalSeparator=","
            valueIsNumericString
            prefix="R$"
        />
    )
})

export const VNumberInput: React.FC<TVNumberInputProps> = ({ name, prefix, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || 0);

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

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            InputProps={{
                inputComponent: CustomNumberFormat as any
            }}

            value={value}
            onChange={e => { 
                rest.onChange?.(e); 
                setValue(parseFloat(Number(e.target.value).toFixed(2)));
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};