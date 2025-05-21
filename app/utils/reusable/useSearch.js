import { useGetProductsQuery } from '@/app/redux-tookit/services/productService';
import { useState } from 'react';
import { useDebounce } from 'react-use';

export const useSearch = (inputValue) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useDebounce(() => {
        setDebouncedValue(inputValue);
    }, 300, [inputValue]);

    const { data = [], isLoading, isError } = useGetProductsQuery({ search: debouncedValue });

    return { data, isLoading, isError };
};
