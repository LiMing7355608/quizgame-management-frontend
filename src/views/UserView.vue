<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AppToast from '@/components/AppToast.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import DataPagination from '@/components/DataPagination.vue'
import { useToast } from '@/composables/useToast'
import { nextId, quizStore, type AdminUser } from '@/data/store'

const PAGE_SIZE = 4

const { message, show } = useToast()

const page = ref(1)
const query = ref('')
const appliedQuery = ref('')

const filteredUsers = computed(() => {
  const keyword = appliedQuery.value.trim().toLowerCase()
  if (!keyword) return quizStore.users
  return quizStore.users.filter((user) => user.name.toLowerCase().includes(keyword))
})

const total = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const pageUsers = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return filteredUsers.value.slice(start, start + PAGE_SIZE)
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
const form = reactive({ name: '', password: '', confirmPassword: '' })
const formError = ref('')

const isEditing = computed(() => editingId.value !== null)
const dialogTitle = computed(() => (isEditing.value ? '编辑用户' : '添加新用户'))
const dialogSubtitle = computed(() =>
  isEditing.value ? '修改该用户的显示名称。' : '创建一条新的用户记录，密码仅用于演示。',
)

function openCreate() {
  editingId.value = null
  form.name = ''
  form.password = ''
  form.confirmPassword = ''
  formError.value = ''
  dialogOpen.value = true
}

function openEdit(user: AdminUser) {
  editingId.value = user.id
  form.name = user.name
  form.password = ''
  form.confirmPassword = ''
  formError.value = ''
  dialogOpen.value = true
}

function todayStamp(): string {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

function submit() {
  const name = form.name.trim()

  if (!name) {
    formError.value = '请填写用户名。'
    return
  }

  if (!isEditing.value) {
    if (!form.password) {
      formError.value = '请填写密码。'
      return
    }
    if (form.password !== form.confirmPassword) {
      formError.value = '两次输入的密码不一致。'
      return
    }

    quizStore.users.unshift({
      id: nextId(quizStore.users),
      date: todayStamp(),
      name,
      address: '未填写',
    })

    clearSearch()
    show(`已添加用户「${name}」`)
  } else {
    const target = quizStore.users.find((user) => user.id === editingId.value)
    if (target) target.name = name
    show(`已更新用户「${name}」`)
  }

  dialogOpen.value = false
}

function removeUser(user: AdminUser) {
  const index = quizStore.users.findIndex((item) => item.id === user.id)
  if (index === -1) return
  quizStore.users.splice(index, 1)
  show(`已删除用户「${user.name}」`)
}
</script>

<template>
  <section class="page">
    <div class="page-head">
      <div>
        <p class="kicker">User Management · 01</p>
        <h1 class="page-title">用户管理</h1>
        <p class="page-desc">按用户名检索现有用户，或添加一位新的答题者。</p>
      </div>
      <span class="page-index" aria-hidden="true">01</span>
    </div>

    <div class="toolbar">
      <label class="field toolbar__search">
        <span class="field-label">用户名</span>
        <input
          v-model="query"
          class="text-input"
          type="search"
          placeholder="请输入用户名"
          autocomplete="off"
          @keyup.enter="search"
        />
      </label>

      <div class="toolbar__actions">
        <button v-if="appliedQuery" class="btn" type="button" @click="clearSearch">
          清除筛选
        </button>
        <button class="btn" type="button" @click="search">查询</button>
        <button class="btn btn--primary" type="button" @click="openCreate">添加用户</button>
      </div>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col" style="width: 10rem">日期</th>
            <th scope="col">姓名</th>
            <th scope="col" class="cell-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pageUsers" :key="user.id">
            <td class="cell-date">{{ user.date }}</td>
            <td>
              <div class="name-pop">
                <button
                  class="name-trigger"
                  type="button"
                  :aria-label="`查看 ${user.name} 的详细信息`"
                >
                  {{ user.name }}
                </button>
                <div class="name-card" role="tooltip">
                  <p class="name-card__title">{{ user.name }}</p>
                  <p>住址：{{ user.address }}</p>
                </div>
              </div>
            </td>
            <td class="cell-actions">
              <button class="action" type="button" @click="openEdit(user)">编辑</button>
              <button class="action" type="button" @click="removeUser(user)">删除</button>
            </td>
          </tr>
          <tr v-if="!pageUsers.length">
            <td colspan="3" class="table-empty">没有找到匹配的用户</td>
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
      width="30rem"
    >
      <form class="dialog-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">用户名</span>
          <input
            v-model="form.name"
            class="text-input"
            type="text"
            placeholder="请输入用户名"
            autocomplete="off"
          />
        </label>

        <template v-if="!isEditing">
          <label class="field">
            <span class="field-label">密码</span>
            <input
              v-model="form.password"
              class="text-input"
              type="password"
              placeholder="请输入密码"
              autocomplete="new-password"
            />
          </label>

          <label class="field">
            <span class="field-label">确认密码</span>
            <input
              v-model="form.confirmPassword"
              class="text-input"
              type="password"
              placeholder="请再次输入密码"
              autocomplete="new-password"
            />
          </label>
        </template>

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

.cell-date {
  white-space: nowrap;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  color: var(--fg-secondary);
}
</style>
