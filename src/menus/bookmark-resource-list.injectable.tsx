import { allClusterRecordsInjectionToken } from "@k8slens/cluster-contracts";
import { getDropDownMenuItemsInjectableBunch } from "@k8slens/drop-down-menu-contracts";
import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import { BookmarkAddIcon } from "@k8slens/icon";
import { navigatorItemDropDownMenuKind, navigatorItemDropDownMenuOrderNumbers } from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";
import { type ResourceList, resourceListNamed } from "../bookmarks/resource-lists";

// What the navigator hands the menu of one of Lens's own resource lists, such as a cluster's Pods.
// It does not say which list, so the list is told by the item's name; the cluster is the nearest
// one in the item's ancestry.
const lensResourceListKindId = "navigator-entity:KubernetesResourceDescriptor";

const clusterLookupTimeoutMs = 1000;

interface BookmarkResourceListProps {
  readonly list: ResourceList;
  readonly clusterId: string;
}

const BookmarkResourceList = ({ list, clusterId }: BookmarkResourceListProps) => {
  const { addBookmarkTo } = useInject(bookmarkActionsInjectable)();

  return (
    <DropDownMenuItemRow
      Icon={BookmarkAddIcon}
      $onClick={() => addBookmarkTo({ type: "kube-resource-list", clusterId, list: list.id }, list.title)}
    >
      Bookmark…
    </DropDownMenuItemRow>
  );
};

// Offered where the list's cluster cannot be told, so the user learns where the bookmark is made
// instead: the cluster's own menu. Goes once Lens hands such an item its ancestry.
const BookmarkFromTheClusterInstead = ({ list }: { list: ResourceList }) => (
  <DropDownMenuItemRow
    Icon={BookmarkAddIcon}
    $enabled={false}
    $tooltip={`To bookmark ${list.title}, right-click the cluster and choose Bookmark… → ${list.title}.`}
  >
    Bookmark… (right-click the cluster)
  </DropDownMenuItemRow>
);

export default getDropDownMenuItemsInjectableBunch({
  id: "k8slens-bookmarks-bookmark-resource-list",
  kind: navigatorItemDropDownMenuKind,
  consumptions: [allClusterRecordsInjectionToken],

  instantiate: (di) => {
    const allClusterRecords = di.inject(allClusterRecordsInjectionToken);

    return async (item) => {
      const list = item.kind === lensResourceListKindId ? resourceListNamed(item.name) : undefined;

      if (!list) {
        return [];
      }

      const clusters = await Promise.race([
        allClusterRecords(),
        new Promise<[]>((resolve) => setTimeout(() => resolve([]), clusterLookupTimeoutMs)),
      ]);

      const clusterIds = new Set(clusters.map((cluster) => cluster.id));
      const clusterId = [...item.ids].reverse().find((id) => clusterIds.has(id));

      // Without its cluster, a bookmark could only guess where to take the user back to.
      if (!clusterId) {
        return {
          id: "k8slens-bookmarks-bookmark-resource-list",
          orderNumber: navigatorItemDropDownMenuOrderNumbers.sectionEnd + 100,
          Component: BookmarkFromTheClusterInstead,
          componentProps: { list },
        };
      }

      return {
        id: "k8slens-bookmarks-bookmark-resource-list",
        orderNumber: navigatorItemDropDownMenuOrderNumbers.sectionEnd + 100,
        Component: BookmarkResourceList,
        componentProps: { list, clusterId },
      };
    };
  },
});
