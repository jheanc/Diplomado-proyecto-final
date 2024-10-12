import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminPanel() {
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      const productsSnapshot = await getDocs(collection(db, 'productos'))
      setProductCount(productsSnapshot.size)

      const categoriesSnapshot = await getDocs(collection(db, 'categorias'))
      setCategoryCount(categoriesSnapshot.size)

      const ordersSnapshot = await getDocs(query(collection(db, 'carritos'), where('estado', '==', 'completado')))
      setOrderCount(ordersSnapshot.size)
    }

    fetchCounts()
  }, [])

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Panel de Administración</h1>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <p className="card-text">Total: {productCount}</p>
              <Link to="/admin/productos" className="btn btn-primary">Gestionar Productos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Categorías</h5>
              <p className="card-text">Total: {categoryCount}</p>
              <Link to="/admin/categorias" className="btn btn-primary">Gestionar Categorías</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>
              <p className="card-text">Total: {orderCount}</p>
              <Link to="/admin/pedidos" className="btn btn-primary">Gestionar Pedidos</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}