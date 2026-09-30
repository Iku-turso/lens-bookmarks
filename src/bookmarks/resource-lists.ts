// The lists of a cluster Lens can take the user to, each by a navigation token of its own (see
// open-bookmark.injectable.ts), in the order the navigator shows them. `aliases` are other names
// the navigator may call the list by. `kind` is the Kubernetes kind the list lists.
export const resourceLists = [
  { id: "pods", kind: "Pod", title: "Pods" },
  { id: "deployments", kind: "Deployment", title: "Deployments" },
  { id: "daemon-sets", kind: "DaemonSet", title: "Daemon Sets" },
  { id: "stateful-sets", kind: "StatefulSet", title: "Stateful Sets" },
  { id: "replica-sets", kind: "ReplicaSet", title: "Replica Sets" },
  { id: "replication-controllers", kind: "ReplicationController", title: "Replication Controllers" },
  { id: "jobs", kind: "Job", title: "Jobs" },
  { id: "cron-jobs", kind: "CronJob", title: "Cron Jobs" },
  { id: "config-maps", kind: "ConfigMap", title: "Config Maps" },
  { id: "secrets", kind: "Secret", title: "Secrets" },
  { id: "resource-quotas", kind: "ResourceQuota", title: "Resource Quotas" },
  { id: "limit-ranges", kind: "LimitRange", title: "Limit Ranges" },
  { id: "horizontal-pod-autoscalers", kind: "HorizontalPodAutoscaler", title: "Horizontal Pod Autoscalers", aliases: ["HPA"] },
  { id: "pod-disruption-budgets", kind: "PodDisruptionBudget", title: "Pod Disruption Budgets" },
  { id: "priority-classes", kind: "PriorityClass", title: "Priority Classes" },
  { id: "runtime-classes", kind: "RuntimeClass", title: "Runtime Classes" },
  { id: "leases", kind: "Lease", title: "Leases" },
  { id: "mutating-webhook-configurations", kind: "MutatingWebhookConfiguration", title: "Mutating Webhook Configurations", aliases: ["Mutating Webhook Configs"] },
  { id: "validating-webhook-configurations", kind: "ValidatingWebhookConfiguration", title: "Validating Webhook Configurations", aliases: ["Validating Webhook Configs"] },
  { id: "services", kind: "Service", title: "Services" },
  { id: "endpoints", kind: "Endpoints", title: "Endpoints" },
  { id: "endpoint-slices", kind: "EndpointSlice", title: "Endpoint Slices" },
  { id: "ingresses", kind: "Ingress", title: "Ingresses" },
  { id: "ingress-classes", kind: "IngressClass", title: "Ingress Classes" },
  { id: "network-policies", kind: "NetworkPolicy", title: "Network Policies" },
  { id: "persistent-volume-claims", kind: "PersistentVolumeClaim", title: "Persistent Volume Claims" },
  { id: "persistent-volumes", kind: "PersistentVolume", title: "Persistent Volumes" },
  { id: "storage-classes", kind: "StorageClass", title: "Storage Classes" },
  { id: "namespaces", kind: "Namespace", title: "Namespaces" },
  { id: "nodes", kind: "Node", title: "Nodes" },
  { id: "service-accounts", kind: "ServiceAccount", title: "Service Accounts" },
  { id: "cluster-roles", kind: "ClusterRole", title: "Cluster Roles" },
  { id: "roles", kind: "Role", title: "Roles" },
  { id: "cluster-role-bindings", kind: "ClusterRoleBinding", title: "Cluster Role Bindings" },
  { id: "role-bindings", kind: "RoleBinding", title: "Role Bindings" },
  { id: "custom-resource-definitions", kind: "CustomResourceDefinition", title: "Custom Resource Definitions", aliases: ["Definitions", "CRDs"] },
] as const satisfies readonly { id: string; kind: string; title: string; aliases?: readonly string[] }[];

export type ResourceList = (typeof resourceLists)[number];
export type ResourceListId = ResourceList["id"];

const normalized = (name: string) => name.toLowerCase().replace(/[^a-z]/g, "");

const listsByName = new Map<string, ResourceList>(
  resourceLists.flatMap((list) =>
    [list.title, ...("aliases" in list ? list.aliases : [])].map((name) => [normalized(name), list] as const),
  ),
);

// The list a navigator item stands for, told by what the navigator calls it, as "Pods" or "Config Maps".
export const resourceListNamed = (name: string) => listsByName.get(normalized(name));

export const resourceListById = (id: string) => resourceLists.find((list) => list.id === id);

// The list of a Kubernetes kind, or `undefined` for a kind Lens has no list of here, a custom
// resource's own.
export const resourceListOfKind = (kind: string) => resourceLists.find((list) => list.kind === kind);
