import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'

// Los efectos de canvasui ya miraban prefers-reduced-motion cada uno por su
// cuenta; las animaciones de la propia interfaz (entradas, transiciones entre
// vistas, barras que crecen) no. Con esto las respetan todas a la vez, y en un
// sitio que se mueve tanto como este eso no es un detalle: hay gente a la que
// el movimiento le marea de verdad.
// El contenido que el build cocinó para los robots ya ha cumplido: lo quitamos
// antes de montar, para que no se vea un instante repetido debajo de la
// aplicación. En desarrollo el nodo está vacío y esto no hace nada.
document.getElementById('pre')?.remove()

const raiz = createRoot(document.getElementById('root'))

const sitio = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
)

// El kitchen sink es la herramienta de taller donde se ve el sistema entero de
// una vez (`src/kitchen/`). No es una página del sitio y no debe serlo: se monta
// solo con el servidor de desarrollo y se carga con un import dinámico, así que
// en producción esta rama es código muerto que el bundler borra y su código
// nunca llega a estar en el `dist`. Por eso tampoco hace falta excluirla del
// sitemap ni del prerenderizado: para el build no existe.
if (import.meta.env.DEV && window.location.pathname === '/kitchen') {
  import('./kitchen/KitchenSink.jsx').then(({ default: KitchenSink }) => {
    raiz.render(<KitchenSink />)
  })
} else {
  raiz.render(sitio)
}
