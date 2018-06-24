<template>
  <li class="flex justify-between pb3">
    <a class="link" :href="cleanPath">{{ page.title }}</a>
    <span class="date gray">{{ page.frontmatter.date }}</span>
  </li>
</template>

<script>
export default {
  props: ['page'],
  computed: {
    cleanPath() {
      return this.page.path.replace(/.html$/g, '')
    }
  }
}
</script>
