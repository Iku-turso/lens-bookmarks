import {
  addToHotbarInjectionToken,
  isInHotbarInjectionToken,
  isInHotbarReactiveInjectionToken,
  removeFromHotbarInjectionToken,
} from "@k8slens/hotbar-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { bookmarkHotbarItemKind, hotbarItemIdOfBookmark } from "./bookmark-hotbar-item.injectable";

// Putting a bookmark into the hotbar and taking it out, and whether it is there, followed as the
// user pins and unpins it from the bookmark's menu or the hotbar item's own.
export const bookmarkInHotbarInjectable = getInjectable2({
  id: "k8slens-bookmarks-bookmark-in-hotbar",
  consumptions: [
    addToHotbarInjectionToken,
    isInHotbarInjectionToken,
    isInHotbarReactiveInjectionToken,
    removeFromHotbarInjectionToken,
  ],

  instantiate: (di) => {
    const add = di.inject(addToHotbarInjectionToken.for(bookmarkHotbarItemKind).for(di.scopeIds))();
    const isIn = di.inject(isInHotbarInjectionToken.for(bookmarkHotbarItemKind).for(di.scopeIds))();
    const isInReactive = di.inject(isInHotbarReactiveInjectionToken.for(bookmarkHotbarItemKind).for(di.scopeIds));
    const remove = di.inject(removeFromHotbarInjectionToken.for(bookmarkHotbarItemKind).for(di.scopeIds))();

    return () => ({
      isInHotbar: (bookmarkId: string) => isInReactive(hotbarItemIdOfBookmark(bookmarkId)),

      toggle: async (bookmarkId: string) => {
        const id = hotbarItemIdOfBookmark(bookmarkId);

        if (await isIn(id)) {
          await remove(id);
        } else {
          await add({ id, persistedData: { bookmarkId } });
        }
      },

      // A removed bookmark leaves nothing behind for its hotbar item to open.
      removeIfThere: async (bookmarkId: string) => {
        const id = hotbarItemIdOfBookmark(bookmarkId);

        if (await isIn(id)) {
          await remove(id);
        }
      },
    });
  },
});
