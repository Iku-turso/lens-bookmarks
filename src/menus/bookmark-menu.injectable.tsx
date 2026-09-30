import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import { BookmarkRemoveIcon, EditIcon, HotbarIcon, OpenInBrowserIcon } from "@k8slens/icon";
import {
  getNavigatorItemMenuItemInjectableBunch,
  navigatorItemDropDownMenuOrderNumbers,
  type NavigatorItemOfKind,
  useItem,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";
import { openBookmarkInjectable } from "../bookmarks/open-bookmark.injectable";
import { bookmarkInHotbarInjectable } from "../hotbar/bookmark-in-hotbar.injectable";
import { bookmarkKind } from "../navigator/navigator-kinds";

type BookmarkMenuProps = { data: NavigatorItemOfKind<typeof bookmarkKind> };

const OpenBookmark = ({ data }: BookmarkMenuProps) => {
  const item = useItem(data.kind, ...data.ids);
  const openBookmark = useInject(openBookmarkInjectable)();

  return (
    <DropDownMenuItemRow Icon={OpenInBrowserIcon} $enabled={!!item} $onClick={() => item && openBookmark(item.bookmark)}>
      Open
    </DropDownMenuItemRow>
  );
};

const EditBookmark = ({ data }: BookmarkMenuProps) => {
  const item = useItem(data.kind, ...data.ids);
  const { editBookmark } = useInject(bookmarkActionsInjectable)();

  return (
    <DropDownMenuItemRow Icon={EditIcon} $enabled={!!item} $onClick={() => item && editBookmark(item.bookmark)}>
      {item?.bookmark.target.type === "url" ? "Edit…" : "Rename…"}
    </DropDownMenuItemRow>
  );
};

const RemoveBookmark = ({ data }: BookmarkMenuProps) => {
  const item = useItem(data.kind, ...data.ids);
  const { removeBookmark } = useInject(bookmarkActionsInjectable)();

  return (
    <DropDownMenuItemRow Icon={BookmarkRemoveIcon} $enabled={!!item} $onClick={() => item && removeBookmark(item.bookmark)}>
      Remove bookmark
    </DropDownMenuItemRow>
  );
};

// Says which it will do, following the user pinning and unpinning the bookmark elsewhere.
const ToggleBookmarkInHotbar = observer(({ data }: BookmarkMenuProps) => {
  const bookmarkId = data.ids[data.ids.length - 1];
  const { isInHotbar, toggle } = useInject(bookmarkInHotbarInjectable)();

  return (
    <DropDownMenuItemRow Icon={HotbarIcon} $onClick={() => toggle(bookmarkId)}>
      {isInHotbar(bookmarkId).get() ? "Remove from hotbar" : "Add to hotbar"}
    </DropDownMenuItemRow>
  );
});

export const openBookmarkMenuItem = getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-menu-open-bookmark",
  forItemsOfKind: bookmarkKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.settings,
  Component: OpenBookmark,
});

export const editBookmarkMenuItem = getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-menu-edit-bookmark",
  forItemsOfKind: bookmarkKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.item,
  Component: EditBookmark,
});

export const removeBookmarkMenuItem = getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-menu-remove-bookmark",
  forItemsOfKind: bookmarkKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.removal,
  Component: RemoveBookmark,
});

export const toggleBookmarkInHotbarMenuItem = getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-menu-toggle-bookmark-in-hotbar",
  forItemsOfKind: bookmarkKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.hotbar,
  Component: ToggleBookmarkInHotbar,
});
