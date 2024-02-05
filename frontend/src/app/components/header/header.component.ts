import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() isAuthenticated = false;
  currentState$: Observable<any> | undefined;
  title = 'Hired1st Test';
  userName = '';
  
  constructor(public route: ActivatedRoute, private router: Router) {
    this.userName = localStorage.getItem("name")!;
    this.isAuthenticated = localStorage.getItem("name")! != "" ? true : false;
  }

  ngOnInit() {
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(["login"]);
    this.isAuthenticated = false;
  }
}
