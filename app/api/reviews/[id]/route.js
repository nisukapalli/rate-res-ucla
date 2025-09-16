import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
    try {
        const id = Number(params?.id)
        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid review id' }, { status: 400 })
        }

        const body = await request.json()
        const {
            overall,
            location,
            distance,
            social,
            noise,
            clean,
            value,
            text,
        } = body || {}

        const review = await prisma.review.findUnique({ where: { id } })
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        const ratings = [overall, location, distance, social, noise, clean, value]
        if (ratings.some(rating => rating < 1 || rating > 5)) {
            return NextResponse.json({ error: 'All ratings must be between 1 and 5' }, { status: 400 })
        }

        const updated = await prisma.review.update({
            where: { id },
            data: {
                overall,
                location,
                distance,
                social,
                noise,
                clean,
                value,
                text,
            }
        })

        return NextResponse.json(updated)

    } catch (error) {
        console.log('Failed to update review', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = Number(params?.id)
        if (!id || Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid review id' }, { status: 400 })
        }

        const review = await prisma.review.findUnique({ where: { id } })
        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        await prisma.review.delete({ where: { id } })
        return NextResponse.json({ success: true })
        
    } catch (error) {
        console.log('Failed to delete review', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}


