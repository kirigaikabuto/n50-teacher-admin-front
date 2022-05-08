<template>
  <div>
    <div class="page-title">
      <h3>Главная</h3>

      <button class="btn waves-effect waves-light btn-small">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <div class="row">

      <div class="col s12 m6 l4">
        <div class="card light-blue bill-card">
          <div class="card-content white-text">
            <span class="card-title">Предметы</span>
            <multiselect v-model="subjectValue" :options="options" @input="asyncFind">

            </multiselect>

            <multiselect v-model="groupValue" :options="groupNames" @input="groupSelectFind">

            </multiselect>
          </div>

        </div>

      </div>

      <div class="col s12 m6 l8">
        <div class="card orange darken-3 bill-card">
          <div class="card-content white-text">
            <div class="card-header">
              <span class="card-title">Занятия</span>
            </div>
            <table>
              <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Дата</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="lesson in lessons" v-bind:key="lesson.id">
                <router-link
                    :key="lesson.id"
                    :to="{ name: 'lessonDetail', params: { id: lesson.id }}"
                    active-class="active"

                >
                  <td><a class="waves-effect waves-orange pointer">{{ lesson.name }}</a></td>
                </router-link>

                <td>{{ lesson.description }}</td>
                <td>{{ lesson.created_date }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>

</style>

<script>
// @ is an alias to /src
import Multiselect from 'vue-multiselect'
import {mapActions, mapGetters} from "vuex"

export default {
  name: 'Home',
  data() {
    return {
      link: "/planning",
      subjectValue: null,
      groupValue: null,
      options: [],
      temp: [],
      groups: [],
      groupNames: [],
      getTeacherSubjectResponse: null,
      globalCurrentTeacherSubjects: null,
      lessons: [],
    }
  },
  computed: {
    ...mapGetters([
      "GetTeacherSubjectResponse",
      "GetSubject",
      "GetGroupSubject",
      "GetGroup",
      "ErrorResponse",
    ])
  },
  methods: {
    ...mapActions([
      "getTeacherSubjects",
      "getSubjectById",
      "getGroupSubjects",
      "getGroupById",
      "getGroupSubjectByTeacherSubGroupId",
      "getLessonsByGroupSubjectId",

    ]),
    groupSelectFind() {
      let currentGroup;
      console.log("group select find current", this.groupValue)

      console.log("group select find current", this.groups)
      for (let i of this.groups) {
        if (i.name === this.groupValue) {
          currentGroup = i
          break
        }
      }
      console.log("group select find current group", currentGroup)
      console.log("group select find current", this.globalCurrentTeacherSubjects)
      this.getGroupSubjectByTeacherSubGroupId({
        groupId: currentGroup.id,
        teacherSubId: this.globalCurrentTeacherSubjects.id
      }).then((resp) => {
        console.log("group select find current group sub", resp)
        this.getLessonsByGroupSubjectId({id: resp.id}).then((myResp) => {
          for (let i of myResp.objects) {
            this.lessons.push(i)
          }
        })
      })
      console.log("current lessons", this.lessons)
    },
    asyncFind() {
      console.log("from async find", this.temp)
      let currentSubject = {};
      for (let i of this.temp) {
        console.log("from async cycle", i)
        if (i.name === this.subjectValue) {
          currentSubject = i
          break
        }
      }
      console.log("from async find current subject", currentSubject)
      let currentTeacherSubjects;
      for (let i of this.getTeacherSubjectResponse) {
        if (i.subject_id === currentSubject.id) {
          currentTeacherSubjects = i
          break
        }
      }
      console.log("current subject", currentSubject)
      console.log("current teacher subject", currentTeacherSubjects)
      this.groupNames = []
      this.globalCurrentTeacherSubjects = currentTeacherSubjects
      this.getGroupSubjects({id: currentTeacherSubjects.id}).then((resp) => {
        for (let i of resp.objects) {
          this.getGroupById({id: i.group_id}).then((tempResp) => {
            this.groupNames.push(tempResp.name)
            this.groups.push(tempResp)
          })

        }
        console.log("currect group subjects", this.groups)
      })
    },
  },
  components: {
    Multiselect
  },
  mounted() {
    this.getTeacherSubjects({}).then((respData) => {
      console.log("from mounted", respData.objects)
      this.getTeacherSubjectResponse = respData.objects
      for (let i of respData.objects) {
        this.getSubjectById({id: i.subject_id}).then((resp) => {
          this.options.push(resp.name)
          this.temp.push(resp)
        })
      }
      console.log("from mounted temp array", this.temp)

    });

  },
  beforeCreate() {
    let data = localStorage.getItem("userToken")
    console.log(JSON.parse(data))
    if (data === null) {
      this.$router.push({"name": "login"})
    }

  }
}
</script>
