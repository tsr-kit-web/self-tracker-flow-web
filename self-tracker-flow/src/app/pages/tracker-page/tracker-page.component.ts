import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stf-tracker-page',
  standalone: true,
  imports: [],
  templateUrl: './tracker-page.component.html',
  styleUrl: './tracker-page.component.scss'
})
export class TrackerPageComponent {
  @Input({ required: true }) user: any | null = null;
  
  constructor(
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];
  }

}
