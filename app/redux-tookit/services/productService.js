import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../common/headers";
import { GET_FILTERED_DATA, PRODUCTS } from "@/app/utils/endPoint";

export const productService = createApi({
    reducerPath: 'products',
    tagTypes: ['getProducts'],
    baseQuery,
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params = {}) => {
                const defaultParams = {
                    page: 1,
                    limit: 10000,
                };
                console.log('paramsparams', params)
                const finalParams = { ...defaultParams, ...params };
                let queryParams = new URLSearchParams();
                Object.entries(finalParams).forEach(([key, value]) => {
                    if (value !== '' && value !== undefined) {
                        queryParams.append(key, value);
                    }
                });

                return `${PRODUCTS}?${queryParams.toString()}`;
            },
            providesTags: ['getProducts'],
        }),

        getProductsReview: builder.query({
            query: () => {
                return `${GET_PRODUCT_REVIEW}`;
            }
        }),

        getFilteredData: builder.query({
            query: (filters) => {
                const queryString = new URLSearchParams(filters).toString();
                return `${GET_FILTERED_DATA}?${queryString}`;
            },
        }),
    })
})

export const { useGetProductsQuery, useGetFilteredDataQuery } = productService;
