// types/video.ts
export interface Video {
  id: string;
  title: string;
  description: string | null;
  youtubeId: string;
  thumbnailUrl: string | null;
  duration: number | null;
  targetRole: string[];
  minAge: number | null;
  maxAge: number | null;
  order: number;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string | null;
  };
  test: {
    id: string;
  } | null;
}

export interface VideoCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoStats {
  totalVideos: number;
  activeVideos: number;
  totalViews: number;
  videosWithTests: number;
}
