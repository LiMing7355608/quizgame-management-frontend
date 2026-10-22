<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppToast from '@/components/AppToast.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import DataPagination from '@/components/DataPagination.vue'
import { useToast } from '@/composables/useToast'
import { answerLabel, OPTION_LETTERS } from '@/data/questions'
import { nextId, quizStore, type QuizQuestion } from '@/data/store'

const PAGE_SIZE = 4

const { message, show } = useToast()

const page = ref(1)
const query = ref('')
const appliedQuery = ref('')

const filteredQuestions = computed(() => {
  const keyword = appliedQuery.value.trim().toLowerCase()
  if (!keyword) return quizStore.questions
  return quizStore.questions.filter((item) =>
    item.question.toLowerCase().includes(keyword),
  )
})

const total = computed(() => filteredQuestions.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const pageQuestions = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredQuestions.value.slice(start, start + PAGE_SIZE)
})

watch(totalPages, (pages) => {
  if (page.value > pages) page.value = pages
})

function search() {
  appliedQuery.value = query.value
  page.value = 1
}

function clearSearch() {
  query.value = ''
  appliedQuery.value = ''
  page.value = 1
}

/* ------------------------------ 弹窗 ------------------------------ */
const dialogOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  answerIndex: 0,
})
const formError = ref('')

const isEditing = computed(() => editingId.value !== null)
const dialogTitle = computed(() => (isEditing.value ? '编辑题目' : '添加新题目'))
const dialogSubtitle = computed(() =>
  isEditing.value
    ? '修改题干、选项或正确答案。'
    : '新增一道四选一的题目，正确答案以字母标记。',
)

function resetForm() {
  form.question = ''
  form.optionA = ''
  form.optionB = ''
  form.optionC = ''
  form.optionD = ''
  form.answerIndex = 0
  formError.value = ''
}

function openCreate() {
  editingId.value = null
  resetForm()
  dialogOpen.value = true
}

function openEdit(item: QuizQuestion) {
  editingId.value = item.id
  form.question = item.question
  form.optionA = item.options[0] ?? ''
  form.optionB = item.options[1] ?? ''
  form.optionC = item.options[2] ?? ''
  form.optionD = item.options[3] ?? ''
  form.answerIndex = item.answerIndex
  formError.value = ''
  dialogOpen.value = true
}

function submit() {
  const question = form.question.trim()
  const options = [form.optionA, form.optionB, form.optionC, form.optionD].map((option) =>
    option.trim(),
  )

  if (!question) {
    formError.value = '请填写题目。'
    return
  }
  if (options.some((option) => !option)) {
    formError.value = '请填写全部四个选项。'
    return
  }

  if (!isEditing.value) {
    quizStore.questions.unshift({
      id: nextId(quizStore.questions),
      question,
      options,
      answerIndex: form.answerIndex,
    })
    clearSearch()
    show('已添加新题目')
  } else {
    const target = quizStore.questions.find((item) => item.id === editingId.value)
    if (target) {
      target.question = question
      target.options = options
      target.answerIndex = form.answerIndex
    }
    show('已更新题目')
  }

  dialogOpen.value = false
}

function removeQuestion(item: QuizQuestion) {
  const index = quizStore.questions.findIndex((row) => row.id === item.id)
  if (index === -1) return
  quizStore.questions.splice(index, 1)
  show('已删除题目')
}
</script>

<template>
  <section class="page">
    <div class="page-head">
      <div>
        <p class="kicker">Question Management · 02</p>
        <h1 class="page-title">题目管理</h1>
        <p class="page-desc">维护题库中的四选一题目，核对选项与正确答案。</p>
      </div>
      <span class="page-index" aria-hidden="true">02</span>
    </div>

    <div class="toolbar">
      <label class="field toolbar__search">
        <span class="field-label">题目</span>
        <input
          v-model="query"
          class="text-input"
          type="search"
          placeholder="请输入题目关键词"
          autocomplete="off"
          @keyup.enter="search"
        />
      </label>

      <div class="toolbar__actions">
        <button v-if="appliedQuery" class="btn" type="button" @click="clearSearch">
          清除筛选
        </button>
        <button class="btn" type="button" @click="search">查询</button>
        <button class="btn btn--primary" type="button" @click="openCreate">
          添加题目
        </button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col" style="width: 4rem">序号</th>
            <th scope="col">题目</th>
            <th scope="col">选项</th>
            <th scope="col">答案</th>
            <th scope="col" class="cell-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageQuestions" :key="item.id">
            <td class="cell-index">{{ item.id }}</td>
            <td class="cell-title">{{ item.question }}</td>
            <td class="cell-options">
              <p v-for="(option, index) in item.options" :key="index">
                {{ OPTION_LETTERS[index] ?? '?' }}. {{ option }}
              </p>
            </td>
            <td class="cell-answer">{{ answerLabel(item) }}</td>
            <td class="cell-actions">
              <button class="action" type="button" @click="openEdit(item)">编辑</button>
              <button class="action" type="button" @click="removeQuestion(item)">
                删除
              </button>
            </td>
          </tr>
          <tr v-if="!pageQuestions.length">
            <td colspan="5" class="table-empty">没有找到匹配的题目</td>
          </tr>
        </tbody>
      </table>
    </div>

    <DataPagination
      v-model:page="page"
      :total-pages="totalPages"
      :total="total"
    />

    <BaseDialog
      v-model:open="dialogOpen"
      :title="dialogTitle"
      :subtitle="dialogSubtitle"
      width="42rem"
    >
      <form class="dialog-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">题目</span>
          <input
            v-model="form.question"
            class="text-input"
            type="text"
            placeholder="请输入题目"
            autocomplete="off"
          />
        </label>

        <div class="option-grid">
          <label class="field">
            <span class="field-label">选项 A</span>
            <input v-model="form.optionA" class="text-input" type="text" autocomplete="off" />
          </label>
          <label class="field">
            <span class="field-label">选项 B</span>
            <input v-model="form.optionB" class="text-input" type="text" autocomplete="off" />
          </label>
          <label class="field">
            <span class="field-label">选项 C</span>
            <input v-model="form.optionC" class="text-input" type="text" autocomplete="off" />
          </label>
          <label class="field">
            <span class="field-label">选项 D</span>
            <input v-model="form.optionD" class="text-input" type="text" autocomplete="off" />
          </label>
        </div>

        <label class="field answer-field">
          <span class="field-label">正确答案</span>
          <select v-model.number="form.answerIndex" class="select-input">
            <option
              v-for="(letter, index) in OPTION_LETTERS.slice(0, 4)"
              :key="letter"
              :value="index"
            >
              {{ letter }}
            </option>
          </select>
        </label>

        <p v-if="formError" class="field-error">{{ formError }}</p>
      </form>

      <template #footer>
        <button class="btn" type="button" @click="dialogOpen = false">取消</button>
        <button class="btn btn--primary" type="button" @click="submit">确定</button>
      </template>
    </BaseDialog>

    <AppToast :message="message" />
  </section>
</template>

<style scoped>
.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem 1.25rem;
}

.answer-field {
  width: 8rem;
}

@media (max-width: 600px) {
  .option-grid {
    grid-template-columns: 1fr;
  }
}
</style>
