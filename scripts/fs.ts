import fs from 'fs'
import path from 'path'

export const DIST_DIR = path.resolve(__dirname, '../dist')
export const POSTS_DIR = path.resolve(__dirname, '../posts')
export const ASSETS_DIR = path.resolve(__dirname, '../assets')
export const STYLE_PATH = path.resolve(__dirname, '../assets/style.css')

export function walkDirRecursive(dir: string) {
  const files: string[] = []

  ;(function walk(currentDir) {
    const list = fs.readdirSync(currentDir)
    list.forEach(function (file) {
      const filePath = path.resolve(currentDir, file)
      const stat = fs.statSync(filePath)
      if (stat && stat.isDirectory()) {
        walk(filePath)
      } else {
        files.push(filePath)
      }
    })
  })(dir)

  return files
}

export function ensureParentDirExists(filePath: string) {
  const { dir } = path.parse(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true })

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}
