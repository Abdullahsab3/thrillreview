import { backendServer } from "./helpers";


function APIPage(){

    return(<iframe height={"100%"} title="ThrillreviewAPIDocs" src={backendServer("/API")}></iframe>)
}

export default APIPage;