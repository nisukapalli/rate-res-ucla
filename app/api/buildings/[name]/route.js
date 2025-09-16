import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(_request, { params }) {
    try {
        const name = params?.name
        if (!name) {
            return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
        }

        const building = await prisma.building.findUnique({ where: { name } })
        if (!building) {
            return NextResponse.json({ error: 'Building does not exist' }, { status: 404 })
        }

        const reviews = await prisma.review.findMany({
            where: { building: name },
            include: { author: { select: { username: true, class: true } } },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({
            building,
            reviews
        })

    } catch (error) {
        console.log("Failed to fetch building", error)
        return NextResponse.json({ error: 'Failed to fetch building' }, { status: 500 })
    }
}
