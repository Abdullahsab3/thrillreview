import { backendServer } from "./helpers";


/**
 * 
 * @returns The page for the API documentation
 * This page will be requested from the server
 * and then viewed here.
 */
function APIPage(){

    return(<iframe height={"100%"} title="ThrillreviewAPIDocs" src={backendServer("/API")}></iframe>)
}

export default APIPage;