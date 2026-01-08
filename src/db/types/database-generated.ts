import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Urls {
  id: Generated<number>;
  originalURL: string;
  shortURL: string;
  userId: string;
}

export interface DB {
  urls: Urls;
}
