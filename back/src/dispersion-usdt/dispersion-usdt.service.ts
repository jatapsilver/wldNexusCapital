import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositHistory } from 'src/entities/depositHistory.entity';
import { DepositStatus } from 'src/enums/depositStatus/depositStatus.enum';
import { Repository } from 'typeorm';
import Web3 from 'web3';

const ERC20_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_bridge', type: 'address' },
      { internalType: 'address', name: '_remoteToken', type: 'address' },
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'string', name: '_symbol', type: 'string' },
      { internalType: 'uint8', name: '_decimals', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BRIDGE',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'REMOTE_TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bridge',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256',
      },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l1Token',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'l2Bridge',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'remoteToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: '_interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];

@Injectable()
export class DispersionUsdtService {
  private serializeBigInt(obj: any): any {
    if (typeof obj === 'bigint') {
      return obj.toString();
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.serializeBigInt(item));
    }
    if (obj !== null && typeof obj === 'object') {
      const newObj: Record<string, any> = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = this.serializeBigInt(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  }

  constructor(
    @InjectRepository(DepositHistory)
    private readonly depositHistoryRepository: Repository<DepositHistory>,
  ) {}

  @Cron('30 * * * *')
  async dispersionUsdt() {
    console.log('🚨 Iniciando Proceso de dispersion de USDT');
    const ordersDepositHistory = await this.depositHistoryRepository.find({
      where: { status: DepositStatus.PROCESSING },
      relations: ['user', 'user.credential'],
    });
    console.log(
      '🤖 Depositos en proceso encontrados:',
      ordersDepositHistory.length,
    );

    // si no hat ordenes en proceso, se imprime el mensajes y se finaliza la ejecucion
    if (ordersDepositHistory.length === 0) {
      console.log('📦 Todos los depositos estan completos');
      return;
    }

    for (const order of ordersDepositHistory) {
      const privateKey = order.user.credential.privateKey;
      const rpcUrl = process.env.WEB3_PROVIDER_URL;

      if (!rpcUrl) {
        throw new Error(
          'No se ha configurado el proveedor de Web3 (WEB3_PROVIDER_URL)',
        );
      }

      const web3 = new Web3(rpcUrl);
      const walletAccount = web3.eth.accounts.privateKeyToAccount(privateKey);

      const usdtTokenAddress = '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58';
      const usdtContract = new web3.eth.Contract(ERC20_ABI, usdtTokenAddress);
      try {
        async function sendGasToSubWallet(walletAccount, amountToSend) {
          const gasPrice = await web3.eth.getGasPrice();
          const gasLimit = 21000;
          const tx = {
            from: '0x725c242C12a1c6d18d560c1222DDd4f43997a10F', //esta billetera de los feed para las transacciones
            to: walletAccount.address,
            value: web3.utils.toWei(amountToSend, 'ether'),
            gas: gasLimit,
            gasPrice: gasPrice,
          };

          const signedTx = await web3.eth.accounts.signTransaction(
            tx,
            //llave privada de la billetera de feed
            '9c73f9ae921bdb67a15d01e850ff9cdad8c2c70b315d7d2f22c147e765abf1a9',
          );
          const receipt = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
          );
          return receipt;
        }
        const gasAmountToSend = '0.000002';
        await sendGasToSubWallet(walletAccount, gasAmountToSend);
        const balanceWei = await usdtContract.methods
          .balanceOf(walletAccount.address)
          .call();
        if (!balanceWei || Number(balanceWei) <= 0) {
          throw new Error(
            'El saldo en la subWallet es 0 o no se pudo obtener.',
          );
        }

        const balance = web3.utils.fromWei(balanceWei.toString(), 'ether');
        console.log('🔢 Saldo de eth en la wallet (Ether) :', balance);
        const totalAmount = parseFloat(web3.utils.toWei(balance, 'ether'));

        let amountContratoInteligente;
        let amountWalletNiyi;
        let amountWalletAlex;
        let amountWalletAndres;
        let amountWalletJavier;
        let amountWalletNidia;
        const walletContratoInteligente =
          '0x5327c78ce49403e1909ffe27d78e6e637e891966';
        const walletNiyi = '0xE6E05be8e4be1B3C411D1757251a2c6A293EF37E';
        const walletAlex = '0x27816A162ed3E6bD2d9327484f6A4B2ABa400E1A';
        const walletAndres = '0xb452658d4a6dCc747e4c7f80aB0C63eb029D6Ac4';
        const walletJavier = '0x0584F449ba6843CBFA174F2d64B954b65e4fDB3b';
        const walletNidia = '0x87c1DC3676361dF5a52b781B743008cbd52f059b';

        amountContratoInteligente = totalAmount * 0.5;
        amountWalletNiyi = totalAmount * 0.25;
        amountWalletAlex = totalAmount * 0.075;
        amountWalletAndres = totalAmount * 0.0625;
        amountWalletJavier = totalAmount * 0.0625;
        amountWalletNidia = totalAmount * 0.05;

        console.log(
          'Monto para el contrato Inteligente :',
          amountContratoInteligente,
        );
        console.log('Monto para la wallet de Niyi :', amountWalletNiyi);
        console.log('Monto para la wallet de Alex :', amountWalletAlex);
        console.log('Monto para la wallet de Andres :', amountWalletAndres);
        console.log('Monto para la wallet de Javier :', amountWalletJavier);
        console.log('Monto para la wallet de Nidia :', amountWalletNidia);

        const gasPrice = (await web3.eth.getGasPrice()).toString();
        console.log('Gas price', gasPrice);

        const gasLimit = await usdtContract.methods
          .transfer(walletContratoInteligente, amountContratoInteligente)
          .estimateGas({ from: walletAccount.address });

        const safeGasLimit = Math.floor(Number(gasLimit) * 2);
        const tx1 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletContratoInteligente, amountContratoInteligente)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx1 = await web3.eth.accounts.signTransaction(
          tx1,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx1.rawTransaction);
        console.log('Transaccion contrato inteligente realizada');

        const tx2 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletNiyi, amountWalletNiyi)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx2 = await web3.eth.accounts.signTransaction(
          tx2,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx2.rawTransaction);
        console.log('Transaccion wallet niyi realizada');

        const tx3 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletAlex, amountWalletAlex)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx3 = await web3.eth.accounts.signTransaction(
          tx3,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx3.rawTransaction);
        console.log('Transaccion wallet alex realizada');

        const tx4 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletAndres, amountWalletAndres)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx4 = await web3.eth.accounts.signTransaction(
          tx4,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx4.rawTransaction);
        console.log('Transaccion wallet andres realizada');

        const tx5 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletJavier, amountWalletJavier)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx5 = await web3.eth.accounts.signTransaction(
          tx5,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx5.rawTransaction);
        console.log('Transaccion wallet javier realizada');

        const tx6 = {
          from: walletAccount.address,
          to: usdtTokenAddress,
          data: usdtContract.methods
            .transfer(walletNidia, amountWalletNidia)
            .encodeABI(),
          gas: safeGasLimit.toString(),
          gasPrice: gasPrice,
        };

        const signedTx6 = await web3.eth.accounts.signTransaction(
          tx6,
          privateKey,
        );
        await web3.eth.sendSignedTransaction(signedTx6.rawTransaction);
        console.log('Transaccion wallet nidia realizada');

        order.status = DepositStatus.COMPLETED;
        await this.depositHistoryRepository.save(order);
      } catch (error) {
        console.error('❌ Error al dispersar USDT:', error);
        throw new Error('Error al dispersar USDT' + error.message);
      }
    }
  }
}
