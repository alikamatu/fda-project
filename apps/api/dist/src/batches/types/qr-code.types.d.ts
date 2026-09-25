export interface QRCodeData {
    serialNumber: string;
    productId: string;
    batchId: string;
    productName: string;
    batchNumber: string | null;
    manufactureDate: string;
    expiryDate: string;
}
export interface BatchWithQR extends QRCodeData {
    qrCodeBase64: string;
}
