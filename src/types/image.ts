export type Album = {
  id: string;
  slug: string;
  name: string;
  drive_folder_id: string;
  sort_order: number;
  created_at: string;
  image_count: number;
};

export type ImageItem = {
  id: string;
  drive_file_id: string;
  album_id: string;
  direct_url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  created_at: string;
  image_sections?: { section_id: string }[];
};

export type Section = {
  id: string;
  key: string;
  name: string;
  created_at: string;
};