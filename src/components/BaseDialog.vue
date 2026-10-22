<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    subtitle?: string
    width?: string
  }>(),
  { subtitle: '', width: '34rem' },
)

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}>()

const panel = ref<HTMLElement | null>(null)

function close() {
  emit('update:open', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) close()
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value?.querySelector<HTMLElement>('input, select, button')?.focus()
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="open" class="overlay" @click.self="close">
        <div
          ref="panel"
          class="dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          :style="{ maxWidth: width }"
        >
          <header class="dialog__head">
            <div>
              <p class="kicker">Quiz Administration</p>
              <h2 class="dialog__title">{{ title }}</h2>
              <p v-if="subtitle" class="dialog__subtitle">{{ subtitle }}</p>
            </div>
            <button class="dialog__close" type="button" aria-label="关闭" @click="close">
              ×
            </button>
          </header>

          <div class="dialog__body">
            <slot />
          </div>

          <footer class="dialog__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: rgba(28, 28, 28, 0.28);
  backdrop-filter: blur(2px);
}

.dialog {
  width: 100%;
  max-height: calc(100vh - 3rem);
  padding: 1.75rem clamp(1.25rem, 3vw, 2rem) 1.5rem;
  overflow-y: auto;
  background-color: var(--bg);
  border: 1px solid var(--fg);
}

.dialog__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--line);
}

.dialog__title {
  margin-top: 0.35rem;
  font-family: var(--serif);
  font-size: 1.625rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.dialog__subtitle {
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--fg-secondary);
}

.dialog__close {
  flex: none;
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  margin-top: -0.25rem;
  font-family: var(--serif);
  font-size: 1.5rem;
  line-height: 1;
  color: var(--fg-tertiary);
  transition: color 0.2s var(--ease), transform 0.3s var(--ease);
}

.dialog__close:hover {
  color: var(--fg);
  transform: rotate(90deg);
}

.dialog__body {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.5rem 0;
}

.dialog__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
}

/* 过渡 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.25s var(--ease);
}

.dialog-enter-active .dialog,
.dialog-leave-active .dialog {
  transition: transform 0.3s var(--ease);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog,
.dialog-leave-to .dialog {
  transform: translateY(12px) scale(0.99);
}
</style>
