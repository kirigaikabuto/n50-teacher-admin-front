<template>
  <ul class="sidenav app-sidenav" :class="{open: value}">

    <router-link
        v-for="link in links"
        :key="link.url"
        tag="li"
        active-class="active"
        :to="link.url"
        :exact="link.exact"
    >
      <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>

  </ul>
</template>

<script>
export default {
  name: "Sidebar",
  props: ["value"],
  data: () => ({
    links: [
      {
        title: "Главная",
        url: "/",
        exact: true,
      },
      {
        title: "История",
        url: "/history",
      },
      {
        title: "Планирование",
        url: "/planning",
      },
      {
        title: "Занятия",
        url: "/record",
      },
      {
        title: "Категории",
        url: "/categories",
      },
    ]
  })
}
</script>

<style scoped>

</style>