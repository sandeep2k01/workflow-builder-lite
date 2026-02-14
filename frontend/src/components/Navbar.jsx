import { NavLink } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand">
                    ⚡ Workflow Builder <span>Lite</span>
                </NavLink>
                <ul className="navbar-links">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                            Builder
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
                            History
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/status" className={({ isActive }) => isActive ? 'active' : ''}>
                            Status
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
