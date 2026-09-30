import {
  NavigatorBranchIndicator,
  NavigatorDrillDownButton,
  NavigatorItemActions,
  NavigatorItemIcon,
  NavigatorItemLabel,
  NavigatorLeafIndicator,
} from "@k8slens/navigator-components";
import {
  getNavigatorItemKindInjectableBunch,
  type NavigatorItemProps,
  navigatorRootKind,
  useItemDrillDown,
  useItemHasChildren,
  useItemIsOpen,
} from "@k8slens/navigator-contracts";
import { computed } from "mobx";
import { BookmarkIcon } from "../bookmark-icon";
import { bookmarksFolderId, type BookmarksFolderItem, bookmarksFolderKind } from "./navigator-kinds";

const BookmarksFolderRow = ({ kind, ids, item }: NavigatorItemProps<BookmarksFolderItem, typeof navigatorRootKind>) => {
  const isOpen = useItemIsOpen(kind, ...ids);
  const hasChildren = useItemHasChildren(kind, ...ids);
  const drillDown = useItemDrillDown(kind, ...ids);

  return (
    <>
      {hasChildren ? <NavigatorBranchIndicator isOpen={isOpen} /> : <NavigatorLeafIndicator />}
      <NavigatorItemIcon>
        <BookmarkIcon />
      </NavigatorItemIcon>
      <NavigatorItemLabel>{item.name}</NavigatorItemLabel>
      <NavigatorItemActions>
        <NavigatorDrillDownButton $onClick={drillDown} />
      </NavigatorItemActions>
    </>
  );
};

export default getNavigatorItemKindInjectableBunch({
  kind: bookmarksFolderKind,
  parentKind: navigatorRootKind,
  description: "The Bookmarks item at the top of the navigator, holding the user's bookmarks.",

  items: {
    instantiate: () => async () => computed((): BookmarksFolderItem[] => [{ id: bookmarksFolderId, name: "Bookmarks" }]),
  },

  Component: BookmarksFolderRow,
});
