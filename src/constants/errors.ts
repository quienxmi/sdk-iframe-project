import { Errors } from '../interfaces/index';

const errors: Errors = {
    SDK_CREATE: 'The SDK could not be found.',
    IFRAME_NOT_FOUND: 'The specified iframe could not be found.',
    EXPIRED_TOKEN: 'Your token has expired. Please generate a new one.',
    DOM_NOT_IFRAME: 'Cannot build the iframe as the DOM element is not an iframe.',
    INVALID_TOKEN: 'The token is invalid or has expired. Please generate a new token.',
    INVALID_ORIGIN: 'The origin of the source is not supported.',
    INVALID_DOMAIN: 'The domain of the source is not supported.',
    ERROR_LOADING_IFRAME: 'Failed to load the iframe correctly.'
};

export default errors;