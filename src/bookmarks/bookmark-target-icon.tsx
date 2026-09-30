import type { SizePluginProps } from "@k8slens/element-components";
import {
  AccountBoxIcon,
  ArrowForwardIcon,
  CheckCircleIcon,
  CompareArrowsIcon,
  ComputerIcon,
  ConfigurationIcon,
  ContentCopyIcon,
  CpuIcon,
  DashboardIcon,
  DescriptionIcon,
  DiskIcon,
  EditIcon,
  ExtensionIcon,
  FlagIcon,
  FolderIcon,
  GroupsPeopleIcon,
  LabelIcon,
  LayersIcon,
  LinkIcon,
  LockIcon,
  LockOpenIcon,
  MemoryIcon,
  NavigationIcon,
  NetworkIcon,
  NodesIcon,
  PagesIcon,
  PauseCircleIcon,
  PeopleIcon,
  PlayArrowIcon,
  PodsIcon,
  PolicyIcon,
  ScheduleIcon,
  SecurityIcon,
  StorageIcon,
  TerminalIcon,
  TimerIcon,
  TripOriginIcon,
  UnfoldMoreIcon,
  VpnLockIcon,
  WorkloadsIcon,
} from "@k8slens/icon";
import type React from "react";
import { type BookmarkTarget, navigatorItemCanBeOpened } from "./bookmark";
import { type ResourceList, type ResourceListId, resourceListById, resourceListOfKind } from "./resource-lists";

type Glyph = React.ComponentType<SizePluginProps>;

// A glyph of its own for every list, picked for what the list holds, and none shared with what
// else a bookmark can point at: a web page, a cluster, a custom resource. Chosen here because the
// extension surface does not hand out the icon Lens itself shows for a kind or a list (reported to
// Lens as missing); replace these with that once it does.
const listIcons: Record<ResourceListId, Glyph> = {
  pods: PodsIcon,
  deployments: WorkloadsIcon,
  "daemon-sets": ComputerIcon, // one per machine
  "stateful-sets": DiskIcon, // pods that keep their state
  "replica-sets": ContentCopyIcon, // copies of one pod
  "replication-controllers": CompareArrowsIcon,
  jobs: PlayArrowIcon, // run to completion
  "cron-jobs": ScheduleIcon,
  "config-maps": ConfigurationIcon,
  secrets: LockIcon,
  "resource-quotas": CpuIcon,
  "limit-ranges": MemoryIcon,
  "horizontal-pod-autoscalers": UnfoldMoreIcon, // scaling out and in
  "pod-disruption-budgets": PauseCircleIcon,
  "priority-classes": FlagIcon,
  "runtime-classes": TerminalIcon,
  leases: TimerIcon,
  "mutating-webhook-configurations": EditIcon, // change what is admitted
  "validating-webhook-configurations": CheckCircleIcon, // accept or refuse it
  services: NetworkIcon,
  endpoints: TripOriginIcon,
  "endpoint-slices": PagesIcon,
  ingresses: ArrowForwardIcon, // traffic coming in
  "ingress-classes": LabelIcon,
  "network-policies": PolicyIcon,
  "persistent-volume-claims": StorageIcon,
  "persistent-volumes": LayersIcon,
  "storage-classes": FolderIcon,
  namespaces: GroupsPeopleIcon,
  nodes: NodesIcon,
  "service-accounts": AccountBoxIcon,
  "cluster-roles": SecurityIcon,
  roles: PeopleIcon,
  "cluster-role-bindings": VpnLockIcon,
  "role-bindings": LockOpenIcon,
  "custom-resource-definitions": ExtensionIcon,
};

// The glyph of one of a cluster's lists.
export const iconOfResourceList = (list: ResourceList): Glyph => listIcons[list.id];

// What a bookmark points at, as a glyph: a web page, a cluster, one of its lists, or a resource,
// which looks like the list of its kind.
export const iconOfBookmarkTarget = (target: BookmarkTarget): Glyph => {
  switch (target.type) {
    case "url":
      return LinkIcon;
    case "kube-resource-list": {
      const list = resourceListById(target.list);

      return list ? listIcons[list.id] : DescriptionIcon;
    }
    case "kube-resource": {
      const list = resourceListOfKind(target.kind);

      // A custom resource's own kind, which Lens has no list of here.
      return list ? listIcons[list.id] : DescriptionIcon;
    }
    case "navigator-item":
      return navigatorItemCanBeOpened(target.kindId) ? DashboardIcon : NavigationIcon;
  }
};
