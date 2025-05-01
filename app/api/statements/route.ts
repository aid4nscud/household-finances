import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getIncomeStatements, deleteIncomeStatement } from '@/lib/db'

// GET endpoint to fetch statements with pagination
export async function GET(req: NextRequest) {
  try {
    // Get user session
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get statements using the db helper
    const { data, count } = await getIncomeStatements(session.user.id, page, limit)

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count! / limit)
      }
    })
  } catch (error) {
    console.error('API error in GET /api/statements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statements' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a statement
export async function DELETE(req: NextRequest) {
  try {
    // Get user session
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Statement ID is required' },
        { status: 400 }
      )
    }

    // Delete the statement
    await deleteIncomeStatement(id, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error in DELETE /api/statements:', error)
    return NextResponse.json(
      { error: 'Failed to delete statement' },
      { status: 500 }
    )
  }
} 