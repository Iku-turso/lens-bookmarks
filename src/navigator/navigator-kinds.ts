import { getNavigatorItemKind } from "@k8slens/navigator-contracts";
import type { Bookmark } from "../bookmarks/bookmark";

export interface BookmarksFolderItem {
  readonly id: string;
  readonly name: string;
}

export interface BookmarkItem {
  readonly id: string;
  readonly name: string;
  readonly bookmark: Bookmark;
}

export const bookmarksFolderId = "bookmarks";

// The one "Bookmarks" item at the top of the navigator, and the bookmarks under it.
export const bookmarksFolderKind = getNavigatorItemKind<BookmarksFolderItem, []>()("bookmarks");
export const bookmarkKind = getNavigatorItemKind<BookmarkItem, [folderId: string]>()("bookmark");
