// permissions.ts
import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";

export const ac = createAccessControl(defaultStatements);

export const roles = {
  admin: ac.newRole({ ...adminAc.statements }),
  parent: ac.newRole({ ...userAc.statements }),
  student: ac.newRole({ ...userAc.statements }),
  mentor: ac.newRole({ ...userAc.statements }), 
};