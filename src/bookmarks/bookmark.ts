import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import { resourceListById } from "./resource-lists";

// A place a bookmark takes the user back to.
export type BookmarkTarget =
  | { readonly type: "url"; readonly url: string }
  | {
      readonly type: "navigator-item";
      // The item's kind as the navigator knows it, scoped to whoever declared it.
      readonly kindId: string;
      readonly ids: readonly string[];
    }
  | {
      // One of the lists of a cluster, such as its pods.
      readonly type: "kube-resource-list";
      readonly clusterId: string;
      readonly list: string;
    }
  | {
      readonly type: "kube-resource";
      readonly clusterId: string;
      readonly kind: string;
      readonly apiVersion: string;
      readonly name: string;
      readonly namespace?: string;
    };

export interface Bookmark {
  readonly id: string;
  readonly name: string;
  readonly target: BookmarkTarget;
}

// The extension surface cannot open an arbitrary navigator item the way clicking it does, and says
// nothing about which cluster or list Lens's own items belong to. A cluster's own item is the one
// it can take the user to: the cluster's pods, connecting it first.
export const navigatorItemCanBeOpened = (kindId: string) => kindId === clusterNavigatorItemKind;

export const navigatorItemsCannotBeOpenedMessage =
  "Lens does not yet let extensions open this kind of navigator item.";

// The cluster a bookmark belongs to, if it belongs to one.
export const clusterIdOfBookmarkTarget = (target: BookmarkTarget): string | undefined => {
  switch (target.type) {
    case "kube-resource":
    case "kube-resource-list":
      return target.clusterId;
    case "navigator-item":
      return target.kindId === clusterNavigatorItemKind ? target.ids[0] : undefined;
    case "url":
      return undefined;
  }
};

export const describeBookmarkTarget = (target: BookmarkTarget): string => {
  switch (target.type) {
    case "url":
      return target.url;
    case "navigator-item":
      return navigatorItemCanBeOpened(target.kindId) ? "Pods of the cluster" : "Navigator item (cannot be opened yet)";
    case "kube-resource-list":
      return resourceListById(target.list)?.title ?? target.list;
    case "kube-resource":
      return target.namespace
        ? `${target.kind} ${target.namespace}/${target.name}`
        : `${target.kind} ${target.name}`;
  }
};

export const isWebUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);

    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};
