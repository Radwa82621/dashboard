import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../../interfaces/user';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
})
export class LogInComponent implements OnInit {
  allUsers: User[] = [];
  allUserData: User = {};
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private messageService: MessageService,
    private _router: Router
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.allUsers = JSON.parse(localStorage.getItem('usersArray') || '[]');
    }

    console.log(this.allUsers);
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
      ),
    ]),
  });

  login(loginForm: FormGroup) {
    var userData = {
      email: loginForm.controls['email'].value,
      password: loginForm.controls['password'].value,
    };
    console.log(userData);

    // this.allUsers.map((el) => {
    //   if (el.email == userData.email) {
    //     console.log(`hello ${el.fName}`);
    //     if (el.password == userData.password) {
    //       console.log('correct data');
    //     } else {
    //       console.log('incorrect password');
    //     }
    //   } else {
    //     console.log("this email hasn't account");
    //   }
    // });
    const trueData: boolean = this.allUsers.some((user) => {
      user.email?.toLowerCase() == userData.email.toLowerCase();
    });
    if (!trueData) {
      this.allUsers.map((el) => {
        if (el.email?.toLowerCase() == userData.email.toLowerCase()) {
          this.allUserData = el;
        }
      });
    }
    if (this.allUserData.email == userData.email) {
      if (this.allUserData.password == userData.password) {
        this.show();

        localStorage.setItem('UserData', JSON.stringify(this.allUserData));
        this._router.navigate(['/home']);
      } else {
        this.showError('incorrect password');
      }
    } else {
      this.showError('incorrect email');
    }
  }

  show() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `welcome back` + ` ` + this.allUserData.fName,
    });
  }
  showError(error: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
    });
  }
}
