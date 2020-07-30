---
title: "Back to Blogging with Vuepress"
date: "2018-06-24"
---

Update 07/30/20: I removed Google Analytics to have a JavaScript free site. Enjoy.

---

I spent some time converting this blog to Vuepress. Here are the commits:

- [octref/vuepress@81fe2db](https://github.com/octref/vuepress/commit/81fe2db8b64a5648c7ea13cbc1abcfb988a93ff9)
- [octref/blog@46e5896](https://github.com/octref/blog/commit/46e58961d720581cafbedcac7d191f1775bd2127)

And here is the log.

## The Motivation

Sometime early in 2018 while I was reading iA's blog *[Take The Power Back](https://ia.net/topics/take-the-power-back)*, I made a decision: Get back to writing a blog.

I do have a blog, built in 2016 when I was writing down what I learned for [debugging Electron apps in VS Code](http://blog.matsu.io/debug-electron-vscode). In the past two years, that ended up as my sole post. It wasn't that I lack ideas. I have had a lot of things I could write about, both technical and non-technical. I just didn't take enough effort to turn my thoughts into words and a URL. And looking back now, I have lost many of those ideas, ephemeral as they are. For the ones that I did pin down to a todo list, they remain as raw as when they entered the list.

So I decided to get back to writing, to capture and cultivate my ideas. That's half of my motivation.

Believe it or not — in the past two years I have tried many times to write for this blog. However, I never get around fixing some of the technical & presentational aspects of the website, and each time as I try to write something, those petty annoyances establish themselves as an insurmontable barrier. They are the messy kitchen sink that I hate cleaning, and over time I just stop cooking at all.

You might wonder: Why not just switch to a blog platform, like Medium? Well, to begin with, I cannot tolerate the messy URL on Medium. But even if they fixed that, I don't like the "socialness" that Medium is building. There are just too many "followings" / "shares" / "likes" / "cute-facebook-and-twitter-icons" that I don't want for my blog. Another reason is I start to think the homogeneity in form might ultimately lead to homogeneity of content. The same style of presentation for quotes, images, links, videos, enclosed in the same font, preceded by the same hero image picked from Unsplash. I believe they are the culprit (at least complicit) in contributing to a never ending infinite scroll of "[X] Things You [Should/Need/Must] [Verb]". Many articles on Medium read styleless and voiceless.

So I got back to fixing my own blog.

## The Migration

As background, in 2016 I went through all static site generators and settled down on [Hugo](https://gohugo.io). So far it has been working fine for me, but I don't like two things in it:

- Templating. I always felt I was fighting against the templating language instead of composing.
- Clean URL. Hugo's dev server can't serve `/foo.html` when requesting `/foo`. I opened an [issue](https://github.com/gohugoio/hugo/issues/2242) there but the maintainer aren't interested in fixing, and I don't know enough Go to fix it.

So when Evan released [Vuepress](https://github.com/vuejs/vuepress), I was really excited. I like Vue's templating language, and for the Clean URL I can fix it myself, as I'm much more fluent in JavaScript than Go.

However, before jumping into the details, I would like to describe what I expect from a static website. These days people call anything that can be deployed to a static file server a static site, even if the whole website is dynamically rendered at client side and includes megabytes of JavaScript. I don't call those static websites. Here is what I call static websites:

- Clean URL a.k.a. no trailing slash. Lack of this drives me crazy.
- No client side rendering. Each page is a fully rendered static HTML file.
- No client side routing (anchors are fine). Each page corresponds to a static HTML file.
- CSS should be loaded using `<link rel="stylesheet">` or inlined in a `<style>` tag in the static HTML file.
- Images should be loaded using `<img>` tag.

There is the trend to load everything through JavaScript. It might be good for web apps, but I don't like it for static websites.

Vuepress doesn't support some of the requirements yet, so I forked it and used a custom version to build my blog.

### Vuepress

Besides a [custom Vuepress theme](https://github.com/octref/blog/tree/master/.vuepress/theme), I made the below changes to Vuepress itself:

- Clean URL. Vuepress would redirect `/foo` to `/foo/`. I removed the redirect and made sure `/foo` would serve `/foo.md` with hot update.
- Remove inline js / css for preloading and prefetching. I don't like them and it's easy to remove them - just disable the [`clientManifest`](https://ssr.vuejs.org/api/#clientmanifest) option for the SSR renderer. That does mean I can't use some functionalities such as scoped styles, but all my styles is in a simple ~200 lines [`/style.css`](/style.css) file.
- Basic RSS Support. RSS for this site is at [`/rss`](/feed.xml).
- Remove SVG icon for external links. 

The result looks pretty decent. I get:

- Clean URL with hot reloading working. When I'm editing `/foo.md`, `/foo` will get hot updates.
- The home page is ~15KB and the output very readable. Subsequent navigation to each page is around 10kb excluding images.
- ~~Other than Google Analytics, which can be blocked by Ad blockers for people who care, there is 0 lines of JavaScript on this website.~~ I removed Google Analytics as well. There's now 0 lines of JavaScript on this website.

I can try to make my changes upstream, but I'm worried my changes won't reconcile with Vuepress's vision. Vuepress emits mostly static HTML files to be hydrated into an "app". But I don't want an app — I just want to use Vue as a composition tool for generating HTML.

## Closing Thoughts

It feels good to have ideas arranged into an essay and served in the form I like. Now I see Susan Sontag's point of the false dichotomy between form & content. To me, putting words down is only half of blogging. The way in which I present those words are just as important.