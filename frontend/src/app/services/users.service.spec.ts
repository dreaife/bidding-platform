import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { environment } from '../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  const mockUser = {
    user_id: 1,
    username: 'John Doe',
    email: 'john@example.com',
    role: 'bidder'
  };

  const mockProjects = [
    { id: 1, title: 'Project 1', description: 'Description 1' },
    { id: 2, title: 'Project 2', description: 'Description 2' }
  ];

  const mockBids = [
    { id: 1, project_id: 1, amount: 1000, proposal: 'Proposal 1' },
    { id: 2, project_id: 2, amount: 2000, proposal: 'Proposal 2' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Basic CRUD Operations', () => {
    it('should get all users', () => {
      service.getUsers().subscribe((users: any) => {
        expect(users).toEqual([mockUser]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush([mockUser]);
    });

    it('should get user by id', () => {
      service.getUserById(1).subscribe((user: any) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should create user', () => {
      const newUser = { username: 'New User', email: 'new@example.com' };
      service.createUser(newUser).subscribe((response: any) => {
        expect(response).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(mockUser);
    });

    it('should update user', () => {
      const updatedData = { username: 'Updated Name' };
      service.updateUser(1, updatedData).subscribe((response: any) => {
        expect(response).toEqual({ ...mockUser, ...updatedData });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedData);
      req.flush({ ...mockUser, ...updatedData });
    });

    it('should delete user', () => {
      service.deleteUser(1).subscribe((response: any) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Profile Operations', () => {
    it('should get current user', () => {
      service.getCurrentUser(1).subscribe(response => {
        expect(response).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/profile`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 1 });
      req.flush(mockUser);
    });

    it('should get user projects', () => {
      service.getUserProjects(1).subscribe(response => {
        expect(response).toEqual(mockProjects);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/profile/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 1 });
      req.flush(mockProjects);
    });

    it('should get user bids', () => {
      service.getUserBids(1).subscribe(response => {
        expect(response).toEqual(mockBids);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/profile/bids`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 1 });
      req.flush(mockBids);
    });

    it('should update profile', () => {
      const updatedProfile = { username: 'Updated Profile' };
      service.updateProfile(1, updatedProfile).subscribe(response => {
        expect(response).toEqual({ ...mockUser, ...updatedProfile });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/profile?userId=1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProfile);
      req.flush({ ...mockUser, ...updatedProfile });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors', () => {
      service.getUsers().subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
