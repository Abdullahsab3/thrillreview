
  export function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const protocol: string = "http"
  const host: string = "api.thrillreview.com"
  const port: string = "80"
  
  export function backendServer(route: string) {
    return protocol+"://"+host+":"+port+route;
  }

  // has to be changed by thrillreview.com!
  const clientsideport: string = "80"
  export function getThrillreviewWebsiteLink(route:string){
    return protocol + "://"+"thrillreview.com"+":"+clientsideport+ "/" + route;
  }

  export function imageExists(url: string) {

    var http = new XMLHttpRequest();
  
    http.open('HEAD', url, false);
    http.send();
    
    return http.status < 400;
  }