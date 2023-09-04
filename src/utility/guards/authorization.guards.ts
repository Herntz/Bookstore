import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, mixin } from "@nestjs/common";

export const AuthorizeGuard=(allowedRoles:string[])=>{
  class RolesGuardMixin implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      if (request?.currentUser && request.currentUser.roles) {
          const userRole = request.currentUser.roles; // Cette valeur est une enum, pas un tableau
          const hasPermission = allowedRoles.includes(userRole);
          if (hasPermission) return true;
      }
      
      throw new UnauthorizedException("You are not authorized to access this resource");
    
  }
}
const guard=mixin(RolesGuardMixin);
return guard
}
