import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BidFormComponent } from './bid-form.component';
import { BidsService } from '../../services/bids.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BidFormComponent', () => {
  let component: BidFormComponent;
  let fixture: ComponentFixture<BidFormComponent>;
  let bidsService: jest.Mocked<BidsService>;

  beforeEach(async () => {
    const bidsServiceMock = {
      createBid: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, BidFormComponent],
      providers: [
        { provide: BidsService, useValue: bidsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BidFormComponent);
    component = fixture.componentInstance;
    bidsService = TestBed.inject(BidsService) as jest.Mocked<BidsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation errors when form is invalid', () => {
    const amountInput = fixture.debugElement.query(By.css('input'));
    const messageInput = fixture.debugElement.query(By.css('textarea'));

    amountInput.nativeElement.value = '';
    messageInput.nativeElement.value = '';
    amountInput.nativeElement.dispatchEvent(new Event('input'));
    messageInput.nativeElement.dispatchEvent(new Event('input'));

    amountInput.nativeElement.dispatchEvent(new Event('blur'));
    messageInput.nativeElement.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const amountError = fixture.debugElement.query(By.css('.error-message'));
    expect(amountError).not.toBeNull();
    if (amountError) {
      expect(amountError.nativeElement.textContent).toContain('请输入有效的投标金额');
    }
  });

  it('should call createBid on form submit', async () => {
    bidsService.createBid.mockReturnValue(of({}));

    component.bidForm.setValue({ amount: 1000, message: 'Test message' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button'));
    submitButton.nativeElement.click();

    expect(bidsService.createBid).toHaveBeenCalledWith({
      project_id: component.projectId,
      amount: 1000,
      message: 'Test message'
    });
  });

  it('should display error message on submission failure', async () => {
    bidsService.createBid.mockReturnValue(throwError(() => new Error('Submission failed')));

    component.bidForm.setValue({ amount: 1000, message: 'Test message' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button'));
    submitButton.nativeElement.click();

    await fixture.whenStable();
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessage).not.toBeNull();
    if (errorMessage) {
      expect(errorMessage.nativeElement.textContent).toContain('提交投标失败，请重试');
    }
  });
});
