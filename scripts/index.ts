import fs from 'fs'
import path from 'path'

import { ASSETS_DIR, DIST_DIR, copyDir } from './fs'
import { compile404, compileHome, compileTags } from './compile'
import { getPostsAndAssets } from './posts'
import { processAsset, processPost, processTag } from './process'
import { getRSS } from './rss'
import { getAllTags } from './tags'

function go() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true })
  }
  fs.mkdirSync(DIST_DIR)

  copyDir(ASSETS_DIR, DIST_DIR)

  const homeHtml = compileHome()
  fs.writeFileSync(path.resolve(DIST_DIR, 'index.html'), homeHtml)

  const fourOhFourHtml = compile404()
  fs.writeFileSync(path.resolve(DIST_DIR, '404.html'), fourOhFourHtml)

  const { sortedPosts, assets } = getPostsAndAssets()

  sortedPosts.forEach(processPost)
  assets.forEach(processAsset)

  const nonTopPagePosts = sortedPosts.filter(({ frontmatter }) => {
    return !frontmatter.top_page
  })
  const rssXml = getRSS(nonTopPagePosts)
  fs.writeFileSync(path.resolve(DIST_DIR, 'feed.xml'), rssXml)

  const tagsHtml = compileTags()
  fs.writeFileSync(path.resolve(DIST_DIR, 'tags.html'), tagsHtml)

  const tagToPosts = getAllTags()
  for (let tag in tagToPosts) {
    processTag(tag, tagToPosts[tag])
  }
}

go()
