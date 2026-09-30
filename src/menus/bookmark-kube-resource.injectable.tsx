import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import { BookmarkAddIcon } from "@k8slens/icon";
import {
  getKubeResourceMenuItemInjectableBunch,
  kubeResourceMenuOrderNumbers,
  type KubeResourceMenuTarget,
} from "@k8slens/kube-resource-menu-contracts";
import { useInject } from "@k8slens/use-inject";
import type { BookmarkTarget } from "../bookmarks/bookmark";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";

const BookmarkKubeResource = ({ data }: { data: KubeResourceMenuTarget }) => {
  const { addKubeResourceBookmark } = useInject(bookmarkActionsInjectable)();

  const target: Extract<BookmarkTarget, { type: "kube-resource" }> = {
    type: "kube-resource",
    clusterId: data.clusterId,
    kind: data.kind,
    apiVersion: data.apiVersion,
    name: data.name,
    namespace: data.namespace,
  };

  return (
    <DropDownMenuItemRow Icon={BookmarkAddIcon} $onClick={() => addKubeResourceBookmark(target)}>
      Bookmark…
    </DropDownMenuItemRow>
  );
};

export default getKubeResourceMenuItemInjectableBunch({
  id: "k8slens-bookmarks-bookmark-kube-resource",
  orderNumber: kubeResourceMenuOrderNumbers.sectionEnd + 100,
  Component: BookmarkKubeResource,
});
