import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return ( 
    // весь JSX-код является декларативным (начало)
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Домашка на Vite + React + TS</h1>
      <div className="card">
        <button>It is currently the year: {currentYear}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    // весь JSX-код является декларативным (конец)
  )
}

export default App
