---
title: 'Stop breaking links with JavaScript'
date: '2020-04-26'
tags: ['tech']
---

Link is a fundamental element of the web. Today, JavaScript is breaking it.

Let's take a look at Google. Search for "salk institute". You'll see a small map to your right.

Left click - it opens Google Map.

Right click - open link in new tab - it goes to Google Search.

![Google broken map link](google-broken-map-link.gif)

Twitter is even worse. Let's go to "Explore / Trending".

Right click "News" - open link in new tab - it goes to "For you".

Now under "Trending" - right click a trend - browser doesn't even know it's a link.

![Twitter broken link](twitter-broken-link.gif)

This sucks for me, as I cannot rely on Cmd+Click to open link in a new tab. This sucks even more for disabled people, who cannot use screen readers to access the broken links.

`<a>` has been there since the beginning of the World Wide Web. If you are not ready to
implement all browser behaviors for `<a>` in `<div>`, and you are not making your `<div>` as accessible as `<a>`, use `<a>`.

It's unsettling to watch more and more people adding JavaScript only to break fundamental aspects of the web. Back button should go to previous page. Refresh should scroll to the same vertical reading position. Links should work like links.

It's interesting to note that such changes happened as more and more websites became "apps". There is no "link" in apps. As people port the app experience onto the web, they reimplemented buttons, not links.
