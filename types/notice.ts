export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
  views: number;
  is_pinned: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  url: string;
  size?: number;
}

export interface NoticeListResponse {
  notices: Notice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}




