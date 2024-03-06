// upload-image.component.ts
import { Component } from '@angular/core';
import { ApiService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  selectedFile: File | null = null;
  extractedText: string | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (this.selectedFile) {
      this.apiService.processImage(this.selectedFile).subscribe(
        response => {
          console.log('Upload Image Response:', response);

          this.extractedText = response.text;

          // Open a dialog to inform the user about successful image upload
          this.dialog.open(DialogComponent, {
            data: { message: 'Image uploaded successfully!' }
          });
        },
        error => {
          console.error('Upload Image Error:', error);

          // Open a dialog to inform the user about the image upload failure
          this.dialog.open(DialogComponent, {
            data: { message: 'Image upload failed. Please try again.' }
          });
        }
      );
    } else {
      console.error('No file selected');
    }
  }
}
