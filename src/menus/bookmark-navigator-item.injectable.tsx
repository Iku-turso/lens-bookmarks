import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import { dropDownMenu, getDropDownMenuItemsInjectableBunch, getDropDownMenuKind } from "@k8slens/drop-down-menu-contracts";
import { DropDownMenuItemRow, DropDownMenuSubMenu } from "@k8slens/drop-down-menu-items";
import { BookmarkAddIcon } from "@k8slens/icon";
import {
  getNavigatorItemMenuItemInjectableBunch,
  navigatorItemDropDownMenuOrderNumbers,
  type NavigatorItemOfKind,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";
import { iconOfResourceList } from "../bookmarks/bookmark-target-icon";
import { type ResourceList, resourceLists } from "../bookmarks/resource-lists";

interface ClusterBookmarkMenuData {
  readonly clusterId: string;
  readonly clusterName: string;
}

// The submenu of a cluster's "Bookmark…": a row per list of the cluster.
export const clusterBookmarkMenuKind = getDropDownMenuKind<ClusterBookmarkMenuData>()("k8slens-bookmarks-cluster-bookmark-menu");

const BookmarkCluster = ({ data }: { data: NavigatorItemOfKind<typeof clusterNavigatorItemKind> }) => (
  <DropDownMenuSubMenu Icon={BookmarkAddIcon} menu={dropDownMenu(clusterBookmarkMenuKind, { data: { clusterId: data.ids[0], clusterName: data.name } })}>
    Bookmark…
  </DropDownMenuSubMenu>
);

export const bookmarkClusterMenuItem = getNavigatorItemMenuItemInjectableBunch({
  id: "k8slens-bookmarks-bookmark-navigator-item",
  forItemsOfKind: clusterNavigatorItemKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.sectionEnd + 100,
  Component: BookmarkCluster,
});

const BookmarkClusterList = ({ data, list }: { data: ClusterBookmarkMenuData; list: ResourceList }) => {
  const { addBookmarkTo } = useInject(bookmarkActionsInjectable)();

  return (
    <DropDownMenuItemRow
      Icon={iconOfResourceList(list)}
      $onClick={() => addBookmarkTo({ type: "kube-resource-list", clusterId: data.clusterId, list: list.id }, `${data.clusterName}: ${list.title}`)}
    >
      {list.title}
    </DropDownMenuItemRow>
  );
};

export const clusterListMenuItems = getDropDownMenuItemsInjectableBunch({
  id: "k8slens-bookmarks-cluster-list-menu-items",
  kind: clusterBookmarkMenuKind,

  instantiate: () => () =>
    resourceLists.map((list, index) => ({
      id: `k8slens-bookmarks-cluster-list-${list.id}`,
      orderNumber: index,
      Component: BookmarkClusterList,
      componentProps: { list },
    })),
});
