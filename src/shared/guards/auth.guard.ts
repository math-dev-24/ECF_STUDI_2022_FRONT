import {useUserStore} from "@/stores/userStore";
import {tokenIsValid} from "@/shared/services";

export function isConnectGuard(){
    const userStore = useUserStore()
    if(!userStore.isConnected || !userStore.currentUser.user_active){
        return '/';
    }
}

export async function isNoConnectGuard(){
    const userStore = useUserStore()
    if (localStorage.token){
        const response = await tokenIsValid()
        if (response.status == 200){
            userStore.currentUser = JSON.parse(localStorage.user)
            userStore.isConnected = true
        }else{
            userStore.logout()
            userStore.sendMsg("Session Expiré", "warning")
        }
    }
    if(userStore.isConnected){
        return "/app"
    }
}

export async function tokenExpired(){
    const userStore = useUserStore()
    const response = await tokenIsValid()
    if (response.status == 200){
        console.log("token OK")
    }else{
        userStore.logout()
        userStore.sendMsg("Veuillez vous reconnecter", "warning")
        return "/"
    }
}


export function isAdminGuard(){
    const userStore = useUserStore()
    if (!userStore.currentUser.is_admin){
        return "/app"
    }
}