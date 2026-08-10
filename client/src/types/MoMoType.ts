export interface MoMoRequestType {
  paymentMachineId: number;
}

export interface MoMoResponseType {
  resultCode: number;
  partnerCode: string;
  requestId: string;
  orderId: string;
  message: string;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  deeplinkMiniApp: string;
  signature: string;
  responseTime: number;
  amount: number;
  useFee: number;
  orderExpire: number;
}
