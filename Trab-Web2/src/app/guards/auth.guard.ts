import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const cargo = authService.getCargo();
  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!rolesPermitidos || rolesPermitidos.includes(cargo ?? '')) {
    return true;
  }

  if (cargo === 'C') {
    return router.createUrlTree(['/cliente/home']);
  }

  if (cargo === 'F') {
    return router.createUrlTree(['/funcionario/home']);
  }

  authService.logout();
  return router.createUrlTree(['/']);
};
