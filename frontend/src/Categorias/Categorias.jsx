import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Categorias(props) {
    
    const [categorias, setCategorias] = React.useState([])
  
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

    const deleteCategoria = async (categoriaId) => {
        console.log(categoriaId)
        try {
            await axios.delete(`http://localhost:5000/categoria/${categoriaId}`)
            alert("categoria eliminada")
            getCategorias()
            // props.history.push("/libro")
        } catch (error) {
            alert(Object.values(error.response.data))
            console.log(error.response)
            // props.history.push("/libro")
        }
    }

   

    React.useEffect(() => {        
        getCategorias();
    }, []);
    

    return (
        <div >
            <Link to={`categoria/editar/0`}>Agregar</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map(categoria => (
                        <tr key={categoria.id}>
                            <td>{categoria.nombre}</td>
                            <td><Link to={`categoria/editar/${categoria.id}`}>Edit</Link></td>
                            <td><Link to="" onClick={() => deleteCategoria(categoria.id)} >x</Link></td>
                            <td><Link to={`categoria/libros/${categoria.id}`} >Libros Asociados</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
