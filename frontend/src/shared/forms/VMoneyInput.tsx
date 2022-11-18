import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { InputAttributes, NumberFormatBaseProps, NumericFormat, NumericFormatProps } from 'react-number-format';

type TVNumberInputProps = TextFieldProps & {
    name: string;
    initialValue?: number;
}

const CustomMoneyFormat = React.forwardRef<NumericFormatProps<InputAttributes>, TVNumberInputProps>((props: any, ref) => {
    const { onChange, prefix, ...other } = props;

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
            prefix="R$"
            decimalScale={2}
            fixedDecimalScale
        />
    )
})

export const VMoneyInput: React.FC<TVNumberInputProps> = ({ name, prefix, initialValue, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || initialValue);

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
                shrink: true
            }}

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            InputProps={{
                inputComponent: CustomMoneyFormat as any
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