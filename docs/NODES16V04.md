# VIDEO 04 - Arquitectura Hexagonal y algunas mejoras

La arquitectura hexagonal, también conocida como "Ports and Adapters", fue propuesta por Alistair Cockburn y proporciona un modelo para diseñar un sistema de software de manera que aísle lo máximo posible el código de la aplicación (lógica de negocio) de cualquier tecnología específica (como base de datos, UI, frameworks, etc.), permitiendo que estas partes del sistema puedan ser fácilmente intercambiadas sin afectar el núcleo de la aplicación.

En el centro de la arquitectura hexagonal, está la lógica de negocio. Las tecnologías periféricas interactúan con la lógica de negocio a través de puertos. Estos puertos son una serie de interfaces que describen comportamientos que la aplicación necesita para funcionar.

Las adaptaciones son las implementaciones de estos puertos que interactúan con la tecnología específica, como una base de datos, una interfaz de usuario o un servicio externo.

![hexagonal-architecture-diagram.png](/docs/assets/hexagonal-architecture-diagram.png)

Este sería un ejemplo de cómo se puede aplicar la arquitectura hexagonal en el desarrollo de una API con Node.js, Express, Mongoose y TypeScript.

- Núcleo de la aplicación (Lógica de negocio o Domain): En el centro de todo, deberías tener tus entidades de dominio. Estas son las clases que representan los conceptos clave de tu sistema, como Usuarios, Productos, Pedidos, etc., y las reglas de negocio que los rodean. Estas clases no deben tener ninguna dependencia con la infraestructura.
- Puertos: Los puertos son interfaces que definen cómo se puede interactuar con tu sistema. Por ejemplo, podrías tener un puerto de "Usuario" que define métodos como crearUsuario, obtenerUsuario, actualizarUsuario, etc.
- Adaptadores: Los adaptadores son implementaciones específicas de estos puertos. Por ejemplo, podrías tener un adaptador de "Usuario" para Mongoose, que implemente los métodos definidos en el puerto de "Usuario" utilizando Mongoose para interactuar con MongoDB.
- API (Capa de infraestructura): Aquí es donde entra en juego Express. La API no debe contener ninguna lógica de negocio, sino simplemente tomar una solicitud HTTP, delegar el trabajo en la capa correspondiente y devolver una respuesta HTTP.
- Servicios de aplicación: Los servicios de aplicación orquestan la lógica de negocio y utilizan los puertos para interactuar con la infraestructura externa. Por ejemplo, un servicio de aplicación CrearUsuarioService podría tomar un objeto de solicitud de usuario, validar los datos, crear una nueva entidad de usuario y usar el puerto de usuario para persistir el usuario en la base de datos.

Con TypeScript, estas interfaces y clases pueden ser fuertemente tipadas, lo que proporciona un nivel adicional de seguridad y claridad a tu código.

La ventaja de este enfoque es que tu lógica de negocio está completamente aislada de tu infraestructura. Esto significa que podrías cambiar de MongoDB a SQL, o de Express a otra plataforma de servidor, con un impacto mínimo en tu código de lógica de negocio. También facilita enormemente la prueba de tu código, ya que puedes "simular" tus adaptadores para pruebas unitarias.

Recuerda que puedes encontrar en este repositorio todo el código que hemos visto durante la sesión:

<https://github.com/The-Valley-School/node-s16-test-architecture>

