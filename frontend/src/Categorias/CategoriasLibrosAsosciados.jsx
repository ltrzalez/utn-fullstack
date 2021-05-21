import React from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function CategoriasLibrosAsosciados(props) {

    const [categoria, setCategoria] = React.useState([])
    const [libros, setLibros] = React.useState([])    
    const params = useParams();
  
    const getCategoria = async (idCategoria) => {
        try {
            const infoFromServer = await axios.get(`http://localhost:5000/categoria/${idCategoria}`)
            // console.table(infoFromServer.data)
            setCategoria(infoFromServer.data)
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
            // let mensajeDeError = Object.values(error.response.data)
            console.log("hola mundo")
        }
    }

    React.useEffect(() => {
        getCategoria(params.id)
        getLibros()
    }, [params]);

    const librosAsociados = libros.filter(itemAencontrar => itemAencontrar.categoria_id===categoria.id)
    
    const renderizadoTitulos = (arrayARenderizar) => {        
        return (
            <div>
                {arrayARenderizar.map(x => {return(<p>{x.nombre}</p>)})}
            </div>
        )
    }

    return (
        <div>            
            { librosAsociados.length > 0 ?  renderizadoTitulos(librosAsociados) : 'no hay libros asociados a esta categoria' }
        </div>
    )
}
