import { DELETE, GET, POST, PUT } from "@/app/utils/constant";
import {
  CREATE_CUSTOMER,
  CREATE_CUSTOMER_NEW_ADDRESS,
  DELETE_CART,
  DELETE_CUSTOMER_ADDRESS,
  GET_CART,
  GET_CHAT_USERS,
  GET_CUSTOMER_ADDRESS,
  GET_TRANSACTION_HISTORY,
  LOGIN_CUSTOMER,
  LOGOUT_CUSTOMER,
  UPDATE_CART,
  UPDATE_CUSTOMER,
  UPDATE_CUSTOMER_ADDRESS,
  ADD_WALLET,
  GET_WALLET,
  PRODUCTS,
  ADD_CART,
  GET_MY_ORDERS,
  CANCEL_ORDER,
  REVIEW,
  ORDER,
  GET_CHAT_HISTORY,
  GET_CHAT_MESSAGES,
  POST_CHAT_MESSAGES,
  POST_CREATE_GROUP,
  POST_CREATE_CHAT,
  BLOCK,
  ACCEPT,
  BLOCK_REPORT,
  FORGOT_PASSWORD_EMAIL_CONFIRM,
  FORGOT_PASSWORD_OTP_CONFIRM,
  FORGOT_PASSWORD_CHANGE,
  GET_SEARCH,
  GET_ALL_PRODUCT_CATEGORY,
  CHANGE_PASSWORD,
  FORGOT_USERNAME,
  GET_SINGLE_PRODUCT,
  SEND_MONEY,
  WALLET_USERS,
  GET_CUSTOMER,
  INVOICE,
  ADD_USER_EXISTING_GROUP,
  GET_POSTS,
  CREATE_POST,
  LIKE_UNLIKE,
  ADD_COMMENT,
  CREATE_CUSTOMER_WITH_REFERRAL,
  RETURN_ORDER,
  TRACK_ORDER,
  CREATE_ORDER,
  WEB_HOOK,
  GET_ALL_POSTS,
  GET_OUR_COLLECTIONS,
  GET_TOP_USERS,
  GET_CUSTOMER_OTP,
  VERIFY_OTP,
  COMPLETE_PROFILE,
  VERIFY_PINCODE,
  GET_PINCODE,
  EXPLORE_CATEGORY,
  GET_PRODUCTS_TAGS,
  GETSUBCATEGORY,
  APPLY_COUPON,
} from "@/app/utils/endPoint";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../common/headers";
import { trackDynamicDataAccessed } from "next/dist/server/app-render/dynamic-rendering";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: [
    "tagProducts",
    "exploreCategory",
    "getPinCode",
    "pinCode",
    "completeProfile",
    "customerOtp",
    "webhook",
    "invoice",
    "customer",
    "address",
    "transaction",
    "chatUsers",
    "cart",
    "wallet",
    "getWallet",
    "singleProduct",
    "addcart",
    "myOrders",
    "cancelOrder",
    "review",
    "order",
    "chatHistory",
    "block",
    "chatMessages",
    "chat",
    "createGroup",
    "createChat",
    "acceptChat",
    "blockReport",
    "forgotPassword",
    "otp",
    "passwordChange",
    "search",
    "category",
    "changePassword",
    "forgotUserName",
    "sendMoney",
    "walletUsers",
    "profile",
    "addusers",
    "posts",
    "createPost",
    "likeUnlike",
    "addComment",
    "getAllPosts",
    "products",
    "topUsers",
    "getSubCategory",
    "coupon",
  ],
  endpoints: (builder) => ({
    loginCustomer: builder.mutation({
      query: (body) => {
        return {
          url: LOGIN_CUSTOMER,
          method: POST,
          body,
        };
      },
    }),

    changePassword: builder.mutation({
      query: (body) => {
        return {
          url: CHANGE_PASSWORD,
          method: POST,
          body,
        };
      },
    }),

    createCustomer: builder.mutation({
      query: (body) => {
        console.log("body", body);
        
        return {
          url: body.referalCode ? CREATE_CUSTOMER_WITH_REFERRAL : CREATE_CUSTOMER,
          method: POST,
          body,
        };
      },
    }),

    updateCustomer: builder.mutation({
      query: (data) => {
        return {
          url: `${UPDATE_CUSTOMER}`,
          method: PUT,
          headers: {
            'Content-Type': 'application/json', // Ensure JSON headers are set
        },
        body: JSON.stringify(data),
        };
      },
    }),

    logoutCustomer: builder.mutation({
      query: (body) => {
        return {
          url: LOGOUT_CUSTOMER,
          method: POST,
          body,
        };
      },
    }),

    getAddress: builder.query({
      query: () => ({
        url: `${GET_CUSTOMER_ADDRESS}`,
        method: GET,
      }),
      providesTags: ["address"],
    }),

    updateAddress: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${UPDATE_CUSTOMER_ADDRESS}?id=${id}`,
        method: PUT,
        body,
      }),
      invalidatesTags: ["address"],
    }),

    createNewAddress: builder.mutation({
      query: (body) => {
        return {
          url: CREATE_CUSTOMER_NEW_ADDRESS,
          method: POST,
          body,
        };
      },
      invalidatesTags: ["address"],
    }),

    deleteAddress: builder.mutation({
      query: ({ id }) => {
        return {
          url: `${DELETE_CUSTOMER_ADDRESS}?id=${id}`,
          method: DELETE,
        };
      },
      invalidatesTags: ["address"],
    }),

    getCart: builder.query({
      query: () => ({
        url: `${GET_CART}`,
        method: GET,
      }),

      providesTags: ["cart"],
    }),

    updateCart: builder.mutation({
      query: (body) => ({
        url: `${UPDATE_CART}`, // Assuming the cart update needs an id
        method: "PUT",
        body,
      }),
      invalidatesTags: ["cart"], // Invalidate the cart tag so the cart data refreshes after update
    }),

    deleteCart: builder.mutation({
      query: (body) => ({
        url: `${DELETE_CART}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["cart"], // Invalidate the 'cart' tag to refresh the cart data after deletion
    }),

   

    getSingleProduct: builder.query({
      query: ({ id }) => ({
        url: `${GET_SINGLE_PRODUCT}?id=${id}`,
        method: GET,
      }),
      providesTags: ["singleProduct"], // Added a tag for chat users
    }),

    getExploreCategory : builder.query({
      query: () => ({
        url: `${EXPLORE_CATEGORY}`,
        method : GET,
      }),
      providesTags: ["exploreCategory"],
    }),

    getProductsTag: builder.query({
      query:({tag}) => ({
        url: `${GET_PRODUCTS_TAGS}?tags=${tag}`,
        method: GET,
      }),
      providesTags: ["tagProducts"]
    }),

    addtoCart: builder.mutation({
      query: (body) => ({
        url: `${ADD_CART}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["addcart"], // Invalidate the 'cart' tag to refresh the cart data after deletion
    }),

    
    addUsersExisting: builder.mutation({
      query: (body) => ({
        url: `${ADD_USER_EXISTING_GROUP}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["addusers"], // Invalidate the 'cart' tag to refresh the cart data after deletion
    }),


    getMyOrders: builder.query({
      query: () => ({
        url: `${GET_MY_ORDERS}`,
        method: GET,
      }),
      providesTags: ["myOrders"],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, ...body}) => ({
        url: `${CANCEL_ORDER}?id=${orderId}`,
        method: "POST",
        body
      }),
      invalidatesTags: ["myOrders"],
    }),

    returnOrder: builder.mutation({
      query: (body) => ({
        url: `${RETURN_ORDER}`,
        method: "POST",
        body
      }),
      invalidatesTags: ["myOrders"],
    }),


    getInvoice: builder.query({
      query: ({ invoiceId }) => {
        console.log(`Fetching invoice with ID: ${invoiceId}`);
        return {
          url: `${INVOICE}?invoiceId=${invoiceId}`,
          method: GET,
        };
      },
      invalidatesTags: ["invoice"],
    }),

    trackOrder: builder.query({
      query: ({ id }) => ({
        url: `${TRACK_ORDER}?orderId=${id}`,
        method: GET,
      }),
      providesTags: ["trackOrder"],
    }),
    
    productReview: builder.mutation({
      query: (body) => ({
        url: `${REVIEW}`,
        method: "POST",
        body,
      }),
      providesTags: ["review"],
    }),

    order: builder.mutation({
      query: (body) => ({
        url: `${ORDER}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["order"],
    }),

    createOrder: builder.mutation({
      query: (body) => ({
        url: `${CREATE_ORDER}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["order"],
    }),

    webHook : builder.mutation({
      query: (body) => ({
        url: `${WEB_HOOK}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["webhook"],
    }),

    forgotPasswordEmail: builder.mutation({
      query: (body) => ({
        url: `${FORGOT_PASSWORD_EMAIL_CONFIRM}`,
        method: "POST",
        body,
      }),
      providesTags: ["forgotPassword"],
    }),

    loginEmail : builder.mutation({
      query: (body) => ({
        url: `${GET_CUSTOMER_OTP}`,
        method: "POST",
        body,
      }),
      providesTags: ["customerOtp"],
    }),

    otpVerification : builder.mutation({
      query: (body) => ({
        url: `${VERIFY_OTP}`,
        method: "POST",
        body,
      }),
      providesTags: ["otp"]
    }),

    completeProfile: builder.mutation({
      query: (body) => ({
        url: `${COMPLETE_PROFILE}`,
        method: "POST",
        body
      }),
      providesTags: ["completeProfile"]
    }),

    pinCodeVerification : builder.mutation({
      query: (body) => ({
        url: `${VERIFY_PINCODE}`,
        method: "POST",
        body,
      }),
      providesTags: ["pinCode"]
    }),

    getPinCode : builder.query({
      query : () => ({
        url: `${GET_PINCODE}`,
        method: "GET"
      }),
      providesTags: ["getPinCode"]
    }),

    getSubCategory : builder.query({
      query : () => ({
        url: `${GETSUBCATEGORY}`,
        method: "GET"
      }),
      providesTags: ["getSubCategory"]
    }),

    forgotPasswordOTP: builder.mutation({
      query: (body) => ({
        url: `${FORGOT_PASSWORD_OTP_CONFIRM}`,
        method: "POST",
        body,
      }),
      providesTags: ["otp"],
    }),

    forgotPasswordChange: builder.mutation({
      query: (body) => ({
        url: `${FORGOT_PASSWORD_CHANGE}`,
        method: "POST",
        body,
      }),
      providesTags: ["passwordChange"],
    }),

    getSearchProduct: builder.query({
      query: () => ({
        url: `${GET_SEARCH}`,
        method: GET,
      }),
      providesTags: ["search"],
    }),

    getAllProductcategory: builder.query({
      query: () => ({
        url:`${GET_ALL_PRODUCT_CATEGORY}`,
        method: GET,
      }),
      providesTags: ["category"]
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: `${CHANGE_PASSWORD}`,
        method: "POST",
        body,
      }),
      providesTags: ["changePassword"],
    }),

    forgotUserName: builder.mutation({
      query: (body) => ({
        url: `${FORGOT_USERNAME}`,
        method: "POST",
        body,
      }),
      providesTags: ["forgotUserName"],
    }),

    getProfile : builder.query({
      query: () => ({
        url: `${GET_CUSTOMER}`,
        method: GET,
      }),
      providesTags: ["profile"],
    }),

    getCoupon : builder.query({
      query: () => ({
        url: `${APPLY_COUPON}`,
        method: GET,
      }),
      providesTags: ["coupon"],
    }),

  }),

  
});

export const {
  useGetInvoiceQuery,
  useTrackOrderQuery,
  useGetTopUsersQuery,
  useLoginCustomerMutation,
  useCreateCustomerMutation,
  useLogoutCustomerMutation,
  useUpdateCustomerMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useCreateNewAddressMutation,
  useGetCartQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetSingleProductQuery,
  useAddtoCartMutation,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useProductReviewMutation,
  useOrderMutation,
  useForgotPasswordEmailMutation,
  useForgotPasswordOTPMutation,
  useForgotPasswordChangeMutation,
  useGetSearchProductQuery,
  useGetAllProductcategoryQuery,
  useChangePasswordMutation,
  useForgotUserNameMutation,
  useAddUsersExistingMutation,
  useGetProfileQuery,
  useCreateOrderMutation,
  useWebHookMutation,
  useLoginEmailMutation,
  useOtpVerificationMutation,
  useCompleteProfileMutation,
  usePinCodeVerificationMutation,
  useGetPinCodeQuery,
  useGetExploreCategoryQuery,
  useGetProductsTagQuery,
  useGetSubCategoryQuery,
  useGetCouponQuery,
} = authApi;
