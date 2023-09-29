import fs from 'fs'

import { compilePost, compileTag } from './compile'
import { Post } from './types'
import { tagToDistPath, toDistPath } from './path'
import { ensureParentDirExists } from './fs'

export function processPost(post: Post) {
  const html = compilePost(post)
  ensureParentDirExists(post.distPath)
  fs.writeFileSync(post.distPath, html)
}

export function processAsset(assetPath: string) {
  const distPath = toDistPath(assetPath)
  ensureParentDirExists(distPath)
  fs.copyFileSync(assetPath, distPath)
}

export function processTag(tag: string, posts: Post[]) {
  const distPath = tagToDistPath(tag)
  const html = compileTag(tag, posts)
  ensureParentDirExists(distPath)
  fs.writeFileSync(distPath, html)
}
