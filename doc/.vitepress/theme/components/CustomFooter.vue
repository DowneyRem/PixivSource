<template>
  <footer v-if="frontmatter.footer !== false" class="custom-footer">
    <p class="copyright" ref="footerRef">
            <span class="footer-group">Copyright © 2025-{{ currentYear }}
                <a href="https://github.com/DowneyRem/PixivSource" target="_blank" rel="noopener">PixivSource</a>
            </span>
      <span class="footer-group rights">All rights reserved.</span>
    </p>
  </footer>
</template>

<script setup>
import { useData, useRoute } from 'vitepress'
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const { frontmatter } = useData()
const route = useRoute()
const currentYear = new Date().getFullYear()
const footerRef = ref(null)

function alignToContent() {
  const footer = footerRef.value
  if (!footer) return

  if (window.innerWidth < 960) {
    footer.style.paddingLeft = ''
    footer.style.paddingRight = ''
    return
  }

  const content = document.querySelector('.VPDoc .vp-doc')
      ?? document.querySelector('.VPContent .VPDoc')
  if (!content) return

  const rect = content.getBoundingClientRect()
  const footerRect = footer.parentElement.getBoundingClientRect()

  footer.style.paddingLeft = `${Math.max(rect.left - footerRect.left, 0)}px`
  footer.style.paddingRight = `${Math.max(footerRect.right - rect.right, 0)}px`
}

let ro
onMounted(() => {
  nextTick(alignToContent)
  ro = new ResizeObserver(alignToContent)
  ro.observe(document.documentElement)
})
onUnmounted(() => ro?.disconnect())
watch(() => route.path, () => nextTick(alignToContent))
</script>

<style scoped>
.custom-footer {
  width: 100%;
  padding: 20px 0;
  background-color: var(--vp-c-bg);
}

.copyright {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 24px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  box-sizing: border-box;
}

.copyright a {
  color: inherit;
  text-decoration: underline;
  text-decoration-style: dotted;
  transition: color 0.25s;
}

.copyright a:hover {
  color: var(--vp-c-brand-1);
  text-decoration-style: solid;
}

@media (max-width: 640px) {
  .copyright {
    flex-direction: column;
    gap: 0;
    text-align: center;
  }

  .footer-group {
    display: block;
  }

  .rights {
    font-size: 13px;
    opacity: 0.8;
  }
}
</style>