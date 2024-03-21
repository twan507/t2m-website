export { }

declare global {

    interface IUsers {
        _id: string;
        email: string;
        password: number;
        name: string;
        phoneNumber: string;
        affiliateCode: string;
        license: string;
        role: string;
        createdAt: date;
        updatedAt: date;
        createdBy: {
            _id: string
            email: string
        }
        updatedBy: {
            _id: string
            email: string
        }
    }

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
        responseType?: any
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

}