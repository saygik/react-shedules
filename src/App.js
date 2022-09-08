import Routes from "./routes";
import {ToastContainer} from "react-toastify";
import { DataProvider } from './context/data';
import 'react-toastify/dist/ReactToastify.css';


function App() {return (<>
    <DataProvider>
        <Routes/>
    </DataProvider>
    <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
</>);}
export default App;
