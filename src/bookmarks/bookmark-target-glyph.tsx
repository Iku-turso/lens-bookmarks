import { Span } from "@k8slens/element-components";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { type BookmarkTarget, clusterIdOfBookmarkTarget } from "./bookmark";
import { iconOfBookmarkTarget } from "./bookmark-target-icon";
import { clusterColorInjectable } from "./cluster-color.injectable";

const ClusterColored = observer(({ clusterId, children }: { clusterId: string; children: React.ReactNode }) => {
  const color = useInject(clusterColorInjectable)(clusterId).get();

  // The glyphs draw in the current colour, so the cluster's colour is set around them.
  return <Span $flex={{ horizontalAlign: "center", verticalAlign: "center" }} $style={color ? { color } : undefined}>{children}</Span>;
});

// A bookmark's icon, in the colour of its cluster when it belongs to one.
export const BookmarkTargetGlyph = ({ target, $size }: { target: BookmarkTarget; $size?: "m" | "l" }) => {
  const Icon = iconOfBookmarkTarget(target);
  const clusterId = clusterIdOfBookmarkTarget(target);
  const glyph = <Icon $size={$size} />;

  return clusterId ? <ClusterColored clusterId={clusterId}>{glyph}</ClusterColored> : glyph;
};
