import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' })
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    const categoriasSnapshot = await getDocs(collection(db, 'categorias'))
    const categoriasLista = categoriasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setCategorias(categoriasLista)
  }

  const agregarCategoria = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'categorias'), nuevaCategoria)
    setNuevaCategoria({ nombre: '', descripcion: '' })
    cargarCategorias()
  }

  const actualizarCategoria = async (e) => {
    e.preventDefault()
    await updateDoc(doc(db, 'categorias', editando.id), editando)
    setEditando(null)
    cargarCategorias()
  }

  const eliminarCategoria = async (id) => {
    await deleteDoc(doc(db, 'categorias', id))
    cargarCategorias()
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Categorías</h2>
      <form onSubmit={editando ? actualizarCategoria : agregarCategoria} className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={editando ? editando.nombre : nuevaCategoria.nombre}
          onChange={(e) => editando ? setEditando({...editando, nombre: e.target.value}) : setNuevaCategoria({...nuevaCategoria, nombre: e.target.value})}
          className="form-control mb-2"
        />
        <textarea
          placeholder="Descripción"
          value={editando ? editando.descripcion : nuevaCategoria.descripcion}
          onChange={(e) => editando ? setEditando({...editando, descripcion: e.target.value}) : setNuevaCategoria({...nuevaCategoria, descripcion: e.target.value})}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">{editando ? 'Actualizar' : 'Agregar'} Categoría</button>
        {editando && <button onClick={() => setEditando(null)} className="btn btn-secondary ml-2">Cancelar</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria.id}>
              <td>{categoria.nombre}</td>
              <td>{categoria.descripcion}</td>
              <td>
                <button onClick={() => setEditando(categoria)} className="btn btn-sm btn-info">Editar</button>
                <button onClick={() => eliminarCategoria(categoria.id)} className="btn btn-sm btn-danger ms-2">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}