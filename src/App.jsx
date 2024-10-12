import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db, cargarCarrito, guardarCarrito } from './firebase'
import Inicio from './components/Inicio'
import Quienessomos from './components/Quienessomos'
import Login from './components/Login'
import Registro from './components/Registro'
import Carrito from './components/Carrito'
import Checkout from './components/Checkout'
import PerfilUsuario from './components/PerfilUsuario'
import ProductDetail from './components/ProductDetail'
import RutaProtegida from './components/RutaProtegida'
import AdminPanel from './components/AdminPanel'
import AdminProductos from './components/AdminProductos'
import AdminCategorias from './components/AdminCategorias'
import AdminPedidos from './components/AdminPedidos'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productosCarrito, setProductosCarrito] = useState([])
  const [userData, setUserData] = useState(null)
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const auth = 

 getAuth()

  const cupones = {
    'DESCUENTO5': 0.05,
    'DESCUENTO10': 0.10,
    'DESCUENTO15': 0.15,
    'DESCUENTO20': 0.20
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        try {
          const userDocRef = doc(db, "usuarios", user.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserData({
              uid: user.uid,
              email: user.email,
              nombre: userData.nombre,
              sexo: userData.sexo,
              rol: userData.rol
            })
            setIsAdmin(userData.rol === 'admin')
          } else {
            setUserData({
              uid: user.uid,
              email: user.email
            })
          }
          
          const productos = await cargarCarrito(user.uid)
          setProductosCarrito(productos)
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error)
        }
      } else {
        setIsLoggedIn(false)
        setIsAdmin(false)
        setUserData(null)
        setProductosCarrito([])
      }
    })

    return () => unsubscribe()
  }, [auth])

  const handleLogout = () => {
    signOut(auth).then(() => {
      setIsLoggedIn(false)
      setIsAdmin(false)
      setUserData(null)
      setProductosCarrito([])
      setCuponAplicado(null)
    }).catch((error) => {
      console.error("Error al cerrar sesión:", error)
    })
  }

  const agregarProductoCarrito = async (producto) => {
    if (!isLoggedIn || !userData) return
    try {
      const nuevosProductos = [...productosCarrito]
      const productoExistente = nuevosProductos.find((p) => p.id === producto.id)
      if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1
      } else {
        nuevosProductos.push({ ...producto, cantidad: 1 })
      }
      await guardarCarrito(userData.uid, nuevosProductos)
      setProductosCarrito(nuevosProductos)
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error)
    }
  }

  const modificarProductoCarrito = async (id, nuevoProducto) => {
    if (!isLoggedIn || !userData) return
    try {
      const nuevosProductos = productosCarrito.map((prod) => 
        prod.id === id ? nuevoProducto : prod
      )
      await guardarCarrito(userData.uid, nuevosProductos)
      setProductosCarrito(nuevosProductos)
    } catch (error) {
      console.error("Error al modificar producto en el carrito:", error)
    }
  }

  const eliminarProductoCarrito = async (id) => {
    if (!isLoggedIn || !userData) return
    try {
      const nuevosProductos = productosCarrito.filter((prod) => prod.id !== id)
      await guardarCarrito(userData.uid, nuevosProductos)
      setProductosCarrito(nuevosProductos)
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error)
    }
  }

  const aplicarCupon = (cupon) => {
    if (cupones.hasOwnProperty(cupon)) {
      setCuponAplicado({
        codigo: cupon,
        descuento: cupones[cupon]
      })
      return true
    }
    return false
  }

  const calcularTotalConDescuento = (total) => {
    if (cuponAplicado) {
      return total * (1 - cuponAplicado.descuento)
    }
    return total
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">Mi Tienda</Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/quienessomos" className="nav-link">Productos</Link>
            {!isLoggedIn ? (
              <Link to="/login" className="nav-link">Iniciar Sesión</Link>
            ) : (
              <>
                <Link to="/carrito" className="nav-link">
                  Carrito <FontAwesomeIcon icon={faShoppingCart} />
                  <span className="badge bg-secondary">{productosCarrito.length}</span>
                </Link>
                <Link to="/perfil" className="nav-link">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn btn-link nav-link">Cerrar Sesión</button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Inicio isLoggedIn={isLoggedIn} agregarProductoCarrito={agregarProductoCarrito} />} />
        <Route path="/quienessomos" element={<Quienessomos isLoggedIn={isLoggedIn} agregarProductoCarrito={agregarProductoCarrito} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} />
        <Route path="/registro" element={<Registro setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />} />
        <Route path="/carrito" element={
          <RutaProtegida isLoggedIn={isLoggedIn}>
            <Carrito 
              productos={productosCarrito} 
              eliminarProductoCarrito={eliminarProductoCarrito} 
              modificarProductoCarrito={modificarProductoCarrito}
              user={userData}
              aplicarCupon={aplicarCupon}
              cuponAplicado={cuponAplicado}
              calcularTotalConDescuento={calcularTotalConDescuento}
            />
          </RutaProtegida>
        } />
        <Route path="/checkout" element={
          <RutaProtegida isLoggedIn={isLoggedIn}>
            <Checkout />
          </RutaProtegida>
        } />
        <Route path="/perfil" element={
          <RutaProtegida isLoggedIn={isLoggedIn}>
            <PerfilUsuario userData={userData} />
          </RutaProtegida>
        } />
        <Route path="/producto/:id" element={<ProductDetail isLoggedIn={isLoggedIn} agregarProductoCarrito={agregarProductoCarrito} />} />
        <Route path="/admin" element={
          <RutaProtegida isLoggedIn={isLoggedIn && isAdmin}>
            <AdminPanel />
          </RutaProtegida>
        } />
        <Route path="/admin/productos" element={
          <RutaProtegida isLoggedIn={isLoggedIn && isAdmin}>
            <AdminProductos />
          </RutaProtegida>
        } />
        <Route path="/admin/categorias" element={
          <RutaProtegida isLoggedIn={isLoggedIn && isAdmin}>
            <AdminCategorias />
          </RutaProtegida>
        } />
        <Route path="/admin/pedidos" element={
          <RutaProtegida isLoggedIn={isLoggedIn && isAdmin}>
            <AdminPedidos />
          </RutaProtegida>
        } />
      </Routes>
    </Router>
  )
}

export default App