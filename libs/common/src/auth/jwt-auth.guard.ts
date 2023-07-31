import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // extract jwt from the request
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    if (!jwt) {
      return false;
    }
    // send extracted jwt to the 'authenticate' auth controller route wherein it will be verified
    // on pipe, inject user in the request
    // on map, return true so canActivate will allow the request to proceed
    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError(() => of(false)), // return a new observable false
      );
  }
}
