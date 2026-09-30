import { Svg, type SvgProps } from "@k8slens/element-components";

// Lens's icon set has the glyphs for adding and removing a bookmark but none for a bookmark
// itself, so this is that glyph, drawn and sized the way Lens's own bookmark glyphs are: "l"
// unless told otherwise, and pinned to it so a flex container cannot stretch it.
export const BookmarkIcon = ({ $size = "l", ...props }: SvgProps) => (
  <Svg
    viewBox="0 0 24 24"
    $size={typeof $size === "string" ? { min: $size, size: $size, max: $size } : $size}
    {...props}
  >
    <path fill="currentColor" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </Svg>
);
