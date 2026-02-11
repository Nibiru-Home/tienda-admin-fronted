import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

// Local (comentado para entorno servidor):
// const API_BASE_URL = 'http://localhost:8080';

// Servidor (activo):
const API_BASE_URL = 'http://api.nibiruhome.store';

@Injectable({
    providedIn: 'root'
})
export class HTTPService {
    private readonly baseUrl = API_BASE_URL;

    constructor(private http: HttpClient) { }

    getAll<T>(route: string): Observable<T[]> {
        return this.http.get<T[]>(this.buildUrl(route))
    }

    get<T>(route: string): Observable<T> {
        return this.http.get<T>(this.buildUrl(route))
    }

    getById<T>(route: string): Observable<T> {
        return this.http.get<T>(this.buildUrl(route))
    }

    update<T>(route: string, newObject: T): Observable<T> {
        return this.http.put<T>(this.buildUrl(route), newObject)
    }

    deleteById<T>(route: string): Observable<T> {
        return this.http.delete<T>(this.buildUrl(route))
    }

    post<T>(route: string, body: any): Observable<T> {
        return this.http.post<T>(this.buildUrl(route), body)
    }

    private buildUrl(route: string): string {
        if (route.startsWith('http://') || route.startsWith('https://')) {
            return route;
        }

        if (route.startsWith('/')) {
            return `${this.baseUrl}${route}`;
        }

        return `${this.baseUrl}/${route}`;
    }
}
