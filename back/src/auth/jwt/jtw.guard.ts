import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class JWTAuthGuard  extends AuthGuard('jwt'){
    constructor() {
        super();
      }

      // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      //   const request = context.switchToHttp().getRequest();
      //   const response = context.switchToHttp().getResponse();
      //   const token = request.cookies ? request.cookies["access_token"] : undefined
      //   if(!token){
      //     response.status(200).redirect("http://localhost:8000/login")
      //     return false
      //   }
      //   return true;
      // }

}