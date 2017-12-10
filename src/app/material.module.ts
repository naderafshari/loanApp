import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatOptionModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
    ]
  })
  export class MaterialModule {}
