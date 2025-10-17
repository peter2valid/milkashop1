import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b">
      <div className="container-pad py-3 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-primary-900">Milka’s Shop Juja</h1>
        <nav className="flex gap-3">
          <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive?"bg-primary-100 text-primary-800":"hover:bg-gray-100"}`} to="/">Home</NavLink>
          <NavLink className={({isActive})=>`px-3 py-2 rounded-md ${isActive?"bg-primary-100 text-primary-800":"hover:bg-gray-100"}`} to="/admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}


