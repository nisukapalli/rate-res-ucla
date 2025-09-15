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

export async function POST(request) {
    try {
        const { name, address, type } = await request.json()
        const building = await prisma.building.create({ data: { name, address, type } })
        return NextResponse.json(building)
    } catch (error) {
        console.log("Failed to create building", error)
        return NextResponse.json({ error: 'Failed to create building' }, { status: 500 })
    }
}