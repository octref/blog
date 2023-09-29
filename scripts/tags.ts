import { getPostsAndAssets } from './posts'
import { Post } from './types'

export function getAllTags(): Record<string, Post[]> {
  const { sortedPosts } = getPostsAndAssets()

  const tagToPosts: Record<string, Post[]> = {}

  sortedPosts.forEach((p) => {
    if (p.frontmatter.tags) {
      p.frontmatter.tags.forEach((tag) => {
        if (!tagToPosts[tag]) {
          tagToPosts[tag] = []
        }

        tagToPosts[tag].push(p)
      })
    }
  })

  return tagToPosts
}
