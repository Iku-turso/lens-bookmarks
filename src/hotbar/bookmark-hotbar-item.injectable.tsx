import { ClickableDiv, Div, Span } from "@k8slens/element-components";
import { getHotbarItemKind, getHotbarItemKindInjectableBunch, type HotbarItemProps } from "@k8slens/hotbar-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { BookmarkIcon } from "../bookmark-icon";
import { describeBookmarkTarget } from "../bookmarks/bookmark";
import { BookmarkTargetGlyph } from "../bookmarks/bookmark-target-glyph";
import { bookmarksInjectable } from "../bookmarks/bookmarks.injectable";
import { openBookmarkInjectable } from "../bookmarks/open-bookmark.injectable";

// A bookmark in the hotbar. It persists the bookmark's id alone and follows the bookmark itself,
// so renaming a bookmark renames its hotbar item too.
export const bookmarkHotbarItemKind = getHotbarItemKind<{ readonly bookmarkId: string }>()("bookmark");

// One bookmark, one hotbar item: the item's id is derived from the bookmark's.
export const hotbarItemIdOfBookmark = (bookmarkId: string) => `bookmark(${bookmarkId})`;

const oneLine = { maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;

const BookmarkHotbarItem = observer(({ persistedData }: HotbarItemProps<typeof bookmarkHotbarItemKind>) => {
  const bookmark = useInject(bookmarksInjectable)()
    .current.get()
    .find((candidate) => candidate.id === persistedData.bookmarkId);

  const openBookmark = useInject(openBookmarkInjectable)();

  if (!bookmark) {
    return (
      <Div
        $width="full"
        $flex={{ horizontalAlign: "center", verticalAlign: "center" }}
        $color="textMuted"
        $tooltip="This bookmark was removed. Right-click to remove it from the hotbar."
      >
        <BookmarkIcon />
      </Div>
    );
  }

  return (
    <ClickableDiv
      $width="full"
      $flex={{ direction: "vertical", gap: "4xs", horizontalAlign: "center", verticalAlign: "center" }}
      $tooltip={`${bookmark.name} — ${describeBookmarkTarget(bookmark.target)}`}
      $onClick={() => openBookmark(bookmark)}
      aria-label={`Open bookmark ${bookmark.name}`}
    >
      <BookmarkTargetGlyph target={bookmark.target} $size="l" />
      {/* Bookmarks of the same kind of thing share a glyph, so the name tells them apart. */}
      <Span $font={{ size: "xxs", lineHeight: "none" }} $textAlign="center" $style={oneLine}>
        {bookmark.name}
      </Span>
    </ClickableDiv>
  );
});

export default getHotbarItemKindInjectableBunch({
  kind: bookmarkHotbarItemKind,
  Component: BookmarkHotbarItem,
});
