import React, { useContext, useEffect, lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./routes";
import { AuthContext } from "./context/AuthContextProvider";
import { useSelector } from "./redux/store";
import "./App.css";

const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const Navbar = lazy(() => import("./components/navbar"));
const Users = lazy(() => import("./components/users"));
const Packages = lazy(() => import("./components/packages"));
const CreatePackage = lazy(() => import("./components/packages/Create"));
const ViewPackage = lazy(() => import("./components/packages/View"));

const App = () => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  const user = useSelector((state) => state.auth.user);

  const routes = useRoutes([
    PublicRoute("/", <Login />),
    PublicRoute("/login", <Login />),
    PublicRoute("/register", <Register />),
    PrivateRoute("/users", <Users />, user, "admin"),
    PrivateRoute("/packages", <Packages />, user),
    PrivateRoute("/packages/:id", <ViewPackage />, user, "emp"),
    PrivateRoute("/packages/add", <CreatePackage />, user, "emp"),
    PrivateRoute("/home", <Home />, user),
    PublicRoute("*", <Login />),
  ]);

  return (
    <div>
      {!auth.loading && (
        <Suspense fallback={<>Loading...</>}>
          <Navbar />
          <div>{routes}</div>
        </Suspense>
      )}
    </div>
  );
};

export default App;
