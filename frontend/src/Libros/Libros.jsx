import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Libros(props) {
    
    const [libros, setLibros] = React.useState([])
    const [categorias, setCategorias] = React.useState([])
    const [personas, setPersonas] = React.useState([])
    
    const getLibros = async () => {
        try {
            const infoFromServer = await axios.get('http://localhost:5000/libro')
            // console.table(infoFromServer.data)
            setLibros(infoFromServer.data)
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    const getCategorias = async () => {
        try {
            const infoFromServer = await axios.get('http://localhost:5000/categoria')
            // console.table(infoFromServer.data)
            setCategorias(infoFromServer.data)
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    const getPersonas = async () => {
        try {
            const infoFromServer = await axios.get('http://localhost:5000/persona')
            // console.table(infoFromServer.data)
            setPersonas(infoFromServer.data)
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    const deleteLibro = async (libroId) => {
        try {
            await axios.delete(`http://localhost:5000/libro/${libroId}`)
            getLibros()
            props.history.push("/libro")
        } catch (error) {
            alert(Object.values(error.response.data))
            // props.history.push("/libro")
        }
    }
   
    const devolverLibro = async (libroId) => {
        try {
            let respuesta = await axios.put(`http://localhost:5000/libro/devolver/${libroId}`)
            alert(respuesta.data)
        } catch (error) {
            console.log(error)
            alert("lo sentimos tuvimos un problema")
        }
    }

    const prestarLibro = async (libroId, personaId) => {
        personaId = { persona_id: personaId}
        console.log(libroId, personaId)
        try {
            let respuesta = await axios.put(`http://localhost:5000/libro/prestar/${libroId}`, personaId)
            alert(respuesta.data)
        } catch (error) {
            console.log(error)
            alert(Object.values(error.response.data))
        }
    }



    React.useEffect(() => {
        getLibros();
        getCategorias(); 
        getPersonas();       
    }, [libros]);

    const renderizarPrestarDevolver = (libroId, personaId) => {

        

        const handlePersona = (e) => {
            personaId = e.target.value                        
        }      

        return(
            <>
                <td>{ personaId === null &&
                    <select onChange={(e) => handlePersona(e)} >
                        {personas.map((persona) => {                                                   
                            return <option key={persona.id} value={persona.id} >{persona.nombre}</option>
                        })}
                    </select>
                    }
                    { personaId === null
                        ? <button onClick={() => prestarLibro(libroId, personaId)}>Prestar</button> 
                        : <button onClick={() => devolverLibro(libroId)}>Devolver</button> 
                    }        
                </td>
            </>
        )
    }


    const getLibrosConCategoriaYPersona = () => {  libros.forEach(libro => {
        categorias.forEach(categoria => {
            personas.forEach(persona =>{
                if(persona.id === libro.persona_id){
                    libro = Object.assign(libro, {
                        id: libro.id,
                        nombre: libro.nombre,
                        descripcion: libro.descripcion,
                        categoria_id: libro.categoria_id,
                        persona_id: persona.nombre  })
                }
                if(libro.categoria_id === categoria.id){
                    libro = Object.assign(libro, {
                        id: libro.id,
                        nombre: libro.nombre,
                        descripcion: libro.descripcion,
                        categoria_id: categoria.nombre,
                        persona_id: libro.persona_id  })
                }
                })
            })      
        })
    }

    getLibrosConCategoriaYPersona();

    return (
        <div>
            <Link to={`libro/editar/0`}>Agregar</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Categoria</th>
                        <th>Quien lo tiene</th>
                        <th>Prestar/Devolver</th>
                    </tr>
                </thead>
                <tbody>
                    {libros.map(libro => (
                        <tr key={libro.id}>
                            <td>{libro.nombre}</td>
                            <td>{libro.descripcion}</td>
                            <td>{libro.categoria_id}</td>
                            <td>
                                {libro.persona_id ? libro.persona_id : 'Mi biblioteca'}                                
                            </td>
                            {renderizarPrestarDevolver(libro.id, libro.persona_id)}
                            <td><Link to={`libro/editar/${libro.id}`}>Edit</Link></td>
                            <td><Link to="" onClick={() => deleteLibro(libro.id)} >Borrar</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
