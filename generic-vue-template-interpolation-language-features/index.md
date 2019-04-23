---
title: "Generic Vue Template Interpolation Language Features"
date: "2019-04-23"
---

When Vue 2.0 and TypeScript 2.0 was released in 2016, people naturally wanted to use them together.

The sad thing is they didn't. You could make your code compile, but not without a lot of hassle. It's neither elegant (what Vue is all about) and type-safe (what TypeScript is all about). In Vue.js 2.5, typing definition are shipped in Vue.js and with some improvements on Vue CLI, it has become easier to use Vue and TypeScript. However, type-safety wise, there's still a lot to be desired.

One thing that people wanted most is template type checking, and this popular [blog post](https://herringtondarkholme.github.io/2016/10/03/vue2-ts2/) written by [HerringtonDarkholme](https://github.com/HerringtonDarkholme), a Vue.js and TypeScript contributor, correctly summarized the situation:

![blog](/generic-vue-template-interpolation-language-features/blog.png)

Well, the statement is no longer true with Vetur's 0.19.0 release:

<video autoplay="" loop="" muted="" playsinline="" controls="">
  <source src="/generic-vue-template-interpolation-language-features/interpolation.mp4" type="video/mp4">
</video>

These Language Server Protocol functionality becomes available for Vue interpolations:

- Auto complete (introduced in 0.18.0)
- Diagnostics (error checking / type checking)
- Hover information
- Jump to definition
- Find References

You can read more about how this feature works in Vetur's [documentation](https://vuejs.github.io/vetur/interpolation). This post explains how this feature is implemented.

## The Backstory

Vetur builds on top of TypeScript's [Language Server API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API). To make TypeScript understand Vue files, Vetur masks `.vue` files as TS files. When you see a SFC like this:

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

Vetur then surfaces the Language Server Protocol responses sent back from TypeSript Language Service on the `*.vue` files. There's a lot going under the surface to make this work, but that's another topic.

In 2017, Vue.js core team member [Katashin](https://github.com/ktsn) opened an [issue](https://github.com/vuejs/vetur/issues/209) to discuss template expression type-checking. The proposed approach was:

- Extract `<template>` code from `.vue` files
- Use [vue-eslint-parser](https://github.com/mysticatea/vue-eslint-parser) to parse the program into an ESLint AST
- Write a custom AST transformer to transform the ESLint AST into a TypeScript SourceFile
- Feed the virtual file into TypeScript Language Service to get language feature responses
- Map back the responses' to the `.vue` files

This sounds like a lot of work and resource heavy, so I thought it's never gonna happen. However, almost a year later, [Katashin](https://github.com/ktsn) opened a [Pull Request](https://github.com/vuejs/vetur/pull/681) to implement this feature. To my surprise, it more or less worked.

For the `<template>` region in the above code, the transformed TypeScript code looks more or less like this:

```ts
import __Component from "./Component.vue";
import { __vlsRenderHelper, __vlsComponentHelper, __vlsIterationHelper, __vlsListenerHelper } from "vue-editor-bridge";
__vlsRenderHelper(__Component, function () {
    __vlsComponentHelper("div", { props: {}, on: {}, directives: [] }, [this.msg]);
});
```

The `__Component` refers to the `.vue` file itself, which Vetur could resolve. The `__vls` helpers contextually type `this` in the function context:

```ts
export declare const __vlsRenderHelper: {
  <T>(Component: (new (...args: any[]) => T), fn: (this: T) => any): any;
};
```

When you type `m` inside the interpolation region:

- `this.msg` becomes `this.m`
- Vetur queries TypeScript Language Service on the virtual file to get an error on the span of `this.m` that `m doesn't exist on 'this'`
- Vetur maps it back to the position of `m` inside the `.vue` file.

This sounds all good, but at that time Vetur suffered from performance issues. Doing this requires spinning up another TypeScript Language Service, and I thought this is going to double the CPU / memory usage of Vetur, so I left the PR languish for quite some time.

The other reason that I didn't merge the PR in immediately was that I would want language features "just works" inside the template interpolation regions. Vetur could handle embedded content, but not the embedded-embedded JS-in-HTML-in-Vue yet.

## Picking Up

After graduating in 2017 and then joining Microsoft, I haven't had much time to work on Vetur. However, this year I managed to get three months to work full-time on Vetur (that's why you see Vetur's milestone on VS Code [iteration plans](https://github.com/Microsoft/vscode/issues/71830)).

Looking back at the PR in 2019, I realized a few things:

- The PR actually avoided the "dobule Language Service" performance problem by using a single `ts.createDocumentRegistry` to manage the underlying documents for both Language Service.
- With Vetur's bundled TypeScript 2.8, this wouldn't likely work well. Many people are now on TS 3.0+, and if they are using new features in TS in the `<script>` region, the Language Service would crash or report wrong diagnostic errors.
- I cannot use it for template interpolation completion, because the ESLint parser can only parse complete expressions but while doing auto completion, the source code is in invalid state 90% of the time. This really bothers me because typing inside the template (to fix the errors) is still like typing in a TXT file.
- Other static language features that would work only on valid SourceFiles such as hover / references / definition would work fine.

So, in preparation, I started building [Template Interpolation Completion](https://github.com/vuejs/vetur/blob/master/CHANGELOG.md#template-interpolation-completion) with another approach (traversing the TypeScript AST in the original `.vue` file and generating the completion items myself), [decoupled](https://github.com/vuejs/vetur/blob/master/CHANGELOG.md#using-workspace-typescript-version) Vetur from a fixed version of TypeScript, and did some refactorings to handle double embedded regions.

I rebased the original PR off the current master. However, things aren't all rosy.

## Some Todos

## Credits