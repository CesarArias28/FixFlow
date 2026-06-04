export const initialStore=()=>{
  return{
    message: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    email: localStorage.getItem("email") || null,
    userId: localStorage.getItem("userId") || null,
    property_id: localStorage.getItem("property_id") || null,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    case 'login':
    case 'login_success':
      return {
        ...store,
        token: action.payload.token,
        role: action.payload.role,
        email: action.payload.email,
        userId: action.payload.userId,
        property_id: action.payload.property_id
      };
    case 'logout':
      return {
        ...store,
        token: null,
        role: null,
        email: null,
        userId: null,
        property_id: null
      };
    default:
      throw Error('Unknown action.');
  }    
}

