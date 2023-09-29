import fs from 'fs'
import { parseFrontMatter } from './frontmatter'
import { Post } from './types'
import { POSTS_DIR, walkDirRecursive } from './fs'
import { toDistPath, toUrlPath } from './path'

export function getPostsAndAssets(): {
  sortedPosts: Post[]
  assets: string[]
} {
  const srcPaths = walkDirRecursive(POSTS_DIR)

  const sortedPosts: Post[] = []
  const assets: string[] = []

  srcPaths.forEach((p) => {
    if (p.endsWith('.md')) {
      const md = fs.readFileSync(p, 'utf-8')
      const { data } = parseFrontMatter(md)

      sortedPosts.push({
        frontmatter: data,
        srcPath: p,
        distPath: toDistPath(p),
        urlPath: toUrlPath(p)
      })
    } else {
      assets.push(p)
    }
  })

  sortedPosts.sort((a, b) => (a.frontmatter.date > b.frontmatter.date ? -1 : 1))

  return { sortedPosts, assets }
}
