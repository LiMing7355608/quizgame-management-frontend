<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const visiblePages = computed(() => {
  const total = props.totalPages
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const start = Math.min(Math.max(props.page - 2, 1), total - 4)
  return Array.from({ length: 5 }, (_, index) => start + index)
})

function go(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <nav class="pager" aria-label="分页">
    <p class="pager__meta">
      共 <em>{{ total }}</em> 条 · 第 <em>{{ page }}</em> / {{ totalPages }} 页
    </p>

    <div class="pager__controls">
      <button
        class="pager__arrow"
        type="button"
        :disabled="page <= 1"
        aria-label="上一页"
        @click="go(page - 1)"
      >
        ← 上一页
      </button>

      <button
        v-for="item in visiblePages"
        :key="item"
        class="pager__page"
        :class="{ 'is-active': item === page }"
        type="button"
        :aria-current="item === page ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item }}
      </button>

      <button
        class="pager__arrow"
        type="button"
        :disabled="page >= totalPages"
        aria-label="下一页"
        @click="go(page + 1)"
      >
        下一页 →
      </button>
    </div>
  </nav>
</template>
