
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { lastValueFrom } from "rxjs";
import { AuthService } from "src/app/guards/auth.service";
import { BaseAPI } from "src/app/interfaces/base-api.interface";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { Address } from "src/app/interfaces/address.interface";
import { User } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment";
import { Inject } from "@angular/core";

export abstract class CrudUsersService<T extends BaseCrud> {
    authService = Inject(AuthService);
    http!: HttpClient;
    localStorage!: LocalStorageService;
    authedUser: boolean = false;
    route!: String;

    constructor(
        httpClient: HttpClient,
        localStorage: LocalStorageService,
        route: string,
    ) {
        this.http = httpClient;
        this.localStorage = localStorage;
        this.route = environment.api + route;
    }

    public buildHeader(): HttpHeaders {
        let userToken = JSON.stringify(localStorage.getItem('session'));
        let headers = new HttpHeaders({
            token: userToken,
        });

        return headers;
    }

    public authUser(user: User): Promise<User> {
        return lastValueFrom(this.http.post<BaseAPI<User>>(`${environment.api}/session/`, user))
            .then(user => {
                return this.handleResponse(user) as User;
            })
    }

    public isAdministrator(): boolean {
        let administrartor: string | null = localStorage.getItem('user');
        let profile: User | null = JSON.parse(administrartor || 'null');

        let isAdm: boolean = false;

        if (profile?.administrator !== null) {

            if (profile?.administrator === true) {
                isAdm = true;
            } else {
                isAdm = false;
            }
        } else {
            isAdm = false;
        }

        return isAdm;
    }

    public logout(): void {
        this.authService.logout();
    }

    public createUser(user: User): Promise<T> {
        return lastValueFrom(this.http.post<BaseAPI<T>>(`${this.route}`, user))
            .then(result => {
                return this.handleResponse(result) as unknown as T;
            });
    }

    public getProfile(user_id: number): Promise<T> {
        let header = this.buildHeader();

        return lastValueFrom(this.http.get<BaseAPI<T>>(`${this.route}/${user_id}`, { headers: header }))
            .then(result => {
                return this.handleResponse(result) as unknown as T;
            })
            .catch(error => {
                alert('Não foi possível retornar dados de seu perfil!')
                return error;
            })
    }

    public searchPostalCode(postalCode: number): Promise<Address> {
        return lastValueFrom(this.http.get<Address>(`${environment.viaCepAPI}/${postalCode}/json`))
            .then(result => {
                return result;
            })
            .catch(error => {
                alert('[ERRO]: não foi possível dados deste CEP')
                return error;
            })
    }

    public handleResponse(response: BaseAPI<User>) {
        if (response) {
            return response;
        } else {
            throw new Error("Api 200, mas success falso!");
        }
    }
}
