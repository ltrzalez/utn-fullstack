import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function FormularioCategoria(props) {

    
    const params = useParams();
    const [form, setForm] = React.useState({
        id: "",
        nombre: ""        
    });

    const getCategorias = async (categoriaId) => {        
        try {
            const infoFromServer = await axios.get(`http://localhost:5000/categoria/${categoriaId}`)
            // console.table(infoFromServer.data)
            setForm(infoFromServer.data)            
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    const addCategoria = async (categoria) => {
        try{
            let res = await axios.post('http://localhost:5000/categoria', categoria)                            
                if( res.status === 200) {
                    alert("categoria añadida", res.request.response)
                    // props.history.push("/libro") esta linea de codigo no funciona pero se deberia implementar para volver al listado
                }
        } catch (error){ 
            let mensajeDeError = Object.values(error.response.data)
            alert(mensajeDeError)
        }  

    }

    const handleChangeNombre = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.nombre = e.target.value ;
        setForm(nuevoState)
    }

    React.useEffect(() => {
        getCategorias(params.id)
    }, [params]);


    return (
        <div>
            <form style={{ backgroundColor: 'red'}}>
                <div >
                    <label>Nombre</label>
                    <input type='text' placeholder='Titulo' value={form.nombre}  onChange={(e) => handleChangeNombre(e)}/>
                </div>
                <input type='submit' value={form.id ? 'Guardar Cambios' : 'Agregar categoria'} onClick={() => addCategoria(form)} />
            </form>
        </div>
    )
}
