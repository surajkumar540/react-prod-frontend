import { createContext, useContext, useEffect, useState } from "react"

const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
    const [serviceType, setSeviceType] = useState("");
    const [contextEmail, setContextEmail] = useState("");
    const [contextPassword, setContextPassword] = useState("");
    useEffect(() => {
        console.log(serviceType)
        console.log(contextEmail)
    }, [serviceType])

    return (
        <ServiceContext.Provider value={{ serviceType, setSeviceType, contextEmail, setContextEmail, contextPassword, setContextPassword }}>
            {children}
        </ServiceContext.Provider>

    )
}


export const ServiceState = () => {
    return useContext(ServiceContext);
}

export default ServiceProvider;