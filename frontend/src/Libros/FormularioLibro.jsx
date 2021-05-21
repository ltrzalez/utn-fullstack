import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function FormularioLibro(props) {

    const params = useParams();
    const [categorias, setCategorias] = React.useState()
    const [form, setForm] = React.useState({
        id: "",
        nombre: "",
        descripcion: "",
        categoria_id: "",
        persona_id: null
    });

    

    const getLibros = async (libroId) => {
        try {
            const infoFromServer = await axios.get(`http://localhost:5000/libro/${libroId}`)
            // console.table(infoFromServer.data)
            setForm(infoFromServer.data[0])
            console.log(infoFromServer.data[0])            
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    

    const getCategorias = async () => {        
        try {
            const infoFromServer = await axios.get(`http://localhost:5000/categoria`)
            // console.table(infoFromServer.data)
            setCategorias(infoFromServer.data)            
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    // ver de agregar un if en esta funcion para tambien hacer el metodo put
    const addLibro = async (libro) => {
        console.log(params.id)
        if(libro.id === params.id ){
            let res = await axios.put('http://localhost:5000/libro', libro)
            console.log(res) 
            alert(res)
        }        
        try{            
            let res = await axios.post('http://localhost:5000/libro', libro)                            
            console.log(res)     
            alert("Libro agregado a la biblioteca")    
        } catch (error){ 
            let mensajeDeError = Object.values(error.response.data)
            console.log(form)
            alert(mensajeDeError)
        }  

    }

    const handleChangeNombre = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.nombre = e.target.value ;
        setForm(nuevoState)
    }
    
    const handleChangeDescripcion = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.descripcion = e.target.value ;
        setForm(nuevoState)
    }

    const handleChangeCategoria = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.categoria_id = e.target.value ;
        setForm(nuevoState)
    }

    // mapear los select y hacer el on change correspondiente, ya que si se llega a este componente desde editar,
    // el select no tiene valor y no se puede postiar un nuevo libro


    React.useEffect(() => {
        getLibros(params.id)
        getCategorias()
    }, [params]);

    
    const renderizarSelect = (arrayDeOpciones) => {
        return (
            <>
                {arrayDeOpciones.map((opcion) => {
                    return <option key={opcion.index} value={opcion.id}>{opcion.nombre}</option>
                })}
            </>
        )
    }




    return (
        <div>
            <form style={{ backgroundColor: 'red'}}>
                <div >
                    <label>Nombre</label>
                    <input type='text' placeholder='Titulo' value={form.nombre}  onChange={(e) => handleChangeNombre(e)}/>
                </div>
                <div >
                    <label>Descipcion</label>
                    <input type='text' placeholder='Descripcion' value={form.descripcion} onChange={(e) => handleChangeDescripcion(e)}/>
                </div>            
                <div>
                    <label>Elige una categoria</label>
                    <select name={form.categoria_id} onChange={(e) => handleChangeCategoria(e)}>
                        { categorias !== undefined ? renderizarSelect(categorias) : 'no hay opciones ' }
                    </select>
                </div> 
                <input type='submit' value={form.id ? 'Guardar Cambios' : 'Agregar libro'} onClick={() => addLibro(form)} />
            </form>
        </div>
    )
}
