import 'react-toastify/dist/ReactToastify.css';
import "./styles/globals.scss";

import ReduxWrapper from "./redux-tookit/ReduxWrapper";
import { ToastContainer } from "react-toastify";
import { Satisfy, Roboto } from '@next/font/google';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import PinCode from './component/PinCode';

export const metadata = {
  title: "Stattionex",
  description: "Stattionex",
  icons: {
    icon: "/favicon.png",
  },
};

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   variable: '--font-roboto',
// });

// const satisfy = Satisfy({
//   subsets: ['latin'],
//   weight: '400',
//   variable: '--font-satisfy',
// });

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      {/* <body className={`${roboto.variable} ${satisfy.variable} font-sans`} > */}
      <body >
        <ErrorBoundary>
        <ReduxWrapper>
          <PinCode/>
          {children}
          
        </ReduxWrapper>
        </ErrorBoundary>
        <ToastContainer autoClose={2000} />
      </body>
    </html>
  );
}
