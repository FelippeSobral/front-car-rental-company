import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog'; // Importe o MatDialogModule
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule // Adicione o MatDialogModule aqui
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
