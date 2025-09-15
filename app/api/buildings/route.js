import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const buildings = await prisma.building.findMany()
        return NextResponse.json(buildings)

    } catch (error) {
        console.log("Failed to fetch buildings", error)
        return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 })
    }
}
