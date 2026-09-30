import { clusterNameInjectionToken } from "@k8slens/cluster-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { openModalInjectionToken } from "@k8slens/modal-contracts";
import { bookmarkInHotbarInjectable } from "../hotbar/bookmark-in-hotbar.injectable";
import { bookmarkDetailsModalKind } from "../modal/bookmark-details-modal.injectable";
import { type Bookmark, type BookmarkTarget, describeBookmarkTarget } from "./bookmark";
import { bookmarksInjectable } from "./bookmarks.injectable";

// Lens never answers for a cluster it has not heard of, so the name is not waited on for longer.
const clusterNameTimeoutMs = 1000;

// What the menus and commands do to bookmarks, asking the user for a name where one is needed.
export const bookmarkActionsInjectable = getInjectable2({
  id: "k8slens-bookmarks-bookmark-actions",
  consumptions: [openModalInjectionToken, clusterNameInjectionToken],

  instantiate: (di) => {
    const bookmarks = di.inject(bookmarksInjectable)();
    const askBookmarkDetails = di.inject(openModalInjectionToken.for(bookmarkDetailsModalKind).for(di.scopeIds))();
    const clusterName = di.inject(clusterNameInjectionToken);
    const bookmarkInHotbar = di.inject(bookmarkInHotbarInjectable)();

    const addBookmarkTo = async (target: BookmarkTarget, name: string) => {
      const details = await askBookmarkDetails({ title: "Add bookmark", confirmLabel: "Add", isNew: true, name });

      if (details) {
        await bookmarks.add(details.name, target);
      }
    };

    return () => ({
      addBookmarkTo,

      // A resource, named after the cluster it is in: "colima: Pod default/nginx".
      addKubeResourceBookmark: async (target: Extract<BookmarkTarget, { type: "kube-resource" }>) => {
        const name = await Promise.race([
          clusterName(target.clusterId),
          new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), clusterNameTimeoutMs)),
        ]).catch(() => undefined);

        const description = describeBookmarkTarget(target);

        await addBookmarkTo(target, name ? `${name}: ${description}` : description);
      },

      addUrlBookmark: async () => {
        const details = await askBookmarkDetails({ title: "Bookmark a URL", confirmLabel: "Add", isNew: true, name: "", url: "" });

        if (details?.url) {
          await bookmarks.add(details.name, { type: "url", url: details.url });
        }
      },

      editBookmark: async (bookmark: Bookmark) => {
        const isUrl = bookmark.target.type === "url";
        const details = await askBookmarkDetails({
          title: isUrl ? "Edit bookmark" : "Rename bookmark",
          confirmLabel: "Save",
          isNew: false,
          name: bookmark.name,
          url: bookmark.target.type === "url" ? bookmark.target.url : undefined,
        });

        if (details) {
          await bookmarks.update(bookmark.id, {
            name: details.name,
            ...(details.url ? { target: { type: "url", url: details.url } } : {}),
          });
        }
      },

      removeBookmark: async (bookmark: Bookmark) => {
        await bookmarks.remove(bookmark.id);
        await bookmarkInHotbar.removeIfThere(bookmark.id);
      },
    });
  },
});
