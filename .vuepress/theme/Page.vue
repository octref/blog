<template>
  <div class="f6 avenir">
    <Nav :page="$page" />

    <section id="main" class="gray mb6 lh-copy">
      <ul class="ph0">
        <BlogItem :page="$page"></BlogItem>
      </ul>
      <Content/>
    </section>
  </div>
</template>

<script>
import Nav from './Nav.vue'
import BlogItem from './BlogItem.vue'

export default {
  components: { Nav, BlogItem }
}
</script>