import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BidsService } from './bids.service';
import { environment } from '../environments/environment';

describe('BidsService', () => {
  let service: BidsService;
  let httpMock: HttpTestingController;

  const mockBid = {
    id: 1,
    project_id: 1,
    bidder_id: 1,
    amount: 1000,
    proposal: 'Test Proposal',
    status: 'pending'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BidsService]
    });
    service = TestBed.inject(BidsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Bid Operations', () => {
    it('should create bid', () => {
      const newBid = {
        project_id: 1,
        amount: 1000,
        proposal: 'New Proposal'
      };

      service.createBid(newBid).subscribe(response => {
        expect(response).toEqual(mockBid);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBid);
      req.flush(mockBid);
    });

    it('should get bids by project id', () => {
      service.getBidsByProjectId(1).subscribe(bids => {
        expect(bids).toEqual([mockBid]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/project/1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockBid]);
    });

    it('should accept bid', () => {
      service.acceptBid(1).subscribe(response => {
        expect(response).toEqual({ ...mockBid, status: 'accepted' });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/1/accept`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: 'accepted' });
      req.flush({ ...mockBid, status: 'accepted' });
    });

    it('should reject bid', () => {
      service.rejectBid(1).subscribe(response => {
        expect(response).toEqual({ ...mockBid, status: 'rejected' });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/1/accept`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: 'rejected' });
      req.flush({ ...mockBid, status: 'rejected' });
    });

    it('should get bid user name', () => {
      const mockUserName = { name: 'John Doe' };
      service.getBidUserName(1).subscribe(response => {
        expect(response).toEqual(mockUserName);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/1/name`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserName);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors when creating bid', () => {
      const newBid = {
        project_id: 1,
        amount: 1000,
        proposal: 'New Proposal'
      };

      service.createBid(newBid).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP errors when accepting bid', () => {
      service.acceptBid(1).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/1/accept`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });

    it('should handle HTTP errors when getting bids', () => {
      service.getBidsByProjectId(1).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/bids/project/1`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
