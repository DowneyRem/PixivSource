<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps({
  actions: {
    type: Array,
    default: null
  },
  title: {
    type: String,
    default: ''
  }
})

const { frontmatter, lang } = useData()
// 定义内置的多语言词典
const i18n = {
  'zh-CN': {
    title: '⚡️ 快速导入'
  },
  'zh-TW': {
    title: '⚡️ 快速導入'
  },
  'en': {
    title: '⚡️ Quick Import'
  },
}

// 计算最终显示的标题（优先使用 props 传入的标题，其次根据当前语言获取默认标题）
const computedTitle = computed(() => {
  if (props.title) return props.title
  const currentLang = lang.value || 'zh-CN'
  const shortLang = currentLang.split('-')[0] // 例如 'en-US' 变 'en'
  if (i18n[currentLang]?.title) {
    return i18n[currentLang].title
  }
  if (i18n[shortLang]?.title) {
    return i18n[shortLang].title
  }
  if (i18n['en']?.title) {
    return i18n['en'].title
  }

  return i18n['zh-CN'].title
})

const computedActions = computed(() => {
  return props.actions || frontmatter.value.hero?.actions || []
})
</script>

<template>
  <div v-if="computedActions.length > 0" class="legado-actions-outer">
    <div class="legado-card main-mode">
      <div class="legado-header">
        <span class="header-title">{{ computedTitle }}</span>
      </div>

      <div class="actions-container">
        <a
            v-for="action in computedActions"
            :key="action.link"
            :href="withBase(action.link)"
            :target="action.target"
            class="action-btn alt"
        >
          <span class="btn-text">{{ action.text }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legado-actions-outer {
  max-width: 640px;
  margin: 32px auto;
  width: 100%;
}

.legado-card {
  background: var(--vp-c-bg-elevated);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 20px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  padding: 24px;
  box-sizing: border-box;
}

.legado-header {
  display: flex;
  margin-bottom: 20px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.actions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 16px;
  justify-content: center;
}

/* 默认状态下所有按钮使用 alt 样式 */
.action-btn.alt {
  background-color: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
  border: 1px solid var(--vp-button-alt-border);
}

/* 仅当鼠标悬浮（正下方）时，该按钮切换为 brand 颜色 */
.action-btn.alt:hover {
  background-color: var(--vp-c-brand-1) !important;
  color: var(--vp-button-brand-text) !important;
  border-color: var(--vp-c-brand-1) !important;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  border-radius: 14px;
  text-decoration: none !important;
  transition: background-color 0.25s, color 0.25s, border-color 0.25s, transform 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-text {
  font-size: 15px;
  font-weight: 700;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .legado-card {
    padding: 20px 16px;
  }
  .actions-container {
    gap: 12px 12px;
  }
  .action-btn {
    padding: 10px 18px;
    font-size: 14px;
  }
}
</style>