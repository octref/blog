<template>
  <div class="f6 avenir">
    <Nav :page="$page" />

    <section id="main" class="gray mb6 lh-copy">
      <ul class="ph0">
        <BlogItem
          v-for="(page ,i) in postsOrderedByDate"
          v-if="!page.frontmatter.top_page"
          :page="page" :key="i"
        ></BlogItem>
      </ul>
    </section>
  </div>
</template>

<script>
import Nav from './Nav.vue'
import BlogItem from './BlogItem.vue'

export default {
  components: { Nav, BlogItem },
  computed: {
    postsOrderedByDate() {
      return this.$site.pages
        .filter(p => !p.frontmatter.top_page)
        .sort((p1, p2) => p1 > p2)
        .reverse()
    },
    data() {
      return this.$page.frontmatter
    }
  }
}
</script>