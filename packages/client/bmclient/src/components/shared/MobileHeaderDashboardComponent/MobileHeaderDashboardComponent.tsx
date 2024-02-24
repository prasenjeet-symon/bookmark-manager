import { faClose, faHamburger } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./MobileHeaderDashboardComponent.css"; // Assuming you have a CSS file for styling
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/LinKet.png';

const HeaderMobileDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logOut = async () => {
    await singleCall(new NetworkApi().logout());
  };

  // Navigate to different pages
  function goToDashboard() {
    navigate("/dashboard", {
      replace: true,
    });
  }

  function goToBookmarks() {
    navigate("/dashboard/my-bookmark", {
      replace: false,
    });
  }

  function goToSettings() {
    navigate("/dashboard/settings", {
      replace: false,
    });
  }

  function goToImportBookmarks() {
    navigate("/dashboard/import-bookmark", {
      replace: false,
    });
  }

  function goToExportBookmarks() {
    navigate("/dashboard/export-bookmark", {
      replace: false,
    });
  }

  function goToInstallScript() {
    navigate("/dashboard/add-script", {
      replace: false,
    });
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="headerResponsive bg-slate-800">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <button title="Menu" className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faHamburger} size="lg" />
      </button>
      {menuOpen && (
        <div className="menu-overlay bg-slate-950">
          <div className="menu-dialog">
            <nav className="nav-menu">
              <ul>
                <li onClick={goToDashboard} className="bg-slate-800 border-b-2 border-slate-600">
                  <a>Dashboard</a>
                </li>
                <li className="bg-slate-800 border-b-2 border-slate-600">
                  <a onClick={goToBookmarks}>My Bookmarks</a>
                </li>
                <li className="dropdown bg-slate-800 border-b-2 border-slate-600" >
                  <a>Tools</a>
                  <ul className="submenu">
                    <li onClick={goToImportBookmarks}>
                      <a >Import Bookmarks</a>
                    </li>
                    <li onClick={goToExportBookmarks}>
                      <a>Export Bookmarks</a>
                    </li>
                    <li onClick={goToInstallScript}>
                      <a >Install Browser Script</a>
                    </li>
                  </ul>
                </li>
                <li onClick={goToSettings} className="bg-slate-800 border-b-2 border-slate-600">
                  <a>Settings</a>
                </li>
                <li onClick={goToSettings} className="bg-slate-800 border-b-2 border-slate-600">
                  <a href="#help">Account</a>
                </li>
                <li onClick={logOut} className="bg-slate-800 border-b-2 border-slate-600">
                  <a>Logout</a>
                </li>
              </ul>
              <button title="close" className="close-button" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faClose} size="lg" />
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderMobileDashboard;
