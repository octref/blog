import markdownit from 'markdown-it'
import markdownFootNote from 'markdown-it-footnote'
import imgSize from 'image-size'
import path from 'path'
import { Post } from './types'

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
}).use(markdownFootNote)

export function renderMd(post: Post, content: string) {
  const preprocessed = preprocessMd(post, content)
  return md.render(preprocessed)
}

const rIMG =
  /!\[(?<alt1>[^\]]+)\]\((?<img1>[^\)]+\.(jpg|png|gif))\)(?:\s+!\[(?<alt2>[^\]]+)\]\((?<img2>[^\)]+\.(jpg|png|gif))\))?(?:\s+!\[(?<alt3>[^\]]+)\]\((?<img3>[^\)]+\.(jpg|png|gif))\))?(?:\s+!\[(?<alt4>[^\]]+)\]\((?<img4>[^\)]+\.(jpg|png|gif))\))?/

export function preprocessMd(post: Post, content: string) {
  const lines = content.split('\n')

  const newlines = lines.map((l) => {
    const match = l.match(rIMG)

    if (match) {
      const { img1, alt1, img2, alt2, img3, alt3, img4, alt4 } = match.groups!

      const imgs: { img: string; alt: string }[] = []
      if (img1 && alt1) {
        imgs.push({ img: img1, alt: alt1 })
      }
      if (img2 && alt2) {
        imgs.push({ img: img2, alt: alt2 })
      }
      if (img3 && alt3) {
        imgs.push({ img: img3, alt: alt3 })
      }
      if (img4 && alt4) {
        imgs.push({ img: img4, alt: alt4 })
      }

      let galleryHtml = `<div class="gallery">`

      const firstImgSrcPath = path.resolve(post.srcPath, '..', imgs[0].img)
      imgs.forEach(({ img, alt }, i) => {
        const imgSrcPath = path.resolve(post.srcPath, '..', img)
        const imgUrlPath = encodeExceptSlash(
          `/media` + path.resolve(post.urlPath, img)
        )

        const ratio = i === 0 ? 1 : getFlexRatio(imgSrcPath, firstImgSrcPath)

        galleryHtml += `<figure style="flex: ${ratio}">
  <picture>
    <img src="${imgUrlPath}" alt="${alt}" />
  </picture>
</figure>`
      })

      galleryHtml += `</div>`

      return galleryHtml
    } else {
      return l
    }
  })

  return newlines.join('\n')
}

// putting two images side by side with same height
// when base has flex: 1, calculate target flex ratio
function getFlexRatio(baseImgPath: string, targetImgPath: string) {
  const { width: bw, height: bh, orientation: bo } = imgSize(baseImgPath)
  const { width: tw, height: th, orientation: to } = imgSize(targetImgPath)

  // rotate 90/270 degree, swap width and height
  const r1 = bo && bo > 4 ? bh! / bw! : bw! / bh!
  const r2 = to && to > 4 ? th! / tw! : tw! / th!

  const ratio = r1 / r2

  return ratio
}

function encodeExceptSlash(input: string): string {
  return input
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
}
