import { apiLogin } from "../api";

const getState = ({ getStore, setStore }) => ({
  store: {
    token: sessionStorage.getItem("token") || "",
    rol: sessionStorage.getItem("rol") || "",
    user: null
  },
  actions: {
    loginUnico: async ({ email, password, rol }) => {
      try{
        const data = await apiLogin({ email, password, rol });
        const token = data?.access_token || data?.token || "";
        const rolNorm = (data?.rol || rol || "").toLowerCase();
        if(!token) return false;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("rol", rolNorm);
        setStore({ token, rol: rolNorm, user: data?.usuario || null });
        return true;
      }catch(e){ console.error("loginUnico error", e); return false; }
    },
    logout: () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("rol");
      setStore({ token:"", rol:"", user:null });
    }
  }
});
export default getState;
