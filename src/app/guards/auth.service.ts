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
            const response = await lastValueFrom(
                this.http.post<BaseAPI<any>>(`${environment.api}/session/refresh`, {}, { withCredentials: true })
            );

            if (response.token) {
                this.accessToken = response.token;
            }
        } catch (err) {
            this.logout();
        }
    }

    public authUser(user: User): Promise<User> {
        return lastValueFrom(this.http.post<BaseAPI<User>>(`${environment.api}/session/`, user))
            .then(response => {
                const data = this.handleResponse(response);

                if (data && data.token) {
                    this.accessToken = data.token;

                    // Opcional: Salve os dados básicos do usuário no localStorage para a UI
                    localStorage.setItem('session', JSON.stringify(data.user));
                }

                return data.user as User;
            })
    }

    public isAdministrator(): boolean {
        return false;
    }

    public logout(): void {
    }

    public handleResponse(response: BaseAPI<User>) {
        if (response) {
            return response;
        } else {
            throw new Error("Api 200, mas success falso!");
        }
    }
}