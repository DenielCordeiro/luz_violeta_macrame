
import { HttpClient } from "@angular/common/http";
import { LocalStorageService } from "ngx-webstorage";
import { lastValueFrom } from "rxjs";
import { BaseAPI } from "src/app/interfaces/base-api.interface";
import { BaseCrud } from "src/app/interfaces/base-crud.interface";
import { Address } from "src/app/interfaces/address.interface";
import { User } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment";

export abstract class CrudUsersService<T extends BaseCrud> {
    http!: HttpClient;
    localStorage!: LocalStorageService;
    userAdmin: boolean = false;
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

    public createUser(user: User): Promise<T> {
        return lastValueFrom(this.http.post<BaseAPI<T>>(`${this.route}`, user))
            .then(result => {
                return this.handleResponse(result) as unknown as T;
            });
    }

    public getProfile(user_id: number): Promise<T> {
        return lastValueFrom(this.http.get<BaseAPI<T>>(`${this.route}/${user_id}`))
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
    }

    public handleResponse(response: BaseAPI<User>) {
        if (response) {
            return response;
        } else {
            throw new Error("Api 200, mas success falso!");
        }
    }
}
