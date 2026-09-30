import { getInjectable2 } from "@k8slens/injectable";
import { getPersistableArrayInjectableBunch } from "@k8slens/persistable-contracts";
import { action, computed, type IObservableArray, observable } from "mobx";
import type { Bookmark, BookmarkTarget } from "./bookmark";

export const persistedBookmarksBunch = getPersistableArrayInjectableBunch<Bookmark>()({
  id: "bookmarks",
});

const newBookmarkId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const bookmarksInjectable = getInjectable2({
  id: "k8slens-bookmarks-bookmarks",

  instantiate: (di) => {
    const getBookmarks = di.inject(persistedBookmarksBunch.persistable);

    // The bookmarks as they are now, for what renders them without awaiting: empty until the
    // persisted ones are read, and following every change after that.
    const loaded = observable.box<IObservableArray<Bookmark> | undefined>(undefined, { deep: false });
    const current = computed((): readonly Bookmark[] => loaded.get()?.slice() ?? []);

    void getBookmarks().then(action((bookmarks) => loaded.set(bookmarks)));

    return () => ({
      get: getBookmarks,
      current,

      add: async (name: string, target: BookmarkTarget) => {
        const bookmarks = await getBookmarks();

        action(() => bookmarks.push({ id: newBookmarkId(), name, target }))();
      },

      update: async (id: string, changes: Partial<Omit<Bookmark, "id">>) => {
        const bookmarks = await getBookmarks();
        const index = bookmarks.findIndex((bookmark) => bookmark.id === id);

        if (index >= 0) {
          action(() => bookmarks.splice(index, 1, { ...bookmarks[index], ...changes }))();
        }
      },

      remove: async (id: string) => {
        const bookmarks = await getBookmarks();

        action(() => bookmarks.replace(bookmarks.filter((bookmark) => bookmark.id !== id)))();
      },
    });
  },
});
