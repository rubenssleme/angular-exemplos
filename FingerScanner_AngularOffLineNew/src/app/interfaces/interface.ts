// Scanner
export interface ICrypto {
    hash: number;
    key: number;
    comm: number;
    pubkeyFile: string;
    prvkeyFile: string;
    prvkeyPass: string;
    additionalSettings: string;
}
export interface IResponse {
    statuscode: number;
    message: string;
}

export interface ISessionData {
    statuscode: number;
    message: string;
		ansol: string;
		hash: string;
}

export interface ISessionData2 {
    statuscode: number;
    message: string;
		data: string;
		dataSize: number;
		signature: string;
}

export interface ISensorID {
    sensorID: string;
}

export interface IReaderInfo {
    SPOOF_LEVEL: number;
}

export interface IKeyExchange {
    sensorID: string;
		slot: number;
		keyCryptogram: string;
}

export interface IEncryptedData {
		encryptedData : { data: string,
											dataSize: number,
											signature: string
		}
}

// Camera
export interface ICameraID {
    cameraID: string;
}

export interface ICameraOptions{
		info: string;
}

export interface ICameraInfo{
		cameraID: string;
		key: string;
}
