import fs from 'fs'

import {
  getPostLinksHtml,
  getAllTagLinksHtml,
  htmlTemplate,
  getTagLinksHtml
} from './template'
import { parseFrontMatter } from './frontmatter'
import { Post } from './types'
import { STYLE_PATH } from './fs'
import { lightnessify } from './lightness'
import { renderMd } from './markdown'

const css = fs.readFileSync(STYLE_PATH, 'utf-8')

export function compileHome() {
  return lightnessify(
    htmlTemplate({
      urlPath: '/',
      css,
      linksHtml: getPostLinksHtml()
    })
  )
}

export function compile404() {
  return lightnessify(
    htmlTemplate({
      urlPath: '/404.html',
      css,
      bodyHtml: '<p>Nothing found</p>',
      docSubtitle: '404'
    })
  )
}

export function compileTags() {
  return lightnessify(
    htmlTemplate({
      urlPath: '/tags',
      css,
      linksHtml: getAllTagLinksHtml(),
      docSubtitle: 'Tags'
    })
  )
}

export function compileTag(tag: string, posts: Post[]) {
  return lightnessify(
    htmlTemplate({
      urlPath: `/tags/${tag}`,
      css,
      linksHtml: getTagLinksHtml(tag, posts),
      docSubtitle: `Tag #${tag}`
    })
  )
}

export function compilePost(post: Post) {
  const md = fs.readFileSync(post.srcPath)
  const { content, data } = parseFrontMatter(md.toString())

  const linksHtml = data.date
    ? `<li><a href='${post.urlPath}'>${data.title}</a><span class='date'>${data.date}</span></li>`
    : `<li><a href='${post.urlPath}'>${data.title}</a></li>`

  const tagsHtml = data.tags
    ? data.tags.map((tag: string) => `<a href='/tags/${tag}'>#${tag}</a>`).join(' ')
    : ''

  const mdHtml = renderMd(post, content)
  const fullHtml = htmlTemplate({
    urlPath: post.urlPath,
    css,
    linksHtml,
    bodyHtml: mdHtml,
    tagsHtml,
    docSubtitle: data.title
  })

  const lightHtml = lightnessify(fullHtml)
  return lightHtml
}
