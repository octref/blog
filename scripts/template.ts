import { getPostsAndAssets } from './posts'
import { getAllTags } from './tags'
import { Post } from './types'

export const htmlTemplate = (options: {
  urlPath: string
  css: string
  linksHtml?: string
  bodyHtml?: string
  tagsHtml?: string
  docSubtitle?: string
}) => {
  let { urlPath, css, linksHtml, bodyHtml, tagsHtml, docSubtitle } = options
  if (!linksHtml) linksHtml = ''
  if (!bodyHtml) bodyHtml = ''
  if (!tagsHtml) tagsHtml = ''
  if (!docSubtitle) docSubtitle = ''

  const docTitle =
    docSubtitle !== '' ? `${docSubtitle} | Pine&#39;s Blog` : `Pine&#39;s Blog`

  const bodyOpenTag = urlPath === '/' ? '<body class="page-home">' : '<body>'

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${docTitle}</title>
  <meta name="description" content="Pine&#39;s Blog">
  <link rel="icon" type="image/svg+xml"
    href="data:image/svg+xml,%3Csvg width='256' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='128' cy='128' r='96' fill='%236f92ba' /%3E%3C/svg%3E" />
  <style>
  ${css}
  </style>
</head>
${bodyOpenTag}
${getNavHtml(urlPath)}

<section id="main">
<ul id="links">
${linksHtml}
</ul>
<div id="content">
${bodyHtml}
</div>
<div id="tags">
${tagsHtml}
</div>
</section>

<footer>
  <div><a href="/lightness">$lightness$</a></div>
</footer>

</body>
</html>`
}

const getNavHtml = (urlPath: string) => {
  const dotSvg = `<svg id="nav-home-dot" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="6" /></svg>`
  const homeDot =
    urlPath === '/'
      ? `<a id="nav-home" class="active" href="/">${dotSvg}</a>`
      : `<a id="nav-home" href="/">${dotSvg}</a>`

  const links: { urlPath: string; title: string; match?: RegExp }[] = [
    { urlPath: '/about', title: '/about' },
    { urlPath: '/lightness', title: '/lightness' },
    { urlPath: '/tags', title: '/tags', match: /^\/tags\/.*/ },
    { urlPath: '/feed.xml', title: '/rss' }
  ]

  const linksHtml = links
    .map((l) => {
      if (l.match && l.match.test(urlPath)) {
        return `<a class="active" href="${l.urlPath}">${l.title}</a>`
      }

      return l.urlPath === urlPath
        ? `<a class="active" href="${l.urlPath}">${l.title}</a>`
        : `<a href="${l.urlPath}">${l.title}</a>`
    })
    .join('\n')

  return `<header id="header">
<nav>
  <div>
    ${homeDot}

    ${linksHtml}
  </div>
</nav>
</header>`
}

export const getPostLinksHtml = () => {
  const { sortedPosts } = getPostsAndAssets()

  return sortedPosts
    .filter(({ frontmatter }) => !frontmatter.top_page)
    .map(({ frontmatter, urlPath }) => {
      return `<li><a href="${urlPath}">${frontmatter.title}</a><span class='date'>${frontmatter.date}</span></li>`
    })
    .join('\n')
}

export const getAllTagLinksHtml = () => {
  const tagToPosts = getAllTags()

  const liHtmls: string[] = []
  for (let tag in tagToPosts) {
    const posts = tagToPosts[tag]

    liHtmls.push(`<li class="tag"><a href="/tags/${tag}">#${tag}</a></li>`)

    posts.forEach((p) => {
      liHtmls.push(
        `<li><a href="${p.urlPath}">${p.frontmatter.title}</a><span class='date'>${p.frontmatter.date}</span></li>`
      )
    })
  }

  return liHtmls.join('\n')
}

export const getTagLinksHtml = (tag: string, posts: Post[]) => {
  const liHtmls: string[] = []

  liHtmls.push(`<li class="tag"><a href="/tags/${tag}">#${tag}</a></li>`)
  posts.forEach((p) => {
    liHtmls.push(
      `<li><a href="${p.urlPath}">${p.frontmatter.title}</a><span class='date'>${p.frontmatter.date}</span></li>`
    )
  })

  return liHtmls.join('\n')
}
