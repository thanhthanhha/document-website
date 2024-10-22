import { PageTree } from "fumadocs-core/server";

import { docs, meta } from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";
import aliases from "@/static/page-alias.json"

export const {
  getPage,
  getPages,
  pageTree: originalTree,
} = loader({ source: createMDXSource(docs, meta) });

const offTopic = [
  "/non-nextjs-questions",
  "/on-general-being-removed",
  "/good-question",
  "/minimal-reproduction-repository",
];

const updatedChildren: PageTree.Root["children"] = [
  ...updateChildren(originalTree, aliases)
]
  


function updateChildren(originalTree: PageTree.Root, aliases: {}[]) {
  return originalTree.children.map((node: any) => {
    //loop hsonarray her to get element.url and element.name
    if (node.type === "page" && node.url === "bedrock-hands-on-guide-1.mdx") {
      return { ...node, name: "Bedrock Hands-on 가이드 - 이론편(1)" };
    }
    return node;
  });
}


export const pageTree: PageTree.Root = {
  name: "Docs",
  children: [
    { type: "page", name: "About this site", url: "/" },
    { type: "separator", name: "Discussions" },
    { type: "page", name: "Q&A", url: "/questions" },
    { type: "separator", name: "Discord-specific" },
    { type: "page", name: "Non-Next.js Questions", url: "/non-nextjs-questions" },
    { type: "page", name: "About the removal of #general", url: "/on-general-being-removed" },
    { type: "page", name: "How to ask a good question", url: "/good-question" },
    {
      type: "page",
      name: "How to create a minimal reproduction repository",
      url: "/minimal-reproduction-repository",
    },
    { type: "separator", name: "Questions" },
    ...updatedChildren.filter(node => node.type !== "page" || !offTopic.includes(node.url)),
    // .sort((a, b) => a.name.localeCompare(b.name)),
  ],
};
