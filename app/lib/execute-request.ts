import { HttpException, ValidationException, type FormatedResponse } from "~/api/app-fetch";
import handleActionRedirection from "./handle-action-redirection";
import handleNotFound from "./handle-not-found";

async function executeRequest<T>(request: () => Promise<Response>) {
    const formatedResponse: FormatedResponse<T> = {
        status: 200
    };

    try {
        const response = await request();
        formatedResponse.status = response.status;

        const json = await response.json();
        if (json.status) delete json.status;

        if (response.status >= 400) {
            // if backend wants to redirect the user
            if (response.status === 403 && json.action) {
                handleActionRedirection(json);
            } else if (response.status === 404) {
                handleNotFound();
            }
            formatedResponse.error = json;
        } else {
            formatedResponse.data = json as T;
        }
    } catch (e) {
        formatedResponse.error = e;
        formatedResponse.status = 500;
    }

    if (formatedResponse.error) {
        if (formatedResponse.error.errors && formatedResponse.status === 422) {
            throw new ValidationException(formatedResponse.error.errors, formatedResponse.status);
        } else {
            throw new HttpException(formatedResponse.status, formatedResponse.error);
        }
    }

    return formatedResponse;
}

export default executeRequest;