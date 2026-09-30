import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import { BookmarkAddIcon } from "@k8slens/icon";
import {
  getNavigatorItemMenuItemInjectableBunch,
  navigatorItemDropDownMenuOrderNumbers,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";
import { bookmarksFolderKind } from "../navigator/navigator-kinds";

const AddUrlBookmark = () => {
  const { addUrlBookmark } = useInject(bookmarkActionsInjectable)();

  return (
    <DropDownMenuItemRow Icon={BookmarkAddIcon} $onClick={addUrlBookmark}>
      Bookmark a URL…
    </DropDownMenuItemRow>
  );
};

export default getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-menu-add-url-bookmark",
  forItemsOfKind: bookmarksFolderKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.item,
  Component: AddUrlBookmark,
});
