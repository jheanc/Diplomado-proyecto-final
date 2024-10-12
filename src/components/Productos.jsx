import React, { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')

  useEffect(() => {
    cargarProductos()
    cargarCategorias()

    const handleProductosActualizados = () => cargarProductos()
    const handleCategoriasActualizadas = () => cargarCategorias()

    window.addEventListener('productosActualizados', handleProductosActualizados)
    window.addEventListener('categoriasActualizadas', handleCategoriasActualizadas)

    return () => {
      window.removeEventListener('productosActualizados', handleProductosActualizados)
      window.removeEventListener('categoriasActualizadas', handleCategoriasActualizadas)
    }
  }, [])

  const cargarProductos = async () => {
    try {
      const productosSnapshot = await getDocs(collection(db, 'productos'))
      const productosLista = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProductos(productosLista)
    } catch (error) {
      console.error("Error al cargar productos:", error)
    }
  }

  const cargarCategorias = async () => {
    try {
      const categoriasSnapshot = await getDocs(collection(db, 'categorias'))
      const categoriasLista = categoriasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCategorias(categoriasLista)
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    }
  }

  const productosFiltrados = categoriaSeleccionada === 'Todas' 
    ? productos 
    : productos.filter(producto => producto.categoria === categoriaSeleccionada)

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      <div className="mb-3">
        <label htmlFor="categoria-select" className="form-label">Filtrar por categoría:</label>
        <select 
          id="categoria-select"
          className="form-select" 
          value={categoriaSeleccionada} 
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          <option value="Todas">Todas las categorías</option>
          {categorias.map(categoria => (
            <option key={categoria.id} value={categoria.nombre}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <p className="card-text">{producto.descripcion}</p>
                <p className="card-text"><strong>Precio: ${producto.precio}</strong></p>
                <p className="card-text"><small className="text-muted">Categoría: {producto.categoria}</small></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}