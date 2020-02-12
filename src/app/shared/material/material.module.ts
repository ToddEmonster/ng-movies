import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card'; 
import {MatInputModule} from '@angular/material/input'; 
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'; 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MaterialModule { }
