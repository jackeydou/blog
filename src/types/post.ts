export interface PostHeader {
  title: string;
  tags: string[];
  slug: string;
  date: string;
  pinned?: boolean;
  summary?: string;
  draft?: boolean;
}
