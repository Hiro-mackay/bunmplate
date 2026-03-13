export interface Post {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
