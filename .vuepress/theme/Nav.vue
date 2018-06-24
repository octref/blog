<template>
  <header id="header" class="measure-wide center mt6 mb4">
    <nav>
      <div class="mb2 dib">
        <a class="gray link" :class="{ active: page.path !== '/about' }" href="/" title="blog">blog</a>
        .
        <a class="gray link" :class="{ active: page.path === '/about' }" href="/about" title="matsu">matsu</a>
      </div>
      <div>
        <a class="rss gray link" href="/feed.xml" title="matsu" >/rss</a>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  props: ['page']
}
</script>
