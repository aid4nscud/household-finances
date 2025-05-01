import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getIncomeStatementById, deleteIncomeStatement } from '@/lib/db'

// GET endpoint to fetch a single statement by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get statement ID from route params
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Statement ID is required' },
        { status: 400 }
      )
    }

    // Get statement using the db helper
    const data = await getIncomeStatementById(id, session.user.id)

    return NextResponse.json({ data })
  } catch (error) {
    console.error(`API error in GET /api/statements/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch statement' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove a statement by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get statement ID from route params
    const { id } = params

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
    console.error(`API error in DELETE /api/statements/${params.id}:`, error)
    return NextResponse.json(
      { error: 'Failed to delete statement' },
      { status: 500 }
    )
  }
} 