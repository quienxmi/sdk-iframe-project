import { Errors } from '@interfaces';

const errors: Errors = {
    SDK_CREATE: 'The SDK could not be found.',
    IFRAME_NOT_FOUND: 'The iframe could not be found.',
    DOM_NOT_IFRAME: 'You cannot build the iframe because the DOM is not an iframe.',
    INVALID_TOKEN: 'The token is expired or has an error. It is necessary to generate the token again.',
    INVALID_DOMAIN: 'The source domain is not supported.',
    ERROR_LOADING_IFRAME: 'The iframe could not be loaded correctly.'
}

export default errors;