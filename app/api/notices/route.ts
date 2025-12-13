import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createErrorResponse, createSuccessResponse, parsePaginationParams, createPaginatedResponse } from '@/lib/utils/api';

// GET: 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    
    const { page, pageSize, offset } = parsePaginationParams(searchParams, 1, 10);
    const search = searchParams.get('search') || '';

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

    const paginatedResponse = createPaginatedResponse(data || [], count || 0, page, pageSize);
    return createSuccessResponse({
      notices: paginatedResponse.data,
      total: paginatedResponse.total,
      page: paginatedResponse.page,
      pageSize: paginatedResponse.pageSize,
      totalPages: paginatedResponse.totalPages,
    });
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch notices');
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








