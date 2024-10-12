import React, { useEffect, useState } from 'react';
import Card from './Card';
import Filtros from './Filtros';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Quienessomos = ({ isLoggedIn, agregarProductoCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    obtenerProductos();
  }, []);
  
  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('No se pudo obtener los productos');
      }
      const data = await response.json();
      setProductos(data);
      setProductosFiltrados(data);
      
      const categoriasUnicas = [...new Set(data.map(producto => producto.category))];
      setCategorias(categoriasUnicas);
      
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError('Hubo un problema al cargar los productos. Por favor, intente de nuevo más tarde.');
      setLoading(false);
    }
  };

  useEffect(() => {
    filtrarProductos();
  }, [categoriaSeleccionada, busqueda, productos]);

  const filtrarProductos = () => {
    let productosFiltrados = productos;

    if (categoriaSeleccionada) {
      productosFiltrados = productosFiltrados.filter(producto => producto.category === categoriaSeleccionada);
    }

    if (busqueda) {
      productosFiltrados = productosFiltrados.filter(producto => 
        producto.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.description.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setProductosFiltrados(productosFiltrados);
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-center text-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4">Nuestra Tienda</h1>
      <div className="row">
        <div className="col-md-3">
          <Filtros 
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={handleCategoriaChange}
          />
        </div>
        <div className="col-md-9">
          <div className="mb-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={handleBusquedaChange}
              />
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>
          {productosFiltrados.length === 0 ? (
            <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          ) : (
            <div className="row">
              {productosFiltrados.map((producto) => (
                <Card 
                  key={producto.id}
                  producto={producto}
                  isLoggedIn={isLoggedIn}
                  agregarProductoCarrito={() => agregarProductoCarrito(producto)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quienessomos;