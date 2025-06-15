import { useCallback, useEffect, useRef, useState } from "react";
import {
  BiChevronDown,
  BiDotsHorizontal,
  BiFirstPage,
  BiGrid,
  BiListCheck,
  BiTable,
  BiUser,
} from "react-icons/bi";
import { Link, useLocation } from "react-router";
import { NavItem } from "../../interfaces/pages/sidebar";
import { useSidebar } from "../../store/SidebarContext";
import { FaGroupArrowsRotate } from "react-icons/fa6";

const navItems: NavItem[] = [
  {
    icon: <BiGrid />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/" }],
  },
  {
    icon: <BiUser />,
    name: "Enfermeros",
    subItems: [
      { name: "Consulta", path: "/admin/register" },
      { name: "Calendario", path: "/admin/calendar" }

    ],
  },
  {
    icon: <FaGroupArrowsRotate />,
    name: "Grupos",
    path: "/admin/groups",
  },
  {
    icon: <BiUser />,
    name: "User Profile",
    path: "/profile",
  },
  {
    name: "Forms",
    icon: <BiListCheck />,
    subItems: [{ name: "Form Elements", path: "/form-elements" }],
  },
  {
    name: "Tables",
    icon: <BiTable />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables" }],
  },
  {
    name: "Pages",
    icon: <BiFirstPage />,
    subItems: [
      { name: "Blank Page", path: "/blank" },
      { name: "404 Error", path: "/error-404" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-1 p-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`w-full flex items-center group rounded-lg p-3 transition-colors duration-200 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-blue-50 dark:bg-[#162042] text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 dark:hover:bg-[#162042]"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-between"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "bg-blue-100 dark:bg-[#1E2B4D] text-blue-600 dark:text-[#6F8BF4]"
                      : "text-gray-500 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-[#1E2B4D]"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm font-medium dark:text-white">{nav.name}</span>
                )}
              </div>
              {(isExpanded || isHovered || isMobileOpen) && (
                <BiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-blue-500 dark:text-[#6F8BF4]"
                      : "text-gray-400"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`w-full flex items-center gap-3 rounded-lg p-3 transition-colors duration-200 ${
                  isActive(nav.path)
                    ? "bg-blue-50 dark:bg-[#162042] text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-[#162042]"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive(nav.path)
                      ? "bg-blue-100 dark:bg-[#1E2B4D] text-blue-600 dark:text-[#6F8BF4]"
                      : "text-gray-500 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-[#1E2B4D]"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm font-medium dark:text-white">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-11 py-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        isActive(subItem.path)
                          ? "bg-blue-100 text-blue-700 dark:bg-[#162042] font-medium"
                          : "text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-[#162042]"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center dark:text-white gap-1">
                        {subItem.new && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              isActive(subItem.path)
                                ? "bg-blue-200 text-blue-800"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              isActive(subItem.path)
                                ? "bg-purple-200 text-purple-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-(--color-dark-bg) text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200  dark:border-gray-800
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="" src={'logo'} alt="'Logo'" width={150} height={40} />
            </>
          ) : (
            <img src={'escudo'} alt="'Logo'" width={32} height={32} />
          )}
        </Link>
      </div>  
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <BiDotsHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              ></h2>
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? "footer" : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
