import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
  ];

  const mockProjects = [
    { id: 1, title: 'Project 1', description: 'Description 1' },
    { id: 2, title: 'Project 2', description: 'Description 2' }
  ];

  const mockBids = [
    { id: 1, project_id: 1, bidder_id: 1, amount: 1000 },
    { id: 2, project_id: 1, bidder_id: 2, amount: 2000 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Users Management', () => {
    it('should fetch all users', () => {
      service.getAllUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should update a user', () => {
      const updatedUser = { name: 'Updated Name' };
      service.updateUser(1, updatedUser).subscribe(response => {
        expect(response).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/users/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should delete a user', () => {
      service.deleteUser(1).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/users/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Projects Management', () => {
    it('should fetch all projects', () => {
      service.getAllProjects().subscribe(projects => {
        expect(projects).toEqual(mockProjects);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/projects`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects);
    });

    it('should update a project', () => {
      const updatedProject = { title: 'Updated Title' };
      service.updateProject(1, updatedProject).subscribe(response => {
        expect(response).toEqual(updatedProject);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/projects/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProject);
      req.flush(updatedProject);
    });

    it('should delete a project', () => {
      service.deleteProject(1).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/projects/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Bids Management', () => {
    it('should fetch all bids', () => {
      service.getAllBids().subscribe(bids => {
        expect(bids).toEqual(mockBids);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/bids`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBids);
    });

    it('should update a bid', () => {
      const updatedBid = { amount: 1500 };
      service.updateBid(1, updatedBid).subscribe(response => {
        expect(response).toEqual(updatedBid);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/bids/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedBid);
      req.flush(updatedBid);
    });

    it('should delete a bid', () => {
      service.deleteBid(1).subscribe(response => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/bids/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Error Handling', () => {
    it('should handle error when fetching users fails', () => {
      service.getAllUsers().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/admin/users`);
      req.flush('Error', { status: 404, statusText: 'Not Found' });
    });
  });
});
