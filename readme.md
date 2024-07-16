# SDK Iframe Project

Este SDK simplifica el control de un iframe para solicitar presupuestos a través de Qxm incrustado en sitios web y aplicaciones de terceros. Para implementar este módulo, necesitas las credenciales proporcionadas por Qxm y la implementación en el backend para generar el token necesario para solicitar un presupuesto.

## Instalación

Instala el SDK utilizando `npm`:
```sh
npm install @quienxmi/sdk-iframe-project
```

Descarga el archivo minificado de JS de la carpeta `dist` en tu proyecto:
```sh
./dist/qxm-iframe-project.umd.js
```

Una vez que esté en una carpeta pública de tu proyecto, puedes incluirlo de la siguiente manera:
```html
<script src="/js/qxm-iframe-project.umd.js"></script>
```

## Inicialización básica

Coloca el `IFRAME` donde se insertará la solicitud de presupuesto:
```html
<iframe id="iframeDom" height="500" width="100%"></iframe>
```

Si estás utilizando `NPM`, puedes invocar el SDK de la siguiente manera:
```javascript
import QxmIframeProject from "@quienxmi/sdk-iframe-project";
```

Después de llamar al SDK, inicializa el módulo como se muestra a continuación. Asegúrate de que el `DOM` esté precargado para obtener el `IFRAME` y genera el `TOKEN` conectándote a tu backend.

```javascript
const iframeProject = new QxmIframeProject("#iframeDom");

api.getTokenProject((token) => {
  iframeProject.setToken(token).then((tokenDecoded) => {
    console.log("Token decodificado:", tokenDecoded);
  });
});
```

## Configuraciones

### Configuración del Iframe

```html
<iframe id="iframeDom" height="500" width="100%"></iframe>
```

Puedes usar una `class` para añadir más propiedades a tu iframe, como padding o margin. Cuando el módulo realiza el redimensionamiento automático, tomará el padding en cuenta para evitar el scroll.