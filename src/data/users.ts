export interface AdminUser {
  id: number
  date: string
  name: string
  address: string
}

export const seedUsers: AdminUser[] = [
  { id: 1, date: '2016-05-02', name: '张三', address: '上海市普陀区金沙江路 1518 弄' },
  { id: 2, date: '2016-05-04', name: '李四', address: '北京市朝阳区人民路302号' },
  { id: 3, date: '2016-05-01', name: '王五', address: '云南省昆明市第四大街23号' },
  { id: 4, date: '2016-05-03', name: '老六', address: '天津市滨海新区中新友好图书馆' },
]
