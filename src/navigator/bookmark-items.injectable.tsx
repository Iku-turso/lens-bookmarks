import { NavigatorItemIcon, NavigatorItemLabel, NavigatorLeafIndicator } from "@k8slens/navigator-components";
import { getNavigatorItemKindInjectableBunch, type NavigatorItemProps } from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { computed } from "mobx";
import { type BookmarkTarget, describeBookmarkTarget, navigatorItemCanBeOpened } from "../bookmarks/bookmark";
import { BookmarkTargetGlyph } from "../bookmarks/bookmark-target-glyph";
import { bookmarksInjectable } from "../bookmarks/bookmarks.injectable";
import { openBookmarkInjectable } from "../bookmarks/open-bookmark.injectable";
import { type BookmarkItem, bookmarkKind, bookmarksFolderId, bookmarksFolderKind } from "./navigator-kinds";

const canBeOpened = (target: BookmarkTarget) => target.type !== "navigator-item" || navigatorItemCanBeOpened(target.kindId);

const BookmarkRow = ({ item }: NavigatorItemProps<BookmarkItem, typeof bookmarksFolderKind>) => {
  const openBookmark = useInject(openBookmarkInjectable)();

  return (
    <>
      <NavigatorLeafIndicator />
      <NavigatorItemIcon>
        <BookmarkTargetGlyph target={item.bookmark.target} />
      </NavigatorItemIcon>
      <NavigatorItemLabel
        onClick={() => openBookmark(item.bookmark)}
        $color={canBeOpened(item.bookmark.target) ? undefined : "textMuted"}
        $tooltip={`${item.name} — ${describeBookmarkTarget(item.bookmark.target)}`}
      >
        {item.name}
      </NavigatorItemLabel>
    </>
  );
};

export default getNavigatorItemKindInjectableBunch({
  kind: bookmarkKind,
  parentKind: bookmarksFolderKind,
  description: "A bookmark the user named, under the Bookmarks item of the navigator.",

  items: {
    instantiate: (di) => {
      const bookmarks = di.inject(bookmarksInjectable)();

      return async (folderId) => {
        const all = await bookmarks.get();

        return computed(() =>
          folderId !== bookmarksFolderId
            ? []
            : // No order number: siblings without one are ordered by name.
              all.map((bookmark): BookmarkItem => ({ id: bookmark.id, name: bookmark.name, bookmark })),
        );
      };
    },
  },

  Component: BookmarkRow,
});
