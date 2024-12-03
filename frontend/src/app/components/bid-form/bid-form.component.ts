import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BidsService } from '../../services/bids.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-bid-form',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './bid-form.component.html',
  styleUrls: ['./bid-form.component.css']
})
export class BidFormComponent {
  @Input() projectId!: number;
  @Output() bidSubmitted = new EventEmitter<void>();
  
  bidForm: FormGroup;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private bidsService: BidsService
  ) {
    this.bidForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      message: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.bidForm.valid) {
      this.submitting = true;
      this.error = '';
      
      try {
        await this.bidsService.createBid({
          project_id: this.projectId,
          ...this.bidForm.value
        }).toPromise();
        
        this.bidForm.reset();
        this.bidSubmitted.emit();
      } catch (err) {
        this.error = '提交投标失败，请重试';
        console.error('投标提交错误:', err);
      } finally {
        this.submitting = false;
      }
    }
  }
}
