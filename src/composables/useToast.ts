import { onUnmounted, ref } from 'vue'

export function useToast(duration = 2600) {
  const message = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  function show(text: string) {
    message.value = text
    clearTimeout(timer)
    timer = setTimeout(() => {
      message.value = ''
    }, duration)
  }

  onUnmounted(() => clearTimeout(timer))

  return { message, show }
}
