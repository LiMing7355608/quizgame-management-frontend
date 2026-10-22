<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="message" class="toast" role="status" aria-live="polite">
        <span class="toast__rule" aria-hidden="true"></span>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  right: clamp(1.25rem, 4vw, 3rem);
  bottom: clamp(1.25rem, 4vw, 3rem);
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  max-width: min(24rem, calc(100vw - 2.5rem));
  padding: 0.8rem 1.1rem;
  background-color: var(--fg);
  color: var(--bg);
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  line-height: 1.5;
}

.toast__rule {
  width: 1.5rem;
  height: 1px;
  background-color: currentColor;
  opacity: 0.6;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s var(--ease),
    transform 0.3s var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
