// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu } from "lucide-react";
// import TenantDashboard from "./Tenant/TenantDashboard";
// import LandlordDashboard from "./Landlord/LandlordDashboard";
// import TenantNotifications from "./Tenant/TenantNotifications";
// import LandlordNotifications from "./Landlord/LandlordNotifications";
// import TenantRequests from "./Tenant/TenantRequests";
// import LandlordRequests from "./Landlord/LandlordRequests";
// import TenantSettings from "./Tenant/TenantSettings";
// import LandlordSettings from "./Landlord/LandlordSettings";
// import TenantProfile from "./Tenant/TenantProfile";
// import LandlordProfile from "./Landlord/LandlordProfile";
// import LandLordAddRoom from "./Landlord/LandLordAddRoom";
// import LandlordRoomsList from "./Landlord/LandlordRoomsList";
// import VisitConfirmationPopup from "./Tenant/VisitConfirmationPopup";
// import Sidebar from "../components/Sidebar";

// const DashboardPage = () => {
//   const token = localStorage.getItem("token");
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState(null);
//   const [selectedSection, setSelectedSection] = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [requestCount, setRequestCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const fetchNotificationCount = async (type) => {
//     try {
//       const response = await axios.get(
//         `https://rent-orbit-backend.onrender.com/api/notifications/unread/count`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const unreadCount = response.data.unreadCount;
//       setNotificationCount(unreadCount);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Define fetchRequestCount before it's used
//   const fetchRequestCount = async (type) => {
//     try {
//       if (type === "landlord") {
//         // For landlord, get sum of unread requests and complaints
//         const [requestsRes, complaintsRes] = await Promise.all([
//           axios.get("https://rent-orbit-backend.onrender.com/api/requests/unread/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get("https://rent-orbit-backend.onrender.com/api/complaints/unread/count", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         const total = requestsRes.data.unreadCount + complaintsRes.data.unreadCount;
//         setRequestCount(total);
//       } else {
//         // For tenant, get total room requests
//         const response = await axios.get("https://rent-orbit-backend.onrender.com/api/requests", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const filteredRequests = response.data.filter(req => req.status !== 'completed');
//         setRequestCount(filteredRequests.length);
//       }
//     } catch (error) {
//       console.error("Error fetching request count:", error);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     try {
//       const decoded = jwtDecode(token);
//       setUserType(decoded.userType);
//       fetchNotificationCount(decoded.userType);
//       fetchRequestCount(decoded.userType);
//     } catch (error) {
//       localStorage.removeItem("token");
//       navigate("/");
//     }
//   }, [navigate, token]);

//   const renderSection = () => {
//     switch (selectedSection) {
//       case "dashboard":
//         return userType === "tenant" ? (
//           <TenantDashboard />
//         ) : (
//           <LandlordDashboard />
//         );
//       case "notifications":
//         return userType === "tenant" ? (
//           <TenantNotifications />
//         ) : (
//           <LandlordNotifications />
//         );
//       case "requests":
//         return userType === "tenant" ? (
//           <TenantRequests />
//         ) : (
//           <LandlordRequests />
//         );
//       case "settings":
//         return userType === "tenant" ? (
//           <TenantSettings />
//         ) : (
//           <LandlordSettings />
//         );
//       case "profile":
//         return userType === "tenant" ? (
//           <TenantProfile />
//         ) : (
//           <LandlordProfile />
//         );
//       case "addRoom":
//         return (
//           <div>
//             <LandLordAddRoom />
//           </div>
//         );
//       case "myRoom":
//         return (
//           <div>
//             <LandlordRoomsList />
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate(userType === "tenant" ? "/tenant" : "/landlord");
//   };

//   const toggleMobileSidebar = () => {
//     setMobileSidebarOpen(!mobileSidebarOpen);
//   };

//   const themeColors = {
//     tenant: {
//       primary: "bg-orange-600",
//       hover: "hover:bg-orange-700",
//       text: "text-orange-600",
//       border: "border-orange-600",
//       light: "bg-orange-100",
//     },
//     landlord: {
//       primary: "bg-purple-600",
//       hover: "hover:bg-purple-700",
//       text: "text-purple-600",
//       border: "border-purple-600",
//       light: "bg-purple-100",
//     },
//   };

//   const currentTheme = userType ? themeColors[userType] : themeColors.tenant;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Desktop Sidebar */}
//       <div className="hidden md:block fixed h-full z-30">
//         <Sidebar
//           userType={userType}
//           selectedSection={selectedSection}
//           setSelectedSection={setSelectedSection}
//           handleLogout={handleLogout}
//           collapsed={sidebarCollapsed}
//           setCollapsed={setSidebarCollapsed}
//           notificationCount={notificationCount}
//           requestCount={requestCount}
//         />
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       <AnimatePresence>
//         {mobileSidebarOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//             onClick={() => setMobileSidebarOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {mobileSidebarOpen && (
//           <motion.div
//             initial={{ x: -300 }}
//             animate={{ x: 0 }}
//             exit={{ x: -300 }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className={`fixed inset-y-0 left-0 w-64 z-50 ${currentTheme.primary} shadow-lg md:hidden`}
//           >
//             <Sidebar
//               userType={userType}
//               selectedSection={selectedSection}
//               setSelectedSection={(section) => {
//                 setSelectedSection(section);
//                 setMobileSidebarOpen(false);
//               }}
//               handleLogout={handleLogout}
//               collapsed={false}
//               setCollapsed={setSidebarCollapsed}
//               notificationCount={notificationCount}
//               requestCount={requestCount}
//               isMobile={true}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Main Content */}
//       <div
//         className={`flex-1 px-4 overflow-y-auto h-screen transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"
//           }`}
//       >
//         {/* Mobile Header */}
//         <header className="md:hidden flex items-center justify-between py-4">
//           <button
//             onClick={toggleMobileSidebar}
//             className={`p-2 rounded-lg ${currentTheme.text}`}
//           >
//             <Menu size={24} />
//           </button>
//           <h1 className="text-xl font-bold capitalize">
//             {selectedSection.replace(/([A-Z])/g, ' $1').trim()}
//           </h1>
//           <div className="w-8"></div> {/* Spacer for alignment */}
//         </header>

//         {/* Content */}
//         <main className="py-4">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${currentTheme.border}`}></div>
//             </div>
//           ) : (
//             renderSection()
//           )}
//           {userType === "tenant" && (
//             <VisitConfirmationPopup token={token} userType={userType} />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;





import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  Bell,
  Settings,
  User,
  Layers,
  PlusCircle,
  DoorClosed,
  ChevronRight,
  ClipboardList,
  MessageSquare,
  FileText,
  HelpCircle,
  Calendar,
  Star
} from "lucide-react";
import TenantDashboard from "./Tenant/TenantDashboard";
import LandlordDashboard from "./Landlord/LandlordDashboard";
import TenantNotifications from "./Tenant/TenantNotifications";
import LandlordNotifications from "./Landlord/LandlordNotifications";
import TenantRequests from "./Tenant/TenantRequests";
import LandlordRequests from "./Landlord/LandlordRequests";
import TenantSettings from "./Tenant/TenantSettings";
import LandlordSettings from "./Landlord/LandlordSettings";
import TenantProfile from "./Tenant/TenantProfile";
import LandlordProfile from "./Landlord/LandlordProfile";
import LandLordAddRoom from "./Landlord/LandLordAddRoom";
import LandlordRoomsList from "./Landlord/LandlordRoomsList";
import VisitConfirmationPopup from "./Tenant/VisitConfirmationPopup";
import Sidebar from "../components/Sidebar";
import PreLoader from "../components/PreLoader";

const DashboardPage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Section titles with icons for mobile header
  const sectionTitles = {
    dashboard: { title: "Dashboard", icon: <Home size={20} /> },
    notifications: { title: "Notifications", icon: <Bell size={20} /> },
    requests: { title: "Requests", icon: <ClipboardList size={20} /> },
    settings: { title: "Settings", icon: <Settings size={20} /> },
    profile: { title: "Profile", icon: <User size={20} /> },
    addRoom: { title: "Add Room", icon: <PlusCircle size={20} /> },
    myRoom: { title: "My Rooms", icon: <DoorClosed size={20} /> }
  };

  const fetchNotificationCount = async (type) => {
    try {
      const response = await axios.get(
        `https://rent-orbit-backend.onrender.com/api/notifications/unread/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const unreadCount = response.data.unreadCount;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestCount = async (type) => {
    try {
      if (type === "landlord") {
        const [requestsRes, complaintsRes] = await Promise.all([
          axios.get("https://rent-orbit-backend.onrender.com/api/requests/unread/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://rent-orbit-backend.onrender.com/api/complaints/unread/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const total = requestsRes.data.unreadCount + complaintsRes.data.unreadCount;
        setRequestCount(total);
      } else {
        const response = await axios.get("https://rent-orbit-backend.onrender.com/api/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredRequests = response.data.filter(req => req.status !== 'completed');
        setRequestCount(filteredRequests.length);
      }
    } catch (error) {
      console.error("Error fetching request count:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserType(decoded.userType);
      fetchNotificationCount(decoded.userType);
      fetchRequestCount(decoded.userType);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate, token]);

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return userType === "tenant" ? (
          <TenantDashboard />
        ) : (
          <LandlordDashboard />
        );
      case "notifications":
        return userType === "tenant" ? (
          <TenantNotifications />
        ) : (
          <LandlordNotifications />
        );
      case "requests":
        return userType === "tenant" ? (
          <TenantRequests />
        ) : (
          <LandlordRequests />
        );
      case "settings":
        return userType === "tenant" ? (
          <TenantSettings />
        ) : (
          <LandlordSettings />
        );
      case "profile":
        return userType === "tenant" ? (
          <TenantProfile />
        ) : (
          <LandlordProfile />
        );
      case "addRoom":
        return <LandLordAddRoom />;
      case "myRoom":
        return <LandlordRoomsList />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(userType === "tenant" ? "/tenant" : "/landlord");
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const themeColors = {
    tenant: {
      primary: "bg-orange-500",
      hover: "hover:bg-orange-600",
      text: "text-orange-500",
      border: "border-orange-500",
      light: "bg-orange-100",
      gradient: "from-orange-400 to-orange-600",
      dark: "bg-orange-700"
    },
    landlord: {
      primary: "bg-purple-500",
      hover: "hover:bg-purple-600",
      text: "text-purple-500",
      border: "border-purple-500",
      light: "bg-purple-100",
      gradient: "from-purple-400 to-purple-600",
      dark: "bg-purple-700"
    },
  };

  const currentTheme = userType ? themeColors[userType] : themeColors.tenant;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed h-full z-30">
        <Sidebar
          userType={userType}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          handleLogout={handleLogout}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          notificationCount={notificationCount}
          requestCount={requestCount}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 w-64 z-50 bg-white shadow-xl md:hidden`}
          >
            <Sidebar
              userType={userType}
              selectedSection={selectedSection}
              setSelectedSection={(section) => {
                setSelectedSection(section);
                setMobileSidebarOpen(false);
              }}
              handleLogout={handleLogout}
              collapsed={false}
              setCollapsed={setSidebarCollapsed}
              notificationCount={notificationCount}
              requestCount={requestCount}
              isMobile={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto h-screen transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
      >
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 bg-white shadow-sm">
          <div className="flex items-center justify-between py-3 px-2">
            <button
              onClick={toggleMobileSidebar}
              className={`p-2 rounded-lg ${currentTheme.text}`}
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              {sectionTitles[selectedSection]?.icon}
              <h1 className="text-xl font-bold capitalize">
                {sectionTitles[selectedSection]?.title || selectedSection}
              </h1>
            </div>
            <div className="w-8"></div>
          </div>
        </header>

        {/* Content */}
        <main className="py-4">
          {loading ? (
            <div><PreLoader /></div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          )}
          {userType === "tenant" && (
            <VisitConfirmationPopup token={token} userType={userType} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;