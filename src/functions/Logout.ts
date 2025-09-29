

export const handleLogout:any =(role:string, navigate:(path:string, options?:any)=>void) =>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate(`/${role}/login`,{replace:true});
};