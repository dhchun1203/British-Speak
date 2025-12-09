import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { NextRequest } from 'next/server';

// DELETE: 이미지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // 먼저 이미지 정보 가져오기 (Storage에서 삭제하기 위해)
    const { data: galleryItem, error: fetchError } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError || !galleryItem) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Storage에서 파일 삭제
    if (galleryItem.image_url) {
      // URL에서 파일 경로 추출
      const urlParts = galleryItem.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `gallery/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Storage 삭제 실패해도 DB는 삭제 진행 (이미지가 없을 수 있음)
      }
    }

    // 데이터베이스에서 레코드 삭제
    const { error: deleteError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete image from database' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// PATCH: 이미지 정보 수정 (제목, 카테고리, 순서)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const id = params.id;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (body.title !== undefined) {
      updateData.title = body.title;
    }

    if (body.category !== undefined) {
      updateData.category = body.category;
    }

    if (body.order !== undefined) {
      updateData.order = body.order;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}




