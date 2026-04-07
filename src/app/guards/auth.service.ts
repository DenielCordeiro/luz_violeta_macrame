import { Injectable } from '@angular/core';
import { BaseAPI } from '../interfaces/base-api.interface';
import { User } from '../interfaces/user.interface';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    http!: HttpClient;
    accessToken: string | null = null;

    constructor(httpClient: HttpClient) {
        this.http = httpClient;
    }

    public async checkSession(): Promise<void> {
        try {
            const userProfile = await lastValueFrom(
                this.http.post<User>(`${environment.api}/session/refresh`, {}, { withCredentials: true })
            );

            if (userProfile.token) {
                this.accessToken = userProfile.token;
            }
        } catch (err) {
            this.logout();
        }
    }

    public authUser(user: User): Promise<User> {
        return lastValueFrom(this.http.post<User>(`${environment.api}/session/`, user))
            .then(response => {
                const userProfile = this.handleResponse(response);

                if (userProfile && userProfile.token) {
                    this.accessToken = userProfile.token;

                    localStorage.setItem('session', JSON.stringify(userProfile));
                }

                return userProfile;
            });
    }

    public isAdministrator(): boolean {
        return false;
    }

    public logout(): Promise<void> {
        return lastValueFrom(this.http.post(`${environment.api}/session/logout`, {}, { withCredentials: true }))
            .then(() => {
                this.accessToken = null;
                localStorage.removeItem('session');
            });
    }

    public handleResponse(response: User) {
        if (response) {
            return response;
        } else {
            throw new Error("Api 200, mas success falso!");
        }
    }
}