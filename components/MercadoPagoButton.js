import React, { useState, useEffect } from 'react'
import axios from 'axios';


const MercadoPagoButton = ({ product }) => {
    const [url, setUrl] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const generateLink = async () => {
            setLoading(true)

try {
    const { data: preference } = await axios.post("/api/checkout", {
        product
    });

    setUrl(preference.url)
} catch (error) {
    console.log(error)
}
setLoading(false);
};

generateLink();
}, [product])


return (
<div>
{
    loading ? (
        <button>
            cargando
        </button>
    ) : (
        <>
            <a href={url}>Comprar ahora</a>
        </>
    )
}
</div>
)
}

export default MercadoPagoButton