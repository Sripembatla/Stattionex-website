import { ICON_BASE_URL } from '@/app/utils/constant'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Icons = ({ iconName, linkUrl = '#', width = 40, height = 40, altText = 'Icon', target, rel = 'noopener noreferrer' }) => {
    return (
        <Link href={linkUrl} target={target} rel={rel}>
            <Image
                src={`${ICON_BASE_URL}${iconName}.svg`}
                width={width}
                height={height}
                alt={altText}
            />
        </Link>
    )
}

export default Icons;
