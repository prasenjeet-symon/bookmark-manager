import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";
import Logo from '../../../assets/LinKet.png';

export default function DashboardHeader() {
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

  function goToUserProfile() {
    navigate("/profile", {
      replace: true,
    });
  }

  return (
    <>
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center desktop-header">
        {/* Left: Company Logo */}
        <div onClick={goToDashboard} className="flex items-center hover:cursor-pointer">
          <img src={Logo} alt="Linkit Logo" className="h-8 mr-2 rounded-2xl" />
          <span className="text-xl font-bold">{import.meta.env.VITE_COMPANY_NAME}</span>
        </div>

        {/* Right: Navigation Links and User Profile */}
        <div className="flex items-center">
          {/* Dashboard */}
          <div className="nav-item">
            <a onClick={goToDashboard} className="text-base hover:underline">
              Dashboard
            </a>
          </div>

          {/* My Bookmarks */}
          <div className="nav-item">
            <a onClick={goToBookmarks} className="text-base hover:underline">
              My Bookmarks
            </a>
          </div>

          {/* Tools */}
          <div className="nav-item">
            <a href="#" className="text-base hover:underline">
              Tools
            </a>
            <div className="more-menu bg-background">
              <div className="menu-item text-base" onClick={goToImportBookmarks}>
                Import Bookmarks
              </div>
              <div className="menu-item text-base" onClick={goToExportBookmarks}>
                Export Bookmarks
              </div>
              <div className="menu-item text-base" onClick={goToInstallScript}>
                Install Browser Script
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="nav-item">
            <a onClick={goToSettings} className="text-base hover:underline">
              Settings
            </a>
          </div>

          {/* avatar image circle */}
          <div className="user-profile">
            <img src="https://picsum.photos/seed/123/200/300" alt="" />
            <div className="more-menu bg-background">
              <div onClick={logOut} className="menu-item text-base">
                Logout
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
