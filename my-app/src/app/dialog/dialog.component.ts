// dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  template: `
    <h2>{{ data.message }}</h2>
  `,
  styles: [
    `
      h2 {
        color: green;
      }
    `
  ]
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit() {
    // Close the dialog after 1000 milliseconds (1 second)
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }
}
