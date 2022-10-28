import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { DataProvider } from './context/data';
import { Auth0Provider } from './context/auth0';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from "react-router-dom";

const Auth0ProviderWithRedirectCallback = ({
    children,
    ...props
  }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const onRedirectCallbackComplate = (location) => {
       navigate((!!location && location) || window.location.pathname);
    };
  
    const getCurrentLocation = () => location.pathname

    return (
      <Auth0Provider getCurrentLocation={getCurrentLocation} onRedirectCallbackComplate={onRedirectCallbackComplate} {...props}>
        {children}
      </Auth0Provider>
    );
  };

function App() {
    return (<>
        <Auth0ProviderWithRedirectCallback
        apiBase={process.env.REACT_APP_API}
        redirectUri="http://10.2.146.202:3000/auth"
        >
            <DataProvider>
                <Routes />
            </DataProvider>
        </Auth0ProviderWithRedirectCallback>
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
    </>);
}
export default App;
