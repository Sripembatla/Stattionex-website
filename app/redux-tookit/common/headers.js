import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: "/api",
    // credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        headers.set('authorisedKey', process.env.NEXT_PUBLIC_AUTHORISED_KEY);
        const accessToken = getState().auth.accessToken
        // console.log('Headers', accessToken);
        if(accessToken){
            headers.set('accessToken', `${accessToken}`)
        }
        return headers
    }
})