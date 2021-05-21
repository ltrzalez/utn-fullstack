import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'


export default function Personas(props) {
    
    const [personas, setPersonas] = React.useState([])
    
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

    const deletePersona = async (personaId) => {
        try {
            await axios.delete(`http://localhost:5000/persona/${personaId}`)
            getPersonas()
            props.history.push("/persona")
        } catch (error) {
            alert(Object.values(error.response.data))
            props.history.push("/persona")
        }
    }

    
    React.useEffect(() => {
        getPersonas()
    }, []);
    

    return (
        <div>
            <Link to={`persona/editar/0`}>Agregar</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>E-Mail</th>
                        <th>Alias</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map(persona => (
                        <tr key={persona.id}>
                            <td>{persona.nombre}</td>
                            <td>{persona.apellido}</td>
                            <td>{persona.mail}</td>
                            <td>{persona.alias}</td>
                            <td><Link to={`persona/editar/${persona.id}`}>Edit</Link></td>
                            <td><Link to="" onClick={() => deletePersona(persona.id)} >x</Link></td>
                            <td><Link to={`persona/libros/${persona.id}`} >Ver Libros Asociados</Link></td>
                            {/* comentario heredado de Libro.jsx
                                porque al borrar un item retorna este error =>
                                Warning: Can't perform a React state update on an unmounted component.
                            */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
