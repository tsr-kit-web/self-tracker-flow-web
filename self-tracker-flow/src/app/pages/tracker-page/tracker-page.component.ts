import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user';

@Component({
  selector: 'stf-tracker-page',
  standalone: true,
  imports: [],
  templateUrl: './tracker-page.component.html',
  styleUrl: './tracker-page.component.scss',
})
export class TrackerPageComponent implements OnInit {
  @Input({ required: true }) user: User | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];
  }
}
