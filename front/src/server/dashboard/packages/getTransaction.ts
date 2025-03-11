interface TransactionListParams {
  module: string;
  action: string;
  contractaddress: string;
  address: string;
  startblock: string;
  endblock: string;
  page: string;
  offset: string;
  sort: string;
  apikey: string | undefined;
}

interface TransactionListResponse {
  status: string;
  message: string;
  result: Array<{
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
  }>;
}

const OP_API_URL = "https://api-optimistic.etherscan.io/api";
const API_KEY_OP = process.env.NEXT_PUBLIC_API_KEY_OP;

export const getTransactionList = async (
  address: string
): Promise<TransactionListResponse> => {
  const params: TransactionListParams = {
    module: "account",
    action: "tokentx",
    contractaddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    address: address,
    page: "1",
    offset: "100",
    startblock: "0",
    endblock: "latest",
    sort: "desc",
    apikey: API_KEY_OP,
  };

  const url = `${OP_API_URL}?${new URLSearchParams(
    params as unknown as Record<string, string>
  ).toString()}`;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      throw new Error("Error al obtener la lista de transacciones");
    }

    const data: TransactionListResponse = await res.json();

    // Filtrar solo las transacciones entrantes (donde el campo "to" coincide con la dirección consultada)
    data.result = data.result.filter(
      (tx) => tx.to.toLowerCase() === address.toLowerCase()
    );

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error en getTransactionList:", (error as Error).message);
    throw error;
  }
};
