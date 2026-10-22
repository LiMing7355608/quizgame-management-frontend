<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { quizStore } from '@/data/store'

const dateline = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date())

const userCount = computed(() => quizStore.users.length)
const questionCount = computed(() => quizStore.questions.length)
</script>

<template>
  <div class="admin">
    <header class="masthead">
      <RouterLink to="/user" class="brand" aria-label="返回 Quiz 后台管理首页">
        <span class="brand__dot" aria-hidden="true"></span>
        <span class="brand__text">
          <span class="brand__kicker">Quiz Administration · Est. 2026</span>
          <span class="brand__title">Quiz 后台管理</span>
        </span>
      </RouterLink>

      <p class="masthead__meta">
        <span>{{ dateline }}</span>
        <span aria-hidden="true">·</span>
        <span>{{ userCount }} 位用户 / {{ questionCount }} 道题目</span>
      </p>
    </header>

    <div class="shell">
      <aside class="sidebar">
        <p class="sidebar__label">管理选项</p>

        <nav class="nav" aria-label="后台管理导航">
          <RouterLink to="/user" class="nav__item">
            <span class="nav__index">01</span>
            <span class="nav__label">用户管理</span>
            <span class="nav__arrow" aria-hidden="true">↗</span>
          </RouterLink>
          <RouterLink to="/question" class="nav__item">
            <span class="nav__index">02</span>
            <span class="nav__label">题目管理</span>
            <span class="nav__arrow" aria-hidden="true">↗</span>
          </RouterLink>
        </nav>

        <div class="sidebar__foot">
          <p>{{ userCount }} 位用户</p>
          <p>{{ questionCount }} 道题目</p>
        </div>
      </aside>

      <main class="main">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ------------------------------ 页头 ------------------------------ */
.masthead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 2.25rem clamp(1.25rem, 4vw, 3.5rem) 1.75rem;
  border-bottom: 1px solid var(--line-strong);
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand__dot {
  position: relative;
  flex: none;
  width: 30px;
  height: 30px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  animation: dot-pulse 4s var(--ease) infinite;
}

.brand__dot::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 7px;
  height: 7px;
  margin: auto;
  border-radius: 50%;
  background-color: var(--fg);
  animation: dot-core 4s var(--ease) infinite;
}

.brand__kicker {
  display: block;
  font-size: 0.625rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--fg-tertiary);
}

.brand__title {
  display: block;
  font-family: var(--serif);
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.masthead__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-tertiary);
}

/* ------------------------------ 主体 ------------------------------ */
.shell {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(200px, 240px) minmax(0, 1fr);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem clamp(1.25rem, 3vw, 2.5rem);
  border-right: 1px solid var(--line);
}

.sidebar__label {
  margin-bottom: 0.25rem;
  font-size: 0.625rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--fg-tertiary);
}

.nav {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line);
}

.nav__item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.9rem 0.25rem 0.9rem 1rem;
  border-bottom: 1px solid var(--line);
  color: var(--fg-secondary);
  transition:
    color 0.2s var(--ease),
    background-color 0.2s var(--ease);
}

.nav__item:hover {
  color: var(--fg);
  background-color: var(--tint);
}

.nav__index {
  font-family: var(--serif);
  font-size: 0.75rem;
  font-style: italic;
  color: var(--fg-tertiary);
  transition: color 0.2s var(--ease);
}

.nav__label {
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  transition:
    font-style 0.4s var(--ease),
    font-size 0.4s var(--ease);
}

.nav__arrow {
  margin-left: auto;
  font-size: 0.75rem;
  opacity: 0;
  transform: translate(-4px, 4px);
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.nav__item:hover .nav__arrow {
  opacity: 1;
  transform: none;
}

.nav__item.router-link-active {
  color: var(--fg);
}

.nav__item.router-link-active::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--fg);
  transform: translateY(-50%);
}

.nav__item.router-link-active .nav__index {
  color: var(--fg);
}

.nav__item.router-link-active .nav__label {
  font-family: var(--serif);
  font-size: 1rem;
  font-style: italic;
}

.sidebar__foot {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
  font-size: 0.625rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--fg-tertiary);
}

.main {
  min-width: 0;
  padding: 2.5rem clamp(1.25rem, 4vw, 3.5rem) 4rem;
}

/* ------------------------------ 响应式 ------------------------------ */
@media (max-width: 900px) {
  .masthead {
    padding: 1.5rem 1.25rem 1.25rem;
  }

  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    gap: 0.75rem;
    padding: 1.25rem;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .nav {
    flex-direction: row;
    gap: 0.5rem;
    border-top: 0;
  }

  .nav__item {
    flex: 1;
    justify-content: center;
    padding: 0.7rem 0.75rem;
    border: 1px solid var(--line);
  }

  .nav__item.router-link-active {
    border-color: var(--line-strong);
    background-color: var(--tint);
  }

  .nav__item.router-link-active::before {
    display: none;
  }

  .nav__arrow {
    display: none;
  }

  .sidebar__foot {
    display: none;
  }

  .main {
    padding: 1.75rem 1.25rem 3rem;
  }
}
</style>
