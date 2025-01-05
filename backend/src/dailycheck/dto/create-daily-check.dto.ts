export class CreateDailyCheckDto {
    physicalHealth: number;  // 0 hoặc 1
    mentalHealth: number;    // 0 hoặc 1
    timestamp?: string;      // Trường thời gian với định dạng ngày tháng năm
}
  