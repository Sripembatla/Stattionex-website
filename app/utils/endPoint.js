export const CREATE_CUSTOMER = "/v1/customer/register";
export const CREATE_CUSTOMER_WITH_REFERRAL = "/v1/customer/registerwithrefcode";
export const LOGIN_CUSTOMER = "/v1/customer/login";
export const LOGOUT_CUSTOMER = "/v1/user/logout";
export const GET_CUSTOMER = "/v1/customer/getprofile";

// fogot Password
export const FORGOT_PASSWORD_EMAIL_CONFIRM = "/v1/auth/forgot/password";
export const FORGOT_PASSWORD_OTP_CONFIRM = "/v1/auth/forgot/password/verify";
export const FORGOT_PASSWORD_CHANGE = "/v1/auth/forgot/password/change";


export const GET_HOME_DEALS = "/v1/customer/getalldeals";
export const GET_BRANDS = "/v1/brand/getall";











export const GET_PRODUCT_REVIEW = "/v1/review";

// cart




// export const GET_MY_ORDERS_NEW = "/v2/order/getmyorders";

export const REVIEW = "/v1/product/review/add";




export const RETURN_ORDER = "/v1/customer/order/return";
// export const ORDER = "/v2/order/create";


export const GLOBAL_SEARCH = "/v1/product/search/global";





export const GET_SEARCH = "/v1/product/search-suggestions";

export const GET_ALL_PRODUCT_CATEGORY = "/v1/category";

export const CHANGE_PASSWORD = "/v1/auth/resetpassword";

export const FORGOT_USERNAME = "/v1/auth/forgot/username";

export const INVOICE = "/v1/customer/invoice/get";



export const CREATE_ORDER ="v1/customer/wallet/createrazorpayorder";

export const WEB_HOOK = "v1/customer/wallet/verifyrazorpaypayment";




//login
export const GET_CUSTOMER_OTP = "/v1/customer/request-otp";
export const VERIFY_OTP = "/v1/customer/verify-otp";
export const VERIFY_PINCODE = "v1/customer/pincode/verify";
export const GET_PINCODE = "/v1/customer/pincode/get";
//product
export const PRODUCTS = "/v1/product/getall";
export const GET_SINGLE_PRODUCT = "/v1/product/getsingle";
export const GET_FILTERED_DATA = "/v1/product/getfilterdata";
//home
export const GET_HOME_BANNER = "/v1/customer/banner/get";
export const EXPLORE_CATEGORY = "/v1/product/homepage/getallcategories";
export const GET_PRODUCTS_TAGS = "/v1/product/homepage/getproducts";
export const GETSUBCATEGORY = "/v1/product/homepage/getallcategories";
// address
export const CREATE_CUSTOMER_NEW_ADDRESS = "/v1/customer/address/add";
export const GET_CUSTOMER_ADDRESS = "/v1/customer/address/get";
export const UPDATE_CUSTOMER_ADDRESS = "/v1/customer/address/update";
export const DELETE_CUSTOMER_ADDRESS = "/v1/customer/address/delete";
//profile
export const UPDATE_CUSTOMER = "/v1/customer/editprofile";
export const COMPLETE_PROFILE = "/v1/customer/complete-profile";
//cart
export const ADD_CART = "/v1/customer/cart/add";
export const UPDATE_CART = "/v1/customer/cart/update";
export const DELETE_CART = "/v1/customer/cart/removeitem";
export const GET_CART = "/v1/customer/cart/get";
//order
export const ORDER = "/v1/order/create";
export const CANCEL_ORDER = "/v1/order/cancel";
export const GET_MY_ORDERS = "/v1/order/get";
export const TRACK_ORDER = "/v1/order/trackstatus";
export const APPLY_COUPON = "/v1/customer/coupon/get";






