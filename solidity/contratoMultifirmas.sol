// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interfaz básica para interactuar con el token USDT (ERC20)
interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
}

contract MultiSigWallet {
    // Arreglo con las direcciones de los propietarios
    address[] public owners;
    // Número mínimo de confirmaciones necesarias para ejecutar una transacción
    uint public required;
    // Instancia del token USDT
    IERC20 public token;

    // Estructura para almacenar la información de cada transacción propuesta
    struct Transaction {
        address to;            // Dirección destino
        uint value;            // Monto de USDT a enviar (en la unidad mínima del token)
        bytes data;            // Datos opcionales (para uso futuro)
        bool executed;         // Estado de ejecución de la transacción
        uint numConfirmations; // Número de confirmaciones recibidas
    }

    // Lista de todas las transacciones propuestas
    Transaction[] public transactions;
    // Mapeo para registrar si un propietario ya confirmó una transacción determinada
    mapping(uint => mapping(address => bool)) public isConfirmed;

    // Eventos para el registro de acciones importantes
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);

    // Constructor para inicializar propietarios, número mínimo de confirmaciones y la dirección del token USDT
    constructor(address[] memory _owners, uint _required, address _tokenAddress) {
        require(_owners.length > 0, "Se requieren propietarios");
        require(_required > 0 && _required <= _owners.length, "Numero de confirmaciones invalido");

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Direccion invalida");
            owners.push(owner);
        }
        required = _required;
        token = IERC20(_tokenAddress);
    }

    // Función para proponer una nueva transacción (retiro de USDT)
    function submitTransaction(address _to, uint _value, bytes memory _data) public {
        require(isOwner(msg.sender), "No eres propietario");

        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            numConfirmations: 0
        }));

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    // Función para confirmar (aprobar) una transacción propuesta
    function confirmTransaction(uint _txIndex) public {
        require(isOwner(msg.sender), "No eres propietario");
        require(_txIndex < transactions.length, "Transaccion inexistente");
        require(!isConfirmed[_txIndex][msg.sender], "Transaccion ya confirmada");

        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaccion ya ejecutada");

        isConfirmed[_txIndex][msg.sender] = true;
        transaction.numConfirmations += 1;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    // Función para ejecutar la transacción cuando se alcance el número mínimo de confirmaciones
    function executeTransaction(uint _txIndex) public {
        require(isOwner(msg.sender), "No eres propietario");
        require(_txIndex < transactions.length, "Transaccion inexistente");

        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaccion ya ejecutada");
        require(transaction.numConfirmations >= required, "No hay suficientes confirmaciones");

        transaction.executed = true;
        // Se ejecuta el retiro de USDT mediante la función transfer del contrato del token
        bool success = token.transfer(transaction.to, transaction.value);
        require(success, "Fallo en la ejecucion");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    // Función para revocar la confirmación de una transacción
    function revokeConfirmation(uint _txIndex) public {
        require(isOwner(msg.sender), "No eres propietario");
        require(_txIndex < transactions.length, "Transaccion inexistente");

        Transaction storage transaction = transactions[_txIndex];
        require(!transaction.executed, "Transaccion ya ejecutada");
        require(isConfirmed[_txIndex][msg.sender], "Transaccion no confirmada por ti");

        isConfirmed[_txIndex][msg.sender] = false;
        transaction.numConfirmations -= 1;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    // Función interna para verificar si una dirección es propietaria
    function isOwner(address _addr) internal view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == _addr) {
                return true;
            }
        }
        return false;
    }

    // Funciones auxiliares para consultar las transacciones
    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations)
    {
        Transaction storage transaction = transactions[_txIndex];
        return (transaction.to, transaction.value, transaction.data, transaction.executed, transaction.numConfirmations);
    }
}
