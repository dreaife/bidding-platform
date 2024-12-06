import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectsService } from './projects.service';
import { environment } from '../environments/environment';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;

  const mockProject = {
    id: 1,
    title: 'Test Project',
    description: 'Test Description',
    budget: 1000,
    deadline: '2024-12-31',
    status: 'open'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });
    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Project Operations', () => {
    it('should get all projects', () => {
      service.getAllProjects().subscribe(projects => {
        expect(projects).toEqual([mockProject]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
      expect(req.request.method).toBe('GET');
      req.flush([mockProject]);
    });

    it('should get project by id', () => {
      service.getProjectById(1).subscribe(project => {
        expect(project).toEqual(mockProject);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProject);
    });

    it('should create project', () => {
      const newProject = {
        title: 'New Project',
        description: 'New Description',
        budget: 2000,
        deadline: '2024-12-31'
      };

      service.createProject(newProject).subscribe(response => {
        expect(response).toEqual(mockProject);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProject);
      req.flush(mockProject);
    });

    it('should get open projects', () => {
      service.getOpenProjects().subscribe(projects => {
        expect(projects).toEqual([mockProject]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects/open`);
      expect(req.request.method).toBe('GET');
      req.flush([mockProject]);
    });

    it('should close project', () => {
      service.closeProject(1).subscribe(response => {
        expect(response).toEqual({ ...mockProject, status: 'closed' });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects/1/complete`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({});
      req.flush({ ...mockProject, status: 'closed' });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors when getting projects', () => {
      service.getAllProjects().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP errors when creating project', () => {
      const newProject = {
        title: 'New Project',
        description: 'New Description'
      };

      service.createProject(newProject).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP errors when closing project', () => {
      service.closeProject(1).subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/projects/1/complete`);
      req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
    });
  });
});
