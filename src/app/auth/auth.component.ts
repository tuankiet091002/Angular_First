import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    isLoginMode = true;
    isLoading = false;
    error = '';
    @ViewChild(PlaceholderDirective, { static: false }) alertHost!: PlaceholderDirective;
    private closeSub!: Subscription;

    ngOnDestroy(): void {
        if (this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe({
            next: (resData) => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['/recipes']);
            },
            error: (error) => {
                this.error = error;
                this.showErrorAlert(error);
                this.isLoading = false;
            },
        });
        form.reset();
    }

    onHandleError() {
        this.error = '';
    }

    private showErrorAlert(message: string) {
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(AlertComponent);

        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.closeAlert.subscribe({next: () => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        }})
    }
}
