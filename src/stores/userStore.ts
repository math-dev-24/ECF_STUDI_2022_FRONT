import {defineStore} from "pinia";
import type {User, UserConnectInterface} from "@/shared/interfaces";
import {connectUser, deletePartnerOrStructService, updateUser} from "@/shared/services";
import {usePartnerStore} from "@/stores/partnerStore";
import {useStructStore} from "@/stores/structStore";
import {defaultUser} from "@/shared/interfaces";
import {useRouter} from "vue-router";


export type Style = "danger" | "success" | "warning"

interface PopPupInterface{
    text: string,
    style: Style
}

interface UserStoreInterface{
    isConnected : boolean,
    currentUser: User,
    list_pop: PopPupInterface[]
}


export const useUserStore = defineStore("userStore", {
    state: (): UserStoreInterface => ({
        isConnected: false,
        currentUser: defaultUser,
        list_pop : []
    }),
    actions: {
        sendMsg(msg: string, style : Style){
            const new_msg: PopPupInterface = {text: msg, style: style}
            this.list_pop.push(new_msg)
            setTimeout(()=>{
                this.list_pop.splice(0,1);
            },4000)
        },
        async goConnect (formConnect: UserConnectInterface) {
            try {
                const response = await connectUser(formConnect);
                this.currentUser = response.user;
                localStorage.setItem('token', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user))
                this.isConnected = true
                if (response.user.first_connect){
                    this.sendMsg("Veuillez modifier votre mot de passe", "danger");
                }
                this.sendMsg("Vous êtes maintenant connecté", "success")
            } catch (e) {
                this.isConnected = false
                // @ts-ignore
                this.sendMsg(e.error, "danger")
            }
        },
        logout(){
            this.currentUser = defaultUser;
            this.isConnected = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        async updateUser(item:string, column: string)
        {
            return await updateUser(this.currentUser.email, item, column);
        },
        async updateProfil_url(email:string, profil:string){
            return await updateUser(email, profil, "profil_url");
        },
        async updatePassword(password: string)
        {
            return await updateUser(this.currentUser.email, password, "password");
        },

        async updateName(email:string, name: string)
        {
            return await updateUser(email, name, "user_name");
        },

        async updateActive(email: string, gestion_active:number)
        {
            return await updateUser(email, gestion_active, "user_active")
        },
        async deletePartnerOrStruct(id : number, type:string)
        {
            const response = deletePartnerOrStructService(id, type);
            if (type === "partner"){
                const partnerStore = usePartnerStore()
                const partnerIndex = partnerStore.partner.findIndex(p => p.id === id)
                if (partnerIndex !== -1){
                    partnerStore.partner.splice(partnerIndex, 1)
                    partnerStore.needRefresh = true
                }
            }else{
                const structStore = useStructStore()
                const structIndex = structStore.struct.findIndex(s => s.id === id)
                if (structIndex !== -1){
                    structStore.struct.splice(structIndex, 1)
                    structStore.needRefresh = true
                }
            }
        }
    }
})
