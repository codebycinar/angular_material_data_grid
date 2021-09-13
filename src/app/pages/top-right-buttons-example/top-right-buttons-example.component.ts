import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GridHeading } from 'angular-material-data-grid';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-top-right-buttons-example',
  templateUrl: './top-right-buttons-example.component.html',
  styleUrls: ['./top-right-buttons-example.component.scss']
})
export class TopRightButtonsExampleComponent {

  usage = {
    html: `
  <amdg-grid
      [headings]="headings"
      [url]="url"
      [selection]="true"
      [serverSidePagination]="true">
      <!--The content passed is only intended to be used on adding elements on the top right of the grid-->
      <button mat-raised-button class="amdg-top-right-button" (click)="singleButtonClicked()">Single Button</button>
      <button mat-raised-button class="amdg-top-right-button" [matMenuTriggerFor]="menu">Menu Button<mat-icon>expand_more</mat-icon></button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item class="amdg-mat-menu-item" (click)="itemClicked(1)">Item 1</button>
        <button mat-menu-item class="amdg-mat-menu-item" (click)="itemClicked(2)">Item 2</button>
      </mat-menu>
  </amdg-grid>`,
    ts: `
  /* POST endpoint URL */
  url = 'https://angular-grid.herokuapp.com/getUsers';

  /* Column configuration */
  headings: GridHeading[] = [
    {fieldName: 'id', display: 'ID', type: 'number', width: '100px', disableSorting: true, textAlign: 'right'},
    {fieldName: 'first_name', display: 'First Name', type: 'string', width: '120px', filterType: 'tag'},
    {fieldName: 'last_name', display: 'Last Name', type: 'string', width: '120px', filterType: 'tag'},
    {fieldName: 'email', display: 'Email', type: 'string', width: '180px'},
    {fieldName: 'gender', display: 'Gender', type: 'string', width: '100px',
      filterType: 'multi-select',
      other: {
        selectionMode: 'single',
        source: 'internal',
        optionsObject: [
          {text : 'Female', value: 'FEMALE'},
          {text : 'Male', value: 'MALE'}
        ]
      }
    }
  ];

  constructor(private snackBar: MatSnackBar) { }

  singleButtonClicked(): void {
    this.snackBar.open('Download Clicked!', 'Ok');
  }

  itemClicked(no): void {
    this.snackBar.open(\`Menu item #\${no} clicked\`, 'Ok');
  }
`};

  /* POST endpoint URL */
  url = `${environment.api}getUsers`;

  /* Original column configuration */
  headings: GridHeading[] = [
    {fieldName: 'id', display: 'ID', type: 'number', width: '100px', disableSorting: true, textAlign: 'right'},
    {fieldName: 'first_name', display: 'First Name', type: 'string', width: '120px', filterType: 'tag'},
    {fieldName: 'last_name', display: 'Last Name', type: 'string', width: '120px', filterType: 'tag'},
    {fieldName: 'email', display: 'Email', type: 'string', width: '180px'},
    {fieldName: 'gender', display: 'Gender', type: 'string', width: '100px',
      filterType: 'multi-select',
      other: {
        selectionMode: 'single',
        source: 'internal',
        optionsObject: [
          {text : 'Female', value: 'FEMALE'},
          {text : 'Male', value: 'MALE'}
        ]
      }
    }
  ];

  constructor(private snackBar: MatSnackBar) { }

  singleButtonClicked(): void {
    this.snackBar.open('Download Clicked!', 'Ok');
  }

  itemClicked(no): void {
    this.snackBar.open(`Menu item #${no} clicked`, 'Ok');
  }

  scrollBottom(): void {
    window.scrollTo(0, 1000);
  }

}