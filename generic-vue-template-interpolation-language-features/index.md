---
title: "Generic Vue Template Interpolation Language Features"
date: "2019-04-23"
---

When Vue 2.0 and TypeScript 2.0 were released in 2016, people wanted to use them together.

The sad thing was they couldn't. You could make Vue and TS code compile together, but not without a lot of hassle. It's neither elegant (what Vue is all about) nor type-safe (what TypeScript is all about). With Vue 2.5 shipping typing definition and Vue CLI 3's improvements, it has become easier to setup a project with Vue and TypeScript. However, type-safety wise, there's still a lot to be desired.

One thing people really wanted most was template type checking, and this popular [blog post](https://herringtondarkholme.github.io/2016/10/03/vue2-ts2/) written by [HerringtonDarkholme](https://github.com/HerringtonDarkholme), a Vue and TypeScript contributor, accurately summarized the situation:

![blog](/generic-vue-template-interpolation-language-features/blog.png)

Well, the statement is no longer true since Vetur's 0.19.0 release:

<video autoplay="" loop="" muted="" playsinline="" controls="">
  <source src="/generic-vue-template-interpolation-language-features/interpolation.mp4" type="video/mp4">
</video>

These Language Server Protocol [language features](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#language-features-listing) become available for Vue interpolation expressions:

- Auto complete (introduced in 0.18.0)
- Diagnostics (error checking / type checking)
- Hover information
- Jump to definition
- Find References

You can read more about how this feature works in Vetur's [documentation](https://vuejs.github.io/vetur/interpolation). Other Language Clients using [VLS](https://github.com/vuejs/vetur/tree/master/server) (Vue Language Server) >= 0.0.50 should get those features too.

This post explains how this feature was implemented.

## Vetur

[Vetur](https://github.com/vuejs/vetur) is the VS Code extension for working with Vue files. It is a language server extension hosting the [Vue Language Server](https://github.com/vuejs/vetur/tree/master/server), which combines [HTML](https://github.com/Microsoft/vscode-html-languageservice) / [CSS](https://github.com/Microsoft/vscode-css-languageservice) / [TypeScript](https://github.com/Microsoft/TypeScript) / [Stylus](https://github.com/d4rkr00t/language-stylus) language servers to support the many embedded languages in [Vue Single File Component](https://vue-loader.vuejs.org/spec.html). You can read more about its features in [Vetur documentation](https://vuejs.github.io/vetur/).

First, a rough explanation of how Vetur's JS / TS / Vue support works:

Vetur builds on top of TypeScript's [Language Server API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API). To make TypeScript understand Vue files, Vetur masks `.vue` files as TS files. For example, when you see a Single File Component (SFC) like this:

```vue
<template>
  <div></div>
</template>
<script>
console.log('Vetur')
</script>
```

The TypeScript Language Service in Vetur sees this (`█` stands for space):

```ts
██████████
█████████████
███████████
████████
console.log('Vetur')
█████████
```

Vetur then proxies all LSP request to and responses from TypeSript Language Service to the SFC to make language features work on SFC. As both files share same position of the actual TS code, the mapping is easy.

## The Idea

In 2017, Vue core team member [Katashin](https://github.com/ktsn) opened an [issue](https://github.com/vuejs/vetur/issues/209) to discuss template expression type-checking. The proposed approach was:

- Extract `<template>` code from SFC
- Use [vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser) to parse the program into an ESLint AST
- Write a custom AST transformer to transform the ESLint AST into a TypeScript SourceFile
- Feed the virtual file into TypeScript Language Service and call language feature APIs
- Map responses back to SFC

This sounds like a lot of work and resource heavy, so I thought it's never gonna happen. However, almost a year later, [Katashin](https://github.com/ktsn) opened a [Pull Request](https://github.com/vuejs/vetur/pull/681) to implement this feature. It more or less worked.

For the `<template>` region in the above code, the transformed TypeScript code looks roughly like this:

```ts
import __Component from "./Component.vue";
import { __vlsRenderHelper, __vlsComponentHelper } from "vue-editor-bridge";
__vlsRenderHelper(__Component, function () {
    __vlsComponentHelper("div", { props: {}, on: {}, directives: [] }, [this.msg]);
});
```

The `__Component` refers to the SFC itself, which Vetur could resolve. The `__vls` helpers contextually type `this` in the function context:

```ts
export declare const __vlsRenderHelper: {
  <T>(Component: (new (...args: any[]) => T), fn: (this: T) => any): any;
};
```

When you type `m` inside the interpolation region:

- `this.m` is generated in the virtual file
- Vetur queries TypeScript Language Service on the virtual file to get semantic errors
- Vetur gets an error on the span of `this.m`: `m doesn't exist on 'this'`
- Vetur maps `this.m` back to the range of `m` inside the SFC

This sounds all good, but at that time Vetur suffered from performance issues. Doing this *seems* to require spinning up another TypeScript Language Service. I supposed this would double the CPU / memory usage of Vetur, so I left the PR languish for quite some time.

The other reason that I didn't merge the PR in immediately was that I would want language features to "just work" inside the template interpolation regions. The PR only implements diagnostics, but I wanted to make sure the way it's implemented would pave way for any language features.

## Picking Up The Idea

After graduating in 2017 and then joining Microsoft, I haven't had much time to work on Vetur. However, this year I managed to get three months to work full-time on Vetur (that's why you see Vetur's milestone on the VS Code [iteration plan](https://github.com/Microsoft/vscode/issues/71830)).

Looking back at the PR in 2019, I realized a few things:

- The PR actually avoided the "double Language Service" performance problem by using a single `ts.createDocumentRegistry` to manage the underlying documents for both Language Services.
- With Vetur's bundled TypeScript 2.8, this wouldn't work well. Many people are now on TS 3.0+, and if they are using new features in TS in the `<script>` region, the Language Service would crash or report wrong diagnostic errors.
- I cannot use it for template interpolation completion, because the ESLint parser can only parse complete expressions. When using auto completion, the source code is in invalid state 90% of the time.
- Other static language features that would work only on valid SourceFiles such as hover / references / definition would work fine.

So, in preparation, I started building [Template Interpolation Completion](https://github.com/vuejs/vetur/blob/master/CHANGELOG.md#template-interpolation-completion) with another approach (traversing the TypeScript AST in the original `.vue` file and generating the completion items myself), [decoupled](https://github.com/vuejs/vetur/blob/master/CHANGELOG.md#using-workspace-typescript-version) Vetur from a fixed version of TypeScript, and upgraded Vetur to use TypeScript 3.3.

Then I rebased the original PR off the current master. However, things aren't all rosy. I ran into quite some problems.

And for the sake of posterity, here are the details. Unless you are deep into Language Servers and TypeScript, this wouldn't make much sense.

## Problems

⚠️ Lots of Language Server Protocol and TypeScript jargons ahead. ⚠️

When playing around with the PR, the two biggest issue I had were:
- TypeScript Language Service crashed a lot
- Some language features don't work (specifically, jump to definition and find references)

After some digging, I found that the cause was that the virtually transformed TS file didn't satisfy certain constraints on `ts.SourceFile`.

Normally, when you call `ts.createSourceFile` on a `string` of valid TypeScript code, you get a TS AST that has valid Nodes. Each Node has valid position. Each ParentNode has a range that neatly covers all its children's ranges. TypeScript Language Service works well off those valid SourceFiles.

Enter the hooligan virtual TS files whose Nodes are all synthetic (manually created with `ts.create...` call) and who have invalid positioning like `(-1, -1)`. The only few `ts.Expression` Nodes that have above zero positions have their positions set to the same position as the one in SFC.

For example, in the virtual file, `this.msg` could have a position like `(50, 53)` despite it length is 7, and despite 200 instead of 50 characters of TS code precede it. Of course TypeScript Language Service would hate them and crash in protest.

The only saint in the TypeScript namespace that could work with this hooligan virtual file is `ts.createPrinter`. The printer prints each Node sequentially, ignoring its position and only care about its syntax kind. So the new idea is:

1. Transform the ESLint AST into TS AST in the invalid virtual file
    1. For each expression transformed into `ts.Node`, use `ts.setSourceMapRange` to set its source range. I just need a place to record the range of the original expression in SFC
2. Print that invalid virtual file to get valid TS code
3. Create a valid SourceFile from that valid TS code
4. Create a sourcemap from original SFC to the final, valid virtual file
    1. Walk through the AST of both the invalid/valid virtual files. They should share the same structure.
    2. When a Node from the invalid virtual file has a source map range (from 1.1), create a mapping from that source map range to the range of the corresponding Node in the **valid virtual file**.
    3. Do some special handling, since I would map `msg` to `this.msg`. When translating position from SFC to the virtual file, I would map positions like this: `|msg` => `this.|msg`, but when a diagnostic error occurs on `this.msg` in the virtual file, I map back both these positions `|this.msg` and `this.|msg` to the position of `|foo`.

An example of what's happening in step 4:

- Suppose SFC has `msg` in an interpolation area in `(30, 33)`
- The ESLint AST has a Node from `(30, 33)` capturing this expression
- The corresponding Node in the invalid virtual file would have content `this.msg` but position of `(-1, -1)`
- During the transformation, mark `this.msg` Node 's `sourceMapRange` to `(30, 33)`
- Print invalid virtual file
- Create new SourceFile from the print output
- Walk the AST of both the invalid virtual file and the valid virtual file. At each point I have a Node from either.
- When seeing a Node from invalid virtual file that has `sourceMapRange` set:
    - Get position of Node from valid virtual file. Something like `(150, 158)`
    - Create mapping between `(30, 33, 'x.vue')` to `(150, 157, 'x.vue.template')`
    - Create forward mapping `{30: 155, 31: 156, 32: 157, 33: 158}`. `this.` is skipped.
    - Create backward mapping `{150: 30, 155: 33, 156: 31, 157: 32, 158: 33}`
    - The backward mapping `(150, 30)` ensures error spans on either `(150, 158)` or `(155, 158)` could be mapped back

After handling a few edge cases, this works well enough so I'm releasing it.

## Some Todos

My next focus is to improve the CPU / memory usage of Vetur on large projects. However, there are a lot of nice things that could happen:

- Make rename work. Imagine pressing renaming on a `foo` prop, and all usages of `foo` in `<template>`, `this.foo` in `<script>`, and all components that pass `:foo` are updated!
- Make the language features work across boundary. Currently, finding references in `<template>` region collects references in `<script>`, but the reverse is not true.
- Bring other language features to interpolations, such as code actions (autofix), signature help (parameter hints), etc.
- Vue has had problems generating sourcemap from its templates. This makes it impossible to set break points in Vue SFC's template regions. Maybe I can upstream my changes to generate correct sourcemap for Vue templates.
- Vue's default [template compiler](https://template-explorer.vuejs.org/) generates a render function using `with(this)`. With statement is [deprecated](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) and not supported well in TypeScript. That's the main reason I couldn't use Vue's template compiler. Maybe me and [Katashin](https://github.com/ktsn) could help with Vue 3's template compiler so it can output easily-type-checkable render function, so we don't have to continue to maintain the transformer, which is essentially another Vue template compiler.
- Error-tolerant parsing: When writing code, 90% of the time the code is syntactically invalid. However, to make language features work in those 90% of time, the parser should generate a mostly valid AST so language features could work on them. Currently when the template is invalid, Vetur doesn't do any transformation. It would be great if Vetur could do this, so auto completion could work from the transformed virtual files. 
- It would be great if Vue, [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) and Vetur could share the same parser.
- Incremental parsing: When you made a small change in a Vue template, Vetur should only re-parse the changed part and run its transformation, sourcemap updating and whatnot on the changed AST nodes.
- Offer a CLI version of [Vue Language Server](https://github.com/vuejs/vetur/tree/master/server) so people can collect template diagnostic errors outside editor contexts.

I'll try to get to these things, but if you are interested in making some of these features happen, the source code is at [vuejs/vetur](https://github.com/vuejs/vetur). Contribution welcome!

## Thanks

First and foremost, thanks to the amazing work [Katashin](https://github.com/ktsn) has done!

However, this feature wouldn't be possible without many people's work behind the scenes:

- 05/06/17: Prior to [Anders Hejlsberg](https://github.com/ahejlsberg)'s work on [Contextual `this`](https://github.com/Microsoft/TypeScript/pull/14141) in TS 2.3, it was impossible to type Vue component.
- 06/14/17: [Daniel Rosenwasser](https://github.com/DanielRosenwasser) (TS team) opened [PR](https://github.com/vuejs/vue/pull/5887) to add type definition to Vue.
- 08/17/17: [HerringtonDarkholme](https://github.com/HerringtonDarkholme) continued with another [PR](https://github.com/vuejs/vue/pull/6391) to add type definition to Vue (the same guy who posted the "go home you're drunk" picture in the beginning).
- 02/05/18: [Katashin](https://github.com/ktsn) sent [PR](https://github.com/vuejs/vetur/pull/681) for template type checking.
- Many [PRs](https://github.com/vuejs/vetur/pulls?q=is%3Apr+is%3Aclosed) and much help I have got from [HerringtonDarkholme](https://github.com/HerringtonDarkholme), [Nathan](https://github.com/sandersn) (TS Team) and [Daniel](https://github.com/DanielRosenwasser) (TS Team).
- The wonderful [TS AST Viewer](https://ts-ast-viewer.com) by [David Sherret](https://github.com/dsherret). If you are working with TypeScript AST, check it out!

