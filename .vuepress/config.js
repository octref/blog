module.exports = {
  dest: 'public',
  title: `Pine Wu's Blog`,
  description: `Pine Wu's Blog`,
  markdown: {
    anchor: {
      permalink: false
    }
  },
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: '/style.css' }]
  ]
}