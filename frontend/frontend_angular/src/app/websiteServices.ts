import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsiteServices {
 
  submitData(email: string, password: string) : void{
    console.log(`Data sent: email: ${email}, password:${password}`);
  }

  submitData1(firstname:string, lastname:string, email: string, password: string) : void{
    console.log(`Data sent:firstname:${firstname}, lastname:${lastname}, email: ${email}, password:${password}`);
  }

  submitData2(firstname:string, lastname:string, email: string, message: string) : void{
    console.log(`Data sent:firstname:${firstname}, lastname:${lastname}, email: ${email}, message:${message}`);
  }

}
