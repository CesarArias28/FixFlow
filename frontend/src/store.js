export const initialStore=()=>{
  return{
    message: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    email: localStorage.getItem("email") || null,
    userId: localStorage.getItem("userId") || null,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    case 'login_success':
      return {
        ...store,
        token: action.payload.token,
        role: action.payload.role,
        email: action.payload.email,
        userId: action.payload.userId
      };
    case 'logout':
      return {
        ...store,
        token: null,
        role: null,
        email: null,
        userId: null
      };
    default:
      throw Error('Unknown action.');
  }    
}

