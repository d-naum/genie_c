export interface Request {
    id: number;
    userId: number;
    workerId?: number;
    status: boolean;
    serviceId: number;
    subServiceId: number;
    instructions: string;
    paymentStatus: number;
    issueId?: number;
    priorty?: number;
    date: string;
    time: string;
    units: number;
    address: string;
    addressType: string;
    photo?: string;
}