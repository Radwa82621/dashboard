import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { User } from '../../../interfaces/user';
import { ButtonModule } from 'primeng/button';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit, AfterViewInit {
  constructor(
    private _router: Router,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}
  ngAfterViewInit(): void {}

  users: User[] = [];
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('usersArray') != '') {
        this.users = JSON.parse(localStorage.getItem('usersArray') || '[]');
        // console.log(this.users, 'welcome');
      }
    }
    console.log(this.platformId);
  }

  customValidation: ValidatorFn = (
    registerForm: AbstractControl
  ): ValidationErrors | null => {
    const password = registerForm.get('password')?.value;
    const rePassword = registerForm.get('rePassword')?.value;

    if (password !== rePassword && rePassword) {
      return { notMatch: true };
    }

    return null; // Validation passed
  };

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ]),
    },
    { validators: this.customValidation }
  );

  register(registerForm: FormGroup) {
    // console.log(registerForm, this.users);

    var newUser: User = {
      name: registerForm.controls['name'].value,
      email: registerForm.controls['email'].value,
      password: registerForm.controls['password'].value,
      rePassword: registerForm.controls['rePassword'].value,
    };
    if (this.users.length == 0) {
      console.log('hello first user');

      this.users.push(newUser);
      // console.log(this.users);
      localStorage.setItem('usersArray', JSON.stringify(this.users));
      localStorage.setItem('Email', this.registerForm.get('email')?.value);
      this.show();

      this._router.navigate(['/complete-signUp']);
    } else {
      const userExist: boolean = this.users.some(
        (user) => user.email == newUser.email
      );
      console.log(userExist);
      if (!userExist) {
        console.log('hello');

        this.users.push(newUser);
        console.log(this.users);
        localStorage.setItem('usersArray', JSON.stringify(this.users));
        localStorage.setItem('Email', this.registerForm.get('email')?.value);
        this.show();
        this._router.navigate(['/complete-signUp']);
      } else {
        console.log('dublicated email');
        this.showError();
      }
    }
  }
  get Name(): any {
    return this.registerForm.get('name');
  }
  get email(): any {
    return this.registerForm.get('email');
  }
  get password(): any {
    return this.registerForm.get('password');
  }
  get rePassword(): any {
    return this.registerForm.get('rePassword');
  }

  show() {
    console.log('hi');

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'welcome to our family',
    });
  }
  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'duplicated email',
    });
  }
}
