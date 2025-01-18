interface normalizeCurrencyProps {
    value: number,
    currency: "INR"
}

// small unit to big unit
export const normalizeCurrency = ({ value, currency }: normalizeCurrencyProps) => {
    return value / 100;
}

// big unit to small unit
export const denormalizeCurrency = ({ value, currency }: normalizeCurrencyProps) => {
    return value * 100;
}