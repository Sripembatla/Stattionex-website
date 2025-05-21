'use client'
import Private from "../layout/Private";
import './style.scss';
import { ICON_BASE_URL, privateSidebarMenu, privateSidebarMenus } from "../utils/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function UserDashboard({ children }) {
    const pathname = usePathname();
    return (
        <Private>
            <ToastContainer />
            <div className="UserDashboard">
                <div className="container">
                    <div className="sidebar">
                        <ul>
                            {privateSidebarMenus.map((item, index) => (
                                <li key={index} className={pathname === item.path ? "active" : ""}>
                                    <Link href={item.path}>
                                        <Image src={`${ICON_BASE_URL}/profile/${item.icon}.svg`} width={25} height={25} alt={item.label} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="main-content">
                        {children}
                    </div>
                </div>
            </div>
        </Private>
    );
}