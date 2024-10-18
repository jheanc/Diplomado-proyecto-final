import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faUser, faBars } from '@fortawesome/free-solid-svg-icons'
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
import Notification from './components/Notification'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [productosCarrito, setProductosCarrito] = useState([])
  const [userData, setUserData] = useState(null)
  const [cuponAplicado, setCuponAplicado] = useState(null)
  const [notification, setNotification] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const auth = getAuth()

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
    if (!isLoggedIn || !userData) {
      setNotification("Por favor, inicia sesión para agregar productos al carrito");
      return;
    }
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
      
      setNotification(`${producto.title} agregado al carrito`)
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error)
      setNotification("Error al agregar el producto al carrito")
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">Mi Tienda</Link>
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/quienessomos" className="nav-link" onClick={() => setIsMenuOpen(false)}>Productos</Link>
              </li>
              {!isLoggedIn ? (
                <li className="nav-item">
                  <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/carrito" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      Carrito <FontAwesomeIcon icon={faShoppingCart} />
                      <span className="badge bg-secondary">{productosCarrito.length}</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/perfil" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      <FontAwesomeIcon icon={faUser} />
                    </Link>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="btn btn-link nav-link">Cerrar Sesión</button>
                  </li>
                </>
              )}
            </ul>
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
            <Checkout 
              productos={productosCarrito}
              cuponAplicado={cuponAplicado}
              calcularTotalConDescuento={calcularTotalConDescuento}
            />
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
      
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </Router>
  )
}

export default App