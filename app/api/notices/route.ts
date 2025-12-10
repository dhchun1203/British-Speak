import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * pageSize;

    // 검색 쿼리 빌더
    let query = supabase
      .from('notices')
      .select('*', { count: 'exact' });

    // 검색어가 있으면 제목에서 검색
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // 상단 고정 공지 먼저, 그 다음 최신순
    const { data, error, count } = await query
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return NextResponse.json({
      notices: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages,
    });
  } catch (error: any) {
    console.error('Error fetching notices:', error);
    
    if (error?.message?.includes('Missing Supabase')) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Please check SUPABASE_SETUP.md' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

// POST: 공지사항 작성 (관리자)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const body = await request.json();

    const { title, content, author = '관리자', is_pinned = false, attachments = [] } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('notices')
      .insert({
        title,
        content,
        author,
        is_pinned,
        attachments,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}






