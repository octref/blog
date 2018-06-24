<template>
  <Home v-if="$page.frontmatter.home"/>
  <Page v-else></Page>
</template>

<script>
import Vue from 'vue'
import Home from './Home.vue'
import Page from './Page.vue'

export default {
  components: { Home, Page }
}
</script>