import React from 'react';

const Filtros = ({ categorias, categoriaSeleccionada, onCategoriaChange }) => {
  return (
    <div className="mb-4">
      <h4>Categorías</h4>
      <div className="list-group">
        <button
          className={`list-group-item list-group-item-action ${!categoriaSeleccionada ? 'active' : ''}`}
          onClick={() => onCategoriaChange(null)}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`list-group-item list-group-item-action ${categoria === categoriaSeleccionada ? 'active' : ''}`}
            onClick={() => onCategoriaChange(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filtros;