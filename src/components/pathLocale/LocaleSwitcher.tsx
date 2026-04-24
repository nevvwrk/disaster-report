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
        <div className="p-4 flex justify-end gap-2">
            <Link href={getPath('en')}>EN</Link>
            <Link href={getPath('th')}>TH</Link>
        </div>
    )
}