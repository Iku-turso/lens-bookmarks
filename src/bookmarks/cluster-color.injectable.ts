import { clusterColorReactiveInjectionToken } from "@k8slens/cluster-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { computed, type IComputedValue, observable, onBecomeObserved, runInAction } from "mobx";

// The colour the user tells a cluster apart by, following them repainting it: `undefined` until
// Lens has answered, and when they have turned telling clusters apart by colour off, which means
// "draw it as you would have anyway".
export const clusterColorInjectable = getInjectable2({
  id: "k8slens-bookmarks-cluster-color",
  consumptions: [clusterColorReactiveInjectionToken],

  instantiate: (di) => {
    const clusterColorReactive = di.inject(clusterColorReactiveInjectionToken);

    return (clusterId: string): IComputedValue<string | undefined> => {
      const resolved = observable.box<IComputedValue<string> | undefined>(undefined, { deep: false });
      let asked = false;

      // A cluster Lens has never heard of is never answered about, so the asking waits until
      // something is looking rather than being left pending from the start.
      onBecomeObserved(resolved, () => {
        if (!asked) {
          asked = true;
          void clusterColorReactive(clusterId).then((color) => runInAction(() => resolved.set(color)));
        }
      });

      return computed(() => resolved.get()?.get() || undefined);
    };
  },
});
