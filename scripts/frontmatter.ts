import { parse as parseYaml } from 'yaml'

type FrontMatterResult = {
  data: Record<string, any>
  content: string
}

export function parseFrontMatter(markdown: string): FrontMatterResult {
  const frontMatterRegex = /^---\n([\s\S]+?)\n---/
  const match = markdown.match(frontMatterRegex)

  if (!match) {
    throw new Error('No front matter found')
  }

  const frontMatterRaw = match[1]
  const data = parseYaml(frontMatterRaw)
  const content = markdown.replace(frontMatterRegex, '').trim()

  return { data, content }
}
