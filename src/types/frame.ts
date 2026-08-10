export type Frame = {
  id: string;
  name: string;
  driveFileId: string;
  directUrl: string;
  width: number | null;
  height: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string | null;
};

export type FrameRow = {
  id: string;
  name: string;
  drive_file_id: string;
  direct_url: string;
  width: number | null;
  height: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
};

export function mapFrameRow(row: FrameRow): Frame {
  return {
    id: row.id,
    name: row.name,
    driveFileId: row.drive_file_id,
    directUrl: row.direct_url,
    width: row.width,
    height: row.height,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}