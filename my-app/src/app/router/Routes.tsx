import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import Zone from "../../features/Zone/Zone";
import NewZone from "../../features/Zone/NewZone";
import Users from "../../features/account/Users";
import AccountingAccounts from "../../features/accountingAccounts/NewAccount";
import StatusAssets from "../../features/statusAssets/NewStatusAsset";
import Roles from "../../features/role/NewRole";
import ServiceLife from "../../features/ServiceLife/NewServiceLife"; //lista de Mh
import NewAsset from "../../features/NewAsset/newAsset";
import RegisterAssets from "../../features/NewAsset/registerAsset";
import AssetRetirement from "../../features/assetRetirement/assetRetirementFrm"; 
import AssetSales from "../../features/salesAssest/salesAssestFrm";
import Depreciation from "../../features/depreciations/NewDepreciations";
import Access from "../../features/Persons/NewPerson";
import ProtectedRoute from "./PrivateRoute";
import MapsRoute from "../../features/Maps/Map"
import History from "../../features/history/History";
import MapDetails from "../../features/Maps/MapDetails";
import AssetRetirementList from "../../features/assetRetirement/assetRetirement";
import AssetSalesList from "../../features/salesAssest/salesAssest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <Login /> },
      {
        element: <ProtectedRoute />,  // Protege estas rutas
        children: [
          { path: "RegisterAsset", element: <RegisterAssets /> },
          { path: "AssetSales", element: <AssetSales /> },
          { path: "AssetRetirement", element: <AssetRetirement /> },
          { path: "history", element: < History/>},
          { path: "Maps", element: <MapsRoute /> },
          { path: "Details/:id", element: < MapDetails/>},
          {
            element: <ProtectedRoute requiredProfile="administrador" />,  // Protege las rutas solo para "Maestro"
            children: [
              { path: "users", element: <Users /> },
              { path: "register", element: <Register /> },
              { path: "zonas", element: <Zone /> },
              { path: "nuevaZona", element: <NewZone /> },
              { path: "NewAccount", element: <AccountingAccounts /> },
              { path: "NewStatusAssets", element: <StatusAssets /> },
              { path: "NewRoles", element: <Roles /> },
              { path: "NewServiceLife", element: <ServiceLife /> },
              { path: "NewAsset", element: <NewAsset /> },
              { path: "AssetRetirement", element: <AssetRetirement /> },
              { path: "RetirementList", element: <AssetRetirementList />},
              { path: "AssetSales", element: <AssetSales /> },
              { path: "AssetSalesList", element: <AssetSalesList />},
              { path: "Depreciation", element: <Depreciation /> },
              { path: "Access", element: <Access /> },
              { path: "Maps", element: <MapsRoute /> },
              { path: "history", element: < History/>},
              { path: "Details/:id", element: < MapDetails/>},
            ],
          },
        ],
      },
    ],
  },
]);
/**
 * export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="login" replace />,
      },
      { path: "/", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "app",
        element: <HomePage />,
        children: [
          { path: "users", element: <Users /> },
          { path: "zonas", element: <Zone /> },
          { path: "nuevaZona", element: <NewZone /> },
          { path: "about", element: <AboutPage /> },
          { path: "NewAccount", element: <AccountingAccounts /> },
          { path: "NewStatusAssets", element: <StatusAssets /> },
          { path: "NewProfiles", element: <Profiles /> },
        ],
      },
    ],
  },
]);
 */
