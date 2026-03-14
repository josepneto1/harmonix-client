import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  refresh = signal(0);

  triggerRefresh(): void {
    this.refresh.set(this.refresh() + 1);
  }
}
