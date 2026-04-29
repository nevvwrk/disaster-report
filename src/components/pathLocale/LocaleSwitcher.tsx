"use client"
import Link from 'next/link'

import { usePathname } from "next/navigation"

export default function LocaleSwticher() {
    const pathname = usePathname();

    const getPath = (locale: string) => {
        const segments = pathname.split('/');

        if (segments.length < 2) return `/${locale}`
        
        segments[1] = locale
        return segments.join("/");
    }
    return (
        <nav className="p-4 flex justify-between gap-2">
            <Link href="/th" className="text-xl font-bold p-2 bg-green-500 rounded text-white">Diaster reports system</Link>
            <div className="flex gap-4">
                <Link href={getPath('en')}>EN</Link>
                <Link href={getPath('th')}>TH</Link>
            </div>
        </nav>
    )
}