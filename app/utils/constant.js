
export const POST = 'post'
export const GET = 'get'
export const PUT = 'put'
export const DELETE = 'delete'
export const IMAGE_BASE_URL = '/assets/images/'
export const ICON_BASE_URL = '/assets/icons/'
export const RESPONSIVE_BASE_URL = '/assets/responsive/'
export const API_URL = 'https://api.ityaashopping.com/api'

export const WEBSITE_BASE_URL='http://localhost:3000'
export const WEBSITE_BASE_URL_2='https://ityaashopping.com'


export const responsiveMenuItems = [
  { href: '/', icon: 'lucide-lab:home', label: 'Home' },
  // {href : '/vr-tryon', icon: 'twemoji:kimono', label: 'Try On' },
  { href: '/instafeed', icon: 'icon-park-solid:video-two', label: 'Instafeed' ,  },
  // { href: '/cart', icon: 'bi:cart-plus', label: 'Cart' },
  // { href: '/profile', icon: 'iconamoon:profile-light', label: 'Profile' },

];

// export const dealsSlides = [
//   {
//     id: 1,
//     title: 'Spring Sale',
//     discount: '30% OFF',
//     imageUrl: `${IMAGE_BASE_URL}slider1.png`,
//   },
//   {
//     id: 2,
//     title: 'Spring Sale',
//     discount: '30% OFF',
//     imageUrl: `${IMAGE_BASE_URL}slider2.png`,
//   },
//   {
//     id: 3,
//     title: 'Spring Sale',
//     discount: '30% OFF',
//     imageUrl: `${IMAGE_BASE_URL}slider1.png`,
//   },
//   {
//     id: 4,
//     title: 'Spring Sale',
//     discount: '30% OFF',
//     imageUrl: `${IMAGE_BASE_URL}slider3.png`,
//   },
// ];

// export const ourBrand = [
//   { image: `puma.png`, title: "Puma" },
//   { image: `uspolo.png`, title: "U.S. Polo Assn." },
//   { image: `zara.png`, title: "Zara" },
//   { image: `levis.png`, title: "Levi's" },
//   { image: `hnm.png`, title: "H&M" },
//   { image: `hnm.png`, title: "H&M" },
//   { image: `hnm.png`, title: "H&M" }
// ];


export const testimonials = [
  {
    _id: 1,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'Megen W.',
    position: 'UI Designer',
    rating: 5,
  },
  {
    _id: 2,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'James K.',
    position: 'Developer',
    rating: 4.5,
  },
  {
    _id: 3,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'James K.',
    position: 'Developer',
    rating: 4.5,
  },
  {
    _id: 4,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'James K.',
    position: 'Developer',
    rating: 1.5,
  },
  {
    _id: 5,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'James K.',
    position: 'Developer',
    rating: 2.5,
  },
  {
    _id: 6,
    image: `demo3.png`,
    message: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    name: 'James K.',
    position: 'Developer',
    rating: 3.5,
  },
  // Add more testimonials as needed
];

// export const privateSidebarMenu = [
//   { icon: "user", label: "Profile", path: "/profile" },
//   { icon: "order", label: "My Orders", path: "/orders" },
//   { icon: "gift", label: "Refer & Earn", path: "/refer" },
//   { icon: "wallet", label: "My Wallet", path: "/wallet/send" },
//   // { icon: "coupon", label: "Apply Coupon", path: "/coupon" },
//   { icon: "location", label: "Manage Address", path: "/address" },
//   // { icon: "chat", label: "Chat Setting", path: "/chat" },
//   { icon: "change-password", label: "Change Password", path: "/change-password" },
//   { icon: "policy", label: "Privacy Policy", path: "/privacy" },
//   { icon: "phone", label: "Help Center", path: "/help" },
//   { icon: "faq", label: "FAQ", path: "/faq" },
//   // { icon: "setting", label: "Settings", path: "/settings" },
// ];

export const privateSidebarMenus = [
  { icon: "order", label: "My Orders", path: "/orders" },
  // { icon: "gift", label: "Refer & Earn", path: "/refer" },
  // { icon: "wallet", label: "My Wallet", path: "/wallet/send" },
  // { icon: "coupon", label: "Apply Coupon", path: "/coupon" },
  { icon: "location", label: "Manage Address", path: "/address" },
  // { icon: "chat", label: "Chat Setting", path: "/chat" },
  // { icon: "change-password", label: "Change Password", path: "/change-password" },
  { icon: "policy", label: "Privacy Policy", path: "/privacy" },
  { icon: "phone", label: "Help Center", path: "/help" },
  { icon: "faq", label: "FAQ", path: "/faq" },
  // { icon: "setting", label: "Settings", path: "/settings" },
];

export const publicSidebarMenu = [
  { icon: "user", label: "Login", path: "/auth" },
  { icon: "order", label: "Home", path: "/" },
  { icon: "gift", label: "Shop", path: "/products" },
  // { icon: "wallet", label: "My Wallet", path: "/wallet/send" },
];


export const menuItems = [
  { name: 'Home', href: '/', icon: 'mdi:home', type: 'link' },
  { name: 'Shop', href: '/products', icon: 'mdi:shopping', type: 'link' },
  { 
    name: 'Deals', 
    href: '', 
    icon: 'mdi:tag', 
    type: 'dropdown', 
    subMenu: [
      { 
        name: 'Hot Deals', 
        href: '/deals/hot', 
        subMenu: [
          { name: 'Winter Sale', href: '/deals/hot/winter' },
          { name: 'Summer Sale', href: '/deals/hot/summer' },
        ]
      },
      { 
        name: 'Discounts', 
        href: '/deals/discounts', 
        subMenu: [
          { name: 'Up to 50% Off', href: '/deals/discounts/50' },
          { name: 'Buy 1 Get 1 Free', href: '/deals/discounts/bogo' },
        ]
      },
    ]
  },
  { name: 'Contact', href: '/contact', icon: 'mdi:contacts', type: 'link' },
];

export const menuIconsItem = [
  // { icon: 'lucide:heart', href: '/favorite', title: 'Favorite' },
  // {icon : <img src="/assets/images/tryon.gif" alt="tryon" width={30} height={30} /> , href: '/vr-products', title: 'VR Products' },
  {icon: 'icon-park-solid:video-two', href: '/instafeed', title: 'Instafeed' },
  { icon: 'lucide:wallet', href: '/wallet/send', title: 'Wallet' },
  { icon: 'ph:chat', href: '/chat', title: 'Chat' },
  { icon: 'bi:cart', href: '/cart', title: 'Cart' },
];

export const priceRange = { min: 1000, max: 5000 };

export const addressType = [
  { value: 'work', label: 'Work' },
  { value: 'home', label: 'Home' },
  { value: 'other', label: 'Other' },
];
