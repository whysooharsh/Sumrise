import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout({ darkMode, setDarkMode }) {
  return (
    <main>
      <Header 
       
      />
      <Outlet />
    </main>
  );
} 