import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../common/headers";
import { GET_BRANDS, GET_HOME_BANNER, GET_HOME_DEALS, GET_OUR_COLLECTIONS } from "@/app/utils/endPoint";

export const homeService = createApi({
    reducerPath: 'homeService',
    baseQuery,
    tagTypes: ['banner', 'deals', 'brand'],
    endpoints: (builder) => ({
        getHomeBanner: builder.query({
            query: () => {
                return{
                    url: GET_HOME_BANNER,
                    method: "GET",
                };
            },
        }),

        getDeals: builder.query({
            query: ({body}) => {
                return {
                    url: GET_HOME_DEALS,
                    method: "GET",
                    body
                };
            },
        }),

        getBrands: builder.query({
            query: () => {
                return `${GET_BRANDS}`;
            },
        }),

        getOurCollection : builder.query({
            query: () => {
                return `${GET_OUR_COLLECTIONS}`;  
            },
        }),

    })
})


export const {useGetHomeBannerQuery, useGetDealsQuery, useGetBrandsQuery, useGetOurCollectionQuery} = homeService;