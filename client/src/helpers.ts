
  export function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  export function backendServer(route: string) {
    const protocol: string = "http"
    const host: string = "localhost"
    const port: string = "5000"
    return protocol+"://"+host+":"+port+route;
  }
