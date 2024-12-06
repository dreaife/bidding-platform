import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService } from '../../services/admin.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let adminService: jest.Mocked<AdminService>;

  const mockUsers = [
    { user_id: 1, username: 'John Doe', email: 'john@example.com', role: 'admin' },
    { user_id: 2, username: 'Jane Doe', email: 'jane@example.com', role: 'client' }
  ];

  const mockProjects = [
    { project_id: 1, title: 'Project 1', budget_min: 100, budget_max: 200, status: 'open' },
    { project_id: 2, title: 'Project 2', budget_min: 200, budget_max: 300, status: 'in_progress' }
  ];

  const mockBids = [
    { bid_id: 1, project_id: 1, bidder_id: 1, amount: 150, status: 'pending' },
    { bid_id: 2, project_id: 2, bidder_id: 2, amount: 250, status: 'accepted' }
  ];

  beforeEach(async () => {
    const adminServiceMock = {
      getAllUsers: jest.fn().mockReturnValue(of(mockUsers)),
      getAllProjects: jest.fn().mockReturnValue(of(mockProjects)),
      getAllBids: jest.fn().mockReturnValue(of(mockBids)),
      updateUser: jest.fn(),
      updateProject: jest.fn(),
      updateBid: jest.fn(),
      deleteUser: jest.fn().mockReturnValue(of({})),
      deleteProject: jest.fn(),
      deleteBid: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AdminDashboardComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    adminService = TestBed.inject(AdminService) as jest.Mocked<AdminService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all users on init', () => {
    expect(component.users).toEqual(mockUsers);
    expect(adminService.getAllUsers).toHaveBeenCalled();
  });

  it('should load all projects on init', () => {
    expect(component.projects).toEqual(mockProjects);
    expect(adminService.getAllProjects).toHaveBeenCalled();
  });
  it('should load all bids on init', () => {
    expect(component.bids).toEqual(mockBids);
    expect(adminService.getAllBids).toHaveBeenCalled();
  });

  it('should edit a user', () => {
    component.editUser(mockUsers[0]);
    expect(component.editingUser).toEqual(mockUsers[0]);
  });

  it('should save a user', () => {
    const updatedUser = { ...mockUsers[0], username: 'Updated Name' };
    adminService.updateUser.mockReturnValue(of(updatedUser));

    component.editUser(mockUsers[0]);
    component.editingUser.username = 'Updated Name';
    component.saveUser();

    expect(adminService.updateUser).toHaveBeenCalledWith(mockUsers[0].user_id, updatedUser);
    expect(component.editingUser).toBeNull();
  });

  it('should delete a user after confirmation', () => {
    // 模拟 window.confirm 返回 true
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteUser(mockUsers[0].user_id);
    expect(adminService.deleteUser).toHaveBeenCalledWith(mockUsers[0].user_id);
  });

  it('should not delete a user if confirmation is cancelled', () => {
    // 模拟 window.confirm 返回 false
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteUser(mockUsers[0].user_id);
    expect(adminService.deleteUser).not.toHaveBeenCalled();
  });

});
