import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Renderer2,
} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiResponseModel } from './api-response.model';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterContentInit{

  headings: any = [ {fieldName: 'uid', display: 'ID', type: 'number', minWidth: '160px', maxWidth: '160px', width: '12.25%', filter: true,
    disableSorting: true},
    {fieldName: 'first_name', display: 'First Name', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'email', display: 'Email', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'gender', display: 'Gender', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%',
      filterType: 'multi-select',
      other: {
        selectionMode: 'single',
        source: 'internal',
        url: 'gender',
        optionsObject: [
          {text : 'Female', value: 'FEMALE'},
          {text : 'Male', value: 'MALE'}
        ],
        stringList: true
      }
    },
    {fieldName: 'date_of_birth', display: 'Date Of Birth', type: 'date', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'ip_address', display: 'IP Address', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'car', display: 'Car', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'phone', display: 'Phone', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%'},
    {fieldName: 'movie_taste', display: 'Movie Taste', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'country', display: 'Country', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%',
      filterType: 'multi-select',  show: true,
      other: {
        selectionMode: 'multiple',
        source: 'external',
        url: `${environment.api}countries`,
        key: 'displayName',
        value: 'value',
        stringList: true
      }
    },
    {fieldName: 'city', display: 'City', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'company', display: 'Company', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'iban', display: 'Iban', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'latitude', display: 'Latitude', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'longitude', display: 'Longitude', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'currency', display: 'Currency', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'username', display: 'Username', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'profession', display: 'Profession', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
    {fieldName: 'state', display: 'State', type: 'string', minWidth: '160px', maxWidth: '160px', width: '12.25%', show: false},
  ];
  selection = true;
  allGridItemsSelected = false;
  loadingData = true;
  response = { gridData: [], totalCount: 0};
  recordsPerPage = 0;
  columnControl = true;
  selectionStarted = false;
  selectionTimeoutHandler: any;
  allCheckBoxesSelected = false;
  selectedRows = [];
  gridWidth = null;
  offsetTop = null;
  scrollRemainingDistanceToLeft = 0;
  scrollRemainingDistanceToRight = null;
  currentPage = 1;
  sortObj = {
    sort: null,
    sortField: null
  };
  filters = [];

  // Window resize listener
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.calculateGridWidth();
  }

  constructor(private http: HttpClient,
              private changeDetectorRef: ChangeDetectorRef,
              private renderer: Renderer2,
              public dialog: MatDialog) {
  }

  ngAfterContentInit(): void {
    this.calculateGridWidth();
  }

  private calculateGridWidth(): void {
    const gridContainer = document.getElementById('grid-container');
    this.gridWidth = gridContainer.clientWidth;
    const heightOfHeaderAndFooter = 112;
    const extraSpace = 25;
    let totalOffset = gridContainer.offsetTop + heightOfHeaderAndFooter + extraSpace;
    if (this.columnControl) {
      totalOffset += 24; // heightOfColumnControlBtn
    }
    this.offsetTop = totalOffset;
  }

  scrollLeft(): void {
    const scrollLeft = document.getElementById('scrollViewport').scrollLeft;
    document.getElementById('scrollViewport').scrollLeft = scrollLeft - this.gridWidth * 80 / 100;
  }

  scrollRight(): void {
    const scrollLeft = document.getElementById('scrollViewport').scrollLeft;
    document.getElementById('scrollViewport').scrollLeft = this.gridWidth * 80 / 100 + scrollLeft;
  }

  scrollChanged(ev?): void {
    let elem = null;
    if (ev) {
      elem = ev.target;
    } else {
      elem = document.getElementById('scrollViewport') as HTMLElement;
    }
    this.scrollRemainingDistanceToLeft = elem.scrollLeft;
    this.scrollRemainingDistanceToRight = elem.scrollWidth - elem.scrollLeft - this.gridWidth;
  }

  updateColumns(): void {
    this.headings = [...this.headings]; // to run change detection in the virtual scroll need to reassign a fresh copy
    setTimeout(() => {
      this.scrollChanged(); // this is done to recalculate scrollRemainingDistanceToLeft & scrollRemainingDistanceToRight
                            // values which helps to show the auto scroll navigate buttons
      this.changeDetectorRef.detectChanges();
    }, 100);
  }

  columnDrop(ev): void {
    moveItemInArray(this.headings, ev.previousIndex, ev.currentIndex);
    this.updateColumns();
  }

  sort(ev): void {
    let index = null;
    this.headings.forEach((heading: any, i) => {
      if (heading.fieldName === ev.fieldName) {
        index = i;
      } else {
        heading.sort = null;
      }
    });
    const sortObj = {
      sort: this.headings[index]?.sort,
      sortField: this.headings[index]?.sort ? this.headings[index]?.fieldName : null
    };
    this.sortObj = sortObj;
    this.pageChanged({pageNo: 1, recordsPerPage: this.recordsPerPage});
  }

  filter(ev): void {
    let filterIndex = null;
    this.filters.forEach((filter, i) => {
      if (filter.field === ev.field) {
        filterIndex = i;
      }
    });
    if (filterIndex !== null) {
      if (ev.value) {
        this.filters[filterIndex] = ev;
      } else {
        this.filters.splice(filterIndex, 1);
      }
    } else {
      this.filters.push(ev);
    }
    this.pageChanged({pageNo: 1, recordsPerPage: this.recordsPerPage});
  }

  allGridItemsSelectionChanged(): void {
    this.selectedRows = [];
    this.response.gridData.forEach(item => {
      item.gridItemSelected = this.allGridItemsSelected;
      if (item.gridItemSelected) {
        this.selectedRows.push(item);
      }
    });
  }

  gridItemSelectionChanged(): void {
    this.selectedRows = [];
    this.response.gridData.forEach(item => {
      if (item.gridItemSelected) {
        this.selectedRows.push(item);
      }
    });
  }

  // Multiple Selection logic
  startSelect(item, element): void {
    this.selectionTimeoutHandler = setTimeout(() => {
      this.renderer.addClass(element, 'pulse');
      this.selectionStarted = true;
      item.gridItemSelected = true;
      this.selectionTimeoutHandler = null;

      setTimeout(() => {
        this.renderer.removeClass(element, 'pulse');
      }, 1000);
    }, 350);
  }

  endSelect(): void {
    clearInterval(this.selectionTimeoutHandler);
    if (this.selectionStarted) {
      this.selectionStarted = false;
      window.document.getSelection().removeAllRanges();
    }
  }

  overSelect($event, item): void {
    if (this.selectionStarted) {
      item.gridItemSelected = true;
      this.getSelection();
    }
  }

  getSelection(): void {
    this.selectedRows = [];
    this.allCheckBoxesSelected = true;
    for (let i = 0, len = this.response.gridData.length; i < len; i++) {
      if (this.response.gridData[i].gridItemSelected === true) {
        this.selectedRows.push(this.response.gridData[i]);
      } else {
        this.allCheckBoxesSelected = false;
      }
    }
    // this.selectionEmit.emit(this.selectedRows);
    // this.selectAllState = false;
  }

  // page change event
  pageChanged({pageNo, recordsPerPage, sort = null, sortField = null}): void {
    this.recordsPerPage = recordsPerPage;
    this.loadingData = true;
    this.currentPage = pageNo;
    const url = `${environment.api}getUsers`;
    // const url = './assets/data.json';
    const body = {
      entity: {},
      page: this.currentPage,
      perPage: recordsPerPage,
      filters: this.filters,
      ...this.sortObj
    };
    console.log(body);

    this.http.post<ApiResponseModel>(url, body).subscribe(data => {
    // this.http.get<ApiResponseModel>(url).subscribe(data => {
      this.selectedRows = [];
      this.response = data.payload;
      console.log(this.response.gridData);
      this.loadingData = false;
      this.changeDetectorRef.detectChanges();
      document.getElementById('scrollViewport').scrollTop = 0;
    });
  }
}
