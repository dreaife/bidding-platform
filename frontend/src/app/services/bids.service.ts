import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BidsService {
  private apiUrl = `${environment.apiUrl}/bids`;

  constructor(private http: HttpClient) {}

  createBid(bid: any): Observable<any> {
    return this.http.post(this.apiUrl, bid);
  }

  getBidsByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/project/${projectId}`);
  }

  acceptBid(bidId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bidId}/accept`, { status: 'accepted' });
  }

  rejectBid(bidId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${bidId}/accept`, { status: 'rejected' });
  }

  getBidUserName(bidderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${bidderId}/name`);
  }
}
