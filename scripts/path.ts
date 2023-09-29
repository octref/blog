import path from 'path'

import { DIST_DIR, POSTS_DIR } from './fs'

export function toDistPath(srcPath: string) {
  const relPath = path.relative(POSTS_DIR, srcPath)
  if (relPath.endsWith('/index.md')) {
    return path.resolve(DIST_DIR, relPath).replace(/\/index\.md$/, '.html')
  } else if (relPath.endsWith('.md')) {
    return path.resolve(DIST_DIR, relPath).replace(/\.md$/, '.html')
  } else {
    return path.resolve(DIST_DIR, './media', relPath)
  }
}

export function toUrlPath(srcPath: string) {
  const distPath = toDistPath(srcPath)

  const urlPath =
    '/' +
    path
      .relative(DIST_DIR, distPath)
      .replace(/\.html$/, '')
      .replace(/\/index$/, '')

  return urlPath
}

export function tagToDistPath(tag: string) {
  return path.resolve(DIST_DIR, 'tags', `${tag}.html`)
}
