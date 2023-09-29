export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
}

export interface Post {
  frontmatter: Record<string, any>
  /**
   * fully resolved path in src dir
   */
  srcPath: string
  /**
   * fully resolved path in dist dir
   */
  distPath: string
  /**
   * public path on the website
   *  - with leading `/`
   *  - without `.html` extension
   *  - `/foo/index.html` -> `/foo`
   */
  urlPath: string
}
