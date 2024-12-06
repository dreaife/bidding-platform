import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectDetailComponent } from './project-detail.component';
import { ProjectsService } from '../../services/projects.service';
import { BidsService } from '../../services/bids.service';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let mockProjectsService: jest.Mocked<ProjectsService>;
  let mockBidsService: jest.Mocked<BidsService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockUsersService: jest.Mocked<UsersService>;

  const mockProject = {
    project_id: 1,
    title: '测试项目',
    description: '项目描述',
    budget_min: 1000,
    budget_max: 5000,
    deadline: new Date(),
    status: 'open'
  };

  const mockBids = [
    {
      bid_id: 1,
      bidder_id: 101,
      amount: 3000,
      message: '投标说明1',
      status: 'pending'
    },
    {
      bid_id: 2,
      bidder_id: 102,
      amount: 4000,
      message: '投标说明2',
      status: 'accepted'
    }
  ];

  beforeEach(async () => {
    mockProjectsService = {
      getProjectById: jest.fn(),
      closeProject: jest.fn()
    } as any;

    mockBidsService = {
      getBidsByProjectId: jest.fn(),
      getBidUserName: jest.fn(),
      acceptBid: jest.fn(),
      rejectBid: jest.fn()
    } as any;

    mockAuthService = {
      getUserRole: jest.fn()
    } as any;

    mockUsersService = {} as any;

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        { provide: ProjectsService, useValue: mockProjectsService },
        { provide: BidsService, useValue: mockBidsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compileComponents();

    mockAuthService.getUserRole.mockReturnValue('client');
    mockProjectsService.getProjectById.mockReturnValue(of(mockProject));
    mockBidsService.getBidsByProjectId.mockReturnValue(of(mockBids));
    mockBidsService.getBidUserName.mockReturnValue(of({ username: '测试用户' }));

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Project Loading', () => {
    it('should load project details on init', () => {
      fixture.detectChanges();
      expect(mockProjectsService.getProjectById).toHaveBeenCalledWith(1);
      expect(component.project).toEqual(mockProject);
      expect(component.loading).toBeFalsy();
    });

    it('should handle project loading error', () => {
      mockProjectsService.getProjectById.mockReturnValue(
        throwError(() => new Error('加载失败'))
      );
      
      fixture.detectChanges();
      expect(component.error).toBe('加载项目详情失败');
      expect(component.loading).toBeFalsy();
    });
  });

  describe('Bids Handling', () => {
    it('should load bids for project', () => {
      fixture.detectChanges();
      expect(mockBidsService.getBidsByProjectId).toHaveBeenCalledWith(1);
      expect(component.bids).toEqual(mockBids);
    });

    it('should load bidder names', () => {
      fixture.detectChanges();
      expect(mockBidsService.getBidUserName).toHaveBeenCalledWith(101);
      expect(mockBidsService.getBidUserName).toHaveBeenCalledWith(102);
    });

    it('should handle bid acceptance', () => {
      mockBidsService.acceptBid.mockReturnValue(of({}));
      mockProjectsService.closeProject.mockReturnValue(of({}));

      component.project = mockProject;
      component.acceptBid(1);

      expect(mockBidsService.acceptBid).toHaveBeenCalledWith(1);
      expect(mockProjectsService.closeProject).toHaveBeenCalledWith(1);
    });

    it('should handle bid rejection', () => {
      mockBidsService.rejectBid.mockReturnValue(of({}));

      component.project = mockProject;
      component.rejectBid(1);

      expect(mockBidsService.rejectBid).toHaveBeenCalledWith(1);
    });
  });

  describe('Sorting and Display', () => {
    it('should sort bids with accepted bids first', () => {
      component.bids = mockBids;
      const sortedBids = component.sortedBids;
      expect(sortedBids[0].status).toBe('accepted');
    });

    it('should return placeholder for unknown bidder', () => {
      const name = component.getBidderName(999);
      expect(name).toBe('加载中...');
    });
  });

  describe('Role-based Display', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(ProjectDetailComponent);
      component = fixture.componentInstance;
    });

    it('should show bid form for bidders', () => {
      mockAuthService.getUserRole.mockReturnValue('bidder');
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.userRole).toBe('bidder');
    });

    it('should show bid list for clients', () => {
      mockAuthService.getUserRole.mockReturnValue('client');
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.userRole).toBe('client');
    });
  });
});
