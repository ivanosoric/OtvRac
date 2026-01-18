import { useEffect, useState } from "react";
import{ Routes, Route, Link, Navigate, useLocation, useNavigate} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton.jsx";
import LogoutButton from "./LogoutButton.jsx";
import Profile from "./Profile.jsx";
import "./App.css";


function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  if(isLoading) return <div>Loading...</div>;
  if(!isAuthenticated){
    return <Navigate to="/" replace state={{flash: "Morate se prijaviti"}}/>;
  }
  return children;
}

function Home(){
  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  const location = useLocation();   //NIJE MI JASNO!!!
  const [flash, setFlash] = useState(location.state?.flash || "");
  const [exportStatus, setExportStatus] = useState("");
  const [exportError, setExportError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if(location.state?.flash){
      setFlash(location.state.flash);
      navigate(location.pathname, {replace: true, state: {}})
    }
  }, [location.state, location.pathname, navigate]);
  const refreshSnapshots = async () =>{
    if(!isAuthenticated){
      setFlash("Morate se prijaviti");
      return;
    }
    setExportStatus("");
    setExportError("");
    const token = await getAccessTokenSilently();
    try{
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/export`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text(); //Što ovdje backend točno vraća?
      if(!res.ok){
        setExportError(text || `Greška (${res.status})`);
        return;
      }
      setExportStatus(text || "Preslike su osvježene.");
    }
    catch (err) {
      setExportError("Ne mogu kontaktirati backend (provjeri da radi na portu 3000).");
    }
  };
  
  return(
    <div style={{padding: 24}}>
      <h1>Moja aplikacija</h1>

      {flash && (
        <div style={{ margin: "12px 0", padding: 12, border: "1px solid #ccc"}}>
          {flash}
        </div>
      )}

      {!isAuthenticated ? (
        <div>
          <LoginButton/>
        </div>
      ) : (
        <div className="akcije" style={{display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap",}}>
          <div className="gornjiRed">
            <div className="korisnikLink">
              <Link to="/profile">Korisnički profil</Link>
            </div>
          <button type="button" className="osvjeziGumb" onClick={refreshSnapshots}>Osvježi Preslike</button>
          </div>
          <div className="donjiRed">
            <LogoutButton/>
          </div>
        </div>
      )}
      {exportStatus && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #6fcf97"}}>
          {exportStatus}
        </div>
      )}
      {exportError && (
        <div style={{ marginTop:16, padding: 12, border: "1px solid #eb5757"}}>
          {exportError}
        </div>
      )}
    </div>
  );
}
export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
        />
        <Route path="*" element={<Navigate to="/" replace />}/>
    </Routes>
  );
}