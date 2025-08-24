"use client"

import Link from "next/link";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        path: "/app/dashboard"
    },
    {
        label: "Account",
        path: "/app/account"
    }
]

export default function AppHeader() {

    const activePathname = usePathname()
    return (
        <header className="flex justify-between">
            <Logo />
            <nav>
                <ul className="flex gap-2 text-xs items-center border-b border-white/10 py-2">
                    {
                        routes.map((route) => {
                            return (<li key={route.path}>
                                <Link className={cn(" rounded-sm text-white/70 px-2 py-1 hover:text-white focus:text-white transition",
                                    {
                                        " bg-black/10 text-white": activePathname === route.path
                                    }
                                )} href={route.path}>{route.label}</Link>
                            </li>)
                        })
                    }
                </ul>
            </nav>
        </header>
    )
}
