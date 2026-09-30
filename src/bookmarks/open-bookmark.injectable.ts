import { navigateToKubeResourceDetailsInjectionToken } from "@k8slens/details-panel-contracts";
import { openLinkInBrowserInjectionToken } from "@k8slens/electron-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { getKubeResourceKind, getKubernetesApiVersion } from "@k8slens/kubernetes-contracts";
import {
  navigateToClusterRoleBindingsInjectionToken,
  navigateToClusterRolesInjectionToken,
  navigateToConfigMapsInjectionToken,
  navigateToCronJobsInjectionToken,
  navigateToCustomResourceDefinitionsInjectionToken,
  navigateToDaemonSetsInjectionToken,
  navigateToDeploymentsInjectionToken,
  navigateToEndpointSlicesInjectionToken,
  navigateToEndpointsInjectionToken,
  navigateToHorizontalPodAutoscalersInjectionToken,
  navigateToIngressClassesInjectionToken,
  navigateToIngressesInjectionToken,
  navigateToJobsInjectionToken,
  navigateToLeasesInjectionToken,
  navigateToLimitRangesInjectionToken,
  navigateToMutatingWebhookConfigurationsInjectionToken,
  navigateToNamespacesInjectionToken,
  navigateToNetworkPoliciesInjectionToken,
  navigateToNodesInjectionToken,
  navigateToPersistentVolumeClaimsInjectionToken,
  navigateToPersistentVolumesInjectionToken,
  navigateToPodDisruptionBudgetsInjectionToken,
  navigateToPodsInjectionToken,
  navigateToPriorityClassesInjectionToken,
  navigateToReplicaSetsInjectionToken,
  navigateToReplicationControllersInjectionToken,
  navigateToResourceQuotasInjectionToken,
  navigateToRoleBindingsInjectionToken,
  navigateToRolesInjectionToken,
  navigateToRuntimeClassesInjectionToken,
  navigateToSecretsInjectionToken,
  navigateToServiceAccountsInjectionToken,
  navigateToServicesInjectionToken,
  navigateToStatefulSetsInjectionToken,
  navigateToStorageClassesInjectionToken,
  navigateToValidatingWebhookConfigurationsInjectionToken,
} from "@k8slens/kubernetes-resources-contracts";
import { isNavigationSupersededError } from "@k8slens/navigation-contracts";
import { showErrorNotificationInjectionToken, showInfoNotificationInjectionToken } from "@k8slens/notifications-contracts";
import { type Bookmark, navigatorItemCanBeOpened, navigatorItemsCannotBeOpenedMessage } from "./bookmark";
import type { ResourceListId } from "./resource-lists";

// Lens's navigation to each list the catalog in resource-lists.ts names.
const listNavigationTokens = {
  pods: navigateToPodsInjectionToken,
  deployments: navigateToDeploymentsInjectionToken,
  "daemon-sets": navigateToDaemonSetsInjectionToken,
  "stateful-sets": navigateToStatefulSetsInjectionToken,
  "replica-sets": navigateToReplicaSetsInjectionToken,
  "replication-controllers": navigateToReplicationControllersInjectionToken,
  jobs: navigateToJobsInjectionToken,
  "cron-jobs": navigateToCronJobsInjectionToken,
  "config-maps": navigateToConfigMapsInjectionToken,
  secrets: navigateToSecretsInjectionToken,
  "resource-quotas": navigateToResourceQuotasInjectionToken,
  "limit-ranges": navigateToLimitRangesInjectionToken,
  "horizontal-pod-autoscalers": navigateToHorizontalPodAutoscalersInjectionToken,
  "pod-disruption-budgets": navigateToPodDisruptionBudgetsInjectionToken,
  "priority-classes": navigateToPriorityClassesInjectionToken,
  "runtime-classes": navigateToRuntimeClassesInjectionToken,
  leases: navigateToLeasesInjectionToken,
  "mutating-webhook-configurations": navigateToMutatingWebhookConfigurationsInjectionToken,
  "validating-webhook-configurations": navigateToValidatingWebhookConfigurationsInjectionToken,
  services: navigateToServicesInjectionToken,
  endpoints: navigateToEndpointsInjectionToken,
  "endpoint-slices": navigateToEndpointSlicesInjectionToken,
  ingresses: navigateToIngressesInjectionToken,
  "ingress-classes": navigateToIngressClassesInjectionToken,
  "network-policies": navigateToNetworkPoliciesInjectionToken,
  "persistent-volume-claims": navigateToPersistentVolumeClaimsInjectionToken,
  "persistent-volumes": navigateToPersistentVolumesInjectionToken,
  "storage-classes": navigateToStorageClassesInjectionToken,
  namespaces: navigateToNamespacesInjectionToken,
  nodes: navigateToNodesInjectionToken,
  "service-accounts": navigateToServiceAccountsInjectionToken,
  "cluster-roles": navigateToClusterRolesInjectionToken,
  roles: navigateToRolesInjectionToken,
  "cluster-role-bindings": navigateToClusterRoleBindingsInjectionToken,
  "role-bindings": navigateToRoleBindingsInjectionToken,
  "custom-resource-definitions": navigateToCustomResourceDefinitionsInjectionToken,
} as const satisfies Record<ResourceListId, unknown>;

export const openBookmarkInjectable = getInjectable2({
  id: "k8slens-bookmarks-open-bookmark",

  consumptions: [
    openLinkInBrowserInjectionToken,
    navigateToKubeResourceDetailsInjectionToken,
    ...Object.values(listNavigationTokens),
    showErrorNotificationInjectionToken,
    showInfoNotificationInjectionToken,
  ],

  instantiate: (di) => {
    const openLinkInBrowser = di.inject(openLinkInBrowserInjectionToken)();
    const navigateToKubeResourceDetails = di.inject(navigateToKubeResourceDetailsInjectionToken)();
    const showErrorNotification = di.inject(showErrorNotificationInjectionToken)();
    const showInfoNotification = di.inject(showInfoNotificationInjectionToken)();

    const navigateToList = (list: string, clusterId: string) => {
      const token = listNavigationTokens[list as ResourceListId];

      if (!token) {
        throw new Error(`Lens has no list called "${list}".`);
      }

      // Namespaces left out, so the list keeps whatever the user had selected.
      return di.inject(token)()({ clusterId });
    };

    const open = async ({ target }: Bookmark) => {
      switch (target.type) {
        case "url":
          return openLinkInBrowser(target.url);

        case "kube-resource-list":
          return navigateToList(target.list, target.clusterId);

        case "kube-resource":
          return navigateToKubeResourceDetails({
            clusterId: target.clusterId,
            kind: getKubeResourceKind(target.kind),
            apiVersion: getKubernetesApiVersion(target.apiVersion),
            ref: { name: target.name, namespace: target.namespace },
          });

        case "navigator-item":
          // A cluster bookmarked before its lists could be: it stands for the cluster's pods.
          if (navigatorItemCanBeOpened(target.kindId)) {
            return navigateToList("pods", target.ids[0]);
          }

          showInfoNotification(navigatorItemsCannotBeOpenedMessage);
      }
    };

    return () => async (bookmark: Bookmark) => {
      try {
        await open(bookmark);
      } catch (error) {
        if (!isNavigationSupersededError(error)) {
          showErrorNotification(`Could not open bookmark "${bookmark.name}": ${(error as Error)?.message ?? error}`);
        }
      }
    };
  },
});
