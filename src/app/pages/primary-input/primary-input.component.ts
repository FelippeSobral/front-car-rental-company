import { Component , input, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss',
})

export class PrimaryInputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() inputName: string = '';
}
