<template>
  <div>
    <div class="page-title">
      <h3>Создать Урок</h3>
    </div>

    <div class=" col s12 m6 l4">
      <form class="form" v-on:submit="createLessonAction">

        <div class="input-field">
          <span class="card-title">Предметы</span>
          <multiselect v-model="subjectValue" :options="options" @input="asyncFind">

          </multiselect>
          <span class="card-title">Группа</span>
          <multiselect v-model="groupValue" :options="groupNames" @input="groupSelectFind">

          </multiselect>
        </div>

        <div class="input-field">
          <input
              v-model="lessonNameVal"
              id="name"
              type="text"
          >
          <label for="name">Название</label>
        </div>

        <div class="input-field">
          <input
              v-model="lessonDescVal"
              id="description"
              type="text"
          >
          <label for="description">Описание</label>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form  >
    </div>

    <div class="col s12 m6 l8">
      <form class="form" v-on:submit="uploadFormAction" >

        <div class="input-field">
          <span class="card-title">Предметы</span>
          <multiselect v-model="subjectValue" :options="options" @input="asyncFind">

          </multiselect>
          <span class="card-title">Группа</span>
          <multiselect v-model="groupValue" :options="groupNames" @input="groupSelectFind">

          </multiselect>

          <span class="card-title">Урок</span>
          <multiselect
              v-model="lessonValue"
              :options="lessons"
              label="name"
              trackBy="name"
              @input="lessonSelectFind"
          >

          </multiselect>
        </div>

        <label>File
          <input type="file" id="file" ref="file" v-on:change="onChangeFileUpload()"/>
        </label>
        <button class="btn waves-effect waves-light" type="submit">
          Загрузить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>

  </div>

</template>

<script>
import Multiselect from "vue-multiselect";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "CreateLesson",
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
      currentGroupSubject: null,
      lessonNameVal: "",
      lessonDescVal: "",
      lessonValue: null,
      file: '',
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
      "createLesson",
      "uploadFileLesson",

    ]),
    uploadFormAction() {
      console.log("upload form lesson id", this.lessonValue.id)
      console.log("upload from file", this.file)
      this.uploadFileLesson({file: this.file, id: this.lessonValue.id}).then((resp) => {
        console.log(resp)
      })
    },
    lessonSelectFind() {
      console.log("lesson select find", this.lessonValue)
    },
    createLessonAction(e) {
      e.preventDefault()
      let req = {
        name: this.lessonNameVal,
        description: this.lessonDescVal,
        group_subject_id: this.currentGroupSubject.id,
      }
      console.log("create lesson action ", req)
      this.createLesson(req).then((resp) => {
        console.log(resp)
      })
    },
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
        this.currentGroupSubject = resp
        console.log("group select find current group sub", resp)
        this.getLessonsByGroupSubjectId({id: resp.id}).then((myResp) => {
          for (let i of myResp.objects) {
            this.lessons.push(i)
          }
        })
      })
      console.log("current lessons", this.lessons)
      console.log("current group subject", this.currentGroupSubject)
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
    onChangeFileUpload() {
      this.file = this.$refs.file.files[0];
      console.log("on change file upload", this.file)
    }
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

<style scoped>

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>