export interface Book {
  id: number;
  create_at: Date;
  book_name: string;
  description: string;
  cover: string;
  link: string;
  progress: number;
  score: number;
}