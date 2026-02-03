import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegionService} from '../../core/services/region.service';
import {Router} from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';

@Component({
  selector: 'app-regions',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './regions.html',
  styleUrl: './regions.css',
})
export class Regions implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<any>([]);
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  sortColumn: string = 'name';
  sortDirection: string = 'asc';
  error: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  regions: any[] = [];

  constructor(
    private regionService: RegionService,
    private router: Router) {
  }

  ngOnInit() {
    this.fetchRegions(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort: Sort) => this.handleSortEvent(sort));
  }

  fetchRegions(page: number, size: number, sortColumn: string, sortDirection: string) {
    console.log(`Llamada al servicio con página: ${page}, tamaño: ${size}, orden: ${sortColumn} ${sortDirection}`);

    this.regionService.fetchRegions(page, size, sortColumn, sortDirection).subscribe({
      next: (res: any) => {
        this.dataSource.data = res.content;
        this.totalElements = res.totalElements;
        this.totalPages = res.totalPages;
        this.currentPage = res.number;
        this.pageSize = res.size;

        setTimeout(() => {
          this.paginator.length = this.totalElements;
          this.paginator.pageIndex = this.currentPage;
          this.paginator.pageSize = this.pageSize;
        });
      },
      error: (err) => {
        console.error('Error al obtener datos: ', err);

        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        } else {
          this.error = 'Error al cargar las regiones';
        }
      },
    });
  }

  handleSortEvent(sort: Sort) {
    console.log(`Cambio de orden detectado: Ordenado por ${sort.active} (${sort.direction})`);
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction || 'asc';

    this.fetchRegions(this.currentPage, this.pageSize, this.sortColumn, this.sortDirection);
  }

  handlePageEvent(event: PageEvent) {
    console.log(`Cambio de página detectado: Página ${event.pageIndex}, Tamaño: ${event.pageSize}`);
    this.fetchRegions(event.pageIndex, event.pageSize, this.sortColumn, this.sortDirection);
  }
}
