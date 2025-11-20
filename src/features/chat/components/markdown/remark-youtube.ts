import type { Parent, PhrasingContent, Root } from "mdast";
import { visit } from "unist-util-visit";

const URL_PATTERNS = [
  /https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/,
  /https?:\/\/(?:www\.youtube\.com\/embed\/)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/,
];

/**
 * Extract YouTube video ID from a URL string
 */
const extractVideoId = (text: string): string | null => {
  for (const pattern of URL_PATTERNS) {
    const match = text.match(pattern);
    const result = match?.[1];
    if (result) return result;
  }
  return null;
};

/**
 * Create an iframe node for YouTube embedding
 */
const createIframeNode = (
  videoId: string,
  videoUrl: string
): PhrasingContent => ({
  type: "text",
  value: videoUrl,
  data: {
    hName: "iframe",
    hProperties: {
      src: `https://www.youtube.com/embed/${videoId}`,
      frameBorder: "0",
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      style: "width: 100%; height: 100%;",
      title: "YouTube video player",
      className:
        "youtube-iframe aspect-video bg-bg-tertiary rounded-md outline-none",
    },
  },
});

/**
 * A remark plugin to embed YouTube videos
 */
const remarkYoutubePlugin = () => (tree: Root) => {
  const transformToYoutubeEmbed = (
    parent: Parent,
    videoId: string,
    videoUrl: string
  ) => {
    const iframeNode = createIframeNode(videoId, videoUrl);

    // Replace all children with the iframe
    parent.children = [iframeNode];
  };

  visit(tree, "text", (node, _, parent) => {
    if (!parent || parent.type !== "paragraph") return;

    const videoId = extractVideoId(node.value);
    if (!videoId) return;

    const videoUrl = node.value.trim();
    transformToYoutubeEmbed(parent, videoId, videoUrl);
  });

  visit(tree, "link", (node, _, parent) => {
    if (!parent || parent.type !== "paragraph") return;

    const videoId = extractVideoId(node.url);
    if (!videoId) return;

    const videoUrl = node.url;
    transformToYoutubeEmbed(parent, videoId, videoUrl);
  });
};

export default remarkYoutubePlugin;
