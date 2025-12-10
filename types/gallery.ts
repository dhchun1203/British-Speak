export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
  order?: number;
}

export type GalleryCategory = "전체" | "수업" | "이벤트" | "체험활동" | "기타";






