import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";

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
    navigate("/bookmarks", {
      replace: true,
    });
  }

  function goToSettings() {
    navigate("/dashboard/settings", {
      replace: true,
    });
  }

  function goToImportBookmarks() {
    navigate("/import-bookmarks", {
      replace: true,
    });
  }

  function goToExportBookmarks() {
    navigate("/export-bookmarks", {
      replace: true,
    });
  }

  function goToInstallScript() {
    navigate("/install-script", {
      replace: true,
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
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Left: Company Logo */}
        <div onClick={goToDashboard} className="flex items-center hover:cursor-pointer">
          <img src="https://wiki.videolan.org/images/Firefox-logo.png" alt="Company Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">Linkify</span>
        </div>

        {/* Right: Navigation Links and User Profile */}
        <div className="flex items-center">
          {/* Dashboard */}
          <div className="nav-item">
            <a href="#" className="text-base hover:underline">
              Dashboard
            </a>
          </div>

          {/* My Bookmarks */}
          <div className="nav-item">
            <a href="#" className="text-base hover:underline">
              My Bookmarks
            </a>
          </div>

          {/* Tools */}
          <div className="nav-item">
            <a href="#" className="text-base hover:underline">
              Tools
            </a>
            <div className="more-menu bg-background">
              <div className="menu-item text-base">Import Bookmarks</div>
              <div className="menu-item text-base">Export Bookmarks</div>
              <div className="menu-item text-base">Install Browser Button</div>
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
            <img src="https://github.com/shadcn.png" alt="" />
            <div className="more-menu bg-background">
              <div className="menu-item text-base">Account</div>
              <div onClick={logOut} className="menu-item text-base">Logout</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
