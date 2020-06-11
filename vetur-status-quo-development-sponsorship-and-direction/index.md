---
title: "Vetur: status quo, development, sponsorship and direction"
date: "2020-06-11"
---

I haven't looked at Vetur for quite some time. Issues and PRs are piling up. I just finished triaging all issues, but I expect it would take me around two months to review all PRs and fix most of the bugs. So I decided to write this post to provide you with some updates and transparency.

This post has four sections:

- Status quo: How is the project standing?
- Development: My plan to continue developing Vetur.
- Sponsorship: I'm starting a [sponsorship](https://github.com/sponsors/octref) to keep my work sustainable.
- Direction: What are the current development focuses?

And a little bit of musing at the end.

## Status Quo

Vetur now has 4.8 million downloads on [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=octref.vetur). [`vls`](https://github.com/vuejs/vetur/tree/master/server), the Vue Language Server, is being used in [Vim / NeoVim](https://github.com/neoclide/coc-vetur), [Emacs](https://github.com/emacs-lsp/lsp-mode/blob/master/lsp-vetur.el), [Atom](https://atom.io/packages/ide-vue), [Sublime Text](https://github.com/sublimelsp/LSP-vue) and [CodeSandbox](https://codesandbox.io/post/announcing-codesandbox-v3). Sometimes I'm surprised by Vetur's popularity as well.

Meanwhile, there are ~200 issues and ~40 PRs open. Assuming 1hr/bug in average, it would take me roughly 16 weeks to go through them. Sometimes [@ktsn](https://github.com/ktsn) and [@yoyo930021](https://github.com/yoyo930021) help me with triaging issues and sending bugfixes, but I'm still mainly responsible for making fixes and reviewing PRs.

Vetur has become quite complex on three aspects:

- It needs to support all languages allowed in `.vue` files. Vetur now offers syntax highlighting and language features for `html`/`css`/`scss`/`less`/`stylus`/`js`/`ts`, but only provides syntax highlighting for `pug`/`haml`/`slm`/`postcss`/`sass`/`coffee`. People have interest in language features for `pug`/`postcss`/`sass`, but I don't have time.
- It needs to implement all language features in [Language Server Protocol](https://microsoft.github.io/language-server-protocol/). That includes auto-completion, diagnostic errors, hover information, signature help, folding, jump-to-definition, renaming, formatting, among [many others](https://code.visualstudio.com/api/language-extensions/programmatic-language-features). Now multiply that with the number of languages above.
- It needs to integrate well with many other libraries. The one taking up most effort is TypeScript, as sometimes I need to dive deep into its internals to fix language feature issues or performance issues. Other libraries like emmet, language services, formatters and linters take time as well.

Although I aim to provide a fast and smooth development experience to Vue users, it's tough to manage all these aspects. Developing a single language server for a single language is already a full-time job. Implementing TypeScript support in VS Code was my past coworker's full-time job. The work can feel overwhelming at times.

Having a large surface area does make the job challenging, but it also provides opportunities for innovation. [Vue Interpolation Language Features](https://blog.matsu.io/generic-vue-template-interpolation-language-features) and [Vetur Terminal Interface](https://vuejs.github.io/vetur/vti.html) are some examples. With an oversight over all these aspects, I have a lot of ideas for pushing the boundary of development experience. Now I have a bit more time, I'll start to give those ideas a try.

Vetur is now in a position to help shaping up the Vue ecosystem. Vetur's [Framework Support](https://vuejs.github.io/vetur/framework.html) now works with 9 popular Vue libraries. When you install [`Nuxt`](https://nuxtjs.org/) or [`Quasar`](https://quasar.dev/), for example, those frameworks include auto-generated JSON metadata file in their NPM packages. Vetur then picks them up and gives you auto-completion and hover information in the editor. I hope to standardize this format and push for its adoption, so in the future one can easily learn and use a new Vue-based library, just as one can easily learn and use a JS library today by installing a `@types` package.

Supporting Vue has been Vetur's focus, but I'm happy to see Vetur being used in the wider web community, whether for Vue-related development or unrelated projects. For example, [vscode-weex](https://github.com/weex-cli/vscode-weex) uses Vetur to support [weex](https://weex.apache.org) and [sveltejs/language-tools](https://github.com/sveltejs/language-tools) builds on Vetur to support [svelte](https://svelte.dev).

Overall, I feel with some bugfixes and PRs, Vetur would be in a great shape again and provide a base ripe for innovation on web development experience. I'll talk a bit about how I plan to continue its development.

## Development

I [quit my job](https://blog.matsu.io/on-leaving) at Microsoft and is now doing independent study/research at Shanghai. Given my other commitments, I'll have at most 15hr/week to contribute to Open Source. I plan to spend most of it on Vetur.

With so many features, I think it's no longer feasible for me to tackle all issues by myself. Many others have wanted to help, but I haven't made Vetur easy to contribute to. Here are my plans to make contribution smoother:

- Have clear issue templates and standards. Strictly close all issues that don't adhere to them.
- Isolate feature areas that can be independently owned and delegate them to other contributors. Establish clear interfaces between Vetur and those independent areas.
- Review PR in a timely manner (I haven't been doing so).
- Write more docs for contributing to each area. For example, how to add a new framework support? How to debug and fix a TextMate grammar issue? How to track down a perf issue?

Here are some of my personal plans:

- Use Vue + TypeScript to build my personal projects. Write everything down. On the one hand I can dogfood Vetur, improving it as I encounter issues. On the other hand I haven't seen a thorough guide for using Vue + TS, so I guess I'll write one.
- Spend some time every week to research and experiment with improving Vue/web development experiences with Vetur's foundation. Write down my findings. Don't worry about perfection and production quality. Have some fun.

To be honest, maintaining an Open Source project isn't a lot of fun. There were times when I didn't want to look at all the notifications. But now I realized I should take a stronger stance. I wouldn't let money or urgency of issues take the fun out of this project. I won't spend 40hr/week just fixing arcane bugs. Having some time for fun is not optional, but essential:

> I think that it’s extraordinarily important that we in computer science keep fun in computing. When it started out, it was an awful lot of fun. Of course, the paying customers got shafted every now and then, and after a while we began to take their complaints seriously. We began to feel as if we really were responsible for the successful, error-free perfect use of these machines. I don’t think we are. I think we’re responsible for stretching them, setting them oﬀ in new directions, and keeping fun in the house. I hope the ﬁeld of computer science never loses its sense of fun. Above all, I hope we don’t become missionaries. Don’t feel as if you’re Bible salesmen. the world has too many of those already. What you know about computing other people will learn. Don’t feel as if the key to successful computing is only in your hands. What’s in your hands, I think and hope, is intelligence: the ability to see the machine as more than when you were first led up to it, that you can make it more.
>
> — Alan J. Perlis

## Sponsorship

I'm starting a [GitHub Sponsorship](https://github.com/sponsors/octref) to keep my work sustainable. If Vetur has helped you, please consider sponsoring me.

Through the four years of Vetur's development, money hasn't been my purpose or concern. I'm working on Vetur out of care, curiosity and love. In term of rewards, I have occasionally received thank-you emails from strangers. They warm my heart.

However, after quitting my job, I no longer have the luxury to ignore the money issue. On the one hand, my saving will run out one day and I need to plan for it. On the other hand, maintaining Vetur takes a significant slice of my time for personal research/study, which I quit my high-paying job for.
 
Even though money is an unignorable matter for me now, I won't go for certain options. There are other language support extensions that [shift to proprietary licenses and charge money](https://github.com/bmewburn/vscode-intelephense). I want to make it clear that I'll never change the OSS license or charge you anything for using Vetur.

If Vetur has made using Vue simpler and smoother for you, please consider a small sponsorship, like a cup of latte every month.
If you are using Vetur to develop a commercial product that makes a lot of money, or if you are embedding Vetur in your commercial online IDE, please consider making a larger sponsorship.

Thank you for taking money out of my list of concerns, so I can focus on making Vetur great and contributing to the Vue ecosystem.

## Direction

Here are things I'll focus on in the near term:

- Make sure Vue 3 is supported as well as Vue 2.
- Improve TypeScript integration to
  - Bring TypeScript features to Vue files (auto-import, refactoring, organize import, etc).
  - Accommodate more complex project setup.
- Finalize an interchange format that describe shape of a Vue component. Frameworks should generate data of this format and give it to Vetur. `vls` should generate data of this format on-the-fly for user components. This data is then used for language features such as auto-completion and error-checking.
- Improve [VTI](https://github.com/vuejs/vetur/tree/master/vti).
- Improve performance. Create performance test suites and investigate performance issues.
- Bring Windows support on par with macOS/Linux support.
- Improve support for prettier/prettier-eslint.

This list should take at least 2 months. I'll update the [roadmap](https://github.com/vuejs/vetur/issues/873) as I go.

## Musing

In the past, learning and using Vue, or any framework, tend to be a fragmented process. You read the API. Copy and adapt. Find an error. Go back to reading the API. Fix the error. A lot of back and forth. Vetur blurs the line between the processes. You learn, write, debug and use Vue in a single loop. Vetur speeds you up and gives you confidence.

Sometimes I feel the process of learning Vue isn't that much different from traveling to a place, with a language and culture unbeknown to you. The sense of uncertainty is similar. You worry about using a wrong phrase. You Google anxiously for a good restaurant. My hope for Vetur is a tour guide of sorts, someone that always accompanies you, teaches you the slangs and take you to the local eateries, but then fades to the background, letting you savor the joy of exploration and discovery. I hope Vetur can help you play fearlessly with Vue. I hope Vetur can help you build large applications confidently as well. It's a lot of work ahead, but that's my goal, and your generosity will help me getting there.