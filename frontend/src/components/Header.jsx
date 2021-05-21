import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
    return (
        <div>
            <header className="App-header">
                <h1>Mi Biblioteca</h1>                
                <Link to={"libro"}>  Libros</Link>
                <Link to={"persona"}>  Personas</Link>
                <Link to={"categoria"}>  Categorias</Link>
            </header>
        </div>
    )
}
