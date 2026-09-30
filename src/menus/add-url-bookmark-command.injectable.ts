import { getCommandInjectableBunch } from "@k8slens/command-palette-contracts";
import { bookmarkActionsInjectable } from "../bookmarks/bookmark-actions.injectable";

export default getCommandInjectableBunch({
  id: "k8slens-bookmarks.bookmark-url",
  title: "Bookmarks: Bookmark a URL",

  action: {
    instantiate: (di) => {
      const { addUrlBookmark } = di.inject(bookmarkActionsInjectable)();

      return () => addUrlBookmark;
    },
  },
});
