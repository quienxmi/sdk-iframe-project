# SDK Iframe Project

This SDK simplifies the control of our embedded iframe. It is to be used in third-party websites and applications to request quotes from [Qxm - Quienxmi](https://www.quienxmi.com). To implement this module, you need both credentials provided by Qxm and a backend implementation to generate the necessary tokens to request a quote.

<br/>

## Installation

### Installation with NPM
Install the SDK using `npm`:
```sh
npm install @quienxmi/sdk-iframe-project
```
And invoke the SDK:
```javascript
import QxmIframeProject from "@quienxmi/sdk-iframe-project";
```

### Or installation with call script
Download the minified JS file from the `dist` folder in your project:
```sh
./dist/qxm-iframe-project.umd.js
```
Once it's in a public folder of your project, you can include it as follows:
```html
<script src="/js/qxm-iframe-project.umd.js"></script>
```

<br/>

## Basic Initialization

Place the `IFRAME` where the quote request will be inserted:
```html
<iframe id="iframeDom" height="500" width="100%"></iframe>
```

After calling the SDK, initialize the module as shown below. Make sure the DOM is preloaded before getting the IFRAME and then generate the `TOKEN` by connecting to your backend.

```javascript
const iframeProject = new QxmIframeProject("#iframeDom");

api.getTokenProject((token) => {
  iframeProject.setToken(token).then((decodedToken) => {
    console.log("Decoded Token:", decodedToken);
  });
});
```

<br/>

## Advanced Configuration

### Optional Settings

You can customize the behavior of the iframe using optional configurations when initializing the `QxmIframeProject`:

```javascript
const iframeProject = new QxmIframeProject("#iframeDom", {
    scrolling: false,  // Disable scrolling within the iframe
    resize: true,      // Enable automatic resizing of the iframe
    logs: true         // Enable logging for debugging purposes
});
```

### Event Subscriptions

You can subscribe to receive events and errors to handle them within your application:

```javascript
// Subscribe to iframe errors
iframeProject.subscribeError((error) => {
    console.log('Iframe error:', error);
});

// Subscribe to other iframe events
iframeProject.subscribeEvent((event) => {
    console.log('Iframe event:', event);
});
```

<br/>

## Configurations

### Iframe Configuration

```html
<iframe id="iframeDom" height="500" width="100%"></iframe>
```

You can use a class to add more styles to your iframe, such as padding or margin. When the module performs automatic resizing, it will take padding into account to avoid scrolling.

### Configuration Object

The configuration object for the `QxmIframeProject` can include the following options:

- `scrolling` (boolean): Enable or disable scrolling within the iframe.
- `resize` (boolean): Enable or disable automatic resizing of the iframe.
- `logs` (boolean): Enable or disable logging for debugging purposes.

### Methods

- `subscribe(type: SubscriptionTypes, callback: Function)`: Subscribe to specific events.
- `error(callback: Function)`: Subscribe to error events.
- `modals(callback: Function)`: Subscribe to modal events.
- `setToken(token: string)`: Set the token for authentication. Returns a promise that resolves with the decoded token.
- `destroy()`: Destroy the instance and clean up resources.

<br/>

## Full Example

Here's an example of a full implementation with optional settings and event subscriptions:

```javascript
const iframeProject = new QxmIframeProject("#iframeDom", {
    scrolling: false,
    resize: true,
    logs: true
});

iframeProject.subscribeError((error) => {
    console.log("Iframe error:", error);
    alert(error.message);
});

iframeProject.subscribeEvent((event) => {
    console.log("Iframe event:", event);
});

api.getTokenProject((token) => {
  iframeProject.setToken(token).then((decodedToken) => {
    console.log("Decoded token:", decodedToken);
  });
});
```

This setup ensures you have control over the iframe behavior and also makes sure you can handle events and errors efficiently.