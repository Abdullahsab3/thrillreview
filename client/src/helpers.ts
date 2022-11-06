
  export function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const protocol: string = "http"
  const host: string = "localhost"
  const port: string = "5001"
  
  export function backendServer(route: string) {
    return protocol+"://"+host+":"+port+route;
  }
