import zlib from 'zlib'

export function lightnessify(html: string) {
  const kbSize = (brotliSize(html) / 1000).toFixed(1)

  const lightHtml = html.replace(
    /\$lightness\$/,
    `one html ~${kbSize} kb and no javascript.`
  )

  return lightHtml
}

function brotliSize(html: string) {
  return zlib.brotliCompressSync(html, {
    params: {
      // netlify's brotli compressed size is roughly quality 3
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      [zlib.constants.BROTLI_PARAM_QUALITY]: 3
    }
  }).byteLength
}
