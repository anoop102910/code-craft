import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="shadow-sm bg-[var(--smash-depth-1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-[var(--smash-depth-10)]">
              TaskFlow
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/problems" className="text-[var(--smash-depth-7)] hover:text-[var(--smash-depth-8)]">
              Problems
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-[var(--smash-depth-7)] hover:text-[var(--smash-depth-8)]">
                  Dashboard
                </Link>
                <button onClick={logout} className="text-[var(--smash-depth-7)] hover:text-[var(--smash-depth-8)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[var(--smash-depth-7)] hover:text-[var(--smash-depth-8)]">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[var(--primary)] text-[var(--smash-depth-10)] px-4 py-2 rounded-md hover:bg-[var(--primary-hover)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
