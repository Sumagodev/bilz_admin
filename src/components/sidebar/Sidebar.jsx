import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import logo from "../../assets/images/L1.png";
import { Sidebar as MenuBar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  MdOutlineClose,
  MdHome,
  MdLogout,
  MdOutlinePermContactCalendar,
} from "react-icons/md";
import { RiTeamFill, RiContactsBookLine, RiFileListLine } from "react-icons/ri";
import { FiUsers, FiList, FiFileText, FiUploadCloud } from "react-icons/fi";
import {
  AiOutlineAppstoreAdd,
  AiOutlineProject,
} from "react-icons/ai";
import { BsNewspaper, BsBuilding, BsChatSquareQuote } from "react-icons/bs";
import { FaRegNewspaper } from "react-icons/fa";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { TitleContext } from "../../context/TitleContext";
import { IoIosOptions, IoIosPeople } from "react-icons/io";
// Sidebar menu structure
const SidebarMenu = [
  {
    menu: "Home",
    url: "/dashboard",
    mainIcon: <MdHome size={24} />,
    subMenu: [
      {
        subMenus: "Home Slider",
        url: "/homeslider",
        icon: <AiOutlineProject style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "About Us",
        url: "/headercontact",
        icon: <RiContactsBookLine style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Vission/Mission",
        url: "/About",
        icon: <BsChatSquareQuote style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Exhibition Details",
        url: "/exhibition",
        icon: <BsBuilding style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Social Contacts",
        url: "/social-contact",
        icon: <RiContactsBookLine style={{ color: "red" }} size={24} />,
      },
      // {
      //   subMenus: "Vibration Analysis ",
      //   url: "/v_measurment",
      //   icon: <FiUsers style={{ color: "red" }} size={24} />,
      // },


      // {
      //   subMenus: "Social Contacts",
      //   url: "/social-contact",
      //   icon: <RiContactsBookLine style={{ color: "red" }} size={24} />,
      // },
      // {
      //   subMenus: "Home Sliding Media",
      //   url: "/carousal",
      //   icon: <RiFileListLine style={{ color: "red" }} size={24} />,
      // },
     
      // {
      //   subMenus: "Vibration Measurement ",
      //   url: "/v_analysis",
      //   icon: <AiOutlineProject style={{ color: "red" }} size={24} />,
      // },
      // {
      //   subMenus: "Further Analysis",
      //   url: "/Further",
      //   icon: <BsChatSquareQuote style={{ color: "red" }} size={24} />,
      // },
   
   
      
    ],
  },

  {
    menu: "Service",
    url: "/service",
    mainIcon: <RiTeamFill size={24} />,
    subMenu: [
      {
        subMenus: "Vibration Measurement",
        url: "/v_measurment",
        icon: <FiUsers style={{ color: "red" }} size={24} />,
      },

    
     
      {
        subMenus: "Vibration Analysis",
        url: "/v_analysis",
        icon: <AiOutlineProject style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Further Analysis",
        url: "/Further",
        icon: <BsChatSquareQuote style={{ color: "red" }} size={24} />,
      },
   
    ],
  },

  // {
  //   menu: "Service Overview",
  //   url: "/serviceoverview",
  //   mainIcon: <RiTeamFill size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Service Special",
  //       url: "/Special",
  //       icon: <FiUsers style={{ color: "red" }} size={24} />,
  //     },
  //   ]},

  // {
  //   menu: "About Us",
  //   url: "/about",
  //   mainIcon: <RiTeamFill size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "About Us",
  //       url: "/About",
  //       icon: <BsChatSquareQuote style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  {
    menu: "Career",
    url: "/contactus",
    mainIcon: <MdOutlinePermContactCalendar size={24} />,
    subMenu: [
    {
      subMenus: "Internship Data",
      url: "/apply_now",
      icon: <BsBuilding style={{ color: "red" }} size={24} />,
    },
    {
      subMenus: "Job Data",
      url: "/job",
      icon: <BsBuilding style={{ color: "red" }} size={24} />,
    },
  ],
},
  {
    menu: "News",
    url: "/news",
    mainIcon: <RiTeamFill size={24} />,
    subMenu: [
      
      {
        subMenus: "News Details",
        url: "/News1",
        icon: <BsNewspaper style={{ color: "red" }} size={24} />,
      },
    ],
  },

  {
    menu: "Application",
    url: "/application",
    mainIcon: <RiTeamFill size={24} />,
    subMenu: [
      
      {
        subMenus: "Application Category",
        url: "/applicationcategory",
        icon: <BsNewspaper style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Application Details",
        url: "/productimages",
        icon: <IoIosOptions style={{ color: "red" }} size={24} />,
      },
    ],
  },

  {
    menu: "Download Brochure",
    url: "/pdf",
    mainIcon: <RiTeamFill size={24} />,
    subMenu: [
      {
        subMenus: "Brouchure",
        url: "/pdf",
        icon: <BsNewspaper style={{ color: "red" }} size={24} />,
      },

    ]},

    {
      menu: "Application Overview",
      url: "/Overview",
      mainIcon: <BsNewspaper size={24} />,
      subMenu: [
        // {
        //   subMenus: "Your Solution",
        //   url: "/solution",
        //   icon: <BsNewspaper style={{ color: "red" }} size={24} />,
        // },
        {
          subMenus: "Implemented Solution",
          url: "/implemented",
          icon: <BsNewspaper style={{ color: "red" }} size={24} />,
        },

      ]},
  {
    menu: "Product",
    url: "/product",
    mainIcon: <FiList size={24} />,
    subMenu: [
      
      {
        subMenus: "Product Name",
        url: "/productname",
        icon: <IoIosOptions style={{ color: "red" }} size={24} />,
      },


      {
        subMenus: "Sub Product Details",
        url: "/productdetails",
        icon: <IoIosOptions style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Product Data",
        url: "/productdata",
        icon: <FiFileText style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Product Accordion",
        url: "/productdata2",
        icon: <FiFileText style={{ color: "red" }} size={24} />,
      },
    
   
   
      // {
      //   subMenus: "Accessories & Optional",
      //   url: "/optionsdata",
      //   icon: <IoIosOptions style={{ color: "red" }} size={24} />,
      // },
      // {
      //   subMenus: "Material Data",
      //   url: "/materialdata",
      //   icon: <RiFileListLine style={{ color: "red" }} size={24} />,
      // },
      // {
      //   subMenus: "Application Data",
      //   url: "/applicationdata",
      //   icon: <RiFileListLine style={{ color: "red" }} size={24} />,
      // },
    ],
  },

  {
    menu: "Contact Us",
    url: "/contactus",
    mainIcon: <MdOutlinePermContactCalendar size={24} />,
    subMenu: [
     
      {
        subMenus: "Contact Us",
        url: "/contactperson",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Distributer",
        url: "/distributer",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Contact",
        url: "/contact_form",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Feedback",
        url: "/feedback",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      // {
      //   subMenus: "Cv List",
      //   url: "/uploadcv",
      //   icon: <FiUploadCloud style={{ color: "red" }} size={24} />,
      // },
    ]},
   
  // {
  //   menu: "Contact Person Details",
  //   url: "/contactus",
  //   mainIcon: <MdOutlinePermContactCalendar size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "User Data List",
  //       url: "/carousalform",
  //       icon: <RiFileListLine style={{ color: "red" }} size={24} />,
  //     },
    
  //     {
  //       subMenus: "Subscriber List",
  //       url: "/subscribe",
  //       icon: <RiContactsBookLine style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  {
    menu: "Logout",
    url: "/logout",
    mainIcon: <MdLogout size={24} />,
    subMenu: [],
  },
];

// Sidebar Component
const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const { setTitle } = useContext(TitleContext);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubMenu, setActiveSubMenu] = useState("");

  // Close sidebar on clicking outside
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  // Close sidebar on window resize
  const handleResize = () => {
    if (window.innerWidth <= 1200) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle main menu click
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu); // Toggle active menu
    setActiveSubMenu(""); // Close any open sub menu when a main menu is clicked
    setTitle(menu); // Set the title context
  };

  // Handle sub menu click
  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu); // Set active sub menu
  };

  return (
    <nav ref={navbarRef} className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img className="w-75 m-2  " src={logo} alt="Logo" />
          {/* <span className="sidebar-brand-text text-danger">
            Bilz
          </span> */}
        </div>
        <Button
          variant="outline-danger"
          className="sidebar-close-btn"
          onClick={closeSidebar}
        >
          <MdOutlineClose size={24} />
        </Button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <MenuBar>
            <Menu>
              {SidebarMenu.map((item, id) => (
                <div key={id}>
                  {item.subMenu.length > 0 ? (
                    <SubMenu
                      className={`menu-link-text bg-white ${
                        activeMenu === item.menu ? "active" : ""
                      }`}
                      icon={item.mainIcon}
                      label={item.menu}
                      open={activeMenu === item.menu}
                      onClick={() => handleMenuClick(item.menu)}
                    >
                      {item.subMenu.map((subItem, subId) => (
                        <MenuItem
                          key={subId}
                          component={<Link to={subItem.url} />}
                          icon={subItem.icon}
                          className={`menu-link-text bg-white ${
                            activeSubMenu === subItem.subMenus ? "active" : ""
                          }`}
                          onClick={() => handleSubMenuClick(subItem.subMenus)}
                        >
                          {subItem.subMenus}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  ) : (
                    <MenuItem
                      icon={item.mainIcon}
                      className={`menu-link-text bg-white ${
                        activeMenu === item.menu ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMenuClick(item.menu);
                        closeSidebar(); // Close sidebar on menu item click
                      }}
                      component={<Link to={item.url} />}
                    >
                      {item.menu}
                    </MenuItem>
                  )}
                </div>
              ))}
            </Menu>
          </MenuBar>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;