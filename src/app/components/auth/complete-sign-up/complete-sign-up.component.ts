import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { User } from '../../../interfaces/user';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './complete-sign-up.component.html',
  styleUrl: './complete-sign-up.component.scss',
})
export class CompleteSignUpComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}
  allUserData = {};
  allUsers: User[] = [];
  index: number = 0;
  userEmail = '';
  oldUserData: User = {};
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userEmail = JSON.stringify(localStorage.getItem('Email'));

      this.allUsers = JSON.parse(localStorage.getItem('usersArray') || '[]');
    }

    this.oldUserData = this.allUsers[this.allUsers.length - 1];
  }
  completeRegisterForm: FormGroup = new FormGroup({
    fName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(8),
    ]),
    lName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(8),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/gm),
    ]),
    dateOfBirth: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    userPic: new FormControl(''),
  });

  onFileChange(event: any) {
    console.log(event);

    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        // Set the image value in the form
        this.completeRegisterForm.patchValue({
          userPic: reader.result,
        });
      };
    }
  }
  completeRegister() {
    var completeData: User = {
      fName: this.completeRegisterForm.controls['fName'].value,
      lName: this.completeRegisterForm.controls['lName'].value,
      phone: this.completeRegisterForm.controls['phone'].value,
      dateOfBirth: this.completeRegisterForm.controls['dateOfBirth'].value,
      gender: this.completeRegisterForm.controls['gender'].value,
      userPic: this.completeRegisterForm.controls['userPic'].value,
    };
    const image = this.completeRegisterForm.get('userPic')?.value;

    this.index = this.allUsers.length;

    this.allUserData = {
      ...this.allUsers[this.allUsers.length - 1],
      ...completeData,
    };
    this.allUsers.splice(this.allUsers.length - 1, 1, this.allUserData);
    this.show();
    localStorage.setItem('usersArray', JSON.stringify(this.allUsers));
    this._router.navigate(['/log-in']);
  }

  get fName(): any {
    return this.completeRegisterForm.get('fName');
  }
  get lName(): any {
    return this.completeRegisterForm.get('lName');
  }
  get phone(): any {
    return this.completeRegisterForm.get('phone');
  }
  get dateOfBirth(): any {
    return this.completeRegisterForm.get('dateOfBirth');
  }
  get gender(): any {
    return this.completeRegisterForm.get('gender');
  }
  show() {
    console.log('hi');

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'thanks! you completed your data',
    });
  }
}
