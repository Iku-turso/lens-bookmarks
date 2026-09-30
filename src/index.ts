import { getFeature, registerInjectablesFromModules } from "@k8slens/feature-core";
import modulesWithInjectables from "./**/*.injectable.(ts|tsx)";
import stylesheets from "./**/!(_*).(scss|css)";

export const k8SlensBookmarksFeature = getFeature({
  id: "k8slens-bookmarks",
  register: (di) => {
    // Auto-discovers every `*.injectable.(ts|tsx)` file under this directory and registers it.
    registerInjectablesFromModules(di, [...modulesWithInjectables, ...stylesheets]);
  },
});
