import queryString from 'query-string';

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {},
        responseType = 'json', // Thêm một tùy chọn mới để xác định kiểu phản hồi
    } = props;

    const options: any = {
        method: method,
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            // Sử dụng kiểu phản hồi dựa vào tùy chọn 'responseType'
            if (responseType === 'blob') {
                return res.blob() as Promise<T>; // Trả về dữ liệu nhị phân
            } else {
                return res.json() as Promise<T>; // Trả về JSON như mặc định
            }
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};
