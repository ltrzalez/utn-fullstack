import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function PersonaLibrosAsosciados(props) {    

    const [persona, setPersona] = React.useState([])
    const [libros, setLibros] = React.useState([])    
    const params = useParams();
  
    const getPersona = async (idPersona) => {
        try {
            const infoFromServer = await axios.get(`http://localhost:5000/persona/${idPersona}`)
            console.table(infoFromServer.data)
            setPersona(infoFromServer.data[0])
        } catch (error) {
            let mensajeDeError = Object.values(error.response.data)
            console.log(mensajeDeError)
        }
    }

    const getLibros = async () => {
        try {
            const infoFromServer = await axios.get('http://localhost:5000/libro')
            // console.table(infoFromServer.data)
            setLibros(infoFromServer.data)            
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        getPersona(params.id)
        getLibros()
    }, [params]);
    
    

    const librosAsociados = libros.filter(itemAencontrar => itemAencontrar.persona_id===persona.id)
    
    const renderizadoTitulos = (arrayARenderizar) => {        
        return (
            <div>
                {arrayARenderizar.map(x => {return(<p>{x.nombre}</p>)})}
            </div>
        )
    }

    return (
        <div>            
            { librosAsociados.length > 0 ?  renderizadoTitulos(librosAsociados) : 'no hay libros asociados a esta persona' }
        </div>
    )
}
