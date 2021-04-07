import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  duration = 3000;
  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, IsError = false) {
    this._snackBar.open(message, null, {
      duration: this.duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: IsError ? 'snackbar-wrapper-error' : 'snackbar-wrapper-success'
    });
  }
}
