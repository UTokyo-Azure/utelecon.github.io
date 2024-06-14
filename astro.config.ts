import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import yaml from "@rollup/plugin-yaml";
import remarkAttributeList from "remark-attribute-list";
import redirect from "./src/lib/RedirectIntegration.js";
import defaultFrontmatterPlugin from "./src/lib/DefaultFrontmatterPlugin.js";
import dotSlashPlugin from "./src/lib/DotSlashPlugin.js";
import simpleAttentionPlugin from "./src/lib/SimpleAttentionPlugin.js";
import externalLinks from "./src/lib/ExternalLinksIntegration.js";
import trailingSlash from "./src/lib/TrailingSlashIntegration.js";
import { cleanup } from "./src/lib/CleanupIntegration.js";
import collectHtmlImages from "./src/lib/CollectHtmlImagesPlugin.js";
import copyAsset from "./src/lib/CopyAssetIntegration.js";
import assetFileNames from "./src/lib/AssetFileNames.js";
import rehypeRaw from "rehype-raw";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [yaml()],
    resolve: {
      alias: {
        "@styles": "src/styles",
      },
    },
    server: {
      watch: { usePolling: Boolean(process.env.USE_POLLING) },
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames,
        },
      },
    },
  },
  markdown: {
    remarkPlugins: [
      dotSlashPlugin,
      [defaultFrontmatterPlugin, { layout: "@layouts/Layout.astro" }],
      simpleAttentionPlugin,
      [
        remarkAttributeList,
        {
          allowNoSpaceBeforeName: true,
          allowUnderscoreInId: true,
          allowNoPosition: true,
        },
      ],
    ],
    remarkRehype: {
      footnoteLabelProperties: { className: ["visually-hidden"] },
      footnoteLabelTagName: "b",
    },
    rehypePlugins: [rehypeRaw, collectHtmlImages],
  },
  scopedStyleStrategy: "where",
  integrations: [
    mdx({ rehypePlugins: [] }),
    react(),
    redirect(),
    externalLinks({
      target: "_blank",
      rel: ["noopener", "noreferrer"],
      content: { type: "text", value: "" },
      contentProperties: { className: ["external-link"] },
    }),
    cleanup(),
    copyAsset(),
    trailingSlash(),
  ],
  site: "https://utelecon.adm.u-tokyo.ac.jp",
});
