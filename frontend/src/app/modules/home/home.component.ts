import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentState$: Observable<any> | undefined;
  title = 'Tic Tac Toe';
  public isAuthenticated: any;

  constructor(public route: ActivatedRoute, private router: Router){
    this.isAuthenticated = localStorage.getItem("name")! != "" ? true : false;
  }

  ngOnInit() {
    this.currentState$ = this.route.paramMap.pipe(
      map(() => window.history.state.productdetails.queryParams)
    );
  }
}
