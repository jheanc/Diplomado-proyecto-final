import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFire, faPercent, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Card from './Card';

const Inicio = ({ isLoggedIn, agregarProductoCarrito }) => {
  const [destacados, setDestacados] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [populares, setPopulares] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();

      setDestacados(products.slice(0, 3));
      setOfertas(products.slice(3, 6));
      setPopulares(products.slice(6, 9));
    };

    fetchData();
  }, []);

  const CustomPrevIcon = <FontAwesomeIcon icon={faChevronLeft} className="carousel-control-icon" />;
  const CustomNextIcon = <FontAwesomeIcon icon={faChevronRight} className="carousel-control-icon" />;

  return (
    <div className="container mt-4">
      <Carousel 
        className="mb-4" 
        prevIcon={CustomPrevIcon}
        nextIcon={CustomNextIcon}
      >
        {destacados.map((product) => (
          <Carousel.Item key={product.id}>
            <img
              className="d-block w-100"
              src={product.image}
              alt={product.title}
              style={{ height: '400px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
            />
            <Carousel.Caption>
              <h3 style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>{product.title}</h3>
              <p style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>{product.description.substring(0, 100)}...</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <h2 className="mb-3">
        <FontAwesomeIcon icon={faStar} className="me-2" />
        Productos Destacados
      </h2>
      <div className="row mb-4">
        {destacados.map((product) => (
          <Card
            key={product.id}
            producto={product}
            isLoggedIn={isLoggedIn}
            agregarProductoCarrito={agregarProductoCarrito}
          />
        ))}
      </div>

      <h2 className="mb-3">
        <FontAwesomeIcon icon={faPercent} className="me-2" />
        Ofertas Especiales
      </h2>
      <div className="row mb-4">
        {ofertas.map((product) => (
          <Card
            key={product.id}
            producto={product}
            isLoggedIn={isLoggedIn}
            agregarProductoCarrito={agregarProductoCarrito}
          />
        ))}
      </div>

      <h2 className="mb-3">
        <FontAwesomeIcon icon={faFire} className="me-2" />
        Productos Populares
      </h2>
      <div className="row mb-4">
        {populares.map((product) => (
          <Card
            key={product.id}
            producto={product}
            isLoggedIn={isLoggedIn}
            agregarProductoCarrito={agregarProductoCarrito}
          />
        ))}
      </div>
    </div>
  );
};

export default Inicio;