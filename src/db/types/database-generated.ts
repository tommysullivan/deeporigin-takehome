import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Clicks {
  id: Generated<number>;
  timestamp: Generated<Timestamp>;
  url_id: number;
}

export interface Urls {
  id: Generated<number>;
  originalURL: string;
  shortURLSlug: string;
  userId: string | null;
}

export interface DB {
  clicks: Clicks;
  urls: Urls;
}
