
export class AccelerationDto {
    x: number; 
    y: number;  
    z: number;  
  }
  
  export class Esp32Dto {
    temperature: number;       
    humidity: number;          
    heartRate: number;         
    acceleration: AccelerationDto;  
    timestamp: string; 
  }
  