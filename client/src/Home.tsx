import Axios from "axios";
import { backendServer } from "./helpers";

const Home = () => {
    Axios.get(backendServer("/feed")).then((res) => {
        console.log(res)
    })
    return (
        <h1> home </h1>

    );
}

export default Home;