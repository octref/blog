import { Post, RSSItem } from './types'

export const getRSS = (posts: Post[]) => {
  const items: RSSItem[] = posts.map((p) => {
    return {
      title: p.frontmatter.title,
      link: `https://matsu.io${p.urlPath}`,
      description: `${p.frontmatter.title} | blog | pine`,
      pubDate: p.frontmatter.date
    }
  })

  const itemsHtml = items
    .map((item) => {
      return `<item>
  <title>${item.title}</title>
  <link>${item.link}</link>
  <description>${item.description}</description>
  <pubDate>${item.pubDate}</pubDate>
</item>`
    })
    .join('\n')

  return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
  <title>pine's blog</title>
  <link>https://matsu.io/blog</link>
  <description>pine's blog</description>
  <pubDate>${items[0].pubDate}</pubDate>
${itemsHtml}
</channel>
</rss>`
}
