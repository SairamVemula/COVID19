import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

const Materials = [MatButtonModule, MatInputModule];

@NgModule({
  imports: [Materials],
  exports: [Materials],
})
export class MaterialModule {}
