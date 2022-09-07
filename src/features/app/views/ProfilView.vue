<script setup lang="ts">
import {useUserStore} from "@/stores/userStore";
import {reactive} from "vue";
import ChangePass from "@/features/app/components/ChangePass.vue";
import ChangeName from "@/features/app/components/ChangeName.vue";

const userStore = useUserStore()

const state = reactive<{
  openPass: boolean,
  openName: boolean,

}>({
  openPass: false,
  openName: false
})



</script>


<template>
  <div class="container d_flex justify_content_center align_items_center flex_column">
    <h4 class="m_5">Bienvenue {{userStore.currentUser.user_name}}</h4>
    <div>
      <div class="m_5">email : {{userStore.currentUser.email}}</div>
    </div>
    <div class="d_flex justify_content_center align_items_center m_5">
      <div>nom : {{userStore.currentUser.user_name}}</div>
      <div @click="state.openName = true" class="ms_10" id="btn_modify">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
        </svg>
      </div>
    </div>
    <div class="m_5">
      Admin : {{userStore.currentUser.is_admin ? "Oui" : "Non"}}
    </div>

    <div>
      <div @click="state.openPass = !state.openPass" id="btn_change_pass">
        Changer de mot de passe
      </div>

      <div v-if="state.openPass" class="modal">
        <div class="modal_content">
          <ChangePass @go-close="state.openPass = false"/>
        </div>
        <div class="modal_back" @click="state.openPass = false"></div>
      </div>

      <div v-if="state.openName" class="modal">
        <div class="modal_content">
          <ChangeName @go-close="state.openName = false"/>
        </div>
        <div class="modal_back" @click="state.openName = false"></div>
      </div>

      <div class="need_new_pass_msg" v-if="userStore.currentUser.first_connect">
        Password actuel générer automatiquement. veuillez le changer !
      </div>
    </div>

  </div>

</template>

<style scoped lang="sass">
@import "@/assets/main.sass"
.error_input
  border: 1px solid red
.need_new_pass_msg
  color: red
#btn_change_pass
  text-align: center
  cursor: pointer
  transition: all .4s
  &:hover
    transform: scale(1.05)
    color: $secondary

#btn_modify
  cursor: pointer
  transition: color .4s
  &:hover
    color: $secondary
</style>