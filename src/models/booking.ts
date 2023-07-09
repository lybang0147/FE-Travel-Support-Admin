
import Stay from "./stay";

export interface Booking {
  id: string;
  stay: Stay;
  checkinDate?: Date;
  checkoutDate?: Date;
  totalPrice?: number;
  totalPeople?: number;
  status?: number;
  [key: string]: any;
}
