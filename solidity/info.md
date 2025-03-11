informacion importante sobre las funciones del contrato inteligente

---

submitTransaction:
Ingresa los parámetros necesarios (la dirección destino, el monto de USDT y datos opcionales) y haz clic en el botón correspondiente para proponer una transacción. Esto registrará la transacción en el contrato y emitirá un evento.

parametros a pasar

1. direccion del contrato a pagar en el primer espacio
2. valor a pagar recordemos que tiene seis decimales entonces 0.01 = 10000
3. 0x no se llama a ningun otro contrato

---

confirmTransaction:
Copia el índice de la transacción que acabas de proponer y, usando otra cuenta de las direcciones propietarias (puedes cambiar de cuenta en Remix si usas JavaScript VM o MetaMask si estás en Injected Web3), llama a la función confirmTransaction con ese índice para aprobar la transacción.

parametros a pasar ubicacion de la transaccion siendo 0 la primera transaccion

---

executeTransaction:
Una vez que la transacción tenga el número mínimo de confirmaciones (por ejemplo, 2), usa cualquier cuenta propietaria para llamar a executeTransaction y ejecutar el retiro de USDT. Se llamará a la función transfer del contrato del token, enviando los tokens al destinatario.

parametros a pasar ubicacion de la transaccion siendo 0 la primera transaccion
