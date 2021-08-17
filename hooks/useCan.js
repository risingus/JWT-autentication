import { useContext } from "react";
import {AuthContext} from '../contexts/AuthContext';
import { validateUserPermissions } from "../utils/validateUserPermissions";


export function useCan({roles, permissions}) {
  const {user, isAuthenticated} = useContext(AuthContext)


  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles
  })


  return userHasValidPermissions;
}