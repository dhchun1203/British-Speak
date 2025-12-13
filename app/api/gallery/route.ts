import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/api';

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return createSuccessResponse(data || []);
  } catch (error) {
    return createErrorResponse(error, 'Failed to fetch gallery');
  }
}

// POST: 이미지 업로드
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const formData = await request.formData();

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }

    // 파일 확장자 추출
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // 파일 검증
    const { isValidImageFile, isValidFileSize } = await import('@/lib/utils/validation');
    
    if (!fileExt || !isValidImageFile(file.name)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp' },
        { status: 400 }
      );
    }

    if (!isValidFileSize(file.size, 10)) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // 고유한 파일명 생성
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // Supabase Storage에 이미지 업로드
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image to storage' },
        { status: 500 }
      );
    }

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    // 최대 order 값 가져오기
    const { data: maxOrderData } = await supabase
      .from('gallery')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = maxOrderData?.order !== null && maxOrderData?.order !== undefined
      ? (maxOrderData.order + 1)
      : 0;

    // 갤러리 테이블에 메타데이터 저장
    const { data: galleryData, error: dbError } = await supabase
      .from('gallery')
      .insert({
        title,
        image_url: publicUrl,
        category,
        order: nextOrder,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // 업로드된 파일 삭제 (롤백)
      await supabase.storage
        .from('gallery-images')
        .remove([filePath]);
      
      return NextResponse.json(
        { error: 'Failed to save gallery metadata' },
        { status: 500 }
      );
    }

    return createSuccessResponse(galleryData, 201);
  } catch (error) {
    return createErrorResponse(error, 'Failed to upload image');
  }
}

