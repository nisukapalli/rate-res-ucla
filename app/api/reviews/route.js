import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        const { building, overall, location, distance, social, noise, clean, value, text, authorId } = await request.json()
        
        if (!building || !overall || !location || !distance || !social || !noise || !clean || !value || !authorId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        
        const ratings = [overall, location, distance, social, noise, clean, value]
        if (ratings.some(rating => rating < 1 || rating > 5)) {
            return NextResponse.json({ error: 'All ratings must be between 1 and 5' }, { status: 400 })
        }
        
        const review = await prisma.review.create({
            data: {
                building,
                overall,
                location,
                distance,
                social,
                noise,
                clean,
                value,
                text: text || null,
                authorId
            },
            include: {
                author: { select: { username: true, class: true } }
            }
        })
        
        return NextResponse.json(review, { status: 201 })
        
    } catch (error) {
        console.log("Failed to create review", error)
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }
}
