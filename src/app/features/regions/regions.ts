import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionService} from '../../core/services/region';
import {Router} from '@angular/router';

@Component({
  selector: 'app-regions',
  imports: [CommonModule],
  templateUrl: './regions.html',
  styleUrl: './regions.css',
})
export class Regions implements OnInit {
  regions: any[] = [];
  error: string | null = null;

  constructor(private regionService: RegionService, private router: Router) {
  }

  ngOnInit() {
    this.regionService.fetchRegions().subscribe({
      next: (data: any) => {
        this.regions = data.content;
        console.log('Regiones cargadas:', this.regions);
      },
      error: (err) => {
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        } else {
          this.error = 'An error ocurred';
        }
      }
    });
  }
}
