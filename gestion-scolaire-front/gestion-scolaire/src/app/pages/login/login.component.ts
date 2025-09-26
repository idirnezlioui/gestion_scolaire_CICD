import { CommonModule } from '@angular/common';
import { Component ,inject} from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validator, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb=inject(FormBuilder)
  auth=inject(AuthService)
  router=inject(Router)
  loading = false;
  showPassword = false;

  

  errorMessage=""

  loginForm=this.fb.group({
    mail:['',[Validators.required,Validators.email]],
    mot_pass:['',Validators.required]
  })

  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

  onSubmit() {
  if (this.loginForm.invalid) return;
  this.loading = true;
   const login: Login = {
      mail: this.loginForm.get('mail')?.value!,
      mot_pass: this.loginForm.get('mot_pass')?.value!
    };
  this.auth.login(login).subscribe({
    
    next:()=>{setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/students']); 
      }, 1000)},
    error:err=>{this.loading = false,
        this.errorMessage='Identifiants incorrects'}
  })
  

}



}


