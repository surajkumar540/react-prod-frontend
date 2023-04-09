import { createContext, useContext, useEffect, useState } from "react"

const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
    const [serviceType, setSeviceType] = useState('suraj');

    useEffect(()=>{
        console.log('ho rhA HAI')
        console.log(serviceType)
    },[serviceType])

    return (
        <ServiceContext.Provider value={{ serviceType, setSeviceType }}>
            {children}
        </ServiceContext.Provider>

    )
}


export const ServiceState = () => {
    return useContext(ServiceContext);
}

export default ServiceProvider;