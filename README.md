# @k8slens/bookmarks

Name the places in Lens you keep going back to, and get back to them in one click. Bookmarks sit under a **Bookmarks** item at the top of the navigator. A bookmark can point at a list of a cluster (its pods, deployments, nodes and so on), a Kubernetes resource or any web page.

## Features

- **Bookmark a list of a cluster**: right-click the cluster in the navigator, open **Bookmark…** and pick the list: Pods, Deployments, Nodes and the rest. The suggested name starts with the cluster's name, such as "colima: Pods".
- **Bookmark a list from the navigator**: right-click a list such as **Pods** under a cluster and choose **Bookmark…**. Where Lens does not tell which cluster the list belongs to, the row is greyed out and says to right-click the cluster instead.
- **Bookmark a Kubernetes resource**: right-click a pod, a deployment or any other resource in a list, or use the menu button at the end of its row, and choose **Bookmark…**. The suggested name starts with the cluster's name, such as "colima: Pod default/nginx".
- **Bookmark a URL**: right-click **Bookmarks** in the navigator and choose **Bookmark a URL…**, or run **Bookmarks: Bookmark a URL** from the command palette.
- **Name your bookmarks**: every bookmark gets a name when you add it, and you can rename it at any time.

## Usage

Bookmarks are listed by name. Click one under **Bookmarks** in the navigator to open it:

- A **Kubernetes resource** bookmark opens the resource's details. If the cluster isn't connected yet, Lens connects it first.
- A **URL** bookmark opens the page in your default browser.
- A **list** bookmark opens that list of its cluster, connecting the cluster first if needed.
- A bookmark of another navigator item is shown greyed out and says why it cannot be opened.

Each bookmark shows an icon for what it points at: a web page, a cluster, or one of the cluster's lists, each list with an icon of its own. A bookmarked resource shows the icon of its kind's list. Icons are drawn in the colour of the bookmark's cluster.

Right-click a bookmark to **Open** it, **Rename…** it (**Edit…** for a URL bookmark, which also lets you change the address) or **Remove** it, and **Add to hotbar** to pin it to the hotbar along the left edge, where a click opens it. **Remove from hotbar**, in the same menu or in the hotbar item's own, takes it off again; removing a bookmark takes it off the hotbar too.

Bookmarks are kept across restarts of Lens.

What changed in each version is in [CHANGELOG.md](./CHANGELOG.md).
