import React from "react";
import {NavigationBar} from "../components/Utilities/NavigationBar";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function App() {

    return <>
        <BrowserRouter>
            <NavigationBar/>
        </BrowserRouter>
        <ToastContainer
            position="bottom-center"
            autoClose={2000}
            limit={3}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    </>
}